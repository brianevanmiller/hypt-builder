# Companion skills

Install companions globally for the coding agents where the user installed Hypt. Check `npx skills list -g --json` first and omit names already present. Replace `<agent-flags>` with one or more repeated `--agent <name>` flags from that Hypt installation, and show the substituted commands in the approval plan.

## Core build companions

```bash
npx skills add mattpocock/skills \
  --skill wayfinder grilling codebase-design code-review tdd diagnosing-bugs \
  --global \
  <agent-flags> \
  --yes \
  --full-depth

npx skills add cursor/plugins \
  --skill architect interrogate \
  --global \
  <agent-flags> \
  --yes \
  --full-depth
```

These own readiness mapping, discovery, parallel design, two-axis review, light test-first work, root-cause diagnosis, and adversarial review.

## Coder-only visual companions

```bash
npx skills add humanlayer/skills \
  --skill show-me \
  --global \
  <agent-flags> \
  --yes \
  --full-depth

npx skills add tt-a1i/archify \
  --skill archify \
  --global \
  <agent-flags> \
  --yes \
  --full-depth
```

`show-me` supplies compact technical views; Archify is reserved for substantial architecture or workflow artifacts. A non-coder profile installs and invokes neither through Hypt.

## Conditional product-vetting companion

`office-hours` is a conditional companion for a new startup idea when the user requests direction, brainstorming, or vetting during `hypt-start` intake. Check the installed global catalog first; if missing, show this exact approval-gated command before installing:

```bash
npx skills add garrytan/gstack \
  --skill office-hours \
  --global \
  <agent-flags> \
  --yes \
  --full-depth
```

Verify the exact `office-hours` name through `npx skills list -g --json`, then invoke that skill; when the user explicitly requested it, the real skill runs rather than an emulation. If installation is declined or unavailable, record the vetting step as a human follow-up and leave startup scope unfinalized.

## Optional local ledgers

Not part of the required set; declining either never blocks onboarding. Ask once during first `hypt-start` and skip the ask when the project record already stores the decision. Install only what the user accepted and only the missing pieces, with explicit approval of the exact commands, using Homebrew or npm as written here rather than piping `curl` to a shell. Order when both are accepted: Beads CLI; Beadcrumbs CLI and the `beadcrumbs` skill; then, after Git exists, `bd init` and `bd setup`, then `bdc init`.

### Beads

Offer Beads only when the user does not already use Linear or another hosted task tracker (GitHub Issues alone is not one). It is a local graph tracker so agents keep work, blockers, and session memory without a hosted tracker.

```bash
brew install beads
# or, when Homebrew is unavailable:
npm install -g @beads/bd
```

Verify with `bd --version`. Once the project has a Git repository, the setup plan includes:

```bash
bd init
bd setup --list
```

Run `bd setup` for each agent where Hypt is installed (`claude`, `codex`, `cursor`, and any other listed match); for an unlisted agent, run `bd onboard` and add the printed snippet to `AGENTS.md`. `bd prime` is the live contract; Hypt does not emulate the Beads workflow.

### Beadcrumbs

macOS and Linux only (`arm64` and `amd64`); on Windows skip it and record `unsupported platform`. The binary is large (~142 MB, embedded Dolt): say so in the approval plan, not in the one-line offer.

```bash
npm install -g @beadcrumbs/bdc

npx skills add brianevanmiller/beadcrumbs \
  --skill beadcrumbs \
  --global \
  <agent-flags> \
  --yes \
  --full-depth
```

The `beadcrumbs` skill is a dependency of the CLI: `bdc` is never left installed without it. Verify `bdc version --json` (require `>= 1.0`) and `beadcrumbs` in `npx skills list -g --json`. After Git exists, include `bdc init` in the setup plan. The installed `beadcrumbs` skill owns provenance, capture, harvest, promotion, and Beads destinations; Hypt does not copy that contract, run `bdc init` unasked, or enable `bdc hooks install --auto-harvest` unless the user asks.

## Verification

Parse `npx skills list -g --json` and require every core name: `wayfinder`, `grilling`, `codebase-design`, `code-review`, `tdd`, `diagnosing-bugs`, `architect`, `interrogate`. For coder profiles also require `show-me` and `archify`. When Beads was accepted, also require `bd` on PATH; when Beadcrumbs was accepted, `bdc` on PATH and `beadcrumbs` in the skill list. A declined or unsupported optional ledger is not a missing required companion. Report the source repository or skill name when installation fails, and never substitute an unreviewed package with a similar name.
