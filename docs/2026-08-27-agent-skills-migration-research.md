# Agent skills distribution research

## Decision

Make `agents/skills/` the canonical, installer-facing source tree and distribute directly through the `skills` CLI.

- Remove the Claude plugin namespace and its `hypt:skill` invocation format.
- Keep collision-safe standalone names such as `hypt-deploy`; installed skills from different repositories share one namespace.
- Keep each skill self-contained so selected-skill installation works.
- Defer an Agent Plugins manifest. The current package only needs skills, while Agent Plugins deliberately leaves installation and distribution outside its specification.

## Evidence

| Source | Finding |
|---|---|
| [Agent Skills specification](https://agentskills.io/specification) | Every skill is a directory with a required `SKILL.md`; `name` and `description` are required, and `name` must match its parent directory. |
| [`skills add` documentation](https://vercel-labs-skills.mintlify.app/commands/add) | The CLI installs from GitHub repositories or local paths, supports repeated `--skill` selection, `--agent '*'`, `-y`, and `--all` for all skills on all agents. |
| [`vercel-labs/skills`](https://github.com/vercel-labs/skills) | The CLI supports Claude Code, Codex, Cursor, OpenCode, and many other agents through one installation surface. |
| [Agent Plugins skills documentation](https://agent-plugins.org/plugin-authors/skills) | A conforming plugin discovers skills only as immediate children of a fixed `skills/` directory and delegates skill validity to the Agent Skills specification. |
| [Agent Plugins author guide](https://agent-plugins.org/plugin-authors) | A plugin additionally requires `plugin.json`; installation, distribution, enablement, updates, and UI are explicitly outside the portable specification. |
| [`humanlayer/skills`](https://github.com/humanlayer/skills) | Public skill packs advertise direct `npx skills add <repo> --skill <name>` installation rather than requiring a bespoke installer. |

## Install interface

Interactive selection:

```bash
npx skills add brianevanmiller/hypt-builder
```

Selected skills, globally and non-interactively for selected agents:

```bash
npx skills add brianevanmiller/hypt-builder \
  --skill hypt \
  --skill hypt-deploy \
  --agent claude-code \
  --agent codex \
  --global \
  --yes
```

Every skill for one agent, globally and non-interactively:

```bash
npx skills add brianevanmiller/hypt-builder \
  --skill '*' \
  --agent claude-code \
  --global \
  --yes
```

The broader `--global --all` shorthand installs every skill for every supported agent target and may create directories for agents that are not currently in use.

## Agent Plugins compatibility

The chosen layout intentionally makes `agents/` a possible future plugin root:

```text
agents/
├── plugin.json       # add later if needed
└── skills/
    └── hypt-deploy/
        └── SKILL.md
```

Adding `plugin.json` now would not improve installation through `skills`, and no MCP server or client extension currently needs a plugin package. Deferring it avoids two distribution concepts until there is a concrete consumer.

## Related documentation

| Document | Description |
|---|---|
| [Agent source layout](../agents/README.md) | Defines canonical skill packaging. |
| [Router design](hypt-router-design.md) | Describes hypt skill composition. |
