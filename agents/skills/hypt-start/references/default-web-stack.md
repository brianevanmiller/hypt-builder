# Default web stack setup

Consult only the branches selected during product discovery. Existing repository conventions override this default. `website`, `webapp`, and `desktop` are distinct setup branches; do not scaffold a web app into a desktop-only project or create a backend that the intake did not select.

## Tools and accounts

Default tools are Git, Node/npm/npx, GitHub CLI, Bun, and the Vercel CLI. Use the OS package manager or official signed distribution. Onboard Vercel with the official playbook: "Set up Vercel for me. Fetch https://vercel.com/get-started.md and follow it." It installs the Vercel CLI globally, adds Vercel guidance, and connects the Vercel MCP; do not rely on a transient `bunx vercel` download or a hand-rolled install instead of the playbook. Install the Supabase CLI as a project dependency for Supabase branches, or through the official system package when the user needs a standalone CLI; do not silently add it to unrelated projects.

Authenticate in this order for every project:

1. GitHub with `gh auth login --web`, then verify with `gh auth status`
2. Vercel through the official https://vercel.com/get-started.md playbook (run during onboarding; re-verify with `vercel whoami`)
3. Supabase with `supabase login` (or the selected package-runner equivalent), then verify with `supabase projects list` — web-app account/backend branches only
4. Stripe only for payments
5. Resend only for email
6. Integration providers only when selected

GitHub account access is required even when the repository is not created yet. Connect the selected GitHub repository to Vercel after both accounts are authenticated. The Vercel GitHub App must be installed for the repository owner and granted access to the selected repository; organization owners may need to approve it. Confirm the linked Vercel project and repository rather than treating a local `.vercel` directory as proof of a GitHub connection.

Each OAuth flow needs its own human interaction. Credentials go into official browser pages, a gitignored local file, or the provider's secret store. Never request passwords, API keys, or access tokens in chat.

## Project shape branches

### Website

Use a content-first static or server-rendered web scaffold appropriate to the selected repository. Preserve the main brief, website copy source, Google Drive asset folder, navigation tabs, audience, vibe, and inspiration links in the project record. If the source material is inaccessible, pause the content implementation and record the exact human action needed to grant access or attach/export the source.

Create or link the Vercel project from the GitHub repository, enable automatic deployments, and attach the selected custom domain. For a new domain, check availability and price first; require a final user confirmation immediately before purchase. Vercel supports `vercel domains check`, `vercel domains price`, `vercel domains buy`, and `vercel domains add`. A Vercel-registered domain can use Vercel nameservers and automatic DNS records; an external registrar requires the owner to approve or perform DNS changes. Adding the domain or seeing SSL provision does not publish the app: deploy the intended project to production and verify the custom HTTPS URL afterward. A preview deployment is not sufficient.

### Web app

If other users sign up or the app needs a selected Supabase backend, install `@supabase/supabase-js`, `@supabase/ssr`, and the Supabase CLI, then create and link a remote project. For owner-only apps, do not assume public signup. For an open or invited service, configure the selected auth policy and verify the user journey. When growth and B2B/enterprise requirements make it plausible, record a WorkOS AuthKit evaluation as a decision or follow-up; provisioning WorkOS is a separate approved choice.

For owner/team access, copy `assets/allowlist.sql` to a uniquely timestamped migration and replace the placeholder with the approved email rows. For external integrations, copy `assets/integrations.sql` to the next unique migration. Create one server-only provider adapter per selected integration, an OAuth callback that validates the provider and `state`, and a scheduled sync route protected by `CRON_SECRET`.

### Desktop

Keep the desktop runtime, packaging, signing, and update channel in the repository's selected toolchain. Use Vercel only for the explicitly selected companion web surface, API, update metadata, or download/landing site. A local-only desktop app does not require Supabase, `.env.local`, or a Vercel-hosted backend. If the desktop app has accounts or sync, apply the web-app account and backend branch to its companion service.

## Scaffold

When no stack exists and the directory is empty or approved:

```bash
bunx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-bun
bun add @supabase/supabase-js @supabase/ssr
bun add -d supabase
bunx shadcn@latest init --defaults
bunx supabase init
```

Add `stripe @stripe/stripe-js` only for payments and `resend` only for email.

## Supabase branches

For owner/team access, copy `assets/allowlist.sql` to a uniquely timestamped migration and replace the placeholder with the approved email rows.

For external integrations, copy `assets/integrations.sql` to the next unique migration. Create one server-only provider adapter per selected integration, an OAuth callback that validates the provider and `state`, and a scheduled sync route protected by `CRON_SECRET`.

Create and link the remote Supabase project. Generate the database password locally, store it in a mode-`600` gitignored file, and never print it.

## Environment

Before creating `.env.local`, ensure Git ignores it. Add only selected variables and write a value-free `.env.example`.

Typical variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
RESEND_API_KEY
CRON_SECRET
<PROVIDER>_OAUTH_CLIENT_ID
<PROVIDER>_OAUTH_CLIENT_SECRET
```

Keep service-role keys, OAuth secrets, and cron secrets server-only. Add the same selected values to preview and production through the provider CLI or dashboard without echoing them into logs.

## Git and deployment

Initialize a private GitHub repository when none exists. Commit setup on a branch when repository protection requires it. Link Vercel and push the selected environment variables to development, preview, and production.

Verify:

1. `git status` contains no secret file.
2. The repository remote resolves.
3. Supabase and Vercel report the expected linked project.
4. The local development server returns a successful response.
5. The first preview deployment starts.
6. When a custom domain is selected, DNS is verified, HTTPS is active, a production deployment is assigned to the domain, and both HTTPS hostnames (including the chosen redirect) return the intended app.

Debug a failed condition before declaring setup complete.
