---
name: hypt-build
description: "Builds work from its current readiness state through a proven, reviewed PR. Use for build requests and for yolo, ship it, or publish it; full-auto phrases continue through hypt-close."
metadata:
  short-description: "Build to a Proven PR or Yolo Through Close"
---

# hypt-build — Build to a Proven PR

Own the path from current state to a remote, review-ready PR. In **yolo mode**, continue into `hypt-close` with its confirmation gate pre-approved.

## Ground

Read repository instructions and the user's Identity section (`AGENTS.md` or `CLAUDE.md`); `git status`, branch, recent commits, and the merge-base with the target branch; the current PR's comments, checks, and deployments; the originating request, spec, plan, and related shipped code; and the optional ledgers when present, Beads (`bd`) and Beadcrumbs (`bdc` plus the `beadcrumbs` skill). Identity shapes the words, not the engineering. A non-coder, and an unclear profile, stays in Hypt and receives the same senior-engineer build as a coder: design, plan review, implementation, tests, review, and running proof. Speak to them in friendly plain language, ask only when the answer changes what gets built or whether to ship, bring one recommendation, and mention a finding only when it needs a decision or could not be fixed. Leave companion-skill names, review axes, doors, blast radius, seams, and modules out of that conversation. A coder gets the technical handoff and visuals. Neither profile is sent away to run a companion skill.

An initialized Beads tracker is the project tracker (dated `docs/` plans stay the human-facing build plan). An initialized Beadcrumbs ledger means loading the `beadcrumbs` skill and following it for capture, harvest before opening a PR, and promotion; `bdc` without that skill is a missing install to report, not something to emulate.

## 1. Route readiness

Classify before editing:

| State | Route | Completion |
|---|---|---|
| Already shipped | Prove the behavior exists on the target branch and stop. | Merged PR or source shown. |
| Big and unscoped | Invoke `wayfinder` when `docs/agents/issue-tracker.md` names the tracker; otherwise write the first slice into the existing tracker or dated plan. Confirm that slice before building it. | The user has accepted one executable slice. |
| Unclear task or mini-project | `grilling` and `domain-modeling` | Acceptance criteria distinguish done from not-done. |
| Design question | `prototype` | A throwaway artifact answers how it should look or behave. Stop before a PR. |
| Open design | Design pass below | One design chosen, tradeoffs recorded. |
| Executable | Continue | Scope, behavior, and verification are concrete. |

`wayfinder` is only for a big project whose size is not yet knowable. Hypt invokes it and stays with the user. An unclear task or a mini-project uses `grilling` and `domain-modeling`. When `docs/agents/issue-tracker.md` is missing, write the first slice into the existing tracker or dated plan instead of invoking `wayfinder`, and do not chart a local-markdown map over Beads or another chosen tracker. Tracker setup stays a one-time `hypt-start` step, not a build stop.

Design pass for complicated work: two parallel read-only subagents over the same problem and code, one using `codebase-design` and one using pstack `architect`. `architect` grounds with `how` and `why` and sketches with `arena`. Give each the other's summary for one short response, synthesize consensus and disagreements, and choose the deepest coherent design. If one companion is unavailable, use the other and report the missing perspective. Choose that design yourself. Ask only when the options differ in what the user will see, what it costs, or how hard it is to undo. A non-coder hears the recommendation and that one difference.

## 2. Plan the slice

Reuse an existing plan that still matches the request; otherwise write a concise one in the repository's tracker (Beads when initialized) or `docs/<YYYY-MM-DD>-<slug>-plan.md`. For non-trivial work, invoke `hypt-plan-critic` in pipeline mode with the plan and original request; resolve its blockers and let it fix lesser issues itself.

Completion: every acceptance criterion maps to an implementation step and a verification path.

## 3. Implement

Create a PR branch when needed, invoke `hypt-implement` with the approved plan, request, and scope, and continue when it returns. Testing stays light: TDD only when requested or when a cheap, obvious seam can fail first; one crux test per distinct behavior; no new test infrastructure, per-value permutations, or speculative guard suites.

Completion: the implementation satisfies the plan and targeted checks pass.

## 4. Open the proof surface

Commit and push with repository conventions. Create or update the PR and invoke Matt's `pr` for the body: the smallest summary visual, before/after evidence, a one-way or two-way door, and blast radius, plus the request and checks. The PR keeps that shape for reviewers. A non-coder's chat report says what they can now do and where to try it, and leaves the door and blast-radius lines on the PR. For a user-facing change, wait for the preview deployment and prove the real path through browser or computer use: the PR's Vercel preview first, another provider's preview second, localhost only when no usable preview exists. Capture the resulting state and verify important side effects. After three failed browser/tooling attempts, record the exact blockage.

Completion: the requested path works in a real UI/runtime, or the report names why it could not be proven.

## 5. Review to green

Invoke Matt Pocock's `code-review` against the PR merge-base with the originating spec, keeping its axes separate: **Standards** (repository rules and code smells) and **Spec** (missing, extra, or incorrect behavior). Then run one capped adversarial pass with pstack `interrogate`, requiring severity, confidence, reachability on real data, `file:line`, and a concrete failure scenario. When the diff crosses a shared interface or public contract, invoke `blast-radius` and keep a safety claim only when that pass proved it by running code. For a missing companion, report the incomplete installation and run the same brief with independent read-only reviewers. A missing `blast-radius` still needs that one safety fact proved in place. A writeup alone leaves the claim unproven. Record every disposition. A non-coder hears a finding only when it needs a decision or could not be fixed, told either "I checked the shared part by running it" or "I could not prove that, so I am not calling it safe."

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

Confirm local `HEAD` equals the PR head SHA and required checks have started. Report the PR, user-path proof, checks, and any blocked evidence. Coder profile: also report review dispositions, and include the smallest useful technical visual via HumanLayer `show-me`, with Archify only for a substantial architecture or workflow explainer. Non-coder: say what changed, how to try it, and the next action, and say that nothing is live yet.

That visual is a session artifact: attach it to the configured tracker issue, or to the PR description or a PR comment when none is configured, as soon as it is produced, and never commit it. Rewrite repo-relative links and same-file anchors before attaching; when a later review round invalidates it, replace it in place rather than adding a second copy.

Outside yolo mode, stop. A coder hears: "Pipeline complete. PR is proven, reviewed, and ready." A non-coder hears what is ready to try and that it is not live yet.

In yolo mode, invoke `hypt-close`, state that the user's original phrase pre-approved its confirmation gate, and continue until close completes or reaches a safety stop.

## Safety stops

Stop for a security vulnerability, destructive data operation, unresolved product ambiguity, or a persistent failure after two focused repair attempts. Reversible implementation decisions are yours.
