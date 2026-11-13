import type { Meta, StoryObj } from "@storybook/react-vite";

import { Card, CardBody, CardFooter, CardHeader } from "./Card";

const meta = {
    title: "Components/Card",
    component: Card,
    decorators: [(Story) => <div style={{ width: 320 }}>{Story()}</div>],
    argTypes: {
        padding: { control: "select", options: ["none", "md", "lg"] },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
    },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <Card {...args}>
            <h3 style={{ fontWeight: 600 }}>Pro plan</h3>
            <p>Up to 10 users.</p>
        </Card>
    ),
};

export const Sections: Story = {
    render: (args) => (
        <Card {...args}>
            <CardHeader>Pro plan</CardHeader>
            <CardBody>Up to 10 users and priority support.</CardBody>
            <CardFooter>Billed monthly</CardFooter>
        </Card>
    ),
};

export const Paddings: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Card padding="none">none</Card>
            <Card padding="md">md</Card>
            <Card padding="lg">lg</Card>
        </div>
    ),
};

export const Radius: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Card radius="none">none</Card>
            <Card radius="md">md</Card>
            <Card radius="lg">lg</Card>
        </div>
    ),
};
