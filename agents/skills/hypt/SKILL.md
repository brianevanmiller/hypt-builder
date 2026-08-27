---
name: hypt
description: "Routes shipping requests to the appropriate hypt workflow. Use when a request spans the shipping lifecycle or the right workflow is unclear."
metadata:
  short-description: "Hyptrain Shipping Workflow"
---

# hypt — Hyptrain Shipping Workflow

Complete shipping workflow for AI coding agents. Routes user intent to the right skill automatically.

## Routing Rules

Route only the hypt-specific workflows below. Handle ordinary requests to commit, push, open a PR, review code, fix a bug, add tests, update docs, edit a backlog, or configure CI with the agent's normal capabilities and repository instructions.

| User says | Invoke |
|-----------|--------|
| "Start", new project, get started, set up, onboarding, "I have an idea" | `hypt-start` |
| Close, merge, ship it, "done", "we're good" | `hypt-close` |
| Deploy, check deployment, fix deployment | `hypt-deploy` |
| "Status", is it live, is my site up, site status, check my site | `hypt-deploy` in read-only mode |
| "Restore", rollback, revert, go back, undo deploy, previous version, undo last deploy, restore database | `hypt-restore` |
| "Post-mortem", postmortem, incident report, what went wrong | `hypt-post-mortem` |
| Review plan, critique plan, check my plan, plan review, plan critic | `hypt-plan-critic` |
| Prototype, build this feature, implement this plan | `hypt-prototype` |
| "Yolo", "yolo it", "just ship it", "take it all the way", full auto ship | `hypt-yolo` |
| "Go", "go mode", "ship with confirmation", "auto but confirm", "do everything but ask before merge" | `hypt-go` |
| "Build", "run pipeline", "review and test", "get this PR-ready" | `hypt-build` |
| "Autoclose", "auto merge", "merge without asking" | `hypt-autoclose` |

### Extended routes (when gstack is available)

Treat gstack as available when its named skills are present in the agent's loaded skill catalog. If available, also route these requests:

| User says | Invoke | Brief mention |
|-----------|--------|---------------|
| "test my site", "does it work", "QA", "test in browser" | Skill: `qa` | "Using gstack QA tools to test your app in a real browser..." |
| "design review", "make it prettier", "visual check", "how does it look" | Skill: `design-review` | "Using gstack design review to check visual quality..." |
| "security check", "is it secure", "security audit", "OWASP" | Skill: `cso` | "Using gstack security officer to run a security audit..." |
| "brainstorm deeper", "office hours", "rethink this", "is this the right product" | Skill: `office-hours` | "Using gstack office hours for deeper product thinking..." |
| "investigate", "root cause", "dig deeper into this bug" | Skill: `investigate` | "Using gstack investigate for systematic root-cause analysis..." |
| "retro", "weekly review", "how did the week go" | Skill: `retro` | "Using gstack retro for your weekly engineering retrospective..." |
| "benchmark", "performance check", "how fast is my site" | Skill: `benchmark` | "Using gstack benchmark to measure your app's performance..." |
| "design system", "brand", "build a design" | Skill: `design-consultation` | "Using gstack design consultation to build your design system..." |
| "show me design options", "design variants" | Skill: `design-shotgun` | "Using gstack to generate design variants..." |
| "open browser", "browse", "open my site" | Skill: `browse` | "Opening your app in a browser..." |

If those skills are unavailable and the user asks for any of the above capabilities:

> "That feature works best with gstack — a free companion tool that adds visual QA, design review, and security audits to your workflow. I can:
>
> A) Install gstack now (free, takes about 30 seconds)
> B) Skip it — [provide a manual alternative for the specific request, e.g., 'you can check the preview URL yourself']"

If the user chooses A, direct them to gstack's current installation instructions, then route to the appropriate gstack skill after it becomes available. Keep this installation agent-neutral rather than writing directly to one agent's config directory.

## Workflow

The typical flow is:

1. `hypt-start` — onboarding: describe the idea, set up accounts, create a plan
2. `hypt-prototype` — review the plan, implement, review, test, and deliver
3. `hypt-deploy` — verify deployment health or perform a read-only status check
4. `hypt-restore` — restore a previous working version
5. `hypt-post-mortem` — analyze an incident after restore
6. `hypt-close` — final quality pass, merge, deploy check, and release

Skills can be used individually or as part of the full prototype workflow.

### Composition skills

- `hypt-build` — full development pipeline (research → plan → build → review → test → ready PR). Does not merge.
- `hypt-autoclose` — autonomous close (merge, deploy check, version bump, release) without confirmation. Used internally by `hypt-yolo` and `hypt-go`.

### Shortcuts

- `hypt-go` = `hypt-build` + confirmation gate + `hypt-autoclose` — autonomous pipeline, confirms before merge
- `hypt-yolo` = `hypt-build` + `hypt-autoclose` — fully autonomous, no confirmation at any step
