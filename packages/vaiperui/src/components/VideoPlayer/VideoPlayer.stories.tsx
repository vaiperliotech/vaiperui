import type { Meta, StoryObj } from "@storybook/react-vite";

import { VideoPlayer } from "./VideoPlayer";

const meta = {
    title: "Components/VideoPlayer",
    component: VideoPlayer,
    args: {
        src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        label: "Flower",
    },
    argTypes: {
        variantColor: { control: "select", options: ["primary", "success", "warning", "danger"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
        customColor: { control: "color" },
    },
    decorators: [
        (Story) => (
            <div style={{ maxWidth: 640 }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof VideoPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Success: Story = { args: { variantColor: "success" } };
export const Looping: Story = { args: { loop: true, muted: true, autoPlay: true } };
export const AlwaysVisibleControls: Story = { args: { hideControlsAfter: 0 } };

// Large play button in the center while paused; narrower than 560px the seek bar moves below the buttons.
export const Overlay: Story = { args: { variant: "overlay" } };
export const OverlayNarrow: Story = {
    args: { variant: "overlay" },
    decorators: [
        (Story) => (
            <div style={{ maxWidth: 400 }}>
                <Story />
            </div>
        ),
    ],
};
