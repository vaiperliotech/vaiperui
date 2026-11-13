import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Step, Stepper } from "./Stepper";
import type { StepperProps } from "./types";

function setup(props: Partial<StepperProps> = {}) {
    return render(
        <Stepper current={1} aria-label="Signup" {...props}>
            <Step>Account</Step>
            <Step description="Where to ship">Address</Step>
            <Step>Payment</Step>
        </Stepper>,
    );
}

describe("Stepper", () => {
    it("renders an ordered list with the current step marked", () => {
        setup();
        expect(screen.getByRole("list", { name: "Signup" }).tagName).toBe("OL");
        const items = screen.getAllByRole("listitem");
        expect(items).toHaveLength(3);
        expect(items[1]).toHaveAttribute("aria-current", "step");
        expect(items[0]).not.toHaveAttribute("aria-current");
        expect(items[2]).not.toHaveAttribute("aria-current");
    });

    it("derives states: check on completed, numbers elsewhere, hidden text for screen readers", () => {
        setup();
        const items = screen.getAllByRole("listitem");
        expect(items[0]?.querySelector("svg")).not.toBeNull();
        expect(items[0]).toHaveTextContent("Completed");
        expect(items[1]).toHaveTextContent("2");
        expect(items[2]).toHaveTextContent("3");
        expect(items[2]).not.toHaveTextContent("Completed");
    });

    it("renders the description and a custom completed label", () => {
        setup({ completedLabel: "Concluído" });
        expect(screen.getByText("Where to ship")).toBeInTheDocument();
        expect(screen.getByText("Concluído")).toBeInTheDocument();
    });

    it("has no buttons unless onStepClick is set; then only completed steps are buttons", () => {
        const { unmount } = setup();
        expect(screen.queryByRole("button")).toBeNull();
        unmount();
        const onStepClick = vi.fn();
        setup({ current: 2, onStepClick });
        expect(screen.getAllByRole("button")).toHaveLength(2);
        fireEvent.click(screen.getByRole("button", { name: /Account/ }));
        expect(onStepClick).toHaveBeenCalledWith(0);
    });

    it("supports vertical orientation", () => {
        setup({ orientation: "vertical" });
        expect(screen.getByRole("list")).toHaveClass("flex-col");
    });

    it("applies customColor variables", () => {
        setup({ customColor: "#ff6600" });
        expect(screen.getByRole("list").style.getPropertyValue("--vpd-accent")).toBe("#ff6600");
    });
});
