---
name: hypt-start
description: "Onboards a website, web app, desktop project, its owner, required companions, optional Beads/Beadcrumbs, accounts, and build plan. Use when the user wants to start or finish setting up a project."
metadata:
  short-description: "Onboard a Project and Its Owner"
---

# hypt-start — Onboard a Project and Its Owner

Be friendly and direct. Match technical depth to the user's Identity profile; define unavoidable jargon for non-coders.

Resolve this skill's `assets/` and `references/` directories relative to `SKILL.md`.

## Ground

Inspect without exposing secrets:

- Existing `AGENTS.md`, `CLAUDE.md`, plans, package files, source documents, env-file presence, git remote, and deployment config
- OS, architecture, package manager, Git, Node/npm/npx, Bun, GitHub CLI, and authentication state
- Installed global skills with `npx skills list -g --json`
- Optional ledger CLIs when present: `bd --version` and `bdc version --json`

Do not invoke a missing package runner merely to detect it; include installation in the approval plan. Treat attached files, local Markdown paths, Google Docs, and Google Drive links as source material: record each location and whether it is accessible, and never claim to have read a source that the current agent cannot access.

## 1. Resume or start

Determine the project shape before judging readiness: `website`, `webapp`, `desktop`, or another explicitly named shape. Treat a project as fully onboarded when its branch requirements are all true:

- A date-prefixed plan and project record exist, and the selected source documents are linked or attached.
- An appropriate scaffold exists, a GitHub remote exists, and GitHub CLI authentication succeeds.
- Vercel is onboarded through the official playbook at https://vercel.com/get-started.md (CLI installed and authenticated, Vercel guidance present, Vercel MCP connected), the required Vercel project is linked to the web surface (or the desktop companion surface), and the domain decision is recorded. A custom domain is fully onboarded only when DNS is verified, HTTPS works, a production deployment serves it, and canonical/redirect behavior is checked.
- `.env.local` exists only when selected integrations require secrets. Public websites and local-only desktop projects do not need an empty env file.
- A Supabase project and authenticated CLI exist when public web-app accounts, the selected backend, or another intake decision requires Supabase.

Even for an existing project, complete the Identity and companion checks below when absent, including the one-time Beads/Beadcrumbs ask when the project record has no stored decision. If it is then fully onboarded, report the evidence, point the user to `hypt-build`, and stop. When only a plan exists, preserve it, finish missing setup, and do not repeat captured discovery. With no plan, continue through every phase.

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

## 3. Install companions

Read `references/companion-skills.md`.

These companions are part of Hypt's composed workflow, not optional recommendations. Compare the required names with the global skill list and present one installation plan for missing skills. Installing globally changes the user's agent setup, so get explicit approval immediately before running the commands.

Install only missing required skills. Install coder-only visual companions only for a coder profile. Verify every selected name with `npx skills list -g --json`.

If required-companion installation is declined or blocked, state that onboarding is incomplete, listing the exact missing skills and commands, then continue with the optional-ledger ask. The conditional `office-hours` branch is handled only when the user requests startup-idea direction or vetting.

### Optional local ledgers

Read the optional-ledger instructions in `references/companion-skills.md`. Ask once, in one message, when the project record has no stored Beads or Beadcrumbs decision. Skip a tool that is already installed. Skip the Beads offer when Linear or another hosted tracker is already in use; GitHub Issues alone is not that tracker. Skip Beadcrumbs on Windows.

> Beadcrumbs keeps a local ledger of what agents learn while building — corrections, discoveries, rejected approaches — so that reasoning can be harvested later instead of disappearing with the session. Want me to install it?
>
> If you don't already use Linear or another hosted tracker, I can also install Beads so agents can track their work as a local dependency graph. Want that too?

Declining either is fine; onboarding continues. If both are accepted, install the Beads CLI first, then the Beadcrumbs CLI and `beadcrumbs` skill. Get approval for the exact commands, including Beadcrumbs' binary size and platform limit, immediately before running them.

Install accepted global CLIs and skills in this step. Defer `bd init` and `bdc init` until the project has a Git repository in step 5. Record the decision even when the user declines.

Completion: every required companion is globally discoverable; coder visual companions are discoverable when applicable; each optional ledger is installed, declined, unsupported, or already present.

## 4. Batch project intake

Do not ask these one at a time. Ask one intake message so the user can answer in a single response. Tell them they may write `covered in <file or link>` for anything already present in a source document, and may answer `unknown` where a later decision is safe:

> Tell me about the project in one reply. Please include:
>
> 1. **Shape and outcome:** Is it a public `website`, a `webapp` where people use an online service, a `desktop` app, or another shape? What is its name, what should it help people accomplish, who is it for, and what are the three to five day-one actions? What makes it distinct, if anything?
> 2. **Main brief:** Attach the main Markdown/document file, give me a local path, or share the Google Doc URL that describes the project in detail. If there is no separate brief, say `use this reply as the brief`.
> 3. **Website branch:** If this is a website, provide the Google Doc or attached Markdown containing the website copy, a Google Drive folder link for images and other assets, the main navigation tabs, target audience, desired vibe, and design inspiration links or a description. Say which of these are already covered in the brief.
> 4. **Web-app branch:** If this is a web app, should other people sign up for the service? If yes, which sign-in methods and access policy do you want (owner-only, named allowlist, invited team, or open signup)? What data, payments, emails, and external integrations are needed? Do you expect a startup that could grow to thousands or millions of users, and is it consumer or B2B/enterprise? This determines whether I should vet Supabase Auth against a WorkOS AuthKit recommendation; it does not choose a provider silently.
> 5. **Desktop branch:** If this is a desktop app, which operating systems and distribution/update path matter? Is it local-only, or does it need accounts, sync, a database, or an API? What should Vercel host for it: a landing/download/update site, an API, or another companion web surface?
> 6. **Shared setup:** Do you already have a GitHub account/repository, a Vercel account/team, or a Supabase account? Should I create/link a Vercel project automatically from GitHub? Give the desired project/repository names and visibility if known.
> 7. **Domain:** A domain is your public address (for example, `example.com`); Vercel is where the app runs. Do you already own one, want to buy one through Vercel, buy one through another registrar, or defer the purchase and use the Vercel URL? Give the desired domain and alternatives, the registrar if already owned, whether you approve DNS changes for an outside registrar, and whether `www` should redirect to the apex (`example.com`) or the apex should redirect to `www`.
> 8. **Idea pressure-testing:** Is this a new startup idea that needs direction or vetting before setup? Answer `office-hours`, `skip`, or `later`.
> 9. **Build posture:** Prototype, normal production, or sensitive/critical? Include brand colors, logo, accessibility, tone, and visual examples when they are not in the supplied sources.

Normalize allowlist emails and integration provider slugs to lowercase kebab-case, record each integration's read/write purpose, and keep private email lists out of chat summaries and generated public documents. Resolve ambiguities with only the smallest targeted follow-up after the batch response.

### Conditional product vetting

When the intake requests `office-hours`, use gstack's exact `office-hours` skill before finalizing scope. Read the conditional companion instructions in `references/companion-skills.md`; install and verify it only with approval if it is not already available. Carry its conclusions and any resulting design document into the project record and plan. `grilling` remains the plan-pressure test; it is not a substitute for requested Office Hours.

Completion: project shape, source material, visible outcome, users, setup choices, domain decision, and every selected branch are concrete, or explicitly deferred.

## 5. Approve and set up the project

Read `references/default-web-stack.md` only for setup branches the intake requires. Present one table covering every missing tool, account, permission, project resource, domain action, and proposed repository change. Include official sources, browser pages, admin prompts, likely cost/renewal for purchases, and any human-only action. For a selected custom domain, include a row naming the domain, Vercel purchase or outside registrar, expected purchase/renewal cost, Vercel project, possible DNS changes, HTTPS provisioning, production deployment requirement, and human-only actions.

Every project must establish GitHub and Vercel access. GitHub comes first because Vercel's GitHub connection uses it. Onboard Vercel the official way: "Set up Vercel for me. Fetch https://vercel.com/get-started.md and follow it." That playbook installs the Vercel CLI, adds Vercel guidance, and connects the Vercel MCP once per machine and agent; it deliberately links no project, so link the required Vercel project to the web surface during project setup. Request the least permissions that enable the selected repository/team/project and GitHub App connection; an organization owner may need to approve access. When the project uses public accounts or a selected Supabase backend, install and authenticate the Supabase CLI and create/link the Supabase project. Recommend WorkOS AuthKit for further evaluation when the growth and B2B/enterprise answers make it a fit, without silently replacing Supabase or provisioning a second auth system.

Get one approval for the complete setup plan, then execute it. Browser account creation, OAuth consent, organization approval, billing entry, registrar verification/privacy prompts, canonical-hostname choice, and paid domain checkout remain human actions. Pause immediately before each consent or irreversible action. For domain checkout, show the exact available domain, price, billing period, and renewal terms when available, then wait for final purchase confirmation. For an outside registrar, get explicit approval before changing nameservers or DNS records; report DNS as unverified until actually checked.

### Custom domain path

Lead with this model for non-coders:

- **Purchased:** registration exists, but the app may not be connected.
- **DNS configured:** the address points toward Vercel, but there may be no published app.
- **SSL pending/active:** Vercel normally provisions HTTPS automatically after the domain is connected and DNS validation succeeds; pending or active SSL still does not publish the app.
- **Preview deployment:** a branch or pull request version, not the public production version.
- **Production deployment:** the published project version the custom domain should serve.
- **Live:** DNS is verified, HTTPS works, the domain is assigned to production, and an HTTPS request returns the intended app.

Buying a domain, pointing DNS, getting SSL, and deploying to production are separate steps. Dashboard labels may vary slightly. Present this procedure:

1. Confirm or create the Vercel project and connect the approved repository.
2. In that project, add the apex domain and, when appropriate, its `www` variant.
3. For a Vercel-purchased domain, check whether Vercel already configured DNS. For an outside registrar, show Vercel's exact records or nameservers and pause for owner approval before changes.
4. Record the canonical hostname and configure the other hostname to redirect to it.
5. Wait for Vercel to verify DNS and provision HTTPS.
6. Deploy the intended project to production, normally by pushing approved code to `main` through the connected Git workflow. The dashboard is the preferred path for a non-coder.
7. Confirm the production deployment is assigned to the custom domain, then test both `https://` hostnames and the redirect.

If Vercel says “Your domain is properly configured, but you don't have a production deployment” (or equivalent), explain that DNS is probably correct but the project still needs publication. Have the user push approved code to the production branch or use the dashboard's production-deployment action, refresh Domains or Deployments, confirm the production deployment is associated with the domain, and test HTTPS. Offer `vercel --prod` only as an alternative after the project is linked and the user is authenticated; never make CLI the only path.

Do not mark domain onboarding complete from DNS or SSL alone. Require evidence of a production deployment and a successful HTTPS/domain check, or name the remaining human action.

**Human-only actions:** the user must create or sign into Vercel, approve GitHub/Vercel OAuth or organization access, enter billing details, confirm the canonical hostname, complete the final domain purchase, approve nameserver/DNS changes for an outside registrar, and resolve registrar verification, privacy, or registrant prompts. The agent may inspect public DNS/HTTPS and prepare instructions, but never invent account access, expose credentials, or claim one of these actions is complete.

Secrets go directly into gitignored local files or official secret stores, never chat. Verify ignore rules before secret entry and verify presence without printing values. Scaffold only into an empty or explicitly approved directory. Use the bundled SQL assets for allowlist or integrations when those branches apply. Verify the local artifact, each configured connection, the Vercel project/GitHub connection, and deployment/domain evidence. A preview URL is not production proof. Record whether the domain was purchased, deferred, or intentionally omitted; its DNS and SSL state; production deployment state; final verification URL; and any remaining human-only action.

When Beads or Beadcrumbs was accepted, initialize them only after Git exists, Beads first: `bd init` and `bd setup` for the installed agents, then `bdc init` if Beadcrumbs was accepted. Follow the installed `beadcrumbs` skill; do not enable auto-harvest unless asked.

Completion: required tools and accounts authenticate, the selected project resources exist, the artifact starts or packages, secrets are ignored, GitHub is remote-backed, Vercel is linked, accepted optional ledgers are initialized, and every selected branch has evidence or a named human action.

## 6. Write the product and build documents

Read `references/project-documents.md`.

After presenting a concise summary of the confirmed answers and source access status, write:

- `docs/<YYYY-MM-DD>-<slug>-app.md`: project shape, source material, users, value, day-one behavior, content/design or app details, integrations, account strategy, domain, and scope
- `docs/<YYYY-MM-DD>-<slug>-plan.md`: tracer-bullet implementation slices with acceptance criteria, proof paths, setup dependencies, and human-only actions

Use plain language first, then concise technical detail. Preserve links to external source documents and asset folders instead of creating stale duplicate content. Include production hardening only at the level the user chose. Commit and push the onboarding result after both documents agree with the conversation.

Completion: both documents cite the supplied sources, encode every branch decision, and `hypt-build` can execute the first slice without guessing.

## 7. Finish

Add the repository's smallest useful CI gate for its current stack; avoid speculative suites. Run it once.

Report:

- Identity/defaults created or declined
- Companion skills installed, including any conditional Office Hours result and the Beads/Beadcrumbs decision
- GitHub, Vercel, Supabase, WorkOS recommendation, and domain status. Summarize it plainly: `Domain purchased: yes/no`, `Connected to Vercel: verified/pending`, `HTTPS: active/pending`, `Production deployment: live/missing`, and `Next human action: ...`.
- Tool and permission status, with human-only actions still open
- Project record and plan paths
- Repository, preview, domain, and companion-surface URLs

If the custom domain is missing DNS/HTTPS/production evidence or has an open human action, say onboarding is incomplete and point to that exact next step. Recommend `hypt-build` only when the project is otherwise ready.

Offer the cheatsheet, then recommend:

> Use `hypt-build` to build the plan. Say `ship it` when you want Hypt to continue through merge, deployment, and release.
