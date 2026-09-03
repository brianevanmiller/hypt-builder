# Migration and Post-Merge Reconciliation

Run from `hypt-close` Step 6 when the branch changes a schema, migration, seed, backfill, environment contract, queue, cache, or another operation that may need to happen around deployment. The repository is the source of truth: inspect its package scripts, Makefile, pyproject, framework configuration, deployment workflow, README, and CI before selecting a command.

## 1. Identify the migration mode

- **Provider-integrated:** deployment already runs a documented, deploy-safe migration step.
- **Repository-commanded:** the project documents a deploy-safe migration command that close can run separately.
- **Human-only:** the operation needs an interactive dashboard, credentialed approval, maintenance window, or irreversible decision.
- **Unknown:** no authoritative command or target can be established.

`prisma migrate deploy`, `drizzle-kit migrate`, `alembic upgrade head`, `rails db:migrate`, and `supabase db push` are candidates only; use one solely when this repository documents that exact command and its intended environment. A framework guess never becomes a production action.

Classify changed migration files against the PR's actual base: **A** new migration; **R** moved or renamed historical migration, so verify history rather than replaying it; **M** modified historical migration, a red flag because applied migrations are normally immutable. Also inspect the new runtime's reads and writes: a migration is pre-merge-required when merged code can read or depend on a new schema/data shape before the provider or an explicit rollout step guarantees it.

## 2. Pre-merge operation

When compatibility requires the migration before merge, present the exact repository-documented command; the target environment and how it will be identified; the migration order and risk (`benign`, `additive`, `complex`, `potentially destructive`, or `irreversible`); the read-only verification query or status command; and the rollback or forward-fix plan when the operation is not purely additive.

Wait for explicit user approval of this production-affecting action, even in yolo mode. Run one migration at a time when ordering matters, capture the result, and verify the expected schema/data state before continuing. A command that requests an interactive production confirmation, cannot identify its target, or fails is a safety stop: no blind retry, no merging as if it succeeded.

If old and new code are both compatible with the expand step and deployment guarantees the migration, record that and defer to the post-merge path. A destructive or irreversible migration requires a human-approved backup/rollback plan and is never auto-run.

## 3. Post-merge operation

After the PR has merged and the provider exposes the merged deployment:

1. Confirm the production target and expected merged SHA; a local or preview database is not production evidence.
2. If the provider already ran the documented migration, inspect its deployment output/status and verify the resulting schema or migration status; the migration is not run twice.
3. Otherwise run the repository's documented deploy-safe command exactly once, in production only after confirming its target; reset, force, dev, seed, and unreviewed manual SQL are never shortcuts.
4. Verify migration status and the real application path, then re-run deployment health checks.
5. On failure, timeout, wrong database, uncertain status, or a human-only confirmation, stop the release and report the exact command, target evidence, failure, and next safe action, handing recovery to `hypt-deploy` or `hypt-restore` when appropriate.

Rerun a post-merge command only after a read-only check establishes that the earlier attempt did not complete; truncated output or a network timeout is not that evidence. Idempotence is a requirement, not an assumption.

## 4. No command or no migration

No changed schema or operational surface: record `migrations: none` and continue. A changed surface with no authoritative deploy-safe command or target: record `migrations: blocked (no safe documented command)`, stop before release, and surface the exact missing repository contract rather than inventing one. A human-only step stays open as follow-up with its exact command or dashboard action, owner, target, and verification; a missing tracker does not erase the rollout requirement.

## Return

```text
Migrations
- Surface: <none / schema / migration / operational>
- Mode: <provider-integrated / repository-commanded / human-only / unknown>
- Pre-merge: <none / command, target, result / blocker>
- Post-merge: <provider evidence / command, target, result / blocker>
- Verification: <migration state and real-path evidence>
- Release: <allowed / blocked with reason>
```
