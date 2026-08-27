---
name: hypt-deploy
description: "Finds and verifies preview or production deployments, with bounded remediation for supported failures. Use for deployment status, deploy verification, or deployment diagnosis."
metadata:
  short-description: "Verify or Diagnose a Deployment"
---

# hypt-deploy — Verify or Diagnose a Deployment

Resolve `scripts/vercel-bypass` relative to this `SKILL.md`.

## Modes

- **Status:** read deployment state and health without triggering or repairing anything.
- **Remediate:** diagnose a failed deployment and apply only the bounded Vercel access bypass. Code fixes return to `hypt-build`.
- **Production:** verify the deployment for the target branch after merge.

## 1. Locate the subject

Read repository instructions, current branch and SHA, PR when present, provider config, GitHub checks, and GitHub Deployments.

Select:

- PR head and preview environment for a branch with a PR
- Target-branch head and production environment for production mode or a branch without a PR

Do not stash, switch branches, or mutate the worktree merely to inspect a deployment.

Detect Vercel, Netlify, Fly.io, Render, or Railway from repository config. With no provider match, use GitHub Deployments as the generic source.

Completion: provider, environment, expected SHA, deployment ID, state, and URL are known.

## 2. Wait within bounds

For `pending` or `in_progress`, poll every 15 seconds for at most two minutes. Confirm the resulting deployment still targets the expected SHA.

Stop and report when no deployment appears, the timeout expires, or the deployment points at another revision.

## 3. Diagnose failure

Read check details, deployment status description, and available provider logs. Reproduce locally only when the repository already exposes a build command.

For Vercel descriptions containing `TEAM_ACCESS`, `not a member`, or `contributing access`, use the bundled helper:

```bash
# Preview
"<skill-dir>/scripts/vercel-bypass"

# Production
"<skill-dir>/scripts/vercel-bypass" --prod
```

Interpret:

- Exit `0`: use the returned URL and continue to health verification.
- Exit `1`: stop with the helper error.
- Exit `2`: no access block; continue normal diagnosis.

This bypass is idempotent for the target revision. Run it at most once per deployment check.

For a code, configuration, or dependency failure, report the reproducing evidence and invoke `hypt-build` for the fix. `hypt-deploy` does not create and merge an unreviewed fix branch.

## 4. Verify health

Require both:

1. Provider state is successful for the expected SHA.
2. The target URL returns the expected application response.

Use an HTTP check for basic reachability. For a user-facing route, use browser or computer use to load the real page when the caller has not already captured current proof.

Do not round redirects, auth walls, placeholder pages, or a successful deployment record up to application health. State exactly what was observed.

## Return

```text
Deployment
- Environment: <preview or production>
- Provider: <provider>
- Revision: <sha>
- State: <provider state>
- URL: <url>
- Health: <observed result>
- Remediation: <none, Vercel bypass, or returned to hypt-build>
```

Completion: the report ties provider state and application health to the expected revision.
