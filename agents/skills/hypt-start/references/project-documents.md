# Project document shapes

Write dated, kebab-case files. Adapt headings to existing repository documentation rather than creating duplicate sources of truth.

## Project record

Use this shape for a `website`, `webapp`, or `desktop` project. Preserve source links rather than copying a source document's full contents into a second, stale source of truth.

```markdown
# <Project name>

## Shape and purpose
- **Shape:** <website | webapp | desktop | other>
- **Purpose:** <Who it helps, what they accomplish, and why it matters.>
- **Distinctive idea:** <Difference, or not yet known>

## Source material
| Source | Kind | Access status | How it is used |
|---|---|---|---|
| <path or URL> | <brief, website copy, assets, inspiration> | <read / attached / inaccessible> | <content or decision>

## Users and access
<User groups, sign-in method, and allowlist/invite/open policy.>

## Day-one experience
- <User-visible action and outcome>

## Website or desktop surface
- **Navigation/content:** <tabs, copy source, and audience, or N/A>
- **Assets:** <Google Drive/local asset source, or N/A>
- **Design direction:** <Brand, tone, accessibility, inspiration, and examples.>
- **Desktop targets and distribution:** <OS, packaging, signing, update path, or N/A>

## Accounts and growth
- **GitHub/Vercel:** <account, repository, team, project, and GitHub App permission status>
- **Supabase:** <project and auth/backend decision, or N/A>
- **WorkOS:** <evaluation and rationale, or N/A>
- **Growth posture:** <prototype, normal production, sensitive/critical; expected scale and consumer/B2B context>
- **Task tracking:** <Linear / GitHub Issues / Beads / other / none>
- **Beadcrumbs:** <installed and initialized / declined / unsupported platform / not asked>

## Integrations
| Provider | Read/write purpose | Human setup |
|---|---|---|

## Domain and deployment
- **Desired domain:** <name and alternatives>
- **Ownership/purchase:** <Vercel purchase, existing registrar, or deferred>
- **DNS/connection status:** <status and remaining human action>
- **Preview/deployment URL:** <URL or pending>

## Scope
### Included
- <Day-one behavior>

### Later
- <Explicitly deferred behavior>
```

## Build plan

```markdown
# <Project name> — Build plan

> Project record: [relative link to the project record]

## Outcome
<Observable definition of done for the selected website, web app, desktop app, or companion surface.>

## Source and setup dependencies
- **Source material:** <links/paths and access status>
- **Accounts/resources:** <GitHub, Vercel, Supabase, WorkOS decision, domain, Beads/Beadcrumbs>
- **Human-only actions:** <OAuth, organization approval, payment, DNS, signing credentials>

## Constraints
- <Security, data, product, platform, distribution, or operational constraint>

## Tracer bullets

### 1. <Thin end-to-end slice>
- **Behavior:** <user-visible result>
- **Implementation:** <modules/interfaces affected>
- **Acceptance:** <checkable criteria>
- **Proof:** <browser/runtime/package path and smallest automated check>
- **Depends on:** <prior slice or none>

## Data and integrations
<Authoritative schemas, migrations, external seams, auth strategy, and rollback.>

## Operations and distribution
<Environment, observability, deployment, desktop packaging/signing/update path, and post-merge work.>

## Production hardening
<Only the level the user selected: prototype, normal production, or sensitive/critical.>
```

Each slice must leave the repository runnable and verifiable. Prefer one real vertical path before building layer depth. The plan is complete when `hypt-build` can map every acceptance criterion to a slice and proof path.
