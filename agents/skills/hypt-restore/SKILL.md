---
name: hypt-restore
description: "Restores a known-good release through an idempotent provider rollback, reviewed code revert, or guided database recovery. Use when the user asks to roll back a failed release."
metadata:
  short-description: "Restore a Known-good Release"
---

# hypt-restore — Restore a Known-good Release

Restore service first and preserve evidence for diagnosis. Read `references/platform-rollbacks.md` only for the detected provider's branch.

## Ground

Read repository instructions, production deployment history, recent target-branch commits and PRs, current incidents, provider config, and database tooling. Leave the user's worktree untouched.

## 1. Pin current and target

Resolve the user's SHA, PR, tag, deployment, or time reference. When none is supplied, identify the current production revision and deployment, the suspected bad revision, the last known-good revision and deployment, and the commits and migrations between them. Present those exact values before changing anything, and get confirmation unless the user's current message already approves that exact target.

Completion: current and target are immutable IDs, not branch names or "latest".

## 2. Make the operation idempotent

Before each action, check whether production already serves the target and whether a revert PR or provider rollback already exists; once success is recorded, no promotion, revert, or database recovery is repeated. Success means the provider points at the target deployment or the target branch contains the merged revert, application health passes, and re-running the restore changes nothing. Use one operation ID in branch names, commit messages, and the report.

## 3. Restore the deployment

Follow the provider branch in `references/platform-rollbacks.md`, preferring promotion of a known-good immutable deployment because it restores service without rewriting Git history. When the provider cannot promote the target, branch from the latest target branch, `git revert` the bad merge or squash commit, run the smallest build or smoke check, push, and open a PR naming the incident and target. Merge it only with the user's explicit approval or an existing incident-run approval that names this revert. Never force-push, reset the shared target branch, or discard unrelated local changes.

Completion: provider or Git reports one successful restore action for the operation ID.

## 4. Handle database state separately

Code rollback does not imply database rollback. Inspect migrations between current and target: additive, backward-compatible migrations usually remain; destructive or incompatible changes need a provider backup/PITR plan and explicit confirmation of the exact restore point; a forward compatibility migration is preferable when it safely restores service without discarding later data. Guide the user through dashboard-only or credentialed recovery. A code-restore request never authorizes destructive database changes.

## 5. Prove recovery

Verify provider state and application health against the restored revision, exercise the broken user path through browser or computer use when reachable, and check critical side effects and logs. If health fails, stop and report the observed failure rather than looping through further restore targets without a new diagnosis.

## 6. Preserve and learn

Record current revision, target, operation, timestamps, deployment URL, health evidence, and any database action, then invoke `hypt-post-mortem` with the bad diff, incident evidence, and restore result. Return:

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

Completion: production is healthy, the operation is safe to rerun, and the evidence for root-cause analysis is preserved.
