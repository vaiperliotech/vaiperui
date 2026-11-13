export const GUIDE_PATHS = [
    { href: "/docs", key: "intro" },
    { href: "/docs/installation", key: "installation" },
    { href: "/docs/getting-started", key: "gettingStarted" },
] as const;

export const COMPONENT_NAMES = { button: "Button", input: "Input", select: "Select" } as const;

// Sidebar sections of the components list. Add a group (and its label in `docs.groups`) as new kinds of components appear.
export const COMPONENT_GROUPS = [
    { key: "forms", slugs: ["button", "input", "select"] },
] as const satisfies ReadonlyArray<{
    key: string;
    slugs: ReadonlyArray<keyof typeof COMPONENT_NAMES>;
}>;
