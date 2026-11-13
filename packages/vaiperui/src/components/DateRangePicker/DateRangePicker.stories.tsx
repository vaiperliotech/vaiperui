import type { Meta, StoryObj } from "@storybook/react-vite";

import { DateRangePicker } from "./DateRangePicker";
import { getDatePresets } from "./presets";

const meta = {
    title: "Components/DateRangePicker",
    component: DateRangePicker,
    args: { label: "DateRangePicker" },
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
            <div style={{ width: 360, minHeight: 420 }}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
    args: { defaultValue: { from: new Date(2026, 9, 12), to: new Date(2026, 9, 18) } },
};

export const WithHelper: Story = { args: { helperText: "Pick one." } };

export const WithError: Story = { args: { errorMessage: "This field is required" } };

export const Disabled: Story = {
    args: {
        disabled: true,
        defaultValue: { from: new Date(2026, 9, 12), to: new Date(2026, 9, 18) },
    },
};

export const ReadOnly: Story = {
    args: {
        readOnly: true,
        defaultValue: { from: new Date(2026, 9, 12), to: new Date(2026, 9, 18) },
    },
};

export const Sizes: Story = {
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <DateRangePicker size="sm" aria-label="sm" />
            <DateRangePicker size="md" aria-label="md" />
            <DateRangePicker size="lg" aria-label="lg" />
        </div>
    ),
};

export const CustomColor: Story = { args: { customColor: "#ff6600" } };

export const WithPresets: Story = { args: { presets: true } };

export const CustomPresets: Story = {
    args: {
        presets: [
            {
                label: "This week",
                range: { from: new Date(2026, 9, 12), to: new Date(2026, 9, 18) },
            },
            { label: "Q4", range: { from: new Date(2026, 9, 1), to: new Date(2026, 11, 31) } },
        ],
    },
};

export const Portuguese: Story = {
    args: {
        label: "Período",
        locale: "pt-BR",
        presets: getDatePresets({
            today: "Hoje",
            last7Days: "Últimos 7 dias",
            last30Days: "Últimos 30 dias",
            thisMonth: "Este mês",
            lastMonth: "Mês passado",
        }),
        panelLabel: "Escolher um período",
        previousMonthLabel: "Mês anterior",
        nextMonthLabel: "Próximo mês",
    },
};
