# Session Artifacts — Plan

Port Balto's ticket-artifacts hygiene into hypt as **session artifacts** (the default destination here is a PR, not a ticket), and make `hypt-build` attach them as they are produced instead of committing them to `docs/`.

## Decisions

- **Term:** *session artifact* — anything a session produces whose whole job is to serve one unit of work (trace, verdict, root-cause writeup, `show-me`/Archify HTML, diagram, one-off audit). Test: *would anyone read this who is not working this change?* Loose existing uses of "artifact" in `hypt-build` are reworded so the term has one meaning.
- **Artifact is the default.** A branch-added file stays in `docs/` only when it is affirmatively durable — cited by something outside this change. Borderline is an artifact. There is no third "ask the user" verdict.
- **Destination = the existing four-rung ladder** in `hypt-close` § branch-hygiene (tracker → PR description/decision doc → Beadcrumbs → follow-up file), promoted to a shared section so comment harvest and the artifact sweep are one list with two consumers. No tracker configured → the PR is the default, not a fallback.
- **Move first, then report.** No approval gate (nothing is lost — one revert undoes it). The close report names every moved file and where it landed.
- **Move mechanics:** rewrite repo-relative links and same-file anchors before attaching; repoint every inbound link; supersede in place, never accumulate a v2. Attach nothing containing a secret.
- **Exclusions (by name-shape, not hope):** `docs/<YYYY-MM-DD>-<slug>-app.md` and `-plan.md` are the durable spine — excluded in the trigger check pathspec. Only branch-**added** files (`--diff-filter=A`); modified pre-existing docs and a stacked parent's additions are out of bounds.
- **hypt-start tracker preference:** the handoff says to confirm with Brian before touching `hypt-start` Step 4. Until then, the sweep reads a tracker preference from the project record if one names it and otherwise resolves to the PR; older projects degrade silently.

## Changes

| File | Change |
|---|---|
| `agents/skills/hypt-close/SKILL.md` Step 3 | Third trigger check + third residue type in prose; status table grows artifact counts |
| `agents/skills/hypt-close/SKILL.md` Step 10 | Report grows an `Artifacts:` line naming each moved file and destination |
| `agents/skills/hypt-close/references/branch-hygiene.md` | Promote destination ladder; new § Session artifact sweep (definition, verdict table, three-step move, supersede rule); retitle; extend execution order |
| `agents/skills/hypt-build/SKILL.md` Step 6 | Contract sweep sorts a third thing; `hypt-close` Step 3 backstop framing kept |
| `agents/skills/hypt-build/SKILL.md` Step 7 | `show-me`/Archify output is a session artifact — attach to tracker/PR as produced, not committed |
| `CHANGELOG.md` / `VERSION` | Minor bump to `v0.33.0` (behavior addition, not a fix) |

Trigger check (base-resolution convention, `--diff-filter=A`, spine excluded):

```bash
git diff --name-only --diff-filter=A <base>...<head> \
  -- 'docs/**' '*.html' '*.png' '*.csv' \
  ':(exclude)docs/*-app.md' ':(exclude)docs/*-plan.md'
```

## Verification

- `node scripts/validate-agent-skills.mjs`
- `npx skills add . --list`
- `bin/hypt-security-scan --mode blocking --all`
- The new sweep, run against this branch, returns empty (this plan matches the excluded `-plan.md` shape) or explains itself.

Reference: Balto `agents/core/documentation.md` § Ticket artifacts and `.claude/skills/close/references/branch-hygiene.md` § Artifact sweep (merged PR #1844, ENG-1635).
