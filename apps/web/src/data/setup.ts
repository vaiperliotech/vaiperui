/** The snippets of the installation guide, shared by the docs page, the MCP server and the agent skill. */
export const SETUP = {
    install: "npm install vaiperui",
    css: `@import "tailwindcss";
@import "vaiperui/theme.css";

@source "../node_modules/vaiperui/dist";`,
    darkHtml: `<html lang="en" className="dark">`,
    darkVariables: `.dark {
  --vpd-surface: #0b0f19;
  --vpd-surface-muted: #131a2a;
  --vpd-text: #e2e8f0;
  --vpd-border: #1f2937;
}`,
} as const;
