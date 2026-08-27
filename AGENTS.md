<!-- Generated from plugin/skills and plugin/commands. Do not edit by hand. Run `node scripts/sync-codex-support.mjs` instead. -->
# AGENTS.md

## Codex Support

This repo exposes repo-local Codex skills under `.codex/skills/`. Model-invoked skills are listed below; user-invoked workflows are intentionally omitted from always-loaded instructions.

## Model-Invoked Skills

- hypt: Routes shipping requests to the appropriate hypt workflow. Use when a request spans the shipping lifecycle or the right workflow is unclear. (file: `.codex/skills/hypt/SKILL.md`)
- hypt-review: Reviews a code diff for correctness and readiness. Use when changes need a thorough pre-merge review. (file: `.codex/skills/hypt-review/SKILL.md`)
- hypt-touchup: Polishes a PR by resolving review comments, build issues, and stale docs. Use after review and before merge. (file: `.codex/skills/hypt-touchup/SKILL.md`)
- hypt-unit-tests: Adds or extends unit tests for changed code. Use when a PR needs targeted test coverage. (file: `.codex/skills/hypt-unit-tests/SKILL.md`)
- hypt-docs: Updates project documentation to reflect completed work. Use after implementation or before closing a PR. (file: `.codex/skills/hypt-docs/SKILL.md`)
- hypt-suggestions: Suggests and tracks next tasks in the project backlog. Use when prioritizing follow-up work. (file: `.codex/skills/hypt-suggestions/SKILL.md`)
- hypt-plan-critic: Reviews an implementation plan for gaps and risks. Use before building from a non-trivial plan. (file: `.codex/skills/hypt-plan-critic/SKILL.md`)
- hypt-pipeline: Runs the development pipeline through a saved PR without merging. Use when a workflow needs research, planning, implementation, review, and tests. (file: `.codex/skills/hypt-pipeline/SKILL.md`)
- hypt-autoclose: Merges a ready PR, verifies deployment, bumps the version, and creates a release. Use after a parent workflow has handled merge confirmation. (file: `.codex/skills/hypt-autoclose/SKILL.md`)
- hypt-ci-setup: Configures GitHub Actions to run lint and unit tests. Use when a project needs lightweight CI. (file: `.codex/skills/hypt-ci-setup/SKILL.md`)
- hypt-post-mortem: Analyzes a failed deployment or restore and records follow-up work. Use after a restore or production incident. (file: `.codex/skills/hypt-post-mortem/SKILL.md`)
- hypt-todo: Adds or updates project backlog, roadmap, or todo items. Use when work needs to be tracked. (file: `.codex/skills/hypt-todo/SKILL.md`)

## Trigger Rules

- Use the specific skill when its one-line description matches the work.
- Use `hypt` when a request spans the shipping lifecycle or the right workflow is unclear.
