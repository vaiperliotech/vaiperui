import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { Select } from "./Select";

const OPTIONS = [
    { value: "br", label: "Brasil" },
    { value: "us", label: "Estados Unidos" },
    { value: "pt", label: "Portugal", disabled: true },
];

const makePage = (start: number) =>
    Array.from({ length: 10 }, (_, i) => ({
        value: String(start + i),
        label: `Item ${start + i + 1}`,
    }));

const DETAILED_OPTIONS = [
    {
        value: "br",
        label: "Brasil",
        description: "América do Sul",
        leading: <span aria-hidden="true">🇧🇷</span>,
    },
    {
        value: "us",
        label: "Estados Unidos",
        description: "América do Norte",
        leading: <span aria-hidden="true">🇺🇸</span>,
    },
    {
        value: "pt",
        label: "Portugal",
        description: "Europa",
        leading: <span aria-hidden="true">🇵🇹</span>,
    },
];

const meta = {
    title: "Components/Select",
    component: Select,
    args: { options: OPTIONS, label: "País", placeholder: "Escolha um país" },
    argTypes: {
        variant: { control: "select", options: ["default", "detailed"] },
        variantColor: { control: "select", options: ["primary", "success", "warning", "danger"] },
        size: { control: "select", options: ["sm", "md", "lg"] },
        radius: { control: "select", options: ["none", "sm", "md", "lg", "full"] },
        animation: { control: "select", options: ["none", "smooth", "fast", "bounce"] },
        searchStyle: { control: "select", options: ["boxed", "full"] },
        customColor: { control: "color" },
    },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Colors: Story = {
    args: { label: undefined },
    render: (args) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 260 }}>
            <Select {...args} label="primary" variantColor="primary" />
            <Select {...args} label="success" variantColor="success" />
            <Select {...args} label="warning" variantColor="warning" />
            <Select {...args} label="danger" variantColor="danger" />
        </div>
    ),
};

export const Sizes: Story = {
    args: { label: undefined },
    render: (args) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 260 }}>
            <Select {...args} label="sm" size="sm" />
            <Select {...args} label="md" size="md" />
            <Select {...args} label="lg" size="lg" />
        </div>
    ),
};

export const Radius: Story = {
    args: { label: undefined },
    render: (args) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 260 }}>
            <Select {...args} label="none" radius="none" />
            <Select {...args} label="sm" radius="sm" />
            <Select {...args} label="md" radius="md" />
            <Select {...args} label="lg" radius="lg" />
            <Select {...args} label="full" radius="full" />
        </div>
    ),
};

export const Searchable: Story = {
    args: { searchable: true, searchPlaceholder: "Buscar país..." },
};

export const SearchableFull: Story = {
    args: { searchable: true, searchStyle: "full", searchPlaceholder: "Buscar país..." },
};

export const Loading: Story = {
    args: { loading: true, loadingMessage: "Carregando..." },
};

// Appends 10 more options each time the user reaches the end, until 50.
export const InfiniteScroll: Story = {
    render: (args) => {
        const [options, setOptions] = useState(() => makePage(0));
        const [loading, setLoading] = useState(false);
        return (
            <Select
                {...args}
                options={options}
                loading={loading}
                hasMore={options.length < 50}
                onReachEnd={() => {
                    setLoading(true);
                    setTimeout(() => {
                        setOptions((prev) => [...prev, ...makePage(prev.length)]);
                        setLoading(false);
                    }, 800);
                }}
            />
        );
    },
};

const COUNTRIES = ["Brasil", "Argentina", "Chile", "Colômbia", "Peru", "Uruguai", "Paraguai"];

// Fake server: filters on a timer, like a request would.
export const ServerSearch: Story = {
    render: (args) => {
        const [options, setOptions] = useState(COUNTRIES.map((label) => ({ value: label, label })));
        const [loading, setLoading] = useState(false);
        return (
            <Select
                {...args}
                searchable
                options={options}
                loading={loading}
                onSearchChange={(query) => {
                    setLoading(true);
                    setTimeout(() => {
                        setOptions(
                            COUNTRIES.filter((c) =>
                                c.toLowerCase().includes(query.toLowerCase()),
                            ).map((label) => ({ value: label, label })),
                        );
                        setLoading(false);
                    }, 600);
                }}
            />
        );
    },
};

export const Detailed: Story = {
    args: { variant: "detailed", options: DETAILED_OPTIONS, label: "Destino" },
};

export const CustomColor: Story = {
    args: { label: undefined },
    render: () => (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 260 }}>
            <Select options={OPTIONS} label="Orange" customColor="#ff6600" />
            <Select options={OPTIONS} label="Violet" customColor="#a78bfa" searchable />
            <Select
                options={OPTIONS}
                label="Light/dark"
                customColor={{ light: "#a855f7", dark: "#f472b6" }}
            />
        </div>
    ),
};

export const LeadingInDefault: Story = {
    args: {
        options: DETAILED_OPTIONS.map(({ description: _description, ...option }) => option),
        label: "Country",
    },
};

export const Localized: Story = {
    args: {
        searchable: true,
        label: "País",
        placeholder: "Escolha um país",
        searchPlaceholder: "Buscar...",
        emptyMessage: "Nenhuma opção encontrada",
        noResultsMessage: (query) => `Nenhum resultado para "${query}"`,
        clearSearchLabel: "Limpar busca",
    },
};

export const Disabled: Story = {
    args: { disabled: true },
};

export const DarkMode: Story = {
    args: { label: undefined },
    parameters: { layout: "fullscreen" },
    render: () => (
        <div className="dark flex min-h-screen items-center justify-center bg-neutral-950 p-8">
            <div className="flex w-full max-w-xs flex-col gap-4">
                <Select options={OPTIONS} label="Default" placeholder="Escolha" />
                <Select options={OPTIONS} label="Searchable" searchable />
                <Select
                    options={DETAILED_OPTIONS}
                    label="Detailed"
                    variant="detailed"
                    placeholder="Escolha"
                />
            </div>
        </div>
    ),
};
