import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Slider } from "./Slider";

const meta = {
    title: "Components/Slider",
    component: Slider,
    args: { "aria-label": "Volume", defaultValue: [40] },
    argTypes: {
        variantColor: { control: "select", options: ["primary", "success", "warning", "danger"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
        customColor: { control: "color" },
    },
    decorators: [
        (Story) => (
            <div style={{ width: 320 }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// The Slider does not print its value: show it yourself.
export const WithValue: Story = {
    render: (args) => {
        const [value, setValue] = useState([40]);
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 14 }}>Volume: {value[0]}%</span>
                <Slider {...args} value={value} onValueChange={setValue} />
            </div>
        );
    },
};

export const Interval: Story = {
    args: {
        "aria-label": "Price",
        thumbLabels: ["Minimum price", "Maximum price"],
        defaultValue: [200, 800],
        min: 0,
        max: 1000,
        step: 10,
    },
    render: (args) => {
        const [range, setRange] = useState([200, 800]);
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 14 }}>
                    Price: ${range[0]} to ${range[1]}
                </span>
                <Slider {...args} value={range} onValueChange={setRange} />
            </div>
        );
    },
};

export const MinimumGap: Story = {
    args: { "aria-label": "Price", defaultValue: [30, 70], minStepsBetweenThumbs: 10 },
};

export const CommitOnRelease: Story = {
    render: (args) => {
        const [committed, setCommitted] = useState<number[]>([40]);
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 14 }}>Committed: {committed.join(", ")}</span>
                <Slider {...args} onValueCommit={setCommitted} />
            </div>
        );
    },
};

export const Steps: Story = {
    args: { "aria-label": "Rating", min: 0, max: 100, step: 25, defaultValue: [50] },
};

export const Disabled: Story = { args: { disabled: true } };

export const Colors: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Slider aria-label="primary" variantColor="primary" defaultValue={[40]} />
            <Slider aria-label="success" variantColor="success" defaultValue={[50]} />
            <Slider aria-label="warning" variantColor="warning" defaultValue={[60]} />
            <Slider aria-label="danger" variantColor="danger" defaultValue={[70]} />
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Slider aria-label="sm" size="sm" defaultValue={[30]} />
            <Slider aria-label="md" size="md" defaultValue={[50]} />
            <Slider aria-label="lg" size="lg" defaultValue={[70]} />
        </div>
    ),
};

export const CustomColor: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Slider aria-label="Orange" customColor="#ff6600" defaultValue={[40]} />
            <Slider
                aria-label="Light/dark"
                customColor={{ light: "#a855f7", dark: "#fde047" }}
                defaultValue={[20, 70]}
            />
        </div>
    ),
};
