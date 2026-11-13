// A tiny MCP client for trying the built server by hand:
//   node scripts/ask.mjs tools
//   node scripts/ask.mjs get_component '{"name":"Select"}'
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const cli = resolve(dirname(fileURLToPath(import.meta.url)), "../dist/cli.js");
const [tool, json] = process.argv.slice(2);
if (!tool) {
    console.error('usage: node scripts/ask.mjs <tools|tool_name> [\'{"arg":"value"}\']');
    process.exit(2);
}

const client = new Client({ name: "ask", version: "1.0.0" });
await client.connect(new StdioClientTransport({ command: "node", args: [cli], stderr: "pipe" }));
try {
    if (tool === "tools") {
        console.log(`Server instructions: ${client.getInstructions()}\n`);
        for (const t of (await client.listTools()).tools) {
            console.log(
                `## ${t.name}\n${t.description}\ninput: ${JSON.stringify(t.inputSchema.properties)} required: ${JSON.stringify(t.inputSchema.required ?? [])}\n`,
            );
        }
    } else {
        const result = await client.callTool({
            name: tool,
            arguments: json ? JSON.parse(json) : {},
        });
        for (const part of result.content) if (part.type === "text") console.log(part.text);
        if (result.isError) process.exitCode = 1;
    }
} finally {
    await client.close();
}
