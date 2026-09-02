# Provider rollback branches

Use immutable deployment or release IDs, and confirm the selected item belongs to the expected repository and revision before promotion.

| Provider | Rollback |
|---|---|
| Vercel | List recent production deployments through the Vercel CLI or GitHub Deployments, match the target commit, promote/redeploy that immutable deployment to production, and verify the resulting production SHA and URL. |
| Netlify | List production deploys, match the target commit, restore/publish that deploy through the CLI or dashboard, and record the deploy ID. |
| Fly.io | List releases, match the target image or release version, and deploy that known image rather than rebuilding source. |
| Render, Railway | Use the provider's rollback/redeploy action for the deployment matching the target commit. When the CLI cannot prove the mapping, guide the user through the authenticated dashboard and have them confirm the deployment ID first. |
| Generic GitHub Deployments | Read deployments for the target SHA and their latest statuses. With no promotion mechanism, use a reviewed Git revert rather than inventing an API call. |

**Vercel access block:** if promotion is blocked only because the commit author lacks a Vercel team seat, invoke `hypt-deploy` remediation for the target revision and carry its resulting URL and health proof into the restore report.
