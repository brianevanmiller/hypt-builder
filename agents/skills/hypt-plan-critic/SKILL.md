---
name: hypt-plan-critic
description: "Stress-tests a non-trivial implementation plan against the request and repository. Use before hypt-build implements planned work or when the user asks for plan review."
metadata:
  short-description: "Stress-test an Implementation Plan"
---

# hypt-plan-critic — Stress-test a Plan

Turn a plausible plan into an executable one by reviewing it against the originating request and repository evidence.

## Inputs

The plan and the original request. Locate the plan from an explicit path, the conversation, or a matching `docs/` file; ask only when more than one candidate remains. **Pipeline mode** (invoked by `hypt-build`) updates the plan autonomously and returns control; **standalone mode** presents decisions to the user.

## 1. Ground

Read repository instructions and the code, schemas, tests, configs, and docs the plan expects to change, verifying every named file, interface, command, and dependency rather than trusting the plan.

Completion: each plan step points to a real seam or explicitly creates one.

## 2. Size the review

Quick pass only when the work is local, reversible, and has no auth, data, payment, external-integration, or cross-module effect. Everything else gets the full rubric.

## 3. Apply the rubric

In order:

1. **Intent:** every requested behavior and acceptance criterion is represented.
2. **Sequence:** dependencies are ordered and each step ends in a verifiable state.
3. **Data and security:** auth, authorization, validation, secrets, migrations, destructive behavior, and tenant boundaries are explicit.
4. **Design:** ownership, interface, error modes, external seams, and affected callers are coherent, without speculative abstractions.
5. **Operations:** environment, rollout, rollback, observability, and post-merge work are covered when relevant.
6. **Proof:** each distinct behavior has the lightest credible check, including a real user path for user-facing work.

A **blocker** means implementation would guess, break a contract, risk security or data, or lack a credible proof path. An **improvement** leaves the plan executable but clearer, smaller, or better ordered.

Completion: every rubric branch is addressed or marked not applicable with repository evidence.

## 4. Resolve

Pipeline mode: repair improvements in the plan, choose a repository-consistent default for reversible issues, and return blockers to `hypt-build` with the exact missing decision. Standalone mode: present blockers first with a recommended resolution and apply accepted changes to the existing plan rather than an addendum. Keep rationale next to the decision it changes, without review transcripts or duplicate summaries.

## Return

Plan path; complexity (quick or full); blockers resolved or still open; material improvements applied; evidence inspected; verdict (executable or blocked). When executable, return control immediately to the caller.
