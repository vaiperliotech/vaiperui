import type { Meta, StoryObj } from "@storybook/react-vite";

import { Toaster, toast } from "./Toast";
import type { ToastColors } from "./types";

const meta = {
    title: "Components/Toast",
    component: Toaster,
    argTypes: {
        position: {
            control: "select",
            options: [
                "top-left",
                "top-center",
                "top-right",
                "bottom-left",
                "bottom-center",
                "bottom-right",
            ],
        },
    },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

const colors: ToastColors[] = ["primary", "success", "warning", "danger"];

export const Default: Story = {
    render: (args) => (
        <>
            <Toaster {...args} />
            <button
                type="button"
                onClick={() => toast({ title: "Saved", description: "Changes saved." })}
            >
                Show toast
            </button>
        </>
    ),
};

export const Colors: Story = {
    render: (args) => (
        <>
            <Toaster {...args} />
            <div style={{ display: "flex", gap: 8 }}>
                {colors.map((variantColor) => (
                    <button
                        key={variantColor}
                        type="button"
                        onClick={() =>
                            toast({ variantColor, description: `A ${variantColor} toast` })
                        }
                    >
                        {variantColor}
                    </button>
                ))}
            </div>
        </>
    ),
};

export const WithAction: Story = {
    render: (args) => (
        <>
            <Toaster {...args} />
            <button
                type="button"
                onClick={() =>
                    toast({
                        description: "Item removed.",
                        action: { label: "Undo", onClick: () => {} },
                    })
                }
            >
                Remove
            </button>
        </>
    ),
};

export const Persistent: Story = {
    render: (args) => (
        <>
            <Toaster {...args} />
            <button
                type="button"
                onClick={() => toast({ description: "Stays until closed", duration: 0 })}
            >
                Show
            </button>
        </>
    ),
};

export const BottomCenter: Story = {
    args: { position: "bottom-center" },
    render: Default.render,
};

export const CustomColor: Story = {
    render: (args) => (
        <>
            <Toaster {...args} />
            <button
                type="button"
                onClick={() => toast({ customColor: "#8b5cf6", description: "Custom" })}
            >
                Show
            </button>
        </>
    ),
};
