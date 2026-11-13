import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Divider } from "./Divider";

describe("Divider", () => {
    it("is a horizontal separator by default", () => {
        render(<Divider />);
        const el = screen.getByRole("separator");
        expect(el.tagName).toBe("HR");
        expect(el).toHaveAttribute("aria-orientation", "horizontal");
        expect(el).toHaveClass("border-t", "border-solid");
    });

    it("supports vertical orientation and line style", () => {
        render(<Divider orientation="vertical" variant="dashed" />);
        const el = screen.getByRole("separator");
        expect(el).toHaveAttribute("aria-orientation", "vertical");
        expect(el).toHaveClass("border-l", "border-dashed", "self-stretch");
    });

    it("renders the label between two lines", () => {
        render(<Divider label="or" />);
        const el = screen.getByRole("separator");
        expect(el).toHaveTextContent("or");
        expect(el.querySelectorAll("span[aria-hidden]")).toHaveLength(2);
    });

    it("aligns the label to the start with one line", () => {
        render(<Divider label="or" labelAlign="start" />);
        expect(screen.getByRole("separator").querySelectorAll("span[aria-hidden]")).toHaveLength(1);
    });

    it("can be decorative", () => {
        render(<Divider decorative data-testid="d" />);
        expect(screen.queryByRole("separator")).toBeNull();
        expect(screen.getByTestId("d")).toHaveAttribute("role", "presentation");
    });

    it("applies token, customColor, spacing and className", () => {
        const { rerender } = render(<Divider color="strong" spacing="lg" className="x" />);
        const el = screen.getByRole("separator");
        expect(el.style.getPropertyValue("--vpd-divider")).toBe("var(--vpd-border-strong)");
        expect(el).toHaveClass("my-6", "x");
        rerender(<Divider customColor="#f00" />);
        expect(screen.getByRole("separator").style.getPropertyValue("--vpd-divider")).toBe("#f00");
    });
});
