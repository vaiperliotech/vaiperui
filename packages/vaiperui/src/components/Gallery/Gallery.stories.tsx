import type { Meta, StoryObj } from "@storybook/react-vite";

import { Gallery } from "./Gallery";

const svg = (color: string, text: string) =>
    `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="${color}"/><text x="50%" y="50%" fill="white" font-size="96" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${text}</text></svg>`,
    )}`;

const colors = ["#4f46e5", "#059669", "#db2777", "#d97706", "#0891b2", "#7c3aed"];
const items = colors.map((color, i) => ({
    src: svg(color, String(i + 1)),
    alt: `Slide ${i + 1}`,
    caption: `Caption ${i + 1}`,
}));

const meta = {
    title: "Components/Gallery",
    component: Gallery,
    args: { items, "aria-label": "Sample photos" },
    argTypes: {
        columns: { control: { type: "number", min: 1, max: 6 } },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
    },
    decorators: [
        (Story) => (
            <div style={{ maxWidth: 640 }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const TwoColumns: Story = { args: { columns: 2, gap: 16 } };
export const Square: Story = { args: { aspectRatio: "1", radius: "lg" } };
export const WithoutViewer: Story = { args: { lightbox: false } };
