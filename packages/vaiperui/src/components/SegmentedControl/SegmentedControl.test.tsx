import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SegmentedControl, SegmentedItem } from "./SegmentedControl";
import type { SegmentedControlProps } from "./types";

function setup(props: Partial<SegmentedControlProps> = {}) {
    return render(
        <SegmentedControl aria-label="View" defaultValue="list" {...props}>
            <SegmentedItem value="list">List</SegmentedItem>
            <SegmentedItem value="grid">Grid</SegmentedItem>
            <SegmentedItem value="map" disabled>
                Map
            </SegmentedItem>
            <SegmentedItem value="board">Board</SegmentedItem>
        </SegmentedControl>,
    );
}

describe("SegmentedControl", () => {
    it("has radiogroup semantics with one checked radio and a roving tabindex", () => {
        setup();
        expect(screen.getByRole("radiogroup", { name: "View" })).toBeInTheDocument();
        expect(screen.getAllByRole("radio")).toHaveLength(4);
        expect(screen.getByRole("radio", { name: "List" })).toHaveAttribute("aria-checked", "true");
        expect(screen.getByRole("radio", { name: "List" })).toHaveAttribute("tabindex", "0");
        expect(screen.getByRole("radio", { name: "Grid" })).toHaveAttribute("tabindex", "-1");
    });

    it("works uncontrolled and emits onValueChange; clicking the selected item does nothing", () => {
        const onValueChange = vi.fn();
        setup({ onValueChange });
        fireEvent.click(screen.getByRole("radio", { name: "List" }));
        expect(onValueChange).not.toHaveBeenCalled();
        fireEvent.click(screen.getByRole("radio", { name: "Grid" }));
        expect(onValueChange).toHaveBeenCalledWith("grid");
        expect(screen.getByRole("radio", { name: "Grid" })).toHaveAttribute("aria-checked", "true");
    });

    it("works controlled", () => {
        const { rerender } = setup({ value: "list", onValueChange: () => {} });
        fireEvent.click(screen.getByRole("radio", { name: "Grid" }));
        expect(screen.getByRole("radio", { name: "List" })).toHaveAttribute("aria-checked", "true");
        rerender(
            <SegmentedControl aria-label="View" value="grid">
                <SegmentedItem value="list">List</SegmentedItem>
                <SegmentedItem value="grid">Grid</SegmentedItem>
            </SegmentedControl>,
        );
        expect(screen.getByRole("radio", { name: "Grid" })).toHaveAttribute("aria-checked", "true");
    });

    it("moves and selects with arrows, skipping disabled items and wrapping", () => {
        setup();
        const list = screen.getByRole("radio", { name: "List" });
        list.focus();
        fireEvent.keyDown(list, { key: "ArrowRight" });
        expect(screen.getByRole("radio", { name: "Grid" })).toHaveFocus();
        fireEvent.keyDown(document.activeElement as Element, { key: "ArrowRight" });
        expect(screen.getByRole("radio", { name: "Board" })).toHaveAttribute(
            "aria-checked",
            "true",
        );
        fireEvent.keyDown(document.activeElement as Element, { key: "ArrowRight" });
        expect(list).toHaveFocus();
        fireEvent.keyDown(list, { key: "ArrowLeft" });
        expect(screen.getByRole("radio", { name: "Board" })).toHaveFocus();
    });

    it("disables one item or the whole control", () => {
        const { unmount } = setup();
        expect(screen.getByRole("radio", { name: "Map" })).toBeDisabled();
        unmount();
        setup({ disabled: true });
        for (const radio of screen.getAllByRole("radio")) expect(radio).toBeDisabled();
    });

    it("applies customColor variables", () => {
        setup({ customColor: "#ff6600" });
        expect(screen.getByRole("radiogroup").style.getPropertyValue("--vpd-accent")).toBe(
            "#ff6600",
        );
    });
});
