import { execFileSync, spawnSync } from "node:child_process";
import {
    cpSync,
    existsSync,
    mkdtempSync,
    readdirSync,
    readFileSync,
    rmSync,
    statSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// End to end on the BUILT package: what `npx vaiperui-mcp` really runs.
const pkg = join(import.meta.dirname, "..");
const cli = join(pkg, "dist/cli.js");
const version = (JSON.parse(readFileSync(join(pkg, "package.json"), "utf8")) as { version: string })
    .version;
const run = (args: string[], cwd?: string) =>
    spawnSync("node", [cli, ...args], { cwd, encoding: "utf8" });

const temp: string[] = [];
const tempDir = () => {
    const dir = mkdtempSync(join(tmpdir(), "vaiperui-mcp-"));
    temp.push(dir);
    return dir;
};

beforeAll(() => {
    execFileSync("pnpm", ["run", "build"], { cwd: pkg, stdio: "pipe" });
});
afterAll(() => {
    for (const dir of temp) rmSync(dir, { recursive: true, force: true });
});

describe("vaiperui-mcp (built)", () => {
    it("is an executable with its data bundled (no files to find at runtime) and small", () => {
        expect(readFileSync(cli, "utf8").startsWith("#!/usr/bin/env node")).toBe(true);
        expect(statSync(cli).mode & 0o111).not.toBe(0);
        const js = readdirSync(join(pkg, "dist")).filter((f) => f.endsWith(".js"));
        const bytes = js.reduce((sum, f) => sum + statSync(join(pkg, "dist", f)).size, 0);
        expect(bytes).toBeLessThan(1_500_000);
        // The three catalogs travel inside the JS: a copy of dist next to node_modules alone must work.
        const copy = join(pkg, ".dist-copy");
        temp.push(copy);
        rmSync(copy, { recursive: true, force: true });
        cpSync(join(pkg, "dist"), copy, { recursive: true });
        expect(
            spawnSync("node", [join(copy, "cli.js"), "--version"], {
                encoding: "utf8",
            }).stdout.trim(),
        ).toBe(version);
    });

    it("prints help and the version", () => {
        expect(run(["--help"]).stdout).toMatch(/install-skill/);
        expect(run(["--version"]).stdout.trim()).toBe(version);
        expect(run(["help"]).stdout).toContain("Usage:");
    });

    it("rejects unknown commands with a non-zero exit", () => {
        const result = run(["nope"]);
        expect(result.status).toBe(1);
        expect(result.stderr).toContain('Unknown command "nope"');
    });

    it("speaks MCP over stdio: only protocol on stdout, tools work, then closes cleanly", async () => {
        const transport = new StdioClientTransport({
            command: "node",
            args: [cli],
            stderr: "pipe",
        });
        const client = new Client({ name: "e2e", version: "1.0.0" });
        await client.connect(transport);
        try {
            expect(client.getServerVersion()).toMatchObject({ name: "vaiperui", version });
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
        } finally {
            await client.close();
        }
    });

    it("--locale sets the default language of the answers", async () => {
        const transport = new StdioClientTransport({
            command: "node",
            args: [cli, "--locale", "pt"],
            stderr: "pipe",
        });
        const client = new Client({ name: "e2e", version: "1.0.0" });
        await client.connect(transport);
        try {
            const result = await client.callTool({
                name: "get_component",
                arguments: { name: "Slider" },
            });
            expect(JSON.stringify(result.content)).toContain("Escolha");
        } finally {
            await client.close();
        }
    });

    it("VAIPERUI_MCP_LOCALE works too", async () => {
        const transport = new StdioClientTransport({
            command: "node",
            args: [cli],
            env: { ...process.env, VAIPERUI_MCP_LOCALE: "es" } as Record<string, string>,
            stderr: "pipe",
        });
        const client = new Client({ name: "e2e", version: "1.0.0" });
        await client.connect(transport);
        try {
            const result = await client.callTool({
                name: "get_component",
                arguments: { name: "Slider" },
            });
            expect(JSON.stringify(result.content)).toContain("Elige");
        } finally {
            await client.close();
        }
    });
});

describe("vaiperui-mcp install-skill", () => {
    it("installs into ./.claude/skills by default", () => {
        const cwd = tempDir();
        const result = run(["install-skill"], cwd);
        expect(result.status).toBe(0);
        expect(result.stdout).toContain(join(cwd, ".claude/skills/vaiperui"));
        const skill = join(cwd, ".claude/skills/vaiperui");
        expect(readFileSync(join(skill, "SKILL.md"), "utf8")).toMatch(/^---\nname: vaiperui/);
        expect(existsSync(join(skill, "references/select.md"))).toBe(true);
        expect(existsSync(join(skill, "references/patterns.md"))).toBe(true);
    });

    it("installs into --dir", () => {
        const cwd = tempDir();
        expect(run(["install-skill", "--dir", ".agents/skills"], cwd).status).toBe(0);
        expect(existsSync(join(cwd, ".agents/skills/vaiperui/SKILL.md"))).toBe(true);
    });

    it("does not overwrite without --force, and replaces cleanly with it", () => {
        const cwd = tempDir();
        run(["install-skill"], cwd);
        const again = run(["install-skill"], cwd);
        expect(again.status).toBe(1);
        expect(again.stderr).toContain("--force");
        const stale = join(cwd, ".claude/skills/vaiperui/old-file.md");
        execFileSync("node", ["-e", `require("fs").writeFileSync(${JSON.stringify(stale)}, "x")`]);
        expect(run(["install-skill", "--force"], cwd).status).toBe(0);
        expect(existsSync(stale)).toBe(false);
    });

    it("the installed skill is the one published in the vaiperui package", () => {
        const cwd = tempDir();
        run(["install-skill"], cwd);
        const published = readFileSync(join(pkg, "../vaiperui/skills/vaiperui/SKILL.md"), "utf8");
        expect(readFileSync(join(cwd, ".claude/skills/vaiperui/SKILL.md"), "utf8")).toBe(published);
    });
});
