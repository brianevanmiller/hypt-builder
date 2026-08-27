---
name: hypt-post-mortem
description: "Diagnoses a production incident from preserved evidence and records cause, impact, recovery, and follow-up. Use after a failed deployment, restore, or production incident."
metadata:
  short-description: "Diagnose and Document an Incident"
---

# hypt-post-mortem — Diagnose and Document an Incident

Be blameless and evidence-led. A restore explains what recovered service, not what caused the incident.

## Inputs

Collect:

- Incident and restore timestamps
- Bad and known-good revisions/deployments
- Revert or provider operation
- User-visible symptoms and affected paths
- Logs, checks, alerts, and real-path proof
- Diff and migrations between known-good and bad

Ask for missing incident facts; never invent impact or duration.

## 1. Reproduce the causal chain

Invoke `diagnosing-bugs` with the symptom, timeline, bad diff, logs, and restored state. If it is unavailable, report the incomplete Hypt companion installation and run the same evidence loop directly.

Establish:

1. Trigger: the change or event that introduced the condition
2. Mechanism: how that condition produced the failure
3. Reachability: why production users or data encountered it
4. Detection: what surfaced it and what failed to surface it earlier
5. Recovery: why the restore or fix returned the system to health

Test the chain against code, logs, and runtime evidence. Distinguish **confirmed**, **strongly supported**, and **unknown**. “The latest PR changed this file” is correlation, not cause.

Completion: each link has evidence or is explicitly unknown.

## 2. Identify the root fix

Fix the rule that allowed the incident, not only the observed example. Name:

- The smallest product/code correction
- The cheapest durable detection or prevention
- Any recovery or observability gap

Keep testing proportional: pin the incident's crux and distinct failure path; avoid a broad speculative regression suite.

## 3. Write the record

Use the repository's incident-doc convention; otherwise write `docs/post-mortem/<YYYY-MM-DD>-<topic>-post-mortem.md`:

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

Link existing issues instead of duplicating them. Add only concrete, non-duplicate follow-up to the existing backlog or tracker.

Completion: a reader can trace every causal claim to evidence and every action to the failure mode it prevents.

## 4. Save and hand off

Commit and push the incident record using repository conventions when the current branch is intended for documentation changes. Otherwise report the file for the caller to include.

Return:

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
