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
            <Button variant="secondary" size="lg">
                Big
            </Button>,
        );
        const button = screen.getByRole("button", { name: "Big" });
        expect(button.className).toContain("bg-neutral-100");
        expect(button.className).toContain("h-12");
    });

    it("forwards the disabled state", () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole("button", { name: "Disabled" })).toBeDisabled();
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
        render(<Button className="bg-red-500">Override</Button>);
        const button = screen.getByRole("button", { name: "Override" });
        expect(button.className).toContain("bg-red-500");
        expect(button.className).not.toContain("bg-brand-600");
    });
});
