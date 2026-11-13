import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Calendar } from "./Calendar";

const day = (name: RegExp) => screen.getByRole("button", { name });

describe("Calendar", () => {
    it("shows the month of the value and marks the selected day", () => {
        render(<Calendar defaultValue={new Date(2026, 9, 19)} />);
        expect(screen.getByRole("grid", { name: "October 2026" })).toBeInTheDocument();
        expect(day(/October 19, 2026/).closest("td")).toHaveAttribute("aria-selected", "true");
    });

    it("selects a day and emits a Date (uncontrolled)", () => {
        const onValueChange = vi.fn();
        render(<Calendar defaultValue={new Date(2026, 9, 19)} onValueChange={onValueChange} />);
        fireEvent.click(day(/October 21, 2026/));
        expect(onValueChange).toHaveBeenCalledTimes(1);
        const picked = onValueChange.mock.calls[0]?.[0] as Date;
        expect([picked.getFullYear(), picked.getMonth(), picked.getDate()]).toEqual([2026, 9, 21]);
        expect(day(/October 21, 2026/).closest("td")).toHaveAttribute("aria-selected", "true");
    });

    it("controlled: the value prop decides the selection", () => {
        const { rerender } = render(
            <Calendar value={new Date(2026, 9, 19)} onValueChange={() => {}} />,
        );
        fireEvent.click(day(/October 21, 2026/));
        expect(day(/October 19, 2026/).closest("td")).toHaveAttribute("aria-selected", "true");
        rerender(<Calendar value={new Date(2026, 9, 21)} onValueChange={() => {}} />);
        expect(day(/October 21, 2026/).closest("td")).toHaveAttribute("aria-selected", "true");
    });

    it("navigates months with the buttons", () => {
        render(<Calendar defaultValue={new Date(2026, 9, 19)} />);
        fireEvent.click(screen.getByRole("button", { name: "Next month" }));
        expect(screen.getByRole("grid", { name: "November 2026" })).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Previous month" }));
        fireEvent.click(screen.getByRole("button", { name: "Previous month" }));
        expect(screen.getByRole("grid", { name: "September 2026" })).toBeInTheDocument();
    });

    it("has a single tab stop and moves focus with the keyboard", () => {
        render(<Calendar defaultValue={new Date(2026, 9, 19)} autoFocus />);
        const buttons = screen.getAllByRole("button").filter((b) => b.hasAttribute("data-date"));
        expect(buttons.filter((b) => b.tabIndex === 0)).toHaveLength(1);
        expect(day(/October 19, 2026/)).toHaveFocus();
        fireEvent.keyDown(day(/October 19, 2026/), { key: "ArrowRight" });
        expect(day(/October 20, 2026/)).toHaveFocus();
        fireEvent.keyDown(day(/October 20, 2026/), { key: "ArrowDown" });
        expect(day(/October 27, 2026/)).toHaveFocus();
        fireEvent.keyDown(day(/October 27, 2026/), { key: "PageDown" });
        expect(screen.getByRole("grid", { name: "November 2026" })).toBeInTheDocument();
        expect(day(/November 27, 2026/)).toHaveFocus();
        fireEvent.keyDown(day(/November 27, 2026/), { key: "PageUp", shiftKey: true });
        expect(screen.getByRole("grid", { name: "November 2025" })).toBeInTheDocument();
    });

    it("Home and End go to the edges of the week, honoring weekStartsOn", () => {
        render(<Calendar defaultValue={new Date(2026, 9, 21)} autoFocus weekStartsOn={1} />);
        fireEvent.keyDown(day(/October 21, 2026/), { key: "Home" });
        expect(day(/October 19, 2026/)).toHaveFocus(); // Monday
        fireEvent.keyDown(day(/October 19, 2026/), { key: "End" });
        expect(day(/October 25, 2026/)).toHaveFocus(); // Sunday
    });

    it("disables days outside minDate/maxDate and the month arrows leading out", () => {
        render(
            <Calendar
                defaultValue={new Date(2026, 9, 19)}
                minDate={new Date(2026, 9, 10)}
                maxDate={new Date(2026, 9, 25)}
            />,
        );
        expect(day(/October 9, 2026/)).toBeDisabled();
        expect(day(/October 10, 2026/)).toBeEnabled();
        expect(day(/October 26, 2026/)).toBeDisabled();
        expect(screen.getByRole("button", { name: "Previous month" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Next month" })).toBeDisabled();
    });

    it("localizes month and day names", () => {
        render(<Calendar defaultValue={new Date(2026, 9, 19)} locale="pt-BR" weekStartsOn={1} />);
        expect(screen.getByRole("grid", { name: /outubro de 2026/i })).toBeInTheDocument();
        expect(screen.getAllByRole("columnheader")[0]).toHaveTextContent("seg.");
    });

    it("marks today with aria-current", () => {
        render(<Calendar />);
        expect(document.querySelector("[aria-current='date']")).not.toBeNull();
    });
});

describe("Calendar in range mode", () => {
    const d = (n: number) => new Date(2026, 9, n);
    const ymd = (v: Date | undefined) => v && [v.getMonth(), v.getDate()];
    const lastCall = (fn: ReturnType<typeof vi.fn>) =>
        fn.mock.calls.at(-1)?.[0] as { from?: Date; to?: Date };

    it("a click after the start sets the end and highlights the whole band", () => {
        const onValueChange = vi.fn();
        render(
            <Calendar mode="range" defaultValue={{ from: d(12) }} onValueChange={onValueChange} />,
        );
        fireEvent.click(day(/October 18, 2026/));
        expect(ymd(lastCall(onValueChange).from)).toEqual([9, 12]);
        expect(ymd(lastCall(onValueChange).to)).toEqual([9, 18]);
        const selected = Array.from(document.querySelectorAll("td[aria-selected='true']")).map(
            (td) => td.textContent,
        );
        expect(selected).toEqual(["12", "13", "14", "15", "16", "17", "18"]);
    });

    it("a click before the start restarts the range from that day", () => {
        const onValueChange = vi.fn();
        render(
            <Calendar mode="range" defaultValue={{ from: d(12) }} onValueChange={onValueChange} />,
        );
        fireEvent.click(day(/October 5, 2026/));
        expect(ymd(lastCall(onValueChange).from)).toEqual([9, 5]);
        expect(lastCall(onValueChange).to).toBeUndefined();
    });

    it("a click on a complete range restarts it", () => {
        const onValueChange = vi.fn();
        render(
            <Calendar
                mode="range"
                defaultValue={{ from: d(12), to: d(18) }}
                onValueChange={onValueChange}
            />,
        );
        fireEvent.click(day(/October 20, 2026/));
        expect(ymd(lastCall(onValueChange).from)).toEqual([9, 20]);
        expect(lastCall(onValueChange).to).toBeUndefined();
    });

    it("clicking the start again makes a one-day range", () => {
        const onValueChange = vi.fn();
        render(
            <Calendar mode="range" defaultValue={{ from: d(12) }} onValueChange={onValueChange} />,
        );
        fireEvent.click(day(/October 12, 2026/));
        expect(ymd(lastCall(onValueChange).to)).toEqual([9, 12]);
    });
});
