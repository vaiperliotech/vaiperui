import type { Meta, StoryObj } from "@storybook/react-vite";

import { Divider } from "./Divider";

const meta = {
    title: "Components/Divider",
    component: Divider,
    argTypes: {
        orientation: { control: "select", options: ["horizontal", "vertical"] },
        variant: { control: "select", options: ["solid", "dashed", "dotted"] },
        spacing: { control: "select", options: ["none", "sm", "md", "lg"] },
        color: { control: "select", options: ["default", "strong", "soft"] },
        labelAlign: { control: "select", options: ["start", "center", "end"] },
        customColor: { control: "color" },
    },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { spacing: "md" } };
export const Dashed: Story = { args: { variant: "dashed", spacing: "md" } };
export const WithLabel: Story = { args: { label: "or", spacing: "md" } };
export const Vertical: Story = {
    args: { orientation: "vertical", spacing: "md" },
    decorators: [
        (Story) => (
            <div className="flex h-16 items-center text-[var(--vpd-text)]">
                left
                <Story />
                right
            </div>
        ),
    ],
};
