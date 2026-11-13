import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Drawer, DrawerClose } from "./Drawer";

describe("Drawer", () => {
    it("opens from the trigger as a modal dialog named by its title", () => {
        render(
            <Drawer title="Filters" trigger={<button type="button">Open</button>}>
                Body
            </Drawer>,
        );
        expect(screen.queryByRole("dialog")).toBeNull();
        fireEvent.click(screen.getByText("Open"));
        const dialog = screen.getByRole("dialog", { name: "Filters" });
        expect(dialog).toHaveAttribute("aria-modal", "true");
        expect(document.body.style.overflow).toBe("hidden");
    });

    it.each([
        ["left", "-translate-x-full"],
        ["right", "translate-x-full"],
        ["top", "-translate-y-full"],
        ["bottom", "translate-y-full"],
    ] as const)("slides from the %s", (side, cls) => {
        render(<Drawer title="T" open side={side} animation="smooth" />);
        expect(screen.getByRole("dialog").className).toContain(cls);
    });

    it("restores focus and unlocks scroll on Escape", () => {
        render(<Drawer title="T" trigger={<button type="button">Open</button>} />);
        const trigger = screen.getByText("Open");
        trigger.focus();
        fireEvent.click(trigger);
        fireEvent.keyDown(document, { key: "Escape" });
        expect(screen.queryByRole("dialog")).toBeNull();
        expect(trigger).toHaveFocus();
        expect(document.body.style.overflow).toBe("");
    });

    it("closes on backdrop click unless disabled", () => {
        const onOpenChange = vi.fn();
        const { rerender } = render(<Drawer title="T" open onOpenChange={onOpenChange} />);
        fireEvent.click(screen.getByTestId("vpd-backdrop"));
        expect(onOpenChange).toHaveBeenCalledWith(false);
        onOpenChange.mockClear();
        rerender(
            <Drawer title="T" open onOpenChange={onOpenChange} closeOnBackdropClick={false} />,
        );
        fireEvent.click(screen.getByTestId("vpd-backdrop"));
        expect(onOpenChange).not.toHaveBeenCalled();
    });

    it("DrawerClose closes and closeLabel is overridable", () => {
        render(
            <Drawer
                title="T"
                defaultOpen
                closeLabel="Fechar"
                footer={
                    <DrawerClose>
                        <button type="button">Cancel</button>
                    </DrawerClose>
                }
            />,
        );
        expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument();
        fireEvent.click(screen.getByText("Cancel"));
        expect(screen.queryByRole("dialog")).toBeNull();
    });
});
