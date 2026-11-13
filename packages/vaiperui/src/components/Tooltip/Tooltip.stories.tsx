import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../Button/Button";
import { Tooltip } from "./Tooltip";

const meta = {
    title: "Components/Tooltip",
    component: Tooltip,
    args: { content: "Save your changes", children: <Button>Hover me</Button> },
    argTypes: {
        side: { control: "select", options: ["top", "right", "bottom", "left"] },
        variantColor: {
            control: "select",
            options: ["neutral", "primary", "success", "warning", "danger"],
        },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
        customColor: { control: "color" },
    },
    decorators: [(Story) => <div className="flex justify-center p-24">{Story()}</div>],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Bottom: Story = { args: { side: "bottom" } };
export const WithTitle: Story = { args: { title: "Shortcut", content: "Press Ctrl+S" } };
export const NoArrow: Story = { args: { showArrow: false } };
export const Colored: Story = { args: { variantColor: "primary" } };
export const AlwaysOpen: Story = { args: { open: true } };
