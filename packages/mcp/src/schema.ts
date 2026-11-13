import { z } from "zod";

export const LOCALES = ["en", "pt", "es"] as const;
export type Locale = (typeof LOCALES)[number];

const PropRow = z.object({
    prop: z.string(),
    values: z.string(),
    defaultValue: z.string(),
    description: z.string(),
});

const Variation = z.object({
    title: z.string(),
    description: z.string().optional(),
    code: z.string(),
});

const Accessibility = z.object({
    notes: z.array(z.string()),
    keys: z.array(z.object({ keys: z.string(), action: z.string() })).optional(),
    caveats: z.array(z.string()).optional(),
});

const ComponentDoc = z.object({
    slug: z.string(),
    name: z.string(),
    group: z.string(),
    blurb: z.string(),
    usage: z.string(),
    code: z.string(),
    props: z.array(PropRow),
    /** Types exported from the package root for this component (props, options, values). */
    types: z.array(z.string()).default([]),
    variations: z.array(Variation),
    accessibility: Accessibility.optional(),
});

const Guide = z.object({
    key: z.string(),
    title: z.string(),
    description: z.string(),
    sections: z.array(
        z.object({ title: z.string(), body: z.string(), code: z.string().optional() }),
    ),
});

export const CatalogSchema = z.object({
    library: z.literal("vaiperui"),
    version: z.string(),
    locale: z.enum(LOCALES),
    setup: z.object({
        install: z.string(),
        css: z.string(),
        darkHtml: z.string(),
        darkVariables: z.string(),
    }),
    groups: z.array(
        z.object({ key: z.string(), label: z.string(), components: z.array(z.string()) }),
    ),
    components: z.array(ComponentDoc),
    guides: z.array(Guide),
});

export type Catalog = z.infer<typeof CatalogSchema>;
export type ComponentDocType = z.infer<typeof ComponentDoc>;
export type PropRowType = z.infer<typeof PropRow>;
