# Branch Hygiene: Comments and Tests

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

Use the first suitable destination already supported by the repository:

1. An existing issue, ticket, or project tracker record.
2. The PR description or an existing decision/ADR document.
3. An initialized Beadcrumbs ledger when `bdc` is installed. Capture the concise conclusion, not a transcript or secret, and follow Beadcrumbs' own provenance and redaction instructions. Do not initialize a ledger without asking.
4. The repository's normal follow-up file when no better destination exists.

Keep one consolidated harvest per close run. On a re-run, extend the existing record instead of creating a duplicate. If no destination is clear, ask before making an external tracker write; a short PR-description note is the default when the repository allows it.

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

Wait for the user's explicit approval before deleting or folding a critical candidate. A yolo handoff does not approve these edits. If the user declines, record that decision in the existing tracker, PR description, or Beadcrumbs record so a later close run does not repeatedly raise the same unchanged test.

## Execution order

1. Classify comments and tests from the branch diff.
2. Prepare one concise harvest record and the critical-test hold list.
3. Write the harvest to the selected durable destination. Use `bdc` only when it is installed and initialized; absence is not a blocker.
4. Apply routine comment trims and non-critical test cuts/folds. Keep critical candidates unchanged until approved.
5. Commit hygiene edits with repository conventions, push, and repeat the gate-presence check on the new head.
6. Report `hygiene: clean` when no branch-introduced material needs action, otherwise report the destination, edits, and held decisions.

An audit that changes nothing does not need a commit. Never widen the audit to unrelated tests or comments merely to make the report look complete.
