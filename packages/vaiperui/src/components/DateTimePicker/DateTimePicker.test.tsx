import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DateTimePicker } from "./DateTimePicker";

const open = () => fireEvent.click(screen.getByRole("button", { name: "dt" }));
const hours = () => within(screen.getByRole("group", { name: "Hours" }));
const minutes = () => within(screen.getByRole("group", { name: "Minutes" }));
const at = (d: Date | undefined) => d && [d.getDate(), d.getHours(), d.getMinutes()];

describe("DateTimePicker", () => {
    it("shows date and time, and a placeholder with both", () => {
        const { unmount } = render(<DateTimePicker aria-label="dt" />);
        expect(screen.getByRole("button", { name: "dt" })).toHaveTextContent("mm/dd/yyyy --:--");
        unmount();
        render(<DateTimePicker aria-label="dt" defaultValue={new Date(2026, 9, 19, 14, 5)} />);
        expect(screen.getByRole("button", { name: "dt" })).toHaveTextContent("10/19/2026 14:05");
    });

    it("picking a day keeps the time and does not close the panel", () => {
        const onValueChange = vi.fn();
        render(
            <DateTimePicker
                aria-label="dt"
                defaultValue={new Date(2026, 9, 19, 14, 5)}
                onValueChange={onValueChange}
            />,
        );
        open();
        fireEvent.click(screen.getByRole("button", { name: /October 21, 2026/ }));
        expect(at(onValueChange.mock.calls[0]?.[0])).toEqual([21, 14, 5]);
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("picking a time keeps the day", () => {
        const onValueChange = vi.fn();
        render(
            <DateTimePicker
                aria-label="dt"
                defaultValue={new Date(2026, 9, 19, 14, 5)}
                onValueChange={onValueChange}
            />,
        );
        open();
        fireEvent.click(hours().getByRole("button", { name: "09" }));
        expect(at(onValueChange.mock.calls.at(-1)?.[0])).toEqual([19, 9, 5]);
        fireEvent.click(minutes().getByRole("button", { name: "45" }));
        expect(at(onValueChange.mock.calls.at(-1)?.[0])).toEqual([19, 9, 45]);
    });

    it("with no value, a day starts at 00:00 and a time starts today", () => {
        const onValueChange = vi.fn();
        const { unmount } = render(
            <DateTimePicker aria-label="dt" onValueChange={onValueChange} />,
        );
        open();
        fireEvent.click(
            screen
                .getAllByRole("button")
                .find(
                    (b) => b.getAttribute("data-date") && !(b as HTMLButtonElement).disabled,
                ) as HTMLElement,
        );
        const picked = onValueChange.mock.calls[0]?.[0] as Date;
        expect([picked.getHours(), picked.getMinutes()]).toEqual([0, 0]);
        unmount();
        const onTime = vi.fn();
        render(<DateTimePicker aria-label="dt" onValueChange={onTime} />);
        open();
        fireEvent.click(hours().getByRole("button", { name: "07" }));
        const t = onTime.mock.calls[0]?.[0] as Date;
        const now = new Date();
        expect([t.getFullYear(), t.getMonth(), t.getDate(), t.getHours()]).toEqual([
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            7,
        ]);
    });

    it("the confirm button closes the panel", () => {
        render(<DateTimePicker aria-label="dt" confirmLabel="Done" />);
        open();
        fireEvent.click(screen.getByRole("button", { name: "Done" }));
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("hour12 shows 12h text; name submits yyyy-mm-ddTHH:mm", () => {
        const { container } = render(
            <DateTimePicker
                aria-label="dt"
                hour12
                name="when"
                defaultValue={new Date(2026, 9, 19, 14, 5)}
            />,
        );
        expect(screen.getByRole("button", { name: "dt" })).toHaveTextContent("10/19/2026 2:05 PM");
        expect((container.querySelector("input[name=when]") as HTMLInputElement).value).toBe(
            "2026-10-19T14:05",
        );
    });
});
