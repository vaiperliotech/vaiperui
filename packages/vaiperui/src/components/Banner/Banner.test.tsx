import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Banner } from "./Banner";

describe("Banner", () => {
    it("renders the message with the status role", () => {
        render(<Banner>Maintenance tonight</Banner>);
        expect(screen.getByRole("status")).toHaveTextContent("Maintenance tonight");
    });

    it("uses role alert for danger", () => {
        render(<Banner variantColor="danger">Down</Banner>);
        expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("renders the action and a dismiss button with a custom label", () => {
        const onDismiss = vi.fn();
        render(
            <Banner
                action={<a href="/x">Release notes</a>}
                onDismiss={onDismiss}
                dismissLabel="Close"
            >
                x
            </Banner>,
        );
        expect(screen.getByRole("link", { name: "Release notes" })).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Close" }));
        expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it("has no close button without onDismiss and can hide the icon", () => {
        const { container } = render(<Banner icon={false}>x</Banner>);
        expect(screen.queryByRole("button")).toBeNull();
        expect(container.querySelector("svg")).toBeNull();
    });
});
