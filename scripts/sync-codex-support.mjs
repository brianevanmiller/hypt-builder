import {
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const generatedCommand = "node scripts/sync-codex-support.mjs";

const SKILLS = [
  {
    sourcePath: "plugin/skills/hypt/SKILL.md",
    targetName: "hypt",
    aliases: ["/hypt", "hypt"],
  },
  {
    sourcePath: "plugin/commands/start.md",
    targetName: "hypt-start",
    aliases: ["/start", "hypt:start"],
  },
  {
    sourcePath: "plugin/commands/prototype.md",
    targetName: "hypt-prototype",
    aliases: ["/prototype", "hypt:prototype"],
  },
  {
    sourcePath: "plugin/commands/save.md",
    targetName: "hypt-save",
    aliases: ["/save", "hypt:save"],
  },
  {
    sourcePath: "plugin/skills/review/SKILL.md",
    targetName: "hypt-review",
    aliases: ["/review", "hypt:review"],
  },
  {
    sourcePath: "plugin/skills/touchup/SKILL.md",
    targetName: "hypt-touchup",
    aliases: ["/touchup", "hypt:touchup"],
  },
  {
    sourcePath: "plugin/skills/unit-tests/SKILL.md",
    targetName: "hypt-unit-tests",
    aliases: ["/unit-tests", "hypt:unit-tests"],
  },
  {
    sourcePath: "plugin/commands/fix.md",
    targetName: "hypt-fix",
    aliases: ["/fix", "hypt:fix"],
  },
  {
    sourcePath: "plugin/commands/deploy.md",
    targetName: "hypt-deploy",
    aliases: ["/deploy", "hypt:deploy"],
  },
  {
    sourcePath: "plugin/commands/status.md",
    targetName: "hypt-status",
    aliases: ["/status", "hypt:status"],
  },
  {
    sourcePath: "plugin/commands/restore.md",
    targetName: "hypt-restore",
    aliases: ["/restore", "hypt:restore"],
  },
  {
    sourcePath: "plugin/skills/docs/SKILL.md",
    targetName: "hypt-docs",
    aliases: ["/docs", "hypt:docs"],
  },
  {
    sourcePath: "plugin/commands/close.md",
    targetName: "hypt-close",
    aliases: ["/close", "hypt:close"],
  },
  {
    sourcePath: "plugin/skills/suggestions/SKILL.md",
    targetName: "hypt-suggestions",
    aliases: ["/suggestions", "hypt:suggestions"],
  },
  {
    sourcePath: "plugin/skills/plan-critic/SKILL.md",
    targetName: "hypt-plan-critic",
    aliases: ["/plan-critic", "hypt:plan-critic"],
  },
  {
    sourcePath: "plugin/commands/go.md",
    targetName: "hypt-go",
    aliases: ["/go", "hypt:go"],
  },
  {
    sourcePath: "plugin/commands/yolo.md",
    targetName: "hypt-yolo",
    aliases: ["/yolo", "hypt:yolo"],
  },
  {
    sourcePath: "plugin/skills/pipeline/SKILL.md",
    targetName: "hypt-pipeline",
    aliases: ["/pipeline", "hypt:pipeline"],
  },
  {
    sourcePath: "plugin/skills/autoclose/SKILL.md",
    targetName: "hypt-autoclose",
    aliases: ["/autoclose", "hypt:autoclose"],
  },
  {
    sourcePath: "plugin/skills/ci-setup/SKILL.md",
    targetName: "hypt-ci-setup",
    aliases: ["/ci-setup", "hypt:ci-setup"],
  },
  {
    sourcePath: "plugin/skills/post-mortem/SKILL.md",
    targetName: "hypt-post-mortem",
    aliases: ["/post-mortem", "hypt:post-mortem"],
  },
  {
    sourcePath: "plugin/skills/todo/SKILL.md",
    targetName: "hypt-todo",
    aliases: ["/todo", "hypt:todo"],
  },
];

const skillNameMap = new Map(
  SKILLS.map((skill) => [
    skill.targetName === "hypt" ? "hypt" : skill.targetName.replace(/^hypt-/, ""),
    skill.targetName,
  ]),
);

function main() {
  const checkMode = process.argv.includes("--check");
  let stale = false;
  const expectedSkillFiles = new Set(
    SKILLS.map((skill) => join(repoRoot, ".codex/skills", skill.targetName, "SKILL.md")),
  );
  const expectedDirectories = new Set(
    [join(repoRoot, ".codex"), join(repoRoot, ".codex/skills")].concat(
      SKILLS.map((skill) => join(repoRoot, ".codex/skills", skill.targetName)),
    ),
  );

  validateSourceManifest();
  validateInvocationMetadata();
  stale = reconcileGeneratedArtifacts(expectedSkillFiles, expectedDirectories, checkMode) || stale;

  for (const skill of SKILLS) {
    const generated = generateSkill(skill);
    const skillPath = join(repoRoot, ".codex/skills", skill.targetName, "SKILL.md");
    stale = writeManagedFile(skillPath, generated, checkMode) || stale;
  }

  const agentsPath = join(repoRoot, "AGENTS.md");
  stale = writeManagedFile(agentsPath, generateAgentsFile(), checkMode) || stale;

  if (checkMode && stale) {
    console.error("Codex support files are stale. Run:", generatedCommand);
    process.exit(1);
  }
}

function validateSourceManifest() {
  const expectedSources = new Set(SKILLS.map((skill) => skill.sourcePath));
  const discoveredSources = new Set();

  for (const entry of readdirSync(join(repoRoot, "plugin/commands"), { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".md")) {
      discoveredSources.add(`plugin/commands/${entry.name}`);
    }
  }

  for (const entry of readdirSync(join(repoRoot, "plugin/skills"), { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }
    const skillFile = `plugin/skills/${entry.name}/SKILL.md`;
    try {
      const stats = lstatSync(join(repoRoot, skillFile));
      if (stats.isFile()) {
        discoveredSources.add(skillFile);
      }
    } catch {
      continue;
    }
  }

  const missing = Array.from(discoveredSources).filter((sourcePath) => !expectedSources.has(sourcePath));
  const stale = Array.from(expectedSources).filter((sourcePath) => !discoveredSources.has(sourcePath));

  if (missing.length || stale.length) {
    throw new Error(
      [
        "Codex skill manifest is out of sync with plugin sources.",
        missing.length ? `Unmapped sources: ${missing.join(", ")}` : null,
        stale.length ? `Missing source files: ${stale.join(", ")}` : null,
      ]
        .filter(Boolean)
        .join(" "),
    );
  }
}

function validateInvocationMetadata() {
  const invalidSources = SKILLS.filter((skill) => {
    const sourceMeta = extractSourceMeta(skill);
    const disablesModelInvocation = sourceMeta["disable-model-invocation"] === "true";
    const isUserInvokedCommand = skill.sourcePath.startsWith("plugin/commands/");
    return disablesModelInvocation !== isUserInvokedCommand;
  });

  if (invalidSources.length) {
    throw new Error(
      [
        "Invocation metadata does not match the source type.",
        "Files in plugin/commands must set disable-model-invocation: true;",
        "files in plugin/skills must remain model-invocable.",
        `Invalid sources: ${invalidSources.map((skill) => skill.sourcePath).join(", ")}`,
      ].join(" "),
    );
  }
}

function reconcileGeneratedArtifacts(expectedFiles, expectedDirectories, checkMode) {
  let stale = false;
  const actualFiles = listManagedFiles(join(repoRoot, ".codex/skills"));
  const actualDirectories = listManagedDirectories(join(repoRoot, ".codex/skills"));

  for (const filePath of actualFiles) {
    if (!expectedFiles.has(filePath)) {
      stale = true;
      if (!checkMode) {
        rmSync(filePath, { force: true });
      }
    }
  }

  const unexpectedDirectories = actualDirectories
    .filter((directoryPath) => !expectedDirectories.has(directoryPath))
    .sort((left, right) => right.length - left.length);

  for (const directoryPath of unexpectedDirectories) {
    stale = true;
    if (!checkMode) {
      rmSync(directoryPath, { recursive: true, force: true });
    }
  }

  return stale;
}

function generateSkill(skill) {
  const source = readFileSync(join(repoRoot, skill.sourcePath), "utf8");
  const { frontmatter, body } = splitFrontmatter(source);
  const sourceMeta = parseFrontmatter(frontmatter);
  const sourceDescription = normalizeWhitespace(sourceMeta.description || "");
  const shortDescription = extractShortDescription(body, sourceDescription);
  const disablesModelInvocation = sourceMeta["disable-model-invocation"] === "true";
  const normalizedBody = normalizeBody(skill, body);

  return [
    "---",
    `name: ${yamlString(skill.targetName)}`,
    `description: ${yamlString(sourceDescription)}`,
    ...(disablesModelInvocation ? ["disable-model-invocation: true"] : []),
    "metadata:",
    `  short-description: ${yamlString(shortDescription)}`,
    "---",
    `<!-- Generated from ${skill.sourcePath}. Do not edit by hand. Run \`${generatedCommand}\` instead. -->`,
    "",
    normalizedBody.trim(),
    "",
  ].join("\n");
}

function generateAgentsFile() {
  const modelInvokedSkills = SKILLS.filter(
    (skill) => extractSourceMeta(skill)["disable-model-invocation"] !== "true",
  );
  const skillLines = modelInvokedSkills
    .map(
      (skill) =>
        `- ${skill.targetName}: ${extractSourceDescription(skill)} (file: \`.codex/skills/${skill.targetName}/SKILL.md\`)`,
    )
    .join("\n");

  return [
    "<!-- Generated from plugin/skills and plugin/commands. Do not edit by hand. Run `node scripts/sync-codex-support.mjs` instead. -->",
    "# AGENTS.md",
    "",
    "## Codex Support",
    "",
    "This repo exposes repo-local Codex skills under `.codex/skills/`. Model-invoked skills are listed below; user-invoked workflows are intentionally omitted from always-loaded instructions.",
    "",
    "## Model-Invoked Skills",
    "",
    skillLines,
    "",
    "## Trigger Rules",
    "",
    "- Use the specific skill when its one-line description matches the work.",
    "- Use `hypt` when a request spans the shipping lifecycle or the right workflow is unclear.",
    "",
  ].join("\n");
}

function extractSourceDescription(skill) {
  return normalizeWhitespace(extractSourceMeta(skill).description || "");
}

function extractSourceMeta(skill) {
  const source = readFileSync(join(repoRoot, skill.sourcePath), "utf8");
  const { frontmatter } = splitFrontmatter(source);
  return parseFrontmatter(frontmatter);
}

function normalizeBody(skill, body) {
  let normalized = body.replace(/\r\n/g, "\n");

  normalized = normalized.replace(
    /\n## Preamble[\s\S]*?(?=\n## [^\n]+|\n# [^\n]+|$)/g,
    "\n",
  );
  normalized = replaceTitleHeading(normalized, skill.targetName);
  normalized = rewriteContextSections(normalized);
  normalized = rewriteSkillReferences(normalized);
  normalized = rewriteAgentReferences(normalized);
  normalized = rewriteClaudeToolReferences(normalized);
  normalized = rewriteClaudePaths(normalized);
  normalized = rewriteAliasMentions(normalized);
  normalized = normalized.replace(
    /invoke the appropriate hypt skill using the Skill tool as your FIRST action/gi,
    "invoke the appropriate hypt skill as your first action",
  );
  normalized = normalized.replace(/\[Claude Code\]\(https:\/\/claude\.com\/claude-code\)/g, "Codex");
  normalized = normalized.replace(/\bClaude Code\b/g, "Codex");
  normalized = normalized.replace(/!\`([^`]+)\`/g, "`$1`");
  normalized = normalized.replace(/\n{3,}/g, "\n\n");

  if (normalized.includes('"$REPO_ROOT"/bin/')) {
    normalized = injectRepoToolsNote(normalized);
  }

  return normalized.trim();
}

function rewriteContextSections(body) {
  return body.replace(/^## Context\s*\n([\s\S]*?)(?=^## [^\n]+|$)/gm, (_match, section) => {
    const lines = section
      .trim()
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const rewritten = lines.map((line) => {
      if (!line.startsWith("- ")) {
        return `- ${line}`;
      }

      const content = line.slice(2).trim();
      const macroMatch = content.match(/^(.*?):\s*!\`([^`]+)\`$/);
      if (macroMatch) {
        const label = normalizeWhitespace(macroMatch[1]);
        const command = macroMatch[2].trim();
        return `- Run \`${command}\` to capture ${label}.`;
      }

      return `- ${content}`;
    });

    return `## Context\n\nBefore starting, gather context by running:\n\n${rewritten.join("\n")}\n\n`;
  });
}

function rewriteSkillReferences(body) {
  let normalized = body;

  normalized = normalized.replace(
    /Invoke the Skill tool with skill:\s*"hypt:([a-z-]+)"/g,
    (_match, skillName) => `Use \`${toCodexSkillName(skillName)}\``,
  );
  normalized = normalized.replace(
    /skill:\s*"hypt:([a-z-]+)"/g,
    (_match, skillName) => `skill \`${toCodexSkillName(skillName)}\``,
  );
  normalized = normalized.replace(
    /"hypt:([a-z-]+)"/g,
    (_match, skillName) => `\`${toCodexSkillName(skillName)}\``,
  );
  normalized = normalized.replace(
    /\bhypt:([a-z-]+)\b/g,
    (_match, skillName) => toCodexSkillName(skillName),
  );

  return normalized;
}

function rewriteAgentReferences(body) {
  return body
    .replace(/Use the Agent tool to launch/gi, "Spawn parallel sub-agents to launch")
    .replace(/Launch ([0-9]+(?:-[0-9]+)?) Agent calls?/g, "Spawn $1 sub-agents")
    .replace(/\bAgent tool\b/g, "sub-agent system")
    .replace(/\bAgent calls\b/g, "sub-agent runs");
}

function rewriteClaudeToolReferences(body) {
  return replaceOutsideCode(body, (segment) =>
    segment
      .replace(/Apply the fix using the Edit tool/gi, "Apply the fix by editing the file")
      .replace(/\buse the Edit tool\b/gi, "edit the file")
      .replace(/\busing the Edit tool\b/gi, "by editing the file")
      .replace(/\bGrep and Glob\b/g, "search and file discovery")
      .replace(/\busing Grep\b/g, "using search")
      .replace(/\buse Grep\b/g, "use search")
      .replace(/\bGrep\b/g, "search")
      .replace(/\bGlob\b/g, "file discovery"),
  );
}

function rewriteClaudePaths(body) {
  return body.replace(
    /~\/\.claude\/plugins\/marketplaces\/hypt-builder\/bin\//g,
    '"$REPO_ROOT"/bin/',
  );
}

function rewriteAliasMentions(body) {
  return replaceOutsideCode(body, (segment) => {
    let normalized = segment;
    for (const skill of SKILLS) {
      for (const alias of skill.aliases) {
        const replacement = skill.targetName === "hypt" ? "$hypt" : `$${skill.targetName}`;
        const escaped = escapeRegExp(alias);
        normalized = normalized.replace(new RegExp("`" + escaped + "`", "g"), `\`${replacement}\``);

        if (alias.startsWith("/")) {
          normalized = normalized.replace(
            new RegExp(`(^|[^A-Za-z0-9_\`])(${escaped})(?=$|[^A-Za-z0-9_-])`, "g"),
            (_match, prefix) => `${prefix}${replacement}`,
          );
        }
      }
    }
    return normalized;
  });
}

function injectRepoToolsNote(body) {
  const repoNote = [
    "When this workflow needs repo-local helper binaries, resolve the repo root first:",
    "",
    "```bash",
    'REPO_ROOT="$(git rev-parse --show-toplevel)"',
    "```",
    "",
  ].join("\n");

  const headingMatch = body.match(/^# .+$/m);
  if (!headingMatch || headingMatch.index === undefined) {
    return `${body}\n\n${repoNote.trim()}`;
  }

  const headingEnd = headingMatch.index + headingMatch[0].length;
  return `${body.slice(0, headingEnd)}\n\n${repoNote}${body.slice(headingEnd).trimStart()}`;
}

function replaceTitleHeading(body, targetName) {
  return body.replace(/^# .+$/m, (line) => {
    const titleSuffix = line.match(/\s+[—-]\s+(.+)$/);
    return titleSuffix ? `# ${targetName} — ${titleSuffix[1]}` : `# ${targetName}`;
  });
}

function extractShortDescription(body, fallback) {
  const heading = body.match(/^# .+?[—-]\s+(.+)$/m);
  if (heading) {
    return normalizeWhitespace(heading[1]);
  }
  return fallback || "Generated Codex skill";
}

function splitFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    throw new Error("Expected frontmatter block");
  }
  return { frontmatter: match[1], body: match[2] };
}

function parseFrontmatter(frontmatter) {
  const lines = frontmatter.split("\n");
  const parsed = {};

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const keyValue = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!keyValue) {
      continue;
    }

    const [, key, rawValue] = keyValue;
    if (rawValue === ">" || rawValue === "|") {
      const collected = [];
      index += 1;
      while (index < lines.length && (/^\s{2,}/.test(lines[index]) || lines[index] === "")) {
        collected.push(lines[index].replace(/^\s{2}/, ""));
        index += 1;
      }
      index -= 1;
      parsed[key] = normalizeWhitespace(collected.join(" "));
      continue;
    }

    parsed[key] = stripWrappingQuotes(rawValue.trim());
  }

  return parsed;
}

function writeManagedFile(filePath, content, checkMode) {
  const normalized = content.replace(/\r\n/g, "\n");
  assertManagedPathSafe(filePath);
  let current = null;

  try {
    current = readFileSync(filePath, "utf8");
  } catch {
    current = null;
  }

  if (current === normalized) {
    return false;
  }

  if (checkMode) {
    return true;
  }

  mkdirSync(dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.tmp`;
  assertManagedPathSafe(tempPath);
  writeFileSync(tempPath, normalized);
  renameSync(tempPath, filePath);
  return true;
}

function toCodexSkillName(rawName) {
  const targetName = skillNameMap.get(rawName);
  return targetName === "hypt" ? "$hypt" : `$${targetName || `hypt-${rawName}`}`;
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function stripWrappingQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function yamlString(value) {
  return JSON.stringify(value);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceOutsideCode(text, transform) {
  return text
    .split(/(```[\s\S]*?```)/g)
    .map((segment) => {
      if (segment.startsWith("```")) {
        return segment;
      }

      return segment
        .split(/(`[^`\n]+`)/g)
        .map((inner) => (inner.startsWith("`") && inner.endsWith("`") ? inner : transform(inner)))
        .join("");
    })
    .join("");
}

function assertManagedPathSafe(targetPath) {
  const absoluteTarget = resolve(targetPath);
  const relativeTarget = relative(repoRoot, absoluteTarget);

  if (relativeTarget.startsWith("..")) {
    throw new Error(`Refusing to manage a path outside the repo: ${absoluteTarget}`);
  }

  const segments = relativeTarget.split("/").filter(Boolean);
  let currentPath = repoRoot;
  for (const segment of segments) {
    currentPath = join(currentPath, segment);
    try {
      const stats = lstatSync(currentPath);
      if (stats.isSymbolicLink()) {
        throw new Error(`Refusing to follow symlinked managed path: ${currentPath}`);
      }
    } catch (error) {
      if (error && error.code === "ENOENT") {
        continue;
      }
      throw error;
    }
  }
}

function listManagedFiles(rootPath) {
  const files = [];
  try {
    for (const entry of readdirSync(rootPath, { withFileTypes: true })) {
      const entryPath = join(rootPath, entry.name);
      if (entry.isDirectory()) {
        files.push(...listManagedFiles(entryPath));
      } else {
        files.push(entryPath);
      }
    }
  } catch {
    return [];
  }
  return files;
}

function listManagedDirectories(rootPath) {
  const directories = [];
  try {
    for (const entry of readdirSync(rootPath, { withFileTypes: true })) {
      if (!entry.isDirectory()) {
        continue;
      }
      const entryPath = join(rootPath, entry.name);
      directories.push(entryPath, ...listManagedDirectories(entryPath));
    }
  } catch {
    return [];
  }
  return directories;
}

main();
