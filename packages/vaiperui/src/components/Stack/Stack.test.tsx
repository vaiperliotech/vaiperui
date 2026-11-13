import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Stack } from "./Stack";

describe("Stack", () => {
    it("is a vertical flex with gap 4 by default", () => {
        render(<Stack data-testid="s">x</Stack>);
        expect(screen.getByTestId("s")).toHaveClass("flex", "flex-col", "gap-4");
    });

    it("maps direction, gap, align, justify and wrap", () => {
        render(
            <Stack
                data-testid="s"
                direction="horizontal"
                gap={2}
                align="center"
                justify="between"
                wrap
            >
                x
            </Stack>,
        );
        expect(screen.getByTestId("s")).toHaveClass(
            "flex-row",
            "gap-2",
            "items-center",
            "justify-between",
            "flex-wrap",
        );
    });

    it("supports responsive direction", () => {
        render(<Stack data-testid="s" direction={{ base: "vertical", md: "horizontal" }} />);
        expect(screen.getByTestId("s")).toHaveClass("flex-col", "md:flex-row");
    });

    it("puts the divider between children only", () => {
        render(
            <Stack divider={<hr data-testid="d" />}>
                <span>a</span>
                <span>b</span>
                <span>c</span>
            </Stack>,
        );
        expect(screen.getAllByTestId("d")).toHaveLength(2);
    });

    it("renders as another element and merges className", () => {
        render(<Stack as="ul" className="gap-8 p-2" data-testid="s" />);
        const el = screen.getByTestId("s");
        expect(el.tagName).toBe("UL");
        expect(el).toHaveClass("gap-8", "p-2");
        expect(el).not.toHaveClass("gap-4");
    });
});
