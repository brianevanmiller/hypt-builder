# Plan: Package audit gate on hypt-close

Port Balto's four-axis dependency-upgrade audit into Hypt as a **disclosed close gate**, not a new skill. `hypt-close` keeps a one-line trigger-plus-pointer; the procedure lives in `agents/skills/hypt-close/references/package-audit.md`. Generalize off Balto's Bun/uv scripts and repo-specific surfaces; keep Bun as the preferred JavaScript path.

Also give `hypt-build` an instruction-work path so a docs/skills-only request does not get forced through `hypt-implement`, preview proof, or code-review.

## Acceptance criteria

1. No new installable skill. `agents/skills/` stays at the current nine names.
2. `hypt-close` loads `package-audit.md` only when a trigger check shows a new package identity on the PR (manifest, lockfile, or GitHub Action pin). Empty trigger records `packages: none` and continues.
3. The reference is portable across Hypt projects: four-axis audit, fail-closed on `UNVERIFIED`/malware/reachable high-or-critical, Bun when the project has it, generic registry/advisory queries otherwise. No Balto scripts, no `uv`/`pip-audit`/`pyproject` as required tooling, no this-repo lockfile names.
4. Yolo does not pre-approve a `block` or `defer`. A finding that would change the graph is investigation, not an automatic pin/override/downgrade.
5. Close report, merge recheck, and yolo-scope list include the package-audit status.
6. `hypt-build` classifies instruction-only work (skills, references, agent docs) and skips the coding-pass companions; proof is the documented validation commands plus a walkthrough of the new trigger.
7. Writing follows `writing-for-agents`: one meaning, one place; trigger check decides status; branch-only procedure stays behind the pointer.

## Steps

1. Add [`agents/skills/hypt-close/references/package-audit.md`](../agents/skills/hypt-close/references/package-audit.md) as the procedure: inspect → four axes → decide → return. Mirror the hygiene/migration references (run-from line, completion, return block). Keep Bun (`bun pm ls`, `bun audit --json`) when a `bun.lock`/`bun.lockb` owns the surface; otherwise use the manager that owns the lockfile plus OSV and registry metadata. GitHub Action pins verify `runs.using` at the pinned ref.
2. Insert the gate in `hypt-close` after hygiene and before freshness, matching Step 3/5 shape: trigger command, pointer, completion, status vocabulary. Renumber later steps so merge still confirms every pre-merge gate by number.
3. Thread the status through the yolo-scope sentence, Step 8 recheck, Step 7 presentation, and the Step 10 report line.
4. In `hypt-build`, add an **Instruction work** readiness row and a paired implement/proof/review branch: edit the named files directly, validate with the repository's agent-source commands, skip `hypt-implement` / preview / `code-review` / `interrogate`. Keep the contract sweep and PR handoff.
5. Verify with `node scripts/validate-agent-skills.mjs`, `npx skills add . --list`, and `bin/hypt-security-scan --mode blocking --all`. Walk the trigger against this branch (should be `packages: none`) and against a hypothetical `package.json` add.

## Non-goals

- Copying Balto's `dependency_delta.ts`, advisory, or registry scripts into Hypt.
- Auditing version bumps of already-present packages, or installing `dependency-upgrade-audit` as a companion.
- Changing Hypt's own shipped dependency graph (this repo has none that close would merge).

## Verification

| Criterion | Proof |
|---|---|
| No new skill | `npx skills add . --list` still lists the current nine |
| Trigger is empty here | `git diff --name-only <base>...<head>` against the package-surface grep is empty |
| Close loads the reference only on surface | SKILL.md pointer + empty-trigger completion |
| General + Bun | `package-audit.md` has no required uv/pip path; Bun commands are the JS default |
| Instruction path | `hypt-build` readiness table has the row; implement/proof/review skip coding companions on that row |
