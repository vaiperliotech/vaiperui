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

    it("applies no hover effect by default", () => {
        render(<Button>Static</Button>);
        const button = screen.getByRole("button", { name: "Static" });
        expect(button.className).not.toContain("hover:-translate-y-0.5");
        expect(button.className).not.toContain("hover:scale-105");
    });

    it.each([
        ["lift", "hover:-translate-y-0.5"],
        ["scale", "hover:scale-105"],
        ["glow", "hover:shadow-lg"],
    ] as const)("applies the %s hover effect", (hover, className) => {
        render(<Button hover={hover}>{hover}</Button>);
        expect(screen.getByRole("button", { name: hover }).className).toContain(className);
    });

    it("glows with the variant color", () => {
        render(
            <Button hover="glow" variantColor="danger">
                Delete
            </Button>,
        );
        expect(screen.getByRole("button", { name: "Delete" }).className).toContain(
            "hover:shadow-danger-500/60",
        );
    });

    it("runs no animation by default", () => {
        render(<Button>Still</Button>);
        expect(screen.getByRole("button", { name: "Still" }).className).not.toContain("animate-");
    });

    it.each([
        ["float", "motion-safe:animate-float"],
        ["pulse", "motion-safe:animate-pulse-soft"],
        ["wiggle", "motion-safe:animate-wiggle"],
        ["wobble", "motion-safe:animate-wobble"],
        ["nudge", "motion-safe:animate-nudge"],
        ["jelly", "motion-safe:animate-jelly"],
        ["heartbeat", "motion-safe:animate-heartbeat"],
        ["jump", "motion-safe:animate-jump"],
        ["glow", "motion-safe:animate-glow"],
        ["gradient", "motion-safe:animate-gradient"],
        ["shine", "motion-safe:before:animate-shine"],
    ] as const)("applies the %s animation", (animation, className) => {
        render(<Button animation={animation}>{animation}</Button>);
        expect(screen.getByRole("button", { name: animation }).className).toContain(className);
    });

    it("uses the variant color for the gradient animation", () => {
        render(
            <Button animation="gradient" variantColor="success">
                Gradient
            </Button>,
        );
        const button = screen.getByRole("button", { name: "Gradient" });
        expect(button.className).toContain("from-success-400");
        expect(button.className).toContain("via-success-500");
        expect(button.className).toContain("to-success-600");
    });

    it("uses the variant color for the glow animation", () => {
        render(
            <Button animation="glow" variantColor="danger">
                Glow
            </Button>,
        );
        expect(screen.getByRole("button", { name: "Glow" }).className).toContain(
            "[--btn-glow:var(--color-danger-500)]",
        );
    });

    it("renders no icons by default", () => {
        render(<Button>Save</Button>);
        expect(
            screen.getByRole("button", { name: "Save" }).querySelector("[data-testid]"),
        ).toBeNull();
    });

    it("renders start and end icons around the label", () => {
        render(
            <Button
                iconStart={<span data-testid="icon-start">+</span>}
                iconEnd={<span data-testid="icon-end">-</span>}
            >
                Save
            </Button>,
        );
        const button = screen.getByRole("button");
        expect(button).toContainElement(screen.getByTestId("icon-start"));
        expect(button).toContainElement(screen.getByTestId("icon-end"));
        expect(button).toHaveTextContent("+Save-");
    });
});
