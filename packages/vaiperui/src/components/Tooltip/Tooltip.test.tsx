import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Tooltip } from "./Tooltip";

describe("Tooltip", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    const ui = (props = {}) => (
        <Tooltip content="Save changes" {...props}>
            <button type="button">Save</button>
        </Tooltip>
    );

    it("opens on hover after the delay and links with aria-describedby", () => {
        render(ui());
        const button = screen.getByText("Save");
        fireEvent.mouseEnter(button);
        expect(screen.queryByRole("tooltip")).toBeNull();
        act(() => {
            vi.advanceTimersByTime(199);
        });
        expect(screen.queryByRole("tooltip")).toBeNull();
        act(() => {
            vi.advanceTimersByTime(1);
        });
        const tip = screen.getByRole("tooltip");
        expect(tip).toHaveTextContent("Save changes");
        expect(button).toHaveAttribute("aria-describedby", tip.id);
        fireEvent.mouseLeave(button);
        expect(screen.queryByRole("tooltip")).toBeNull();
        expect(button).not.toHaveAttribute("aria-describedby");
    });

    it("does not open when the pointer leaves before the delay", () => {
        render(ui({ delayDuration: 500 }));
        const button = screen.getByText("Save");
        fireEvent.mouseEnter(button);
        fireEvent.mouseLeave(button);
        act(() => {
            vi.advanceTimersByTime(600);
        });
        expect(screen.queryByRole("tooltip")).toBeNull();
    });

    it("opens immediately on focus, closes on blur and Escape", () => {
        render(ui({ title: "Tip" }));
        const button = screen.getByText("Save");
        fireEvent.focus(button);
        act(() => {
            vi.advanceTimersByTime(0);
        });
        expect(screen.getByRole("tooltip")).toHaveTextContent("Tip");
        fireEvent.keyDown(document, { key: "Escape" });
        expect(screen.queryByRole("tooltip")).toBeNull();
        fireEvent.focus(button);
        act(() => {
            vi.advanceTimersByTime(0);
        });
        fireEvent.blur(button);
        expect(screen.queryByRole("tooltip")).toBeNull();
    });

    it("supports controlled open and onOpenChange", () => {
        const onOpenChange = vi.fn();
        render(ui({ open: true, onOpenChange }));
        expect(screen.getByRole("tooltip")).toBeInTheDocument();
        fireEvent.mouseLeave(screen.getByText("Save"));
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("hides the arrow when asked", () => {
        const { rerender } = render(ui({ open: true }));
        expect(screen.getByRole("tooltip").querySelector("[aria-hidden]")).not.toBeNull();
        rerender(ui({ open: true, showArrow: false }));
        expect(screen.getByRole("tooltip").querySelector("[aria-hidden]")).toBeNull();
    });
});
