import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Lightbox } from "./Lightbox";

const items = [
    { src: "/1.png", alt: "One", caption: "First" },
    { src: "/2.png", alt: "Two" },
    { src: "/3.png", alt: "Three" },
];

describe("Lightbox", () => {
    it("renders nothing while closed", () => {
        render(<Lightbox items={items} />);
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("renders a modal dialog in a portal with image, caption and counter", async () => {
        const { container } = render(<Lightbox items={items} defaultOpen />);
        const dialog = await screen.findByRole("dialog", { name: "Image viewer" });
        expect(dialog).toHaveAttribute("aria-modal", "true");
        expect(container.contains(dialog)).toBe(false);
        expect(screen.getByRole("img", { name: "One" })).toHaveAttribute("src", "/1.png");
        expect(screen.getByText("First")).toBeInTheDocument();
        expect(screen.getByText("1 / 3")).toBeInTheDocument();
    });

    it("navigates with buttons and arrow keys, wrapping around", async () => {
        const onIndexChange = vi.fn();
        render(<Lightbox items={items} defaultOpen onIndexChange={onIndexChange} />);
        const dialog = await screen.findByRole("dialog");
        fireEvent.click(screen.getByRole("button", { name: "Next image" }));
        expect(screen.getByText("2 / 3")).toBeInTheDocument();
        fireEvent.keyDown(dialog, { key: "ArrowRight" });
        fireEvent.keyDown(dialog, { key: "ArrowRight" });
        expect(screen.getByText("1 / 3")).toBeInTheDocument();
        fireEvent.keyDown(dialog, { key: "ArrowLeft" });
        expect(screen.getByRole("img", { name: "Three" })).toBeInTheDocument();
        expect(onIndexChange).toHaveBeenLastCalledWith(2);
    });

    it("is controlled by open and index", async () => {
        const onOpenChange = vi.fn();
        const { rerender } = render(
            <Lightbox items={items} open index={1} onOpenChange={onOpenChange} />,
        );
        expect(await screen.findByRole("img", { name: "Two" })).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Close" }));
        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        rerender(<Lightbox items={items} open={false} index={1} onOpenChange={onOpenChange} />);
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("closes with Escape and on backdrop click", async () => {
        render(<Lightbox items={items} defaultOpen />);
        fireEvent.keyDown(await screen.findByRole("dialog"), { key: "Escape" });
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("closes when the backdrop is clicked", async () => {
        render(<Lightbox items={items} defaultOpen />);
        fireEvent.mouseDown(await screen.findByRole("dialog"));
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("moves focus in, traps Tab, locks scroll, and restores focus on close", async () => {
        const opener = document.createElement("button");
        document.body.append(opener);
        opener.focus();
        render(<Lightbox items={items} defaultOpen />);
        const dialog = await screen.findByRole("dialog");
        const close = screen.getByRole("button", { name: "Close" });
        const next = screen.getByRole("button", { name: "Next image" });
        expect(close).toHaveFocus();
        expect(document.body.style.overflow).toBe("hidden");
        next.focus();
        fireEvent.keyDown(dialog, { key: "Tab" });
        expect(close).toHaveFocus();
        fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
        expect(next).toHaveFocus();
        fireEvent.keyDown(dialog, { key: "Escape" });
        expect(opener).toHaveFocus();
        expect(document.body.style.overflow).toBe("");
        opener.remove();
    });

    it("lets onCloseAutoFocus cancel the focus restore", async () => {
        const opener = document.createElement("button");
        document.body.append(opener);
        opener.focus();
        render(<Lightbox items={items} defaultOpen onCloseAutoFocus={(e) => e.preventDefault()} />);
        fireEvent.keyDown(await screen.findByRole("dialog"), { key: "Escape" });
        expect(opener).not.toHaveFocus();
        opener.remove();
    });

    it("hides navigation with a single image and overrides labels", async () => {
        const { unmount } = render(
            <Lightbox items={[items[0] as (typeof items)[number]]} defaultOpen />,
        );
        await screen.findByRole("dialog");
        expect(screen.queryByRole("button", { name: "Next image" })).toBeNull();
        unmount();
        render(
            <Lightbox
                items={items}
                defaultOpen
                label="Fotos"
                closeLabel="Fechar"
                nextLabel="Próxima"
                previousLabel="Anterior"
                counterLabel={(i, n) => `${i + 1} de ${n}`}
            />,
        );
        expect(await screen.findByRole("dialog", { name: "Fotos" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Anterior" })).toBeInTheDocument();
        expect(screen.getByText("1 de 3")).toBeInTheDocument();
    });
});
