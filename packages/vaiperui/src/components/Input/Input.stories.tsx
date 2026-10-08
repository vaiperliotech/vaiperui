import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "./Input";

const meta = {
    title: "Components/Input",
    component: Input,
    args: { "aria-label": "Input", placeholder: "Type here..." },
    argTypes: {
        variant: { control: "select", options: ["ring", "outline"] },
        variantColor: {
            control: "select",
            options: ["primary", "success", "warning", "danger"],
        },
        size: { control: "select", options: ["sm", "md", "lg"] },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
        mask: { control: "select", options: ["cpf", "cnpj", "cei", "cep", "telefone"] },
    },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = { args: { variantColor: "primary" } };

export const Success: Story = { args: { variantColor: "success" } };

export const Warning: Story = { args: { variantColor: "warning" } };

export const Danger: Story = { args: { variantColor: "danger" } };

export const FocusVariants: Story = {
    args: { "aria-label": undefined },
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
            <Input aria-label="Ring" variant="ring" placeholder="Ring (default)" />
            <Input aria-label="Outline" variant="outline" placeholder="Outline" />
        </div>
    ),
};

export const Colors: Story = {
    args: { "aria-label": undefined },
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
            <Input aria-label="Primary" variantColor="primary" placeholder="Primary" />
            <Input aria-label="Success" variantColor="success" placeholder="Success" />
            <Input aria-label="Warning" variantColor="warning" placeholder="Warning" />
            <Input aria-label="Danger" variantColor="danger" placeholder="Danger" />
        </div>
    ),
};

export const Sizes: Story = {
    args: { "aria-label": undefined },
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
            <Input aria-label="Small" size="sm" placeholder="Small" />
            <Input aria-label="Medium" size="md" placeholder="Medium" />
            <Input aria-label="Large" size="lg" placeholder="Large" />
        </div>
    ),
};

export const Radius: Story = {
    args: { "aria-label": undefined },
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
            <Input aria-label="None" radius="none" placeholder="None" />
            <Input aria-label="Small" radius="sm" placeholder="Small" />
            <Input aria-label="Medium" radius="md" placeholder="Medium" />
            <Input aria-label="Large" radius="lg" placeholder="Large" />
            <Input aria-label="Full" radius="full" placeholder="Full" />
        </div>
    ),
};

export const Animations: Story = {
    args: { "aria-label": undefined },
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
            <Input aria-label="None" animation="none" placeholder="None" />
            <Input aria-label="Smooth" animation="smooth" placeholder="Smooth" />
            <Input aria-label="Fast" animation="fast" placeholder="Fast" />
            <Input aria-label="Bounce" animation="bounce" placeholder="Bounce" />
        </div>
    ),
};

export const WithLabel: Story = {
    args: { "aria-label": undefined, label: "Email" },
};

export const HelperText: Story = {
    args: { "aria-label": undefined, label: "Email", helperText: "We never share it." },
};

export const ErrorState: Story = {
    args: { "aria-label": undefined, label: "Email", errorMessage: "Invalid email address." },
};

export const WithIcons: Story = {
    args: {
        "aria-label": undefined,
        leadingIcon: (
            <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
            </svg>
        ),
        trailingIcon: (
            <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M20 6 9 17l-5-5" />
            </svg>
        ),
        placeholder: "you@example.com",
    },
};

export const Masked: Story = {
    args: { "aria-label": undefined, label: "CPF", mask: "cpf" },
};

export const Masks: Story = {
    args: { "aria-label": undefined },
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 280 }}>
            <Input aria-label="CPF" label="CPF" mask="cpf" />
            <Input aria-label="CNPJ" label="CNPJ" mask="cnpj" />
            <Input aria-label="CEI" label="CEI" mask="cei" />
            <Input aria-label="CEP" label="CEP" mask="cep" />
            <Input aria-label="Telefone" label="Telefone" mask="telefone" />
        </div>
    ),
};

export const Disabled: Story = {
    args: { "aria-label": undefined, label: "Email", placeholder: "Disabled", disabled: true },
};

export const DarkMode: Story = {
    args: { "aria-label": undefined },
    parameters: { layout: "fullscreen" },
    render: () => (
        <div className="dark flex min-h-screen items-center justify-center bg-neutral-950 p-8">
            <div className="flex w-full max-w-sm flex-col gap-4">
                <Input label="Nome" placeholder="Digite seu nome" />
                <Input label="E-mail" helperText="Nunca compartilhamos." />
                <Input label="CPF" mask="cpf" />
                <Input label="E-mail" errorMessage="Informe um e-mail válido" />
                <Input label="Desabilitado" placeholder="Desabilitado" disabled />
            </div>
        </div>
    ),
};
