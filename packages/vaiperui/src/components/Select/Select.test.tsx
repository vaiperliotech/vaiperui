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

    it("localizes the no-results message and the clear-search label", () => {
        render(
            <Select
                options={OPTIONS}
                searchable
                searchPlaceholder="Buscar..."
                noResultsMessage={(query) => `Nada para "${query}"`}
                clearSearchLabel="Limpar busca"
            />,
        );
        fireEvent.click(screen.getByRole("combobox"));
        fireEvent.change(screen.getByPlaceholderText("Buscar..."), {
            target: { value: "zzz" },
        });
        expect(screen.getByText('Nada para "zzz"')).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Limpar busca" })).toBeInTheDocument();
    });

    it("renders the leading slot beside the label in the default variant", () => {
        render(
            <Select
                options={[{ value: "br", label: "Brasil", leading: <i data-testid="flag" /> }]}
                defaultValue="br"
            />,
        );
        expect(screen.getAllByTestId("flag")).toHaveLength(1);
        fireEvent.click(screen.getByRole("combobox"));
        expect(screen.getAllByTestId("flag")).toHaveLength(2);
    });

    it("names the combobox through aria-label", () => {
        render(<Select options={OPTIONS} aria-label="Language" />);
        expect(screen.getByRole("combobox", { name: "Language" })).toBeInTheDocument();
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

    it("shows a loading row after the options and marks the list busy", () => {
        render(<Select options={OPTIONS} loading loadingMessage="Carregando..." />);
        fireEvent.click(screen.getByRole("combobox"));
        expect(screen.getAllByRole("option")).toHaveLength(3);
        expect(screen.getByText("Carregando...")).toBeInTheDocument();
        expect(screen.getByRole("listbox")).toHaveAttribute("aria-busy", "true");
    });

    it("shows loading instead of the empty message when there are no options yet", () => {
        render(<Select options={[]} loading />);
        fireEvent.click(screen.getByRole("combobox"));
        expect(screen.getByText("Loading...")).toBeInTheDocument();
        expect(screen.queryByText("No options found")).not.toBeInTheDocument();
    });

    it("calls onReachEnd near the end of the list, but not while loading", () => {
        const onReachEnd = vi.fn();
        const { rerender } = render(<Select options={OPTIONS} onReachEnd={onReachEnd} />);
        fireEvent.click(screen.getByRole("combobox"));
        const list = screen.getByRole("listbox");
        // jsdom has no layout: fake a scrolled-to-bottom list.
        Object.defineProperty(list, "scrollHeight", { value: 300, configurable: true });
        Object.defineProperty(list, "clientHeight", { value: 240, configurable: true });
        Object.defineProperty(list, "scrollTop", { value: 60, configurable: true });
        fireEvent.scroll(list);
        expect(onReachEnd).toHaveBeenCalledTimes(1);
        rerender(<Select options={OPTIONS} onReachEnd={onReachEnd} loading />);
        fireEvent.scroll(screen.getByRole("listbox"));
        expect(onReachEnd).toHaveBeenCalledTimes(1);
    });

    it("asks for more options while they do not fill the menu, until hasMore is false", () => {
        const onReachEnd = vi.fn();
        const spy = vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(240);
        const spy2 = vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(100);
        const { rerender } = render(<Select options={OPTIONS} onReachEnd={onReachEnd} />);
        fireEvent.click(screen.getByRole("combobox"));
        expect(onReachEnd).toHaveBeenCalledTimes(1);
        rerender(<Select options={OPTIONS} onReachEnd={onReachEnd} hasMore={false} />);
        rerender(
            <Select
                options={[...OPTIONS, { value: "x", label: "X" }]}
                onReachEnd={onReachEnd}
                hasMore={false}
            />,
        );
        expect(onReachEnd).toHaveBeenCalledTimes(1);
        spy.mockRestore();
        spy2.mockRestore();
    });

    it("onSearchChange turns off the local filter and reports the query", () => {
        const onSearchChange = vi.fn();
        render(<Select options={OPTIONS} searchable onSearchChange={onSearchChange} />);
        fireEvent.click(screen.getByRole("combobox"));
        fireEvent.change(screen.getByRole("textbox"), { target: { value: "zzz" } });
        expect(onSearchChange).toHaveBeenCalledWith("zzz");
        expect(screen.getAllByRole("option")).toHaveLength(3);
    });

    it("keeps the selected label when a server search removes it from options", () => {
        const { rerender } = render(<Select options={OPTIONS} defaultValue="br" />);
        rerender(<Select options={[{ value: "us", label: "Estados Unidos" }]} defaultValue="br" />);
        expect(screen.getByRole("combobox")).toHaveTextContent("Brasil");
    });
});
