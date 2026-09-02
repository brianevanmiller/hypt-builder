# Branch Hygiene: Comments, Tests, and Session Artifacts

Run from `hypt-close` Step 3 when any trigger check is non-empty. Scope every inspection to `git diff <base>...<head>` against the PR's actual base; pre-existing material, including a stacked parent's, is out of scope. Record the starting head SHA so a re-run can tell new material from an already audited block.

## Comment harvest

Classify every branch-introduced multi-line comment block:

| Verdict | Applies to | Action |
|---|---|---|
| **Keep long** | File-header orientation or interface/seam contract | Leave it in place. |
| **Trim** | A valuable invariant, gotcha, semantic definition, or non-obvious why that is over-explained | Keep the contract in one concise line, with an issue or document pointer when useful. |
| **Harvest** | Decision history, review-round narration, rejected alternatives, prototype notes, or build landmarks | Move the durable conclusion and rationale to one existing destination, then remove the narration. |

A mixed block is **Harvest** when it is mostly history; preserve only a live invariant as a **Trim** one-liner. Prose that merely restates the diff is removed. Keep one consolidated harvest per close run and extend it on a re-run. If no destination is clear, ask before writing to an external tracker; a short PR-description note is the default when the repository allows it.

## Destinations

One ladder serves the comment harvest and the session artifact sweep. Use the first rung the repository already supports:

1. An existing issue, ticket, or tracker record, including a Beads issue when `bd` is initialized; a hypt project record (`docs/<YYYY-MM-DD>-<slug>-app.md`) names its tracker when onboarding established one.
2. An initialized Beadcrumbs ledger when `bdc` is installed: the concise conclusion only, never a transcript or secret, following the installed `beadcrumbs` skill for provenance, harvest, and any Beads destination. A ledger is never initialized without asking.
3. The PR description, a PR comment, or an existing decision/ADR document.
4. The repository's normal follow-up file.

With no tracker, the PR is the default landing for a session artifact, not an emergency fallback.

## Test cleanup

Classify branch-introduced tests by the failure they protect. Clearly redundant scaffolding is cleaned up automatically:

- **Change detectors** assert that a constant, fixture, or copied value still equals itself.
- **Per-value permutations** re-prove one mapping through a heavier path when a table-style test already covers the vocabulary.
- **Trivial passthrough/default tests** assert behavior guaranteed by the type system or an unchanged framework default.
- **Co-failing pairs** duplicate the same assertion and can fail only together.

Fold a distinct useful assertion into the keeper before removing its shell. Keep the request's crux failure mode, one test per distinct code path or branch arm, table-style vocabulary tests, deliberate policy and security pins, and tests covering authentication, authorization, tenant isolation, data integrity, payments, migrations, startup/deployment, or the only proof of a critical user path.

A test is **critical** when removing it could brick the application, corrupt or expose data, deny access, charge incorrectly, prevent deployment, or remove the only credible check of a critical path. When that impact is plausible but unclear, preserve the test and ask. Present each critical candidate as:

```text
<test name> → hold for approval → <failure or safety path it protects>
```

Delete or fold a critical candidate only on the user's explicit approval; a yolo handoff does not approve it. If the user declines, record that decision on the selected Destinations rung so later close runs do not raise the same unchanged test.

## Session artifact sweep

Scope: the third trigger check, files this branch **added** under `docs/` plus stray `.html`/`.png`/`.csv` anywhere in the diff, with `<slug>-app.md` and `<slug>-plan.md` excluded by name-shape because they are the project's durable spine. Modified pre-existing docs and a stacked parent's additions are out of bounds.

A **session artifact** serves one unit of work: a trace, a verify-or-fix verdict, a root-cause writeup, a `show-me`/Archify explainer, a diagram, a one-off audit. One question per file: would anyone read this who is not working this change?

| Verdict | What it is | Action |
|---|---|---|
| **Durable** | A methodology, contract, architecture, or design doc a future build opens, cited by something outside this change | Stays in `docs/`. |
| **Session artifact** (default) | Everything else, including anything that reads durable but only this change cites | Attach to the work item, delete from the repo, repoint every inbound link. |

Attaching loses nothing, so move first and report after, unlike the test scan: no approval gate, and the close report names every file moved and where it landed so the user can promote any of them back to `docs/`. Each move has three steps, and skipping the third leaves a dead link on the default branch:

1. Attach where the Destinations ladder resolves: prose inline on the tracker issue or PR, binaries and standalone files as an attachment or gist-style link per what the platform allows. Rewrite repo-relative links and same-file anchors first, since neither resolves outside the repo. Attach nothing containing a secret.
2. `git rm` the file.
3. Repoint every inbound reference (other docs, the PR body) at the destination; `grep -rn "<basename>"` finds them.

An artifact already at the destination from an earlier round is superseded in place (edit the record, or delete-then-reattach) rather than duplicated, as part of the review round that invalidated it.

## Execution order

1. Classify comments, tests, and session artifacts from the branch diff.
2. Prepare the harvest record, the critical-test hold list, and each artifact's destination.
3. Attach every artifact move per the sweep, links rewritten, superseding in place.
4. Write the harvest to the selected Destinations rung (`bdc` only when installed and initialized; its absence is not a blocker).
5. Apply routine comment trims and non-critical test cuts/folds, `git rm` moved artifacts, and repoint inbound links, retaining each crux assertion; leave critical candidates unchanged until approved.
6. Commit with repository conventions, push, and repeat the gate-presence check on the new head.
7. Report `clean` when nothing needed action, otherwise the destination, edits, held decisions, and every artifact moved with where it landed.

An audit that changes nothing needs no commit. Keep the audit to branch-introduced material; unrelated tests, comments, and docs stay untouched.
