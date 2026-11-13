import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Calendar } from "./Calendar";
import type { DateRange } from "./types";

const meta = {
    title: "Components/Calendar",
    component: Calendar,
    argTypes: {
        variantColor: { control: "select", options: ["primary", "success", "warning", "danger"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
        weekStartsOn: { control: "select", options: [0, 1, 2, 3, 4, 5, 6] },
        customColor: { control: "color" },
    },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { defaultValue: new Date(2026, 9, 19) } };

export const Controlled: Story = {
    render: () => {
        const [date, setDate] = useState<Date | undefined>(new Date(2026, 9, 19));
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 14 }}>Selected: {date?.toDateString() ?? "none"}</span>
                <Calendar value={date} onValueChange={setDate} />
            </div>
        );
    },
};

export const Range: Story = {
    render: () => {
        const [range, setRange] = useState<DateRange>({
            from: new Date(2026, 9, 12),
            to: new Date(2026, 9, 18),
        });
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: 14 }}>
                    {range.from?.toDateString() ?? "…"} – {range.to?.toDateString() ?? "…"}
                </span>
                <Calendar mode="range" value={range} onValueChange={setRange} />
            </div>
        );
    },
};

export const MinAndMax: Story = {
    args: {
        defaultValue: new Date(2026, 9, 19),
        minDate: new Date(2026, 9, 10),
        maxDate: new Date(2026, 9, 25),
    },
};

export const WeekStartsOnMonday: Story = {
    args: { defaultValue: new Date(2026, 9, 19), weekStartsOn: 1 },
};

export const Portuguese: Story = {
    args: {
        defaultValue: new Date(2026, 9, 19),
        locale: "pt-BR",
        previousMonthLabel: "Mês anterior",
        nextMonthLabel: "Próximo mês",
    },
};

export const Colors: Story = {
    render: () => (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <Calendar variantColor="primary" defaultValue={new Date(2026, 9, 19)} />
            <Calendar variantColor="success" defaultValue={new Date(2026, 9, 19)} />
            <Calendar
                variantColor="warning"
                mode="range"
                defaultValue={{ from: new Date(2026, 9, 12), to: new Date(2026, 9, 18) }}
            />
            <Calendar
                variantColor="danger"
                mode="range"
                defaultValue={{ from: new Date(2026, 9, 12), to: new Date(2026, 9, 18) }}
            />
        </div>
    ),
};

export const CustomColor: Story = {
    args: { defaultValue: new Date(2026, 9, 19), customColor: "#ff6600" },
};
