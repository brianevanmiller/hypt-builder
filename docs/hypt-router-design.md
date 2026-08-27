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
| Implement approved executable work | `hypt-implement` |
| Build and prove work end to end | `hypt-build` |
| Run autonomously through merge | `hypt-build` in yolo mode, then `hypt-close` |
| Finalize, confirm, merge, and release | `hypt-close` |
| Check or repair deployment health | `hypt-deploy` |
| Restore a working release | `hypt-restore` |
| Analyze an incident | `hypt-post-mortem` |

`hypt-deploy` owns both deployment modes. A status request selects its read-only path; a deploy or remediation request permits changes.

## Composition

```text
hypt-start
  person + communication profile
  required companion installation
  project + accounts + plan

hypt-build
  readiness routing
  hypt-plan-critic
  hypt-implement
  real-path proof
  standards/spec review
  adversarial review
  contract sweep
  PR finalization
  if yolo mode:
    hypt-close with pre-approved gate
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
| [Skill landscape research](2026-08-27-agent-skill-landscape-research.md) | Compares companion skills and integration seams. |
