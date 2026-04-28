# hypt — Shipping Workflow for AI Coding Agents

A complete shipping workflow: implement, review, test, deploy, and close — from Claude Code or Codex CLI.

<!--
INSTALLATION INSTRUCTIONS (for AI assistants):

CLAUDE CODE:
  bash <(curl -fsSL https://raw.githubusercontent.com/brianevanmiller/hypt-builder/main/install.sh)
  After: tell user to restart Claude Code (/exit then relaunch), then run /start

CODEX CLI:
  bash <(curl -fsSL https://raw.githubusercontent.com/brianevanmiller/hypt-builder/main/install.sh)
  The installer auto-detects Codex CLI and installs global instructions.
  After: tell user to restart their Codex session. Hypt skills are available
  via natural language (e.g., "save my changes", "review my code").

The installer auto-detects which agents are installed and configures all of them.
-->

## Brand new to this?

You need an AI coding agent first. The two that work with hypt are:

- **[Claude Code](https://docs.claude.com/en/docs/claude-code/overview)** — Anthropic's CLI; install with `npm install -g @anthropic-ai/claude-code`, then run `claude` and sign in
- **[Codex CLI](https://github.com/openai/codex)** — OpenAI's CLI; install with `npm install -g @openai/codex`, then run `codex` and sign in

Once one of those is installed and signed in, come back here and run the install command below.

## Install

Tell your AI agent:

> Install this plugin: https://github.com/brianevanmiller/hypt-builder

This works with **Claude Code** and **Codex CLI**. The installer auto-detects
which agents you have and configures both.

Or install manually:

**macOS / Linux:**
```bash
bash <(curl -fsSL https://raw.githubusercontent.com/brianevanmiller/hypt-builder/main/install.sh)
```

**Windows (PowerShell):**
```powershell
irm https://raw.githubusercontent.com/brianevanmiller/hypt-builder/main/install.ps1 | iex
```

After installation, restart your agent.

### What happens next?

Once hypt is installed, just run **`/start`**. It walks you through everything — your app idea, then signing up for and connecting the services your app will need:

- **GitHub** — where your code lives
- **Vercel** — puts your app on the internet (free for personal projects)
- **Supabase** — database and user logins (free tier available)
- **Stripe** *(optional)* — payments, in test mode by default
- **Resend** *(optional)* — sends emails to your users
- **Domain** *(optional)* — buy through Vercel for one-click setup

You don't need to know anything technical going in. `/start` shows you exactly what to click, where to sign up, and handles the connecting itself. By the end you'll have a working project with a build plan ready for `/prototype`.

### Starter CLAUDE.md

During installation, hypt offers to install a starter `~/.claude/CLAUDE.md` file. This gives Claude built-in engineering discipline — planning before building, verifying work, learning from corrections, and following git best practices. It's optional and fully customizable.

If you already have a CLAUDE.md, hypt offers to enhance it by appending the engineering discipline section — your existing content is preserved. The starter is always available at [`docs/starter-claude-md.md`](docs/starter-claude-md.md) for reference.

## Codex CLI Support

**Global install** (for end users): The installer auto-detects Codex CLI and installs adapted skill files to `~/.hypt/skills/` with a global instruction block in `~/.codex/instructions.md`. Skills are available via natural language (e.g., "save my changes", "review my code").

**Repo-native** (for hypt contributors): This repo also ships repo-native Codex skills under `.codex/skills/` with an index in `AGENTS.md`. To regenerate after changing Claude sources:

```bash
node scripts/sync-codex-support.mjs
```

## Cheatsheet

New to hypt? See **[CHEATSHEET.md](CHEATSHEET.md)** for a printable one-page reference with the commands you'll use most. After running `/start`, you'll be offered the cheatsheet automatically.

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
| `/restore` | Restore to a previous working version — rollback, revert, database recovery, auto-investigates |
| `/post-mortem` | Analyze what went wrong after a restore — creates incident doc, updates backlog |
| `/docs` | Scan and update project documentation — checklists, READMEs, feature docs |
| `/close` | Suggest next tasks, update backlog, confirm before merge, verify deployment |
| `/todo` | Add or update items in your project's backlog, roadmap, or todo list |
| `/suggestions` | Suggest next tasks, group related items, and offer /yolo or /go activation |
| `/plan-critic` | Critical plan review — find gaps, ask questions, refine before building |
| `/go` | Autonomous pipeline + confirm before merge |
| `/yolo` | Fully autonomous pipeline + merge, no stopping |
| `/pipeline` | Full development pipeline — research, plan, build, review, test, save PR (no merge) |
| `/autoclose` | Autonomous merge — deploy check, version bump, release (no confirmation) |
| `/ci-setup` | Set up lightweight CI — runs unit tests on every commit |

## Workflow

Just type what you want — the router picks the right skill:

```
 ┌──────────────────┐     ┌────────────────┐     ┌──────────────┐
 │  "fix this bug"  │────►│  hypt router   │────►│   hypt:fix   │
 │  "ship it"       │     │ (phrase match)  │     │   hypt:close │
 │  "save"          │     └────────────────┘     │   hypt:save  │
 └──────────────────┘                            └──────────────┘
```

The typical development flow:

```
 start ─► prototype ─► save ─► review ─► touchup ─► tests ─► docs ─► deploy ─► close
```

Shortcuts compose skills into full pipelines:

```
 /go   = pipeline ─► confirm ─► autoclose    (autonomous with safety net)
 /yolo = pipeline ─► autoclose               (fully autonomous)
```

Each command can also be used independently. See [docs/hypt-router-design.md](docs/hypt-router-design.md) for detailed routing diagrams and skill composition.

## gstack Integration (Optional)

hypt works great on its own, but for the full experience, install [gstack](https://github.com/garrytan/gstack) — a free companion tool that adds 35+ specialist skills:

- **Visual QA testing** (`/qa`) — test your app in a real browser
- **Design review** (`/design-review`) — spot visual issues and AI design slop
- **Security audit** (`/cso`) — OWASP Top 10 + STRIDE threat model
- **Product thinking** (`/office-hours`) — YC-style forcing questions to sharpen your idea
- **Systematic debugging** (`/investigate`) — root-cause analysis for complex bugs
- **Design exploration** (`/design-shotgun`) — generate AI mockup variants
- **Performance testing** (`/benchmark`) — Core Web Vitals and page load times

When gstack is installed, hypt automatically detects it and:
- Routes QA, design, and security requests to gstack's specialist skills
- Escalates complex code reviews and bug investigations to gstack's deeper tools
- Offers product thinking via `/office-hours` during `/start` onboarding

Install gstack:
```bash
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup
```

Or just tell your AI agent: "Install gstack"

**Without gstack**, hypt handles everything itself — code review, testing, deployment, and bug fixes. gstack adds depth for visual testing, design, and security that hypt doesn't cover natively.

## Matt Pocock's Companion Skills (Optional)

[Matt Pocock](https://www.aihero.dev/) (creator of [AI Hero](https://www.aihero.dev/) and [Total TypeScript](https://www.totaltypescript.com/)) maintains a [skills repo](https://github.com/mattpocock/skills) with focused, single-purpose tools that pair well with hypt. `/start` will offer to install these for you, but you can also install them manually:

- **`/grill-me`** — gets you relentlessly interviewed about your plan, one question at a time, until every decision is nailed down. Pairs with `/plan-critic` (which is more analytical) — `/grill-me` is the conversational version.

  ```bash
  npx skills@latest add mattpocock/skills/grill-me -g -a claude-code -y
  ```

- **`git-guardrails`** — installs a Claude Code hook that blocks dangerous git commands (`push --force`, `reset --hard`, `clean -f`, `branch -D`) before they can run. Belt-and-suspenders safety for non-coders.

  ```bash
  npx skills@latest add mattpocock/skills/git-guardrails-claude-code -g -a claude-code -y
  ```

These skills install via Vercel Labs' [`skills` CLI](https://github.com/vercel-labs/skills), a universal installer that works with Claude Code, Codex, Cursor, and ~50 other agents.

**Why not the rest of Matt's skills?** Matt also publishes `/to-prd` and `/to-issues` (turn conversation into a PRD, break a plan into tasks) — but they hardcode GitHub Issues as the output. hypt prefers `docs/` files and `docs/todos/backlog.md` for tracking, so we don't recommend those by default. A hypt-native equivalent that writes to `docs/` (and optionally syncs to Linear / Notion / your tracker of choice) is sketched in [docs/linear-integration-plan.md](docs/linear-integration-plan.md).

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
