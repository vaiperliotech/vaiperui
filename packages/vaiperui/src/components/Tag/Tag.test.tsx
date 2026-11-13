import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Tag } from "./Tag";

describe("Tag", () => {
    it("renders without a button by default", () => {
        render(<Tag>Design</Tag>);
        expect(screen.getByText("Design")).toBeInTheDocument();
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("renders a labelled remove button that calls onDismiss", () => {
        const onDismiss = vi.fn();
        render(
            <Tag onDismiss={onDismiss} dismissLabel="Remove React">
                React
            </Tag>,
        );
        fireEvent.click(screen.getByRole("button", { name: "Remove React" }));
        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it("uses 'Remove' as the default label", () => {
        render(<Tag onDismiss={() => {}}>A</Tag>);
        expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
    });

    it("supports outline, color and customColor", () => {
        const { rerender } = render(
            <Tag variant="outline" variantColor="success">
                A
            </Tag>,
        );
        expect(screen.getByText("A").className).toContain("bg-transparent");
        expect(screen.getByText("A").className).toContain("success-500");
        rerender(<Tag customColor="#ff6600">A</Tag>);
        expect(screen.getByText("A").style.getPropertyValue("--vpd-accent")).toBe("#ff6600");
    });
});
