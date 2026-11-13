import { beforeAll, describe, expect, it } from "vitest";

import { loadCatalog } from "./catalog";
import { formatComponent, formatHits, formatList, formatSetup } from "./format";
import type { Catalog } from "./schema";
import { findComponent, search } from "./search";

let en: Catalog;
beforeAll(async () => {
    en = await loadCatalog("en");
});

const component = (name: string) => {
    const found = findComponent(en, name);
    if (!found) throw new Error(`no ${name}`);
    return found;
};

describe("formatList", () => {
    it("lists every component once, grouped", () => {
        const text = formatList(en);
        for (const c of en.components)
            expect(text.split(`\`${c.slug}\``).length - 1, c.slug).toBe(1);
        expect(text).toMatch(/^# vaiperui .+: 44 components/);
        expect(text).toContain("## Forms (forms)");
    });

    it("can show one group", () => {
        const text = formatList(en, "feedback");
        expect(text).toContain("Toast");
        expect(text).not.toContain("Button");
    });
});

describe("formatComponent", () => {
    it("starts with the name, shows the import, usage, example, props and accessibility", () => {
        const text = formatComponent(component("Select"));
        expect(text.startsWith("# Select\n")).toBe(true);
        expect(text).toContain('import { Select } from "vaiperui"');
        expect(text).toContain("## Usage");
        expect(text).toContain("```tsx");
        expect(text).toContain("## Props");
        expect(text).toContain("- `onReachEnd` (() => void");
        expect(text).toContain("## Accessibility");
    });

    it("shows the types to import next to the component", () => {
        expect(formatComponent(component("Select"))).toMatch(
            /Types \(same import\): .*`SelectOption`/,
        );
        expect(formatList(en)).toContain("Not in the library");
    });

    it("writes props one per line, with the default only when there is one", () => {
        const text = formatComponent(component("Slider"), ["props"]);
        expect(text).toContain("- `step` (number, default 1):");
        expect(text).not.toContain("default none");
        expect(text).not.toContain("default —");
    });

    it("lists the parts to import for compound components", () => {
        expect(formatComponent(component("Card"))).toMatch(
            /import \{[^}]*CardHeader[^}]*\} from "vaiperui"/,
        );
    });

    it("only includes the requested sections", () => {
        const text = formatComponent(component("Button"), ["props"]);
        expect(text).toContain("## Props");
        expect(text).not.toContain("## Usage");
        expect(text).not.toContain("## Accessibility");
    });

    it("shows every variation with its code in the examples section, and only names them otherwise", () => {
        const c = component("Button");
        const withExamples = formatComponent(c, ["examples"]);
        for (const v of c.variations) expect(withExamples).toContain(`### ${v.title}`);
        expect(formatComponent(c)).toContain('More examples (section "examples"):');
        expect(formatComponent(c)).not.toContain("### ");
    });

    it("includes keyboard and caveats", () => {
        const text = formatComponent(component("Menu"));
        expect(text).toContain("Keyboard:");
        expect(text).toContain("Keep in mind:");
        expect(text).toMatch(/- `[^`]+`: /);
    });
});

describe("formatHits / formatSetup", () => {
    it("formats hits and says when there are none", () => {
        const text = formatHits("dropdown", search(en, "dropdown", 3));
        expect(text).toMatch(/^3 results for "dropdown":/);
        expect(formatHits("zzz", [])).toContain('No results for "zzz"');
    });

    it("gives the exact setup snippets", () => {
        const text = formatSetup(en);
        expect(text).toContain("npm install vaiperui");
        expect(text).toContain('@import "vaiperui/theme.css";');
        expect(text).toContain('@source "../node_modules/vaiperui/dist";');
        expect(text).toContain('className="dark"');
        expect(text).toContain("customColor");
    });

    it("can give one topic", () => {
        const text = formatSetup(en, "css");
        expect(text).toContain("## CSS");
        expect(text).not.toContain("## Install");
    });
});
