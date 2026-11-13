import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Step, Stepper } from "./Stepper";

const meta = {
    title: "Components/Stepper",
    component: Stepper,
    args: { current: 1, "aria-label": "Signup steps" },
    argTypes: {
        variantColor: { control: "select", options: ["primary", "success", "warning", "danger"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
        orientation: { control: "select", options: ["horizontal", "vertical"] },
        customColor: { control: "color" },
    },
    render: (args) => (
        <Stepper {...args}>
            <Step>Account</Step>
            <Step>Address</Step>
            <Step>Payment</Step>
        </Stepper>
    ),
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Vertical: Story = {
    args: { orientation: "vertical" },
    render: (args) => (
        <Stepper {...args}>
            <Step description="Email and password">Account</Step>
            <Step description="Where to ship">Address</Step>
            <Step description="Card or bank slip">Payment</Step>
        </Stepper>
    ),
};

export const Clickable: Story = {
    render: (args) => {
        const [current, setCurrent] = useState(2);
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Stepper {...args} current={current} onStepClick={setCurrent}>
                    <Step>Account</Step>
                    <Step>Address</Step>
                    <Step>Payment</Step>
                </Stepper>
                <button type="button" onClick={() => setCurrent((c) => Math.min(c + 1, 3))}>
                    Next
                </button>
            </div>
        );
    },
};

export const Sizes: Story = {
    render: (args) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {(["sm", "md", "lg"] as const).map((size) => (
                <Stepper key={size} {...args} size={size}>
                    <Step>Account</Step>
                    <Step>Address</Step>
                    <Step>Payment</Step>
                </Stepper>
            ))}
        </div>
    ),
};

export const Colors: Story = {
    render: (args) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {(["primary", "success", "warning", "danger"] as const).map((color) => (
                <Stepper key={color} {...args} variantColor={color}>
                    <Step>Account</Step>
                    <Step>Address</Step>
                    <Step>Payment</Step>
                </Stepper>
            ))}
        </div>
    ),
};

export const AllDone: Story = { args: { current: 3 } };

export const CustomColor: Story = { args: { customColor: "#f97316" } };
