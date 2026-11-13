import type { Meta, StoryObj } from "@storybook/react-vite";

import { Textarea } from "./Textarea";

const meta = {
    title: "Components/Textarea",
    component: Textarea,
    args: { "aria-label": "Textarea", placeholder: "Write something..." },
    argTypes: {
        variant: { control: "select", options: ["ring", "outline"] },
        variantColor: { control: "select", options: ["primary", "success", "warning", "danger"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
        resize: { control: "select", options: ["none", "vertical", "horizontal", "both"] },
        customColor: { control: "color" },
    },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
    args: { "aria-label": undefined, label: "Bio", helperText: "A few words about you." },
};

export const WithError: Story = {
    args: { "aria-label": undefined, label: "Bio", errorMessage: "Write at least 20 characters" },
};

export const Disabled: Story = { args: { disabled: true } };

export const Colors: Story = {
    args: { "aria-label": undefined },
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
            <Textarea aria-label="primary" variantColor="primary" placeholder="primary" />
            <Textarea aria-label="success" variantColor="success" placeholder="success" />
            <Textarea aria-label="warning" variantColor="warning" placeholder="warning" />
            <Textarea aria-label="danger" variantColor="danger" placeholder="danger" />
        </div>
    ),
};

export const Sizes: Story = {
    args: { "aria-label": undefined },
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
            <Textarea aria-label="sm" size="sm" placeholder="sm" />
            <Textarea aria-label="md" size="md" placeholder="md" />
            <Textarea aria-label="lg" size="lg" placeholder="lg" />
        </div>
    ),
};

export const CustomColor: Story = {
    args: { "aria-label": undefined },
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
            <Textarea customColor="#ff6600" label="Orange" placeholder="Focus me" />
            <Textarea customColor={{ light: "#a855f7", dark: "#fde047" }} label="Light/dark" />
        </div>
    ),
};
