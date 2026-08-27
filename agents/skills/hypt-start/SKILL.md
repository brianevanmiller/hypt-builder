---
name: hypt-start
description: "Onboards a new project, its owner, required companion skills, accounts, and build plan. Use when the user wants to start or finish setting up an app project."
metadata:
  short-description: "Onboard a Project and Its Owner"
---

# hypt-start — Onboard a Project and Its Owner

Be friendly and direct. Match technical depth to the user's Identity profile; define unavoidable jargon for non-coders.

Resolve this skill's `assets/` and `references/` directories relative to `SKILL.md`.

## Ground

Inspect without exposing secrets:

- Existing `AGENTS.md`, `CLAUDE.md`, plans, package files, env-file presence, git remote, and deployment config
- OS, architecture, package manager, Git, Node/npm/npx, Bun, GitHub CLI, and authentication state
- Installed global skills with `npx skills list -g --json`

Do not invoke a missing package runner merely to detect it; include installation in the approval plan.

## 1. Resume or start

Treat the project as fully onboarded when it has a date-prefixed plan, application scaffold, git remote, local env file, and linked deployment provider.

Even for an existing project, complete the Identity and companion checks below when absent. Then point the user to `hypt-build` and stop.

When only a plan exists, preserve it, finish missing setup, and skip idea discovery. With no plan, continue through every phase.

## 2. Offer agent defaults

Ask:

> Want me to create a short project-level identity so coding agents match your background and communication style?

If yes, collect in one message:

1. Name and role
2. Areas of expertise
3. Working style
4. Communication or collaboration preferences

Write or update one `## Identity — <Name>` section:

```markdown
## Identity — <Name>
- **Role:** <role>
- **Expertise:** <expertise>
- **Working style:** <working style>
- **Preferences:** <communication and collaboration preferences>
```

Preserve existing instructions. Recommend `AGENTS.md` as the portable source. When Claude Code is used, offer a root `CLAUDE.md` that imports `AGENTS.md` rather than duplicating the identity. If either file already owns the identity, update that source of truth.

Classify the communication profile from Role, Expertise, and Preferences:

- **Coder:** technical implementation visuals can help.
- **Non-coder:** use plain language and outcome-focused handoffs.
- **Unclear:** default to non-technical communication.

Do not add labels the user did not choose; the written identity itself is the durable profile.

Completion: the user declined, or one authoritative Identity section records how agents should work with them.

## 3. Install required companions

Read `references/companion-skills.md`.

These companions are part of Hypt's composed workflow, not optional recommendations. Compare the required names with the global skill list and present one installation plan for missing skills. Installing globally changes the user's agent setup, so get explicit approval immediately before running the commands.

Install only missing required skills. Install coder-only visual companions only for a coder profile. Verify every selected name with `npx skills list -g --json`.

If installation is declined or blocked, stop and state that onboarding is incomplete, listing the exact missing skills and commands.

Completion: every required companion is globally discoverable; coder visual companions are discoverable when applicable.

## 4. Discover the product

Ask one question at a time and briefly confirm each answer:

1. **Idea:** What should the app let people accomplish?
2. **Users:** Who uses it?
3. **Day-one actions:** What are the three to five essential things users can do?
4. **Difference:** What makes it distinct? Optional.
5. **Accounts:** None, Google, email/password, or both?
6. **Access:** Just the owner, a named allowlist, or open signup?
7. **Payments:** None, one-time, subscriptions, or both?
8. **Email:** Which transactional messages are needed?
9. **Integrations:** Which external services, and what is read or written?
10. **Domain:** Existing, buy now, or use the provider URL?
11. **Design:** Brand, tone, colors, logo, and examples?

Record allowlist emails locally without exposing them unnecessarily. Normalize integration provider slugs to lowercase kebab-case and record each integration's purpose.

When the user wants deeper product pressure-testing, invoke `grilling` before finalizing scope.

Completion: day-one scope, users, integrations, access, and visible outcome are concrete.

## 5. Set up the project

Read `references/default-web-stack.md` only for setup branches the answers require.

Present one table of missing tools, accounts, project resources, and proposed changes. Use official package sources and OAuth pages. Explain admin prompts and browser sign-in. Get one approval for the complete plan, then execute it.

GitHub comes before services that use GitHub OAuth. Secrets go directly into gitignored local files or official secret stores, never chat. Verify ignore rules before secret entry and verify presence without printing values.

Scaffold only into an empty or explicitly approved directory. Use the bundled SQL assets for allowlist or integrations when those branches apply. Verify the local app and each configured connection.

Completion: required tools and accounts authenticate, the app starts, secrets are ignored, git is remote-backed, and the deployment project is linked.

## 6. Write the product and build documents

Read `references/project-documents.md`.

Write:

- `docs/<YYYY-MM-DD>-<slug>-app.md`: users, value, day-one behavior, integrations, design, and scope
- `docs/<YYYY-MM-DD>-<slug>-plan.md`: tracer-bullet implementation slices with acceptance criteria and proof paths

Use plain language first, then concise technical detail. Include production hardening only at the level the user chose. Review the summary with the user before writing, then commit and push the onboarding result.

Completion: both documents agree with the conversation and `hypt-build` can execute the first slice without guessing.

## 7. Finish

Add the repository's smallest useful CI gate for its current stack; avoid speculative suites. Run it once.

Report:

- Identity/defaults created or declined
- Companion skills installed
- Tool and account status
- App and plan paths
- Repository and preview URLs
- Any human-only or post-merge action

Offer the cheatsheet, then recommend:

> Use `hypt-build` to build the plan. Say `ship it` when you want Hypt to continue through merge, deployment, and release.
