import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../Button/Button";
import { Popover, PopoverClose } from "./Popover";

const meta = {
    title: "Components/Popover",
    component: Popover,
    args: {
        label: "Details",
        trigger: <Button>Open popover</Button>,
        children: <p className="w-56">Anchored content, closes on outside click or Escape.</p>,
    },
    argTypes: {
        side: { control: "select", options: ["top", "right", "bottom", "left"] },
        align: { control: "select", options: ["start", "center", "end"] },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
    },
    decorators: [(Story) => <div className="flex justify-center p-24">{Story()}</div>],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Top: Story = { args: { side: "top" } };
export const AlignEnd: Story = { args: { side: "bottom", align: "end" } };

export const WithCloseButton: Story = {
    args: {
        children: (
            <div className="flex flex-col gap-2">
                <span>Are you sure?</span>
                <PopoverClose>
                    <Button size="sm">Got it</Button>
                </PopoverClose>
            </div>
        ),
    },
};
