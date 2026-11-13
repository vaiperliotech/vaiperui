import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "./Checkbox";

const meta = {
    title: "Components/Checkbox",
    component: Checkbox,
    args: { label: "Accept the terms" },
    argTypes: {
        variantColor: { control: "select", options: ["primary", "success", "warning", "danger"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
        customColor: { control: "color" },
    },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = { args: { defaultChecked: true } };

export const WithHelper: Story = {
    args: { label: "Notifications", helperText: "We email you once a week." },
};

export const WithError: Story = {
    args: { label: "Accept the terms", errorMessage: "You must accept to continue" },
};

export const Disabled: Story = {
    args: { disabled: true },
};

export const Colors: Story = {
    args: { defaultChecked: true },
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
            <Checkbox defaultChecked variantColor="primary" label="primary" />
            <Checkbox defaultChecked variantColor="success" label="success" />
            <Checkbox defaultChecked variantColor="warning" label="warning" />
            <Checkbox defaultChecked variantColor="danger" label="danger" />
        </div>
    ),
};

export const Sizes: Story = {
    args: { defaultChecked: true },
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
            <Checkbox defaultChecked size="sm" label="sm" />
            <Checkbox defaultChecked size="md" label="md" />
            <Checkbox defaultChecked size="lg" label="lg" />
        </div>
    ),
};

export const CustomColor: Story = {
    args: { defaultChecked: true },
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
            <Checkbox defaultChecked customColor="#ff6600" label="Orange" />
            <Checkbox
                defaultChecked
                customColor={{ light: "#a855f7", dark: "#fde047" }}
                label="Light/dark"
            />
        </div>
    ),
};

export const Indeterminate: Story = { args: { indeterminate: true, label: "Select all" } };
