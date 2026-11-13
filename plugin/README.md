# vaiperui plugin for Claude Code

Teaches Claude how to use [vaiperui](https://vaiperui.vercel.app): the **skill** (setup, shared props, how each component's value works, a component picker, a reference per component and tested recipes) and the **MCP server** (`vaiperui-mcp`: search the docs and read any component's props, examples and accessibility notes).

```
/plugin marketplace add vaiperliotech/vaiperui
/plugin install vaiperui@vaiperui
```

or from the shell: `claude plugin marketplace add vaiperliotech/vaiperui` then `claude plugin install vaiperui@vaiperui`.

The skill loads by itself when you work with `vaiperui`; you can also call it with `/vaiperui:vaiperui`. The MCP server is the remote one at <https://vaiperui.vercel.app/mcp> (read-only, no account, nothing runs on your machine); it connects when the plugin is enabled.

`skills/vaiperui` is generated from the docs data: do not edit it by hand (`pnpm --filter vaiperui-mcp skill`).
