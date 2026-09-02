---
name: hypt-close
description: "Closes a ready PR through remote-state checks, merge, production deployment verification, and release. Use for an explicit close or merge request, or when hypt-build hands off yolo completion."
metadata:
  short-description: "Merge, Verify, and Release"
---

# hypt-close — Merge, Verify, and Release

Own the transition from a ready remote PR to a verified release. A direct invocation confirms before merge. A `hypt-build` yolo handoff pre-approves only that ordinary confirmation: failed gates, critical-test deletions, migration operations, irreversible actions, and ticket closure each still need their own explicit decision. Every gate's recorded status comes from its trigger check's output, not from a sense of the branch.

## Ground

Read repository instructions, current branch, the PR's actual base and head, merge-base, unresolved comments, required checks, deployments, latest release, `VERSION`, changelog, migration configuration, and any configured tracker (Beads when `bd` is initialized). When the `beadcrumbs` skill is installed, load it before harvesting or promoting rationale. Record the expected PR head SHA before deciding anything, and inspect `git worktree list --porcelain` before any branch cleanup.

## 1. Refresh the PR

Review the full branch diff against the PR's actual base (`git diff <base>...<head>`). Fix material correctness, security, or build issues and update affected docs and existing follow-up records; when Beadcrumbs is initialized, harvest outstanding session crumbs per the `beadcrumbs` skill before merge. Polish the title and body from the full branch: user-visible outcome, migration or rollout work, and verification evidence. Preserve unrelated local changes.

Completion: the PR is open, local `HEAD` equals its remote head SHA, every fix is pushed, nothing unrelated was discarded, and title, body, and evidence describe that head.

## 2. Prove the gates

Inspect required checks by name, status, conclusion, and head SHA: every required gate must be present and must have run on the current head; "no failure" is not enough. Verify the required approval and triage comments into actionable blockers versus discussion that may stay open. Diagnose a missing check (base-branch filter, path filter, workflow trigger, stacked-PR retarget, stale head). A local check is evidence, never a substitute for a required remote gate. With no declared required checks, report that fact rather than inventing a gate.

User-facing changes need current real-path evidence in `hypt-build`'s order: Vercel preview through browser or computer use, another provider's preview, then localhost. Reuse `hypt-build` evidence only when it targets the current head and later changes could not affect that path. After three browser/tooling attempts, record the exact blocker instead of claiming proof.

Stop when a required gate is missing, pending beyond its normal duration, or failing, when approval is absent, or when a must-fix finding remains, reporting the gate or finding and the current head SHA.

## 3. Audit branch hygiene

Audit branch-introduced comments (author landmarks), tests (build scaffolding), and session artifacts (traces, verdicts, explainers, one-off audits committed instead of attached to the work item) against the PR's actual base, so a stacked parent's material is out of bounds, and before merge, so a run that stops short still owes a status. Run the trigger check:

```bash
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

When any output is non-empty, execute [`references/branch-hygiene.md`](references/branch-hygiene.md): routine comment and non-critical test cleanup is automatic, critical-test candidates are held for explicit approval, harvested rationale lands on the rung its § Destinations ladder resolves, and session artifacts move to the work item without approval (nothing is lost) while the close report names every file moved and where it landed. A non-empty trigger means `hypt-build`'s contract sweep did not run; this audit is its backstop. Unsure? Run it: a false run costs one clean pass, a missed one ships scaffolding under a green check.

After any hygiene edit, commit with repository conventions, push, and return to Step 2; checks and approval on an older head do not make the PR ready.

## 4. Sweep freshness

Re-read comments, tests, docs, PR text, release notes, migration notes, and verification evidence touched by this work. They must describe the current head, including any late review reversal; apply Step 3's rubric to anything stale.

Completion: remote code, proof, and prose describe the same revision, and every hygiene candidate is handled or explicitly held for the user.

## 5. Resolve migration and rollout work

Run the trigger check, and scan the PR title, body, and changed docs for environment, queue, cache, or other post-merge operations that paths cannot reveal:

```bash
git diff --name-only <base>...<head> | grep -Ei '(^|/)migrat(e|ion)s?(/|$)|(^|/)(seeds?|backfills?)(/|$)|\.sql$|schema\.|(^|/)\.env|docker-compose'
```

When either finds a surface, execute [`references/migration-reconciliation.md`](references/migration-reconciliation.md); it detects the repository's documented migration mode rather than assuming a framework. Its gates hold even in yolo: a pre-merge migration runs only after the user explicitly approves the exact documented command; a post-merge migration the provider does not run is executed exactly once from the documented deploy-safe command and verified; an interactive confirmation, irreversible migration, missing command, uncertain target, or failure blocks the release. Reset, force, dev, and destructive commands are never substitutes.

Completion: migration status is `none` when trigger output and scan are both empty; otherwise the exact pre-merge and post-merge actions, target, verification, and any blocker are recorded.

## 6. Prepare the release

```bash
git ls-files VERSION 'CHANGELOG*' && gh release list --limit 1
```

Empty output from both means the repository does not version releases: record `Release: none (not versioned)`. Otherwise compare the latest GitHub release, `VERSION`, and changelog. Keep an already prepared coherent version newer than the latest release; otherwise bump patch for fixes or small maintenance and minor for features or significant enhancements, asking only when genuinely ambiguous. Update version and changelog on the feature branch, commit, push, return to Step 2, then refresh the PR summary and Step 4 evidence on the new head.

## 7. Confirm or accept yolo

With a configured tracker (Beads when `bd` is initialized), identify tickets referenced by the PR title, body, and commits and present proposed closures separately: never inferred from a merge, and never for a ticket with outstanding rollout work. Ask before changing ticket state; without a tracker, record follow-up in the PR or repository convention.

Present the PR number and URL, base and head SHA, change size, approval, gates, proof, hygiene, migrations, prepared version, and worktree cleanup plan. When `hypt-build` invoked this skill in yolo mode, mark this confirmation pre-approved and continue. Otherwise ask:

> Merge, deploy, and release? (yes/no)

Proceed only on direct confirmation or the recorded yolo pre-approval.

## 8. Merge safely

Immediately before merging, refresh the PR and re-check state, head SHA, base branch, approval, actionable comments, required checks, and mergeability. Confirm Steps 3 and 5 each recorded a status from their trigger checks; run any gate whose status is missing. If a stacked parent changed the base, rebase or resolve conflicts, let newly applicable gates run, and repeat the checks.

```bash
gh pr merge <PR_NUMBER> --squash
```

Never pass `--delete-branch` from a worktree. If `git worktree list --porcelain` shows the branch, leave the worktree and branch intact rather than switching, resetting, or cleaning to finish close. On merge failure, stop with the exact conflict, check, or merge-state reason. Fetch the target branch after merge and record the merged PR number and commit. A merge is not yet a release.

## 9. Verify production and post-merge operations

Invoke `hypt-deploy` in production mode for the merged commit and wait within its bounds. When Step 5 recorded a post-merge migration command, run it per the reference once the merged deployment is available, then repeat the health and migration-state checks; its safety stops block the release and carry the exact evidence into follow-up or recovery.

A release requires both provider success for the merged SHA and application health on the real target path; a provider access block follows `hypt-deploy`'s remediation path and is never treated as success. Apply only previously confirmed ticket closures, after their rollout work completes.

## 10. Release and re-check

Create the GitHub release from the prepared version without another version commit. Refresh merge, production, release, stacked-branch, and ticket state, then report:

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

State any post-merge action the user must perform. Merge-ready and released describe current state, never stale state.
