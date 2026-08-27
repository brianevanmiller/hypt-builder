---
name: hypt-close
description: "Closes a ready PR by updating project tracking, confirming the merge, verifying deployment, and creating a release. Use when the user asks to merge or ship completed work."
metadata:
  short-description: "Merge PR and Wrap Up (With Confirmation)"
---

# hypt-close — Merge PR and Wrap Up (With Confirmation)

## Context

Before starting, gather context by running:

- Run `gh pr view --json number,title,url,state,mergeStateStatus 2>/dev/null || echo "No PR found"` to capture PR status.

- Recent commits: `git log --oneline -5`
- Branch: `git branch --show-current`

## Instructions

### Step 1: Final quality pass

Review the complete branch diff, unresolved PR comments, and failing checks. Fix material correctness, security, and build issues; run the repository's relevant checks; leave optional style preferences alone.

### Step 2: Update documentation

Update documentation affected by the branch: check off completed backlog or roadmap items, update README or feature docs when behavior changed, and repair links to moved files.

### Step 3: Suggest next tasks and update backlog

Identify concrete follow-up work revealed by the branch. Offer to add non-duplicate, actionable items to the project's existing backlog; otherwise include them in the final summary without creating a new tracking system.

### Step 4: Polish PR before merge

Before merging, make sure the PR title and description accurately represent all the work in this branch.

**Gather the full picture:**
```bash
# All commits on this branch vs main
git log origin/main..HEAD --oneline --no-merges
# Summary of all files changed
git diff origin/main..HEAD --stat
# Current PR info
gh pr view --json title,body --jq '{title, body}' 2>/dev/null
```

**Evaluate the current PR title:**
- If it's just the branch name, auto-generated, or doesn't reflect the work: update it
- Use conventional commit style: `feat: ...`, `fix: ...`, `chore: ...`
- Keep it under 70 characters

**Regenerate the PR body** from all commits and files changed. Use this format:

```
## Summary
<2-4 bullet points summarizing what this PR does overall, written from the user's perspective>

## Changes
<one bullet per logical change, concise — group related commits>
```

**Update the PR:**
```bash
gh pr edit --title "<polished title>" --body "$(cat <<'EOF'
<generated body>
EOF
)"
```

### Step 4b: Prepare the release on the feature branch

Read the latest GitHub release, `VERSION` when present, and the top changelog entry. If the branch already prepares one coherent version newer than the latest release, record that as `<NEW_VERSION>` and keep it.

Otherwise, choose a patch bump for fixes and small maintenance or a minor bump for features and significant enhancements. Ask the user only when the change type is genuinely ambiguous. Update `VERSION` and `CHANGELOG.md` when the repository uses them, commit the release preparation on the feature branch, and push it:

```bash
git add CHANGELOG.md
test ! -f VERSION || git add VERSION
git diff --cached --quiet || git commit -m "chore: bump version to v<NEW_VERSION>"
git push
```

Refresh the PR summary to mention the prepared version. The squash merge carries these files through protected `main`; never create a post-merge version commit directly on `main`.

### Step 5: Confirmation gate

Before merging, present a clear summary and ask for confirmation.

Gather the current state:
```bash
gh pr view --json number,title,url,state,additions,deletions,files
```

Present the user with:

> **Ready to merge.** Here's a summary of what's shipping:
>
> - **PR:** #{number} — {title}
> - **URL:** {url}
> - **Changes:** +{additions} / -{deletions} across {file_count} files
>
> **Merge and close?** (yes/no)

Wait for the user's explicit confirmation. Do NOT proceed until they confirm.

- If the user says **yes** (or equivalent: "go", "ship it", "merge", "lgtm", "do it"): proceed to Step 6.
- If the user says **no** (or asks for changes): stop and let the user address their concerns. They can use the `hypt-close` skill again when ready.

### Step 6: Ensure PR exists, then merge

Check if a PR exists for this branch:
```bash
gh pr view --json number,url 2>/dev/null
```

If no PR exists, create one:
```bash
git push -u origin HEAD
gh pr create --fill
```

Wait for the release-preparation push to finish its required checks and confirm the PR is mergeable.

Then merge:
```bash
gh pr merge --squash --delete-branch
```

If merge fails:
- If checks are failing: report which checks failed and stop. Tell the user to fix the issues and use the `hypt-close` skill again.
- If there are merge conflicts: report the conflicts and stop.
- If the PR is not in a mergeable state: report why and stop.

After successful merge, switch to main and pull. If another worktree already has `main` checked out, fetch it instead:
```bash
git checkout main && git pull 2>/dev/null || git fetch origin main
```

### Step 7: Check deployment

Detect the deployment platform:
```bash
ls vercel.json .vercel/ 2>/dev/null && echo "PLATFORM=vercel"
ls netlify.toml _redirects 2>/dev/null && echo "PLATFORM=netlify"
ls fly.toml 2>/dev/null && echo "PLATFORM=fly"
ls render.yaml 2>/dev/null && echo "PLATFORM=render"
ls railway.json railway.toml 2>/dev/null && echo "PLATFORM=railway"
```

Try to find deployment status and URLs using the detected platform:

**Method 1 — GitHub check runs:**
```bash
gh pr view --json statusCheckRollup --jq '.statusCheckRollup[] | select(.name | test("vercel|netlify|deploy|Vercel|Netlify"; "i")) | {name, status: .status, conclusion: .conclusion, url: .detailsUrl}' 2>/dev/null
```

**Method 2 — GitHub Deployments API:**
```bash
REPO=$(gh repo view --json nameWithOwner --jq '.nameWithOwner')
gh api "repos/$REPO/deployments?per_page=3" --jq '.[] | {environment, id}' 2>/dev/null
```
Then get status for each:
```bash
gh api "repos/$REPO/deployments/<ID>/statuses" --jq '.[0] | {state, target_url, description}' 2>/dev/null
```

**Note:** After merging, prefer Method 2 (GitHub Deployments API) for production deployment status, since PR check runs may not update after merge. You are now on `main` or have fetched it after Step 6.

**Check for Vercel team access block:**

If any deployment status description matches the Vercel team access detection criteria (`TEAM_ACCESS`, `not a member`, or `contributing access`), this means Vercel is blocking auto-deploys because the commit author isn't a seated team member (free plan limitation). Do NOT treat this as a build failure.

Instead:
- Inform the user: "Vercel blocked the auto-deploy — commit author isn't a team member. Deploying via CLI bypass..."
- Use the `hypt-deploy` skill, which owns the bundled Vercel bypass helper and deployment health check.
- Carry its production URL and health result into the close summary below.

Report whatever you find:
- **Preview URL**: The deployment URL for this specific PR/branch
- **Production URL**: The main deployment URL (if this was merged to main)

If no deployment info is available, say:
> Deployment info not available. Check your deployment dashboard for status.

### Step 8: Review CI for the new feature

After merging, briefly assess whether the feature that was just shipped warrants any CI additions. This is NOT about adding everything — only suggest changes that directly protect against regressions in the new feature.

**Check what was built:**

Use the PR number from the Context section (captured before merge) to retrieve the PR info:
```bash
gh pr view <PR_NUMBER> --json title,body --jq '"\(.title)
\(.body)"' 2>/dev/null
```

Read the merged PR title/body and recent commits to understand what was shipped.

**Evaluate against these high-value CI additions only:**

| What was shipped | Worth adding to CI? | Why |
|-----------------|-------------------|-----|
| Database migrations or schema changes | **Yes** — suggest Supabase migration validation | Schema breaks are silent and catastrophic |
| Auth logic, RLS policies, or permission changes | **Yes** — suggest auth/RLS integration tests | Security regressions are the worst kind of bug |
| Payment or transaction flows | **Yes** — suggest transaction integration tests | Money bugs erode trust instantly |
| New API routes or server actions | **Maybe** — only if they handle user input | Input validation bugs are common |
| UI components, styling, layout | **No** — skip | Visual bugs are caught in QA, not CI |
| Config changes, env vars, docs | **No** — skip | Low regression risk |

**If there's a high-value suggestion**, present it briefly:

> **CI suggestion:** Now that [feature] is live, it'd be worth adding [specific test type] to CI. This would catch [specific risk] automatically. Want me to set that up? (Ask hypt to set up CI in a new workspace.)

Keep it to ONE suggestion max. If nothing is high-value, say nothing about CI — don't clutter the close summary.

### Step 9: Create the GitHub release

The version and changelog prepared in Step 4b are now on `main` through the squash merge. Create the corresponding tag and release without making another commit:

```bash
gh release create v<NEW_VERSION> --title "v<NEW_VERSION>" --generate-notes
```

Capture the release URL from the output.

### Step 10: Final summary

```
Closed!
- PR #X merged to main
- Released: v<NEW_VERSION> (<release URL>)
- Completed: <N items checked off in docs / no items matched>
- Backlog: <N items added to docs/todos/backlog.md / no changes>
- Preview: <url or "checking...">
- Production: <url or "checking...">
- Branch cleaned up
```
