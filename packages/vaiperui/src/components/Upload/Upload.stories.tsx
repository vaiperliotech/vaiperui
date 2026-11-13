import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Upload } from "./Upload";

const meta = {
    title: "Components/Upload",
    component: Upload,
    args: { "aria-label": "Attachments", onFilesChange: () => {} },
    argTypes: {
        variantColor: { control: "select", options: ["primary", "success", "warning", "danger"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
        customColor: { control: "color" },
    },
    decorators: [
        (Story) => (
            <div style={{ width: 360 }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Upload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDescription: Story = {
    args: { description: "PDF or image, up to 5 MB", accept: ".pdf,image/*" },
};

// The Upload only captures files: listing and accumulating them is up to you.
export const Multiple: Story = {
    render: (args) => {
        const [files, setFiles] = useState<File[]>([]);
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Upload
                    {...args}
                    multiple
                    description="Several files at once"
                    onFilesChange={(chosen) => setFiles((current) => [...current, ...chosen])}
                />
                <ul style={{ fontSize: 14, margin: 0, paddingLeft: 18 }}>
                    {files.map((file, i) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: the same file can be added twice
                        <li key={i}>
                            {file.name} ({Math.ceil(file.size / 1024)} KB)
                        </li>
                    ))}
                </ul>
            </div>
        );
    },
};

export const WithLabelAndHelper: Story = {
    args: { "aria-label": undefined, label: "Resume", helperText: "Only the first file is used." },
};

export const WithError: Story = {
    args: { "aria-label": undefined, label: "Resume", errorMessage: "The file must be a PDF" },
};

export const Disabled: Story = { args: { disabled: true } };

export const Sizes: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Upload aria-label="sm" size="sm" onFilesChange={() => {}} />
            <Upload aria-label="md" size="md" onFilesChange={() => {}} />
            <Upload aria-label="lg" size="lg" onFilesChange={() => {}} />
        </div>
    ),
};

export const Colors: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Upload aria-label="success" variantColor="success" onFilesChange={() => {}} />
            <Upload aria-label="warning" variantColor="warning" onFilesChange={() => {}} />
        </div>
    ),
};

export const CustomColor: Story = { args: { customColor: "#ff6600" } };
