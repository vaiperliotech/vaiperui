import type { Meta, StoryObj } from "@storybook/react-vite";

import { Breadcrumb, BreadcrumbItem } from "./Breadcrumb";

const meta = {
    title: "Components/Breadcrumb",
    component: Breadcrumb,
    argTypes: {
        variantColor: { control: "select", options: ["primary", "success", "warning", "danger"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        customColor: { control: "color" },
    },
    render: (args) => (
        <Breadcrumb {...args}>
            <BreadcrumbItem href="#">Dashboard</BreadcrumbItem>
            <BreadcrumbItem href="#">Settings</BreadcrumbItem>
            <BreadcrumbItem href="#">Team</BreadcrumbItem>
            <BreadcrumbItem href="#">Members</BreadcrumbItem>
            <BreadcrumbItem current>Profile</BreadcrumbItem>
        </Breadcrumb>
    ),
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomSeparator: Story = { args: { separator: "›" } };

export const Collapsed: Story = { args: { maxItems: 3 } };

export const Sizes: Story = {
    render: (args) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(["sm", "md", "lg"] as const).map((size) => (
                <Breadcrumb key={size} {...args} size={size}>
                    <BreadcrumbItem href="#">Home</BreadcrumbItem>
                    <BreadcrumbItem href="#">Library</BreadcrumbItem>
                    <BreadcrumbItem current>Data</BreadcrumbItem>
                </Breadcrumb>
            ))}
        </div>
    ),
};

export const Colors: Story = {
    render: (args) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(["primary", "success", "warning", "danger"] as const).map((color) => (
                <Breadcrumb key={color} {...args} variantColor={color}>
                    <BreadcrumbItem href="#">Home</BreadcrumbItem>
                    <BreadcrumbItem current>{color}</BreadcrumbItem>
                </Breadcrumb>
            ))}
        </div>
    ),
};

export const CustomColor: Story = { args: { customColor: "#f97316" } };
