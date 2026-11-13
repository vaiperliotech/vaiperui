import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DateRangePicker } from "./DateRangePicker";
import { getDatePresets } from "./presets";

describe("DateRangePicker", () => {
    it("shows start and end, with an ellipsis while the end is missing", () => {
        const { rerender } = render(
            <DateRangePicker
                aria-label="r"
                defaultValue={{ from: new Date(2026, 9, 12), to: new Date(2026, 9, 18) }}
            />,
        );
        expect(screen.getByRole("button", { name: "r" })).toHaveTextContent(
            "10/12/2026 – 10/18/2026",
        );
        rerender(<DateRangePicker aria-label="r" value={{ from: new Date(2026, 9, 12) }} />);
        expect(screen.getByRole("button", { name: "r" })).toHaveTextContent("10/12/2026 – …");
    });

    it("emits from first, then from+to, and closes after the second click", () => {
        const onValueChange = vi.fn();
        render(
            <DateRangePicker
                aria-label="r"
                defaultValue={{ from: new Date(2026, 9, 12) }}
                onValueChange={onValueChange}
            />,
        );
        fireEvent.click(screen.getByRole("button", { name: "r" }));
        fireEvent.click(screen.getByRole("button", { name: /October 18, 2026/ }));
        const range = onValueChange.mock.calls.at(-1)?.[0] as { from: Date; to: Date };
        expect([range.from.getDate(), range.to.getDate()]).toEqual([12, 18]);
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("stays open after the first click", () => {
        render(
            <DateRangePicker
                aria-label="r"
                defaultValue={{ from: new Date(2026, 9, 12), to: new Date(2026, 9, 18) }}
            />,
        );
        fireEvent.click(screen.getByRole("button", { name: "r" }));
        fireEvent.click(screen.getByRole("button", { name: /October 20, 2026/ }));
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("presets set the whole range, close the panel and mark the matching one", () => {
        const onValueChange = vi.fn();
        render(<DateRangePicker aria-label="r" presets onValueChange={onValueChange} />);
        fireEvent.click(screen.getByRole("button", { name: "r" }));
        fireEvent.click(screen.getByRole("button", { name: "Last 7 days" }));
        const range = onValueChange.mock.calls[0]?.[0] as { from: Date; to: Date };
        expect(Math.round((range.to.getTime() - range.from.getTime()) / 86_400_000)).toBe(6);
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "r" }));
        expect(screen.getByRole("button", { name: "Last 7 days" })).toHaveAttribute(
            "aria-pressed",
            "true",
        );
        expect(screen.getByRole("button", { name: "Today" })).toHaveAttribute(
            "aria-pressed",
            "false",
        );
    });

    it("accepts custom presets and disables the ones outside minDate/maxDate", () => {
        const presets = [
            { label: "Q3", range: { from: new Date(2026, 6, 1), to: new Date(2026, 8, 30) } },
        ];
        render(<DateRangePicker aria-label="r" presets={presets} minDate={new Date(2026, 7, 1)} />);
        fireEvent.click(screen.getByRole("button", { name: "r" }));
        expect(screen.getByRole("button", { name: "Q3" })).toBeDisabled();
    });

    it("submits both ends under their names", () => {
        const { container } = render(
            <DateRangePicker
                aria-label="r"
                fromName="from"
                toName="to"
                defaultValue={{ from: new Date(2026, 9, 12), to: new Date(2026, 9, 18) }}
            />,
        );
        expect((container.querySelector("input[name=from]") as HTMLInputElement).value).toBe(
            "2026-10-12",
        );
        expect((container.querySelector("input[name=to]") as HTMLInputElement).value).toBe(
            "2026-10-18",
        );
    });
});

describe("presetLabels", () => {
    it("translates the default presets", () => {
        render(
            <DateRangePicker
                aria-label="r"
                presets
                presetLabels={{ today: "Hoje", last7Days: "Últimos 7 dias" }}
            />,
        );
        fireEvent.click(screen.getByRole("button", { name: "r" }));
        expect(screen.getByRole("button", { name: "Hoje" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Últimos 7 dias" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Last 30 days" })).toBeInTheDocument();
    });
});

describe("getDatePresets", () => {
    it("returns the five default shortcuts and accepts translated labels", () => {
        expect(getDatePresets().map((p) => p.label)).toEqual([
            "Today",
            "Last 7 days",
            "Last 30 days",
            "This month",
            "Last month",
        ]);
        expect(getDatePresets({ today: "Hoje" })[0]?.label).toBe("Hoje");
    });
});
