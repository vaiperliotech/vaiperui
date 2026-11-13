import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Menu, MenuItem, MenuLabel, MenuSeparator } from "./Menu";

function setup(onSelect = vi.fn()) {
    render(
        <Menu trigger={<button type="button">Actions</button>} label="Actions menu">
            <MenuLabel>Edit</MenuLabel>
            <MenuItem onSelect={onSelect}>Alpha</MenuItem>
            <MenuItem disabled>Beta</MenuItem>
            <MenuItem icon={<i />}>Charlie</MenuItem>
            <MenuSeparator />
            <MenuItem destructive>Delete</MenuItem>
        </Menu>,
    );
    const trigger = screen.getByText("Actions");
    trigger.focus();
    fireEvent.click(trigger);
    return { trigger, onSelect };
}

describe("Menu", () => {
    it("exposes menu semantics and focuses the first item", () => {
        const { trigger } = setup();
        expect(trigger).toHaveAttribute("aria-haspopup", "menu");
        expect(trigger).toHaveAttribute("aria-expanded", "true");
        expect(screen.getByRole("menu", { name: "Actions menu" })).toBeInTheDocument();
        expect(screen.getAllByRole("menuitem")).toHaveLength(4);
        expect(screen.getByRole("separator")).toBeInTheDocument();
        expect(screen.getByText("Alpha")).toHaveFocus();
    });

    it("navigates with arrows (skipping disabled), Home and End, wrapping", () => {
        setup();
        const menu = screen.getByRole("menu");
        fireEvent.keyDown(menu, { key: "ArrowDown" });
        expect(screen.getByText("Charlie")).toHaveFocus();
        fireEvent.keyDown(menu, { key: "End" });
        expect(screen.getByText("Delete")).toHaveFocus();
        fireEvent.keyDown(menu, { key: "ArrowDown" });
        expect(screen.getByText("Alpha")).toHaveFocus();
        fireEvent.keyDown(menu, { key: "ArrowUp" });
        expect(screen.getByText("Delete")).toHaveFocus();
        fireEvent.keyDown(menu, { key: "Home" });
        expect(screen.getByText("Alpha")).toHaveFocus();
    });

    it("typeahead jumps to the matching item", () => {
        setup();
        fireEvent.keyDown(screen.getByRole("menu"), { key: "d" });
        expect(screen.getByText("Delete")).toHaveFocus();
    });

    it("selecting calls onSelect, closes and refocuses the trigger", () => {
        const { trigger, onSelect } = setup();
        fireEvent.click(screen.getByText("Alpha"));
        expect(onSelect).toHaveBeenCalledTimes(1);
        expect(screen.queryByRole("menu")).toBeNull();
        expect(trigger).toHaveFocus();
    });

    it("preventDefault in onSelect keeps the menu open; disabled items do not select", () => {
        const { onSelect } = setup(vi.fn((e: Event) => e.preventDefault()));
        fireEvent.click(screen.getByText("Beta"));
        fireEvent.click(screen.getByText("Alpha"));
        expect(onSelect).toHaveBeenCalledTimes(1);
        expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("closes on Escape (focus to trigger) and outside pointerdown", () => {
        const { trigger } = setup();
        fireEvent.keyDown(document, { key: "Escape" });
        expect(screen.queryByRole("menu")).toBeNull();
        expect(trigger).toHaveFocus();
        fireEvent.click(trigger);
        fireEvent(document.body, new MouseEvent("pointerdown", { bubbles: true }));
        expect(screen.queryByRole("menu")).toBeNull();
    });

    it("opens with ArrowDown on the trigger", () => {
        render(
            <Menu trigger={<button type="button">Go</button>}>
                <MenuItem>One</MenuItem>
            </Menu>,
        );
        fireEvent.keyDown(screen.getByText("Go"), { key: "ArrowDown" });
        expect(screen.getByRole("menu")).toBeInTheDocument();
    });
});
