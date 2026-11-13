import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Upload } from "./Upload";

const file = (name: string, type: string) => new File(["x"], name, { type });
const input = (c: HTMLElement) => c.querySelector("input[type=file]") as HTMLInputElement;
const zone = () =>
    screen.getByText("Drag files here or click to choose").closest("label") as HTMLElement;
const names = (fn: ReturnType<typeof vi.fn>) => {
    const calls = fn.mock.calls;
    const [files] = calls[calls.length - 1] as [File[]];
    return files.map((f) => f.name);
};

describe("Upload", () => {
    it("renders a real file input labelled by the area, with the default title", () => {
        const { container } = render(<Upload aria-label="Attachments" onFilesChange={() => {}} />);
        expect(input(container)).toHaveAttribute("type", "file");
        expect(screen.getByLabelText(/Drag files here/)).toBe(input(container));
    });

    it("shows custom title and description", () => {
        render(<Upload onFilesChange={() => {}} title="Drop here" description="PDF, up to 5 MB" />);
        expect(screen.getByText("Drop here")).toBeInTheDocument();
        expect(screen.getByText("PDF, up to 5 MB")).toBeInTheDocument();
    });

    it("emits the chosen files and clears the input so the same file can be chosen again", () => {
        const onFilesChange = vi.fn();
        const { container } = render(<Upload multiple onFilesChange={onFilesChange} />);
        fireEvent.change(input(container), {
            target: { files: [file("a.pdf", "application/pdf"), file("b.png", "image/png")] },
        });
        expect(names(onFilesChange)).toEqual(["a.pdf", "b.png"]);
        expect(input(container).value).toBe("");
    });

    it("keeps only the first file without multiple", () => {
        const onFilesChange = vi.fn();
        const { container } = render(<Upload onFilesChange={onFilesChange} />);
        fireEvent.change(input(container), {
            target: { files: [file("a.pdf", ""), file("b.pdf", "")] },
        });
        expect(names(onFilesChange)).toEqual(["a.pdf"]);
    });

    it("accepts files dropped on the area, filtering by accept (extension, wildcard, exact mime)", () => {
        const onFilesChange = vi.fn();
        render(<Upload multiple accept=".pdf,image/*,text/csv" onFilesChange={onFilesChange} />);
        const files = [
            file("a.PDF", ""),
            file("b.png", "image/png"),
            file("c.csv", "text/csv"),
            file("d.exe", "application/octet-stream"),
            file("e.txt", "text/plain"),
        ];
        fireEvent.drop(zone(), { dataTransfer: { files } });
        expect(names(onFilesChange)).toEqual(["a.PDF", "b.png", "c.csv"]);
    });

    it("does not call onFilesChange when every dropped file is rejected", () => {
        const onFilesChange = vi.fn();
        render(<Upload accept=".pdf" onFilesChange={onFilesChange} />);
        fireEvent.drop(zone(), { dataTransfer: { files: [file("a.png", "image/png")] } });
        expect(onFilesChange).not.toHaveBeenCalled();
    });

    it("keeps only the first dropped file without multiple", () => {
        const onFilesChange = vi.fn();
        render(<Upload onFilesChange={onFilesChange} />);
        fireEvent.drop(zone(), { dataTransfer: { files: [file("a.pdf", ""), file("b.pdf", "")] } });
        expect(names(onFilesChange)).toEqual(["a.pdf"]);
    });

    it("marks the area while dragging over it and clears it on leave and drop", () => {
        render(<Upload onFilesChange={() => {}} />);
        fireEvent.dragEnter(zone());
        expect(zone()).toHaveAttribute("data-dragging", "true");
        fireEvent.dragLeave(zone());
        expect(zone()).not.toHaveAttribute("data-dragging");
        fireEvent.dragEnter(zone());
        fireEvent.drop(zone(), { dataTransfer: { files: [] } });
        expect(zone()).not.toHaveAttribute("data-dragging");
    });

    it("ignores drops and drags when disabled", () => {
        const onFilesChange = vi.fn();
        const { container } = render(<Upload disabled onFilesChange={onFilesChange} />);
        expect(input(container)).toBeDisabled();
        fireEvent.dragEnter(zone());
        expect(zone()).not.toHaveAttribute("data-dragging");
        fireEvent.drop(zone(), { dataTransfer: { files: [file("a.pdf", "")] } });
        expect(onFilesChange).not.toHaveBeenCalled();
    });

    it("describes the input with the error and flags aria-invalid", () => {
        const { container } = render(
            <Upload onFilesChange={() => {}} helperText="Help" errorMessage="Too big" />,
        );
        expect(input(container)).toHaveAttribute("aria-invalid", "true");
        expect(input(container)).toHaveAccessibleDescription("Too big");
        expect(screen.queryByText("Help")).not.toBeInTheDocument();
    });

    it("passes name, accept and multiple to the input and forwards the ref", () => {
        let node: HTMLInputElement | null = null;
        const { container } = render(
            <Upload
                name="docs"
                accept="image/*"
                multiple
                onFilesChange={() => {}}
                ref={(n) => {
                    node = n;
                }}
            />,
        );
        expect(input(container)).toHaveAttribute("name", "docs");
        expect(input(container)).toHaveAttribute("accept", "image/*");
        expect(input(container)).toHaveAttribute("multiple");
        expect(node).toBe(input(container));
    });
});
