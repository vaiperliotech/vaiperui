import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TimePicker } from "./TimePicker";

const open = (name = "t") => fireEvent.click(screen.getByRole("button", { name }));
const hours = () => within(screen.getByRole("group", { name: "Hours" }));
const minutes = () => within(screen.getByRole("group", { name: "Minutes" }));

describe("TimePicker", () => {
    it("shows the placeholder and the 24h value", () => {
        const { unmount } = render(<TimePicker aria-label="t" />);
        expect(screen.getByRole("button", { name: "t" })).toHaveTextContent("--:--");
        unmount();
        render(<TimePicker aria-label="t" defaultValue="14:05" />);
        expect(screen.getByRole("button", { name: "t" })).toHaveTextContent("14:05");
    });

    it("picking an hour then a minute emits HH:mm and keeps the panel open", () => {
        const onValueChange = vi.fn();
        render(<TimePicker aria-label="t" onValueChange={onValueChange} />);
        open();
        fireEvent.click(hours().getByRole("button", { name: "09" }));
        expect(onValueChange).toHaveBeenLastCalledWith("09:00");
        fireEvent.click(minutes().getByRole("button", { name: "30" }));
        expect(onValueChange).toHaveBeenLastCalledWith("09:30");
        expect(screen.getByRole("button", { name: "t" })).toHaveTextContent("09:30");
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(hours().getByRole("button", { name: "09" })).toHaveAttribute("aria-pressed", "true");
    });

    it("minuteStep limits the minutes column", () => {
        render(<TimePicker aria-label="t" minuteStep={15} />);
        open();
        expect(
            minutes()
                .getAllByRole("button")
                .map((b) => b.textContent),
        ).toEqual(["00", "15", "30", "45"]);
    });

    it("hour12 shows 12h text, an AM/PM column, and keeps the value in 24h", () => {
        const onValueChange = vi.fn();
        render(
            <TimePicker aria-label="t" hour12 defaultValue="14:05" onValueChange={onValueChange} />,
        );
        expect(screen.getByRole("button", { name: "t" })).toHaveTextContent("2:05 PM");
        open();
        const period = within(screen.getByRole("group", { name: "AM/PM" }));
        expect(period.getByRole("button", { name: "PM" })).toHaveAttribute("aria-pressed", "true");
        fireEvent.click(period.getByRole("button", { name: "AM" }));
        expect(onValueChange).toHaveBeenLastCalledWith("02:05");
        fireEvent.click(hours().getByRole("button", { name: "11" }));
        expect(onValueChange).toHaveBeenLastCalledWith("11:05");
    });

    it("12 AM is 00h and 12 PM is 12h", () => {
        const onValueChange = vi.fn();
        render(
            <TimePicker aria-label="t" hour12 defaultValue="09:00" onValueChange={onValueChange} />,
        );
        open();
        fireEvent.click(hours().getByRole("button", { name: "12" }));
        expect(onValueChange).toHaveBeenLastCalledWith("00:00");
        fireEvent.click(
            within(screen.getByRole("group", { name: "AM/PM" })).getByRole("button", {
                name: "PM",
            }),
        );
        expect(onValueChange).toHaveBeenLastCalledWith("12:00");
    });

    it("ArrowDown moves focus to the next item of a column", () => {
        render(<TimePicker aria-label="t" defaultValue="09:00" />);
        open();
        const nine = hours().getByRole("button", { name: "09" });
        nine.focus();
        fireEvent.keyDown(nine, { key: "ArrowDown" });
        expect(hours().getByRole("button", { name: "10" })).toHaveFocus();
    });

    it("controlled: the value prop decides; submits HH:mm under name", () => {
        const { container, rerender } = render(
            <TimePicker aria-label="t" name="at" value="08:15" onValueChange={() => {}} />,
        );
        expect((container.querySelector("input[name=at]") as HTMLInputElement).value).toBe("08:15");
        open();
        fireEvent.click(hours().getByRole("button", { name: "10" }));
        expect(screen.getByRole("button", { name: "t" })).toHaveTextContent("08:15");
        rerender(<TimePicker aria-label="t" name="at" value="10:15" onValueChange={() => {}} />);
        expect(screen.getByRole("button", { name: "t" })).toHaveTextContent("10:15");
    });
});
