import { lstatSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = join(repoRoot, "agents", "skills");
const forbiddenPatterns = [
  ["legacy plugin skill name", /\bhypt:[a-z-]+\b/],
  ["legacy plugin source path", /(?:^|[^\w])plugin\/(?:commands|skills|templates)\//],
  ["generated Codex source path", /\.codex\/skills\//],
  ["Claude marketplace path", /~\/\.claude\/plugins\/marketplaces\/hypt-builder/],
  ["generated-file banner", /Generated from plugin\//],
];

const failures = [];
const names = new Map();
const skillDirectories = readdirSync(skillsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => join(skillsRoot, entry.name))
  .sort();

for (const skillDirectory of skillDirectories) {
  const skillPath = join(skillDirectory, "SKILL.md");
  let source;

  try {
    if (!lstatSync(skillPath).isFile()) {
      failures.push(`${relativePath(skillPath)} is not a regular file`);
      continue;
    }
    source = readFileSync(skillPath, "utf8");
  } catch {
    failures.push(`${relativePath(skillDirectory)} is missing SKILL.md`);
    continue;
  }

  const frontmatter = source.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!frontmatter) {
    failures.push(`${relativePath(skillPath)} has no YAML frontmatter`);
    continue;
  }

  const name = scalar(frontmatter[1], "name");
  const description = scalar(frontmatter[1], "description");
  const directoryName = basename(skillDirectory);

  if (!name) {
    failures.push(`${relativePath(skillPath)} is missing name`);
  } else {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || name.length > 64) {
      failures.push(`${relativePath(skillPath)} has invalid name: ${name}`);
    }
    if (name !== directoryName) {
      failures.push(`${relativePath(skillPath)} name must match directory: ${directoryName}`);
    }
    if (names.has(name)) {
      failures.push(`${relativePath(skillPath)} duplicates ${relativePath(names.get(name))}`);
    } else {
      names.set(name, skillPath);
    }
  }

  if (!description || description.length > 1024) {
    failures.push(`${relativePath(skillPath)} needs a 1-1024 character description`);
  }

  for (const [label, pattern] of forbiddenPatterns) {
    if (pattern.test(source)) {
      failures.push(`${relativePath(skillPath)} contains ${label}`);
    }
  }
}

if (skillDirectories.length === 0) {
  failures.push("agents/skills contains no skills");
}

if (failures.length) {
  console.error("Agent skill validation failed:\n");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Validated ${skillDirectories.length} agent skills.`);

function scalar(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
  if (!match) {
    return "";
  }
  return match[1].trim().replace(/^(["'])(.*)\1$/, "$2");
}

function relativePath(path) {
  return path.slice(repoRoot.length + 1);
}
