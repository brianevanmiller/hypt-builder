# Default web stack setup

Consult only the branches selected during intake; existing repository conventions override this default. `website`, `webapp`, and `desktop` are distinct branches: a desktop-only project gets no web-app scaffold, and no backend is created that the intake did not select.

## Tools and accounts

Default tools are Git, Node/npm/npx, GitHub CLI, Bun, and the Vercel CLI, installed through the OS package manager or official signed distribution. Onboard Vercel with the official playbook, "Set up Vercel for me. Fetch https://vercel.com/get-started.md and follow it.", which installs the Vercel CLI globally, adds Vercel guidance, and connects the Vercel MCP; a transient `bunx vercel` download or hand-rolled install is not a substitute. Install the Supabase CLI as a project dependency for Supabase branches, or through the official system package when the user needs a standalone CLI, and only in projects that selected it.

Authenticate in this order for every project:

1. GitHub with `gh auth login --web`, verified by `gh auth status`
2. Vercel through the playbook, re-verified with `vercel whoami`
3. Supabase with `supabase login` (or the package-runner equivalent), verified by `supabase projects list`: web-app account/backend branches only
4. Stripe only for payments
5. Resend only for email
6. Integration providers only when selected

GitHub account access is required even before the repository exists. Connect the selected repository to Vercel after both accounts authenticate: the Vercel GitHub App must be installed for the repository owner and granted access to the repository, which an organization owner may need to approve. Confirm the linked Vercel project and repository rather than treating a local `.vercel` directory as proof.

Each OAuth flow needs its own human interaction. Credentials go into official browser pages, a gitignored local file, or the provider's secret store, never chat.

## Project shape branches

### Website

Use a content-first static or server-rendered scaffold appropriate to the repository. Preserve the main brief, website copy source, Google Drive asset folder, navigation tabs, audience, vibe, and inspiration links in the project record. If source material is inaccessible, pause content implementation and record the exact human action needed to grant access or export the source. Create or link the Vercel project from the GitHub repository, enable automatic deployments, and attach the selected custom domain per the Custom domain section.

### Web app

If other users sign up or the app needs a selected Supabase backend, install `@supabase/supabase-js`, `@supabase/ssr`, and the Supabase CLI, then create and link a remote project. Owner-only apps get no public signup; an open or invited service gets the selected auth policy with the user journey verified. When growth and B2B/enterprise requirements make it plausible, record a WorkOS AuthKit evaluation as a decision or follow-up; provisioning WorkOS is a separate approved choice.

### Desktop

Keep the desktop runtime, packaging, signing, and update channel in the repository's selected toolchain. Use Vercel only for the explicitly selected companion web surface, API, update metadata, or download/landing site. A local-only desktop app needs no Supabase, `.env.local`, or Vercel-hosted backend; a desktop app with accounts or sync applies the web-app account and backend branch to its companion service.

## Custom domain

Buying a domain, pointing DNS, getting SSL, and deploying to production are separate steps. Lead with this model for non-coders (dashboard labels vary slightly):

| State | Meaning |
|---|---|
| Purchased | Registration exists; the app may not be connected. |
| DNS configured | The address points toward Vercel; there may be no published app. |
| SSL pending/active | Vercel provisions HTTPS automatically after the domain is connected and DNS validates; it still does not publish the app. |
| Preview deployment | A branch or pull-request version, not the public production version. |
| Production deployment | The published project version the custom domain should serve. |
| Live | DNS verified, HTTPS working, domain assigned to production, and an HTTPS request returns the intended app. |

For a new domain, check availability and price first and require final user confirmation immediately before purchase (`vercel domains check`, `vercel domains price`, `vercel domains buy`, `vercel domains add`). A Vercel-registered domain can use Vercel nameservers and automatic DNS; an outside registrar requires the owner to approve or perform DNS changes.

1. Confirm or create the Vercel project and connect the approved repository.
2. Add the apex domain to that project and, when appropriate, its `www` variant.
3. For a Vercel-purchased domain, check whether Vercel already configured DNS. For an outside registrar, show Vercel's exact records or nameservers and pause for owner approval before changes.
4. Record the canonical hostname and configure the other hostname to redirect to it.
5. Wait for Vercel to verify DNS and provision HTTPS.
6. Deploy the intended project to production, normally by pushing approved code to `main` through the connected Git workflow. The dashboard is the preferred path for a non-coder; `vercel --prod` is an alternative only once the project is linked and the user is authenticated, never the only path.
7. Confirm the production deployment is assigned to the custom domain, then test both `https://` hostnames and the redirect.

When Vercel says "Your domain is properly configured, but you don't have a production deployment" (or equivalent), DNS is probably correct and the project still needs publication: have the user push approved code to the production branch or use the dashboard's production-deployment action, refresh Domains or Deployments, confirm the production deployment is associated with the domain, and test HTTPS. Domain onboarding is complete only with evidence of a production deployment and a successful HTTPS check on both hostnames, or a named remaining human action; DNS or SSL alone is not completion, and a preview deployment is not production.

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

For owner/team access, copy `assets/allowlist.sql` to a uniquely timestamped migration and replace the placeholder with the approved email rows. For external integrations, copy `assets/integrations.sql` to the next unique migration, then create one server-only provider adapter per selected integration, an OAuth callback that validates the provider and `state`, and a scheduled sync route protected by `CRON_SECRET`.

Create and link the remote Supabase project. Generate the database password locally, store it in a mode-`600` gitignored file, and never print it.

## Environment

Ensure Git ignores `.env.local` before creating it. Add only selected variables and write a value-free `.env.example`. Typical variables:

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

Initialize a private GitHub repository when none exists, committing setup on a branch when repository protection requires it. Link Vercel and push the selected environment variables to development, preview, and production. Setup is complete only when `git status` contains no secret file, the repository remote resolves, Supabase and Vercel report the expected linked project, the local development server returns a successful response, the first preview deployment starts, and, for a selected custom domain, DNS is verified, HTTPS is active, a production deployment is assigned to the domain, and both HTTPS hostnames (including the chosen redirect) return the intended app; debug any failed condition first.
