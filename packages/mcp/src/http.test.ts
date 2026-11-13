import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { describe, expect, it } from "vitest";

import { handleMcpRequest } from "./http";

const URL_ = "https://vaiperui.test/mcp";
const post = (body: unknown, headers: Record<string, string> = {}) =>
    handleMcpRequest(
        new Request(URL_, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                accept: "application/json, text/event-stream",
                ...headers,
            },
            body: typeof body === "string" ? body : JSON.stringify(body),
        }),
    );

describe("remote MCP endpoint (Streamable HTTP)", () => {
    it("works with the official MCP client over HTTP: initialize, list tools, call tools", async () => {
        // The client's own fetch is wired to the handler, so this goes through the real protocol and framing.
        const transport = new StreamableHTTPClientTransport(new URL(URL_), {
            fetch: (input, init) => handleMcpRequest(new Request(input, init)),
        });
        const client = new Client({ name: "http-test", version: "1.0.0" });
        await client.connect(transport);
        try {
            expect(client.getServerVersion()?.name).toBe("vaiperui");
            expect(client.getServerVersion()?.version).toMatch(/^\d+\.\d+\.\d+/);
            expect(client.getInstructions()).toContain("get_component");
            const { tools } = await client.listTools();
            expect(tools.map((t) => t.name).sort()).toEqual([
                "get_component",
                "get_setup",
                "list_components",
                "search_docs",
            ]);
            const result = await client.callTool({
                name: "get_component",
                arguments: { name: "Slider", sections: ["props"] },
            });
            expect(JSON.stringify(result.content)).toContain("onValueCommit");
            const hits = await client.callTool({
                name: "search_docs",
                arguments: { query: "dropdown" },
            });
            expect(JSON.stringify(hits.content)).toContain("Select");
            const { resources } = await client.listResources();
            expect(resources).toHaveLength(44);
        } finally {
            await client.close();
        }
    });

    it("answers plain JSON, is stateless (no session) and needs no initialize first", async () => {
        const response = await post({ jsonrpc: "2.0", id: 1, method: "tools/list" });
        expect(response.status).toBe(200);
        expect(response.headers.get("content-type")).toContain("application/json");
        expect(response.headers.get("mcp-session-id")).toBeNull();
        expect(response.headers.get("cache-control")).toBe("no-store");
        const json = (await response.json()) as { id: number; result: { tools: unknown[] } };
        expect(json.id).toBe(1);
        expect(json.result.tools).toHaveLength(4);

        const call = await post({
            jsonrpc: "2.0",
            id: 2,
            method: "tools/call",
            params: { name: "list_components", arguments: { group: "feedback" } },
        });
        expect(JSON.stringify(await call.json())).toContain("Toast");
    });

    it("handles many requests at once without mixing them up", async () => {
        const names = ["Button", "Select", "Modal", "Slider", "Toast", "Table"];
        const responses = await Promise.all(
            names.map((name, i) =>
                post({
                    jsonrpc: "2.0",
                    id: i,
                    method: "tools/call",
                    params: { name: "get_component", arguments: { name, sections: ["props"] } },
                }),
            ),
        );
        for (const [i, response] of responses.entries()) {
            const json = (await response.json()) as {
                id: number;
                result: { content: Array<{ text: string }> };
            };
            expect(json.id).toBe(i);
            expect(json.result.content[0]?.text.startsWith(`# ${names[i]}`)).toBe(true);
        }
    });

    it("sends open CORS headers (the docs are public and read-only) and answers the preflight", async () => {
        const preflight = await handleMcpRequest(new Request(URL_, { method: "OPTIONS" }));
        expect(preflight.status).toBe(204);
        expect(preflight.headers.get("access-control-allow-origin")).toBe("*");
        expect(preflight.headers.get("access-control-allow-headers")).toMatch(/mcp-session-id/);
        const response = await post({ jsonrpc: "2.0", id: 1, method: "tools/list" });
        expect(response.headers.get("access-control-allow-origin")).toBe("*");
        expect(response.headers.get("access-control-expose-headers")).toMatch(/mcp-session-id/);
    });

    it("shows a page to a browser and 405 to an MCP client on GET", async () => {
        const page = await handleMcpRequest(
            new Request(URL_, { headers: { accept: "text/html,application/xhtml+xml" } }),
        );
        expect(page.status).toBe(200);
        expect(page.headers.get("content-type")).toContain("text/html");
        const html = await page.text();
        expect(html).toContain(
            "claude mcp add --transport http vaiperui https://vaiperui.test/mcp",
        );

        const stream = await handleMcpRequest(
            new Request(URL_, { headers: { accept: "text/event-stream" } }),
        );
        expect(stream.status).toBe(405);
        expect(stream.headers.get("allow")).toBe("POST, OPTIONS");
        expect(((await stream.json()) as { error: { code: number } }).error.code).toBe(-32000);
    });

    it("rejects other methods", async () => {
        for (const method of ["DELETE", "PUT", "PATCH"]) {
            const response = await handleMcpRequest(new Request(URL_, { method }));
            expect(response.status, method).toBe(405);
        }
    });

    it("rejects a body that is not JSON, or too large, with a JSON-RPC error", async () => {
        const bad = await post("{not json");
        expect(bad.status).toBe(400);
        expect(((await bad.json()) as { error: { code: number } }).error.code).toBe(-32700);

        const big = await post(
            JSON.stringify({
                jsonrpc: "2.0",
                id: 1,
                method: "tools/list",
                params: { pad: "x".repeat(70_000) },
            }),
        );
        expect(big.status).toBe(413);
        const declared = await post("{}", { "content-length": "999999" });
        expect(declared.status).toBe(413);
    });

    it("reports a tool error as a result, not as a crash", async () => {
        const response = await post({
            jsonrpc: "2.0",
            id: 1,
            method: "tools/call",
            params: { name: "get_component", arguments: { name: "Dropdown" } },
        });
        expect(response.status).toBe(200);
        const json = (await response.json()) as {
            result: { isError: boolean; content: Array<{ text: string }> };
        };
        expect(json.result.isError).toBe(true);
        expect(json.result.content[0]?.text).toContain("Select");
    });
});
