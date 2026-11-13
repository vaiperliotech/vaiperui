import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Alert } from "./Alert";

describe("Alert", () => {
    it("renders title and description with the polite status role by default", () => {
        render(<Alert title="Saved">All good</Alert>);
        const el = screen.getByRole("status");
        expect(el).toHaveTextContent("Saved");
        expect(el).toHaveTextContent("All good");
    });

    it("uses role alert for warning and danger, and allows overriding it", () => {
        const { rerender } = render(<Alert variantColor="danger">x</Alert>);
        expect(screen.getByRole("alert")).toBeInTheDocument();
        rerender(<Alert variantColor="warning">x</Alert>);
        expect(screen.getByRole("alert")).toBeInTheDocument();
        rerender(
            <Alert variantColor="danger" role="status">
                x
            </Alert>,
        );
        expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("shows the close button only with onDismiss, with an overridable label", () => {
        const onDismiss = vi.fn();
        const { rerender } = render(<Alert>x</Alert>);
        expect(screen.queryByRole("button")).toBeNull();
        rerender(<Alert onDismiss={onDismiss}>x</Alert>);
        fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
        expect(onDismiss).toHaveBeenCalledTimes(1);
        rerender(
            <Alert onDismiss={onDismiss} dismissLabel="Fechar">
                x
            </Alert>,
        );
        expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument();
    });

    it("renders the action slot, the icon and hides the icon with false", () => {
        const { container, rerender } = render(<Alert action={<a href="/x">More</a>}>x</Alert>);
        expect(screen.getByRole("link", { name: "More" })).toBeInTheDocument();
        expect(container.querySelector("svg")).not.toBeNull();
        rerender(<Alert icon={false}>x</Alert>);
        expect(container.querySelector("svg")).toBeNull();
        rerender(<Alert icon={<i data-testid="mine" />}>x</Alert>);
        expect(screen.getByTestId("mine")).toBeInTheDocument();
    });

    it("sets the accent vars with customColor", () => {
        render(<Alert customColor="#ff0000">x</Alert>);
        expect(screen.getByRole("status").style.getPropertyValue("--vpd-accent")).toBe("#ff0000");
    });
});
