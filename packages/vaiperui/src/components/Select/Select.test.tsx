import { fireEvent, render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { Select } from "./Select";

beforeAll(() => {
    Element.prototype.scrollIntoView = vi.fn();
});

const OPTIONS = [
    { value: "br", label: "Brasil" },
    { value: "us", label: "Estados Unidos" },
    { value: "pt", label: "Portugal", disabled: true },
];

describe("Select", () => {
    it("shows the placeholder when nothing is selected", () => {
        render(<Select options={OPTIONS} placeholder="Escolha" />);
        expect(screen.getByRole("combobox")).toHaveTextContent("Escolha");
    });

    it("shows the selected option label for a controlled value", () => {
        render(<Select options={OPTIONS} value="br" onValueChange={() => {}} />);
        expect(screen.getByRole("combobox")).toHaveTextContent("Brasil");
    });

    it("opens the listbox on click", () => {
        render(<Select options={OPTIONS} />);
        fireEvent.click(screen.getByRole("combobox"));
        expect(screen.getByRole("listbox")).toBeInTheDocument();
        expect(screen.getAllByRole("option")).toHaveLength(3);
    });

    it("selects an option and emits the value", () => {
        const onValueChange = vi.fn();
        render(<Select options={OPTIONS} onValueChange={onValueChange} />);
        fireEvent.click(screen.getByRole("combobox"));
        fireEvent.click(screen.getByRole("option", { name: "Brasil" }));
        expect(onValueChange).toHaveBeenCalledWith("br");
        expect(screen.getByRole("combobox")).toHaveTextContent("Brasil");
    });

    it("does not select a disabled option", () => {
        const onValueChange = vi.fn();
        render(<Select options={OPTIONS} onValueChange={onValueChange} />);
        fireEvent.click(screen.getByRole("combobox"));
        fireEvent.click(screen.getByRole("option", { name: "Portugal" }));
        expect(onValueChange).not.toHaveBeenCalled();
    });

    it("opens with the keyboard and selects the active option with Enter", () => {
        const onValueChange = vi.fn();
        render(<Select options={OPTIONS} onValueChange={onValueChange} />);
        const trigger = screen.getByRole("combobox");
        fireEvent.keyDown(trigger, { key: "ArrowDown" });
        expect(screen.getByRole("listbox")).toBeInTheDocument();
        fireEvent.keyDown(trigger, { key: "Enter" });
        expect(onValueChange).toHaveBeenCalledWith("br");
    });

    it("filters options when searchable", () => {
        render(<Select options={OPTIONS} searchable />);
        fireEvent.click(screen.getByRole("combobox"));
        fireEvent.change(screen.getByPlaceholderText("Search..."), {
            target: { value: "Bra" },
        });
        expect(screen.getAllByRole("option")).toHaveLength(1);
        expect(screen.getByRole("option")).toHaveTextContent("Brasil");
    });

    it("shows the empty message when nothing matches", () => {
        render(<Select options={OPTIONS} searchable emptyMessage="Nada aqui" />);
        fireEvent.click(screen.getByRole("combobox"));
        fireEvent.change(screen.getByPlaceholderText("Search..."), {
            target: { value: "zzz" },
        });
        expect(screen.queryByRole("option")).toBeNull();
        expect(screen.getByText('No results for "zzz"')).toBeInTheDocument();
    });

    it("does not open when disabled", () => {
        render(<Select options={OPTIONS} disabled />);
        fireEvent.click(screen.getByRole("combobox"));
        expect(screen.queryByRole("listbox")).toBeNull();
    });

    it("associates the label with the combobox", () => {
        render(<Select options={OPTIONS} label="País" />);
        expect(screen.getByLabelText("País")).toHaveAttribute("role", "combobox");
    });

    it("mirrors the value into a hidden input when named", () => {
        const { container } = render(
            <Select options={OPTIONS} value="br" name="country" onValueChange={() => {}} />,
        );
        expect(container.querySelector('input[type="hidden"]')).toHaveValue("br");
    });
});
