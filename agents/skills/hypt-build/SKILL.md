---
name: hypt-build
description: "Builds work from its current readiness state through a proven, reviewed PR. Use for build requests and for yolo, ship it, or publish it; full-auto phrases continue through hypt-close."
metadata:
  short-description: "Build to a Proven PR or Yolo Through Close"
---

# hypt-build — Build to a Proven PR

Own the path from current state to a remote, review-ready PR. In **yolo mode**, continue into `hypt-close` with its confirmation gate pre-approved.

## Ground

Read repository instructions and the user's Identity section (`AGENTS.md` or `CLAUDE.md`); `git status`, branch, recent commits, and the merge-base with the target branch; the current PR's comments, checks, and deployments; the originating request, spec, plan, and related shipped code; and the optional ledgers when present, Beads (`bd`) and Beadcrumbs (`bdc` plus the `beadcrumbs` skill). Identity shapes communication only: technical visuals for coders, plain-language outcomes otherwise.

An initialized Beads tracker is the project tracker (dated `docs/` plans stay the human-facing build plan). An initialized Beadcrumbs ledger means loading the `beadcrumbs` skill and following it for capture, harvest before opening a PR, and promotion; `bdc` without that skill is a missing install to report, not something to emulate.

## 1. Route readiness

Classify before editing:

| State | Route | Completion |
|---|---|---|
| Already shipped | Prove the behavior exists on the target branch and stop. | Merged PR or source shown. |
| Fog: too large for one session | `wayfinder` | The decision map makes the next slice executable. |
| Ambiguous outcome | `grilling` or a short discovery pass | Acceptance criteria distinguish done from not-done. |
| Open design | Design pass below | One design chosen, tradeoffs recorded. |
| Executable | Continue | Scope, behavior, and verification are concrete. |

Design pass for complicated work: two parallel read-only subagents over the same problem and code, one using `codebase-design` and one using pstack `architect`. Give each the other's summary for one short response, synthesize consensus and disagreements, and choose the deepest coherent design. If one companion is unavailable, use the other and report the missing perspective.

## 2. Plan the slice

Reuse an existing plan that still matches the request; otherwise write a concise one in the repository's tracker (Beads when initialized) or `docs/<YYYY-MM-DD>-<slug>-plan.md`. For non-trivial work, invoke `hypt-plan-critic` in pipeline mode with the plan and original request; resolve its blockers and let it fix lesser issues itself.

Completion: every acceptance criterion maps to an implementation step and a verification path.

## 3. Implement

Create a PR branch when needed, invoke `hypt-implement` with the approved plan, request, and scope, and continue when it returns. Testing stays light: TDD only when requested or when a cheap, obvious seam can fail first; one crux test per distinct behavior; no new test infrastructure, per-value permutations, or speculative guard suites.

Completion: the implementation satisfies the plan and targeted checks pass.

## 4. Open the proof surface

Commit and push with repository conventions; create or update the PR with the request, approach, and checks. For a user-facing change, wait for the preview deployment and prove the real path through browser or computer use: the PR's Vercel preview first, another provider's preview second, localhost only when no usable preview exists. Capture the resulting state and verify important side effects. After three failed browser/tooling attempts, record the exact blockage.

Completion: the requested path works in a real UI/runtime, or the report names why it could not be proven.

## 5. Review to green

Invoke Matt Pocock's `code-review` against the PR merge-base with the originating spec, keeping its axes separate: **Standards** (repository rules and code smells) and **Spec** (missing, extra, or incorrect behavior). Then run one capped adversarial pass with pstack `interrogate`, requiring severity, confidence, reachability on real data, `file:line`, and a concrete failure scenario. For a missing companion, report the incomplete installation and run the same brief with independent read-only reviewers.

Fix material findings and rerun affected checks; reject unreachable or incorrect findings with repository evidence.

Completion: both review axes and the adversarial pass have explicit dispositions; fixes are pushed.

## 6. Sweep the contract

Run the trigger check over the branch diff; its output decides whether the sweep has surface:

```bash
git diff --name-only <merge-base>...HEAD | grep -Ei '\.(test|spec)\.|_test\.|/tests?/'
git diff -U0 <merge-base>...HEAD -- . ':(exclude)*.md' ':(exclude)*.txt' ':(exclude)*.json' ':(exclude)*.html' ':(exclude)*.xml' ':(exclude)*.csv' ':(exclude)*.rst' | grep -cE '^\+\s*(//|/\*|\*|#|--)'
```

Keep **contract** (interface behavior, plausible regression tests, invariants, gotchas, semantic definitions, durable ticket pointers). Remove **scaffolding** (build narration, discarded-design rationale, duplicate permutations, change detectors, temporary probes), moving long rationale to the tracker or an initialized Beadcrumbs ledger. Attach **session artifacts** (a trace, verdict, root-cause writeup, `show-me`/Archify HTML, diagram, or one-off audit whose whole job is to serve this change) where the work lives per Step 7 as soon as they are produced, and keep them out of the repository. Re-read docs and comments after late review fixes so they describe the current code. `hypt-close` Step 3 is this sweep's backstop; it firing means this sweep did not run.

Completion: the remote PR contains every fix, no session journal, current verification notes, and nothing describing an earlier revision.

## 7. Hand off

Confirm local `HEAD` equals the PR head SHA and required checks have started. Report the PR, user-path proof, checks, review dispositions, and any blocked evidence. Coder profile: the smallest useful technical visual via HumanLayer `show-me`, with Archify only for a substantial architecture or workflow explainer. Otherwise, plain-language behavior and next actions.

That visual is a session artifact: attach it to the configured tracker issue, or to the PR description or a PR comment when none is configured, as soon as it is produced, and never commit it. Rewrite repo-relative links and same-file anchors before attaching; when a later review round invalidates it, replace it in place rather than adding a second copy.

Outside yolo mode, stop at:

> Pipeline complete. PR is proven, reviewed, and ready.

In yolo mode, invoke `hypt-close`, state that the user's original phrase pre-approved its confirmation gate, and continue until close completes or reaches a safety stop.

## Safety stops

Stop for a security vulnerability, destructive data operation, unresolved product ambiguity, or a persistent failure after two focused repair attempts. Reversible implementation decisions are yours.
