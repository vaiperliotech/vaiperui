import type { Meta, StoryObj } from "@storybook/react-vite";

import { Container } from "./Container";

const meta = {
    title: "Components/Container",
    component: Container,
    args: {
        children: "Centered content",
        className: "bg-[var(--vpd-surface-muted)] py-4 text-[var(--vpd-text)]",
    },
    argTypes: { size: { control: "select", options: ["sm", "md", "lg", "xl", "full"] } },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Small: Story = { args: { size: "sm" } };
export const Full: Story = { args: { size: "full", padded: false } };
