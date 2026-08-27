# Required companion skills

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

Report a source repository or skill name when installation fails. Do not substitute an unreviewed package with a similar name.
