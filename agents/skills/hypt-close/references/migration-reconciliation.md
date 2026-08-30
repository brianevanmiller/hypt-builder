# Migration and Post-Merge Reconciliation

Use this reference from `hypt-close` when the branch changes a schema, migration, seed, backfill, environment contract, queue, cache, or another operation that may need to happen around deployment. The repository is the source of truth: inspect its package scripts, Makefile, pyproject, framework configuration, deployment workflow, README, and CI before selecting a command.

## 1. Identify the migration mode

Classify the project as one of:

- **Provider-integrated** — deployment already runs a documented, deploy-safe migration step.
- **Repository-commanded** — the project documents a deploy-safe migration command that close can run separately.
- **Human-only** — the operation requires an interactive dashboard, credentialed approval, maintenance window, or irreversible decision.
- **Unknown** — no authoritative command or target can be established.

Examples such as `prisma migrate deploy`, `drizzle-kit migrate`, `alembic upgrade head`, `rails db:migrate`, or `supabase db push` are only candidates. Use one only when this repository documents that exact command and its intended environment. Never turn a framework guess into a production action.

Resolve the PR's actual base and classify changed migration files, when the repository has them:

- **A** — new migration.
- **R** — moved or renamed historical migration; verify history rather than replaying it.
- **M** — modified historical migration; treat as a red flag because applied migrations are normally immutable.

Also inspect the new runtime's reads and writes. A migration is pre-merge-required when merged code can read or depend on a new schema/data shape before the provider or an explicit rollout step guarantees it exists.

## 2. Pre-merge operation

If compatibility requires the migration before merge, present:

- The exact repository-documented command.
- The target environment and how it will be identified.
- The migration order and risk (`benign`, `additive`, `complex`, `potentially destructive`, or `irreversible`).
- The read-only verification query or status command.
- The rollback or forward-fix plan when the operation is not purely additive.

Wait for an explicit user approval for this production-affecting action, even in yolo mode. Run one migration operation at a time when ordering matters. Capture the result and verify the expected schema/data state before continuing. A command that requests an interactive production confirmation, cannot identify its target, or fails is a safety stop; do not retry blindly and do not merge as if it succeeded.

If old and new code are both compatible with the expand step and deployment guarantees the migration, record that fact and defer it to the post-merge path. If the migration is destructive or irreversible, require a human-approved backup/rollback plan and never auto-run it.

## 3. Post-merge operation

After the PR has merged and the provider exposes the merged deployment:

1. Confirm the production target and expected merged SHA. Do not treat a local or preview database as production evidence.
2. If the provider already ran the documented migration, inspect its deployment output/status and verify the resulting schema or migration status. Do not run the same migration twice.
3. Otherwise, automatically run the repository's documented deploy-safe command exactly once. Use the production environment only after confirming its target; never use reset, force, dev, seed, or an unreviewed manual SQL command as a shortcut.
4. Verify migration status and the real application path. Re-run deployment health checks after the operation.
5. If it fails, times out, targets the wrong database, leaves status uncertain, or requests a human-only confirmation, stop the release and report the exact command, target evidence, failure, and next safe action. Hand recovery to `hypt-deploy` or `hypt-restore` when appropriate.

A post-merge command may be rerun only after a read-only check establishes that the earlier attempt did not complete. Idempotence is a requirement, not an assumption. Do not run a second migration attempt merely because output was truncated or a network request timed out.

## 4. No command or no migration

If no schema or operational surface changed, record `migrations: none` and continue. If a surface changed but no authoritative deploy-safe command or target exists, record `migrations: blocked (no safe documented command)` and stop before release. Surface the exact missing repository contract so the project can add it; do not invent one.

A human-only step remains open as follow-up with its exact command or dashboard action, owner, target, and verification. A missing tracker does not erase the rollout requirement.

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
