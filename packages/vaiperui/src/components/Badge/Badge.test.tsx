import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "./Badge";

describe("Badge", () => {
    it("renders children as a span and defaults to neutral", () => {
        render(<Badge>Draft</Badge>);
        const el = screen.getByText("Draft");
        expect(el.tagName).toBe("SPAN");
        expect(el.className).toContain("bg-[var(--vpd-surface-muted)]");
    });

    it("maps status to color classes", () => {
        render(<Badge status="error">Refused</Badge>);
        expect(screen.getByText("Refused").className).toContain("danger-500");
    });

    it("renders a decorative dot only when asked", () => {
        const { container, rerender } = render(<Badge>A</Badge>);
        expect(container.querySelector("[aria-hidden]")).toBeNull();
        rerender(<Badge dot>A</Badge>);
        expect(container.querySelector("[aria-hidden='true']")).not.toBeNull();
    });

    it("applies customColor vars and native props", () => {
        render(
            <Badge customColor="#ff6600" data-testid="b" className="extra">
                X
            </Badge>,
        );
        const el = screen.getByTestId("b");
        expect(el.style.getPropertyValue("--vpd-accent")).toBe("#ff6600");
        expect(el).toHaveClass("extra");
    });
});
