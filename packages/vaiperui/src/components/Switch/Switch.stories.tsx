import type { Meta, StoryObj } from "@storybook/react-vite";

import { Switch } from "./Switch";

const meta = {
    title: "Components/Switch",
    component: Switch,
    args: { label: "Wi-Fi" },
    argTypes: {
        variantColor: { control: "select", options: ["primary", "success", "warning", "danger"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
        customColor: { control: "color" },
    },
} satisfies Meta<typeof Switch>;

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
            <Switch defaultChecked variantColor="primary" label="primary" />
            <Switch defaultChecked variantColor="success" label="success" />
            <Switch defaultChecked variantColor="warning" label="warning" />
            <Switch defaultChecked variantColor="danger" label="danger" />
        </div>
    ),
};

export const Sizes: Story = {
    args: { defaultChecked: true },
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
            <Switch defaultChecked size="sm" label="sm" />
            <Switch defaultChecked size="md" label="md" />
            <Switch defaultChecked size="lg" label="lg" />
        </div>
    ),
};

export const CustomColor: Story = {
    args: { defaultChecked: true },
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
            <Switch defaultChecked customColor="#ff6600" label="Orange" />
            <Switch
                defaultChecked
                customColor={{ light: "#a855f7", dark: "#fde047" }}
                label="Light/dark"
            />
        </div>
    ),
};
