---
name: hypt-post-mortem
description: "Diagnoses a production incident from preserved evidence and records cause, impact, recovery, and follow-up. Use after a failed deployment, restore, or production incident."
metadata:
  short-description: "Diagnose and Document an Incident"
---

# hypt-post-mortem — Diagnose and Document an Incident

Blameless and evidence-led. A restore explains what recovered service, not what caused the incident.

## Inputs

Incident and restore timestamps; bad and known-good revisions/deployments; the revert or provider operation; user-visible symptoms and affected paths; logs, checks, alerts, and real-path proof; the diff and migrations between known-good and bad. Ask for missing incident facts rather than inventing impact or duration.

## 1. Reproduce the causal chain

Invoke `diagnosing-bugs` with the symptom, timeline, bad diff, logs, and restored state; if it is unavailable, report the incomplete Hypt companion installation and run the same evidence loop directly. Establish the **trigger** (the change or event that introduced the condition), **mechanism** (how it produced the failure), **reachability** (why production users or data encountered it), **detection** (what surfaced it and what failed to surface it earlier), and **recovery** (why the restore or fix returned health). Test each link against code, logs, and runtime evidence and label it **confirmed**, **strongly supported**, or **unknown**; "the latest PR changed this file" is correlation, not cause.

Completion: each link has evidence or is explicitly unknown.

## 2. Identify the root fix

Fix the rule that allowed the incident, not only the observed example: name the smallest product/code correction, the cheapest durable detection or prevention, and any recovery or observability gap. Pin the incident's crux and distinct failure path in tests, not a broad speculative regression suite.

## 3. Write the record

Use the repository's incident-doc convention, otherwise `docs/post-mortem/<YYYY-MM-DD>-<topic>-post-mortem.md`:

```markdown
# Post-mortem: <incident>

## Summary
<User-visible failure, duration, and recovery.>

## Impact
- Users/data affected:
- Duration:
- Severity:

## Timeline
| Time | Event | Evidence |
|---|---|---|

## Causal chain
- Trigger:
- Mechanism:
- Reachability:
- Detection:
- Recovery:
- Confidence:

## Corrective actions
- [ ] <Root fix — owner or tracking link>
- [ ] <Durable detection/prevention>
- [ ] <Recovery/observability improvement>

## Verification
<How the fix will go red on the incident and how production health is proven.>
```

Link existing issues rather than duplicating them; add only concrete, non-duplicate follow-up to the existing backlog or tracker (Beads when initialized), and capture the causal conclusion in Beadcrumbs when it is initialized.

Completion: a reader can trace every causal claim to evidence and every action to the failure mode it prevents.

## 4. Save and hand off

Commit and push the record with repository conventions when the current branch is meant for documentation changes; otherwise report the file for the caller to include. Return:

```text
Post-mortem
- Incident: <summary>
- Cause: <confirmed, supported, or unknown>
- Recovery: <operation>
- Document: <path>
- Root fix: <task>
- Prevention: <task>
```

Recommend `hypt-build` for a reviewed fix, or `ship it: fix the most recent post-mortem issue` for the pre-approved build-and-close route.
