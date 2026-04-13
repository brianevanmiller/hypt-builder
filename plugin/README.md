# HYPT — Hyptrain Shipping Workflow Plugin

A Claude Code plugin that provides a complete shipping workflow: implement, review, test, deploy, and close.

## Skills

| Command | Description |
|---------|-------------|
| `hypt:save` | Commit, push, and create/update PR automatically |
| `hypt:review` | Thorough PR review with 4 parallel subagents — auto-fixes urgent issues |
| `hypt:touchup` | Quick pre-merge polish — fix PR comments, build issues, update docs |
| `hypt:unit-tests` | Smart unit test generation prioritized by business criticality |
| `hypt:deploy` | Verify deployment health — detects platform automatically |
| `hypt:close` | Merge PR, verify deployment, suggest next tasks |
| `hypt:prototype` | End-to-end: implement plan, review x2, test, and deliver |

## Installation

```
/plugin install hypt@hypt-claude
```

Or install from the GitHub URL directly:

```
/plugin install hypt from github:brianevanmiller/hypt-claude
```

## Supported Deployment Platforms

The deploy and close skills automatically detect your deployment platform:

- **Vercel** (`vercel.json` or `.vercel/`)
- **Netlify** (`netlify.toml` or `_redirects`)
- **Fly.io** (`fly.toml`)
- **Render** (`render.yaml`)
- **Railway** (`railway.json` or `railway.toml`)
- **Generic** — falls back to GitHub Deployments API

## Requirements

- [GitHub CLI](https://cli.github.com/) (`gh`) — used for PR management, deployment checks
- Git
- npm (for build/test commands)

## Workflow

The typical development flow:

```
prototype -> save -> review -> touchup -> unit-tests -> deploy -> close
```

Each skill can also be used independently. For example, use `hypt:save` anytime you want to commit and push, or `hypt:review` for a standalone code review.

## License

MIT
