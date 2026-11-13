import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Lightbox } from "./Lightbox";

const svg = (color: string, text: string) =>
    `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="${color}"/><text x="50%" y="50%" fill="white" font-size="96" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${text}</text></svg>`,
    )}`;

const items = [
    { src: svg("#4f46e5", "One"), alt: "Indigo slide", caption: "First image" },
    { src: svg("#059669", "Two"), alt: "Green slide", caption: "Second image" },
    { src: svg("#db2777", "Three"), alt: "Pink slide" },
];

const meta = {
    title: "Components/Lightbox",
    component: Lightbox,
    args: { items },
} satisfies Meta<typeof Lightbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = { args: { defaultOpen: true } };

export const WithTrigger: Story = {
    render: (args) => {
        const [open, setOpen] = useState(false);
        return (
            <>
                <button type="button" onClick={() => setOpen(true)}>
                    Open viewer
                </button>
                <Lightbox {...args} open={open} onOpenChange={setOpen} />
            </>
        );
    },
};
