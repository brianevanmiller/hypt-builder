# Package Audit

Run from `hypt-close` Step 4 when the trigger check is non-empty. Scope is identities **introduced** against the PR's actual base: a newly declared or newly resolved package, or a newly pinned third-party GitHub Action. An existing package whose version, integrity, or source changed stays out of scope unless that change also introduces a new identity. Removals are out of scope. Record the starting head SHA.

## 1. Inspect

Freeze base, head, and the package manager that owns each triggered file. Classify every changed manifest, lockfile, and `uses:` pin as workspace-owned or orphan (a nested lockfile no install root owns: record it, do not run a manager there).

Build the introduced-identity set from the lockfile and manifest diff against the PR base, not from the edit the author intended:

- **JavaScript/TypeScript:** when `bun.lock` or `bun.lockb` exists, use repository-pinned Bun (`bun.lock` as text, or `bun pm ls` at base vs head for `bun.lockb`). Otherwise use the lockfile's manager (`package-lock.json` → npm, `pnpm-lock.yaml` → pnpm, `yarn.lock` → Yarn).
- **Other ecosystems:** use the manager that owns the triggered lockfile and that ecosystem's registry.
- **GitHub Actions:** every added `uses: owner/repo@ref` in a triggered workflow or composite action (skip `./` local actions).

Attribute each identity: introducing parent, direct vs transitive, workspace, and runtime/build/dev/unknown reachability. Heighten review for new transitives, `preinstall`/`install`/`postinstall` scripts, and native addons.

Completion: every introduced identity has a parent path, a manager, and a reachability label. Zero identities after inspect is `none (no introduced identity)` — stop and return.

## 2. Audit

Close four axes for every introduced identity. Record each source as `verified`, `finding`, `unavailable`, or `UNVERIFIED`.

1. **Security and supply chain.** Exact-version advisories, malware, integrity, publisher or repository drift, added lifecycle scripts, native binaries. Query at least two independent sources when both can run:
   - OSV `https://api.osv.dev/v1/query` with the ecosystem the lockfile uses (`npm`, `crates.io`, `Go`, `PyPI`, …).
   - The owning manager's audit command when it exists: `bun audit --json` from the workspace that owns `bun.lock`, with the repository-pinned Bun; otherwise `npm audit --json`, `pnpm audit`, or that ecosystem's equivalent. Absence is `unavailable`, not clean.
   - Registry metadata for the exact target release (`npm view <pkg>@<ver> --json`, or the ecosystem equivalent): dist integrity, deprecated, extra install scripts, replaced maintainers.
   - GitHub Advisory API when `gh` can call it. Socket or Snyk only when this repo already has access — absence is `unavailable`, not clean.
   - For actions, advisory and manager-audit sources do not apply: read `action.yml` at the pinned ref (`gh api repos/<owner>/<repo>/contents/action.yml?ref=<ref>`) and record `runs.using`. Unreadable refs are `UNVERIFIED`.

   A 403, 404, timeout, malformed body, or incomplete batch is `UNVERIFIED`, never clean. Keep source severity verbatim; judge reachability separately.

2. **Performance and operations.** Production-representative before/after only when the identity is on a measured hot path or first-party notes claim a material perf change. Otherwise `not applicable` with that reason. Missing benches are not a block.

3. **Migration and references.** First-party install, peer, engine, and config notes, plus a search of imports, subpaths, CLI/config/env, CI, and docs. Rollback target is the base lockfile and manifest. Record the compatibility action or evidence that none is required.

4. **Feature opportunity.** Disposition repository-relevant stable capabilities as `adopt now`, `follow-up`, or `not relevant`. This axis never blocks close.

Completion: every identity/source pair has a status, every performance surface has a tuple or `not applicable`, every reachable migration reference has an action or a compatibility note, and every relevant feature has a disposition.

## 3. Decide

A finding authorizes investigation, not a graph edit: do not pin, override, downgrade, regenerate, or add packages merely to clear it. Stop on known-malicious or reachable critical/high targets; invalid integrity; unexplained publisher or provenance drift; unreviewed install hooks; incompatible engine/peer/platform/native constraints; unmigrated reachable breaks; unexplained material regressions; falsely-clean incomplete queries; or unattributed lock movement.

Emit exactly one decision:

- `approve`: every applicable axis is closed.
- `approve with conditions`: only non-blocking follow-ups remain, each with an owner and a checkable criterion.
- `defer`: required obtainable evidence is incomplete.
- `block`: a known unacceptable safety, compatibility, or performance property remains.

`UNVERIFIED` safety evidence, unresolved compatibility, and unexplained material regressions are `defer` or `block`, never conditions. `block` and `defer` stop close, including yolo.

Completion: one decision is recorded; every condition has an owner and a checkable criterion.

## Return

Record this block in the close report; do not commit it.

```text
Packages
- Surface: <none / introduced identities>
- Identities: <name@version (direct|transitive, reachability), …>
- Decision: <approve / approve with conditions / defer / block>
- Evidence: <sources and UNVERIFIED list>
- Follow-up: <owned conditions or none>
```
