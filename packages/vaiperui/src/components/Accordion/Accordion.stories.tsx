import type { Meta, StoryObj } from "@storybook/react-vite";

import { Accordion, AccordionItem } from "./Accordion";
import type { AccordionSingleProps } from "./types";

const items = (
    <>
        <AccordionItem value="payment" title="Which payment methods?">
            We accept credit card, bank slip and Pix.
        </AccordionItem>
        <AccordionItem value="shipping" title="How long is shipping?">
            From 3 to 7 business days.
        </AccordionItem>
        <AccordionItem value="refund" title="Refunds" disabled>
            Not available.
        </AccordionItem>
    </>
);

const meta = {
    title: "Components/Accordion",
    component: Accordion,
    args: { type: "single" },
    decorators: [(Story) => <div style={{ width: 400 }}>{Story()}</div>],
    argTypes: {
        variantColor: { control: "select", options: ["primary", "success", "warning", "danger"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
        customColor: { control: "color" },
    },
} satisfies Meta<AccordionSingleProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { render: (args) => <Accordion {...args}>{items}</Accordion> };

export const SingleCollapsible: Story = {
    render: () => (
        <Accordion type="single" collapsible defaultValue="payment">
            {items}
        </Accordion>
    ),
};

export const Multiple: Story = {
    render: () => (
        <Accordion type="multiple" defaultValue={["payment", "shipping"]}>
            {items}
        </Accordion>
    ),
};

export const Colors: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Accordion type="single" variantColor="success">
                {items}
            </Accordion>
            <Accordion type="single" variantColor="danger">
                {items}
            </Accordion>
        </div>
    ),
};

export const CustomColor: Story = {
    render: () => (
        <Accordion type="single" customColor="#ff6600">
            {items}
        </Accordion>
    ),
};
