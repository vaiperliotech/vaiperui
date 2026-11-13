export const GUIDE_PATHS = [
    { href: "/docs", key: "intro" },
    { href: "/docs/installation", key: "installation" },
    { href: "/docs/getting-started", key: "gettingStarted" },
] as const;

export const COMPONENT_NAMES = {
    button: "Button",
    input: "Input",
    select: "Select",
    textarea: "Textarea",
    checkbox: "Checkbox",
    radio: "Radio",
    switch: "Switch",
    slider: "Slider",
    upload: "Upload",
    calendar: "Calendar",
    "date-picker": "DatePicker",
    "date-range-picker": "DateRangePicker",
    "time-picker": "TimePicker",
    "date-time-picker": "DateTimePicker",
    avatar: "Avatar",
    badge: "Badge",
    tag: "Tag",
    card: "Card",
    list: "List",
    table: "Table",
    accordion: "Accordion",
    alert: "Alert",
    banner: "Banner",
    toast: "Toast",
    skeleton: "Skeleton",
    tabs: "Tabs",
    "segmented-control": "SegmentedControl",
    breadcrumb: "Breadcrumb",
    pagination: "Pagination",
    stepper: "Stepper",
    modal: "Modal",
    drawer: "Drawer",
    popover: "Popover",
    menu: "Menu",
    tooltip: "Tooltip",
    container: "Container",
    grid: "Grid",
    stack: "Stack",
    divider: "Divider",
    "audio-player": "AudioPlayer",
    "video-player": "VideoPlayer",
    gallery: "Gallery",
    lightbox: "Lightbox",
    carousel: "Carousel",
} as const;

// Sidebar sections of the components list. Add a group (and its label in `docs.groups`) as new kinds of components appear.
export const COMPONENT_GROUPS = [
    {
        key: "forms",
        slugs: [
            "button",
            "input",
            "select",
            "textarea",
            "checkbox",
            "radio",
            "switch",
            "slider",
            "upload",
            "calendar",
            "date-picker",
            "date-range-picker",
            "time-picker",
            "date-time-picker",
        ],
    },
    {
        key: "dataDisplay",
        slugs: ["avatar", "badge", "tag", "card", "list", "table", "accordion"],
    },
    {
        key: "feedback",
        slugs: ["alert", "banner", "toast", "skeleton"],
    },
    {
        key: "navigation",
        slugs: ["tabs", "segmented-control", "breadcrumb", "pagination", "stepper"],
    },
    {
        key: "overlays",
        slugs: ["modal", "drawer", "popover", "menu", "tooltip"],
    },
    {
        key: "layout",
        slugs: ["container", "grid", "stack", "divider"],
    },
    {
        key: "media",
        slugs: ["audio-player", "video-player", "gallery", "lightbox", "carousel"],
    },
] as const satisfies ReadonlyArray<{
    key: string;
    slugs: ReadonlyArray<keyof typeof COMPONENT_NAMES>;
}>;
