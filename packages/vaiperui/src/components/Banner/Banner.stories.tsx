import type { Meta, StoryObj } from "@storybook/react-vite";

import { Banner } from "./Banner";

const meta = {
    title: "Components/Banner",
    component: Banner,
    args: { children: "Scheduled maintenance today at 10 PM." },
    argTypes: {
        variantColor: { control: "select", options: ["primary", "success", "warning", "danger"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        customColor: { control: "color" },
    },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colors: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Banner variantColor="primary">Info banner</Banner>
            <Banner variantColor="success">Success banner</Banner>
            <Banner variantColor="warning">Your trial ends in 3 days.</Banner>
            <Banner variantColor="danger">We are facing instability.</Banner>
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <Banner size="sm">Small</Banner>
            <Banner size="md">Medium</Banner>
            <Banner size="lg">Large</Banner>
        </div>
    ),
};

export const WithActionAndDismiss: Story = {
    args: { action: <button type="button">Learn more</button>, onDismiss: () => {} },
};

export const CustomColor: Story = { args: { customColor: "#8b5cf6" } };
