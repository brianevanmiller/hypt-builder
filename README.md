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
  --skill hypt-prototype \
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
| `hypt-prototype` | `hypt-plan-critic` |
| `hypt-build` | `hypt-plan-critic`, `hypt-prototype` |
| `hypt-go` or `hypt-yolo` | `hypt-build`, `hypt-plan-critic`, `hypt-prototype`, `hypt-autoclose`, `hypt-deploy` |
| `hypt-close` or `hypt-autoclose` | `hypt-deploy` |
| `hypt-restore` | `hypt-post-mortem` |
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

Installed skills update explicitly:

```bash
npx skills update -g
```

## Skills

Installed skills use collision-safe standalone names. The old Claude plugin names such as `hypt:deploy` are retired; use `hypt-deploy`.

| Skill | Purpose |
|---|---|
| `hypt` | Route requests that span the shipping lifecycle |
| `hypt-start` | Onboard a new project and create its initial plan |
| `hypt-plan-critic` | Stress-test a non-trivial implementation plan |
| `hypt-prototype` | Build, review, test, and deliver a plan end to end |
| `hypt-build` | Run research through a review-ready PR without merging |
| `hypt-go` | Run the pipeline, then confirm before merge |
| `hypt-yolo` | Run the pipeline and merge without a confirmation gate |
| `hypt-close` | Final quality pass, merge confirmation, deployment check, and release |
| `hypt-autoclose` | Merge, verify deployment, and release without confirmation |
| `hypt-deploy` | Check deployment status or remediate deployment problems |
| `hypt-restore` | Roll back a failed release or guide database recovery |
| `hypt-post-mortem` | Analyze an incident and record follow-up work |

You can invoke a skill by name or describe the outcome naturally. The `hypt` router only claims the workflows above; ordinary coding and git requests stay with the agent's normal behavior.

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

There are no generated Claude/Codex copies and no bespoke installer-managed symlink tree. Each skill carries its own non-skill scripts and assets; composed skill dependencies are listed in the installation table above.

See [`agents/README.md`](agents/README.md) for contributor rules and [`docs/2026-08-27-agent-skills-migration-research.md`](docs/2026-08-27-agent-skills-migration-research.md) for the distribution decision.

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
