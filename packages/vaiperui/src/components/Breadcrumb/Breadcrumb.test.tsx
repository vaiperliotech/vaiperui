import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Breadcrumb, BreadcrumbItem } from "./Breadcrumb";
import type { BreadcrumbProps } from "./types";

function setup(props: BreadcrumbProps = {}) {
    return render(
        <Breadcrumb {...props}>
            <BreadcrumbItem href="/">Home</BreadcrumbItem>
            <BreadcrumbItem href="/a">A</BreadcrumbItem>
            <BreadcrumbItem href="/b">B</BreadcrumbItem>
            <BreadcrumbItem href="/c">C</BreadcrumbItem>
            <BreadcrumbItem current>Page</BreadcrumbItem>
        </Breadcrumb>,
    );
}

describe("Breadcrumb", () => {
    it("renders a nav with an ordered list and the current page", () => {
        setup();
        expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
        expect(screen.getAllByRole("listitem")).toHaveLength(5);
        expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
        const current = screen.getByText("Page");
        expect(current).toHaveAttribute("aria-current", "page");
        expect(current.closest("a")).toBeNull();
    });

    it("draws a hidden separator after every item but the last", () => {
        const { container } = setup({ separator: ">" });
        const seps = container.querySelectorAll('[aria-hidden="true"]');
        expect(seps).toHaveLength(4);
        expect(seps[0]).toHaveTextContent(">");
    });

    it("overrides the nav label", () => {
        setup({ "aria-label": "Trail" });
        expect(screen.getByRole("navigation", { name: "Trail" })).toBeInTheDocument();
    });

    it("collapses long trails behind an ellipsis button and expands on click", () => {
        setup({ maxItems: 3, expandLabel: "Show path" });
        expect(screen.getAllByRole("listitem")).toHaveLength(4);
        expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
        expect(screen.queryByRole("link", { name: "A" })).toBeNull();
        expect(screen.getByRole("link", { name: "C" })).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", { name: "Show path" }));
        expect(screen.getAllByRole("listitem")).toHaveLength(5);
        expect(screen.getByRole("link", { name: "A" })).toBeInTheDocument();
    });

    it("does not collapse when within maxItems", () => {
        setup({ maxItems: 5 });
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("uses the child as the link with asChild", () => {
        render(
            <Breadcrumb>
                <BreadcrumbItem asChild>
                    <a href="/router" className="custom">
                        Routed
                    </a>
                </BreadcrumbItem>
                <BreadcrumbItem current>Here</BreadcrumbItem>
            </Breadcrumb>,
        );
        const link = screen.getByRole("link", { name: "Routed" });
        expect(link).toHaveClass("custom");
        expect(link.querySelector("a")).toBeNull();
    });

    it("renders an item without href as plain text", () => {
        render(
            <Breadcrumb>
                <BreadcrumbItem>Plain</BreadcrumbItem>
            </Breadcrumb>,
        );
        expect(screen.queryByRole("link")).toBeNull();
    });
});
