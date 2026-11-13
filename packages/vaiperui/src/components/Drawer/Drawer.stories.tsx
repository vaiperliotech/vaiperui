import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../Button/Button";
import { Drawer, DrawerClose } from "./Drawer";

const meta = {
    title: "Components/Drawer",
    component: Drawer,
    args: {
        title: "Filters",
        children: "Drawer content",
        trigger: <Button>Open drawer</Button>,
    },
    argTypes: {
        side: { control: "select", options: ["left", "right", "top", "bottom"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
    },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {};
export const Left: Story = { args: { side: "left" } };
export const Top: Story = { args: { side: "top" } };
export const Bottom: Story = { args: { side: "bottom" } };

export const WithFooter: Story = {
    args: {
        footer: (
            <DrawerClose>
                <Button>Apply</Button>
            </DrawerClose>
        ),
    },
};
