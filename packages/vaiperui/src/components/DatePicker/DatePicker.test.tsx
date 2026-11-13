import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { DatePicker } from "./DatePicker";

describe("DatePicker", () => {
    it("shows the placeholder of the locale and opens the calendar on click", () => {
        render(<DatePicker label="Due date" />);
        const trigger = screen.getByRole("button", { name: /Due date/ });
        expect(trigger).toHaveTextContent("mm/dd/yyyy");
        expect(trigger).toHaveAttribute("aria-expanded", "false");
        fireEvent.click(trigger);
        expect(trigger).toHaveAttribute("aria-expanded", "true");
        expect(screen.getByRole("dialog", { name: "Choose a date" })).toBeInTheDocument();
        expect(screen.getByRole("grid")).toBeInTheDocument();
    });

    it("formats the value with the locale", () => {
        const { rerender } = render(
            <DatePicker aria-label="d" defaultValue={new Date(2026, 9, 19)} />,
        );
        expect(screen.getByRole("button", { name: "d" })).toHaveTextContent("10/19/2026");
        rerender(<DatePicker aria-label="d" defaultValue={new Date(2026, 9, 19)} locale="pt-BR" />);
        expect(screen.getByRole("button", { name: "d" })).toHaveTextContent("19/10/2026");
    });

    it("choosing a day emits a Date, updates the field and closes the panel", () => {
        const onValueChange = vi.fn();
        render(
            <DatePicker
                aria-label="d"
                defaultValue={new Date(2026, 9, 19)}
                onValueChange={onValueChange}
            />,
        );
        fireEvent.click(screen.getByRole("button", { name: "d" }));
        fireEvent.click(screen.getByRole("button", { name: /October 21, 2026/ }));
        const [picked] = onValueChange.mock.calls[0] as [Date];
        expect(picked.getDate()).toBe(21);
        expect(screen.getByRole("button", { name: "d" })).toHaveTextContent("10/21/2026");
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("closes on Escape and returns focus to the field", () => {
        render(<DatePicker aria-label="d" />);
        const trigger = screen.getByRole("button", { name: "d" });
        fireEvent.click(trigger);
        fireEvent.keyDown(document, { key: "Escape" });
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        expect(trigger).toHaveFocus();
    });

    it("closes when pressing outside", () => {
        render(<DatePicker aria-label="d" />);
        fireEvent.click(screen.getByRole("button", { name: "d" }));
        fireEvent.pointerDown(document.body);
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("does not open when disabled or readOnly, but readOnly still shows the value", () => {
        const { unmount } = render(<DatePicker aria-label="d" disabled />);
        expect(screen.getByRole("button", { name: "d" })).toBeDisabled();
        unmount();
        render(<DatePicker aria-label="d" readOnly defaultValue={new Date(2026, 9, 19)} />);
        fireEvent.click(screen.getByRole("button", { name: "d" }));
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        expect(screen.getByRole("button", { name: "d" })).toHaveTextContent("10/19/2026");
    });

    it("submits yyyy-mm-dd under name and flags errors", () => {
        const { container } = render(
            <DatePicker
                label="d"
                name="due"
                defaultValue={new Date(2026, 9, 9)}
                errorMessage="Required"
            />,
        );
        expect((container.querySelector("input[name=due]") as HTMLInputElement).value).toBe(
            "2026-10-09",
        );
        const trigger = screen.getByRole("button", { name: /d/ });
        expect(trigger).toHaveAttribute("aria-invalid", "true");
        expect(trigger).toHaveAccessibleDescription("Required");
    });
});
