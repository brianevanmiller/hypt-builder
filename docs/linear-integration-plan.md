# Linear integration plan (sketch)

> **Status:** Not implemented yet. This is a design sketch for a future feature.
> **Companion to:** [`README.md`](../README.md) and [`plugin/commands/start.md`](../plugin/commands/start.md).

## Why this exists

hypt's default tracking convention is `docs/` files plus `docs/todos/backlog.md`. That's intentional — most non-coder hypt users don't have a task tracker, and forcing them to set up GitHub Issues, Linear, or Asana before they ship anything is friction.

But some users *do* already have a task tracker. The most common one in indie / startup land is **[Linear](https://linear.app)**. This document sketches how hypt would offer Linear as the optional happy-path for users who want one.

## What we'd build

### 1. New skill: `hypt:breakdown`

Reads a hypt plan file (`docs/YYYY-MM-DD-<idea>-plan.md`) and decomposes it into actionable tasks.

**Default behavior (no tracker chosen):** writes structured checkbox items into `docs/todos/backlog.md` under the existing seven categories (Security / Bugs / Features / Performance / Testing / Documentation / Cleanup). Plays naturally with the existing `/todo` and `/suggestions` skills, which already read from that file.

**Linear behavior (if Linear is configured):** also pushes each task to Linear as an issue, tagged with the project name and any relevant labels. Local backlog stays in sync — Linear is the secondary view, not the source of truth.

### 2. New question in `/start` Phase 2

After Q9 (look and feel), ask:

> Where do you want to track ongoing tasks?
>
> - **`docs/` files** (default — recommended for solo builders, no setup required)
> - **Linear** (recommended if you already use Linear, or if you'll be working with a team)
> - **Skip** — figure it out later

Save the answer as `TRACKER`. If they pick Linear, run the setup walkthrough below. If they skip or pick docs, continue as today.

### 3. Linear-detection in skill preambles

`hypt:breakdown`, `hypt:todo`, and `hypt:suggestions` would check for Linear MCP availability at preamble time:

```bash
LINEAR_AVAILABLE=$(test -f ~/.claude/mcp_settings.json && grep -q '"linear"' ~/.claude/mcp_settings.json && echo "true" || echo "false")
```

If `LINEAR_AVAILABLE=true`, those skills mirror their writes to Linear. Otherwise they stay in `docs/`.

## Linear setup walkthrough (for non-coders)

This is the section `/start` would walk through if the user picks Linear. Pasted here as the source-of-truth copy for the eventual implementation.

### What is Linear?

Linear is a project tracker — think of it like a fancy to-do list, but built for software teams. It's free for individuals and small teams, and it's what most modern startups use. The reason to pick it: if you're going to work with a developer or designer later, this is the tool they'll probably want to see your tasks in.

If you've never heard of Linear before, **don't pick this** — `docs/` files work fine and you can always switch later.

### Step 1 — Sign up

> Go to [linear.app](https://linear.app) and click "Sign up free." Use your GitHub account if you can — it'll connect things later.
>
> When it asks about your team:
> - **Workspace name:** Your name or your company name (e.g. "Brian's Projects")
> - **Team name:** Just leave it as the default ("Engineering" is fine)
>
> Skip the "invite teammates" step — you can do that later.
>
> When you're done, you should see Linear's main view with one empty team. Let me know when you're there.

### Step 2 — Get your API key

> Now we need a key so I can talk to Linear on your behalf. Don't worry, you don't need to understand what an "API key" is — just follow these steps:
>
> 1. Click your avatar in the top-left of Linear
> 2. Click **"Settings"**
> 3. In the left sidebar, scroll down to **"Account"** → **"Security & access"**
> 4. Click **"New API key"**
> 5. Name it `hypt`, leave the rest as default, click **"Create"**
> 6. **Copy the key** — it starts with `lin_api_`. You won't be able to see it again, so paste it here right now.

After they paste, save it to `~/.hypt/linear-api-key` (gitignored, mode 600) so future sessions can use it.

### Step 3 — Install the Linear MCP server

Linear maintains an [official MCP server](https://linear.app/changelog/2025-05-01-mcp). Install it for Claude Code:

```bash
claude mcp add linear --scope user --env LINEAR_API_KEY="$(cat ~/.hypt/linear-api-key)" -- npx -y @tacticlaunch/mcp-linear
```

> Last step — let me wire Linear into your AI agent so I can talk to it directly. This will run a quick command. You'll need to restart your agent after.

After install, instruct the user:

> Restart Claude Code (`/exit` then relaunch). When you're back, say "what teams do I have in Linear?" — that'll confirm everything's connected.

### Step 4 — Pick a default team

Linear lets you have multiple teams in a workspace. We need to know which one hypt should write tasks to.

> Tell me — when you log into Linear, what's the team you see in the sidebar? (Default is usually "Engineering" or "ENG"). I'll use that as the default for new tasks. You can change it later by saying "set Linear team to X."

Save the answer to `~/.hypt/linear-team` (or per-project if scope=project: `.hypt-config.json`).

### Step 5 — Verify

```bash
# Through MCP, list teams to confirm read access
claude mcp call linear list_teams
```

If that returns a list including the team they named, we're done.

## Skill behavior with Linear configured

### `hypt:breakdown` example

User has a plan at `docs/2026-04-28-meal-planner-plan.md`. They run `/breakdown`.

**Without Linear:**
- Reads the plan
- Generates ~12 actionable items
- Writes them to `docs/todos/backlog.md` under Features / Bugs / Security / etc.
- Replies: "Added 12 items to your backlog. Run `/suggestions` to see what to start on."

**With Linear:**
- Same as above, plus:
- For each item, calls Linear MCP `create_issue` with project=meal-planner, team=ENG
- Adds the Linear issue URL as a comment in the markdown backlog (so users can jump to Linear from the local view)
- Replies: "Added 12 items to your backlog and to Linear (team: ENG). Linear issues: ENG-104 through ENG-115."

### `hypt:todo` example

User says "track this idea: add a 'family-size meal' filter."

**Without Linear:**
- Appends to `docs/todos/backlog.md` under Features.

**With Linear:**
- Appends to `docs/todos/backlog.md` under Features.
- Creates a Linear issue with title "Add family-size meal filter," team=default.
- Adds the Linear URL as a comment line in the markdown.

### `hypt:suggestions` example

**Without Linear:** reads `docs/todos/backlog.md` and recent commits. Suggests the highest-leverage next task.

**With Linear:** also reads open Linear issues for the project (filter by label or project). Merges with the markdown backlog and dedupes by title.

## Future: Other trackers

The same `TRACKER` abstraction could later support:

- **Notion** — via Notion MCP. User-friendly for non-coders who already use Notion for everything.
- **Asana** — via Asana API or community MCP.
- **Monday.com** — via Monday API.
- **GitHub Issues** — for users who explicitly want this. (This is also where Matt Pocock's [`/to-prd`](https://github.com/mattpocock/skills/tree/main/to-prd) and [`/to-issues`](https://github.com/mattpocock/skills/tree/main/to-issues) skills would slot in naturally — install them only on this branch.)

The branching logic in `/start` would just route to a different Phase 2 follow-up walkthrough per tracker. The skill-side abstraction (`TRACKER` env var, MCP detection) stays the same.

## Why we're not building this yet

1. **Most hypt users won't pick a tracker.** The cost of building Linear-first is justified only if real users ask for it. Until then, `docs/todos/backlog.md` works.
2. **The `hypt:breakdown` skill comes first.** Even without any tracker, a markdown breakdown skill is useful — and it builds the abstraction Linear would slot into later.
3. **MCP setup is fragile.** Walking a non-coder through `claude mcp add` with an env var is the riskiest step. We want to nail that pattern once before scaling it to multiple trackers.

## Implementation order (when we do build it)

1. **`hypt:breakdown` (markdown only)** — read plan, write to `docs/todos/backlog.md`. No tracker integration.
2. **Phase 2 question stub** — ask the tracker question, save `TRACKER=docs` for everyone, no branching yet. Just learns whether anyone *wants* Linear.
3. **Linear branch** — when ≥3 users ask for it, build the Step 1–5 walkthrough above and the `--linear` mirror in `hypt:breakdown` / `hypt:todo` / `hypt:suggestions`.
4. **Other trackers** — only if there's signal (Notion likely next).
