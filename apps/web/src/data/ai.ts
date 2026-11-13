import { SITE_URL } from "@/lib/site";

/** The commands and files of the "Use with AI" guide. */
export const AI = {
    marketplace: "vaiperliotech/vaiperui",
    mcpUrl: `${SITE_URL}/mcp`,
    plugin: `/plugin marketplace add vaiperliotech/vaiperui
/plugin install vaiperui@vaiperui`,
    claudeCode: `claude mcp add --transport http vaiperui ${SITE_URL}/mcp`,
    cursor: `{
  "mcpServers": {
    "vaiperui": { "url": "${SITE_URL}/mcp" }
  }
}`,
    vscode: `{
  "servers": {
    "vaiperui": { "type": "http", "url": "${SITE_URL}/mcp" }
  }
}`,
    skillProject: `mkdir -p .claude/skills
cp -r node_modules/vaiperui/skills/vaiperui .claude/skills/`,
    skillGlobal: `mkdir -p ~/.claude/skills
cp -r node_modules/vaiperui/skills/vaiperui ~/.claude/skills/`,
} as const;
