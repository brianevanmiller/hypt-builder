---
name: hypt-restore
description: "Restores a known-good release through an idempotent provider rollback, reviewed code revert, or guided database recovery. Use when the user asks to roll back a failed release."
metadata:
  short-description: "Restore a Known-good Release"
---

# hypt-restore — Restore a Known-good Release

Restore service first; preserve evidence for diagnosis. Read `references/platform-rollbacks.md` only for the detected provider branch.

## Ground

Read repository instructions, production deployment history, recent target-branch commits and PRs, current incidents, provider config, and database tooling. Keep the user's worktree untouched.

## 1. Pin current and target

Resolve the user's SHA, PR, tag, deployment, or time reference. When none is supplied, identify:

- Current production revision and deployment
- Suspected bad revision
- Last known-good revision and deployment
- Commits and migrations between them

Present those exact values before changing anything. Get confirmation unless the user's current message already approves that exact target.

Completion: current and target revisions are immutable IDs, not branch names or “latest.”

## 2. Make the operation idempotent

Before each action, check whether production already serves the target and whether a revert PR or provider rollback already exists.

Define success as:

- Provider points to the target deployment or the target branch contains the merged revert
- Application health passes
- Re-running the same restore makes no additional change

Use one operation ID in branch names, commit messages, and the report. Never repeat a provider promotion, create a second revert, or replay database recovery after its success is recorded.

## 3. Restore the deployment

Follow the provider branch in `references/platform-rollbacks.md`. Prefer promoting a known-good immutable deployment because it restores service without rewriting Git history.

If the provider cannot promote the target, create a revert branch from the latest target branch:

1. Revert the bad merge or squash commit with `git revert`.
2. Run the smallest build or smoke check.
3. Push and open a PR that names the incident and target.
4. Merge only with the user's explicit approval or an existing incident-run approval that names this revert.

Never force-push, reset the shared target branch, or discard unrelated local changes.

Completion: provider or Git reports one successful restore action for the operation ID.

## 4. Handle database state separately

Code rollback does not imply database rollback. Inspect migrations between current and target:

- Additive, backward-compatible migrations usually remain.
- Destructive or incompatible changes require a provider backup/PITR plan and explicit confirmation of the exact restore point.
- Prefer a forward compatibility migration when it safely restores service without discarding later data.

Guide the user through dashboard-only or credentialed recovery; never infer authorization for destructive database changes from a code-restore request.

## 5. Prove recovery

Verify provider state and application health against the restored revision. Exercise the broken user path through browser or computer use when reachable. Check critical side effects and logs.

If health fails, stop and report the observed failure. Do not loop through additional restore targets without a new diagnosis.

## 6. Preserve and learn

Record current revision, target, operation, timestamps, deployment URL, health evidence, and any database action. Then invoke `hypt-post-mortem` with the bad diff, incident evidence, and restore result.

Return:

```text
Restore
- From: <bad revision/deployment>
- To: <known-good revision/deployment>
- Operation: <provider promotion or revert PR>
- Production: <URL>
- Health: <real-path evidence>
- Database: <unchanged, forward fix, or approved recovery>
- Post-mortem: <path>
```

Completion: production is healthy, the operation is safe to rerun, and the evidence needed for root-cause analysis is preserved.
