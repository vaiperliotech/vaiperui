import type { ReactNode } from "react";
import { Container, Divider, Grid, GridItem, Stack } from "vaiperui";

import type { Locale } from "@/i18n/config";
import type { ComponentEntry, PropRow } from "./components";
import { makeT } from "./samples";
import type { VariationGroup } from "./variations";

const GAPS = [0, 1, 2, 3, 4, 6, 8] as const;

function Box({ children, className = "" }: { children?: ReactNode; className?: string }) {
    return (
        <div
            className={`rounded-md bg-primary-500/15 px-3 py-2 text-center text-sm text-[var(--vpd-text)] ring-1 ring-primary-500/40 ${className}`}
        >
            {children}
        </div>
    );
}

const boxes = (n: number) =>
    [1, 2, 3, 4, 5, 6, 7, 8].slice(0, n).map((i) => <Box key={i}>{i}</Box>);

export function getLayoutComponents(locale: Locale): ComponentEntry[] {
    const t = makeT(locale);
    const none = t("none", "nenhum", "ninguno");
    const row = (
        prop: string,
        values: string,
        defaultValue: string,
        en: string,
        pt: string,
        es: string,
    ): PropRow => ({ prop, values, defaultValue, description: t(en, pt, es) });
    const asRow = row(
        "as",
        "ElementType",
        '"div"',
        "Element or component to render (`section`, `ul`, `main`...)",
        "Elemento ou componente a renderizar (`section`, `ul`, `main`...)",
        "Elemento o componente a renderizar (`section`, `ul`, `main`...)",
    );
    const gapRow = row(
        "gap",
        "0 | 1 | 2 | 3 | 4 | 6 | 8",
        "4",
        "Space between children (4px steps)",
        "Espaço entre os filhos (passos de 4px)",
        "Espacio entre los hijos (pasos de 4px)",
    );

    return [
        {
            slug: "container",
            name: "Container",
            blurb: t(
                "Centered wrapper with a max width and responsive side padding.",
                "Wrapper centralizado com largura máxima e padding lateral responsivo.",
                "Contenedor centrado con ancho máximo y padding lateral responsivo.",
            ),
            usage: t(
                "Wrap a page or a section so its content never stretches too wide. It adds 16px of side padding on mobile, 24px from `sm` and 32px from `lg`. It is presentational, so it also works in Server Components.",
                "Envolva uma página ou seção para o conteúdo nunca ficar largo demais. Ele aplica 16px de padding lateral no mobile, 24px a partir de `sm` e 32px a partir de `lg`. É apresentacional, então funciona também em Server Components.",
                "Envuelve una página o sección para que el contenido nunca quede demasiado ancho. Aplica 16px de padding lateral en móvil, 24px desde `sm` y 32px desde `lg`. Es presentacional, por lo que funciona también en Server Components.",
            ),
            accessibility: {
                notes: [
                    t(
                        "Renders a plain `<div>` by default, with no role of its own.",
                        "Renderiza um `<div>` simples por padrão, sem papel próprio.",
                        "Renderiza un `<div>` simple por defecto, sin rol propio.",
                    ),
                    t(
                        "Use `as` to give it a landmark element such as `main`, `section`, `header` or `footer`.",
                        "Use `as` para dar a ele um elemento de landmark como `main`, `section`, `header` ou `footer`.",
                        "Usa `as` para darle un elemento de landmark como `main`, `section`, `header` o `footer`.",
                    ),
                    t(
                        "It only sets width and padding: it has no focus, keyboard or ARIA behavior, and extra props such as `aria-label` go to the element.",
                        "Só define largura e padding: não tem foco, teclado nem comportamento ARIA, e props extras como `aria-label` vão para o elemento.",
                        "Solo define ancho y padding: no tiene foco, teclado ni comportamiento ARIA, y las props extra como `aria-label` van al elemento.",
                    ),
                ],
                caveats: [
                    t(
                        "A `section` only becomes a landmark when it has an accessible name: pass `aria-label` or `aria-labelledby`.",
                        "Um `section` só vira landmark quando tem nome acessível: passe `aria-label` ou `aria-labelledby`.",
                        "Un `section` solo se vuelve landmark cuando tiene nombre accesible: pasa `aria-label` o `aria-labelledby`.",
                    ),
                ],
            },
            code: `import { Container } from "vaiperui";

<Container size="md" as="main">
  <h1>Title</h1>
</Container>`,
            demo: (
                <div className="w-full rounded-lg bg-[var(--vpd-surface-muted)] py-3">
                    <Container size="sm">
                        <Box>Container sm</Box>
                    </Container>
                </div>
            ),
            props: [
                row(
                    "size",
                    "sm | md | lg | xl | full",
                    "lg",
                    "Max width: 672 / 896 / 1152 / 1280px / none",
                    "Largura máxima: 672 / 896 / 1152 / 1280px / nenhuma",
                    "Ancho máximo: 672 / 896 / 1152 / 1280px / ninguno",
                ),
                row(
                    "padded",
                    "boolean",
                    "true",
                    "Responsive side padding",
                    "Padding lateral responsivo",
                    "Padding lateral responsivo",
                ),
                asRow,
                row(
                    "className",
                    "string",
                    none,
                    "Merged with the base classes; every native prop is forwarded",
                    "Mesclado às classes base; toda prop nativa é repassada",
                    "Se combina con las clases base; toda prop nativa se reenvía",
                ),
            ],
        },
        {
            slug: "grid",
            name: "Grid",
            blurb: t(
                "CSS grid with responsive columns, gap and items that span columns or rows.",
                "CSS grid com colunas responsivas, gap e itens que ocupam colunas ou linhas.",
                "CSS grid con columnas responsivas, gap e ítems que ocupan columnas o filas.",
            ),
            usage: t(
                "`columns` takes a number (1 to 12) or an object per breakpoint (`base`, `sm`, `md`, `lg`, `xl`), mobile first: `{ base: 1, md: 2, lg: 4 }`. Use `GridItem` when a cell must span more than one column or row.",
                "`columns` aceita um número (1 a 12) ou um objeto por breakpoint (`base`, `sm`, `md`, `lg`, `xl`), mobile first: `{ base: 1, md: 2, lg: 4 }`. Use `GridItem` quando uma célula precisa ocupar mais de uma coluna ou linha.",
                "`columns` acepta un número (1 a 12) o un objeto por breakpoint (`base`, `sm`, `md`, `lg`, `xl`), mobile first: `{ base: 1, md: 2, lg: 4 }`. Usa `GridItem` cuando una celda debe ocupar más de una columna o fila.",
            ),
            accessibility: {
                notes: [
                    t(
                        "`Grid` and `GridItem` render plain `<div>`s by default, with no role; `as` changes the element (for example `ul`/`li`).",
                        "`Grid` e `GridItem` renderizam `<div>`s simples por padrão, sem papel; `as` troca o elemento (por exemplo `ul`/`li`).",
                        "`Grid` y `GridItem` renderizan `<div>` simples por defecto, sin rol; `as` cambia el elemento (por ejemplo `ul`/`li`).",
                    ),
                    t(
                        "They are purely visual: no focus, keyboard or ARIA behavior is added, and extra props reach the element.",
                        "São puramente visuais: nenhum foco, teclado ou comportamento ARIA é adicionado, e props extras chegam ao elemento.",
                        "Son puramente visuales: no se añade foco, teclado ni comportamiento ARIA, y las props extra llegan al elemento.",
                    ),
                    t(
                        "Screen readers and Tab follow DOM order, not the visual position.",
                        "Leitores de tela e Tab seguem a ordem do DOM, não a posição visual.",
                        "Los lectores de pantalla y Tab siguen el orden del DOM, no la posición visual.",
                    ),
                ],
                caveats: [
                    t(
                        "`colSpan`/`rowSpan` and responsive `columns` change the layout only; keep the source order meaningful at every breakpoint.",
                        "`colSpan`/`rowSpan` e `columns` responsivo mudam só o layout; mantenha a ordem do código fazendo sentido em todos os breakpoints.",
                        "`colSpan`/`rowSpan` y `columns` responsivo solo cambian el layout; mantén el orden del código con sentido en todos los breakpoints.",
                    ),
                    t(
                        'It adds no list semantics: use `as="ul"` and `as="li"` on `GridItem` when the items are a list.',
                        'Não adiciona semântica de lista: use `as="ul"` e `as="li"` no `GridItem` quando os itens forem uma lista.',
                        'No añade semántica de lista: usa `as="ul"` y `as="li"` en `GridItem` cuando los elementos sean una lista.',
                    ),
                ],
            },
            code: `import { Grid, GridItem } from "vaiperui";

<Grid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
  <GridItem colSpan={2}>Wide</GridItem>
  <GridItem>Item</GridItem>
</Grid>`,
            demo: (
                <Grid columns={{ base: 2, md: 4 }} className="w-full">
                    <GridItem colSpan={2}>
                        <Box>colSpan 2</Box>
                    </GridItem>
                    {boxes(6)}
                </Grid>
            ),
            props: [
                row(
                    "columns",
                    "1 – 12 | { base, sm, md, lg, xl }",
                    "1",
                    "Number of columns, or one value per breakpoint",
                    "Número de colunas, ou um valor por breakpoint",
                    "Número de columnas, o un valor por breakpoint",
                ),
                gapRow,
                asRow,
                row(
                    "GridItem colSpan / rowSpan",
                    "1 – 12 / 1 – 6",
                    none,
                    "Columns and rows the item spans",
                    "Colunas e linhas que o item ocupa",
                    "Columnas y filas que ocupa el ítem",
                ),
            ],
        },
        {
            slug: "stack",
            name: "Stack",
            blurb: t(
                "Flex layout in one direction with gap, alignment and an optional divider.",
                "Layout flex em uma direção com gap, alinhamento e divisor opcional.",
                "Layout flex en una dirección con gap, alineación y divisor opcional.",
            ),
            usage: t(
                "Lines up children vertically (default) or horizontally. `direction` can change per breakpoint: `{ base: 'vertical', md: 'horizontal' }`. `divider` is rendered between every pair of children, never before the first or after the last.",
                "Alinha os filhos na vertical (padrão) ou na horizontal. `direction` pode mudar por breakpoint: `{ base: 'vertical', md: 'horizontal' }`. `divider` é renderizado entre cada par de filhos, nunca antes do primeiro nem depois do último.",
                "Alinea los hijos en vertical (por defecto) u horizontal. `direction` puede cambiar por breakpoint: `{ base: 'vertical', md: 'horizontal' }`. `divider` se renderiza entre cada par de hijos, nunca antes del primero ni después del último.",
            ),
            accessibility: {
                notes: [
                    t(
                        "Renders a plain `<div>` (flex) by default, with no role; `as` changes the element (for example `ul`, `nav`, `section`).",
                        "Renderiza um `<div>` (flex) simples por padrão, sem papel; `as` troca o elemento (por exemplo `ul`, `nav`, `section`).",
                        "Renderiza un `<div>` (flex) simple por defecto, sin rol; `as` cambia el elemento (por ejemplo `ul`, `nav`, `section`).",
                    ),
                    t(
                        "It adds no focus, keyboard or ARIA behavior; extra props reach the element.",
                        "Não adiciona foco, teclado nem comportamento ARIA; props extras chegam ao elemento.",
                        "No añade foco, teclado ni comportamiento ARIA; las props extra llegan al elemento.",
                    ),
                    t(
                        "Responsive `direction` only changes how it looks; reading and Tab order stay the DOM order.",
                        "`direction` responsivo só muda a aparência; a ordem de leitura e de Tab continua sendo a do DOM.",
                        "`direction` responsivo solo cambia la apariencia; el orden de lectura y de Tab sigue siendo el del DOM.",
                    ),
                    t(
                        "The `divider` prop is inserted between children as given, so a `Divider` there is announced as a separator unless it is `decorative`.",
                        "A prop `divider` é inserida entre os filhos como foi passada, então um `Divider` ali é anunciado como separador, a menos que seja `decorative`.",
                        "La prop `divider` se inserta entre los hijos tal como se pasa, así que un `Divider` ahí se anuncia como separador salvo que sea `decorative`.",
                    ),
                ],
                caveats: [
                    t(
                        'With `as="ul"`, a divider between items becomes a non-`li` child of the list, which is invalid HTML.',
                        'Com `as="ul"`, um divider entre os itens vira filho do `ul` que não é `li`, o que é HTML inválido.',
                        'Con `as="ul"`, un divider entre los elementos pasa a ser un hijo del `ul` que no es `li`, lo que es HTML inválido.',
                    ),
                ],
            },
            code: `import { Divider, Stack } from "vaiperui";

<Stack direction={{ base: "vertical", md: "horizontal" }} gap={3} align="center"
  divider={<Divider orientation="vertical" />}>
  <span>One</span>
  <span>Two</span>
</Stack>`,
            demo: (
                <Stack
                    direction="horizontal"
                    align="center"
                    gap={3}
                    divider={<Divider orientation="vertical" />}
                    className="w-full"
                >
                    {boxes(3)}
                </Stack>
            ),
            props: [
                row(
                    "direction",
                    "vertical | horizontal | { base, sm, md, lg, xl }",
                    "vertical",
                    "Main axis, optionally per breakpoint",
                    "Eixo principal, opcionalmente por breakpoint",
                    "Eje principal, opcionalmente por breakpoint",
                ),
                gapRow,
                row(
                    "align",
                    "start | center | end | stretch | baseline",
                    none,
                    "Cross axis alignment (`align-items`)",
                    "Alinhamento no eixo cruzado (`align-items`)",
                    "Alineación en el eje cruzado (`align-items`)",
                ),
                row(
                    "justify",
                    "start | center | end | between | around | evenly",
                    none,
                    "Main axis distribution (`justify-content`)",
                    "Distribuição no eixo principal (`justify-content`)",
                    "Distribución en el eje principal (`justify-content`)",
                ),
                row(
                    "wrap",
                    "boolean",
                    "false",
                    "Let children flow onto a new line",
                    "Deixa os filhos quebrarem de linha",
                    "Deja que los hijos pasen a otra línea",
                ),
                row(
                    "divider",
                    "ReactNode",
                    none,
                    "Element rendered between children",
                    "Elemento renderizado entre os filhos",
                    "Elemento renderizado entre los hijos",
                ),
                asRow,
            ],
        },
        {
            slug: "divider",
            name: "Divider",
            blurb: t(
                "Horizontal or vertical separator, with optional text inside.",
                "Separador horizontal ou vertical, com texto opcional no meio.",
                "Separador horizontal o vertical, con texto opcional en el medio.",
            ),
            usage: t(
                'Renders `role="separator"` with `aria-orientation`. Screen readers announce it, so use it only where the separation means something; for pure decoration set `decorative`. A vertical divider stretches to the height of a flex parent.',
                'Renderiza `role="separator"` com `aria-orientation`. Leitores de tela o anunciam, então use só quando a separação tem significado; para decoração pura use `decorative`. Um divisor vertical estica até a altura de um pai flex.',
                'Renderiza `role="separator"` con `aria-orientation`. Los lectores de pantalla lo anuncian, así que úsalo solo cuando la separación tenga significado; para decoración pura usa `decorative`. Un divisor vertical se estira a la altura de un padre flex.',
            ),
            accessibility: {
                notes: [
                    t(
                        'Without `label` it renders an `<hr>`; with `label` it renders a `<div>`. Both get `role="separator"` and `aria-orientation` matching `orientation`.',
                        'Sem `label` renderiza um `<hr>`; com `label`, um `<div>`. Ambos recebem `role="separator"` e `aria-orientation` igual a `orientation`.',
                        'Sin `label` renderiza un `<hr>`; con `label`, un `<div>`. Ambos reciben `role="separator"` y `aria-orientation` igual a `orientation`.',
                    ),
                    t(
                        "`decorative` switches the role to `presentation` and drops `aria-orientation`, so assistive tech ignores it.",
                        "`decorative` troca o papel para `presentation` e remove `aria-orientation`, então tecnologias assistivas o ignoram.",
                        "`decorative` cambia el rol a `presentation` y quita `aria-orientation`, así que las tecnologías de asistencia lo ignoran.",
                    ),
                    t(
                        "The label text stays readable; the lines beside it are `aria-hidden`.",
                        "O texto do label continua legível; as linhas ao lado dele são `aria-hidden`.",
                        "El texto del label sigue siendo legible; las líneas a su lado son `aria-hidden`.",
                    ),
                    t(
                        "It is not focusable and has no keyboard behavior.",
                        "Não é focável e não tem comportamento de teclado.",
                        "No es enfocable y no tiene comportamiento de teclado.",
                    ),
                ],
                caveats: [
                    t(
                        "Use `decorative` when the line is only visual, so screen readers do not announce a separator between every item.",
                        "Use `decorative` quando a linha for só visual, para os leitores de tela não anunciarem um separador entre cada item.",
                        "Usa `decorative` cuando la línea sea solo visual, para que los lectores de pantalla no anuncien un separador entre cada elemento.",
                    ),
                    t(
                        "Color and `variant` are visual only: do not rely on them to convey meaning.",
                        "Cor e `variant` são só visuais: não dependa deles para transmitir significado.",
                        "El color y `variant` son solo visuales: no dependas de ellos para transmitir significado.",
                    ),
                ],
            },
            code: `import { Divider } from "vaiperui";

<Divider />
<Divider label="or" variant="dashed" spacing="md" />
<Divider orientation="vertical" customColor="#7c3aed" />`,
            demo: (
                <div className="w-full">
                    <Divider />
                    <Divider label={t("or", "ou", "o")} spacing="md" />
                    <div className="flex h-10 items-center gap-3 text-sm text-[var(--vpd-text)]">
                        A <Divider orientation="vertical" /> B
                    </div>
                </div>
            ),
            props: [
                row(
                    "orientation",
                    "horizontal | vertical",
                    "horizontal",
                    "Direction of the line",
                    "Direção da linha",
                    "Dirección de la línea",
                ),
                row(
                    "variant",
                    "solid | dashed | dotted",
                    "solid",
                    "Line style",
                    "Estilo da linha",
                    "Estilo de la línea",
                ),
                row(
                    "spacing",
                    "none | sm | md | lg",
                    "none",
                    "Margin around the line (8 / 16 / 24px)",
                    "Margem em volta da linha (8 / 16 / 24px)",
                    "Margen alrededor de la línea (8 / 16 / 24px)",
                ),
                row(
                    "color / customColor",
                    "default | strong | soft / CSS color | { light, dark }",
                    "default",
                    "Theme border token, or your own color (wins over `color`)",
                    "Token de borda do tema, ou sua própria cor (vale mais que `color`)",
                    "Token de borde del tema, o tu propio color (gana sobre `color`)",
                ),
                row(
                    "label / labelAlign",
                    "ReactNode / start | center | end",
                    "none / center",
                    "Text shown inside the line and where it sits",
                    "Texto dentro da linha e onde ele fica",
                    "Texto dentro de la línea y dónde queda",
                ),
                row(
                    "decorative",
                    "boolean",
                    "false",
                    'Uses role="presentation" instead of separator',
                    'Usa role="presentation" em vez de separator',
                    'Usa role="presentation" en lugar de separator',
                ),
            ],
        },
    ];
}

export function getLayoutVariations(locale: Locale): Record<string, VariationGroup[]> {
    const t = makeT(locale);
    return {
        container: [
            {
                title: t("Sizes", "Tamanhos", "Tamaños"),
                file: t("sizes.tsx", "tamanhos.tsx", "tamanos.tsx"),
                code: `<Container size="sm" />
<Container size="md" />
<Container size="full" padded={false} />`,
                items: (["sm", "md", "full"] as const).map((size) => ({
                    label: size,
                    node: (
                        <div className="w-[28rem] max-w-full rounded-lg bg-[var(--vpd-surface-muted)] py-2">
                            <Container size={size} padded={size !== "full"}>
                                <Box>{size}</Box>
                            </Container>
                        </div>
                    ),
                })),
            },
        ],
        grid: [
            {
                title: t("Columns", "Colunas", "Columnas"),
                file: t("columns.tsx", "colunas.tsx", "columnas.tsx"),
                code: `<Grid columns={2} />
<Grid columns={3} />
<Grid columns={{ base: 1, md: 3 }} />`,
                items: [2, 3, 4].map((n) => ({
                    label: `columns={${n}}`,
                    node: (
                        <Grid columns={n as 2 | 3 | 4} className="w-72">
                            {boxes(n * 2)}
                        </Grid>
                    ),
                })),
            },
            {
                title: "Gap",
                file: "gap.tsx",
                code: `<Grid columns={3} gap={0} />
<Grid columns={3} gap={8} />`,
                items: [0, 2, 8].map((gap) => ({
                    label: `gap={${gap}}`,
                    node: (
                        <Grid columns={3} gap={gap as 0 | 2 | 8} className="w-60">
                            {boxes(3)}
                        </Grid>
                    ),
                })),
            },
            {
                title: t("Spans", "Spans", "Spans"),
                file: "spans.tsx",
                code: `<GridItem colSpan={2} />
<GridItem rowSpan={2} />`,
                items: [
                    {
                        label: "colSpan / rowSpan",
                        node: (
                            <Grid columns={3} className="w-72">
                                <GridItem colSpan={2}>
                                    <Box>colSpan 2</Box>
                                </GridItem>
                                <GridItem rowSpan={2}>
                                    <Box className="h-full">rowSpan 2</Box>
                                </GridItem>
                                <Box>1</Box>
                                <Box>2</Box>
                            </Grid>
                        ),
                    },
                ],
            },
        ],
        stack: [
            {
                title: t("Direction", "Direção", "Dirección"),
                file: t("direction.tsx", "direcao.tsx", "direccion.tsx"),
                code: `<Stack direction="vertical" />
<Stack direction="horizontal" />`,
                items: (["vertical", "horizontal"] as const).map((direction) => ({
                    label: direction,
                    node: <Stack direction={direction}>{boxes(3)}</Stack>,
                })),
            },
            {
                title: "Gap",
                file: "gap.tsx",
                code: `<Stack direction="horizontal" gap={1} />
<Stack direction="horizontal" gap={8} />`,
                items: GAPS.filter((g) => g !== 3 && g !== 6).map((gap) => ({
                    label: `gap={${gap}}`,
                    node: (
                        <Stack direction="horizontal" gap={gap}>
                            {boxes(3)}
                        </Stack>
                    ),
                })),
            },
            {
                title: t("Align and justify", "Alinhamento e justify", "Alineación y justify"),
                file: t("align.tsx", "alinhamento.tsx", "alineacion.tsx"),
                code: `<Stack direction="horizontal" align="end" />
<Stack direction="horizontal" justify="between" />`,
                items: [
                    {
                        label: 'align="end"',
                        node: (
                            <Stack direction="horizontal" align="end" className="h-20 w-60">
                                <Box>1</Box>
                                <Box className="py-6">2</Box>
                            </Stack>
                        ),
                    },
                    {
                        label: 'justify="between"',
                        node: (
                            <Stack direction="horizontal" justify="between" className="w-60">
                                {boxes(3)}
                            </Stack>
                        ),
                    },
                ],
            },
            {
                title: "Divider",
                file: "divider.tsx",
                code: `<Stack divider={<Divider />}>...</Stack>`,
                items: [
                    {
                        label: "divider",
                        node: (
                            <Stack divider={<Divider />} className="w-48">
                                {boxes(3)}
                            </Stack>
                        ),
                    },
                ],
            },
        ],
        divider: [
            {
                title: t("Line style", "Estilo da linha", "Estilo de la línea"),
                file: "variant.tsx",
                code: `<Divider variant="solid" />
<Divider variant="dashed" />
<Divider variant="dotted" />`,
                items: (["solid", "dashed", "dotted"] as const).map((variant) => ({
                    label: variant,
                    node: (
                        <div className="w-60">
                            <Divider variant={variant} />
                        </div>
                    ),
                })),
            },
            {
                title: t("With label", "Com texto", "Con texto"),
                file: "label.tsx",
                code: `<Divider label="start" labelAlign="start" />
<Divider label="center" />
<Divider label="end" labelAlign="end" />`,
                items: (["start", "center", "end"] as const).map((labelAlign) => ({
                    label: labelAlign,
                    node: (
                        <div className="w-60">
                            <Divider label={labelAlign} labelAlign={labelAlign} />
                        </div>
                    ),
                })),
            },
            {
                title: t("Color", "Cor", "Color"),
                file: "color.tsx",
                code: `<Divider color="soft" />
<Divider color="strong" />
<Divider customColor="#7c3aed" />`,
                items: [
                    { label: "soft", node: <Divider color="soft" className="w-60" /> },
                    { label: "strong", node: <Divider color="strong" className="w-60" /> },
                    {
                        label: "customColor",
                        node: <Divider customColor="#7c3aed" className="w-60" />,
                    },
                ],
            },
            {
                title: t("Vertical", "Vertical", "Vertical"),
                file: "vertical.tsx",
                code: `<div className="flex h-8 items-center gap-3">
  A <Divider orientation="vertical" /> B
</div>`,
                items: [
                    {
                        label: "vertical",
                        node: (
                            <div className="flex h-8 items-center gap-3 text-sm text-[var(--vpd-text)]">
                                A <Divider orientation="vertical" /> B
                            </div>
                        ),
                    },
                ],
            },
        ],
    };
}
