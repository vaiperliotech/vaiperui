import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createServer } from "./server";

let client: Client;
const text = (result: unknown) =>
    ((result as { content: Array<{ type: string; text: string }> }).content[0] as { text: string })
        .text;

beforeAll(async () => {
    const [clientSide, serverSide] = InMemoryTransport.createLinkedPair();
    client = new Client({ name: "test", version: "1.0.0" });
    await Promise.all([createServer().connect(serverSide), client.connect(clientSide)]);
});
afterAll(async () => {
    await client.close();
});

describe("the MCP server", () => {
    it("introduces itself and explains the workflow", () => {
        expect(client.getServerVersion()?.name).toBe("vaiperui");
        expect(client.getInstructions()).toMatch(/search_docs.*get_component.*get_setup/);
    });

    it("exposes four read-only tools with descriptions and typed inputs", async () => {
        const { tools } = await client.listTools();
        expect(tools.map((t) => t.name).sort()).toEqual([
            "get_component",
            "get_setup",
            "list_components",
            "search_docs",
        ]);
        for (const tool of tools) {
            expect(tool.description?.length, tool.name).toBeGreaterThan(60);
            expect(tool.annotations?.readOnlyHint, tool.name).toBe(true);
            expect(tool.annotations?.destructiveHint, tool.name).toBe(false);
            expect(tool.inputSchema.type).toBe("object");
        }
        const get = tools.find((t) => t.name === "get_component");
        expect(get?.inputSchema.required).toEqual(["name"]);
    });

    it("list_components lists everything, or one group", async () => {
        expect(text(await client.callTool({ name: "list_components", arguments: {} }))).toContain(
            "44 components",
        );
        const feedback = text(
            await client.callTool({ name: "list_components", arguments: { group: "feedback" } }),
        );
        expect(feedback).toContain("Toast");
        expect(feedback).not.toContain("Button");
    });

    it("list_components rejects an unknown group with the valid ones", async () => {
        const result = await client.callTool({
            name: "list_components",
            arguments: { group: "nope" },
        });
        expect(result.isError).toBe(true);
        expect(text(result)).toContain("forms");
    });

    it("get_component returns the reference and takes flexible names", async () => {
        for (const name of ["DatePicker", "date-picker", "date picker"]) {
            const result = await client.callTool({ name: "get_component", arguments: { name } });
            expect(result.isError, name).toBeFalsy();
            expect(text(result)).toContain("# DatePicker");
        }
    });

    it("get_component honors sections and the language", async () => {
        const props = text(
            await client.callTool({
                name: "get_component",
                arguments: { name: "Button", sections: ["props"] },
            }),
        );
        expect(props).toContain("## Props");
        expect(props).not.toContain("## Usage");
        const pt = text(
            await client.callTool({
                name: "get_component",
                arguments: { name: "Button", locale: "pt" },
            }),
        );
        expect(pt).toMatch(/Cor|botão|Botão/);
    });

    it("get_component suggests names on a miss", async () => {
        const result = await client.callTool({
            name: "get_component",
            arguments: { name: "Dropdown" },
        });
        expect(result.isError).toBe(true);
        expect(text(result)).toMatch(/Did you mean: .*Select/);
    });

    it("search_docs finds things and respects the limit", async () => {
        const result = text(
            await client.callTool({
                name: "search_docs",
                arguments: { query: "infinite scroll select", limit: 3 },
            }),
        );
        expect(result).toMatch(/^3 results/);
        expect(result).toContain("Select");
        expect(
            text(await client.callTool({ name: "search_docs", arguments: { query: "zzzzzqqqq" } })),
        ).toContain("No results");
    });

    it("get_setup gives the install, the css and dark mode", async () => {
        const all = text(await client.callTool({ name: "get_setup", arguments: {} }));
        expect(all).toContain("npm install vaiperui");
        expect(all).toContain("theme.css");
        expect(
            text(await client.callTool({ name: "get_setup", arguments: { topic: "dark-mode" } })),
        ).toContain("dark");
    });

    it("validates arguments", async () => {
        await expect(
            client.callTool({ name: "get_component", arguments: {} }),
        ).resolves.toMatchObject({ isError: true });
        await expect(
            client.callTool({ name: "search_docs", arguments: { query: "x", limit: 999 } }),
        ).resolves.toMatchObject({ isError: true });
        await expect(
            client.callTool({
                name: "get_component",
                arguments: { name: "Select", sections: ["nope"] },
            }),
        ).resolves.toMatchObject({ isError: true });
    });

    it("serves every component as a resource, with the full reference", async () => {
        const { resources } = await client.listResources();
        expect(resources).toHaveLength(44);
        const read = await client.readResource({ uri: "vaiperui://component/modal" });
        const content = read.contents[0] as { text: string; mimeType: string };
        expect(content.mimeType).toBe("text/markdown");
        expect(content.text).toContain("# Modal");
        expect(content.text).toContain("## Examples");
        await expect(client.readResource({ uri: "vaiperui://component/nope" })).rejects.toThrow();
    });
});
