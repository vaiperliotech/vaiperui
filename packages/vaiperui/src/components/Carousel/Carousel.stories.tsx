import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Carousel } from "./Carousel";

const colors = ["#4f46e5", "#059669", "#db2777", "#d97706", "#0891b2"];
const slides = colors.map((color, i) => (
    <div
        key={color}
        className="flex h-48 items-center justify-center text-4xl font-semibold text-white"
        style={{ background: color }}
    >
        {i + 1}
    </div>
));

const meta = {
    title: "Components/Carousel",
    component: Carousel,
    args: { "aria-label": "Featured slides", children: slides },
    argTypes: {
        variantColor: { control: "select", options: ["primary", "success", "warning", "danger"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
        customColor: { control: "color" },
    },
    decorators: [
        (Story) => (
            <div style={{ maxWidth: 560 }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Loop: Story = { args: { loop: true } };
export const Autoplay: Story = { args: { autoplay: 3000, loop: true } };
export const TwoPerView: Story = { args: { slidesPerView: 2 } };

export const Controlled: Story = {
    render: (args) => {
        const [index, setIndex] = useState(0);
        return (
            <>
                <p>Index: {index}</p>
                <Carousel {...args} index={index} onIndexChange={setIndex} />
            </>
        );
    },
};
