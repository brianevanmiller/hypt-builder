# Agent sources

`agents/skills/` is the canonical source for every installable hypt skill.

Each immediate child is an [Agent Skill](https://agentskills.io/specification) package:

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

Keep non-skill scripts, references, and assets used by only one skill inside that skill's directory. The `skills` installer copies or links selected directories independently, so an installed skill cannot rely on repo-root helper files. When one skill invokes another, document the complete selection set in the root README because the installer does not resolve skill dependencies.

Skill names retain the `hypt-` prefix because installed skills share a global namespace. The old Claude plugin namespace (`hypt:deploy`) is gone; the standalone skill is `hypt-deploy`.

## Validate

```bash
node scripts/validate-agent-skills.mjs
npx skills add . --list
```

The first command enforces repository invariants without network access. The second exercises discovery through the same installer users run.

## Distribution

The repository is directly installable with the `skills` CLI. There are no generated Claude/Codex copies and no repo-owned symlink installer.

Agent Plugins v1 could be added later by placing `plugin.json` in `agents/`, because its required `skills/` directory already exists here. That manifest is intentionally deferred until a supported client or non-skill component requires it.
