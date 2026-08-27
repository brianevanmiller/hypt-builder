---
name: hypt-close
description: "Closes a ready PR through remote-state checks, merge, production deployment verification, and release. Use for an explicit close or merge request, or when hypt-build hands off yolo completion."
metadata:
  short-description: "Merge, Verify, and Release"
---

# hypt-close — Merge, Verify, and Release

Own the transition from a ready remote PR to a verified release. A direct invocation confirms before merge. A `hypt-build` yolo handoff arrives pre-approved.

## Ground

Read the repository instructions, current branch, merge-base, PR, unresolved comments, required checks, deployments, latest release, `VERSION`, changelog, and affected project tracking.

## 1. Refresh the PR

Review the complete branch diff and fix material correctness, security, or build issues. Update affected docs and actionable follow-up tracking without creating a new tracking system.

Polish the PR title and body from the full branch, using repository conventions. Include the user-visible outcome and verification evidence.

Completion:

- Worktree is clean.
- Local `HEAD` equals the PR head SHA.
- Every intended commit and review fix is pushed.
- No blocking comment remains.

## 2. Prove the gates

Inspect required checks by name, status, and conclusion. “No failure” is not enough: every required gate must be present and have run on the current PR head.

For user-facing changes, require current real-path evidence:

1. Vercel preview through browser or computer use
2. Another provider's preview
3. Localhost as fallback

If `hypt-build` already captured proof on the current head and later fixes could not affect that path, reuse it. Otherwise re-drive the path. After three browser/tooling attempts, record the exact blocker instead of claiming proof.

Stop when a required gate is missing, pending beyond its normal duration, or failing. Report the gate and current head SHA.

## 3. Sweep freshness

Re-read comments, tests, docs, PR text, and release notes touched by this work. They must describe the code on the current PR head, including any late review reversal.

Keep durable contract; remove only session-written scaffolding:

- Keep interface behavior, plausible regression tests, invariants, gotchas, semantic definitions, and ticket pointers.
- Remove build narration, discarded-design rationale, duplicate permutations, change detectors, and temporary probes.

Completion: remote code, proof, and prose all describe the same revision.

## 4. Prepare the release

If the repository versions releases, compare the latest GitHub release, `VERSION`, and changelog:

- Keep an already prepared coherent version newer than the latest release.
- Otherwise choose a patch for fixes/small maintenance or a minor for features/significant enhancements.
- Ask only when the bump is genuinely ambiguous.

Update version and changelog on the feature branch, commit, push, and wait for the required gates on the new head. Refresh the PR summary.

## 5. Confirm or accept yolo

Present the PR, URL, change size, checks, real-path proof, and prepared version.

When `hypt-build` invoked this skill in yolo mode, mark the gate auto-approved and continue. Otherwise ask:

> Merge, deploy, and release? (yes/no)

Proceed only after direct confirmation or the recorded yolo pre-approval.

## 6. Merge

Confirm the PR is mergeable, then squash-merge and delete the branch using repository conventions. On failure, stop with the failing check, conflict, or merge-state reason.

Fetch the target branch after merge. Record the merged PR number and commit.

## 7. Verify production

Invoke `hypt-deploy` in production mode. Carry its production URL and health evidence forward. A provider access block follows `hypt-deploy`'s remediation path; it is not silently treated as success.

Stop when production is unhealthy or unavailable after remediation. A release requires production evidence.

## 8. Release and re-check

Create the GitHub release from the prepared version without another version commit. Then refresh:

- PR merged state and target branch
- Production deployment and URL
- Release URL
- Any stacked-branch merge state affected by the merge

Report:

```text
Closed
- PR: <number and URL>
- Merge: <commit>
- Release: <version and URL>
- Production: <URL and health>
- Gates: <required checks that ran>
- Proof: <real user path>
- Follow-up: <items or none>
```

State any post-merge action the user must perform. Never call the work merge-ready or released from stale state.
