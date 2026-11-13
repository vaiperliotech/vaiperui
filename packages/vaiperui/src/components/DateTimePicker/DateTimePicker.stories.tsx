import type { Meta, StoryObj } from "@storybook/react-vite";

import { DateTimePicker } from "./DateTimePicker";

const meta = {
    title: "Components/DateTimePicker",
    component: DateTimePicker,
    args: { label: "DateTimePicker" },
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
            <div style={{ width: 300, minHeight: 420 }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof DateTimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = { args: { defaultValue: new Date(2026, 9, 19, 14, 30) } };

export const WithHelper: Story = { args: { helperText: "Pick one." } };

export const WithError: Story = { args: { errorMessage: "This field is required" } };

export const Disabled: Story = {
    args: { disabled: true, defaultValue: new Date(2026, 9, 19, 14, 30) },
};

export const ReadOnly: Story = {
    args: { readOnly: true, defaultValue: new Date(2026, 9, 19, 14, 30) },
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <DateTimePicker size="sm" aria-label="sm" />
            <DateTimePicker size="md" aria-label="md" />
            <DateTimePicker size="lg" aria-label="lg" />
        </div>
    ),
};

export const CustomColor: Story = { args: { customColor: "#ff6600" } };

export const TwelveHour: Story = {
    args: { hour12: true, defaultValue: new Date(2026, 9, 19, 14, 30) },
};

export const MinAndMax: Story = {
    args: {
        minDate: new Date(2026, 9, 10),
        maxDate: new Date(2026, 9, 25),
        defaultValue: new Date(2026, 9, 19, 9, 0),
    },
};

export const Portuguese: Story = {
    args: {
        label: "Agendamento",
        locale: "pt-BR",
        defaultValue: new Date(2026, 9, 19, 14, 30),
        confirmLabel: "Confirmar",
        panelLabel: "Escolher data e hora",
        previousMonthLabel: "Mês anterior",
        nextMonthLabel: "Próximo mês",
        labels: { hours: "Horas", minutes: "Minutos" },
    },
};
