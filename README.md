# Silicon CLI

> **🚧 Under active development — not yet complete.** This is a work in progress:
> commands, flags, and sign-in flow may change, and some features aren't wired up
> yet. Not production-ready.

Shop the web from your terminal — and from any AI agent. **Sign in once, no API
keys to manage.** The CLI is the workhorse behind the [Silicon Skills](https://github.com/silicon-store/silicon-skills)
and the foundation the agent-native surfaces share.

## Install

```bash
npm install -g siliconstore-cli
```

## Sign in

```bash
silicon auth login
```

Opens a browser, ~5 seconds — you authenticate with your Silicon account and a
token is stored locally (`~/.silicon/config.json`). No keys to copy or paste.

## Use

```bash
silicon product https://www.example-retailer.com/product/123   # full product details
silicon search "Sony WH-1000XM5" --region UK                   # find across stores
silicon compare "Sony WH-1000XM5"                              # price comparison
silicon retailers --region UK                                  # supported stores
silicon whoami                                                 # who am I
silicon auth logout
```

Everything returns JSON, so it pipes cleanly:

```bash
silicon compare "AirPods Pro" | jq '.price_range'
```

## For agents

Agents (Claude Code, Cursor, Codex, …) drive the CLI through
[Silicon Skills](https://github.com/silicon-store/silicon-skills) — one command pulls
shopping skills into your agent, and they submit work through this CLI's sign-in.
Prefer a connector? Use the [Silicon MCP](https://github.com/silicon-store/silicon-mcp).

## Environment

| Var | Default | Purpose |
|-----|---------|---------|
| `SILICON_PLATFORM_URL` | `https://platform.siliconstore.com` | hosted sign-in |
| `SILICON_API_BASE` | `https://productapi.siliconstore.com` | API base |

## License

MIT
