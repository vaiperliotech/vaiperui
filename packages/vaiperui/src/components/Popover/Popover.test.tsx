import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Popover, PopoverClose } from "./Popover";

const trigger = <button type="button">Toggle</button>;

describe("Popover", () => {
    it("toggles from the trigger with aria-expanded/aria-controls", () => {
        render(
            <Popover trigger={trigger} label="Filters">
                Content
            </Popover>,
        );
        const button = screen.getByText("Toggle");
        expect(button).toHaveAttribute("aria-expanded", "false");
        fireEvent.click(button);
        const dialog = screen.getByRole("dialog", { name: "Filters" });
        expect(button).toHaveAttribute("aria-expanded", "true");
        expect(button).toHaveAttribute("aria-controls", dialog.id);
        fireEvent.click(button);
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("closes on Escape returning focus to the trigger", () => {
        render(<Popover trigger={trigger} label="L" defaultOpen />);
        fireEvent.keyDown(document, { key: "Escape" });
        expect(screen.queryByRole("dialog")).toBeNull();
        expect(screen.getByText("Toggle")).toHaveFocus();
    });

    it("closes on outside pointerdown but not inside", () => {
        render(
            <Popover trigger={trigger} label="L" defaultOpen>
                <button type="button">Inside</button>
            </Popover>,
        );
        fireEvent(screen.getByText("Inside"), new MouseEvent("pointerdown", { bubbles: true }));
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        fireEvent(document.body, new MouseEvent("pointerdown", { bubbles: true }));
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("moves focus into the panel on open", () => {
        render(
            <Popover trigger={trigger} label="L" defaultOpen>
                <input aria-label="q" />
            </Popover>,
        );
        expect(screen.getByLabelText("q")).toHaveFocus();
    });

    it("works controlled and PopoverClose closes", () => {
        const onOpenChange = vi.fn();
        render(
            <Popover trigger={trigger} label="L" open onOpenChange={onOpenChange}>
                <PopoverClose>
                    <button type="button">Done</button>
                </PopoverClose>
            </Popover>,
        );
        fireEvent.click(screen.getByText("Done"));
        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
});
