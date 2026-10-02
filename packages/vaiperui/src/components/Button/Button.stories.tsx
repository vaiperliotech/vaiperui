import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./Button";

const meta = {
    title: "Components/Button",
    component: Button,
    args: { children: "Button" },
    argTypes: {
        variant: {
            control: "select",
            options: ["default", "primary", "success", "warning", "danger"],
        },
        size: { control: "select", options: ["sm", "md", "lg"] },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { variant: "default" } };

export const Primary: Story = { args: { variant: "primary" } };

export const Success: Story = { args: { variant: "success" } };

export const Warning: Story = { args: { variant: "warning" } };

export const Danger: Story = { args: { variant: "danger" } };

export const Variants: Story = {
    args: { children: undefined },
    render: () => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button variant="default">Default</Button>
            <Button variant="primary">Primary</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="danger">Danger</Button>
        </div>
    ),
};

export const Sizes: Story = {
    args: { children: undefined },
    render: () => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
        </div>
    ),
};

export const Disabled: Story = {
    args: { disabled: true, children: "Disabled" },
};
