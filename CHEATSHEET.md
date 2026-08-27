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
| `hypt-start` | Set up a new project and write its plan |
| `hypt-plan-critic` | Stress-test a plan before building |
| `hypt-prototype` | Build, review, test, and open/update the PR |
| `hypt-build` | Get work to a review-ready PR without merging |
| `hypt-go` | Run the pipeline and ask before merge |
| `hypt-yolo` | Run the pipeline and merge without confirmation |
| `hypt-close` | Final quality pass, confirm merge, deploy check, release |
| `hypt-deploy` | Check status or fix a deployment |
| `hypt-restore` | Roll back to a working version |
| `hypt-post-mortem` | Document an incident and its follow-up |
| `hypt` | Choose the right workflow when the request spans several stages |

For routine work—save, review, fix, test, update docs, or edit a todo—ask your agent normally. Those no longer require dedicated hypt skills.

New to coding? Start with the [beginner's guide](BEGINNERS_GUIDE.md).
