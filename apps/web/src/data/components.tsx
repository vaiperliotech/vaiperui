import type { ReactNode } from "react";

import { Button, Input, Select } from "vaiperui";

import type { Locale } from "@/i18n/config";
import { makeT, samples, selectLabels } from "./samples";

export type PropRow = {
    prop: string;
    values: string;
    defaultValue: string;
    description: string;
};

export type ComponentEntry = {
    slug: string;
    name: string;
    blurb: string;
    usage: string;
    code: string;
    demo: ReactNode;
    props: PropRow[];
};

export const COMPONENT_SLUGS = ["button", "input", "select"] as const;

export function getComponents(locale: Locale): ComponentEntry[] {
    const t = makeT(locale);
    const s = samples[locale];
    const countries = [
        { value: "br", label: s.brazil },
        { value: "us", label: s.unitedStates },
        { value: "pt", label: s.portugal },
    ];
    const countriesCode = `    { value: "br", label: "${s.brazil}" },
    { value: "us", label: "${s.unitedStates}" },
    { value: "pt", label: "${s.portugal}" },`;
    const sizesColors = "primary | success | warning | danger";
    const radii = "none | sm | md | lg | full";
    const none = "—";

    return [
        {
            slug: "button",
            name: "Button",
            blurb: t(
                "All the native <button> props, plus variant, color, size, radius, hover and ready-made animations.",
                "Todas as props nativas de <button>, mais variante, cor, tamanho, raio, hover e animações prontas.",
                "Todas las props nativas de <button>, más variante, color, tamaño, radio, hover y animaciones listas.",
            ),
            usage: t(
                "Import from `vaiperui` and use it like a `<button>`: every native prop (`onClick`, `disabled`, `type`, `aria-*`…) keeps working. The look is controlled by the `variant`, `variantColor`, `size`, `radius`, `hover` and `animation` props.",
                "Importe de `vaiperui` e use como um `<button>`: todas as props nativas (`onClick`, `disabled`, `type`, `aria-*`…) continuam funcionando. A aparência é controlada pelas props `variant`, `variantColor`, `size`, `radius`, `hover` e `animation`.",
                "Importa desde `vaiperui` y úsalo como un `<button>`: todas las props nativas (`onClick`, `disabled`, `type`, `aria-*`…) siguen funcionando. La apariencia se controla con las props `variant`, `variantColor`, `size`, `radius`, `hover` y `animation`.",
            ),
            code: `import { Button } from "vaiperui";

<Button variantColor="primary" hover="lift">
  ${s.click}
</Button>
<Button variant="outlined2" variantColor="danger">
  ${s.remove}
</Button>`,
            demo: (
                <div className="flex flex-wrap items-center gap-3">
                    <Button variantColor="primary" hover="lift">
                        {s.click}
                    </Button>
                    <Button variant="outlined2" variantColor="danger">
                        {s.remove}
                    </Button>
                </div>
            ),
            props: [
                {
                    prop: "variant",
                    values: "solid | solid-inverse | outlined | outlined2 | transparent",
                    defaultValue: "solid",
                    description: t(
                        "solid: filled background. solid-inverse: filled background with a lighter hover. outlined: soft border and tinted hover. outlined2: strong border and filling hover. transparent: no background/border",
                        "solid: fundo cheio. solid-inverse: fundo cheio com hover mais claro. outlined: borda suave e hover de tinta. outlined2: borda forte e hover preenche. transparent: sem fundo/borda",
                        "solid: fondo lleno. solid-inverse: fondo lleno con hover más claro. outlined: borde suave y hover de tinte. outlined2: borde fuerte y hover que rellena. transparent: sin fondo ni borde",
                    ),
                },
                {
                    prop: "variantColor",
                    values: sizesColors,
                    defaultValue: "primary",
                    description: t(
                        "Semantic color of the button",
                        "Cor semântica do botão",
                        "Color semántico del botón",
                    ),
                },
                {
                    prop: "size",
                    values: "sm | md | lg",
                    defaultValue: "md",
                    description: t(
                        "Height, padding and font size",
                        "Altura, padding e tamanho de fonte",
                        "Altura, padding y tamaño de fuente",
                    ),
                },
                {
                    prop: "radius",
                    values: radii,
                    defaultValue: "md",
                    description: t(
                        "Border rounding",
                        "Arredondamento das bordas",
                        "Redondeo de los bordes",
                    ),
                },
                {
                    prop: "hover",
                    values: "none | lift | scale | glow",
                    defaultValue: "none",
                    description: t(
                        "Extra effect on mouse hover. glow uses the variant color",
                        "Efeito extra ao passar o mouse. glow usa a cor da variante",
                        "Efecto extra al pasar el mouse. glow usa el color de la variante",
                    ),
                },
                {
                    prop: "animation",
                    values: "none | float | pulse | shine | wiggle | wobble | nudge | jelly | heartbeat | jump | gradient | glow",
                    defaultValue: "none",
                    description: t(
                        "Continuous button animation; respects prefers-reduced-motion",
                        "Animação contínua do botão; respeita prefers-reduced-motion",
                        "Animación continua del botón; respeta prefers-reduced-motion",
                    ),
                },
                {
                    prop: "customColor",
                    values: "string | { light: string; dark: string }",
                    defaultValue: none,
                    description: t(
                        "Overrides variantColor with any CSS color (or a light/dark pair); hover, border and focus derive from it",
                        "Sobrescreve variantColor com qualquer cor CSS (ou um par claro/escuro); hover, borda e foco derivam dela",
                        "Sobrescribe variantColor con cualquier color CSS (o un par claro/oscuro); hover, borde y foco derivan de él",
                    ),
                },
                {
                    prop: "ripple",
                    values: "boolean",
                    defaultValue: "false",
                    description: t(
                        "Ripple effect from the click point; also triggers from the keyboard. Respects prefers-reduced-motion",
                        "Efeito de onda (ripple) a partir do ponto do clique; também dispara por teclado. Respeita prefers-reduced-motion",
                        "Efecto de onda (ripple) desde el punto del clic; también se activa con el teclado. Respeta prefers-reduced-motion",
                    ),
                },
                {
                    prop: "iconStart / iconEnd",
                    values: "ReactNode",
                    defaultValue: none,
                    description: t(
                        "Icon/content before or after the text",
                        "Ícone/conteúdo antes ou depois do texto",
                        "Icono/contenido antes o después del texto",
                    ),
                },
                {
                    prop: t("(native)", "(nativas)", "(nativas)"),
                    values: "ButtonHTMLAttributes<HTMLButtonElement>",
                    defaultValue: none,
                    description: t(
                        "onClick, disabled, type, aria-*, className (overrides styles), etc.",
                        "onClick, disabled, type, aria-*, className (sobrescreve estilos) etc.",
                        "onClick, disabled, type, aria-*, className (sobrescribe estilos), etc.",
                    ),
                },
            ],
        },
        {
            slug: "input",
            name: "Input",
            blurb: t(
                "All the native <input> props, plus the library's differentiator: Brazilian masks (cpf, cnpj, cei, cep) and global ones (phone, creditCard, cardExpiry, date, time).",
                "Todas as props nativas de <input>, mais o diferencial da lib: máscaras BR (cpf, cnpj, cei, cep) e globais (phone, creditCard, cardExpiry, date, time).",
                "Todas las props nativas de <input>, más el diferencial de la librería: máscaras de Brasil (cpf, cnpj, cei, cep) y globales (phone, creditCard, cardExpiry, date, time).",
            ),
            usage: t(
                "All the native `<input>` props, plus `mask`, which formats cpf/cnpj/cei/cep (BR) and phone/creditCard/cardExpiry/date/time (global) in real time as the user types. Focus can be a `ring` (default) or just an `outline`.",
                "Todas as props nativas de `<input>`, mais `mask`, que formata cpf/cnpj/cei/cep (BR) e phone/creditCard/cardExpiry/date/time (globais) em tempo real enquanto o usuário digita. O foco pode ser um `ring` (padrão) ou apenas um `outline`.",
                "Todas las props nativas de `<input>`, más `mask`, que formatea cpf/cnpj/cei/cep (BR) y phone/creditCard/cardExpiry/date/time (globales) en tiempo real mientras el usuario escribe. El foco puede ser un `ring` (predeterminado) o solo un `outline`.",
            ),
            code: `import { Input } from "vaiperui";

<Input label="${s.phone}" mask="phone" />
<Input
  label="${s.email}"
  placeholder="${s.emailPlaceholder}"
  errorMessage="${s.emailError}"
/>`,
            demo: (
                <div className="flex w-full max-w-sm flex-col gap-4">
                    <Input label={s.phone} mask="phone" />
                    <Input
                        label={s.email}
                        placeholder={s.emailPlaceholder}
                        errorMessage={s.emailError}
                    />
                </div>
            ),
            props: [
                {
                    prop: "variant",
                    values: "ring | outline",
                    defaultValue: "ring",
                    description: t(
                        "Focus style: ring draws a ring (box-shadow) and highlights the border; outline draws only an outline",
                        "Estilo de foco: ring desenha um anel (box-shadow) e destaca a borda; outline desenha apenas um contorno",
                        "Estilo de foco: ring dibuja un anillo (box-shadow) y resalta el borde; outline dibuja solo un contorno",
                    ),
                },
                {
                    prop: "variantColor",
                    values: sizesColors,
                    defaultValue: "primary",
                    description: t(
                        "Border/ring color on focus",
                        "Cor da borda/anel ao focar",
                        "Color del borde/anillo al enfocar",
                    ),
                },
                {
                    prop: "customColor",
                    values: t(
                        "valid CSS color | { light, dark }",
                        "cor CSS válida | { light, dark }",
                        "color CSS válido | { light, dark }",
                    ),
                    defaultValue: none,
                    description: t(
                        "Overrides variantColor: paints border and focus from a single color, or from a { light, dark } object with one color per theme",
                        "Sobrescreve variantColor: pinta borda e foco a partir de uma única cor, ou de um objeto { light, dark } com uma cor para cada tema",
                        "Sobrescribe variantColor: pinta borde y foco desde un único color, o desde un objeto { light, dark } con un color para cada tema",
                    ),
                },
                {
                    prop: "size",
                    values: "sm | md | lg",
                    defaultValue: "md",
                    description: t(
                        "Height and font size",
                        "Altura e tamanho de fonte",
                        "Altura y tamaño de fuente",
                    ),
                },
                {
                    prop: "radius",
                    values: radii,
                    defaultValue: "md",
                    description: t("Rounding", "Arredondamento", "Redondeo"),
                },
                {
                    prop: "animation",
                    values: "none | smooth | fast | bounce",
                    defaultValue: "smooth",
                    description: t(
                        "Border/focus ring transition",
                        "Transição da borda/anel de foco",
                        "Transición del borde/anillo de foco",
                    ),
                },
                {
                    prop: "label",
                    values: "string",
                    defaultValue: none,
                    description: t(
                        "Label above the field (associated with the input)",
                        "Rótulo acima do campo (associado ao input)",
                        "Etiqueta sobre el campo (asociada al input)",
                    ),
                },
                {
                    prop: "helperText",
                    values: "string",
                    defaultValue: none,
                    description: t(
                        "Help text below the field",
                        "Texto de ajuda abaixo do campo",
                        "Texto de ayuda bajo el campo",
                    ),
                },
                {
                    prop: "errorMessage",
                    values: "string",
                    defaultValue: none,
                    description: t(
                        "Its mere presence forces the error state, regardless of variantColor/customColor",
                        "Presença sozinha já força o estado de erro, independente de variantColor/customColor",
                        "Su sola presencia fuerza el estado de error, sin importar variantColor/customColor",
                    ),
                },
                {
                    prop: "leadingIcon / trailingIcon",
                    values: "ReactNode",
                    defaultValue: none,
                    description: t(
                        "Icon inside the field, on the left/right",
                        "Ícone dentro do campo, à esquerda/direita",
                        "Icono dentro del campo, a la izquierda/derecha",
                    ),
                },
                {
                    prop: "mask",
                    values: "cpf | cnpj | cei | cep | phone | creditCard | cardExpiry | date | time",
                    defaultValue: none,
                    description: t(
                        "Formats the value automatically as the user types (controlled or not); onChange emits the already-masked string",
                        "Formata o valor automaticamente enquanto o usuário digita (controlado ou não); o onChange emite a string já mascarada",
                        "Formatea el valor automáticamente mientras el usuario escribe (controlado o no); onChange emite el texto ya enmascarado",
                    ),
                },
                {
                    prop: t("(native)", "(nativas)", "(nativas)"),
                    values: "InputHTMLAttributes<HTMLInputElement>",
                    defaultValue: none,
                    description: t(
                        "value, defaultValue, onChange, placeholder, disabled, type, aria-*, className, etc.",
                        "value, defaultValue, onChange, placeholder, disabled, type, aria-*, className etc.",
                        "value, defaultValue, onChange, placeholder, disabled, type, aria-*, className, etc.",
                    ),
                },
            ],
        },
        {
            slug: "select",
            name: "Select",
            blurb: t(
                "Accessible combobox with keyboard navigation, type-to-search and a detailed style with an icon/description per option.",
                "Combobox acessível com navegação por teclado, busca por digitação e um estilo detalhado com ícone/descrição por opção.",
                "Combobox accesible con navegación por teclado, búsqueda al escribir y un estilo detallado con icono/descripción por opción.",
            ),
            usage: t(
                'Accessible combobox (`role="combobox"` + `listbox`) with keyboard navigation, typeahead and controlled or uncontrolled selection. Enable `searchable` to filter by text and `variant="detailed"` for options with `leading` and `description`.',
                'Combobox acessível (`role="combobox"` + `listbox`) com navegação por teclado, typeahead e seleção controlada ou não. Ative `searchable` para filtrar por texto e `variant="detailed"` para opções com `leading` e `description`.',
                'Combobox accesible (`role="combobox"` + `listbox`) con navegación por teclado, typeahead y selección controlada o no. Activa `searchable` para filtrar por texto y `variant="detailed"` para opciones con `leading` y `description`.',
            ),
            code: `import { Select } from "vaiperui";

<Select
  label="${s.country}"
  placeholder="${s.pickCountry}"
  searchable
  options={[
${countriesCode}
  ]}
/>`,
            demo: (
                <div className="flex w-full max-w-xs flex-col gap-4">
                    <Select
                        label={s.country}
                        placeholder={s.pickCountry}
                        options={countries}
                        {...selectLabels(locale)}
                    />
                    <Select
                        label={s.search}
                        placeholder={s.searchCountry}
                        searchable
                        options={countries}
                        {...selectLabels(locale)}
                    />
                </div>
            ),
            props: [
                {
                    prop: "options",
                    values: "SelectOption[]",
                    defaultValue: none,
                    description: t(
                        "List of options ({ value, label, disabled?, description?, leading? })",
                        "Lista de opções ({ value, label, disabled?, description?, leading? })",
                        "Lista de opciones ({ value, label, disabled?, description?, leading? })",
                    ),
                },
                {
                    prop: "value / defaultValue",
                    values: "string",
                    defaultValue: none,
                    description: t(
                        "Controlled / uncontrolled",
                        "Controlado / não controlado",
                        "Controlado / no controlado",
                    ),
                },
                {
                    prop: "onValueChange",
                    values: "(value: string) => void",
                    defaultValue: none,
                    description: t(
                        "Fired when an option is selected",
                        "Disparado ao selecionar uma opção",
                        "Se dispara al seleccionar una opción",
                    ),
                },
                {
                    prop: "placeholder",
                    values: "string",
                    defaultValue: '"Select an option"',
                    description: t(
                        "Text shown when nothing is selected",
                        "Texto quando nada está selecionado",
                        "Texto cuando no hay nada seleccionado",
                    ),
                },
                {
                    prop: "emptyMessage",
                    values: "string",
                    defaultValue: '"No options found"',
                    description: t(
                        "Text when there are no options",
                        "Texto quando não há opções",
                        "Texto cuando no hay opciones",
                    ),
                },
                {
                    prop: "noResultsMessage",
                    values: "(query: string) => string",
                    // biome-ignore lint/suspicious/noTemplateCurlyInString: documents a default value
                    defaultValue: '(query) => `No results for "${query}"`',
                    description: t(
                        "Text when a search has no matches; receives the typed query",
                        "Texto quando a busca não tem resultados; recebe o termo digitado",
                        "Texto cuando la búsqueda no tiene resultados; recibe el término escrito",
                    ),
                },
                {
                    prop: "searchable",
                    values: "boolean",
                    defaultValue: "false",
                    description: t(
                        "Shows a search field inside the menu to filter by text",
                        "Mostra um campo de busca dentro do menu para filtrar por texto",
                        "Muestra un campo de búsqueda dentro del menú para filtrar por texto",
                    ),
                },
                {
                    prop: "searchPlaceholder",
                    values: "string",
                    defaultValue: '"Search..."',
                    description: t(
                        "Search field placeholder",
                        "Placeholder do campo de busca",
                        "Placeholder del campo de búsqueda",
                    ),
                },
                {
                    prop: "clearSearchLabel",
                    values: "string",
                    defaultValue: '"Clear search"',
                    description: t(
                        "Accessible name of the button that clears the search",
                        "Nome acessível do botão que limpa a busca",
                        "Nombre accesible del botón que limpia la búsqueda",
                    ),
                },
                {
                    prop: "searchStyle",
                    values: '"boxed" | "full"',
                    defaultValue: '"boxed"',
                    description: t(
                        "`boxed`: inset, rounded field. `full`: the field spans the whole top of the menu, with a divider",
                        "`boxed`: campo recuado e arredondado. `full`: campo ocupa toda a largura do topo do menu, com divisória",
                        "`boxed`: campo con margen y redondeado. `full`: el campo ocupa todo el ancho de la parte superior del menú, con divisor",
                    ),
                },
                {
                    prop: "variant",
                    values: "default | detailed",
                    defaultValue: "default",
                    description: t(
                        "default: compact single-line dropdown. detailed: larger trigger and options, with leading and description per option and a tint on the selected one",
                        "default: dropdown compacto de uma linha. detailed: gatilho e opções maiores, com leading e description por opção e tinta na selecionada",
                        "default: dropdown compacto de una línea. detailed: botón y opciones más grandes, con leading y description por opción y tinte en la seleccionada",
                    ),
                },
                {
                    prop: "variantColor",
                    values: sizesColors,
                    defaultValue: "primary",
                    description: t(
                        "Focus color, open border and option highlight",
                        "Cor de foco, borda aberta e destaque da opção",
                        "Color de foco, borde abierto y resaltado de la opción",
                    ),
                },
                {
                    prop: "customColor",
                    values: t(
                        "valid CSS color | { light, dark }",
                        "cor CSS válida | { light, dark }",
                        "color CSS válido | { light, dark }",
                    ),
                    defaultValue: none,
                    description: t(
                        "Overrides variantColor: paints focus, border and highlight from a single color, or from a { light, dark } object",
                        "Sobrescreve variantColor: pinta foco, borda e destaque a partir de uma única cor, ou de um objeto { light, dark }",
                        "Sobrescribe variantColor: pinta foco, borde y resaltado desde un único color, o desde un objeto { light, dark }",
                    ),
                },
                {
                    prop: "size",
                    values: "sm | md | lg",
                    defaultValue: "md",
                    description: t(
                        "Height of the trigger and the options",
                        "Altura do gatilho e das opções",
                        "Altura del botón y de las opciones",
                    ),
                },
                {
                    prop: "radius",
                    values: radii,
                    defaultValue: "md",
                    description: t(
                        "Rounding of the trigger and the menu",
                        "Arredondamento do gatilho e do menu",
                        "Redondeo del botón y del menú",
                    ),
                },
                {
                    prop: "animation",
                    values: "none | smooth | fast | bounce",
                    defaultValue: "smooth",
                    description: t("Menu transition", "Transição do menu", "Transición del menú"),
                },
                {
                    prop: "disabled",
                    values: "boolean",
                    defaultValue: "false",
                    description: t(
                        "Disables the whole select",
                        "Desabilita o select inteiro",
                        "Deshabilita todo el select",
                    ),
                },
                {
                    prop: "name",
                    values: "string",
                    defaultValue: none,
                    description: t(
                        'Mirrors the value into an <input type="hidden"> for form submission',
                        'Espelha o valor num <input type="hidden"> para envio em forms',
                        'Replica el valor en un <input type="hidden"> para enviarlo en formularios',
                    ),
                },
                {
                    prop: "label / aria-label / id / className / style",
                    values: "string / string / string / string / CSSProperties",
                    defaultValue: none,
                    description: t(
                        "Label above the trigger, accessible name when there is no label, and layout props",
                        "Rótulo acima do gatilho, nome acessível quando não há rótulo e props de layout",
                        "Etiqueta sobre el botón, nombre accesible cuando no hay etiqueta y props de diseño",
                    ),
                },
                {
                    prop: "option.leading / option.description",
                    values: "ReactNode / string",
                    defaultValue: none,
                    description: t(
                        'Visual slot (flag, icon, avatar) before the text, and a second line per option. The slot works in both variants; the description only renders with variant="detailed"',
                        'Slot visual (bandeira, ícone, avatar) antes do texto e segunda linha por opção. O slot funciona nas duas variantes; a description só renderiza com variant="detailed"',
                        'Slot visual (bandera, icono, avatar) antes del texto y segunda línea por opción. El slot funciona en ambas variantes; la description solo se renderiza con variant="detailed"',
                    ),
                },
            ],
        },
    ];
}

export function getComponent(locale: Locale, slug: string) {
    return getComponents(locale).find((entry) => entry.slug === slug);
}
