# Companion skills

Install companions globally for the coding agents where the user installed Hypt. Check `npx skills list -g --json` first and omit names already present. Replace `<agent-flags>` below with one or more repeated `--agent <name>` flags from that Hypt installation; show the substituted commands in the approval plan.

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

`show-me` supplies compact technical views. Archify is reserved for substantial architecture or workflow artifacts. A non-coder profile does not install or invoke either through Hypt.

## Conditional product-vetting companion

`office-hours` is not part of the default required set. It is a conditional companion for a new startup idea when the user requests direction, brainstorming, or vetting during `hypt-start` intake. Check the installed global catalog before invoking it. If it is missing, show the user this exact approval-gated command before installing it:

```bash
npx skills add garrytan/gstack \
  --skill office-hours \
  --global \
  <agent-flags> \
  --yes \
  --full-depth
```

After installation, verify the exact `office-hours` name through `npx skills list -g --json`, then invoke that skill. Do not emulate or paraphrase Office Hours when the user explicitly requested it. If installation is declined or unavailable, record the vetting step as a human follow-up and do not finalize startup scope as though vetting occurred.

## Optional local ledgers

These are not part of Hypt's required set. Declining either does not block onboarding. Ask once during first `hypt-start`; do not re-ask when the project record already stores the decision.

Install only what the user accepted, and only the missing pieces. Get explicit approval for the exact commands before running them. Do not pipe `curl` to a shell; use Homebrew or npm as written here.

When both are accepted, this is the order:

1. Beads CLI
2. Beadcrumbs CLI and the `beadcrumbs` skill
3. After Git exists: `bd init` and `bd setup`, then `bdc init`

### Beads

Offer Beads only when the user does not already use Linear or another hosted task tracker. GitHub Issues alone is not that tracker. Beads is a local graph tracker so agents can keep work, blockers, and session memory without a hosted tracker.

```bash
brew install beads
# or, when Homebrew is unavailable:
npm install -g @beads/bd
```

Verify with `bd --version`. After the project has a Git repository, include these in the setup plan:

```bash
bd init
bd setup --list
```

Run `bd setup` for each agent where Hypt is installed (`claude`, `codex`, `cursor`, and any other listed match). If an agent is not listed, run `bd onboard` and add the printed snippet to `AGENTS.md`. Do not emulate the Beads workflow; `bd prime` is the live contract.

### Beadcrumbs

Beadcrumbs is macOS and Linux only (`arm64` and `amd64`). Skip it on Windows and record `unsupported platform`. The CLI binary is large (~142 MB, embedded Dolt); include that in the approval plan, not in the one-line offer.

```bash
npm install -g @beadcrumbs/bdc

npx skills add brianevanmiller/beadcrumbs \
  --skill beadcrumbs \
  --global \
  <agent-flags> \
  --yes \
  --full-depth
```

The `beadcrumbs` skill is a dependency of the CLI: never leave `bdc` installed without that skill. Verify `bdc version --json` (require `>= 1.0`) and that `beadcrumbs` appears in `npx skills list -g --json`.

After Git exists, include `bdc init` in the setup plan. Follow the installed `beadcrumbs` skill for provenance, capture, harvest, promotion, and Beads destinations. Do not copy that contract into Hypt, do not run `bdc init` unasked, and do not enable `bdc hooks install --auto-harvest` unless the user asks.

## Verification

Parse `npx skills list -g --json` and require these core names:

```text
wayfinder
grilling
codebase-design
code-review
tdd
diagnosing-bugs
architect
interrogate
```

For coder profiles also require:

```text
show-me
archify
```

When Beads was accepted, also require `bd` on PATH. When Beadcrumbs was accepted, also require `bdc` on PATH and `beadcrumbs` in the skill list. Do not treat a declined or unsupported optional ledger as a missing required companion.

Report a source repository or skill name when installation fails. Do not substitute an unreviewed package with a similar name.
