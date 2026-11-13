import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tag } from "./Tag";

const meta = {
    title: "Components/Tag",
    component: Tag,
    args: { children: "Design" },
    argTypes: {
        variant: { control: "select", options: ["filled", "outline"] },
        variantColor: {
            control: "select",
            options: [undefined, "primary", "success", "warning", "danger"],
        },
        size: { control: "select", options: ["sm", "md", "lg"] },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
        customColor: { control: "color" },
    },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = { args: { variant: "outline" } };

export const Dismissible: Story = { args: { onDismiss: () => {}, dismissLabel: "Remove Design" } };

export const Colors: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 8 }}>
            <Tag variantColor="primary">primary</Tag>
            <Tag variantColor="success">success</Tag>
            <Tag variantColor="warning">warning</Tag>
            <Tag variantColor="danger">danger</Tag>
            <Tag variant="outline" variantColor="primary">
                outline
            </Tag>
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Tag size="sm">sm</Tag>
            <Tag size="md">md</Tag>
            <Tag size="lg">lg</Tag>
        </div>
    ),
};

export const CustomColor: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 8 }}>
            <Tag customColor="#ff6600" onDismiss={() => {}}>
                Orange
            </Tag>
            <Tag variant="outline" customColor={{ light: "#a855f7", dark: "#fde047" }}>
                Light/dark
            </Tag>
        </div>
    ),
};
