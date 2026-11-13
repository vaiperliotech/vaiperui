import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./Table";

const sample = (props: Parameters<typeof Table>[0] = {}) => (
    <Table {...props}>
        <TableCaption>Recent orders</TableCaption>
        <TableHeader>
            <TableRow>
                <TableHead>Order</TableHead>
                <TableHead scope="row">Total</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
                <TableCell>#1042</TableCell>
                <TableCell>$120</TableCell>
            </TableRow>
        </TableBody>
    </Table>
);

describe("Table", () => {
    it("renders native table semantics named by the caption", () => {
        render(sample());
        expect(screen.getByRole("table", { name: "Recent orders" })).toBeInTheDocument();
        expect(screen.getAllByRole("columnheader")).toHaveLength(1);
        expect(screen.getByRole("cell", { name: "#1042" })).toBeInTheDocument();
    });

    it("defaults th scope to col and allows overriding", () => {
        render(sample());
        expect(screen.getByText("Order")).toHaveAttribute("scope", "col");
        expect(screen.getByText("Total")).toHaveAttribute("scope", "row");
    });

    it("applies striped and splits wrapper/table classes", () => {
        render(sample({ striped: true, className: "tbl", wrapperClassName: "wrap" }));
        const table = screen.getByRole("table");
        expect(table).toHaveClass("tbl");
        expect(table.className).toContain("nth-child(even)");
        expect(table.parentElement).toHaveClass("wrap", "overflow-x-auto");
    });
});
