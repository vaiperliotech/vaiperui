import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Accordion, AccordionItem } from "./Accordion";
import type { AccordionProps } from "./types";

const setup = (props: AccordionProps) =>
    render(
        <Accordion {...props}>
            <AccordionItem value="a" title="Payment">
                Card
            </AccordionItem>
            <AccordionItem value="b" title="Shipping">
                Days
            </AccordionItem>
            <AccordionItem value="c" title="Refund" disabled>
                Never
            </AccordionItem>
        </Accordion>,
    );
const trigger = (name: string) => screen.getByRole("button", { name });

describe("Accordion", () => {
    it("starts closed with aria-expanded=false and hidden panels", () => {
        setup({ type: "single" });
        expect(trigger("Payment")).toHaveAttribute("aria-expanded", "false");
        expect(screen.queryByText("Card")).not.toBeVisible();
    });

    it("single: opens one at a time and is not collapsible by default", () => {
        setup({ type: "single", defaultValue: "a" });
        expect(trigger("Payment")).toHaveAttribute("aria-expanded", "true");
        fireEvent.click(trigger("Shipping"));
        expect(trigger("Payment")).toHaveAttribute("aria-expanded", "false");
        expect(trigger("Shipping")).toHaveAttribute("aria-expanded", "true");
        fireEvent.click(trigger("Shipping"));
        expect(trigger("Shipping")).toHaveAttribute("aria-expanded", "true");
    });

    it("single collapsible closes the open item and reports ''", () => {
        const onValueChange = vi.fn();
        setup({ type: "single", collapsible: true, defaultValue: "a", onValueChange });
        fireEvent.click(trigger("Payment"));
        expect(trigger("Payment")).toHaveAttribute("aria-expanded", "false");
        expect(onValueChange).toHaveBeenCalledWith("");
    });

    it("multiple: toggles independently", () => {
        const onValueChange = vi.fn();
        setup({ type: "multiple", onValueChange });
        fireEvent.click(trigger("Payment"));
        fireEvent.click(trigger("Shipping"));
        expect(onValueChange).toHaveBeenLastCalledWith(["a", "b"]);
        fireEvent.click(trigger("Payment"));
        expect(onValueChange).toHaveBeenLastCalledWith(["b"]);
    });

    it("controlled: only changes through value", () => {
        const onValueChange = vi.fn();
        const { rerender } = setup({ type: "single", value: "a", onValueChange });
        fireEvent.click(trigger("Shipping"));
        expect(onValueChange).toHaveBeenCalledWith("b");
        expect(trigger("Shipping")).toHaveAttribute("aria-expanded", "false");
        rerender(
            <Accordion type="single" value="b">
                <AccordionItem value="a" title="Payment">
                    Card
                </AccordionItem>
                <AccordionItem value="b" title="Shipping">
                    Days
                </AccordionItem>
            </Accordion>,
        );
        expect(trigger("Shipping")).toHaveAttribute("aria-expanded", "true");
    });

    it("links trigger and panel with aria", () => {
        setup({ type: "single", defaultValue: "a" });
        const panel = screen.getByRole("region", { name: "Payment" });
        expect(trigger("Payment")).toHaveAttribute("aria-controls", panel.id);
    });

    it("disabled item cannot be toggled", () => {
        setup({ type: "multiple" });
        expect(trigger("Refund")).toBeDisabled();
    });

    it("arrow keys, Home and End move focus and skip disabled items", () => {
        setup({ type: "single" });
        trigger("Payment").focus();
        fireEvent.keyDown(trigger("Payment"), { key: "ArrowDown" });
        expect(trigger("Shipping")).toHaveFocus();
        fireEvent.keyDown(trigger("Shipping"), { key: "ArrowDown" });
        expect(trigger("Payment")).toHaveFocus();
        fireEvent.keyDown(trigger("Payment"), { key: "ArrowUp" });
        expect(trigger("Shipping")).toHaveFocus();
        fireEvent.keyDown(trigger("Shipping"), { key: "Home" });
        expect(trigger("Payment")).toHaveFocus();
        fireEvent.keyDown(trigger("Payment"), { key: "End" });
        expect(trigger("Shipping")).toHaveFocus();
    });
});
