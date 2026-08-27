# Hypt router design

## Purpose

`hypt` routes the workflows that still need explicit orchestration. It deliberately does not intercept routine requests that modern agents already handle: commit, push, PR creation, code review, bug fixing, tests, documentation, CI, and todo edits.

```text
User request
    │
    ├── Routine repository work ──► agent defaults + repository instructions
    │
    └── Hypt lifecycle workflow ──► matching hypt-* skill
```

## Routes

| Intent | Skill |
|---|---|
| Start or onboard a project | `hypt-start` |
| Critique a non-trivial plan | `hypt-plan-critic` |
| Build a plan end to end | `hypt-prototype` |
| Produce a reviewed PR without merge | `hypt-build` |
| Run autonomously, confirm before merge | `hypt-go` |
| Run autonomously through merge | `hypt-yolo` |
| Finalize, confirm, merge, and release | `hypt-close` |
| Finalize and merge without confirmation | `hypt-autoclose` |
| Check or repair deployment health | `hypt-deploy` |
| Restore a working release | `hypt-restore` |
| Analyze an incident | `hypt-post-mortem` |

`hypt-deploy` owns both deployment modes. A status request selects its read-only path; a deploy or remediation request permits changes.

## Composition

```text
hypt-prototype
  plan review
  implementation
  diff review and fixes
  tests and documentation
  PR finalization

hypt-build
  research and plan
  hypt-plan-critic
  hypt-prototype or finish existing work
  review-and-fix loop
  PR finalization

hypt-go
  hypt-build
  confirmation gate
  hypt-autoclose

hypt-yolo
  hypt-build
  hypt-autoclose
```

Review, verification, documentation, and git completion criteria live inside these parent workflows. They are steps, not independently installed skills.

## Close and recovery

```text
hypt-close
  final quality pass
  affected documentation
  follow-up capture
  confirmation
  merge
  deployment health
  release

hypt-restore
  identify known-good target
  platform rollback or code revert
  health check
  hypt-post-mortem
```

## Naming and installation

The old Claude plugin namespace used names such as `hypt:deploy`. Standalone Agent Skills use collision-safe names such as `hypt-deploy`.

The router and every routed workflow are installed from `agents/skills/` through the `skills` CLI. See [the migration research](2026-08-27-agent-skills-migration-research.md) for the distribution decision.

## Related documentation

| Document | Description |
|---|---|
| [Agent source layout](../agents/README.md) | Defines canonical skill packaging. |
| [Migration research](2026-08-27-agent-skills-migration-research.md) | Records installer and protocol evidence. |
