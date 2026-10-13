import type { ReactNode } from "react";

import { Button, Input, Select } from "vaiperui";

import type { Locale } from "@/i18n/config";
import { makeT, samples, selectLabels } from "./samples";

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
const MASKS = [
    "cpf",
    "cnpj",
    "cei",
    "cep",
    "phone",
    "creditCard",
    "cardExpiry",
    "date",
    "time",
] as const;

const BUTTON_VARIANTS = ["solid", "solid-inverse", "outlined", "outlined2", "transparent"] as const;

const BUTTON_HOVERS = ["none", "lift", "scale", "glow"] as const;

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

export function getVariations(locale: Locale): Record<string, VariationGroup[]> {
    const t = makeT(locale);
    const s = samples[locale];

    const colorsFile = t("colors.tsx", "cores.tsx", "colores.tsx");
    const stylesFile = t("styles.tsx", "estilos.tsx", "estilos.tsx");
    const sizesFile = t("sizes.tsx", "tamanhos.tsx", "tamanos.tsx");
    const radiusFile = t("radius.tsx", "raio.tsx", "radio.tsx");
    const statesFile = t("states.tsx", "estados.tsx", "estados.tsx");

    const colorsTitle = t("Colors", "Cores", "Colores");
    const stylesTitle = t("Styles", "Estilos", "Estilos");
    const sizesTitle = t("Sizes", "Tamanhos", "Tamaños");
    const radiusTitle = t("Radius", "Raio", "Radio");
    const statesTitle = t("States", "Estados", "Estados");
    const customColorTitle = t("Custom color", "Cor personalizada", "Color personalizado");

    const countries = [
        { value: "br", label: s.brazil },
        { value: "us", label: s.unitedStates },
        { value: "pt", label: s.portugal },
    ];
    const detailedCountries = [
        {
            value: "br",
            label: s.brazil,
            description: s.southAmerica,
            leading: <span aria-hidden="true">🇧🇷</span>,
        },
        {
            value: "us",
            label: s.unitedStates,
            description: s.northAmerica,
            leading: <span aria-hidden="true">🇺🇸</span>,
        },
        {
            value: "pt",
            label: s.portugal,
            description: s.europe,
            leading: <span aria-hidden="true">🇵🇹</span>,
        },
    ];
    const countrySelect = (props: Record<string, unknown> = {}) => (
        <Select
            label={s.country}
            placeholder={s.pick}
            options={countries}
            {...selectLabels(locale)}
            {...props}
        />
    );

    return {
        button: [
            {
                title: colorsTitle,
                file: colorsFile,
                code: `<Button variantColor="primary">${s.button}</Button>
<Button variantColor="success">${s.button}</Button>
<Button variantColor="warning">${s.button}</Button>
<Button variantColor="danger">${s.button}</Button>`,
                items: COLORS.map((color) => ({
                    label: color,
                    node: <Button variantColor={color}>{s.button}</Button>,
                })),
            },
            {
                title: stylesTitle,
                file: stylesFile,
                description: t(
                    "Same color (`primary`) on all of them: what changes is the fill and the outline.",
                    "Mesma cor (`primary`) em todos: o que muda é o preenchimento e o contorno.",
                    "El mismo color (`primary`) en todos: lo que cambia es el relleno y el contorno.",
                ),
                code: `<Button variant="solid" variantColor="primary">${s.button}</Button>
<Button variant="solid-inverse" variantColor="primary">${s.button}</Button>
<Button variant="outlined" variantColor="primary">${s.button}</Button>
<Button variant="outlined2" variantColor="primary">${s.button}</Button>
<Button variant="transparent" variantColor="primary">${s.button}</Button>`,
                items: BUTTON_VARIANTS.map((variant) => ({
                    label: variant,
                    node: (
                        <Button variant={variant} variantColor="primary">
                            {s.button}
                        </Button>
                    ),
                })),
            },
            {
                title: sizesTitle,
                file: sizesFile,
                code: `<Button size="sm">${s.button}</Button>
<Button size="md">${s.button}</Button>
<Button size="lg">${s.button}</Button>`,
                items: SIZES.map((size) => ({
                    label: size,
                    node: <Button size={size}>{s.button}</Button>,
                })),
            },
            {
                title: radiusTitle,
                file: radiusFile,
                code: `<Button radius="none">${s.button}</Button>
<Button radius="sm">${s.button}</Button>
<Button radius="md">${s.button}</Button>
<Button radius="lg">${s.button}</Button>
<Button radius="full">${s.button}</Button>`,
                items: RADII.map((radius) => ({
                    label: radius,
                    node: <Button radius={radius}>{s.button}</Button>,
                })),
            },
            {
                title: "Hover",
                file: "hover.tsx",
                description: t(
                    "`glow` uses the variant color for the glow. Hover to see it.",
                    "`glow` usa a cor da variante no brilho. Passe o mouse para ver.",
                    "`glow` usa el color de la variante en el brillo. Pasa el mouse para verlo.",
                ),
                code: `<Button hover="none">${s.button}</Button>
<Button hover="lift">${s.button}</Button>
<Button hover="scale">${s.button}</Button>
<Button hover="glow" variantColor="primary">${s.button}</Button>`,
                items: BUTTON_HOVERS.map((hover) => ({
                    label: hover,
                    node: (
                        <Button hover={hover} variantColor="primary">
                            {s.button}
                        </Button>
                    ),
                })),
            },
            {
                title: t("Animations", "Animações", "Animaciones"),
                file: t("animations.tsx", "animacoes.tsx", "animaciones.tsx"),
                description: t(
                    "They respect `prefers-reduced-motion`.",
                    "Respeitam `prefers-reduced-motion`.",
                    "Respetan `prefers-reduced-motion`.",
                ),
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
            {
                title: customColorTitle,
                file: "custom-color.tsx",
                description: t(
                    "`customColor` overrides `variantColor` with a single color, or a `{ light, dark }` object with one color per theme.",
                    "`customColor` sobrescreve `variantColor` com uma única cor, ou um objeto `{ light, dark }` com uma cor para cada tema.",
                    "`customColor` sobrescribe `variantColor` con un único color, o un objeto `{ light, dark }` con un color para cada tema.",
                ),
                code: `<Button customColor="#ff6600">${s.orange}</Button>
<Button customColor="#a78bfa" variant="outlined">${s.violet}</Button>
<Button customColor={{ light: "#a855f7", dark: "#f472b6" }}>Light/dark</Button>`,
                items: [
                    {
                        label: s.orange.toLowerCase(),
                        node: <Button customColor="#ff6600">{s.orange}</Button>,
                    },
                    {
                        label: s.violet.toLowerCase(),
                        node: (
                            <Button customColor="#a78bfa" variant="outlined">
                                {s.violet}
                            </Button>
                        ),
                    },
                    {
                        label: "light/dark",
                        node: (
                            <Button customColor={{ light: "#a855f7", dark: "#f472b6" }}>
                                Light/dark
                            </Button>
                        ),
                    },
                ],
            },
            {
                title: "Ripple",
                file: "ripple.tsx",
                description: t(
                    "`ripple` creates a wave from the click point. It uses the button's text color.",
                    "`ripple` cria uma onda a partir do ponto do clique. Usa a cor do texto do botão.",
                    "`ripple` crea una onda desde el punto del clic. Usa el color del texto del botón.",
                ),
                code: `<Button ripple>Solid</Button>
<Button ripple variant="outlined">Outlined</Button>
<Button ripple variant="transparent" variantColor="success">Transparent</Button>`,
                items: [
                    { label: "solid", node: <Button ripple>{s.click}</Button> },
                    {
                        label: "outlined",
                        node: (
                            <Button ripple variant="outlined">
                                {s.click}
                            </Button>
                        ),
                    },
                    {
                        label: "transparent",
                        node: (
                            <Button ripple variant="transparent" variantColor="success">
                                {s.click}
                            </Button>
                        ),
                    },
                ],
            },
        ],

        input: [
            {
                title: colorsTitle,
                file: colorsFile,
                code: COLORS.map(
                    (color) =>
                        `<Input variantColor="${color}" label="${s.name}" placeholder="${s.yourName}" />`,
                ).join("\n"),
                items: COLORS.map((color) => ({
                    label: color,
                    node: <Input variantColor={color} label={s.name} placeholder={s.yourName} />,
                })),
            },
            {
                title: t("Focus", "Foco", "Foco"),
                file: t("focus.tsx", "foco.tsx", "foco.tsx"),
                description: t(
                    "`ring` (default) draws a ring and highlights the border; `outline` draws only an outline.",
                    "`ring` (padrão) desenha um anel e destaca a borda; `outline` desenha apenas um contorno.",
                    "`ring` (predeterminado) dibuja un anillo y resalta el borde; `outline` dibuja solo un contorno.",
                ),
                code: `<Input variant="ring" label="${s.name}" placeholder="${s.ringFocus}" />
<Input variant="outline" label="${s.name}" placeholder="${s.outlineFocus}" />`,
                items: [
                    {
                        label: "ring",
                        node: <Input variant="ring" label={s.name} placeholder={s.ringFocus} />,
                    },
                    {
                        label: "outline",
                        node: (
                            <Input variant="outline" label={s.name} placeholder={s.outlineFocus} />
                        ),
                    },
                ],
            },
            {
                title: t("Masks", "Máscaras", "Máscaras"),
                file: t("masks.tsx", "mascaras.tsx", "mascaras.tsx"),
                description: t(
                    "The library's differentiator: automatic formatting as the user types, with no external lib.",
                    "O diferencial da lib: formatação automática enquanto o usuário digita, sem lib externa.",
                    "El diferencial de la librería: formato automático mientras el usuario escribe, sin librerías externas.",
                ),
                code: `<Input mask="cpf" label="CPF" />
<Input mask="cnpj" label="CNPJ" />
<Input mask="cei" label="CEI" />
<Input mask="cep" label="${s.zip}" />
<Input mask="phone" label="${s.phone}" />
<Input mask="creditCard" label="${s.creditCard}" />
<Input mask="cardExpiry" label="${s.expiry}" />
<Input mask="date" label="${s.date}" />
<Input mask="time" label="${s.time}" />`,
                items: MASKS.map((mask) => ({
                    label: mask,
                    node: <Input mask={mask} label={mask} />,
                })),
            },
            {
                title: sizesTitle,
                file: sizesFile,
                code: `<Input size="sm" label="${s.name}" />
<Input size="md" label="${s.name}" />
<Input size="lg" label="${s.name}" />`,
                items: SIZES.map((size) => ({
                    label: size,
                    node: <Input size={size} label={s.name} />,
                })),
            },
            {
                title: radiusTitle,
                file: radiusFile,
                code: RADII.map((radius) => `<Input radius="${radius}" label="${s.name}" />`).join(
                    "\n",
                ),
                items: RADII.map((radius) => ({
                    label: radius,
                    node: <Input radius={radius} label={s.name} />,
                })),
            },
            {
                title: statesTitle,
                file: statesFile,
                description: t(
                    "`helperText` adds help; the mere presence of `errorMessage` forces the error state.",
                    "`helperText` adiciona ajuda; a simples presença de `errorMessage` força o estado de erro.",
                    "`helperText` agrega ayuda; la sola presencia de `errorMessage` fuerza el estado de error.",
                ),
                code: `<Input label="${s.name}" helperText="${s.fullName}" />
<Input label="${s.email}" errorMessage="${s.emailError}" />`,
                items: [
                    {
                        label: s.helperItem,
                        node: <Input label={s.name} helperText={s.fullName} />,
                    },
                    {
                        label: s.errorItem,
                        node: <Input label={s.email} errorMessage={s.emailError} />,
                    },
                ],
            },
            {
                title: customColorTitle,
                file: "custom-color.tsx",
                description: t(
                    "`customColor` overrides `variantColor` and paints border and focus from a single color, or a `{ light, dark }` object with one color per theme.",
                    "`customColor` sobrescreve `variantColor` e pinta borda e foco a partir de uma única cor, ou de um objeto `{ light, dark }` com uma cor para cada tema.",
                    "`customColor` sobrescribe `variantColor` y pinta borde y foco desde un único color, o un objeto `{ light, dark }` con un color para cada tema.",
                ),
                code: `<Input customColor="#ff6600" label="${s.name}" placeholder="${s.yourName}" />
<Input customColor="#22c55e" label="${s.name}" placeholder="${s.yourName}" />
<Input customColor="#a78bfa" label="${s.name}" placeholder="${s.yourName}" />
<Input
  customColor={{ light: "#a855f7", dark: "#fde047" }}
  label="${s.name}"
  placeholder="${s.yourName}"
/>`,
                items: [
                    ["#ff6600", s.orange],
                    ["#22c55e", s.green],
                    ["#a78bfa", s.violet],
                ]
                    .map(([color, name]) => ({
                        label: (name as string).toLowerCase(),
                        node: (
                            <Input
                                customColor={color as string}
                                label={s.name}
                                placeholder={s.yourName}
                            />
                        ),
                    }))
                    .concat([
                        {
                            label: "light/dark",
                            node: (
                                <Input
                                    customColor={{ light: "#a855f7", dark: "#fde047" }}
                                    label={s.name}
                                    placeholder={s.yourName}
                                />
                            ),
                        },
                    ]),
            },
        ],

        select: [
            {
                title: colorsTitle,
                file: colorsFile,
                code: COLORS.map(
                    (color) =>
                        `<Select variantColor="${color}" label="${s.country}" options={options} />`,
                ).join("\n"),
                items: COLORS.map((color) => ({
                    label: color,
                    node: countrySelect({ variantColor: color }),
                })),
            },
            {
                title: stylesTitle,
                file: stylesFile,
                description: t(
                    "`detailed` enlarges the trigger and the options, with a `leading` slot and a `description` per item.",
                    "`detailed` amplia o gatilho e as opções, com slot `leading` e `description` por item.",
                    "`detailed` amplía el botón y las opciones, con slot `leading` y `description` por ítem.",
                ),
                code: `<Select variant="default" label="${s.country}" options={options} />
<Select variant="detailed" label="${s.country}" options={options} />`,
                items: [
                    { label: "default", node: countrySelect({ variant: "default" }) },
                    {
                        label: "detailed",
                        node: countrySelect({ variant: "detailed", options: detailedCountries }),
                    },
                ],
            },
            {
                title: sizesTitle,
                file: sizesFile,
                code: SIZES.map(
                    (size) => `<Select size="${size}" label="${s.country}" options={options} />`,
                ).join("\n"),
                items: SIZES.map((size) => ({ label: size, node: countrySelect({ size }) })),
            },
            {
                title: radiusTitle,
                file: radiusFile,
                code: RADII.map(
                    (radius) =>
                        `<Select radius="${radius}" label="${s.country}" options={options} />`,
                ).join("\n"),
                items: RADII.map((radius) => ({
                    label: radius,
                    node: countrySelect({ radius }),
                })),
            },
            {
                title: t("Search", "Busca", "Búsqueda"),
                file: t("search.tsx", "busca.tsx", "busqueda.tsx"),
                description: t(
                    "`searchable` adds a field to filter the options by text.",
                    "`searchable` adiciona um campo para filtrar as opções por texto.",
                    "`searchable` agrega un campo para filtrar las opciones por texto.",
                ),
                code: `<Select searchable label="${s.country}" options={options} />
<Select searchable searchStyle="full" label="${s.country}" options={options} />
<Select label="${s.country}" options={options} />`,
                items: [
                    { label: "searchable", node: countrySelect({ searchable: true }) },
                    {
                        label: "searchStyle full",
                        node: countrySelect({ searchable: true, searchStyle: "full" }),
                    },
                    { label: s.noSearch, node: countrySelect() },
                ],
            },
            {
                title: statesTitle,
                file: statesFile,
                description: t(
                    "`disabled` blocks the whole select. An option with `disabled: true` appears blocked and cannot be chosen.",
                    "`disabled` bloqueia o select inteiro. Uma opção com `disabled: true` aparece bloqueada e não pode ser escolhida.",
                    "`disabled` bloquea todo el select. Una opción con `disabled: true` aparece bloqueada y no se puede elegir.",
                ),
                code: `<Select label="${s.country}" options={options} disabled />

const options = [
  { value: "br", label: "${s.brazil}" },
  { value: "pt", label: "${s.portugal}", disabled: true },
]`,
                items: [
                    {
                        label: s.disabledOption,
                        node: countrySelect({
                            options: [
                                { value: "br", label: s.brazil },
                                { value: "us", label: s.unitedStates },
                                { value: "pt", label: s.portugal, disabled: true },
                            ],
                        }),
                    },
                    { label: "disabled", node: countrySelect({ disabled: true }) },
                ],
            },
            {
                title: customColorTitle,
                file: "custom-color.tsx",
                description: t(
                    "`customColor` overrides `variantColor` and paints focus, border and highlight from a single color.",
                    "`customColor` sobrescreve `variantColor` e pinta foco, borda e destaque a partir de uma única cor.",
                    "`customColor` sobrescribe `variantColor` y pinta foco, borde y resaltado desde un único color.",
                ),
                code: `<Select customColor="#ff6600" label="${s.country}" options={options} />
<Select customColor="#22c55e" label="${s.country}" options={options} />
<Select customColor="#a78bfa" label="${s.country}" options={options} />`,
                items: [
                    ["#ff6600", s.orange],
                    ["#22c55e", s.green],
                    ["#a78bfa", s.violet],
                ].map(([color, name]) => ({
                    label: (name as string).toLowerCase(),
                    node: countrySelect({ customColor: color }),
                })),
            },
        ],
    };
}

export type Variations = ReturnType<typeof getVariations>;
