---
name: hypt-implement
description: "Implements an approved plan or spec as a focused coding pass. Use when hypt-build delegates implementation or the user asks to implement executable work without the full shipping workflow."
metadata:
  short-description: "Implement Approved Work"
---

# hypt-implement — Implement Approved Work

Own the coding pass. `hypt-build` owns discovery, plan review, PRs, broad review, deployment proof, and close.

## Inputs

Require:

- An executable plan, spec, or ticket with acceptance criteria
- Repository instructions and the relevant existing code
- The allowed scope and known constraints

Return to the caller when a missing product decision would change the implementation materially.

## Process

### 1. Ground

Read the repository instructions, neighboring implementation, tests, and authoritative schemas or contracts. Trace every affected caller and cross-repository boundary before changing a ratified field or interface.

Completion: the intended behavior, existing seam, affected callers, and verification command are known.

### 2. Shape

Choose the smallest coherent design:

- Build a **deep module**: useful behavior behind a small interface.
- Put the seam where behavior actually varies; one adapter is not a reason for an abstraction.
- Accept dependencies, return results, and keep side effects at boundaries.
- Model domain states explicitly; make invalid states hard to represent.
- Fix causes rather than adding guards around symptoms.
- Prefer deletion and locality over wrappers, compatibility layers, or speculative hooks.

For complicated work, consume the design consensus produced by `hypt-build`; do not restart the design process inside implementation.

Completion: one interface owns the behavior and tests can exercise that same interface.

### 3. Fire a tracer bullet

Implement the thinnest real end-to-end path first, then add depth in verifiable slices. Keep the repository runnable after each slice.

Use TDD only when the user requested it or a cheap, obvious seam can go red before the fix. Keep one crux test per distinct behavior or branch; avoid test frameworks, permutation sprawl, and speculative regression guards.

Run targeted typechecking, lint, or tests while building. Fix each slice before continuing.

Completion: every acceptance criterion is implemented and the smallest relevant checks pass.

### 4. Leave contract code

Keep comments only for invariants, gotchas, semantic definitions, or durable pointers. Keep tests that catch plausible regressions at the interface. Remove build notes, duplicated rationale, and temporary probes. If Beadcrumbs is initialized, capture durable conclusions there instead of leaving session narration in code.

Completion: the diff contains the implementation and its durable contract, not the session journal.

## Return

Return:

- Acceptance criteria completed
- Files and interfaces changed
- Checks run and their results
- Any unverified behavior or caller-owned decision

Do not create or merge the PR unless the caller explicitly delegates that ownership.
