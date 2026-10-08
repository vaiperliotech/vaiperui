import { readFileSync } from "node:fs";
import { join } from "node:path";

// "vaiperui"'s own exports map doesn't expose "./package.json", and
// require.resolve() gets intercepted by the bundler (Turbopack/webpack
// rewrite it to an internal module id, not a real fs path) — so we read the
// installed package.json straight off disk instead, relative to the project
// root (process.cwd() at request/build time in a Next.js server component).
export function getVaiperUiVersion(): string {
    const pkgPath = join(process.cwd(), "node_modules/vaiperui/package.json");
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    return pkg.version;
}
