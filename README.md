# hypt — Shipping workflows for AI coding agents

hypt packages the parts of shipping that still benefit from explicit orchestration: project onboarding, plan review, end-to-end builds, deployment, recovery, and merge/release workflows.

Routine agent behavior—committing, pushing, reviewing a diff, fixing bugs, adding tests, updating docs, and editing todos—is intentionally not packaged as separate skills.

> **New to coding?** Follow the [beginner's guide](BEGINNERS_GUIDE.md). You can paste its installation prompt into Claude Desktop or ChatGPT Desktop and let a coding agent check your computer, explain the required tools, and install hypt after you approve the plan.

## Install

hypt uses the open [`skills`](https://github.com/vercel-labs/skills) installer. It supports Claude Code, Codex, Cursor, OpenCode, and many other agents.

### Choose interactively

```bash
npx skills add brianevanmiller/hypt-builder
```

### Install selected skills non-interactively

```bash
npx skills add brianevanmiller/hypt-builder \
  --skill hypt-build \
  --skill hypt-implement \
  --skill hypt-plan-critic \
  --agent claude-code \
  --agent codex \
  --global \
  --yes
```

Repeat `--skill` and `--agent` for any combination.

Composed workflows call sibling skills, and the installer does not resolve those dependencies automatically:

| Selected workflow | Also select |
|---|---|
| `hypt-build` | `hypt-plan-critic`, `hypt-implement` |
| `hypt-build` with yolo routing | `hypt-close`, `hypt-deploy` |
| `hypt-close` | `hypt-deploy` |
| `hypt-deploy` with code remediation | `hypt-build` |
| `hypt-restore` | `hypt-post-mortem`, `hypt-deploy` |
| `hypt` router | Install every skill so every route is available |

### Install every hypt skill for one agent

```bash
npx skills add brianevanmiller/hypt-builder \
  --skill '*' \
  --agent claude-code \
  --global \
  --yes
```

Change `claude-code` to `codex`, `cursor`, or another supported agent. Omit `--global` for a project-local install.

After installation, restart the agent if it does not reload skills automatically.

### Required companion skills

> **Required after installing Hypt:** run `hypt-start` once. Onboarding is incomplete until its companion check passes.

`hypt-start` checks and installs Hypt's required Matt Pocock and pstack companions globally after showing the exact plan and getting approval:

| Source | Skills | Used for |
|---|---|---|
| `mattpocock/skills` | `wayfinder`, `grilling`, `codebase-design`, `code-review`, `tdd`, `diagnosing-bugs` | Readiness, discovery, design, review, light TDD, diagnosis |
| `cursor/plugins` pstack | `architect`, `interrogate` | Second design perspective and adversarial review |

Coder profiles also receive HumanLayer `show-me` and Archify; non-coder profiles skip technical visualization skills. `hypt-start` installs only missing names and verifies them through `npx skills list -g --json`.

The exact source-qualified commands live in [`hypt-start`'s companion reference](agents/skills/hypt-start/references/companion-skills.md).

Installed skills update explicitly:

```bash
npx skills update -g
```

## Skills

Installed skills use collision-safe standalone names. The old Claude plugin names such as `hypt:deploy` are retired; use `hypt-deploy`.

| Skill | Purpose |
|---|---|
| `hypt` | Route requests that span the shipping lifecycle |
| `hypt-start` | Onboard the owner and project, install companions, and create the initial plan |
| `hypt-plan-critic` | Stress-test a non-trivial implementation plan |
| `hypt-implement` | Implement approved work through a focused coding pass |
| `hypt-build` | Build to a ready PR; yolo phrases continue through close |
| `hypt-close` | Final quality pass, merge confirmation, deployment check, and release |
| `hypt-deploy` | Check deployment status or remediate deployment problems |
| `hypt-restore` | Roll back a failed release or guide database recovery |
| `hypt-post-mortem` | Analyze an incident and record follow-up work |

You can invoke a skill by name or describe the outcome naturally. The `hypt` router only claims the workflows above; ordinary coding and git requests stay with the agent's normal behavior.

`yolo`, `ship it`, and `publish it` route through `hypt-build` and then `hypt-close`. The phrase pre-approves the close gate so the workflow can merge, verify deployment, and release without another prompt.

## Source layout

[`agents/skills/`](agents/skills/) is the single source of truth:

```text
agents/
└── skills/
    ├── hypt/
    │   └── SKILL.md
    ├── hypt-deploy/
    │   ├── SKILL.md
    │   └── scripts/
    └── hypt-start/
        ├── SKILL.md
        └── assets/
```

There are no generated Claude/Codex copies and no bespoke installer-managed symlink tree. Each skill carries its own non-skill scripts, references, and assets; composed Hypt dependencies are listed in the installation table above, while `hypt-start` owns companion installation.

See [`agents/README.md`](agents/README.md) for contributor rules, [`docs/2026-08-27-agent-skills-migration-research.md`](docs/2026-08-27-agent-skills-migration-research.md) for the distribution decision, and [`docs/2026-08-27-agent-skill-landscape-research.md`](docs/2026-08-27-agent-skill-landscape-research.md) for the companion-skill comparison.

For human-facing setup, see the [beginner's guide](BEGINNERS_GUIDE.md) or the [cheatsheet](CHEATSHEET.md).

## Validate changes

```bash
node scripts/validate-agent-skills.mjs
npx skills add . --list
bin/hypt-security-scan --mode blocking --all
```

The local validator checks Agent Skills naming, frontmatter, duplicate names, and retired plugin references. The installer command verifies real CLI discovery; review remains responsible for non-skill file references and composed workflow dependencies.

## Requirements

Individual workflows may require:

- Git and the GitHub CLI (`gh`) for branches, pull requests, deployments, and releases
- Node.js for the `skills` installer and local validation
- Bun in projects whose selected workflow uses Bun commands
- Deployment-provider CLIs only when that provider's remediation path needs them

## Agent Plugins protocol

hypt does not currently add an [Agent Plugins](https://agent-plugins.org/) manifest. The protocol standardizes a plugin package and fixed component locations, but explicitly leaves installation and distribution to clients. Since hypt currently distributes only Agent Skills, `skills` is the smaller working interface.

The chosen layout leaves that door open: `agents/` already contains the protocol's required `skills/` shape, so a future `agents/plugin.json` can be added when a supported client, MCP server, or client extension creates a concrete need.

## License

MIT
