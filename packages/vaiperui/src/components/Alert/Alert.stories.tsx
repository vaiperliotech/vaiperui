import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alert } from "./Alert";

const meta = {
    title: "Components/Alert",
    component: Alert,
    args: { title: "Heads up", children: "Your changes were saved." },
    argTypes: {
        variantColor: { control: "select", options: ["primary", "success", "warning", "danger"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
        customColor: { control: "color" },
    },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colors: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 420 }}>
            <Alert variantColor="primary" title="Info">
                A new version is available.
            </Alert>
            <Alert variantColor="success" title="Success">
                Payment approved.
            </Alert>
            <Alert variantColor="warning" title="Warning">
                Unsaved changes.
            </Alert>
            <Alert variantColor="danger" title="Danger">
                Could not connect.
            </Alert>
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 420 }}>
            <Alert size="sm">Small</Alert>
            <Alert size="md">Medium</Alert>
            <Alert size="lg">Large</Alert>
        </div>
    ),
};

export const WithActionAndDismiss: Story = {
    args: {
        variantColor: "warning",
        action: <button type="button">Save now</button>,
        onDismiss: () => {},
    },
};

export const NoIcon: Story = { args: { icon: false } };

export const CustomColor: Story = { args: { customColor: "#8b5cf6" } };
