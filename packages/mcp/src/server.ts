import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import { loadCatalog, resolveLocale } from "./catalog";
import {
    DEFAULT_SECTIONS,
    formatComponent,
    formatHits,
    formatList,
    formatSetup,
    SECTIONS,
    SETUP_TOPICS,
} from "./format";
import { LOCALES, type Locale } from "./schema";
import { findComponent, search, suggest } from "./search";

declare const __VERSION__: string;

export const INSTRUCTIONS = [
    'vaiperui is a React component library for Tailwind CSS v4 (import from "vaiperui").',
    "Look components up here instead of guessing props: props, defaults, accessibility notes and examples differ per component.",
    "Workflow: search_docs or list_components to choose, get_component for the details, get_setup once per project.",
    'get_component returns overview, props and accessibility by default; ask for sections ["examples"] when you need variations.',
].join(" ");

const locale = z.enum(LOCALES).optional().describe("Language of the docs: en (default), pt or es.");

const readOnly = {
    readOnlyHint: true,
    idempotentHint: true,
    destructiveHint: false,
    openWorldHint: false,
} as const;

const text = (value: string) => ({ content: [{ type: "text" as const, text: value }] });
const fail = (value: string) => ({ ...text(value), isError: true });

export interface ServerOptions {
    /** Version reported to clients. Defaults to the version of this package. */
    version?: string;
    /** Language used when a tool call does not pass one. Defaults to `en`. */
    defaultLocale?: Locale;
}

export function createServer(options: ServerOptions = {}): McpServer {
    const fallback = options.defaultLocale ?? "en";
    const catalogFor = (requested?: Locale) => loadCatalog(requested ?? fallback);

    const server = new McpServer(
        {
            name: "vaiperui",
            version: options.version ?? (typeof __VERSION__ === "string" ? __VERSION__ : "0.0.0"),
        },
        { instructions: INSTRUCTIONS },
    );

    server.registerTool(
        "list_components",
        {
            title: "List vaiperui components",
            description:
                "Lists every vaiperui component with a one-line description, grouped (forms, which includes date and time, dataDisplay, feedback, navigation, overlays, layout, media). Use it to see what exists before choosing; use search_docs when you know what you need.",
            inputSchema: {
                group: z
                    .string()
                    .optional()
                    .describe(
                        "Only this group key: forms, dataDisplay, feedback, navigation, overlays, layout or media. Omit for all.",
                    ),
                locale,
            },
            annotations: readOnly,
        },
        async ({ group, locale: requested }) => {
            const catalog = await catalogFor(requested);
            if (group && !catalog.groups.some((g) => g.key === group)) {
                return fail(
                    `Unknown group "${group}". Groups: ${catalog.groups.map((g) => g.key).join(", ")}.`,
                );
            }
            return text(formatList(catalog, group));
        },
    );

    server.registerTool(
        "get_component",
        {
            title: "Get a vaiperui component",
            description:
                'Full reference of one component: import, usage and a code example, every prop (values, default, description), accessibility (roles, keyboard, what the app must provide). The name is flexible: Button, DatePicker, date-picker, "date picker".',
            inputSchema: {
                name: z
                    .string()
                    .min(1)
                    .describe("Component name or slug, e.g. Select, DateRangePicker, toast."),
                sections: z
                    .array(z.enum(SECTIONS))
                    .optional()
                    .describe(
                        "What to include: overview (usage + example), props, accessibility, examples (every variation with code). Default: overview, props, accessibility.",
                    ),
                locale,
            },
            annotations: readOnly,
        },
        async ({ name, sections, locale: requested }) => {
            const catalog = await catalogFor(requested);
            const component = findComponent(catalog, name);
            if (!component) {
                const close = suggest(catalog, name);
                return fail(
                    `No component named "${name}".${close.length ? ` Did you mean: ${close.join(", ")}?` : ""} Call list_components to see them all.`,
                );
            }
            return text(formatComponent(component, sections?.length ? sections : DEFAULT_SECTIONS));
        },
    );

    server.registerTool(
        "search_docs",
        {
            title: "Search the vaiperui docs",
            description:
                'Searches components, props, examples, accessibility notes and the guides. Use it when you know the need but not the component ("dropdown", "infinite scroll in a select", "focus trap", "input mask for phone"). Returns the best matches with where they are; follow with get_component.',
            inputSchema: {
                query: z.string().min(1).describe("Words to look for, in the docs language."),
                limit: z
                    .number()
                    .int()
                    .min(1)
                    .max(25)
                    .optional()
                    .describe("Max results. Default 8."),
                locale,
            },
            annotations: readOnly,
        },
        async ({ query, limit, locale: requested }) => {
            const catalog = await catalogFor(requested);
            return text(formatHits(query, search(catalog, query, limit ?? 8)));
        },
    );

    server.registerTool(
        "get_setup",
        {
            title: "Get vaiperui setup",
            description:
                "How to install and configure vaiperui in a project: the install command, the CSS imports (Tailwind v4), dark mode and theming (variantColor, customColor, CSS variables). Call it once when adding the library to a project.",
            inputSchema: {
                topic: z
                    .enum(SETUP_TOPICS)
                    .optional()
                    .describe("install, css, dark-mode, theming or all (default)."),
                locale,
            },
            annotations: readOnly,
        },
        async ({ topic, locale: requested }) =>
            text(formatSetup(await catalogFor(requested), topic)),
    );

    // The same data as resources, for clients that attach docs as context instead of calling tools.
    server.registerResource(
        "component",
        new ResourceTemplate("vaiperui://component/{slug}", {
            list: async () => {
                const catalog = await catalogFor();
                return {
                    resources: catalog.components.map((c) => ({
                        uri: `vaiperui://component/${c.slug}`,
                        name: c.name,
                        description: c.blurb,
                        mimeType: "text/markdown",
                    })),
                };
            },
            complete: {
                slug: async (value) => {
                    const catalog = await catalogFor();
                    return catalog.components
                        .map((c) => c.slug)
                        .filter((slug) => slug.startsWith(value.toLowerCase()));
                },
            },
        }),
        { title: "vaiperui component reference", mimeType: "text/markdown" },
        async (uri, { slug }) => {
            const catalog = await catalogFor();
            const component = findComponent(catalog, String(slug));
            if (!component) throw new Error(`No component "${String(slug)}"`);
            return {
                contents: [
                    {
                        uri: uri.href,
                        mimeType: "text/markdown",
                        text: formatComponent(component, [...SECTIONS]),
                    },
                ],
            };
        },
    );

    return server;
}

export { resolveLocale };
