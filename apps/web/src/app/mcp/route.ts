import { handleMcpRequest } from "vaiperui-mcp";

// The vaiperui MCP server, at https://<site>/mcp (Streamable HTTP, stateless, read-only).
// The logic and its tests live in packages/mcp; the docs it serves are the ones of this site.
export const GET = handleMcpRequest;
export const POST = handleMcpRequest;
export const DELETE = handleMcpRequest;
export const OPTIONS = handleMcpRequest;
