import type { Meta, StoryObj } from "@storybook/react-vite";

import { AudioPlayer } from "./AudioPlayer";

const meta = {
    title: "Components/AudioPlayer",
    component: AudioPlayer,
    args: {
        src: "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
        label: "T-Rex roar",
    },
    argTypes: {
        variantColor: { control: "select", options: ["primary", "success", "warning", "danger"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
        customColor: { control: "color" },
    },
} satisfies Meta<typeof AudioPlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Success: Story = { args: { variantColor: "success" } };
export const Large: Story = { args: { size: "lg" } };
export const CustomColor: Story = { args: { customColor: "#db2777" } };
export const NoSpeedButton: Story = { args: { speeds: [] } };

// A compact card like a voice message: clickable waveform, "current / total" time and speed.
export const Waveform: Story = { args: { variant: "waveform" } };
export const WaveformCustomSpeeds: Story = {
    args: { variant: "waveform", speeds: [0.75, 1, 1.25, 1.5] },
};
// Peaks computed on the server (0 to 1): skips the download and analysis of the audio.
export const WaveformWithPeaks: Story = {
    args: {
        variant: "waveform",
        bars: 40,
        waveform: [0.1, 0.4, 0.9, 0.6, 0.2, 0.7, 1, 0.5, 0.3, 0.8],
    },
};
export const WaveformColors: Story = { args: { variant: "waveform", variantColor: "success" } };
