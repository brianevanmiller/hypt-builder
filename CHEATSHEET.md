# hypt cheatsheet

## Install

```bash
# Pick skills interactively
npx skills add brianevanmiller/hypt-builder

# Install every skill for Claude Code without prompts
npx skills add brianevanmiller/hypt-builder \
  --skill '*' \
  --agent claude-code \
  --global \
  --yes
```

## Core workflows

| Say or invoke | What happens |
|---|---|
| `hypt-start` | Set up a new project, optional Beads/Beadcrumbs, and write its plan |
| `hypt-plan-critic` | Stress-test a plan before building |
| `hypt-implement` | Implement approved work without owning the PR lifecycle |
| `hypt-build` | Get work to a ready PR; yolo mode continues through close |
| `hypt-close` | Final quality pass, confirm merge, deploy check, release |
| `yolo`, `ship it`, or `publish it` | Run `hypt-build`, then auto-approved `hypt-close` |
| `hypt-deploy` | Check status or fix a deployment |
| `hypt-restore` | Roll back to a working version |
| `hypt-post-mortem` | Document an incident and its follow-up |
| `hypt` | Choose the right workflow when the request spans several stages |

For routine work—save, review, fix, test, update docs, or edit a todo—ask your agent normally. Those no longer require dedicated hypt skills.

New to coding? Start with the [beginner's guide](BEGINNERS_GUIDE.md).
