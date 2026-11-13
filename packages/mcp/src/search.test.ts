import { beforeAll, describe, expect, it } from "vitest";

import { loadCatalog } from "./catalog";
import type { Catalog } from "./schema";
import { findComponent, search, suggest, tokenize } from "./search";

let en: Catalog;
let pt: Catalog;
beforeAll(async () => {
    en = await loadCatalog("en");
    pt = await loadCatalog("pt");
});

/** What a person would type, and the component that must be among the first results. */
const GOLD: Array<[query: string, expected: string, within?: number]> = [
    ["dropdown", "Select"],
    ["dropdown menu with actions", "Menu"],
    ["combobox with search", "Select"],
    ["toggle", "Switch"],
    ["on off switch", "Switch"],
    ["dialog", "Modal"],
    ["modal focus trap", "Modal"],
    ["side panel", "Drawer"],
    ["popup", "Modal"],
    ["tooltip", "Tooltip"],
    ["notification", "Toast"],
    ["snackbar", "Toast"],
    ["loading placeholder", "Skeleton"],
    ["spinner", "Skeleton"],
    ["slider", "Slider"],
    ["range slider two thumbs", "Slider"],
    ["date picker", "DatePicker"],
    ["date range", "DateRangePicker"],
    ["time picker", "TimePicker"],
    ["date and time", "DateTimePicker"],
    ["calendar", "Calendar"],
    ["upload files drag and drop", "Upload"],
    ["file input", "Upload"],
    ["pagination", "Pagination"],
    ["breadcrumbs", "Breadcrumb"],
    ["wizard steps", "Stepper"],
    ["carousel", "Carousel"],
    ["image gallery", "Gallery"],
    ["lightbox", "Lightbox"],
    ["video", "VideoPlayer"],
    ["audio waveform", "AudioPlayer"],
    ["chip", "Tag"],
    ["avatar with initials", "Avatar"],
    ["accordion", "Accordion"],
    ["collapsible sections", "Accordion"],
    ["tabs", "Tabs"],
    ["segmented", "SegmentedControl"],
    ["textarea", "Textarea"],
    ["checkbox indeterminate", "Checkbox"],
    ["radio group", "Radio"],
    ["input mask cpf", "Input"],
    ["phone mask", "Input"],
    ["infinite scroll select", "Select"],
    ["server side search select", "Select"],
    ["responsive grid", "Grid"],
    ["flex column gap", "Stack"],
    ["separator line", "Divider"],
    ["max width wrapper", "Container"],
    ["table", "Table"],
    ["alert dismiss", "Alert"],
    ["banner", "Banner"],
    ["status dot", "Badge"],
    ["button loading", "Button"],
    ["ripple", "Button"],
];

describe("search", () => {
    it.each(GOLD)("%s -> %s", (query, expected, within = 3) => {
        const names = [...new Set(search(en, query, 10).map((hit) => hit.name))];
        expect(names.slice(0, within), `results: ${names.join(", ")}`).toContain(expected);
    });

    it("finds a prop by its name and says which component has it", () => {
        const hit = search(en, "onReachEnd", 3)[0];
        expect(hit?.kind).toBe("prop");
        expect(hit?.name).toBe("Select");
        expect(hit?.title).toBe("onReachEnd");
    });

    it("finds guide sections (dark mode, css import)", () => {
        expect(search(en, "dark mode", 5).some((h) => h.kind === "guide")).toBe(true);
        expect(search(en, "import the css", 5).some((h) => h.kind === "guide")).toBe(true);
    });

    it("limits results and never returns more than 3 hits per component", () => {
        const hits = search(en, "focus keyboard aria", 25);
        const per = new Map<string, number>();
        for (const hit of hits) per.set(hit.ref, (per.get(hit.ref) ?? 0) + 1);
        expect(Math.max(...per.values())).toBeLessThanOrEqual(3);
        expect(search(en, "button", 2)).toHaveLength(2);
    });

    it("returns nothing for gibberish and for an empty query", () => {
        expect(search(en, "zzzzqqqq xxyyww")).toEqual([]);
        expect(search(en, "   ")).toEqual([]);
    });

    it("is not case, accent or punctuation sensitive", () => {
        expect(search(en, "DATE-PICKER")[0]?.name).toBe("DatePicker");
        expect(search(pt, "calendário")[0]?.name).toBe("Calendar");
    });

    it("searches the other languages", () => {
        expect(search(pt, "selecionar data")[0]?.name).toMatch(
            /DatePicker|Calendar|DateRangePicker/,
        );
        expect(search(pt, "carregando")[0]).toBeDefined();
        expect(search(pt, "notificação")[0]?.name).toMatch(/Toast|Alert/);
        expect(search(pt, "menu suspenso")[0]?.name).toBe("Menu");
    });
});

describe("findComponent / suggest", () => {
    it.each([
        "Select",
        "select",
        "SELECT",
        "date-picker",
        "date picker",
        "DatePicker",
        "datepicker",
        "Date_Picker",
    ])("resolves %s", (name) => {
        expect(findComponent(en, name)).toBeDefined();
    });

    it("does not invent components", () => {
        expect(findComponent(en, "Datagrid")).toBeUndefined();
    });

    it("suggests close names on a miss", () => {
        expect(suggest(en, "Dropdown")).toEqual(expect.arrayContaining(["Select"]));
        expect(suggest(en, "Buton")).toContain("Button");
        expect(suggest(en, "DateRange")).toContain("DateRangePicker");
    });
});

describe("tokenize", () => {
    it("splits camelCase and drops accents", () => {
        expect(tokenize("onValueChange")).toEqual(["on", "value", "change"]);
        expect(tokenize("Máscara de data")).toEqual(["mascara", "de", "data"]);
    });
});
