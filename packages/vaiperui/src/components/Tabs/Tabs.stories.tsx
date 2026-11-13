import type { Meta, StoryObj } from "@storybook/react-vite";

import { Tab, TabList, TabPanel, Tabs } from "./Tabs";

const meta = {
    title: "Components/Tabs",
    component: Tabs,
    args: { defaultValue: "general" },
    argTypes: {
        variantColor: { control: "select", options: ["primary", "success", "warning", "danger"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
        orientation: { control: "select", options: ["horizontal", "vertical"] },
        activation: { control: "select", options: ["auto", "manual"] },
        customColor: { control: "color" },
    },
    render: (args) => (
        <Tabs {...args}>
            <TabList aria-label="Settings">
                <Tab value="general">General</Tab>
                <Tab value="account">Account</Tab>
                <Tab value="billing" disabled>
                    Billing
                </Tab>
            </TabList>
            <TabPanel value="general">General preferences.</TabPanel>
            <TabPanel value="account">Account details.</TabPanel>
            <TabPanel value="billing">Invoices.</TabPanel>
        </Tabs>
    ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Vertical: Story = { args: { orientation: "vertical" } };

export const ManualActivation: Story = { args: { activation: "manual" } };

export const Sizes: Story = {
    render: (args) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {(["sm", "md", "lg"] as const).map((size) => (
                <Tabs key={size} {...args} size={size}>
                    <TabList aria-label={size}>
                        <Tab value="general">General</Tab>
                        <Tab value="account">Account</Tab>
                    </TabList>
                </Tabs>
            ))}
        </div>
    ),
};

export const Colors: Story = {
    render: (args) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {(["primary", "success", "warning", "danger"] as const).map((color) => (
                <Tabs key={color} {...args} variantColor={color}>
                    <TabList aria-label={color}>
                        <Tab value="general">General</Tab>
                        <Tab value="account">Account</Tab>
                    </TabList>
                </Tabs>
            ))}
        </div>
    ),
};

export const CustomColor: Story = { args: { customColor: "#f97316" } };
