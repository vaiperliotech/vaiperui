import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Gallery } from "./Gallery";

const items = [
    { src: "/1.png", alt: "One", thumbnail: "/1t.png", caption: "First" },
    { src: "/2.png", alt: "Two" },
    { src: "/3.png", alt: "Three" },
];

describe("Gallery", () => {
    it("renders a list of thumbnail buttons using the thumbnail source", () => {
        render(<Gallery items={items} aria-label="Photos" />);
        expect(screen.getByRole("list", { name: "Photos" })).toBeInTheDocument();
        expect(screen.getAllByRole("listitem")).toHaveLength(3);
        expect(screen.getByRole("button", { name: "Open image 1: One" })).toBeInTheDocument();
        expect(screen.getAllByRole("img")[0]).toHaveAttribute("src", "/1t.png");
        expect(screen.getAllByRole("img")[1]).toHaveAttribute("src", "/2.png");
    });

    it("applies columns, gap and aspect ratio", () => {
        render(<Gallery items={items} columns={2} gap={16} aspectRatio="1 / 1" />);
        const list = screen.getByRole("list");
        expect(list.style.gridTemplateColumns).toBe("repeat(2, minmax(0, 1fr))");
        expect(list.style.gap).toBe("16px");
        expect(screen.getByRole("button", { name: /Two/ }).style.aspectRatio).toBe("1 / 1");
    });

    it("opens the viewer on the clicked item and returns focus to the thumbnail", async () => {
        render(<Gallery items={items} />);
        const thumb = screen.getByRole("button", { name: "Open image 2: Two" });
        thumb.focus();
        fireEvent.click(thumb);
        const dialog = await screen.findByRole("dialog");
        expect(screen.getByText("2 / 3")).toBeInTheDocument();
        fireEvent.keyDown(dialog, { key: "Escape" });
        expect(screen.queryByRole("dialog")).toBeNull();
        expect(thumb).toHaveFocus();
    });

    it("calls onItemClick and does not open when lightbox is off", () => {
        const onItemClick = vi.fn();
        render(<Gallery items={items} lightbox={false} onItemClick={onItemClick} />);
        fireEvent.click(screen.getByRole("button", { name: /Three/ }));
        expect(onItemClick).toHaveBeenCalledWith(items[2], 2);
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("overrides the thumbnail and viewer labels", async () => {
        render(
            <Gallery
                items={items}
                openLabel={(item) => `Ampliar ${item.alt}`}
                lightboxProps={{ label: "Visualizador", closeLabel: "Fechar" }}
            />,
        );
        fireEvent.click(screen.getByRole("button", { name: "Ampliar One" }));
        expect(await screen.findByRole("dialog", { name: "Visualizador" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument();
    });
});
