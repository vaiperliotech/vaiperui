import type { ReactNode } from "react";

import { Button, Input, Select } from "vaiperui";

export type VariationItem = {
    label: string;
    node: ReactNode;
};

export type VariationGroup = {
    title: string;
    file: string;
    code: string;
    description?: string;
    items: VariationItem[];
};

const COLORS = ["primary", "success", "warning", "danger"] as const;
const SIZES = ["sm", "md", "lg"] as const;
const RADII = ["none", "sm", "md", "lg", "full"] as const;
const MASKS = ["cpf", "cnpj", "cei", "cep", "telefone"] as const;

const BUTTON_VARIANTS = ["solid", "solid-inverse", "outlined", "outlined2", "transparent"] as const;

const BUTTON_HOVERS = ["none", "lift", "scale", "glow"] as const;

const SELECT_OPTIONS = [
    { value: "br", label: "Brasil" },
    { value: "us", label: "Estados Unidos" },
    { value: "pt", label: "Portugal", disabled: true },
];

const SELECT_DETAILED_OPTIONS = [
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

const BUTTON_ANIMATIONS = [
    "float",
    "pulse",
    "shine",
    "wiggle",
    "wobble",
    "nudge",
    "jelly",
    "heartbeat",
    "jump",
    "gradient",
    "glow",
] as const;

export const variations: Record<string, VariationGroup[]> = {
    button: [
        {
            title: "Cores",
            file: "cores.tsx",
            code: `<Button variantColor="primary">Botão</Button>
<Button variantColor="success">Botão</Button>
<Button variantColor="warning">Botão</Button>
<Button variantColor="danger">Botão</Button>`,
            items: COLORS.map((color) => ({
                label: color,
                node: <Button variantColor={color}>Botão</Button>,
            })),
        },
        {
            title: "Estilos",
            file: "estilos.tsx",
            description:
                "Mesma cor (`primary`) em todos: o que muda é o preenchimento e o contorno.",
            code: `<Button variant="solid" variantColor="primary">Botão</Button>
<Button variant="solid-inverse" variantColor="primary">Botão</Button>
<Button variant="outlined" variantColor="primary">Botão</Button>
<Button variant="outlined2" variantColor="primary">Botão</Button>
<Button variant="transparent" variantColor="primary">Botão</Button>`,
            items: BUTTON_VARIANTS.map((variant) => ({
                label: variant,
                node: (
                    <Button variant={variant} variantColor="primary">
                        Botão
                    </Button>
                ),
            })),
        },
        {
            title: "Tamanhos",
            file: "tamanhos.tsx",
            code: `<Button size="sm">Botão</Button>
<Button size="md">Botão</Button>
<Button size="lg">Botão</Button>`,
            items: SIZES.map((size) => ({
                label: size,
                node: <Button size={size}>Botão</Button>,
            })),
        },
        {
            title: "Raio",
            file: "raio.tsx",
            code: `<Button radius="none">Botão</Button>
<Button radius="sm">Botão</Button>
<Button radius="md">Botão</Button>
<Button radius="lg">Botão</Button>
<Button radius="full">Botão</Button>`,
            items: RADII.map((radius) => ({
                label: radius,
                node: <Button radius={radius}>Botão</Button>,
            })),
        },
        {
            title: "Hover",
            file: "hover.tsx",
            description: "`glow` usa a cor da variante no brilho. Passe o mouse para ver.",
            code: `<Button hover="none">Botão</Button>
<Button hover="lift">Botão</Button>
<Button hover="scale">Botão</Button>
<Button hover="glow" variantColor="primary">Botão</Button>`,
            items: BUTTON_HOVERS.map((hover) => ({
                label: hover,
                node: (
                    <Button hover={hover} variantColor="primary">
                        Botão
                    </Button>
                ),
            })),
        },
        {
            title: "Animações",
            file: "animacoes.tsx",
            description: "Respeitam `prefers-reduced-motion`.",
            code: `<Button animation="float">Float</Button>
<Button animation="pulse">Pulse</Button>
<Button animation="shine">Shine</Button>
<Button animation="jelly">Jelly</Button>
<Button animation="jump">Jump</Button>
<Button animation="gradient">Gradient</Button>`,
            items: BUTTON_ANIMATIONS.map((animation) => ({
                label: animation,
                node: <Button animation={animation}>{animation}</Button>,
            })),
        },
    ],

    input: [
        {
            title: "Cores",
            file: "cores.tsx",
            code: `<Input variantColor="primary" label="Nome" placeholder="Digite seu nome" />
<Input variantColor="success" label="Nome" placeholder="Digite seu nome" />
<Input variantColor="warning" label="Nome" placeholder="Digite seu nome" />
<Input variantColor="danger" label="Nome" placeholder="Digite seu nome" />`,
            items: COLORS.map((color) => ({
                label: color,
                node: <Input variantColor={color} label="Nome" placeholder="Digite seu nome" />,
            })),
        },
        {
            title: "Foco",
            file: "foco.tsx",
            description:
                "`ring` (padrão) desenha um anel e destaca a borda; `outline` desenha apenas um contorno.",
            code: `<Input variant="ring" label="Nome" placeholder="Foco com anel" />
<Input variant="outline" label="Nome" placeholder="Foco só com outline" />`,
            items: [
                {
                    label: "ring",
                    node: <Input variant="ring" label="Nome" placeholder="Foco com anel" />,
                },
                {
                    label: "outline",
                    node: (
                        <Input variant="outline" label="Nome" placeholder="Foco só com outline" />
                    ),
                },
            ],
        },
        {
            title: "Máscaras",
            file: "mascaras.tsx",
            description:
                "O diferencial da lib: formatação automática enquanto o usuário digita, sem lib externa.",
            code: `<Input mask="cpf" label="CPF" />
<Input mask="cnpj" label="CNPJ" />
<Input mask="cei" label="CEI" />
<Input mask="cep" label="CEP" />
<Input mask="telefone" label="Telefone" />`,
            items: MASKS.map((mask) => ({
                label: mask,
                node: <Input mask={mask} label={mask} />,
            })),
        },
        {
            title: "Tamanhos",
            file: "tamanhos.tsx",
            code: `<Input size="sm" label="Nome" />
<Input size="md" label="Nome" />
<Input size="lg" label="Nome" />`,
            items: SIZES.map((size) => ({
                label: size,
                node: <Input size={size} label="Nome" />,
            })),
        },
        {
            title: "Raio",
            file: "raio.tsx",
            code: `<Input radius="none" label="Nome" />
<Input radius="sm" label="Nome" />
<Input radius="md" label="Nome" />
<Input radius="lg" label="Nome" />
<Input radius="full" label="Nome" />`,
            items: RADII.map((radius) => ({
                label: radius,
                node: <Input radius={radius} label="Nome" />,
            })),
        },
        {
            title: "Estados",
            file: "estados.tsx",
            description:
                "`helperText` adiciona ajuda; a simples presença de `errorMessage` força o estado de erro.",
            code: `<Input label="Nome" helperText="Nome completo" />
<Input label="E-mail" errorMessage="Informe um e-mail válido" />`,
            items: [
                {
                    label: "helper",
                    node: <Input label="Nome" helperText="Nome completo" />,
                },
                {
                    label: "erro",
                    node: <Input label="E-mail" errorMessage="Informe um e-mail válido" />,
                },
            ],
        },
        {
            title: "Cor personalizada",
            file: "custom-color.tsx",
            description:
                "`customColor` sobrescreve `variantColor` e pinta borda e foco a partir de uma única cor, ou de um objeto `{ light, dark }` com uma cor para cada tema.",
            code: `<Input customColor="#ff6600" label="Nome" placeholder="Digite seu nome" />
<Input customColor="#22c55e" label="Nome" placeholder="Digite seu nome" />
<Input customColor="#a78bfa" label="Nome" placeholder="Digite seu nome" />
<Input
  customColor={{ light: "#a855f7", dark: "#fde047" }}
  label="Nome"
  placeholder="Digite seu nome"
/>`,
            items: [
                {
                    label: "laranja",
                    node: (
                        <Input customColor="#ff6600" label="Nome" placeholder="Digite seu nome" />
                    ),
                },
                {
                    label: "verde",
                    node: (
                        <Input customColor="#22c55e" label="Nome" placeholder="Digite seu nome" />
                    ),
                },
                {
                    label: "violeta",
                    node: (
                        <Input customColor="#a78bfa" label="Nome" placeholder="Digite seu nome" />
                    ),
                },
                {
                    label: "light/dark",
                    node: (
                        <Input
                            customColor={{ light: "#a855f7", dark: "#fde047" }}
                            label="Nome"
                            placeholder="Digite seu nome"
                        />
                    ),
                },
            ],
        },
    ],

    select: [
        {
            title: "Cores",
            file: "cores.tsx",
            code: `<Select variantColor="primary" label="País" options={options} />
<Select variantColor="success" label="País" options={options} />
<Select variantColor="warning" label="País" options={options} />
<Select variantColor="danger" label="País" options={options} />`,
            items: COLORS.map((color) => ({
                label: color,
                node: (
                    <Select
                        variantColor={color}
                        label="País"
                        placeholder="Escolha"
                        options={SELECT_OPTIONS}
                    />
                ),
            })),
        },
        {
            title: "Estilos",
            file: "estilos.tsx",
            description:
                "`detailed` amplia o gatilho e as opções, com slot `leading` e `description` por item.",
            code: `<Select variant="default" label="País" options={options} />
<Select variant="detailed" label="País" options={options} />`,
            items: [
                {
                    label: "default",
                    node: (
                        <Select
                            variant="default"
                            label="País"
                            placeholder="Escolha"
                            options={SELECT_OPTIONS}
                        />
                    ),
                },
                {
                    label: "detailed",
                    node: (
                        <Select
                            variant="detailed"
                            label="País"
                            placeholder="Escolha"
                            options={SELECT_DETAILED_OPTIONS}
                        />
                    ),
                },
            ],
        },
        {
            title: "Tamanhos",
            file: "tamanhos.tsx",
            code: `<Select size="sm" label="País" options={options} />
<Select size="md" label="País" options={options} />
<Select size="lg" label="País" options={options} />`,
            items: SIZES.map((size) => ({
                label: size,
                node: (
                    <Select
                        size={size}
                        label="País"
                        placeholder="Escolha"
                        options={SELECT_OPTIONS}
                    />
                ),
            })),
        },
        {
            title: "Raio",
            file: "raio.tsx",
            code: `<Select radius="none" label="País" options={options} />
<Select radius="sm" label="País" options={options} />
<Select radius="md" label="País" options={options} />
<Select radius="lg" label="País" options={options} />
<Select radius="full" label="País" options={options} />`,
            items: RADII.map((radius) => ({
                label: radius,
                node: (
                    <Select
                        radius={radius}
                        label="País"
                        placeholder="Escolha"
                        options={SELECT_OPTIONS}
                    />
                ),
            })),
        },
        {
            title: "Busca",
            file: "busca.tsx",
            description: "`searchable` adiciona um campo para filtrar as opções por texto.",
            code: `<Select searchable label="País" options={options} />
<Select label="País" options={options} />`,
            items: [
                {
                    label: "searchable",
                    node: (
                        <Select
                            searchable
                            label="País"
                            placeholder="Escolha"
                            options={SELECT_OPTIONS}
                        />
                    ),
                },
                {
                    label: "sem busca",
                    node: <Select label="País" placeholder="Escolha" options={SELECT_OPTIONS} />,
                },
            ],
        },
        {
            title: "Estados",
            file: "estados.tsx",
            code: `<Select label="País" options={options} disabled />`,
            items: [
                {
                    label: "disabled",
                    node: (
                        <Select
                            disabled
                            label="País"
                            placeholder="Escolha"
                            options={SELECT_OPTIONS}
                        />
                    ),
                },
            ],
        },
        {
            title: "Cor personalizada",
            file: "custom-color.tsx",
            description:
                "`customColor` sobrescreve `variantColor` e pinta foco, borda e destaque a partir de uma única cor.",
            code: `<Select customColor="#ff6600" label="País" options={options} />
<Select customColor="#22c55e" label="País" options={options} />
<Select customColor="#a78bfa" label="País" options={options} />`,
            items: [
                {
                    label: "laranja",
                    node: (
                        <Select
                            customColor="#ff6600"
                            label="País"
                            placeholder="Escolha"
                            options={SELECT_OPTIONS}
                        />
                    ),
                },
                {
                    label: "verde",
                    node: (
                        <Select
                            customColor="#22c55e"
                            label="País"
                            placeholder="Escolha"
                            options={SELECT_OPTIONS}
                        />
                    ),
                },
                {
                    label: "violeta",
                    node: (
                        <Select
                            customColor="#a78bfa"
                            label="País"
                            placeholder="Escolha"
                            options={SELECT_OPTIONS}
                        />
                    ),
                },
            ],
        },
    ],
};
