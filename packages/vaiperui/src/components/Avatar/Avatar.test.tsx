import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar } from "./Avatar";

describe("Avatar", () => {
    it("exposes the name as the accessible label", () => {
        render(<Avatar name="Ada Lovelace" />);
        expect(screen.getByRole("img", { name: "Ada Lovelace" })).toBeInTheDocument();
    });

    it("shows first and last initials", () => {
        render(<Avatar name="Katherine Y. Johnson" />);
        expect(screen.getByText("KJ")).toBeInTheDocument();
    });

    it("shows one initial for a single word", () => {
        render(<Avatar name="madonna" />);
        expect(screen.getByText("M")).toBeInTheDocument();
    });

    it("renders a decorative image when src is given", () => {
        const { container } = render(<Avatar name="Yuki" src="/y.jpg" />);
        const img = container.querySelector("img");
        expect(img).toHaveAttribute("src", "/y.jpg");
        expect(img).toHaveAttribute("alt", "");
        expect(screen.queryByText("Y")).toBeNull();
    });

    it("falls back to initials when the image fails", () => {
        const { container } = render(<Avatar name="Yuki Tanaka" src="/broken.jpg" />);
        fireEvent.error(container.querySelector("img") as HTMLImageElement);
        expect(container.querySelector("img")).toBeNull();
        expect(screen.getByText("YT")).toBeInTheDocument();
    });

    it("applies size and customColor", () => {
        render(<Avatar name="A B" size="lg" customColor="#ff6600" />);
        const el = screen.getByRole("img");
        expect(el).toHaveClass("h-14");
        expect(el.style.getPropertyValue("--vpd-accent")).toBe("#ff6600");
    });
});
