import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./Button";

const meta = {
    title: "Components/Button",
    component: Button,
    args: { children: "Button" },
    argTypes: {
        variant: {
            control: "select",
            options: ["solid", "solid-inverse", "outlined", "outlined2", "transparent"],
        },
        variantColor: {
            control: "select",
            options: ["primary", "success", "warning", "danger"],
        },
        size: { control: "select", options: ["sm", "md", "lg"] },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
        hover: { control: "select", options: ["none", "lift", "scale", "glow"] },
        animation: {
            control: "select",
            options: [
                "none",
                "float",
                "pulse",
                "shine",
                "wiggle",
                "wobble",
                "nudge",
                "jelly",
                "heartbeat",
                "jump",
                "gradient",
                "glow",
            ],
        },
        ripple: { control: "boolean" },
        customColor: { control: "color" },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = { args: { variantColor: "primary" } };

export const Success: Story = { args: { variantColor: "success" } };

export const Warning: Story = { args: { variantColor: "warning" } };

export const Danger: Story = { args: { variantColor: "danger" } };

export const Outlined: Story = { args: { variant: "outlined", variantColor: "primary" } };

export const SolidInverse: Story = { args: { variant: "solid-inverse", variantColor: "primary" } };

export const Outlined2: Story = { args: { variant: "outlined2", variantColor: "primary" } };

export const Transparent: Story = { args: { variant: "transparent", variantColor: "primary" } };

export const Variants: Story = {
    args: { children: undefined },
    render: () => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button variantColor="primary">Primary</Button>
            <Button variantColor="success">Success</Button>
            <Button variantColor="warning">Warning</Button>
            <Button variantColor="danger">Danger</Button>
        </div>
    ),
};

export const OutlinedVariants: Story = {
    args: { children: undefined },
    render: () => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button variant="outlined" variantColor="primary">
                Primary
            </Button>
            <Button variant="outlined" variantColor="success">
                Success
            </Button>
            <Button variant="outlined" variantColor="warning">
                Warning
            </Button>
            <Button variant="outlined" variantColor="danger">
                Danger
            </Button>
        </div>
    ),
};

export const SolidInverseVariants: Story = {
    args: { children: undefined },
    render: () => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button variant="solid-inverse" variantColor="primary">
                Primary
            </Button>
            <Button variant="solid-inverse" variantColor="success">
                Success
            </Button>
            <Button variant="solid-inverse" variantColor="warning">
                Warning
            </Button>
            <Button variant="solid-inverse" variantColor="danger">
                Danger
            </Button>
        </div>
    ),
};

export const Outlined2Variants: Story = {
    args: { children: undefined },
    render: () => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button variant="outlined2" variantColor="primary">
                Primary
            </Button>
            <Button variant="outlined2" variantColor="success">
                Success
            </Button>
            <Button variant="outlined2" variantColor="warning">
                Warning
            </Button>
            <Button variant="outlined2" variantColor="danger">
                Danger
            </Button>
        </div>
    ),
};

export const TransparentVariants: Story = {
    args: { children: undefined },
    render: () => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button variant="transparent" variantColor="primary">
                Primary
            </Button>
            <Button variant="transparent" variantColor="success">
                Success
            </Button>
            <Button variant="transparent" variantColor="warning">
                Warning
            </Button>
            <Button variant="transparent" variantColor="danger">
                Danger
            </Button>
        </div>
    ),
};

export const Sizes: Story = {
    args: { children: undefined },
    render: () => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
        </div>
    ),
};

export const Radius: Story = {
    args: { children: undefined },
    render: () => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button radius="none">None</Button>
            <Button radius="sm">Small</Button>
            <Button radius="md">Medium</Button>
            <Button radius="lg">Large</Button>
            <Button radius="full">Full</Button>
        </div>
    ),
};

export const Hovers: Story = {
    args: { children: undefined },
    render: () => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button hover="none">None</Button>
            <Button hover="lift">Lift</Button>
            <Button hover="scale">Scale</Button>
            <Button hover="glow">Glow</Button>
        </div>
    ),
};

export const Animations: Story = {
    args: { children: undefined },
    render: () => (
        <div
            style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                maxWidth: 640,
            }}
        >
            <Button animation="float">Float</Button>
            <Button animation="pulse">Pulse</Button>
            <Button animation="shine">Shine</Button>
            <Button animation="wiggle">Wiggle</Button>
            <Button animation="wobble">Wobble</Button>
            <Button animation="nudge">Nudge</Button>
            <Button animation="jelly">Jelly</Button>
            <Button animation="heartbeat">Heartbeat</Button>
            <Button animation="jump">Jump</Button>
            <Button animation="gradient">Gradient</Button>
            <Button animation="glow">Glow</Button>
        </div>
    ),
};

export const WithIcons: Story = {
    args: {
        children: "Star",
        iconStart: (
            <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.8 5.9 20.4l1.5-6.8L2.2 9l6.9-.7L12 2z" />
            </svg>
        ),
        iconEnd: (
            <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M5 11l7-7 1.4 1.4L7.8 11H19v2H7.8l5.6 5.6L12 20l-7-7z" />
            </svg>
        ),
    },
};

export const Ripple: Story = {
    args: { ripple: true, children: "Click me" },
};

export const RippleVariants: Story = {
    args: { children: undefined },
    render: () => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Button ripple>Solid</Button>
            <Button ripple variant="outlined">
                Outlined
            </Button>
            <Button ripple variant="transparent" variantColor="success">
                Transparent
            </Button>
        </div>
    ),
};

export const CustomColor: Story = {
    args: { children: undefined },
    render: () => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Button customColor="#ff6600">Orange</Button>
            <Button customColor="#22c55e" variant="solid-inverse">
                Green
            </Button>
            <Button customColor="#a78bfa" variant="outlined">
                Outlined
            </Button>
            <Button customColor="#a78bfa" variant="outlined2">
                Outlined 2
            </Button>
            <Button customColor="#ff6600" variant="transparent">
                Transparent
            </Button>
            <Button customColor="#a78bfa" hover="glow">
                Glow
            </Button>
            <Button customColor={{ light: "#a855f7", dark: "#f472b6" }}>Light/dark</Button>
        </div>
    ),
};

export const Disabled: Story = {
    args: { disabled: true, children: "Disabled" },
};

export const DarkMode: Story = {
    args: { children: undefined },
    parameters: { layout: "fullscreen" },
    render: () => (
        <div className="dark flex min-h-screen flex-wrap items-center justify-center gap-3 bg-neutral-950 p-8">
            <Button variantColor="primary">Primary</Button>
            <Button variantColor="success">Success</Button>
            <Button variantColor="warning">Warning</Button>
            <Button variantColor="danger">Danger</Button>
            <Button variant="outlined" variantColor="primary">
                Outlined
            </Button>
            <Button variant="outlined2" variantColor="success">
                Outlined2
            </Button>
            <Button variant="transparent" variantColor="danger">
                Transparent
            </Button>
        </div>
    ),
};
