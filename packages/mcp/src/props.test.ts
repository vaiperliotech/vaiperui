import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

import ts from "ts5";
import { describe, expect, it } from "vitest";

import { loadCatalog } from "./catalog";

// The docs tables are written by hand. This test reads the real prop types of every component and
// fails when a prop the library declares is missing from its docs page (or the other way around for
// the rows that name a prop of their own). It uses TypeScript 5's compiler API (`ts5`), because the
// native TypeScript 7 has no such API yet.
const lib = join(import.meta.dirname, "../../vaiperui");
const components = join(lib, "src/components");

/** Props every component takes that need no row of their own. */
const IMPLICIT = new Set(["className", "children"]);

function declaredProps(): Map<string, Set<string>> {
    const config = ts.readConfigFile(join(lib, "tsconfig.json"), ts.sys.readFile);
    const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, lib);
    const files = readdirSync(components)
        .map((dir) => join(components, dir, "types.ts"))
        .filter((file) => existsSync(file));
    const program = ts.createProgram(files, { ...parsed.options, noEmit: true });
    const checker = program.getTypeChecker();
    const byDir = new Map<string, Set<string>>();

    for (const file of files) {
        const source = program.getSourceFile(file);
        if (!source) continue;
        const dir = file.split("/").slice(-2, -1)[0] as string;
        const set = byDir.get(dir) ?? new Set<string>();
        for (const statement of source.statements) {
            const exported = ts.canHaveModifiers(statement)
                ? ts.getModifiers(statement)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
                : false;
            if (
                !exported ||
                !ts.isInterfaceDeclaration(statement) ||
                !/Props$/.test(statement.name.text)
            )
                continue;
            for (const prop of checker.getTypeAtLocation(statement.name).getProperties()) {
                // Only what the library declares: native attributes (value, onClick, aria-*...) come from @types.
                const origin = prop.declarations?.[0]?.getSourceFile().fileName ?? "";
                if (origin && !origin.includes("node_modules")) set.add(prop.name);
            }
        }
        byDir.set(dir, set);
    }
    return byDir;
}

/** Names a docs table documents: "a / b", "Part: a, b", "a (item)", and the words of a part row ("MenuItem"). */
function documentedNames(
    rows: Array<{ prop: string; values: string; description: string }>,
): Set<string> {
    const names = new Set<string>();
    for (const row of rows) {
        const prop = row.prop;
        if (prop.startsWith("(")) continue;
        const isPart = /^[A-Z]/.test(prop.split(":")[0] ?? "") && !prop.includes("/");
        const sources = isPart ? [prop, row.values, row.description] : [prop];
        for (const source of sources) {
            for (const word of source.matchAll(/[A-Za-z][A-Za-z0-9-]*/g)) names.add(word[0]);
        }
    }
    return names;
}

describe("the docs tables document every prop the library declares", () => {
    const declared = declaredProps();

    it("has types for every documented component", async () => {
        const catalog = await loadCatalog("en");
        const dirs = new Set([...declared.keys()].map((d) => d.toLowerCase()));
        expect(
            catalog.components.filter((c) => !dirs.has(c.name.toLowerCase())).map((c) => c.name),
        ).toEqual([]);
    });

    it("misses nothing", async () => {
        const catalog = await loadCatalog("en");
        const missing: string[] = [];
        for (const component of catalog.components) {
            const dir = [...declared.keys()].find(
                (d) => d.toLowerCase() === component.name.toLowerCase(),
            );
            if (!dir) continue;
            const documented = documentedNames(component.props);
            const gaps = [...(declared.get(dir) ?? [])].filter(
                (n) => !IMPLICIT.has(n) && !documented.has(n),
            );
            if (gaps.length) missing.push(`${component.name}: ${gaps.join(", ")}`);
        }
        expect(missing).toEqual([]);
    });
});
