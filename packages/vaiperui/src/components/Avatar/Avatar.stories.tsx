import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar } from "./Avatar";

const meta = {
    title: "Components/Avatar",
    component: Avatar,
    args: { name: "Ada Lovelace" },
    argTypes: {
        size: { control: "select", options: ["sm", "md", "lg"] },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
        variantColor: {
            control: "select",
            options: [undefined, "primary", "success", "warning", "danger"],
        },
        customColor: { control: "color" },
    },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithImage: Story = {
    args: { name: "Camila Souza", src: "https://i.pravatar.cc/112?img=5" },
};

export const BrokenImage: Story = { args: { name: "Katherine Johnson", src: "/broken.png" } };

export const Sizes: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Avatar name="Ada Lovelace" size="sm" />
            <Avatar name="Ada Lovelace" size="md" />
            <Avatar name="Ada Lovelace" size="lg" />
        </div>
    ),
};

export const Colors: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 12 }}>
            <Avatar name="Ada Lovelace" variantColor="primary" />
            <Avatar name="Grace Hopper" variantColor="success" />
            <Avatar name="Alan Turing" variantColor="warning" />
            <Avatar name="Linus Torvalds" variantColor="danger" />
        </div>
    ),
};

export const Radius: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 12 }}>
            <Avatar name="Ada Lovelace" radius="none" />
            <Avatar name="Ada Lovelace" radius="md" />
            <Avatar name="Ada Lovelace" radius="full" />
        </div>
    ),
};

export const CustomColor: Story = {
    render: () => (
        <div style={{ display: "flex", gap: 12 }}>
            <Avatar name="Ada Lovelace" customColor="#ff6600" />
            <Avatar name="Grace Hopper" customColor={{ light: "#a855f7", dark: "#fde047" }} />
        </div>
    ),
};
