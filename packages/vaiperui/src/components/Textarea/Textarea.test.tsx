import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Textarea } from "./Textarea";

describe("Textarea", () => {
    it("associates the label with the textarea", () => {
        render(<Textarea label="Bio" />);
        expect(screen.getByLabelText("Bio").tagName).toBe("TEXTAREA");
    });

    it("emits onChange and works uncontrolled", () => {
        const onChange = vi.fn();
        render(<Textarea aria-label="Bio" onChange={onChange} />);
        const el = screen.getByRole("textbox", { name: "Bio" });
        fireEvent.change(el, { target: { value: "hello" } });
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(el).toHaveValue("hello");
    });

    it("shows the error instead of the helper and flags aria-invalid", () => {
        render(<Textarea aria-label="Bio" helperText="Help" errorMessage="Too short" />);
        const el = screen.getByRole("textbox", { name: "Bio" });
        expect(screen.getByText("Too short")).toBeInTheDocument();
        expect(screen.queryByText("Help")).not.toBeInTheDocument();
        expect(el).toHaveAttribute("aria-invalid", "true");
        expect(el).toHaveAccessibleDescription("Too short");
    });

    it("defaults to 3 rows and vertical resize", () => {
        render(<Textarea aria-label="Bio" />);
        const el = screen.getByRole("textbox", { name: "Bio" });
        expect(el).toHaveAttribute("rows", "3");
        expect(el.className).toContain("resize-y");
    });
});
