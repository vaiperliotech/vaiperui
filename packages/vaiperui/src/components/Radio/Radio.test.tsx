import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Radio } from "./Radio";
import { RadioGroup } from "./RadioGroup";

const OPTIONS = [
    { value: "a", label: "Alpha" },
    { value: "b", label: "Beta", description: "Second" },
    { value: "c", label: "Gamma", disabled: true },
];

describe("Radio", () => {
    it("selects when the label is clicked", () => {
        render(<Radio label="One" name="n" value="1" />);
        fireEvent.click(screen.getByText("One"));
        expect(screen.getByRole("radio", { name: "One" })).toBeChecked();
    });
});

describe("RadioGroup", () => {
    it("renders one radio per option sharing a name, with the legend as the group name", () => {
        render(<RadioGroup label="Letters" options={OPTIONS} />);
        expect(screen.getByRole("radiogroup", { name: "Letters" })).toBeInTheDocument();
        const radios = screen.getAllByRole("radio");
        expect(radios).toHaveLength(3);
        expect(new Set(radios.map((r) => (r as HTMLInputElement).name)).size).toBe(1);
    });

    it("works uncontrolled and emits the value", () => {
        const onValueChange = vi.fn();
        render(<RadioGroup options={OPTIONS} defaultValue="a" onValueChange={onValueChange} />);
        expect(screen.getByRole("radio", { name: "Alpha" })).toBeChecked();
        fireEvent.click(screen.getByText("Beta"));
        expect(onValueChange).toHaveBeenCalledWith("b");
        expect(screen.getByRole("radio", { name: /Beta/ })).toBeChecked();
        expect(screen.getByRole("radio", { name: "Alpha" })).not.toBeChecked();
    });

    it("works controlled: the value prop decides the selection", () => {
        const { rerender } = render(
            <RadioGroup options={OPTIONS} value="a" onValueChange={() => {}} />,
        );
        fireEvent.click(screen.getByText("Beta"));
        expect(screen.getByRole("radio", { name: "Alpha" })).toBeChecked();
        rerender(<RadioGroup options={OPTIONS} value="b" onValueChange={() => {}} />);
        expect(screen.getByRole("radio", { name: /Beta/ })).toBeChecked();
    });

    it("disables a single option and the whole group", () => {
        const { rerender } = render(<RadioGroup options={OPTIONS} />);
        expect(screen.getByRole("radio", { name: "Gamma" })).toBeDisabled();
        rerender(<RadioGroup options={OPTIONS} disabled />);
        expect(screen.getByRole("radio", { name: "Alpha" })).toBeDisabled();
    });

    it("shows the group error once and flags every radio", () => {
        render(<RadioGroup options={OPTIONS} errorMessage="Pick one" />);
        expect(screen.getAllByText("Pick one")).toHaveLength(1);
        for (const radio of screen.getAllByRole("radio")) {
            expect(radio).toHaveAttribute("aria-invalid", "true");
        }
    });
});
