import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
    it("is hidden from assistive tech", () => {
        const { container } = render(<Skeleton />);
        expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
    });

    it("pulses with reduced-motion opt-out, and can be static", () => {
        const { container, rerender } = render(<Skeleton />);
        const cls = () => (container.firstElementChild as HTMLElement).className;
        expect(cls()).toContain("animate-pulse");
        expect(cls()).toContain("motion-reduce:animate-none");
        rerender(<Skeleton animation="none" />);
        expect(cls()).not.toContain("animate-pulse");
    });

    it("applies variant shape and width/height", () => {
        const { container } = render(<Skeleton variant="avatar" width={64} height="4rem" />);
        const el = container.firstElementChild as HTMLElement;
        expect(el.className).toContain("rounded-full");
        expect(el.style.width).toBe("64px");
        expect(el.style.height).toBe("4rem");
    });

    it("draws several text lines with a shorter last one", () => {
        const { container } = render(<Skeleton lines={3} />);
        const lines = (container.firstElementChild as HTMLElement).children;
        expect(lines).toHaveLength(3);
        expect((lines[2] as HTMLElement).style.width).toBe("60%");
        expect((lines[0] as HTMLElement).style.width).toBe("");
    });
});
