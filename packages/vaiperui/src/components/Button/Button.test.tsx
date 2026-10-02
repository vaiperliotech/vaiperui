import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
    it("renders its children", () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    it("applies the variant and size classes", () => {
        render(
            <Button variantColor="primary" size="lg">
                Big
            </Button>,
        );
        const button = screen.getByRole("button", { name: "Big" });
        expect(button.className).toContain("bg-primary-500");
        expect(button.className).toContain("h-12");
    });

    it("forwards the disabled state", () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();
    });

    it.each([
        ["primary", "bg-primary-500"],
        ["success", "bg-success-500"],
        ["warning", "bg-warning-500"],
        ["danger", "bg-danger-500"],
    ] as const)("applies the %s variant color", (variantColor, className) => {
        render(<Button variantColor={variantColor}>Semantic</Button>);
        expect(screen.getByRole("button", { name: "Semantic" }).className).toContain(className);
    });

    it("lets className override the size typography", () => {
        render(
            <Button size="sm" className="text-base">
                Override
            </Button>,
        );
        const button = screen.getByRole("button", { name: "Override" });
        expect(button.className).toContain("text-base");
        expect(button.className).not.toContain("text-sm");
    });

    it("lets className override the variant styles", () => {
        render(<Button className="bg-danger-500">Override</Button>);
        const button = screen.getByRole("button", { name: "Override" });
        expect(button.className).toContain("bg-danger-500");
        expect(button.className).not.toContain("bg-primary-500");
    });
});
