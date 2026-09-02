---
name: hypt-start
description: "Onboards a website, web app, desktop project, its owner, required companions, optional Beads/Beadcrumbs, accounts, and build plan. Use when the user wants to start or finish setting up a project."
metadata:
  short-description: "Onboard a Project and Its Owner"
---

# hypt-start — Onboard a Project and Its Owner

Be friendly and direct; match technical depth to the user's Identity profile and define unavoidable jargon for non-coders. Resolve `assets/` and `references/` relative to this `SKILL.md`.

## Ground

Inspect without exposing secrets: existing `AGENTS.md`, `CLAUDE.md`, plans, package files, source documents, env-file presence, git remote, and deployment config; OS, architecture, package manager, Git, Node/npm/npx, Bun, GitHub CLI, and authentication state; installed global skills via `npx skills list -g --json`; the optional ledger CLIs when present (`bd --version`, `bdc version --json`). A missing package runner goes into the approval plan rather than being invoked to detect it. Attached files, local Markdown paths, Google Docs, and Drive links are source material: record each location and its access status, and never claim to have read a source this agent cannot access.

## 1. Resume or start

Determine the project shape first: `website`, `webapp`, `desktop`, or another explicitly named shape. A project is fully onboarded when a date-prefixed plan and project record exist with the selected sources linked or attached, and Step 5's completion already holds for its branch: scaffold, GitHub remote and CLI authentication, Vercel onboarded through the official playbook and linked to the web or desktop-companion surface, domain decision recorded (a custom domain counts only when DNS is verified, HTTPS works, a production deployment serves it, and canonical/redirect behavior is checked), `.env.local` only where selected integrations need secrets (public websites and local-only desktop projects need none), and a Supabase project with authenticated CLI only where public web-app accounts, the selected backend, or another intake decision requires it.

Complete the Identity and companion checks below whenever they are absent, even for an existing project, including the one-time Beads/Beadcrumbs ask when the project record stores no decision. Fully onboarded: report the evidence, point the user to `hypt-build`, and stop. Plan only: preserve it, finish the missing setup, and skip captured discovery. No plan: run every phase.

## 2. Offer agent defaults

Ask:

> Want me to create a short project-level identity so coding agents match your background and communication style?

If yes, collect name and role, areas of expertise, working style, and communication or collaboration preferences in one message, then write or update one section:

```markdown
## Identity — <Name>
- **Role:** <role>
- **Expertise:** <expertise>
- **Working style:** <working style>
- **Preferences:** <communication and collaboration preferences>
```

Preserve existing instructions. `AGENTS.md` is the portable source; under Claude Code, offer a root `CLAUDE.md` that imports it rather than duplicating the identity, and update whichever file already owns the identity. Classify the communication profile from Role, Expertise, and Preferences as **coder** (technical visuals help), **non-coder** (plain language, outcome-focused handoffs), or **unclear** (treat as non-coder), without adding labels the user did not choose; the written identity is the durable profile.

Completion: the user declined, or one authoritative Identity section records how agents should work with them.

## 3. Install companions

Read `references/companion-skills.md`. The required companions are part of Hypt's composed workflow, not recommendations. Present one installation plan for the missing required names (coder-only visual companions only for a coder profile) and get explicit approval immediately before running it, since a global install changes the user's agent setup; then verify every selected name with `npx skills list -g --json`. If required installation is declined or blocked, state that onboarding is incomplete with the exact missing skills and commands, then continue to the optional-ledger ask. The conditional `office-hours` branch applies only when the user requests startup-idea direction or vetting.

### Optional local ledgers

Ask once, in one message, when the project record stores no Beads or Beadcrumbs decision. Skip a tool that is already installed, skip the Beads offer when Linear or another hosted tracker is in use (GitHub Issues alone is not one), and skip Beadcrumbs on Windows:

> Beadcrumbs keeps a local ledger of what agents learn while building — corrections, discoveries, rejected approaches — so that reasoning can be harvested later instead of disappearing with the session. Want me to install it?
>
> If you don't already use Linear or another hosted tracker, I can also install Beads so agents can track their work as a local dependency graph. Want that too?

Declining either is fine. Install accepted CLIs and skills in this step, Beads first, then Beadcrumbs and the `beadcrumbs` skill, after approval of the exact commands including Beadcrumbs' binary size and platform limit; defer `bd init` and `bdc init` to Step 5, once Git exists. Record the decision even when declined.

Completion: every required companion is globally discoverable, coder visual companions when applicable, and each optional ledger is installed, declined, unsupported, or already present.

## 4. Batch project intake

Ask one intake message so the user answers in a single reply. Tell them they may write `covered in <file or link>` for anything already in a source document and `unknown` where a later decision is safe:

> Tell me about the project in one reply. Please include:
>
> 1. **Shape and outcome:** Public `website`, `webapp` (people use an online service), `desktop` app, or another shape? Its name, what it helps people accomplish, who it is for, the three to five day-one actions, and what makes it distinct, if anything.
> 2. **Main brief:** Attach the main Markdown/document file, give a local path, or share the Google Doc URL that describes the project in detail. With no separate brief, say `use this reply as the brief`.
> 3. **Website branch:** The Google Doc or Markdown with the website copy, a Google Drive folder for images and assets, the main navigation tabs, target audience, desired vibe, and design inspiration links or a description, noting which are already in the brief.
> 4. **Web-app branch:** Should other people sign up? If so, which sign-in methods and access policy (owner-only, named allowlist, invited team, or open signup)? What data, payments, emails, and external integrations are needed? Could it grow to thousands or millions of users, and is it consumer or B2B/enterprise? (This decides whether I vet Supabase Auth against a WorkOS AuthKit recommendation; it never picks a provider silently.)
> 5. **Desktop branch:** Which operating systems and distribution/update path matter? Local-only, or accounts, sync, a database, or an API? What should Vercel host: a landing/download/update site, an API, or another companion web surface?
> 6. **Shared setup:** Existing GitHub account/repository, Vercel account/team, or Supabase account? Should I create/link a Vercel project automatically from GitHub? Desired project/repository names and visibility, if known.
> 7. **Domain:** A domain is your public address (for example `example.com`); Vercel is where the app runs. Do you already own one, want to buy one through Vercel or another registrar, or prefer to defer and use the Vercel URL? Give the desired domain and alternatives, the registrar if already owned, whether DNS changes at an outside registrar are approved, and whether `www` should redirect to the apex or the apex to `www`.
> 8. **Idea pressure-testing:** New startup idea needing direction or vetting before setup? Answer `office-hours`, `skip`, or `later`.
> 9. **Build posture:** Prototype, normal production, or sensitive/critical? Include brand colors, logo, accessibility, tone, and visual examples when the sources lack them.

Normalize allowlist emails and integration provider slugs to lowercase kebab-case, record each integration's read/write purpose, and keep private email lists out of chat summaries and generated public documents. Resolve ambiguities with the smallest targeted follow-up.

When the intake answers `office-hours`, use gstack's exact `office-hours` skill before finalizing scope, installing and verifying it with approval per `references/companion-skills.md` if missing, and carry its conclusions and any design document into the project record and plan. `grilling` pressure-tests plans; it does not substitute for requested Office Hours.

Completion: project shape, source material, visible outcome, users, setup choices, domain decision, and every selected branch are concrete or explicitly deferred.

## 5. Approve and set up the project

Read `references/default-web-stack.md` for the setup branches the intake selected. Present one table covering every missing tool, account, permission, project resource, domain action, and proposed repository change, with official sources, browser pages, admin prompts, likely cost/renewal for purchases, and any human-only action. A selected custom domain gets a row naming the domain, Vercel purchase or outside registrar, expected purchase/renewal cost, Vercel project, possible DNS changes, HTTPS provisioning, production-deployment requirement, and human-only actions.

Every project establishes GitHub first (Vercel's GitHub connection depends on it), then Vercel through the official playbook: "Set up Vercel for me. Fetch https://vercel.com/get-started.md and follow it." The playbook links no project, so link the required Vercel project to the web surface during setup, requesting the least permissions that enable the selected repository/team/project. Supabase is created and linked only for public accounts or a selected backend; WorkOS AuthKit is a recorded recommendation for evaluation, never a silent replacement or second auth system.

Get one approval for the complete plan, then execute it. Human-only actions: creating or signing into accounts, GitHub/Vercel OAuth and organization approval, billing entry, registrar verification/privacy/registrant prompts, the canonical-hostname choice, final domain checkout, and nameserver or DNS changes at an outside registrar. Pause immediately before each consent or irreversible action; for checkout, show the exact available domain, price, billing period, and renewal terms when available and wait for final confirmation; report DNS as unverified until actually checked. The agent inspects public DNS/HTTPS and prepares instructions, and never invents account access, exposes credentials, or claims one of these actions is complete. Follow the reference's Custom domain section, which leads non-coders through the purchased, DNS, SSL, production, and live states; domain onboarding is complete only with production-deployment and HTTPS evidence or a named remaining human action, never from DNS or SSL alone.

Secrets go straight into gitignored local files or official secret stores, never chat; verify ignore rules before entry and presence without printing values. Scaffold only into an empty or explicitly approved directory, using the bundled SQL assets for the allowlist and integrations branches. Verify the local artifact, each configured connection, the Vercel project/GitHub connection, and deployment/domain evidence (a preview URL is not production proof), recording whether the domain was purchased, deferred, or omitted, its DNS and SSL state, production deployment state, final verification URL, and any remaining human-only action. When Beads or Beadcrumbs was accepted, initialize after Git exists, Beads first (`bd init`, then `bd setup` for the installed agents), then `bdc init`, following the installed `beadcrumbs` skill without enabling auto-harvest unless asked.

Completion: required tools and accounts authenticate, selected resources exist, the artifact starts or packages, secrets are ignored, GitHub is remote-backed, Vercel is linked, accepted optional ledgers are initialized, and every selected branch has evidence or a named human action.

## 6. Write the product and build documents

Read `references/project-documents.md`. After a concise summary of the confirmed answers and source access status, write:

- `docs/<YYYY-MM-DD>-<slug>-app.md`: project shape, source material, users, value, day-one behavior, content/design or app details, integrations, account strategy, domain, and scope
- `docs/<YYYY-MM-DD>-<slug>-plan.md`: tracer-bullet slices with acceptance criteria, proof paths, setup dependencies, and human-only actions

Plain language first, then concise technical detail. Link external source documents and asset folders rather than copying them, and include production hardening only at the level the user chose. Commit and push once both documents agree with the conversation.

Completion: both documents cite the supplied sources, encode every branch decision, and `hypt-build` can execute the first slice without guessing.

## 7. Finish

Add the repository's smallest useful CI gate for its stack and run it once. Report Identity/defaults created or declined; companions installed, including any Office Hours result and the Beads/Beadcrumbs decision; GitHub, Vercel, Supabase, and WorkOS status; domain status in plain terms (`Domain purchased: yes/no`, `Connected to Vercel: verified/pending`, `HTTPS: active/pending`, `Production deployment: live/missing`, `Next human action: ...`); tool and permission status with open human-only actions; project record and plan paths; repository, preview, domain, and companion-surface URLs. When the custom domain lacks DNS/HTTPS/production evidence or has an open human action, say onboarding is incomplete and point to that exact step; recommend `hypt-build` only when the project is otherwise ready. Offer the cheatsheet, then recommend:

> Use `hypt-build` to build the plan. Say `ship it` when you want Hypt to continue through merge, deployment, and release.
