import type { Meta, StoryObj } from "@storybook/react-vite";

import { DatePicker } from "./DatePicker";

const meta = {
    title: "Components/DatePicker",
    component: DatePicker,
    args: { label: "DatePicker" },
    argTypes: {
        variant: { control: "select", options: ["ring", "outline"] },
        variantColor: { control: "select", options: ["primary", "success", "warning", "danger"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
        customColor: { control: "color" },
    },
    decorators: [
        (Story) => (
            <div style={{ width: 280, minHeight: 420 }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = { args: { defaultValue: new Date(2026, 9, 19) } };

export const WithHelper: Story = { args: { helperText: "Pick one." } };

export const WithError: Story = { args: { errorMessage: "This field is required" } };

export const Disabled: Story = { args: { disabled: true, defaultValue: new Date(2026, 9, 19) } };

export const ReadOnly: Story = { args: { readOnly: true, defaultValue: new Date(2026, 9, 19) } };

export const Sizes: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <DatePicker size="sm" aria-label="sm" />
            <DatePicker size="md" aria-label="md" />
            <DatePicker size="lg" aria-label="lg" />
        </div>
    ),
};

export const CustomColor: Story = { args: { customColor: "#ff6600" } };

export const MinAndMax: Story = {
    args: {
        minDate: new Date(2026, 9, 10),
        maxDate: new Date(2026, 9, 25),
        defaultValue: new Date(2026, 9, 19),
    },
};

export const Portuguese: Story = {
    args: {
        label: "Data de entrega",
        locale: "pt-BR",
        defaultValue: new Date(2026, 9, 19),
        panelLabel: "Escolher uma data",
        previousMonthLabel: "Mês anterior",
        nextMonthLabel: "Próximo mês",
    },
};
