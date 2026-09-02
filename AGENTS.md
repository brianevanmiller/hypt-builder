# Repository instructions

## Canonical agent sources

All installable skills live under `agents/skills/<name>/SKILL.md`.

- Keep the frontmatter `name` equal to the parent directory.
- Keep skill-specific scripts, references, and assets inside that skill's directory.
- Use standalone names (`hypt-deploy`); `hypt:`-style names fail the validator.
- Keep routine agent behavior inside composed workflows as concise completion criteria instead of creating one-purpose skills for commit, review, fixes, tests, docs, CI, or todos.
- Update `agents/skills/hypt/SKILL.md` and the root skill table when adding or removing a routed workflow.

## Validation

After changing agent sources, run:

```bash
node scripts/validate-agent-skills.mjs
npx skills add . --list
bin/hypt-security-scan --mode blocking --all
```

Do not recreate generated `.codex/skills`, Claude plugin manifests, or bespoke installation scripts. Agent-specific links are owned by the `skills` installer.
