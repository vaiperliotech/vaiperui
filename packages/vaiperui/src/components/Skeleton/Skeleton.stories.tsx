import type { Meta, StoryObj } from "@storybook/react-vite";

import { Skeleton } from "./Skeleton";

const meta = {
    title: "Components/Skeleton",
    component: Skeleton,
    argTypes: {
        variant: { control: "select", options: ["text", "title", "avatar", "rectangle", "card"] },
        animation: { control: "select", options: ["pulse", "none"] },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
    },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <div style={{ width: 300 }}>
            <Skeleton {...args} />
        </div>
    ),
};

export const Variants: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 300 }}>
            <Skeleton variant="text" />
            <Skeleton variant="title" />
            <Skeleton variant="avatar" />
            <Skeleton variant="rectangle" />
            <Skeleton variant="card" />
        </div>
    ),
};

export const TextLines: Story = {
    render: () => (
        <div style={{ width: 300 }}>
            <Skeleton lines={3} />
        </div>
    ),
};

export const Static: Story = {
    render: () => (
        <div style={{ width: 300 }}>
            <Skeleton animation="none" variant="card" />
        </div>
    ),
};

export const ProfileCard: Story = {
    render: () => (
        <div aria-busy="true" style={{ display: "flex", gap: 12, width: 300 }}>
            <Skeleton variant="avatar" />
            <div style={{ flex: 1 }}>
                <Skeleton variant="title" width="60%" />
                <div style={{ height: 8 }} />
                <Skeleton lines={2} />
            </div>
        </div>
    ),
};
