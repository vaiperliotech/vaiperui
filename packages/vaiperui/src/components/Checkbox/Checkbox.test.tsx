import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
    it("toggles when the label is clicked and emits onChange", () => {
        const onChange = vi.fn();
        render(<Checkbox label="Accept" onChange={onChange} />);
        fireEvent.click(screen.getByText("Accept"));
        expect(screen.getByRole("checkbox", { name: "Accept" })).toBeChecked();
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("works controlled", () => {
        const { rerender } = render(<Checkbox label="A" checked={false} onChange={() => {}} />);
        expect(screen.getByRole("checkbox")).not.toBeChecked();
        rerender(<Checkbox label="A" checked onChange={() => {}} />);
        expect(screen.getByRole("checkbox")).toBeChecked();
    });

    it("sets the indeterminate DOM property", () => {
        render(<Checkbox label="A" indeterminate />);
        expect((screen.getByRole("checkbox") as HTMLInputElement).indeterminate).toBe(true);
    });

    it("disables the input", () => {
        render(<Checkbox label="A" disabled />);
        expect(screen.getByRole("checkbox")).toBeDisabled();
    });

    it("describes the checkbox with the error and flags aria-invalid", () => {
        render(<Checkbox label="A" helperText="Help" errorMessage="Required" />);
        const el = screen.getByRole("checkbox");
        expect(el).toHaveAttribute("aria-invalid", "true");
        expect(el).toHaveAccessibleDescription("Required");
    });

    it("forwards the ref to the input", () => {
        let node: HTMLInputElement | null = null;
        render(
            <Checkbox
                label="A"
                ref={(n) => {
                    node = n;
                }}
            />,
        );
        expect(node).toBeInstanceOf(HTMLInputElement);
    });
});
