import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Pagination } from "./Pagination";

const meta = {
    title: "Components/Pagination",
    component: Pagination,
    args: { page: 1, pageCount: 20, onPageChange: () => {} },
    argTypes: {
        variantColor: { control: "select", options: ["primary", "success", "warning", "danger"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
        customColor: { control: "color" },
    },
    render: (args) => {
        const [page, setPage] = useState(args.page);
        return <Pagination {...args} page={page} onPageChange={setPage} />;
    },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FewPages: Story = { args: { pageCount: 5, page: 2 } };

export const MoreSiblings: Story = { args: { siblingCount: 2, page: 10 } };

export const Sizes: Story = {
    render: (args) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(["sm", "md", "lg"] as const).map((size) => (
                <Pagination key={size} {...args} size={size} />
            ))}
        </div>
    ),
};

export const Colors: Story = {
    render: (args) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(["primary", "success", "warning", "danger"] as const).map((color) => (
                <Pagination key={color} {...args} variantColor={color} />
            ))}
        </div>
    ),
};

export const Rounded: Story = { args: { radius: "full" } };

export const Disabled: Story = { args: { disabled: true } };

export const CustomColor: Story = { args: { customColor: "#f97316" } };
