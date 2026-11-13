import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Pagination } from "./Pagination";

// Ellipsis items are aria-hidden, so read the DOM instead of the accessibility tree.
const labels = () =>
    Array.from(document.querySelectorAll("li"))
        .slice(1, -1)
        .map((li) => li.textContent);

describe("Pagination", () => {
    it("is a nav with a named list of buttons and marks the current page", () => {
        render(<Pagination page={2} pageCount={5} onPageChange={() => {}} />);
        expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute(
            "aria-current",
            "page",
        );
        expect(screen.getByRole("button", { name: "Page 3" })).not.toHaveAttribute("aria-current");
        expect(labels()).toEqual(["1", "2", "3", "4", "5"]);
    });

    it("emits the chosen page, previous and next", () => {
        const onPageChange = vi.fn();
        render(<Pagination page={3} pageCount={5} onPageChange={onPageChange} />);
        fireEvent.click(screen.getByRole("button", { name: "Page 5" }));
        expect(onPageChange).toHaveBeenLastCalledWith(5);
        fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
        expect(onPageChange).toHaveBeenLastCalledWith(2);
        fireEvent.click(screen.getByRole("button", { name: "Next page" }));
        expect(onPageChange).toHaveBeenLastCalledWith(4);
        fireEvent.click(screen.getByRole("button", { name: "Page 3" }));
        expect(onPageChange).toHaveBeenCalledTimes(3);
    });

    it("disables previous on the first page and next on the last", () => {
        const { rerender } = render(<Pagination page={1} pageCount={3} onPageChange={() => {}} />);
        expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();
        expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
        rerender(<Pagination page={3} pageCount={3} onPageChange={() => {}} />);
        expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    });

    it("keeps a constant number of items with ellipses on long ranges", () => {
        const { rerender } = render(<Pagination page={1} pageCount={20} onPageChange={() => {}} />);
        expect(labels()).toEqual(["1", "2", "3", "4", "5", "…", "20"]);
        rerender(<Pagination page={10} pageCount={20} onPageChange={() => {}} />);
        expect(labels()).toEqual(["1", "…", "9", "10", "11", "…", "20"]);
        rerender(<Pagination page={20} pageCount={20} onPageChange={() => {}} />);
        expect(labels()).toEqual(["1", "…", "16", "17", "18", "19", "20"]);
        rerender(<Pagination page={4} pageCount={20} onPageChange={() => {}} />);
        expect(labels()).toHaveLength(7);
    });

    it("hides ellipses from screen readers", () => {
        render(<Pagination page={10} pageCount={20} onPageChange={() => {}} />);
        expect(screen.getAllByText("…")).toHaveLength(2);
        for (const dots of screen.getAllByText("…"))
            expect(dots).toHaveAttribute("aria-hidden", "true");
    });

    it("honors siblingCount", () => {
        render(<Pagination page={10} pageCount={30} siblingCount={2} onPageChange={() => {}} />);
        expect(labels()).toEqual(["1", "…", "8", "9", "10", "11", "12", "…", "30"]);
    });

    it("overrides every built-in label", () => {
        render(
            <Pagination
                page={2}
                pageCount={3}
                onPageChange={() => {}}
                aria-label="Paginação"
                previousLabel="Anterior"
                nextLabel="Próxima"
                pageLabel={(n) => `Página ${n}`}
            />,
        );
        expect(screen.getByRole("navigation", { name: "Paginação" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Anterior" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Próxima" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Página 1" })).toBeInTheDocument();
    });

    it("disables everything when disabled", () => {
        render(<Pagination page={2} pageCount={3} onPageChange={() => {}} disabled />);
        for (const button of screen.getAllByRole("button")) expect(button).toBeDisabled();
    });
});
