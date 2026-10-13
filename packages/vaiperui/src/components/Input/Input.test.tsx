import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Input } from "./Input";

describe("Input", () => {
    it("renders an input", () => {
        render(<Input aria-label="Email" />);
        expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
    });

    it("associates the label with the input", () => {
        render(<Input label="Email" />);
        expect(screen.getByLabelText("Email")).toBeInstanceOf(HTMLInputElement);
    });

    it("applies the size classes", () => {
        render(<Input aria-label="Big" size="lg" />);
        expect(screen.getByRole("textbox", { name: "Big" }).className).toContain("h-12");
    });

    it("applies the default md radius", () => {
        render(<Input aria-label="Radius" />);
        expect(screen.getByRole("textbox", { name: "Radius" }).className).toContain("rounded-md");
    });

    it.each([
        ["none", "rounded-none"],
        ["sm", "rounded-sm"],
        ["md", "rounded-md"],
        ["lg", "rounded-lg"],
        ["full", "rounded-full"],
    ] as const)("applies the %s radius", (radius, className) => {
        render(<Input aria-label={radius} radius={radius} />);
        expect(screen.getByRole("textbox", { name: radius }).className).toContain(className);
    });

    it.each([
        ["primary", "focus:border-primary-500"],
        ["success", "focus:border-success-500"],
        ["warning", "focus:border-warning-500"],
        ["danger", "focus:border-danger-500"],
    ] as const)("applies the %s variant color", (variantColor, className) => {
        render(<Input aria-label="Color" variantColor={variantColor} />);
        expect(screen.getByRole("textbox", { name: "Color" }).className).toContain(className);
    });

    it("uses the themeable surface tokens", () => {
        render(<Input aria-label="Dark" />);
        const input = screen.getByRole("textbox", { name: "Dark" });
        expect(input.className).toContain("bg-[var(--vpd-surface)]");
        expect(input.className).toContain("text-[var(--vpd-text)]");
        expect(input.className).toContain("border-[var(--vpd-border)]");
    });

    it("adds dark mode styles to the error message", () => {
        render(<Input aria-label="Dark error" errorMessage="Required" />);
        expect(screen.getByText("Required").className).toContain("dark:text-danger-400");
    });

    it("draws a ring on focus by default", () => {
        render(<Input aria-label="Ring" />);
        const input = screen.getByRole("textbox", { name: "Ring" });
        expect(input.className).toContain("focus:ring-4");
        expect(input.className).not.toContain("focus:outline-2");
    });

    it("draws an outline on focus with the outline variant", () => {
        render(<Input aria-label="Outline" variant="outline" />);
        const input = screen.getByRole("textbox", { name: "Outline" });
        expect(input.className).toContain("outline-2");
        expect(input.className).toContain("focus:outline-primary-500");
        expect(input.className).not.toContain("focus:ring-4");
    });

    it("draws a danger outline on error with the outline variant", () => {
        render(<Input aria-label="Outline error" variant="outline" errorMessage="Required" />);
        const input = screen.getByRole("textbox", { name: "Outline error" });
        expect(input.className).toContain("border-danger-500");
        expect(input.className).toContain("focus:outline-danger-500");
        expect(input.className).not.toContain("focus:ring-4");
    });

    it("styles the error state and marks the field invalid", () => {
        render(<Input aria-label="Error" errorMessage="Required" />);
        const input = screen.getByRole("textbox", { name: "Error" });
        expect(input.className).toContain("border-danger-500");
        expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("links the error message through aria-describedby", () => {
        render(<Input aria-label="Error" errorMessage="Required" />);
        const input = screen.getByRole("textbox", { name: "Error" });
        expect(input).toHaveAttribute("aria-describedby", `${input.id}-error`);
        expect(screen.getByText("Required")).toHaveAttribute("id", `${input.id}-error`);
    });

    it("links the helper text through aria-describedby", () => {
        render(<Input aria-label="Helper" helperText="We never share it" />);
        const input = screen.getByRole("textbox", { name: "Helper" });
        expect(input).toHaveAttribute("aria-describedby", `${input.id}-helper`);
        expect(screen.getByText("We never share it")).toHaveAttribute("id", `${input.id}-helper`);
    });

    it("forwards the disabled state", () => {
        render(<Input aria-label="Disabled" disabled />);
        expect(screen.getByRole("textbox", { name: "Disabled" })).toBeDisabled();
    });

    it("applies no animation when set to none", () => {
        render(<Input aria-label="Still" animation="none" />);
        expect(screen.getByRole("textbox", { name: "Still" }).className).not.toContain(
            "transition-",
        );
    });

    it.each([
        ["smooth", "duration-300"],
        ["fast", "duration-100"],
        ["bounce", "ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]"],
    ] as const)("applies the %s animation", (animation, className) => {
        render(<Input aria-label={animation} animation={animation} />);
        expect(screen.getByRole("textbox", { name: animation }).className).toContain(className);
    });

    it("renders leading and trailing icons", () => {
        render(
            <Input
                aria-label="Icons"
                leadingIcon={<span data-testid="icon-start">@</span>}
                trailingIcon={<span data-testid="icon-end">x</span>}
            />,
        );
        expect(screen.getByTestId("icon-start")).toBeInTheDocument();
        expect(screen.getByTestId("icon-end")).toBeInTheDocument();
    });

    it("renders no icons by default", () => {
        render(<Input aria-label="Plain" />);
        expect(
            screen
                .getByRole("textbox", { name: "Plain" })
                .parentElement?.querySelector("[data-testid]"),
        ).toBeNull();
    });

    it("lets className override the radius", () => {
        render(<Input aria-label="Override" className="rounded-full" />);
        const input = screen.getByRole("textbox", { name: "Override" });
        expect(input.className).toContain("rounded-full");
        expect(input.className).not.toContain("rounded-md");
    });

    it("uses the mask placeholder and numeric input mode", () => {
        render(<Input aria-label="CPF" mask="cpf" />);
        const input = screen.getByRole("textbox", { name: "CPF" });
        expect(input).toHaveAttribute("placeholder", "000.000.000-00");
        expect(input).toHaveAttribute("inputmode", "numeric");
    });

    it.each([
        ["cpf", "12345678901", "123.456.789-01"],
        ["cnpj", "12345678000199", "12.345.678/0001-99"],
        ["cei", "123456789012", "12.345.67890/12"],
        ["cep", "12345678", "12345-678"],
        ["phone", "5511987654321", "+55 (11) 98765-4321"],
        ["phone", "551134567890", "+55 (11) 3456-7890"],
        ["phone", "14155552671", "+1 (415) 555-2671"],
        ["phone", "442079460958", "+442 079 460 958"],
        ["creditCard", "4111111111111111", "4111 1111 1111 1111"],
        ["cardExpiry", "1228", "12/28"],
        ["date", "31122025", "31/12/2025"],
        ["time", "2359", "23:59"],
    ] as const)("formats %s as the user types", (mask, typed, expected) => {
        render(<Input aria-label="Masked" mask={mask} />);
        const input = screen.getByRole("textbox", { name: "Masked" });
        fireEvent.change(input, { target: { value: typed } });
        expect(input).toHaveValue(expected);
    });

    it.each([
        ["+55 (11) ", "+55 (11"],
        ["+1 (415) ", "+1 (415"],
        ["+55 (", "+55"],
    ])("lets the user backspace over the separator in the phone mask (%s)", (typed, expected) => {
        render(<Input aria-label="Phone" mask="phone" />);
        const input = screen.getByRole("textbox", { name: "Phone" });
        fireEvent.change(input, { target: { value: typed } });
        expect(input).toHaveValue(expected);
    });

    it("strips non-digits and caps the value at the mask digit limit", () => {
        render(<Input aria-label="CPF" mask="cpf" />);
        const input = screen.getByRole("textbox", { name: "CPF" });
        fireEvent.change(input, { target: { value: "abc123456789012345" } });
        expect(input).toHaveValue("123.456.789-01");
    });

    it("emits the masked value through onChange", () => {
        const onChange = vi.fn();
        render(<Input aria-label="CPF" mask="cpf" onChange={onChange} />);
        const input = screen.getByRole("textbox", { name: "CPF" });
        fireEvent.change(input, { target: { value: "12345678901" } });
        expect(onChange).toHaveBeenCalledTimes(1);
        expect(onChange).toHaveBeenCalledWith(
            expect.objectContaining({
                target: expect.objectContaining({ value: "123.456.789-01" }),
            }),
        );
    });

    it("formats a controlled mask value", () => {
        render(<Input aria-label="CPF" mask="cpf" value="12345678901" onChange={() => {}} />);
        expect(screen.getByRole("textbox", { name: "CPF" })).toHaveValue("123.456.789-01");
    });

    it("applies customColor accent variables and focus styles", () => {
        render(<Input aria-label="Custom" customColor="#a78bfa" />);
        const input = screen.getByRole("textbox", { name: "Custom" });
        expect(input.className).toContain("focus:border-[var(--vpd-accent)]");
        expect(input.style.getPropertyValue("--vpd-accent")).toBe("#a78bfa");
    });
});
