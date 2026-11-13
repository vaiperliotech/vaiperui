import type { Meta, StoryObj } from "@storybook/react-vite";

import { Radio } from "./Radio";
import { RadioGroup } from "./RadioGroup";

const OPTIONS = [
    { value: "free", label: "Free", description: "For side projects" },
    { value: "pro", label: "Pro", description: "For small teams" },
    { value: "team", label: "Team", description: "Coming soon", disabled: true },
];

const meta = {
    title: "Components/Radio",
    component: RadioGroup,
    args: { options: OPTIONS, label: "Plan", defaultValue: "free" },
    argTypes: {
        variantColor: { control: "select", options: ["primary", "success", "warning", "danger"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
        orientation: { control: "select", options: ["vertical", "horizontal"] },
        customColor: { control: "color" },
    },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Horizontal: Story = { args: { orientation: "horizontal" } };

export const WithHelper: Story = { args: { helperText: "You can change it later." } };

export const WithError: Story = { args: { defaultValue: undefined, errorMessage: "Pick a plan" } };

export const Disabled: Story = { args: { disabled: true } };

export const Colors: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Radio name="c" defaultChecked variantColor="primary" label="primary" />
            <Radio name="c" defaultChecked variantColor="success" label="success" />
            <Radio name="c" defaultChecked variantColor="warning" label="warning" />
            <Radio name="c" defaultChecked variantColor="danger" label="danger" />
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Radio name="s" defaultChecked size="sm" label="sm" />
            <Radio name="s" defaultChecked size="md" label="md" />
            <Radio name="s" defaultChecked size="lg" label="lg" />
        </div>
    ),
};

export const CustomColor: Story = { args: { customColor: "#ff6600" } };

export const SingleRadio: Story = {
    render: () => (
        <Radio name="single" label="A standalone radio" helperText="Use RadioGroup for a set." />
    ),
};
