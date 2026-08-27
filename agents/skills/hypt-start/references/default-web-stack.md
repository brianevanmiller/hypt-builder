# Default web stack setup

Consult only the branches selected during product discovery. Existing repository conventions override this default.

## Tools and accounts

Default tools are Git, Node/npm/npx, GitHub CLI, and Bun. Use the OS package manager or official signed distribution. Run Vercel and Supabase CLIs on demand rather than installing them globally.

Authenticate in this order:

1. GitHub with `gh auth login --web`
2. Vercel with GitHub OAuth and `bunx vercel login`
3. Supabase with GitHub OAuth and `bunx supabase login`
4. Stripe only for payments
5. Resend only for email
6. Integration providers only when selected

Each OAuth flow needs its own human interaction. Credentials go into official browser pages, a gitignored local file, or the provider's secret store.

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

Debug a failed condition before declaring setup complete.
