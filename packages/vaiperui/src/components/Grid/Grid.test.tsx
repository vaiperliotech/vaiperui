import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Grid, GridItem } from "./Grid";

describe("Grid", () => {
    it("has one column and gap 4 by default", () => {
        render(<Grid data-testid="g" />);
        expect(screen.getByTestId("g")).toHaveClass("grid", "grid-cols-1", "gap-4");
    });

    it("maps a number of columns and gap", () => {
        render(<Grid data-testid="g" columns={3} gap={8} />);
        expect(screen.getByTestId("g")).toHaveClass("grid-cols-3", "gap-8");
    });

    it("supports responsive columns", () => {
        render(<Grid data-testid="g" columns={{ base: 1, md: 2, lg: 4 }} />);
        expect(screen.getByTestId("g")).toHaveClass(
            "grid-cols-1",
            "md:grid-cols-2",
            "lg:grid-cols-4",
        );
    });

    it("renders as another element and merges className", () => {
        render(<Grid as="section" className="p-2" data-testid="g" />);
        const el = screen.getByTestId("g");
        expect(el.tagName).toBe("SECTION");
        expect(el).toHaveClass("p-2", "grid");
    });

    it("GridItem spans columns and rows", () => {
        render(<GridItem data-testid="i" colSpan={2} rowSpan={3} className="x" />);
        expect(screen.getByTestId("i")).toHaveClass("col-span-2", "row-span-3", "x");
    });
});
