import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Container } from "./Container";

describe("Container", () => {
    it("centers with the default size and padding", () => {
        render(<Container data-testid="c">x</Container>);
        const el = screen.getByTestId("c");
        expect(el.tagName).toBe("DIV");
        expect(el).toHaveClass("mx-auto", "w-full", "max-w-6xl", "px-4");
    });

    it("maps size and removes padding", () => {
        render(
            <Container data-testid="c" size="sm" padded={false}>
                x
            </Container>,
        );
        const el = screen.getByTestId("c");
        expect(el).toHaveClass("max-w-2xl");
        expect(el).not.toHaveClass("px-4");
    });

    it("renders as another element and merges className", () => {
        render(
            <Container as="main" className="bg-red-500" data-testid="c">
                x
            </Container>,
        );
        const el = screen.getByTestId("c");
        expect(el.tagName).toBe("MAIN");
        expect(el).toHaveClass("bg-red-500", "mx-auto");
    });
});
