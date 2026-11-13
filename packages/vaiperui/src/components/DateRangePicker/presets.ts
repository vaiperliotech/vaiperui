import { addDays, endOfMonth, startOfDay } from "../../lib/date";
import type { DatePreset } from "./types";

export interface PresetLabels {
    today: string;
    last7Days: string;
    last30Days: string;
    thisMonth: string;
    lastMonth: string;
}

const ENGLISH: PresetLabels = {
    today: "Today",
    last7Days: "Last 7 days",
    last30Days: "Last 30 days",
    thisMonth: "This month",
    lastMonth: "Last month",
};

/** The default shortcuts. The last 7 and 30 days include today. Pass `labels` to translate them. */
export function getDatePresets(labels: Partial<PresetLabels> = {}): DatePreset[] {
    const l = { ...ENGLISH, ...labels };
    const today = startOfDay(new Date());
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    return [
        { label: l.today, range: { from: today, to: today } },
        { label: l.last7Days, range: { from: addDays(today, -6), to: today } },
        { label: l.last30Days, range: { from: addDays(today, -29), to: today } },
        { label: l.thisMonth, range: { from: monthStart, to: endOfMonth(today) } },
        { label: l.lastMonth, range: { from: lastMonthStart, to: endOfMonth(lastMonthStart) } },
    ];
}
