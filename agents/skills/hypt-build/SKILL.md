---
name: hypt-build
description: "Builds work from its current readiness state through a proven, reviewed PR. Use for build requests and for yolo, ship it, or publish it; full-auto phrases continue through hypt-close."
metadata:
  short-description: "Build to a Proven PR or Yolo Through Close"
---

# hypt-build — Build to a Proven PR

Own the path from current state to a remote, review-ready PR. In **yolo mode**, continue into `hypt-close` with its confirmation gate pre-approved.

## Ground

Read:

- Repository instructions and the user's Identity section in `AGENTS.md` or `CLAUDE.md`
- `git status`, current branch, recent commits, and the merge-base with the target branch
- Current PR, comments, checks, and deployment state when present
- The originating request, spec, plan, and related shipped code
- Optional local ledgers when present: Beads (`bd`) and Beadcrumbs (`bdc` plus the `beadcrumbs` skill)

Use the profile only to shape communication: technical visuals are for coders; non-coders get plain-language outcomes and instructions.

When Beads is initialized, use it as the project tracker instead of markdown TODOs; keep dated `docs/` plans as the human-facing build plan. When Beadcrumbs is initialized, load the `beadcrumbs` skill and follow it for capture, harvest before opening a PR, and promotion. If `bdc` is present without that skill, report the missing install and do not emulate it.

## 1. Route readiness

Classify before editing:

| State | Route | Completion |
|---|---|---|
| Already shipped | Prove the behavior exists on the target branch and stop. | Show the merged PR or source. |
| Fog: too large for one session | Use `wayfinder`. | The decision map makes the next build slice executable. |
| Ambiguous outcome | Use `grilling` or a short discovery pass. | Acceptance criteria distinguish done from not-done. |
| Open design | Run the design pass below. | One design is chosen with tradeoffs recorded. |
| Executable | Continue. | Scope, behavior, and verification are concrete. |

For complicated design, spawn two read-only subagents over the same problem and code:

1. One uses `codebase-design`.
2. One uses pstack `architect`.

Run the first pass in parallel. Give each subagent the other's summary for one short response, then synthesize their consensus and disagreements before choosing the deepest coherent design. If one companion is unavailable, use the other and report the missing perspective.

## 2. Plan the slice

Reuse an existing plan when it still matches the request. Otherwise write a concise plan in the repository's existing tracker — Beads when initialized — or `docs/<YYYY-MM-DD>-<slug>-plan.md`.

For non-trivial work, invoke `hypt-plan-critic` in pipeline mode with the plan and original request. Resolve blockers; let it update lesser issues autonomously.

Completion: every acceptance criterion maps to an implementation step and a verification path.

## 3. Implement

Create a PR branch when needed, then invoke `hypt-implement` with the approved plan, request, and scope. Continue immediately when it returns.

Run the smallest relevant checks during implementation. Default testing is light:

- Use TDD only when requested or when a cheap, obvious seam can fail first.
- Keep the crux and distinct behavioral paths.
- Skip new test infrastructure, per-value permutations, and speculative guard suites.

Completion: the implementation satisfies the plan and targeted checks pass.

## 4. Open the proof surface

Commit and push using repository conventions; create or update the PR with the request, approach, and checks. Wait for the preview deployment when the change has a user-facing path.

Prove behavior through browser or computer use:

1. Prefer the Vercel preview attached to the PR.
2. Use another provider's preview when applicable.
3. Use localhost only when no usable preview exists.

Exercise the real path, capture the resulting state, and verify important side effects. Spend at most three attempts on browser/tooling access; then record the exact blockage.

Completion: the requested path works in a real UI/runtime, or the report names why it could not be proven.

## 5. Review to green

### Standards and spec

Invoke Matt Pocock's `code-review` against the PR merge-base. Give it the originating spec directly. Keep its two axes separate:

- **Standards:** repository rules and code smells
- **Spec:** missing, extra, or incorrect behavior

If `code-review` is unavailable, report the incomplete companion installation and run the same two briefs with independent read-only reviewers. Fix every material finding and rerun affected checks.

### Adversarial pass

Run one capped adversarial pass with pstack `interrogate`. Require severity, confidence, reachability on real data, `file:line`, and a concrete failure scenario. If unavailable, use one independent read-only reviewer with the same brief.

Fix material findings. Reject unreachable or incorrect findings with repository evidence. The cap is one pass plus verification of substantial fixes, not an open-ended review loop.

Completion: both review axes and the adversarial pass have explicit dispositions; fixes are pushed.

## 6. Sweep the contract

Run the trigger check over the branch diff against the merge-base — its output decides whether the sweep has surface:

```bash
git diff --name-only <merge-base>...HEAD | grep -Ei '\.(test|spec)\.|_test\.|/tests?/'
git diff -U0 <merge-base>...HEAD -- . ':(exclude)*.md' ':(exclude)*.txt' ':(exclude)*.json' ':(exclude)*.html' ':(exclude)*.xml' ':(exclude)*.csv' ':(exclude)*.rst' | grep -cE '^\+\s*(//|/\*|\*|#|--)'
```

Sort the comments and tests it surfaces:

- **Contract:** interface behavior, a plausible regression, invariant, gotcha, semantic definition, or durable ticket pointer
- **Scaffolding:** build narration, discarded-design rationale, duplicate permutations, change detectors, or temporary probes

Keep the contract. Move long decision rationale to the tracker when one exists, or capture and harvest it with Beadcrumbs when that ledger is initialized; remove the scaffolding. Re-read docs and comments after late review fixes so they describe the current code. `hypt-close` Step 3 is the backstop for this sweep — it firing means this sweep didn't run.

Completion: the remote PR contains every fix, no session journal, current verification notes, and no stale artifact.

## 7. Hand off

Confirm local `HEAD` equals the PR head SHA and required checks have started. Report the PR, user-path proof, checks, review dispositions, and any blocked evidence.

For a coder profile, use HumanLayer `show-me` for the smallest useful technical visual. Use Archify only when a substantial architecture or workflow warrants a polished standalone artifact. For a non-coder or uncertain profile, explain behavior and next actions without a technical diagram.

Outside yolo mode, stop at:

> Pipeline complete. PR is proven, reviewed, and ready.

In yolo mode, invoke `hypt-close`, state that the user's original phrase pre-approved its confirmation gate, and continue until close completes or reaches a safety stop.

## Safety stops

Stop for a security vulnerability, destructive data operation, unresolved product ambiguity, or a persistent failure after two focused repair attempts. Make reversible implementation decisions autonomously.
