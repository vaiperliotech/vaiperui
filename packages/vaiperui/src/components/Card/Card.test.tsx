import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Card, CardBody, CardFooter, CardHeader } from "./Card";

describe("Card", () => {
    it("renders children and native props", () => {
        render(
            <Card data-testid="c" aria-label="Plan">
                <h3>Pro</h3>
            </Card>,
        );
        expect(screen.getByTestId("c")).toHaveAttribute("aria-label", "Plan");
        expect(screen.getByRole("heading", { name: "Pro" })).toBeInTheDocument();
    });

    it("maps padding and radius", () => {
        const { rerender } = render(<Card data-testid="c" />);
        expect(screen.getByTestId("c")).toHaveClass("p-4", "rounded-lg");
        rerender(<Card data-testid="c" padding="lg" radius="none" />);
        expect(screen.getByTestId("c")).toHaveClass("p-6", "rounded-none");
        rerender(<Card data-testid="c" padding="none" />);
        expect(screen.getByTestId("c")).toHaveClass("p-0");
    });

    it("renders header, body and footer sections", () => {
        render(
            <Card>
                <CardHeader>Title</CardHeader>
                <CardBody>Body</CardBody>
                <CardFooter className="extra">Footer</CardFooter>
            </Card>,
        );
        expect(screen.getByText("Title")).toBeInTheDocument();
        expect(screen.getByText("Body")).toBeInTheDocument();
        expect(screen.getByText("Footer")).toHaveClass("extra");
    });
});
