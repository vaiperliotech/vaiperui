import type { Meta, StoryObj } from "@storybook/react-vite";

import { SegmentedControl, SegmentedItem } from "./SegmentedControl";

const meta = {
    title: "Components/SegmentedControl",
    component: SegmentedControl,
    args: { "aria-label": "View", defaultValue: "list" },
    argTypes: {
        variantColor: {
            control: "select",
            options: [undefined, "primary", "success", "warning", "danger"],
        },
        size: { control: "select", options: ["sm", "md", "lg"] },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
        customColor: { control: "color" },
    },
    render: (args) => (
        <SegmentedControl {...args}>
            <SegmentedItem value="list">List</SegmentedItem>
            <SegmentedItem value="grid">Grid</SegmentedItem>
            <SegmentedItem value="map">Map</SegmentedItem>
        </SegmentedControl>
    ),
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
    render: (args) => (
        <div
            style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}
        >
            {(["sm", "md", "lg"] as const).map((size) => (
                <SegmentedControl key={size} {...args} size={size}>
                    <SegmentedItem value="list">List</SegmentedItem>
                    <SegmentedItem value="grid">Grid</SegmentedItem>
                </SegmentedControl>
            ))}
        </div>
    ),
};

export const Colors: Story = {
    render: (args) => (
        <div
            style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}
        >
            {(["primary", "success", "warning", "danger"] as const).map((color) => (
                <SegmentedControl key={color} {...args} variantColor={color}>
                    <SegmentedItem value="list">List</SegmentedItem>
                    <SegmentedItem value="grid">Grid</SegmentedItem>
                </SegmentedControl>
            ))}
        </div>
    ),
};

export const Rounded: Story = { args: { radius: "full" } };

export const Disabled: Story = { args: { disabled: true } };

export const CustomColor: Story = { args: { customColor: "#f97316" } };
