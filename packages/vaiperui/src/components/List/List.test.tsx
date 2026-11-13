import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { List, ListItem } from "./List";

describe("List", () => {
    it("renders a semantic list with items", () => {
        render(
            <List>
                <ListItem title="One" />
                <ListItem title="Two" />
            </List>,
        );
        expect(screen.getAllByRole("listitem")).toHaveLength(2);
    });

    it("renders title, description, leading, trailing and children", () => {
        render(
            <List>
                <ListItem
                    title="Camila"
                    description="Designer"
                    leading={<i data-testid="lead" />}
                    trailing={<b>Active</b>}
                >
                    <p>extra</p>
                </ListItem>
            </List>,
        );
        const li = screen.getByRole("listitem");
        for (const text of ["Camila", "Designer", "Active", "extra"]) {
            expect(within(li).getByText(text)).toBeInTheDocument();
        }
        expect(screen.getByTestId("lead")).toBeInTheDocument();
    });

    it("draws dividers only when divided", () => {
        const { rerender } = render(<List data-testid="l" />);
        expect(screen.getByTestId("l")).not.toHaveClass("divide-y");
        rerender(<List data-testid="l" divided />);
        expect(screen.getByTestId("l")).toHaveClass("divide-y");
    });
});
