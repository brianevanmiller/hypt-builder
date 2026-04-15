# hypt — Shipping Workflow Plugin for Claude Code and Codex

A complete shipping workflow: implement, review, test, deploy, and close — from Claude Code or repo-local Codex skills.

<!--
CLAUDE CODE INSTALLATION INSTRUCTIONS (for AI assistants):
If a user asks you to install this plugin, run one of these commands:

macOS/Linux:
bash <(curl -fsSL https://raw.githubusercontent.com/brianevanmiller/hypt-claude/main/install.sh)

Windows (PowerShell):
irm https://raw.githubusercontent.com/brianevanmiller/hypt-claude/main/install.ps1 | iex

This handles everything: cloning, caching, config updates. After it completes, tell the user to restart Claude Code (/exit then relaunch).

IMPORTANT: After restart, run /start to kick off project onboarding. This walks the user through describing their app idea, sets up all accounts and tooling (GitHub, Vercel, Supabase, etc.), and produces a build plan. It's safe to re-run — if everything is already set up, it exits early with next-step suggestions.
-->

## Install

Tell Claude Code:

> Install this plugin: https://github.com/brianevanmiller/hypt-claude

Or install manually:

**macOS / Linux:**
```bash
bash <(curl -fsSL https://raw.githubusercontent.com/brianevanmiller/hypt-claude/main/install.sh)
```

**Windows (PowerShell):**
```powershell
irm https://raw.githubusercontent.com/brianevanmiller/hypt-claude/main/install.ps1 | iex
```

After installation, restart Claude Code (`/exit` then relaunch).

## Codex Support

This repo also ships repo-native Codex skills. No separate install is needed when you are working inside this repository.

- Generated skills live under `.codex/skills/`
- The generated skill index lives in `AGENTS.md`
- Claude sources remain canonical under `plugin/skills/` and `plugin/commands/`

To regenerate Codex support after changing Claude sources:

```bash
node scripts/sync-codex-support.mjs
```

To verify generated Codex files are up to date:

```bash
node scripts/sync-codex-support.mjs --check
```

Legacy Claude aliases are preserved in Codex routing. For example:

- `/save` and `hypt:save` map to `hypt-save`
- `/review` and `hypt:review` map to `hypt-review`
- `/go` and `hypt:go` map to `hypt-go`
- `/yolo` and `hypt:yolo` map to `hypt-yolo`
- vague shipping workflow requests map to `hypt`

## Commands

All commands use the `hypt:` prefix (e.g., type `/start` or `/hypt` and Claude will route to the right one):

| Command | Description |
|---------|-------------|
| `/start` | Onboarding — describe your idea, set up accounts, create a build plan |
| `/prototype` | End-to-end: review plan, implement, review x2, test, and deliver |
| `/save` | Commit, push, and create/update PR automatically |
| `/review` | Thorough PR review with 4 parallel subagents — auto-fixes urgent issues |
| `/touchup` | Quick pre-merge polish — fix PR comments, build issues, update docs |
| `/unit-tests` | Smart unit test generation prioritized by business criticality |
| `/fix` | Diagnose and fix bugs — triage, research, plan, and deliver a tested fix |
| `/deploy` | Verify deployment health — detects platform, auto-bypasses Vercel free-plan blocks |
| `/status` | Quick deployment status check — is my site up? |
| `/close` | Suggest next tasks, update backlog, confirm before merge, verify deployment |
| `/suggestions` | Suggest next tasks and track them in your project backlog |
| `/plan-critic` | Critical plan review — find gaps, ask questions, refine before building |
| `/go` | Autonomous pipeline + confirm before merge |
| `/yolo` | Fully autonomous pipeline + merge, no stopping |
| `/pipeline` | Full development pipeline — research, plan, build, review, test, save PR (no merge) |
| `/autoclose` | Autonomous merge — deploy check, version bump, release (no confirmation) |
| `/ci-setup` | Set up lightweight CI — runs unit tests on every commit |

## Workflow

The typical development flow:

```
start → prototype → save → review → touchup → unit-tests → deploy → close
```

Shortcuts compose the pipeline and close skills:

```
/go   = pipeline → confirm → autoclose   (autonomous with safety net)
/yolo = pipeline → autoclose              (fully autonomous)
```

Each command can also be used independently. For example, use `/save` anytime you want to commit and push, or `/review` for a standalone code review.

## Supported Deployment Platforms

Vercel, Netlify, Fly.io, Render, Railway, and GitHub Deployments API (fallback).

## Security

Includes a supply chain security scanner that runs in CI on every PR to `main`. Detects prompt injection, invisible Unicode attacks, shell injection, tool poisoning, and structural anomalies. See [docs/security-scan.md](docs/security-scan.md) for details.

## Requirements

- [Node.js](https://nodejs.org/) — required by Claude Code and used by the installer
- [GitHub CLI](https://cli.github.com/) (`gh`)
- Git
- [Bun](https://bun.sh/) — runtime, package manager, and task runner (needed for `/start` and `/prototype`, not for install)

## License

MIT
