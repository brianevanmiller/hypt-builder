# Project document shapes

Write dated, kebab-case files. Adapt headings to existing repository documentation rather than creating duplicate sources of truth.

## App document

```markdown
# <App name>

## Purpose
<Who it helps, what they accomplish, and why it matters.>

## Day-one experience
- <User-visible action and outcome>

## Users and access
<User groups, sign-in method, and allowlist/open policy.>

## Integrations
| Provider | Read/write purpose | Human setup |
|---|---|---|

## Design direction
<Brand, tone, accessibility, and examples.>

## Scope
### Included
- <Day-one behavior>

### Later
- <Explicitly deferred behavior>
```

## Build plan

```markdown
# <App name> — Build plan

## Outcome
<Observable definition of done.>

## Constraints
- <Security, data, product, or operational constraint>

## Tracer bullets

### 1. <Thin end-to-end slice>
- **Behavior:** <user-visible result>
- **Implementation:** <modules/interfaces affected>
- **Acceptance:** <checkable criteria>
- **Proof:** <browser/runtime path and smallest automated check>
- **Depends on:** <prior slice or none>

## Data and integrations
<Authoritative schemas, migrations, external seams, and rollback.>

## Operations
<Environment, observability, deployment, and post-merge work.>

## Production hardening
<Only the level the user selected: prototype, normal production, or sensitive/critical.>
```

Each slice must leave the repository runnable and verifiable. Prefer one real vertical path before building layer depth. The plan is complete when `hypt-build` can map every acceptance criterion to a slice and proof path.
