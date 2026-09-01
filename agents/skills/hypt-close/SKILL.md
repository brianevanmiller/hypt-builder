---
name: hypt-close
description: "Closes a ready PR through remote-state checks, merge, production deployment verification, and release. Use for an explicit close or merge request, or when hypt-build hands off yolo completion."
metadata:
  short-description: "Merge, Verify, and Release"
---

# hypt-close — Merge, Verify, and Release

Own the transition from a ready remote PR to a verified release. A direct invocation confirms before merge. A `hypt-build` yolo handoff pre-approves only that ordinary confirmation; it never bypasses failed gates, critical-test decisions, migration safety, or destructive production actions. Every step's recorded status is read off its trigger check's output, not off a sense of the branch.

## Ground

Read the repository instructions, current branch, actual PR base and head, merge-base, PR, unresolved comments, required checks, deployments, latest release, `VERSION`, changelog, migration configuration, and any configured project tracker, including Beads when `bd` is initialized. When the `beadcrumbs` skill is installed, load it before harvesting or promoting rationale. Record the expected PR head SHA before making decisions. Inspect `git worktree list --porcelain` before any branch cleanup.

## 1. Refresh the PR

Review the complete branch diff against the PR's actual base (`git diff <base>...<head>`), not a guessed `main`. Fix material correctness, security, or build issues; update affected docs and existing follow-up records without creating a new tracking system. If Beadcrumbs is initialized, follow the `beadcrumbs` skill to harvest outstanding session crumbs before merge.

Polish the PR title and body from the full branch. Include the user-visible outcome, migration or rollout work, and verification evidence. Preserve unrelated local changes; do not discard them merely to make close clean.

Completion:

- The PR is open and local `HEAD` equals its remote head SHA.
- Every intended commit and review fix is pushed.
- No uncommitted PR changes remain and no unrelated work was discarded.
- The title, body, and evidence describe the same head.

## 2. Prove the gates

Inspect required checks by name, status, conclusion, and head SHA. “No failure” is not enough: every required gate must be present and must have run on the current PR head. Also verify the required review approval and triage comments into actionable blockers versus discussion that can remain open.

When a check is missing, diagnose whether a base-branch filter, path filter, workflow trigger, stacked-PR retarget, or stale head explains it. A local check is useful evidence but never substitutes for a required remote gate. If the repository has no declared required checks, report that fact rather than inventing a gate.

For user-facing changes, require current real-path evidence:

1. Vercel preview through browser or computer use
2. Another provider's preview
3. Localhost as fallback

Reuse `hypt-build` evidence only when it targets the current head and later changes could not affect that path. Otherwise re-drive it. After three browser/tooling attempts, record the exact blocker instead of claiming proof.

Stop when a required gate is missing, pending beyond its normal duration, failing, approval is absent, or a must-fix review finding remains. Report the gate or finding and current head SHA.

## 3. Audit branch hygiene

AI-authored branches carry residue: rationale comments written as landmarks for their author, tests that were build scaffolding rather than regression contracts, and session artifacts — traces, verdicts, explainers, one-off audits — committed into the repository instead of attached to the work item. Audit all three, over branch-introduced material against the PR base. Pre-merge, so a run that stops short of merging still owes a hygiene status.

Run the trigger check — it decides the status, so read the status off its output rather than off your sense of the branch:

```bash
# Base is the PR's actual base; a stacked parent's comments and tests are out of bounds.
git diff --name-only <base>...<head> | grep -Ei '\.(test|spec)\.|_test\.|/tests?/'
git diff -U0 <base>...<head> -- . ':(exclude)*.md' ':(exclude)*.txt' ':(exclude)*.json' ':(exclude)*.html' ':(exclude)*.xml' ':(exclude)*.csv' ':(exclude)*.rst' | grep -cE '^\+\s*(//|/\*|\*|#|--)'
# Session artifacts: files this branch added under docs/ (spine excluded), or stray .html/.png/.csv.
git diff --name-only --diff-filter=A <base>...<head> -- 'docs/**' '*.html' '*.png' '*.csv' ':(exclude)docs/*-app.md' ':(exclude)docs/*-plan.md'
```

| Trigger check | Hygiene status |
|---|---|
| All three outputs empty | `skipped (no comment, test, or artifact surface)` |
| Any non-empty, the rubric flags nothing | `clean` |
| Any non-empty, the rubric flags material | `N blocks harvested · M tests cut · K held · A artifacts moved` |

`clean` says the rubric ran over the diff; `skipped` says the trigger had nothing to run on.

When any output is non-empty, read and execute [`references/branch-hygiene.md`](references/branch-hygiene.md) here: apply routine comment cleanup and clearly redundant, non-critical test cleanup automatically; move session artifacts per its sweep. Preserve tests whose removal could brick the application, corrupt or expose data, break authentication or payments, or remove the only proof of a critical deploy/user path; present those exact candidates for explicit approval instead. Record harvested rationale in one durable destination resolved by the reference's § Destinations ladder. Unlike a test cut, an artifact move needs no approval — nothing is lost, the file lands on the work item — but the close report names every file moved and where it landed. This audit is the backstop for `hypt-build`'s contract sweep; a non-empty trigger means that sweep never ran. Unsure? Run it — a false run costs one clean pass; a missed one ships scaffolding to the default branch under a green check.

After any hygiene edit, commit with repository conventions, push, and return to Step 2. Do not call the PR ready from checks or approval attached to an older head.

## 4. Sweep freshness

Re-read comments, tests, docs, PR text, release notes, migration notes, and verification evidence touched by this work. They must describe the current PR head, including any late review reversal.

Keep interface behavior, plausible regression tests, invariants, gotchas, semantic definitions, and durable ticket pointers. Remove build narration, discarded-design rationale, duplicate permutations, change detectors, and temporary probes according to Step 3's reference.

Completion: remote code, proof, and prose all describe the same revision, and every hygiene candidate has either been handled or explicitly held for the user.

## 5. Resolve migration and rollout work

Run the trigger check:

```bash
git diff --name-only <base>...<head> | grep -Ei '(^|/)migrat(e|ion)s?(/|$)|(^|/)(seeds?|backfills?)(/|$)|\.sql$|schema\.|(^|/)\.env|docker-compose'
```

Scan the PR title, body, and changed docs for environment, queue, cache, and other post-merge operations the paths cannot reveal. When either finds one, read and execute [`references/migration-reconciliation.md`](references/migration-reconciliation.md). It detects the repository's documented migration mode instead of assuming a framework.

Offer the exact documented pre-merge command when the merged code can read a schema or data change before deployment guarantees that change. Run it only after the user explicitly approves the pre-merge operation; yolo approval does not cover migration decisions. Never invent a command or use reset/force/dev/destructive operations as a substitute.

After a successful merge, automatically run the repository's documented, deploy-safe migration command when migrations are not already part of the provider deployment. Run it once, capture the result, verify the target environment and migration state, and be loud about any failure. An interactive production confirmation, irreversible migration, missing command, or uncertain target is a human safety stop, not a reason to guess. A migration failure blocks the release.

Completion: migration status is `none` when the trigger output and scan are both empty, or the exact pre-merge and post-merge actions, target, verification, and any blocker are recorded.

## 6. Prepare the release

Check whether the repository versions releases:

```bash
git ls-files VERSION 'CHANGELOG*' && gh release list --limit 1
```

Empty output from both means the repository does not version releases; record `Release: none (not versioned)` and move on. Otherwise compare the latest GitHub release, `VERSION`, and changelog:

- Keep an already prepared coherent version newer than the latest release.
- Otherwise choose a patch for fixes or small maintenance, or a minor for features and significant enhancements.
- Ask only when the bump is genuinely ambiguous.

Update version and changelog on the feature branch, commit, and push. Return to Step 2, then refresh the PR summary and Step 4 freshness evidence on the new head.

## 7. Confirm or accept yolo

If a configured tracker is available — including Beads when `bd` is initialized — identify referenced tickets from the PR title, body, and commits. Present proposed ticket closure separately and never infer closure from a merge. Keep any ticket with outstanding rollout work open. Ask before changing ticket state; if no tracker is configured, record follow-up in the PR or repository convention instead.

Present the PR number and URL, base and head SHA, change size, approval, required checks that ran, real-path proof, hygiene result, migration result, prepared version, and worktree cleanup plan.

When `hypt-build` invoked this skill in yolo mode, mark this ordinary merge/deploy/release confirmation as pre-approved and continue. Otherwise ask:

> Merge, deploy, and release? (yes/no)

Proceed only after direct confirmation or the recorded yolo pre-approval. Critical-test changes, migration operations, irreversible actions, and ticket closure still require their own explicit decisions.

## 8. Merge safely

Immediately before merging, refresh the PR and re-check state, head SHA, base branch, approval, actionable comments, required checks, and mergeability. Confirm Steps 3 and 5 each recorded a status from their trigger checks; run any gate whose status is missing before merging. If a stacked parent changed the base, rebase or resolve conflicts, let newly applicable gates run, and repeat the checks.

Use squash merge without branch deletion:

```bash
gh pr merge <PR_NUMBER> --squash
```

Never pass `--delete-branch` from a worktree. If `git worktree list --porcelain` shows the branch, leave the worktree and branch intact; do not switch, reset, or clean it merely to finish close. On merge failure, stop with the exact conflict, check, or merge-state reason.

Fetch the target branch after merge and record the merged PR number and commit. A successful merge is not yet a release.

## 9. Verify production and post-merge operations

Invoke `hypt-deploy` in production mode for the merged commit. Wait within its bounds for the expected deployment. When Step 5 identified a documented migration command that the provider did not execute, run it after the merged deployment is available, exactly once, then repeat the health and migration-state checks. If the command fails, targets the wrong environment, requests an interactive confirmation, or leaves state uncertain, stop loudly and do not create a release; carry the exact evidence into the follow-up or recovery path.

Require both provider success for the merged SHA and application health on the real target path. A provider access block follows `hypt-deploy`'s remediation path and is never silently treated as success. A release requires production evidence.

Apply only previously confirmed ticket closures after their rollout work is complete. Never close tickets silently.

## 10. Release and re-check

Create the GitHub release from the prepared version without another version commit. Then refresh:

- PR merged state, target branch, and merge commit
- Production deployment, merged SHA, migration result, and URL
- Release URL
- Any stacked-branch merge state affected by the merge
- Configured ticket state and outstanding follow-up

Report:

```text
Closed
- PR: <number and URL>
- Merge: <commit>
- Release: <version and URL / none (not versioned)>
- Production: <URL and health>
- Gates: <required checks that ran on <head SHA>>
- Proof: <real user path>
- Hygiene: <skipped (no comment, test, or artifact surface) / clean / N blocks harvested · M tests cut · K held · A artifacts moved>
- Artifacts: <each moved file → where it landed / none>
- Migrations: <none (trigger output empty) / pre-merge command / post-merge command and verification / blocker>
- Tickets: <closed with confirmation / left open with reason / tracker unavailable>
- Follow-up: <items or none>
```

State any post-merge action the user must perform. Never call the work merge-ready or released from stale state.
