import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Tab, TabList, TabPanel, Tabs } from "./Tabs";
import type { TabsProps } from "./types";

function setup(props: TabsProps = {}) {
    return render(
        <Tabs defaultValue="a" {...props}>
            <TabList aria-label="Sections">
                <Tab value="a">Alpha</Tab>
                <Tab value="b">Beta</Tab>
                <Tab value="c" disabled>
                    Gamma
                </Tab>
                <Tab value="d">Delta</Tab>
            </TabList>
            <TabPanel value="a">Panel A</TabPanel>
            <TabPanel value="b">Panel B</TabPanel>
            <TabPanel value="c">Panel C</TabPanel>
            <TabPanel value="d">Panel D</TabPanel>
        </Tabs>,
    );
}

describe("Tabs", () => {
    it("exposes the WAI-ARIA tabs roles and links tabs to panels", () => {
        setup();
        const list = screen.getByRole("tablist", { name: "Sections" });
        expect(list).toHaveAttribute("aria-orientation", "horizontal");
        const alpha = screen.getByRole("tab", { name: "Alpha" });
        expect(alpha).toHaveAttribute("aria-selected", "true");
        expect(screen.getByRole("tab", { name: "Beta" })).toHaveAttribute("aria-selected", "false");
        const panel = screen.getByRole("tabpanel");
        expect(panel).toHaveTextContent("Panel A");
        expect(alpha.getAttribute("aria-controls")).toBe(panel.id);
        expect(panel.getAttribute("aria-labelledby")).toBe(alpha.id);
    });

    it("hides inactive panels and uses a roving tabindex", () => {
        setup();
        expect(screen.getByText("Panel B")).not.toBeVisible();
        expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute("tabindex", "0");
        expect(screen.getByRole("tab", { name: "Beta" })).toHaveAttribute("tabindex", "-1");
    });

    it("works uncontrolled and emits onValueChange", () => {
        const onValueChange = vi.fn();
        setup({ onValueChange });
        fireEvent.click(screen.getByRole("tab", { name: "Beta" }));
        expect(onValueChange).toHaveBeenCalledWith("b");
        expect(screen.getByRole("tabpanel")).toHaveTextContent("Panel B");
    });

    it("works controlled: the value prop decides", () => {
        const { rerender } = setup({ value: "a", onValueChange: () => {} });
        fireEvent.click(screen.getByRole("tab", { name: "Beta" }));
        expect(screen.getByRole("tab", { name: "Alpha" })).toHaveAttribute("aria-selected", "true");
        rerender(
            <Tabs value="b">
                <TabList>
                    <Tab value="a">Alpha</Tab>
                    <Tab value="b">Beta</Tab>
                </TabList>
            </Tabs>,
        );
        expect(screen.getByRole("tab", { name: "Beta" })).toHaveAttribute("aria-selected", "true");
    });

    it("moves with arrows, skipping disabled tabs, wrapping, and Home/End", () => {
        setup();
        const alpha = screen.getByRole("tab", { name: "Alpha" });
        alpha.focus();
        fireEvent.keyDown(alpha, { key: "ArrowRight" });
        expect(screen.getByRole("tab", { name: "Beta" })).toHaveFocus();
        fireEvent.keyDown(document.activeElement as Element, { key: "ArrowRight" });
        expect(screen.getByRole("tab", { name: "Delta" })).toHaveFocus();
        expect(screen.getByRole("tab", { name: "Delta" })).toHaveAttribute("aria-selected", "true");
        fireEvent.keyDown(document.activeElement as Element, { key: "ArrowRight" });
        expect(alpha).toHaveFocus();
        fireEvent.keyDown(alpha, { key: "End" });
        expect(screen.getByRole("tab", { name: "Delta" })).toHaveFocus();
        fireEvent.keyDown(document.activeElement as Element, { key: "Home" });
        expect(alpha).toHaveFocus();
        fireEvent.keyDown(alpha, { key: "ArrowLeft" });
        expect(screen.getByRole("tab", { name: "Delta" })).toHaveFocus();
    });

    it("manual activation moves focus without selecting", () => {
        setup({ activation: "manual" });
        const alpha = screen.getByRole("tab", { name: "Alpha" });
        alpha.focus();
        fireEvent.keyDown(alpha, { key: "ArrowRight" });
        const beta = screen.getByRole("tab", { name: "Beta" });
        expect(beta).toHaveFocus();
        expect(beta).toHaveAttribute("aria-selected", "false");
        fireEvent.click(beta);
        expect(beta).toHaveAttribute("aria-selected", "true");
    });

    it("uses up/down arrows when vertical", () => {
        setup({ orientation: "vertical" });
        expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical");
        const alpha = screen.getByRole("tab", { name: "Alpha" });
        alpha.focus();
        fireEvent.keyDown(alpha, { key: "ArrowRight" });
        expect(alpha).toHaveFocus();
        fireEvent.keyDown(alpha, { key: "ArrowDown" });
        expect(screen.getByRole("tab", { name: "Beta" })).toHaveFocus();
    });

    it("renders the icon and does not select a disabled tab", () => {
        render(
            <Tabs defaultValue="a">
                <TabList>
                    <Tab value="a" icon={<svg data-testid="icon" />}>
                        A
                    </Tab>
                    <Tab value="b" disabled>
                        B
                    </Tab>
                </TabList>
            </Tabs>,
        );
        expect(screen.getByTestId("icon")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("tab", { name: "B" }));
        expect(screen.getByRole("tab", { name: "A" })).toHaveAttribute("aria-selected", "true");
    });

    it("applies customColor variables to the root", () => {
        const { container } = setup({ customColor: "#ff6600" });
        expect((container.firstChild as HTMLElement).style.getPropertyValue("--vpd-accent")).toBe(
            "#ff6600",
        );
    });

    it("throws outside <Tabs>", () => {
        const spy = vi.spyOn(console, "error").mockImplementation(() => {});
        expect(() => render(<Tab value="a">A</Tab>)).toThrow();
        spy.mockRestore();
    });
});
