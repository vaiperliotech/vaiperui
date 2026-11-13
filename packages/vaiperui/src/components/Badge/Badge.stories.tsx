import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./Badge";

const meta = {
    title: "Components/Badge",
    component: Badge,
    args: { children: "Active" },
    argTypes: {
        status: {
            control: "select",
            options: ["success", "error", "warning", "info", "neutral", "pending"],
        },
        size: { control: "select", options: ["sm", "md", "lg"] },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
        customColor: { control: "color" },
    },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDot: Story = { args: { status: "success", dot: true } };

export const Statuses: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 8 }}>
            <Badge status="success">Paid</Badge>
            <Badge status="error">Refused</Badge>
            <Badge status="warning">Attention</Badge>
            <Badge status="info">New</Badge>
            <Badge status="neutral">Draft</Badge>
            <Badge status="pending">Pending</Badge>
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Badge size="sm">sm</Badge>
            <Badge size="md">md</Badge>
            <Badge size="lg">lg</Badge>
        </div>
    ),
};

export const Radius: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 8 }}>
            <Badge radius="none">none</Badge>
            <Badge radius="md">md</Badge>
            <Badge radius="full">full</Badge>
        </div>
    ),
};

export const CustomColor: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 8 }}>
            <Badge customColor="#ff6600" dot>
                Orange
            </Badge>
            <Badge customColor={{ light: "#a855f7", dark: "#fde047" }}>Light/dark</Badge>
        </div>
    ),
};
