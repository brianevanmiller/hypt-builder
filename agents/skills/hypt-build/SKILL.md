---
name: hypt-build
description: "Runs the development pipeline through a review-ready PR without merging. Use when a workflow needs research, planning, implementation, review, and tests."
metadata:
  short-description: "Build to a Review-ready PR (No Merge)"
---

# hypt-build — Build to a Review-ready PR (No Merge)

## Context

Before starting, gather context by running:

- Run `git branch --show-current` to capture Branch.

- PR status: `gh pr view --json number,title,url,state,mergeStateStatus,reviewDecision 2>/dev/null || echo "NO_PR"`
- Uncommitted changes: `git status --short 2>/dev/null`
- Recent commits on branch: `git log --oneline -10 2>/dev/null`
- Has unit tests: `find . -maxdepth 4 \( -name "*.test.*" -o -name "*.spec.*" -o -name "__tests__" -o -path "*/test/*" -o -path "*/tests/*" \) -not -path "./node_modules/*" -not -path "./.git/*" 2>/dev/null | head -5`
- Merge status vs main: `git log main..HEAD --oneline 2>/dev/null | wc -l | tr -d ' '`
- Plan files: `ls docs/*.md docs/**/*.md TODO.md TODOS.md docs/roadmap.md docs/todos/backlog.md 2>/dev/null | head -5`

## Instructions

This skill runs the full development pipeline — from whatever state the branch is in, all the way to a reviewed, tested PR that is ready to merge. It does **not** merge or close the PR. That is the caller's responsibility.

Use subagents liberally throughout — offload research, parallel analysis, and independent tasks to subagents to keep the main context clean and move fast. Auto-compact context whenever it gets long.

---

### Step 1: Detect current stage

Read the Context section above and determine which stage applies:

**Stage A — Starting from scratch (no PR, no meaningful commits on branch)**
The user provided a feature request, bug description, or idea. There's no PR and no implementation yet (or only a fresh branch with no real commits ahead of main).

**Stage B — Mid-implementation (commits exist, PR may or may not exist)**
There are commits on the branch with real code changes. A PR may or may not exist. Code hasn't been fully reviewed yet.

**Stage C — Review-ready (PR exists, code is implemented, needs review/merge)**
A PR exists and the implementation looks complete. Just needs review polish and merge.

**Stage D — Ready to merge (PR exists, reviews look clean, checks passing)**
The PR is in a mergeable state — reviews are done, checks are passing. Just needs to be closed out.

Announce which stage you detected and proceed to the corresponding step.

---

### Step 2A: From scratch — research, plan, and build

Only if Stage A was detected.

**Research the codebase first.** Use subagents to understand:
- The project structure, tech stack, and patterns in use
- The database schema if relevant (look for migrations, schema files, Prisma/Drizzle schemas, Supabase types)
- Related existing code that the feature will interact with

**Create a plan.** Write a concise implementation plan with checkable items. Choose the plan file location:
- If the project already has `docs/roadmap.md`, `TODO.md`, `TODOS.md`, or `docs/todos/backlog.md`, append the plan there under a new section.
- Otherwise, create `docs/<YYYY-MM-DD>-<slug>-plan.md`.

The plan should:
- Break the work into discrete steps
- Note any files that need to be created or modified
- Call out edge cases and error handling

**Review the plan with plan-critic.** Before building, run an automated plan review:

Use the `hypt-plan-critic` skill.

Pass the plan file path AND the original user request. State clearly that this is pipeline mode:

> Review this plan in pipeline mode (fully autonomous, no user interaction).
> Plan file: `<path to the plan file you chose above>`
> Original request: [restate the user's original request/description here]

Plan-critic will review the plan, make its own calls on non-blocker issues, update the plan file directly, and return control. Do NOT wait for user confirmation — plan-critic in pipeline mode is fully autonomous.

**IMPORTANT: After plan-critic returns, IMMEDIATELY continue to the build step below. Do NOT stop or wait — the pipeline must keep moving.**

After plan-critic completes, re-read the plan (it may have been updated) and proceed. If plan-critic noted Open Questions in the plan file, these do not stop the pipeline — continue to build.

**Build it.** Use the `hypt-prototype` skill.

When prototype asks for a plan, point it to the plan file you chose above or provide the plan directly. When prototype asks for user input at any step, make the autonomous choice — fix all review findings, skip nothing.

After prototype completes, continue to Step 3.

---

### Step 2B: Mid-implementation — get to review-ready

Only if Stage B was detected.

Finish the in-progress implementation, verify it with the repository's relevant checks, then commit and push it using the repository's normal conventions. Ensure a PR exists before continuing.

Continue to Step 3.

---

### Step 2C/2D: Already review-ready or mergeable

If Stage C, continue to Step 3.
If Stage D, skip directly to Step 6.

---

### Step 3: Review-and-fix loop

Review the full branch diff and fix it in a loop until the code is clean. Maximum 3 iterations to avoid infinite loops.

**Iteration pattern:**

1. Inspect the complete diff for requirement gaps, correctness bugs, security issues, error handling, and regressions.
2. Read unresolved PR comments and failing checks; distinguish material issues from optional preferences.
3. Fix every material issue, run the relevant checks, and update the branch.
4. If material findings remain, run another iteration. Exit when the diff and checks are clean.

If after 3 iterations there are still issues, report what's remaining and continue anyway — don't get stuck in an infinite loop.

---

### Step 4: Tests

Check the Context section — the "Has unit tests" field shows whether the project already has test files.

If test infrastructure exists, add or update focused tests for changed behavior, prioritizing business-critical paths and regressions found during review. Run the smallest relevant suite first, then the repository's required checks.

If no test infrastructure exists, verify through the project's existing build, type, lint, or manual workflow rather than creating a test framework solely for this change.

---

### Step 5: Documentation updates

Update documentation affected by the implementation: check off completed tracked work, update README or feature docs when behavior changed, and repair stale links. Skip this step when no documentation is affected.

---

### Step 6: Final save

Ensure all intended changes are committed and pushed using the repository's normal conventions. Create or update the PR so its title, summary, and verification notes reflect the complete branch.

Confirm the pipeline is complete:

> Pipeline complete. PR is reviewed, tested, and ready.

---

## Handling blockers

Throughout this flow, only stop and ask the user if you encounter:

- **Security vulnerabilities** — auth bypass, exposed secrets, SQL injection, XSS, etc. that genuinely put users at risk
- **Destructive data operations** — migrations that drop data, irreversible state changes
- **Ambiguous requirements** — the feature request is genuinely unclear and you'd be guessing wrong
- **Persistent build/test failures** — after 2 attempts to fix, the same failure keeps recurring

For everything else — lint warnings, minor style choices, which approach to take — make the call yourself and keep going.
