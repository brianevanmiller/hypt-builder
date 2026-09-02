---
name: hypt-implement
description: "Implements an approved plan or spec as a focused coding pass. Use when hypt-build delegates implementation or the user asks to implement executable work without the full shipping workflow."
metadata:
  short-description: "Implement Approved Work"
---

# hypt-implement — Implement Approved Work

Own the coding pass. `hypt-build` owns discovery, plan review, PRs, broad review, deployment proof, and close.

## Inputs

An executable plan, spec, or ticket with acceptance criteria, plus the allowed scope and known constraints. Return to the caller when a missing product decision would materially change the implementation.

## 1. Ground

Read the repository instructions, neighboring implementation, tests, and authoritative schemas or contracts. Trace every affected caller and cross-repository boundary before changing a ratified field or interface.

Completion: the intended behavior, existing seam, affected callers, and verification command are known.

## 2. Shape

Choose the smallest coherent design: a **deep module** with useful behavior behind a small interface; the seam where behavior actually varies (one adapter is not a reason for an abstraction); dependencies accepted, results returned, side effects at boundaries; domain states explicit so invalid states are hard to represent; causes fixed rather than symptoms guarded; deletion and locality over wrappers, compatibility layers, or speculative hooks. For complicated work, consume `hypt-build`'s design consensus rather than restarting design here.

Completion: one interface owns the behavior and tests exercise that same interface.

## 3. Fire a tracer bullet

Implement the thinnest real end-to-end path first, then add depth in verifiable slices, keeping the repository runnable after each. TDD only when the user requested it or a cheap, obvious seam can go red first; one crux test per distinct behavior or branch, without new test frameworks, permutation sprawl, or speculative regression guards. Run targeted typecheck, lint, or tests while building and fix each slice before continuing.

Completion: every acceptance criterion is implemented and the smallest relevant checks pass.

## 4. Leave contract code

Keep comments only for invariants, gotchas, semantic definitions, or durable pointers, and tests that catch plausible regressions at the interface. Remove build notes, duplicated rationale, and temporary probes; when Beadcrumbs is initialized, capture durable conclusions there instead.

Completion: the diff contains the implementation and its durable contract, not the session journal.

## Return

Acceptance criteria completed; files and interfaces changed; checks run and their results; any unverified behavior or caller-owned decision. Create or merge the PR only when the caller explicitly delegates that ownership.
