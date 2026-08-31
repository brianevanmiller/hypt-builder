# Branch Hygiene: Comments, Tests, and Session Artifacts

Run this reference from `hypt-close` when either branch-hygiene trigger check in Step 3 is non-empty. Resolve the PR's actual base first, then scope every inspection to:

```bash
git diff <base>...<head>
```

Pre-existing material, including material inherited from a stacked parent, is out of scope. Record the starting head SHA so a re-run can distinguish new material from an already audited block.

## Comment harvest

Classify every branch-introduced multi-line comment block:

| Verdict | Applies to | Action |
|---|---|---|
| **Keep long** | File-header orientation or interface/seam contract | Leave it in place. |
| **Trim** | A valuable invariant, gotcha, semantic definition, or non-obvious why that is over-explained | Keep the contract in one concise line; add an existing issue or document pointer when useful. |
| **Harvest** | Decision history, review-round narration, rejected alternatives, prototype notes, or build landmarks | Move the durable conclusion and rationale to one existing destination, then remove the narration from code. |

A mixed block is **Harvest** when it is mostly history. Preserve only a live invariant as a **Trim** one-liner. Do not preserve prose that merely restates the diff.

Keep one consolidated harvest per close run. On a re-run, extend the existing record instead of creating a duplicate. If no destination is clear, ask before making an external tracker write; a short PR-description note is the default when the repository allows it.

## Destinations

One ladder serves both the comment harvest and the session artifact sweep. Use the first rung already supported by the repository:

1. An existing issue, ticket, or project tracker record, including a Beads issue when `bd` is initialized — a hypt project's record (`docs/<YYYY-MM-DD>-<slug>-app.md`) names its tracker when onboarding established one.
2. An initialized Beadcrumbs ledger when `bdc` is installed. Capture the concise conclusion, not a transcript or secret, and follow the installed `beadcrumbs` skill for provenance, harvest, and any Beads destination. Do not initialize a ledger without asking.
3. The PR description, a PR comment, or an existing decision/ADR document.
4. The repository's normal follow-up file when no better destination exists.

With no tracker, the PR is the default landing for a session artifact — not an emergency fallback.

## Test cleanup

Classify branch-introduced tests by the failure they protect. Routine scaffolding can be cleaned up automatically when it is clearly redundant:

- **Change detectors** assert that a constant, fixture, or copied value still equals itself.
- **Per-value permutations** re-prove one mapping through a heavier path when a table-style test already covers the vocabulary.
- **Trivial passthrough/default tests** assert behavior guaranteed by the type system or an unchanged framework default.
- **Co-failing pairs** duplicate the same assertion and can fail only together.

Fold a distinct useful assertion into the keeper before removing its shell. Keep:

- The ticket or request's crux failure mode.
- One test for each distinct code path or branch arm.
- Table-style vocabulary tests.
- Deliberate policy and security pins.
- Tests covering authentication, authorization, tenant isolation, data integrity, payments, migrations, startup/deployment, or the only proof of a critical user path.

A test is **critical** when removing it could brick the application, corrupt or expose data, deny access, charge incorrectly, prevent deployment, or remove the only credible check of a critical path. If that impact is plausible but not clear, preserve the test and ask rather than deleting it.

For every automatic cut or fold, retain the crux assertion and mention the result in the close report. For every critical candidate, present:

```text
<test name> → hold for approval → <failure or safety path it protects>
```

Wait for the user's explicit approval before deleting or folding a critical candidate. A yolo handoff does not approve these edits. If the user declines, record that decision in the selected § Destinations rung so a later close run does not repeatedly raise the same unchanged test.

## Session artifact sweep

Scope: files this branch **added** under `docs/`, plus stray `.html` / `.png` / `.csv` anywhere in the diff — exactly what the third trigger check in Step 3 returns:

```bash
git diff --name-only --diff-filter=A <base>...<head> -- 'docs/**' '*.html' '*.png' '*.csv' ':(exclude)docs/*-app.md' ':(exclude)docs/*-plan.md'
```

Modified pre-existing docs are out of bounds — someone put them there on purpose — and `<slug>-app.md` / `<slug>-plan.md` are the project's durable spine, excluded by name-shape in the trigger check rather than by judgment. A stacked parent's additions are out of scope with everything else pre-branch.

A **session artifact** is anything a session produces whose whole job is to serve one unit of work: a trace, a verify-or-fix verdict, a root-cause writeup, a `show-me`/Archify HTML explainer, a diagram, a one-off audit. One question per file: **would anyone read this who is not working this change?** Left in the repo it becomes a snapshot of numbers nobody re-runs; on the work item it sits beside the work it explains and ages honestly.

| Verdict | What it is | Action |
|---|---|---|
| **Durable** | A methodology, contract, architecture or design doc a future build opens, cited by something outside this change | Stays in `docs/`. Nothing to do. |
| **Session artifact** (default) | Everything else — including anything that reads durable but only this change cites it | Attach to the work item, delete from the repo, repoint every inbound link |

Attaching loses nothing, so **move first, then report — unlike the test scan.** The move is one revert away, so no approval gate; instead the close report **names every file moved and where it landed** so the user can promote any of them back to `docs/`. Never silently drop one from the report.

Moving one is three steps, and skipping the third leaves a dead link on the default branch:

1. Attach where the § Destinations ladder resolves — prose inline on the tracker issue or PR, binaries and standalone files as an attachment or gist-style link per what the platform allows. **Rewrite repo-relative links and same-file anchors first**; neither resolves once the file leaves the repo. Attach nothing containing a secret.
2. `git rm` the file.
3. Repoint every inbound reference — other docs, the PR body — at the artifact's destination. `grep -rn "<basename>"` to find them; there is usually more than one.

If the artifact already exists at the destination from an earlier round, **supersede it** rather than adding a second copy: edit the record in place, or delete-then-reattach. Two versions of one trace is worse than none — the reader cannot tell which is live, and the stale one is the more confident-looking. Updating an artifact is part of whatever review round invalidated it, not follow-up work.

## Execution order

1. Classify comments, tests, and session artifacts from the branch diff.
2. Prepare the harvest record, the critical-test hold list, and each artifact's destination.
3. Attach every artifact move per § Session artifact sweep — links rewritten, superseding in place.
4. Write the harvest to the selected § Destinations rung. Use `bdc` only when it is installed and initialized; absence is not a blocker.
5. Apply routine comment trims and non-critical test cuts/folds, `git rm` moved artifacts, and repoint inbound links. Keep critical candidates unchanged until approved.
6. Commit hygiene edits with repository conventions, push, and repeat the gate-presence check on the new head.
7. Report `hygiene: clean` when no branch-introduced material needs action, otherwise report the destination, edits, held decisions, and every artifact moved with where it landed.

An audit that changes nothing does not need a commit. Never widen the audit to unrelated tests, comments, or docs merely to make the report look complete.
