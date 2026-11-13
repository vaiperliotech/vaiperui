import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

import { loadCatalog } from "./catalog";
import { createServer } from "./server";

/** A request body is a JSON-RPC message of a few hundred bytes; anything big is not a client of this server. */
const MAX_BODY_BYTES = 64 * 1024;

const CORS: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers":
        "content-type, accept, mcp-protocol-version, mcp-session-id, authorization",
    "Access-Control-Expose-Headers": "mcp-session-id, mcp-protocol-version",
    "Access-Control-Max-Age": "86400",
};

function withCors(response: Response, extra: Record<string, string> = {}): Response {
    const headers = new Headers(response.headers);
    for (const [name, value] of Object.entries({ ...CORS, ...extra })) headers.set(name, value);
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
}

function jsonRpcError(
    status: number,
    code: number,
    message: string,
    extra: Record<string, string> = {},
): Response {
    return withCors(
        Response.json({ jsonrpc: "2.0", error: { code, message }, id: null }, { status }),
        extra,
    );
}

const INFO = (url: string) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>vaiperui MCP server</title>
<style>body{font:16px/1.6 system-ui,sans-serif;max-width:42rem;margin:3rem auto;padding:0 1rem}code,pre{background:#f3f4f6;border-radius:6px;padding:.15em .4em}pre{padding:1em;overflow:auto}</style></head>
<body>
<h1>vaiperui MCP server</h1>
<p>This URL is an <a href="https://modelcontextprotocol.io">MCP</a> server (Streamable HTTP) for <b>vaiperui</b>, the React component library for Tailwind CSS v4. It lets an AI agent search the docs and read the props, examples and accessibility notes of every component. It is read-only and needs no account.</p>
<p>Claude Code:</p>
<pre>claude mcp add --transport http vaiperui ${url}</pre>
<p>Any other client that takes a remote server URL: <code>${url}</code>. Tools: <code>list_components</code>, <code>search_docs</code>, <code>get_component</code>, <code>get_setup</code>.</p>
</body></html>`;

/**
 * The MCP server as a web-standard request handler (Next.js route handlers, Cloudflare, Deno, Bun...).
 *
 * Stateless: every POST gets its own server and transport and answers with plain JSON, so it runs
 * on serverless platforms (no sessions, no streams to keep open). The data is read-only and public,
 * hence the open CORS policy.
 */
export async function handleMcpRequest(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

    if (request.method === "GET") {
        // A browser opening the URL gets a page; an MCP client asking for a notification stream gets 405 (we have none).
        if ((request.headers.get("accept") ?? "").includes("text/html")) {
            const url = new URL(request.url);
            return withCors(
                new Response(INFO(`${url.origin}${url.pathname}`), {
                    headers: { "content-type": "text/html; charset=utf-8" },
                }),
                {
                    "Cache-Control": "public, max-age=300",
                },
            );
        }
        return jsonRpcError(405, -32000, "Method not allowed: this server only answers POST.", {
            Allow: "POST, OPTIONS",
        });
    }
    if (request.method !== "POST") {
        return jsonRpcError(405, -32000, "Method not allowed.", { Allow: "POST, OPTIONS" });
    }

    const length = Number(request.headers.get("content-length") ?? 0);
    if (length > MAX_BODY_BYTES) return jsonRpcError(413, -32600, "Request too large.");

    const [catalog, body] = await Promise.all([loadCatalog("en"), request.text().catch(() => "")]);
    if (body.length > MAX_BODY_BYTES) return jsonRpcError(413, -32600, "Request too large.");
    let parsed: unknown;
    try {
        parsed = JSON.parse(body);
    } catch {
        return jsonRpcError(400, -32700, "Parse error: the body is not JSON.");
    }

    const server = createServer({ version: catalog.version });
    const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
    });
    try {
        await server.connect(transport);
        const response = await transport.handleRequest(request, { parsedBody: parsed });
        return withCors(response, { "Cache-Control": "no-store" });
    } catch (error) {
        console.error("vaiperui-mcp:", error);
        return jsonRpcError(500, -32603, "Internal server error.");
    } finally {
        await server.close().catch(() => {});
    }
}
