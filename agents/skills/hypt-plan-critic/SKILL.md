---
name: hypt-plan-critic
description: "Stress-tests a non-trivial implementation plan against the request and repository. Use before hypt-build implements planned work or when the user asks for plan review."
metadata:
  short-description: "Stress-test an Implementation Plan"
---

# hypt-plan-critic — Stress-test a Plan

Turn a plausible plan into an executable one. Review the plan against both the originating request and repository evidence.

## Inputs

Require the plan and original request. Locate the plan from an explicit path, current conversation, or matching `docs/` file. Ask only when more than one candidate remains.

Pipeline mode comes from `hypt-build`: update the plan autonomously and return control. Standalone mode presents decisions to the user.

## 1. Ground

Read repository instructions and the code, schemas, tests, configs, and docs the plan expects to change. Verify every named file, interface, command, and dependency rather than trusting the plan.

Completion: each plan step points to a real seam or explicitly creates one.

## 2. Size the review

Use a quick pass only when the work is local, reversible, and has no auth, data, payment, external integration, or cross-module effect. Everything else gets the full rubric.

## 3. Apply the rubric

Review in this order:

1. **Intent:** every requested behavior and acceptance criterion is represented.
2. **Sequence:** dependencies are ordered and each step ends in a verifiable state.
3. **Data and security:** auth, authorization, validation, secrets, migrations, destructive behavior, and tenant boundaries are explicit.
4. **Design:** ownership, interface, error modes, external seams, and affected callers are coherent; avoid speculative abstractions.
5. **Operations:** environment, rollout, rollback, observability, and post-merge work are covered when relevant.
6. **Proof:** each distinct behavior has the lightest credible check, including a real user path for user-facing work.

Classify findings:

- **Blocker:** implementation would guess, break a contract, risk security/data, or lack a credible proof path.
- **Improvement:** the plan remains executable but should be clearer, smaller, or better ordered.

Completion: every rubric branch is either addressed or marked not applicable with repository evidence.

## 4. Resolve

In pipeline mode:

- Repair improvements directly in the plan.
- Choose a repository-consistent default for reversible issues.
- Return blockers to `hypt-build` with the exact missing decision.

In standalone mode:

- Present blockers first with a recommended resolution.
- Apply accepted changes to the existing plan rather than creating an addendum.

Keep rationale near the decision it changes. Avoid review transcripts and duplicate summaries.

## Return

Report:

- Plan path
- Complexity: quick or full
- Blockers resolved or still open
- Material improvements applied
- Evidence inspected
- Verdict: executable or blocked

When executable, return control immediately to the caller.
