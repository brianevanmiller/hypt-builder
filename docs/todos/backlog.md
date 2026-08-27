# Backlog

Open follow-up work for hypt.

## Security

- [ ] Plumb `is_allowlisted` through remaining scanner checks for hook registrations, MCP tool references, and legacy `allowed-tools` frontmatter.
- [ ] Add multi-line prompt injection detection.
- [ ] Add scanner coverage for fenced shell snippets in agent instruction files.
- [ ] Add an OAuth `state` scaffold to the `hypt-start` integrations flow.

## Reliability

- [ ] Add a `--dry-run` flag to the bundled Vercel bypass helper.
- [ ] Add package-manager detection to workflows that currently assume Bun.
- [ ] Add deployment-log collection to `hypt-deploy`.
- [ ] Add database-provider detection to `hypt-restore`.

## Product

- [ ] Add provider OAuth signup walkthroughs to `hypt-start`.
- [ ] Fold an optional production-hardening pass into `hypt-build`.
- [ ] Add an owner-only allowlist administration scaffold when `ALLOWLIST_MODE=team`.
- [ ] Add a post-mortem history view.
- [ ] Link fixes back to unresolved post-mortem action items.

## Testing

- [ ] Add scanner self-test coverage for `settings.json` allowlist suppression.
- [ ] Add `hypt-restore` integration coverage for merge and squash-commit recovery.
- [ ] Add `hypt-plan-critic` complexity-classification fixtures.
- [ ] Add automated tests for the Vercel bypass detection heuristic.
- [ ] Add scanner integration coverage for `--markdown-report` and CI exit codes.
- [ ] Add `hypt-post-mortem` integration coverage.
- [ ] Add `hypt-start` integration coverage for allowlist, integrations, and production-hardening output.

## Developer experience

- [ ] Add a `--watch` mode to the security scanner.
- [ ] Log which Vercel bypass detection path triggered: exact SHA or heuristic fallback.
