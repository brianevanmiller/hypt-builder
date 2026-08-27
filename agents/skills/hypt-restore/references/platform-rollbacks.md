# Provider rollback branches

Use immutable deployment or release IDs. Confirm the selected item belongs to the expected repository and revision before promotion.

## Vercel

List recent production deployments through the Vercel CLI or GitHub Deployments, match the target commit, and promote/redeploy that immutable deployment to production. Verify the resulting production deployment SHA and URL.

## Netlify

List production deploys, match the target commit, and restore/publish that deploy through the Netlify CLI or dashboard. Record the deploy ID.

## Fly.io

List releases, match the target image or release version, and deploy that known image. Avoid rebuilding source when the goal is exact rollback.

## Render and Railway

Use the provider's rollback/redeploy action for the deployment matching the target commit. When CLI support cannot prove the mapping, guide the user through the authenticated dashboard and have them confirm the deployment ID before the action.

## Generic GitHub Deployments

Read deployments for the target SHA and their latest statuses. When the provider exposes no promotion mechanism, use a reviewed Git revert rather than inventing an API call.

## Vercel access block

If promotion is blocked only because the commit author lacks a Vercel team seat, invoke `hypt-deploy` remediation for the target revision. Carry its resulting URL and health proof into the restore report.
