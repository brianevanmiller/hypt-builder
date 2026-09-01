# Beginner's guide: install hypt with an AI coding agent

You do not need to know terminal commands to install hypt. A coding agent can inspect your computer, explain what is missing, and do the routine setup after you approve one installation plan.

## Before you begin

Use an AI workspace that can access a local folder and run terminal commands:

- **Claude Desktop:** open **Claude Code** or **Cowork**. Availability depends on your Claude plan.
- **ChatGPT Desktop:** switch to **Codex**, the software-development workspace.
- **Another coding agent:** Cursor, Codex CLI, Claude Code, and similar agents also work.

An ordinary browser or mobile chat may be able to read this guide, but it cannot install software on your computer. If the agent cannot run a harmless command such as `git --version`, ask it to help you switch to a desktop coding workspace before continuing.

## Copy this into your coding agent

Paste the entire message below into Claude Code, Claude Cowork, ChatGPT Codex, or another local coding agent:

> Install hypt from <https://github.com/brianevanmiller/hypt-builder>.
>
> First read `BEGINNERS_GUIDE.md` from that repository. Before changing my computer, identify my operating system and run read-only checks for Git, a supported Node.js LTS release with npm/npx, GitHub CLI, and Bun. Also check whether the package manager you intend to use is available. Do not install provider-specific CLIs by hand; hypt sets up Vercel through Vercel's official agent playbook, and can run the Supabase CLI on demand.
>
> Show me one combined table of everything missing or outdated, why hypt uses each tool, the official source or system package manager you will use, whether administrator access or a restart may be needed, and the exact changes you can make. Explain in plain language that these are mainstream developer tools commonly used by coding agents, while making clear that I should still review the commands and approve them.
>
> Ask for one confirmation for that complete tool-installation plan. After I approve, install the approved tools, verify their versions, and install every hypt skill for this coding agent with the `skills` CLI. Do not install hypt into agent products I am not using.
>
> Then start `hypt-start`. It should offer to create a short Identity section in my project instructions and show me the required companion-skill plan. After I approve that plan, install only the missing Matt Pocock and pstack companions globally. Have it also ask, once, whether to install Beadcrumbs and, if I do not already use Linear or another hosted tracker, Beads. Declining either is fine. If I want both, install Beads first, then Beadcrumbs and its skill. Have `hypt-start` ask one batched intake question covering whether this is a website, web app, or desktop project; the main project brief; website copy and Google Drive assets when relevant; design inspiration, tabs, audience, and vibe; web-app signup, scale, and B2B/enterprise needs; desktop targets and companion web surface; GitHub/Vercel/Supabase status; domain purchase and connection; and whether startup idea vetting is needed. Every project must establish GitHub and Vercel — Vercel through its official onboarding: "Set up Vercel for me. Fetch https://vercel.com/get-started.md and follow it." — and set up Supabase only when the selected app needs it. If startup vetting is requested, use gstack's `office-hours` skill when available or approval-gate its official installation. Use official browser-based login or OAuth flows. Never ask me to paste passwords, API keys, or access tokens into chat. Finish by listing what succeeded and anything I must finish myself.
>
> If you cannot run terminal commands or edit local files, stop and tell me exactly how to open a coding workspace that can. Do not claim installation succeeded without verifying it.

The agent should pause once, show the complete tool plan, and wait for your approval. Your computer may separately show an administrator-password prompt; type that password only into your operating system's own prompt, never into chat.

After approval, the agent will choose its own installer target and run the equivalent of:

```bash
npx skills add brianevanmiller/hypt-builder \
  --skill '*' \
  --agent <current-coding-agent> \
  --global \
  --yes
```

This installs every hypt workflow for the coding agent you are using, without creating configuration for unrelated agents.

## What the agent is checking

| Tool | Why hypt uses it |
|---|---|
| Git | Tracks project changes safely |
| Node.js LTS, npm, and npx | Runs the standard `skills` installer |
| GitHub CLI (`gh`) | Creates repositories, pull requests, and releases |
| Bun | Runs app tooling and project dependencies used by the default workflow |
| Vercel CLI | Installed and authenticated through Vercel's official agent playbook (https://vercel.com/get-started.md) for every project, so Vercel projects, GitHub connections, domains, and deployments can be verified
| Supabase CLI | Install and authenticate only when the selected project uses Supabase for auth, data, or backend work


These are normal developer tools, not hidden background services. The agent should install them from your operating system's package manager or the vendor's official distribution, show you what it plans to run, and verify each installation afterward.

## Sign in after installation

Tool installation and account connection are separate:

1. **GitHub:** let the agent start `gh auth login --web`, then approve the sign-in in your browser. Vercel's GitHub connection needs access to the selected repository; an organization owner may need to approve the GitHub App.
2. **Vercel:** let the agent run Vercel's official onboarding — "Set up Vercel for me. Fetch https://vercel.com/get-started.md and follow it." — which installs the CLI, starts the official `vercel login` browser flow, and verifies `vercel whoami`. It can then create/link the Vercel project, connect the GitHub repository, and attach the selected domain.
3. **Supabase:** if your project needs a database or authentication, let the agent install the selected Supabase CLI, start the official `supabase login` flow, and verify access before creating/linking the project.

Browser login is preferable to copying credentials. Keep passwords, API keys, recovery codes, and access tokens out of chat.

## Connect apps to Claude or ChatGPT

Web-app connections let the AI work with services you already use. They are optional and separate from the local CLI logins above.

### Claude

Open **Customize → Connectors** in Claude and connect only the services your project needs. Gmail, Google Calendar, Google Drive, GitHub, and other services may be available. Review each connector's read/write permissions before approving OAuth.

### ChatGPT

Open ChatGPT's **Plugin or Apps directory** from Settings and connect only the services you need. Availability depends on your plan and workspace settings. Review requested permissions and keep approval enabled for important write actions.

If Gmail, Vercel, or another service does not appear in your app's directory, use its official CLI or website instead of giving the AI a password or token. Team and company accounts may require an administrator to enable a connection.

## Start building

Restart the coding agent if newly installed skills do not appear, then say:

> Use `hypt-start` to help me plan and build a new project.

`hypt-start` will offer project-level agent defaults, install Hypt's required companion skills after approval, optionally offer Beadcrumbs and Beads, collect a single batched project intake, and guide you through the accounts and services that the selected website, web app, or desktop project needs. It records links to source documents and assets rather than pretending inaccessible files were read, and it can invoke gstack's `office-hours` for requested startup direction or vetting.

## Related documentation

- [README](README.md) — installation and skill catalog
- [Cheatsheet](CHEATSHEET.md) — quick workflow reference
- [Agent source layout](agents/README.md) — contributor packaging rules
- [Claude Desktop installation](https://support.anthropic.com/en/articles/10065433-installing-claude-for-desktop) — supported desktop workspaces
- [Claude connectors](https://support.anthropic.com/en/articles/11176164-pre-built-web-connectors-using-remote-mcp) — official OAuth connection flow
- [ChatGPT desktop and Codex](https://help.openai.com/en/articles/20001276) — local software-development workspace
- [Apps in ChatGPT](https://help.openai.com/en/articles/11487775-connectors-in-chatgpt) — connection permissions and availability
