---
name: hypt-deploy
description: "Finds and verifies preview or production deployments, with bounded remediation for supported failures. Use for deployment status, deploy verification, or deployment diagnosis."
metadata:
  short-description: "Verify or Diagnose a Deployment"
---

# hypt-deploy — Verify or Diagnose a Deployment

Resolve `scripts/vercel-bypass` relative to this `SKILL.md`.

Modes: **status** reads deployment state and health without triggering or repairing anything; **remediate** diagnoses a failed deployment and applies only the bounded Vercel access bypass, returning code fixes to `hypt-build`; **production** verifies the target-branch deployment after merge.

## 1. Locate the subject

Read repository instructions, current branch and SHA, the PR when present, provider config, GitHub checks, and GitHub Deployments. A branch with a PR resolves to the PR head and preview environment; production mode or a branch without a PR resolves to the target-branch head and production environment. Inspect without stashing, switching, or mutating the worktree.

Detect Vercel, Netlify, Fly.io, Render, or Railway from repository config; with no match, GitHub Deployments is the generic source.

Completion: provider, environment, expected SHA, deployment ID, state, and URL are known.

## 2. Wait within bounds

For `pending` or `in_progress`, poll every 15 seconds for at most two minutes, then confirm the resulting deployment still targets the expected SHA. Stop and report when no deployment appears, the timeout expires, or the deployment points at another revision.

## 3. Diagnose failure

Read check details, the deployment status description, and available provider logs. Reproduce locally only when the repository already exposes a build command.

For Vercel descriptions containing `TEAM_ACCESS`, `not a member`, or `contributing access`, run the bundled helper at most once per deployment check (it is idempotent for the target revision):

```bash
"<skill-dir>/scripts/vercel-bypass"          # preview
"<skill-dir>/scripts/vercel-bypass" --prod   # production
```

| Exit | Meaning |
|---|---|
| `0` | Use the returned URL; continue to health verification. |
| `1` | Stop with the helper error. |
| `2` | No access block; continue normal diagnosis. |

For a code, configuration, or dependency failure, report the reproducing evidence and invoke `hypt-build` for the fix; `hypt-deploy` never creates and merges an unreviewed fix branch.

## 4. Verify health

Require both: provider state is successful for the expected SHA, and the target URL returns the expected application response. Use an HTTP check for reachability; for a user-facing route, load the real page through browser or computer use unless the caller already captured current proof. Redirects, auth walls, placeholder pages, and a successful deployment record are not application health; state exactly what was observed.

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
