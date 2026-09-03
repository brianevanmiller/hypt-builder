---
name: hypt
description: "Routes requests across Hypt's project, build, release, deployment, recovery, and incident workflows. Use when a shipping request spans stages or its owner is unclear."
metadata:
  short-description: "Route the Hypt Lifecycle"
---

# hypt — Route the Lifecycle

Route only work that needs Hypt orchestration; ordinary commits, isolated fixes, tests, docs, and CI changes stay with the agent and repository instructions.

| Intent | Owner |
|---|---|
| Start, onboard, or finish setting up a project | `hypt-start` |
| Stress-test a non-trivial plan | `hypt-plan-critic` |
| Implement an approved, executable plan without the PR lifecycle | `hypt-implement` |
| Build, prototype, or prepare a reviewed PR | `hypt-build` |
| Yolo, ship it, publish it, or take current work through release | `hypt-build` in yolo mode |
| Close or merge a ready PR | `hypt-close` |
| Check, deploy, or diagnose a deployment | `hypt-deploy` |
| Restore a known-good release | `hypt-restore` |
| Diagnose and document a production incident | `hypt-post-mortem` |

Composition:

```text
hypt-start    project + person + companions + optional ledgers + plan
hypt-build    readiness -> plan -> (instruction path | hypt-implement) -> PR -> proof -> review; yolo -> hypt-close
hypt-close    gates -> merge -> hypt-deploy -> release
hypt-restore  restore -> proof -> hypt-post-mortem
```

When a child workflow returns, continue the parent unless the child reports a safety stop. Each step lives in its named skill.
