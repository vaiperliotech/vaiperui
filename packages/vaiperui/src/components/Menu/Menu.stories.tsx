import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../Button/Button";
import { Menu, MenuItem, MenuLabel, MenuSeparator } from "./Menu";

const meta = {
    title: "Components/Menu",
    component: Menu,
    args: {
        label: "Actions",
        trigger: <Button>Actions</Button>,
        children: (
            <>
                <MenuLabel>Project</MenuLabel>
                <MenuItem icon="✎">Rename</MenuItem>
                <MenuItem icon="⧉">Duplicate</MenuItem>
                <MenuItem disabled>Archive</MenuItem>
                <MenuSeparator />
                <MenuItem destructive icon="✕">
                    Delete
                </MenuItem>
            </>
        ),
    },
    argTypes: {
        side: { control: "select", options: ["top", "right", "bottom", "left"] },
        align: { control: "select", options: ["start", "center", "end"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
    },
    decorators: [(Story) => <div className="p-24">{Story()}</div>],
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const AlignEnd: Story = { args: { align: "end" } };
export const Small: Story = { args: { size: "sm" } };
