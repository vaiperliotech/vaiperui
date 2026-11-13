import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Switch } from "./Switch";

describe("Switch", () => {
    it("has the switch role and toggles from the label", () => {
        const onChange = vi.fn();
        render(<Switch label="Wi-Fi" onChange={onChange} />);
        const el = screen.getByRole("switch", { name: "Wi-Fi" });
        expect(el).not.toBeChecked();
        fireEvent.click(screen.getByText("Wi-Fi"));
        expect(el).toBeChecked();
        expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("respects defaultChecked and disabled", () => {
        render(<Switch label="A" defaultChecked disabled />);
        const el = screen.getByRole("switch");
        expect(el).toBeChecked();
        expect(el).toBeDisabled();
    });

    it("describes the switch with the helper text", () => {
        render(<Switch label="A" helperText="Turn it on" />);
        expect(screen.getByRole("switch")).toHaveAccessibleDescription("Turn it on");
    });
});
