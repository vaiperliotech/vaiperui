import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Modal, ModalClose } from "./Modal";

describe("Modal", () => {
    it("is closed by default and opens from the trigger", () => {
        render(
            <Modal title="Hello" trigger={<button type="button">Open</button>}>
                Body
            </Modal>,
        );
        expect(screen.queryByRole("dialog")).toBeNull();
        fireEvent.click(screen.getByText("Open"));
        const dialog = screen.getByRole("dialog", { name: "Hello" });
        expect(dialog).toHaveAttribute("aria-modal", "true");
        expect(dialog).toHaveTextContent("Body");
    });

    it("locks body scroll while open and releases it on close", () => {
        const { rerender } = render(<Modal title="T" open />);
        expect(document.body.style.overflow).toBe("hidden");
        rerender(<Modal title="T" open={false} />);
        expect(document.body.style.overflow).toBe("");
    });

    it("moves focus in and restores it to the trigger on close", () => {
        render(<Modal title="T" trigger={<button type="button">Open</button>} />);
        const trigger = screen.getByText("Open");
        trigger.focus();
        fireEvent.click(trigger);
        expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
        fireEvent.keyDown(document, { key: "Escape" });
        expect(screen.queryByRole("dialog")).toBeNull();
        expect(trigger).toHaveFocus();
    });

    it("traps Tab inside the dialog", () => {
        render(
            <Modal title="T" open footer={<button type="button">OK</button>}>
                <input aria-label="name" />
            </Modal>,
        );
        screen.getByText("OK").focus();
        fireEvent.keyDown(document, { key: "Tab" });
        expect(screen.getByRole("button", { name: "Close" })).toHaveFocus();
        fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
        expect(screen.getByText("OK")).toHaveFocus();
    });

    it("closes with Escape, the backdrop and the close button, calling onOpenChange", () => {
        const onOpenChange = vi.fn();
        render(<Modal title="T" open onOpenChange={onOpenChange} />);
        fireEvent.keyDown(document, { key: "Escape" });
        fireEvent.click(screen.getByTestId("vpd-backdrop"));
        fireEvent.click(screen.getByRole("button", { name: "Close" }));
        expect(onOpenChange).toHaveBeenCalledTimes(3);
        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(screen.getByRole("dialog")).toBeInTheDocument(); // controlled: stays open
    });

    it("can disable Escape, backdrop and the close button", () => {
        const onOpenChange = vi.fn();
        render(
            <Modal
                title="T"
                open
                onOpenChange={onOpenChange}
                closeOnEscape={false}
                closeOnBackdropClick={false}
                showClose={false}
            />,
        );
        fireEvent.keyDown(document, { key: "Escape" });
        fireEvent.click(screen.getByTestId("vpd-backdrop"));
        expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
        expect(onOpenChange).not.toHaveBeenCalled();
    });

    it("renders the footer only when given, and ModalClose closes", () => {
        render(
            <Modal
                title="T"
                defaultOpen
                footer={
                    <ModalClose>
                        <button type="button">Done</button>
                    </ModalClose>
                }
            />,
        );
        fireEvent.click(screen.getByText("Done"));
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("overrides the close label", () => {
        render(<Modal title="T" open closeLabel="Fechar" />);
        expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument();
    });
});
