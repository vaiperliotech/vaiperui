#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { resolveLocale } from "./catalog";
import { createServer } from "./server";

declare const __VERSION__: string;

const HELP = `vaiperui-mcp ${__VERSION__}

Usage:
  vaiperui-mcp [serve] [--locale en|pt|es]     Run the MCP server over stdio (what MCP clients start)
  vaiperui-mcp install-skill [options]         Copy the vaiperui agent skill into a project or your home

install-skill options:
  --global        Install into ~/.claude/skills instead of ./.claude/skills
  --dir <path>    Skills directory to install into (e.g. .agents/skills)
  --force         Replace an existing vaiperui skill
  -h, --help      Show this help
  -v, --version   Show the version

The hosted server is https://vaiperui.vercel.app/mcp (Streamable HTTP):
  claude mcp add --transport http vaiperui https://vaiperui.vercel.app/mcp
This command runs the same server over stdio, for offline or local use.`;

export function installSkill(args: {
    global?: boolean;
    dir?: string;
    force?: boolean;
    cwd?: string;
}): string {
    const source = resolve(dirname(fileURLToPath(import.meta.url)), "skill");
    if (!existsSync(join(source, "SKILL.md"))) {
        throw new Error("This build of vaiperui-mcp does not include the skill.");
    }
    const skills = args.dir
        ? resolve(args.cwd ?? process.cwd(), args.dir)
        : args.global
          ? join(homedir(), ".claude", "skills")
          : join(args.cwd ?? process.cwd(), ".claude", "skills");
    const target = join(skills, "vaiperui");
    if (existsSync(target)) {
        if (!args.force) throw new Error(`${target} already exists. Use --force to replace it.`);
        rmSync(target, { recursive: true, force: true });
    }
    mkdirSync(skills, { recursive: true });
    cpSync(source, target, { recursive: true });
    return target;
}

async function main() {
    const { positionals, values } = parseArgs({
        allowPositionals: true,
        options: {
            locale: { type: "string" },
            global: { type: "boolean" },
            dir: { type: "string" },
            force: { type: "boolean" },
            help: { type: "boolean", short: "h" },
            version: { type: "boolean", short: "v" },
        },
    });
    const command = positionals[0] ?? "serve";

    if (values.help || command === "help") return void console.log(HELP);
    if (values.version) return void console.log(__VERSION__);

    if (command === "install-skill") {
        const target = installSkill(values);
        console.log(`Installed the vaiperui skill in ${target}`);
        return;
    }
    if (command !== "serve") {
        console.error(`Unknown command "${command}".\n\n${HELP}`);
        process.exitCode = 1;
        return;
    }

    const server = createServer({
        defaultLocale: resolveLocale(values.locale ?? process.env.VAIPERUI_MCP_LOCALE),
    });
    await server.connect(new StdioServerTransport());
    // stdout carries the protocol: anything for humans goes to stderr.
    console.error(`vaiperui-mcp ${__VERSION__} ready (stdio)`);
}

main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
