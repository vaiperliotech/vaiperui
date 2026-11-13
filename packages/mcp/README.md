# vaiperui MCP server and agent skill

An [MCP](https://modelcontextprotocol.io) server and an Agent Skill for [vaiperui](https://vaiperui.vercel.app), the React component library for Tailwind CSS v4. They let an AI coding agent look components up instead of guessing: exact props and defaults, how each value works, accessibility notes and examples, in English, Portuguese or Spanish.

The server is **remote**: it is a route of the website, `https://vaiperui.vercel.app/mcp` (Streamable HTTP, stateless, read-only, no account). Nothing runs on the user's machine.

## Add the server

```bash
# Claude Code
claude mcp add --transport http vaiperui https://vaiperui.vercel.app/mcp
```

Any client that takes a remote MCP server URL (Cursor, VS Code, Windsurf, Zed, the MCP Inspector...) only needs `https://vaiperui.vercel.app/mcp`. Opening the URL in a browser shows these instructions. The Claude Code plugin (below) adds it for you.

Every tool takes a `locale` argument (`en`, `pt`, `es`).

## Tools

All read-only.

| Tool | Use it for |
| --- | --- |
| `list_components` | See what exists: 44 components in 7 groups (`forms`, `dataDisplay`, `feedback`, `navigation`, `overlays`, `layout`, `media`), one line each. Optional `group`. |
| `search_docs` | Find the component for a need: "dropdown", "infinite scroll in a select", "focus trap", "input mask for phone". Searches components, props, examples, accessibility notes and the guides. |
| `get_component` | The full reference of one component. The name is flexible (`DatePicker`, `date-picker`, `date picker`). `sections` picks `overview`, `props`, `accessibility`, `examples` (default: the first three; examples lists the variations with code). |
| `get_setup` | Install, the CSS imports, dark mode and theming (`install`, `css`, `dark-mode`, `theming`, or all). |

Every component is also a resource, `vaiperui://component/<slug>`, for clients that attach docs as context.

Answers are short Markdown (a component is about 800 tokens by default), and a miss suggests the closest names.

## Claude Code plugin (skill + server in one install)

The repository is also a Claude Code marketplace:

```
/plugin marketplace add vaiperliotech/vaiperui
/plugin install vaiperui@vaiperui
```

It installs the skill and connects the remote server. See [`plugin/`](../../plugin/README.md).

## Install the skill

The server answers questions; the skill teaches the conventions up front (the shared props, how each value works, a component picker, rules that avoid bugs) and carries a reference file per component. They work well together.

```bash
node packages/mcp/dist/cli.js install-skill            # into ./.claude/skills/vaiperui
node packages/mcp/dist/cli.js install-skill --global   # into ~/.claude/skills/vaiperui
node packages/mcp/dist/cli.js install-skill --dir .agents/skills --force
```

Users of the library do not need this: the same folder ships inside the `vaiperui` package, at `node_modules/vaiperui/skills/vaiperui` (copy it to `.claude/skills/vaiperui`), and in the Claude Code plugin.

## How it is built

The docs live in the website data (`apps/web/src/data`). Everything is generated from it:

```bash
pnpm --filter @vaiperui/web catalog      # website data -> packages/mcp/catalog/{en,pt,es}.json
pnpm --filter vaiperui-mcp skill         # catalog + skill-src/ -> the skill (packages/vaiperui/skills and plugin/skills)
pnpm --filter vaiperui-mcp test
```

`catalog:check` and `skill:check` fail when the generated files are stale (CI runs them). The tests also check that the docs match the library (every prop declared in a component's types is documented, every example imports real exports), that the recipes of the skill compile, and the HTTP endpoint end to end with the official MCP client.

The catalog is bundled into the site at build time, so **a change to the docs reaches `/mcp` with the next deploy**.

- `src/http.ts` is the request handler: `apps/web/src/app/mcp/route.ts` re-exports it. It runs on any web-standard runtime (Next.js, Cloudflare, Deno, Bun). Every POST gets its own server and answers JSON, so it needs no session storage. Bodies over 64 KB are refused. CORS is open because the data is public and read-only.
- `src/cli.ts` is the same server over stdio, for offline or local use (`pnpm --filter vaiperui-mcp build`, then `node packages/mcp/dist/cli.js`) and the `install-skill` command. The package is not published to npm.
