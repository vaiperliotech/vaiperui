import type { ReactNode } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    SegmentedControl,
    SegmentedItem,
    Step,
    Stepper,
    Tab,
    TabList,
    TabPanel,
    Tabs,
} from "vaiperui";

import { PaginationDemo, StepperDemo } from "@/components/NavigationDemos";
import type { Locale } from "@/i18n/config";
import type { ComponentEntry, PropRow } from "./components";
import { makeT } from "./samples";
import type { VariationGroup } from "./variations";

// Built by concatenation so it is not read as a template placeholder.
const nToken = "$" + "{n}";
const COLORS = ["primary", "success", "warning", "danger"] as const;
const SIZES = ["sm", "md", "lg"] as const;
const RADII = ["none", "sm", "md", "lg", "full"] as const;

export function getNavigationComponents(locale: Locale): ComponentEntry[] {
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

    const styleRows = (radius: boolean, animation = true): PropRow[] => [
        row(
            "variantColor",
            "primary | success | warning | danger",
            "primary",
            "Accent color of the active state and focus ring",
            "Cor de destaque do estado ativo e do anel de foco",
            "Color de acento del estado activo y del anillo de foco",
        ),
        row(
            "customColor",
            "string | { light, dark }",
            none,
            "Any CSS color (or a pair per theme). Overrides variantColor",
            "Qualquer cor CSS (ou um par por tema). Substitui o variantColor",
            "Cualquier color CSS (o un par por tema). Reemplaza a variantColor",
        ),
        row(
            "size",
            "sm | md | lg",
            "md",
            "Size of the control and its text",
            "Tamanho do controle e do texto",
            "Tamaño del control y del texto",
        ),
        ...(radius
            ? [
                  row(
                      "radius",
                      "none | sm | md | lg | full",
                      "md",
                      "Corner rounding",
                      "Arredondamento dos cantos",
                      "Redondeo de las esquinas",
                  ),
              ]
            : []),
        ...(animation
            ? [
                  row(
                      "animation",
                      "none | smooth | fast | bounce",
                      "smooth",
                      "Transition between states",
                      "Transição entre estados",
                      "Transición entre estados",
                  ),
              ]
            : []),
    ];

    const sections = [
        t("General", "Geral", "General"),
        t("Account", "Conta", "Cuenta"),
        t("Billing", "Faturas", "Facturas"),
    ];
    const pageLabels = {
        nav: t("Pagination", "Paginação", "Paginación"),
        previous: t("Previous page", "Página anterior", "Página anterior"),
        next: t("Next page", "Próxima página", "Página siguiente"),
        page: t("Page {n}", "Página {n}", "Página {n}"),
    };
    const stepNames = [
        t("Account", "Conta", "Cuenta"),
        t("Address", "Endereço", "Dirección"),
        t("Payment", "Pagamento", "Pago"),
    ];

    return [
        {
            slug: "tabs",
            name: "Tabs",
            blurb: t(
                "Switch between distinct sections of content, following the WAI-ARIA tabs pattern.",
                "Alterne entre seções distintas de conteúdo, seguindo o padrão de abas da WAI-ARIA.",
                "Alterna entre secciones distintas de contenido, siguiendo el patrón de pestañas de WAI-ARIA.",
            ),
            usage: t(
                'Compose `Tabs` with a `TabList` of `Tab`s and one `TabPanel` per tab; a tab and a panel are paired by `value`. Works uncontrolled (`defaultValue`) or controlled (`value` + `onValueChange`). Arrow keys, Home and End move between tabs and skip disabled ones; use `activation="manual"` to require Enter or Space.',
                'Componha `Tabs` com um `TabList` de `Tab`s e um `TabPanel` por aba; aba e painel são ligados pelo `value`. Funciona não controlado (`defaultValue`) ou controlado (`value` + `onValueChange`). Setas, Home e End movem entre as abas e ignoram as desabilitadas; use `activation="manual"` para exigir Enter ou Espaço.',
                'Compón `Tabs` con un `TabList` de `Tab`s y un `TabPanel` por pestaña; pestaña y panel se enlazan por `value`. Funciona no controlado (`defaultValue`) o controlado (`value` + `onValueChange`). Las flechas, Home y End se mueven entre pestañas y omiten las deshabilitadas; usa `activation="manual"` para exigir Enter o Espacio.',
            ),
            code: `import { Tab, TabList, TabPanel, Tabs } from "vaiperui";

<Tabs defaultValue="general">
  <TabList aria-label="${t("Settings", "Configurações", "Ajustes")}">
    <Tab value="general">${sections[0]}</Tab>
    <Tab value="account">${sections[1]}</Tab>
    <Tab value="billing" disabled>${sections[2]}</Tab>
  </TabList>
  <TabPanel value="general">${t("General preferences.", "Preferências gerais.", "Preferencias generales.")}</TabPanel>
  <TabPanel value="account">${t("Account details.", "Dados da conta.", "Datos de la cuenta.")}</TabPanel>
</Tabs>`,
            demo: (
                <Tabs defaultValue="general" className="w-full max-w-md">
                    <TabList aria-label={t("Settings", "Configurações", "Ajustes")}>
                        <Tab value="general">{sections[0]}</Tab>
                        <Tab value="account">{sections[1]}</Tab>
                        <Tab value="billing" disabled>
                            {sections[2]}
                        </Tab>
                    </TabList>
                    <TabPanel value="general">
                        {t(
                            "General preferences.",
                            "Preferências gerais.",
                            "Preferencias generales.",
                        )}
                    </TabPanel>
                    <TabPanel value="account">
                        {t("Account details.", "Dados da conta.", "Datos de la cuenta.")}
                    </TabPanel>
                </Tabs>
            ),
            props: [
                row(
                    "value",
                    "string",
                    none,
                    "Active tab (controlled)",
                    "Aba ativa (controlado)",
                    "Pestaña activa (controlado)",
                ),
                row(
                    "defaultValue",
                    "string",
                    none,
                    "Initial active tab (uncontrolled)",
                    "Aba ativa inicial (não controlado)",
                    "Pestaña activa inicial (no controlado)",
                ),
                row(
                    "onValueChange",
                    "(value: string) => void",
                    none,
                    "Called when the active tab changes",
                    "Chamado quando a aba ativa muda",
                    "Se llama cuando cambia la pestaña activa",
                ),
                row(
                    "orientation",
                    "horizontal | vertical",
                    "horizontal",
                    "Direction of the tab list and of the arrow keys",
                    "Direção da lista de abas e das setas",
                    "Dirección de la lista de pestañas y de las flechas",
                ),
                row(
                    "activation",
                    "auto | manual",
                    "auto",
                    "auto activates on focus; manual waits for Enter or Space",
                    "auto ativa ao focar; manual espera Enter ou Espaço",
                    "auto activa al enfocar; manual espera Enter o Espacio",
                ),
                ...styleRows(false),
                row(
                    "Tab: value, icon, disabled",
                    "string, ReactNode, boolean",
                    none,
                    "value pairs the tab with its panel; icon is shown before the label",
                    "value liga a aba ao painel; icon aparece antes do rótulo",
                    "value enlaza la pestaña con su panel; icon se muestra antes de la etiqueta",
                ),
                row(
                    "TabPanel: value",
                    "string",
                    none,
                    "Panel shown while the tab with the same value is active",
                    "Painel exibido enquanto a aba com o mesmo value está ativa",
                    "Panel mostrado mientras la pestaña con el mismo value está activa",
                ),
            ],
        },
        {
            slug: "segmented-control",
            name: "SegmentedControl",
            blurb: t(
                "A single choice among a few options, to switch between views of the same content.",
                "Uma escolha única entre poucas opções, para alternar entre visões do mesmo conteúdo.",
                "Una elección única entre pocas opciones, para alternar entre vistas del mismo contenido.",
            ),
            usage: t(
                "Place `SegmentedItem`s inside a `SegmentedControl`. It is a `radiogroup`: one item is always selected, arrows move and select (skipping disabled items), and `aria-label` is required. Works controlled (`value`) or uncontrolled (`defaultValue`). For navigating between sections use `Tabs`.",
                "Coloque `SegmentedItem`s dentro de um `SegmentedControl`. É um `radiogroup`: um item fica sempre selecionado, as setas movem e selecionam (ignorando os desabilitados) e o `aria-label` é obrigatório. Funciona controlado (`value`) ou não (`defaultValue`). Para navegar entre seções use `Tabs`.",
                "Coloca `SegmentedItem`s dentro de un `SegmentedControl`. Es un `radiogroup`: siempre hay un item seleccionado, las flechas mueven y seleccionan (omitiendo los deshabilitados) y `aria-label` es obligatorio. Funciona controlado (`value`) o no (`defaultValue`). Para navegar entre secciones usa `Tabs`.",
            ),
            code: `import { SegmentedControl, SegmentedItem } from "vaiperui";

<SegmentedControl aria-label="${t("View", "Visualização", "Vista")}" defaultValue="list">
  <SegmentedItem value="list">${t("List", "Lista", "Lista")}</SegmentedItem>
  <SegmentedItem value="grid">${t("Grid", "Grade", "Cuadrícula")}</SegmentedItem>
  <SegmentedItem value="map">${t("Map", "Mapa", "Mapa")}</SegmentedItem>
</SegmentedControl>`,
            demo: (
                <SegmentedControl
                    aria-label={t("View", "Visualização", "Vista")}
                    defaultValue="list"
                >
                    <SegmentedItem value="list">{t("List", "Lista", "Lista")}</SegmentedItem>
                    <SegmentedItem value="grid">{t("Grid", "Grade", "Cuadrícula")}</SegmentedItem>
                    <SegmentedItem value="map">{t("Map", "Mapa", "Mapa")}</SegmentedItem>
                </SegmentedControl>
            ),
            props: [
                row(
                    "aria-label",
                    "string",
                    t("required", "obrigatório", "obligatorio"),
                    "Names what the control selects",
                    "Nomeia o que o controle seleciona",
                    "Nombra lo que selecciona el control",
                ),
                row(
                    "value",
                    "string",
                    none,
                    "Selected item (controlled)",
                    "Item selecionado (controlado)",
                    "Item seleccionado (controlado)",
                ),
                row(
                    "defaultValue",
                    "string",
                    none,
                    "Initial item (uncontrolled)",
                    "Item inicial (não controlado)",
                    "Item inicial (no controlado)",
                ),
                row(
                    "onValueChange",
                    "(value: string) => void",
                    none,
                    "Called when the selection changes",
                    "Chamado quando a seleção muda",
                    "Se llama cuando cambia la selección",
                ),
                row(
                    "disabled",
                    "boolean",
                    "false",
                    "Disables the whole control",
                    "Desabilita o controle todo",
                    "Deshabilita todo el control",
                ),
                row(
                    "variantColor / customColor",
                    "ControlColors | CustomColor",
                    t("neutral", "neutro", "neutro"),
                    "Color of the selected item's text; neutral when neither is set",
                    "Cor do texto do item selecionado; neutro se nenhum for definido",
                    "Color del texto del item seleccionado; neutro si no se define ninguno",
                ),
                ...styleRows(true).filter(
                    (r) => !r.prop.startsWith("variantColor") && r.prop !== "customColor",
                ),
                row(
                    "SegmentedItem: value, disabled",
                    "string, boolean",
                    none,
                    "The item's value; disables only this item",
                    "O valor do item; desabilita só este item",
                    "El valor del item; deshabilita solo este item",
                ),
            ],
        },
        {
            slug: "breadcrumb",
            name: "Breadcrumb",
            blurb: t(
                "Shows where the current page sits in the hierarchy, with a link back to each level.",
                "Mostra onde a página atual está na hierarquia, com um link de volta para cada nível.",
                "Muestra dónde está la página actual en la jerarquía, con un enlace de vuelta a cada nivel.",
            ),
            usage: t(
                'A `nav` with an ordered list of `BreadcrumbItem`s. Give earlier items an `href` and mark the last one `current` (it becomes text with `aria-current="page"`). To use a router link, pass it as the child with `asChild`. Set `maxItems` to collapse long trails behind an ellipsis button, and `separator` to change the divider.',
                'Um `nav` com uma lista ordenada de `BreadcrumbItem`s. Dê `href` aos itens anteriores e marque o último como `current` (vira texto com `aria-current="page"`). Para usar o link de um roteador, passe-o como filho com `asChild`. Use `maxItems` para recolher trilhas longas atrás de um botão de reticências e `separator` para trocar o divisor.',
                'Un `nav` con una lista ordenada de `BreadcrumbItem`s. Da `href` a los items anteriores y marca el último como `current` (pasa a ser texto con `aria-current="page"`). Para usar un enlace de router, pásalo como hijo con `asChild`. Usa `maxItems` para colapsar rutas largas tras un botón de puntos suspensivos y `separator` para cambiar el divisor.',
            ),
            code: `import { Breadcrumb, BreadcrumbItem } from "vaiperui";

<Breadcrumb>
  <BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
  <BreadcrumbItem href="/settings">${t("Settings", "Configurações", "Ajustes")}</BreadcrumbItem>
  <BreadcrumbItem current>${t("Profile", "Perfil", "Perfil")}</BreadcrumbItem>
</Breadcrumb>

// ${t("with a router link", "com um link de roteador", "con un enlace de router")}
<BreadcrumbItem asChild>
  <Link href="/settings">${t("Settings", "Configurações", "Ajustes")}</Link>
</BreadcrumbItem>`,
            demo: (
                <Breadcrumb>
                    <BreadcrumbItem href="#">Dashboard</BreadcrumbItem>
                    <BreadcrumbItem href="#">
                        {t("Settings", "Configurações", "Ajustes")}
                    </BreadcrumbItem>
                    <BreadcrumbItem current>{t("Profile", "Perfil", "Perfil")}</BreadcrumbItem>
                </Breadcrumb>
            ),
            props: [
                row(
                    "separator",
                    "ReactNode",
                    "/",
                    "Drawn between items, hidden from screen readers",
                    "Desenhado entre os itens, oculto para leitores de tela",
                    "Dibujado entre los items, oculto para lectores de pantalla",
                ),
                row(
                    "maxItems",
                    "number",
                    none,
                    "Collapses longer trails into first item, ellipsis and the last maxItems - 1",
                    "Recolhe trilhas maiores em primeiro item, reticências e os últimos maxItems - 1",
                    "Colapsa rutas mayores en primer item, puntos suspensivos y los últimos maxItems - 1",
                ),
                row(
                    "expandLabel",
                    "string",
                    "Show hidden items",
                    "Accessible name of the ellipsis button",
                    "Nome acessível do botão de reticências",
                    "Nombre accesible del botón de puntos suspensivos",
                ),
                row(
                    "aria-label",
                    "string",
                    "Breadcrumb",
                    "Name of the navigation",
                    "Nome da navegação",
                    "Nombre de la navegación",
                ),
                row(
                    "variantColor / customColor",
                    "ControlColors | CustomColor",
                    "primary",
                    "Color of the focus ring (and link hover with customColor)",
                    "Cor do anel de foco (e do hover do link com customColor)",
                    "Color del anillo de foco (y del hover del enlace con customColor)",
                ),
                row(
                    "size",
                    "sm | md | lg",
                    "md",
                    "Text size",
                    "Tamanho do texto",
                    "Tamaño del texto",
                ),
                row(
                    "BreadcrumbItem: href, current, asChild",
                    "string, boolean, boolean",
                    none,
                    "Link target; marks the current page; uses the child element as the link",
                    "Destino do link; marca a página atual; usa o elemento filho como link",
                    "Destino del enlace; marca la página actual; usa el elemento hijo como enlace",
                ),
            ],
        },
        {
            slug: "pagination",
            name: "Pagination",
            blurb: t(
                "Moves between pages of results; the parent owns the page and fetches the data.",
                "Navega entre páginas de resultados; o pai guarda a página e busca os dados.",
                "Navega entre páginas de resultados; el padre guarda la página y obtiene los datos.",
            ),
            usage: t(
                "A controlled component: pass `page` (starting at 1), `pageCount` and `onPageChange`. With many pages it shows the first, last, current and `siblingCount` neighbors with ellipses, keeping the bar the same width. Every built-in text is overridable (`previousLabel`, `nextLabel`, `pageLabel`, `aria-label`). If each page has its own URL, prefer real links.",
                "Um componente controlado: passe `page` (começando em 1), `pageCount` e `onPageChange`. Com muitas páginas mostra a primeira, a última, a atual e `siblingCount` vizinhas com reticências, mantendo a barra com a mesma largura. Todo texto embutido pode ser trocado (`previousLabel`, `nextLabel`, `pageLabel`, `aria-label`). Se cada página tem sua URL, prefira links reais.",
                "Un componente controlado: pasa `page` (desde 1), `pageCount` y `onPageChange`. Con muchas páginas muestra la primera, la última, la actual y `siblingCount` vecinas con puntos suspensivos, manteniendo el mismo ancho. Todo texto integrado se puede cambiar (`previousLabel`, `nextLabel`, `pageLabel`, `aria-label`). Si cada página tiene su URL, prefiere enlaces reales.",
            ),
            code: `import { Pagination } from "vaiperui";

const [page, setPage] = useState(1);

<Pagination
  page={page}
  pageCount={20}
  onPageChange={setPage}
  previousLabel="${pageLabels.previous}"
  nextLabel="${pageLabels.next}"
  pageLabel={(n) => \`${pageLabels.page.replace("{n}", nToken)}\`}
/>`,
            demo: <PaginationDemo labels={pageLabels} />,
            props: [
                row(
                    "page",
                    "number",
                    t("required", "obrigatório", "obligatorio"),
                    "Current page, starting at 1",
                    "Página atual, começando em 1",
                    "Página actual, desde 1",
                ),
                row(
                    "pageCount",
                    "number",
                    t("required", "obrigatório", "obligatorio"),
                    "Total number of pages",
                    "Número total de páginas",
                    "Número total de páginas",
                ),
                row(
                    "onPageChange",
                    "(page: number) => void",
                    t("required", "obrigatório", "obligatorio"),
                    "Called with the chosen page",
                    "Chamado com a página escolhida",
                    "Se llama con la página elegida",
                ),
                row(
                    "siblingCount",
                    "number",
                    "1",
                    "Pages shown on each side of the current one",
                    "Páginas exibidas de cada lado da atual",
                    "Páginas mostradas a cada lado de la actual",
                ),
                row(
                    "previousLabel",
                    "string",
                    "Previous page",
                    "Accessible name of the previous button",
                    "Nome acessível do botão anterior",
                    "Nombre accesible del botón anterior",
                ),
                row(
                    "nextLabel",
                    "string",
                    "Next page",
                    "Accessible name of the next button",
                    "Nome acessível do botão próximo",
                    "Nombre accesible del botón siguiente",
                ),
                row(
                    "pageLabel",
                    "(page: number) => string",
                    "Page n",
                    "Accessible name of a page button",
                    "Nome acessível de um botão de página",
                    "Nombre accesible de un botón de página",
                ),
                row(
                    "aria-label",
                    "string",
                    "Pagination",
                    "Name of the navigation",
                    "Nome da navegação",
                    "Nombre de la navegación",
                ),
                row(
                    "disabled",
                    "boolean",
                    "false",
                    "Disables every button",
                    "Desabilita todos os botões",
                    "Deshabilita todos los botones",
                ),
                ...styleRows(true),
            ],
        },
        {
            slug: "stepper",
            name: "Stepper",
            blurb: t(
                "Shows progress through a sequential flow such as a checkout or onboarding.",
                "Mostra o progresso em um fluxo sequencial, como checkout ou onboarding.",
                "Muestra el progreso en un flujo secuencial, como un checkout u onboarding.",
            ),
            usage: t(
                'Put `Step`s inside a `Stepper` and set `current` (zero-based): earlier steps are completed (check), the current one is highlighted with `aria-current="step"`, later ones are upcoming. It only displays progress; your screen handles moving and validating. Pass `onStepClick` to turn completed steps into buttons that go back. Use `orientation="vertical"` with a `description` on each step.',
                'Coloque `Step`s dentro de um `Stepper` e defina `current` (base zero): as etapas anteriores ficam concluídas (check), a atual fica destacada com `aria-current="step"` e as seguintes ficam pendentes. Ele só exibe o progresso; sua tela cuida de avançar e validar. Passe `onStepClick` para transformar etapas concluídas em botões que voltam. Use `orientation="vertical"` com `description` em cada etapa.',
                'Pon `Step`s dentro de un `Stepper` y define `current` (base cero): los pasos anteriores quedan completados (check), el actual se resalta con `aria-current="step"` y los siguientes quedan pendientes. Solo muestra el progreso; tu pantalla se encarga de avanzar y validar. Pasa `onStepClick` para convertir los pasos completados en botones que retroceden. Usa `orientation="vertical"` con `description` en cada paso.',
            ),
            code: `import { Step, Stepper } from "vaiperui";

<Stepper current={1} aria-label="${t("Signup steps", "Etapas do cadastro", "Pasos del registro")}">
  <Step>${stepNames[0]}</Step>
  <Step>${stepNames[1]}</Step>
  <Step>${stepNames[2]}</Step>
</Stepper>`,
            demo: (
                <StepperDemo
                    steps={stepNames}
                    label={t("Signup steps", "Etapas do cadastro", "Pasos del registro")}
                    back={t("Back", "Voltar", "Atrás")}
                    next={t("Next", "Avançar", "Siguiente")}
                    completed={t("Completed", "Concluída", "Completado")}
                />
            ),
            props: [
                row(
                    "current",
                    "number",
                    t("required", "obrigatório", "obligatorio"),
                    "Zero-based index of the active step",
                    "Índice (base zero) da etapa ativa",
                    "Índice (base cero) del paso activo",
                ),
                row(
                    "orientation",
                    "horizontal | vertical",
                    "horizontal",
                    "Layout of the steps",
                    "Disposição das etapas",
                    "Disposición de los pasos",
                ),
                row(
                    "onStepClick",
                    "(index: number) => void",
                    none,
                    "Makes completed steps buttons that call this with their index",
                    "Transforma etapas concluídas em botões que chamam isto com o índice",
                    "Convierte los pasos completados en botones que llaman a esto con su índice",
                ),
                row(
                    "completedLabel",
                    "string",
                    "Completed",
                    "Screen-reader text added to completed steps",
                    "Texto para leitores de tela adicionado às etapas concluídas",
                    "Texto para lectores de pantalla añadido a los pasos completados",
                ),
                ...styleRows(false),
                row(
                    "Step: children, description",
                    "ReactNode, ReactNode",
                    none,
                    "The step's label and an optional secondary line",
                    "O rótulo da etapa e uma linha secundária opcional",
                    "La etiqueta del paso y una línea secundaria opcional",
                ),
            ],
        },
    ];
}

export function getNavigationVariations(locale: Locale): Record<string, VariationGroup[]> {
    const t = makeT(locale);
    const colorsTitle = t("Colors", "Cores", "Colores");
    const colorsFile = t("colors.tsx", "cores.tsx", "colores.tsx");
    const sizesTitle = t("Sizes", "Tamanhos", "Tamaños");
    const sizesFile = t("sizes.tsx", "tamanhos.tsx", "tamanos.tsx");
    const radiusTitle = t("Radius", "Raio", "Radio");
    const radiusFile = t("radius.tsx", "raio.tsx", "radio.tsx");
    const customTitle = t("Custom color", "Cor personalizada", "Color personalizado");
    const customFile = t("custom-color.tsx", "cor-personalizada.tsx", "color-personalizado.tsx");
    const statesTitle = t("States", "Estados", "Estados");
    const statesFile = t("states.tsx", "estados.tsx", "estados.tsx");
    const orange = t("Orange", "Laranja", "Naranja");
    const violet = t("Violet", "Violeta", "Violeta");

    const general = t("General", "Geral", "General");
    const account = t("Account", "Conta", "Cuenta");
    const billing = t("Billing", "Faturas", "Facturas");
    const tabsNode = (props: Record<string, unknown>, label: string) => (
        <Tabs defaultValue="a" {...props}>
            <TabList aria-label={label}>
                <Tab value="a">{general}</Tab>
                <Tab value="b">{account}</Tab>
            </TabList>
        </Tabs>
    );
    const tabsCode = (attrs: string) => `<Tabs defaultValue="a"${attrs}>
  <TabList aria-label="…">
    <Tab value="a">${general}</Tab>
    <Tab value="b">${account}</Tab>
  </TabList>
</Tabs>`;

    const list = t("List", "Lista", "Lista");
    const grid = t("Grid", "Grade", "Cuadrícula");
    const segNode = (props: Record<string, unknown>, label: string) => (
        <SegmentedControl aria-label={label} defaultValue="list" {...props}>
            <SegmentedItem value="list">{list}</SegmentedItem>
            <SegmentedItem value="grid">{grid}</SegmentedItem>
        </SegmentedControl>
    );
    const segCode = (
        attrs: string,
    ) => `<SegmentedControl aria-label="…" defaultValue="list"${attrs}>
  <SegmentedItem value="list">${list}</SegmentedItem>
  <SegmentedItem value="grid">${grid}</SegmentedItem>
</SegmentedControl>`;

    const pageLabels = {
        nav: t("Pagination", "Paginação", "Paginación"),
        previous: t("Previous page", "Página anterior", "Página anterior"),
        next: t("Next page", "Próxima página", "Página siguiente"),
        page: t("Page {n}", "Página {n}", "Página {n}"),
    };
    const pagCode = (attrs: string) =>
        `<Pagination page={page} pageCount={20} onPageChange={setPage}${attrs} />`;
    const pagNode = (props: Record<string, unknown>, key: string) => (
        <PaginationDemo
            key={key}
            labels={{ ...pageLabels, nav: `${pageLabels.nav} ${key}` }}
            {...props}
        />
    );

    const stepNames = [
        t("Account", "Conta", "Cuenta"),
        t("Address", "Endereço", "Dirección"),
        t("Payment", "Pagamento", "Pago"),
    ];
    const stepNode = (props: Record<string, unknown>, label: string) => (
        <Stepper current={1} aria-label={label} {...props}>
            {stepNames.map((n) => (
                <Step key={n}>{n}</Step>
            ))}
        </Stepper>
    );
    const stepCode = (attrs: string) => `<Stepper current={1}${attrs}>
  <Step>${stepNames[0]}</Step>
  <Step>${stepNames[1]}</Step>
  <Step>${stepNames[2]}</Step>
</Stepper>`;

    const customs = [
        { label: orange, color: "#f97316" },
        { label: violet, color: "#8b5cf6" },
    ];
    const group = (
        title: string,
        file: string,
        entries: { label: string; attrs: string; props: Record<string, unknown> }[],
        code: (attrs: string) => string,
        node: (props: Record<string, unknown>, label: string) => ReactNode,
    ): VariationGroup => ({
        title,
        file,
        code: entries.map((e) => code(e.attrs)).join("\n\n"),
        items: entries.map((e) => ({ label: e.label, node: node(e.props, e.label) })),
    });
    const shared = (
        code: (attrs: string) => string,
        node: (props: Record<string, unknown>, label: string) => ReactNode,
        radius: boolean,
    ): VariationGroup[] => [
        group(
            colorsTitle,
            colorsFile,
            COLORS.map((c) => ({
                label: c,
                attrs: ` variantColor="${c}"`,
                props: { variantColor: c },
            })),
            code,
            node,
        ),
        group(
            sizesTitle,
            sizesFile,
            SIZES.map((s) => ({ label: s, attrs: ` size="${s}"`, props: { size: s } })),
            code,
            node,
        ),
        ...(radius
            ? [
                  group(
                      radiusTitle,
                      radiusFile,
                      RADII.map((r) => ({
                          label: r,
                          attrs: ` radius="${r}"`,
                          props: { radius: r },
                      })),
                      code,
                      node,
                  ),
              ]
            : []),
        group(
            customTitle,
            customFile,
            customs.map((c) => ({
                label: c.label,
                attrs: ` customColor="${c.color}"`,
                props: { customColor: c.color },
            })),
            code,
            node,
        ),
    ];

    return {
        tabs: [
            ...shared(tabsCode, tabsNode, false),
            {
                title: t(
                    "Orientation and activation",
                    "Orientação e ativação",
                    "Orientación y activación",
                ),
                file: t("behavior.tsx", "comportamento.tsx", "comportamiento.tsx"),
                code: `<Tabs defaultValue="a" orientation="vertical">…</Tabs>\n\n<Tabs defaultValue="a" activation="manual">…</Tabs>`,
                items: [
                    {
                        label: "vertical",
                        node: (
                            <Tabs defaultValue="a" orientation="vertical">
                                <TabList aria-label="vertical">
                                    <Tab value="a">{general}</Tab>
                                    <Tab value="b">{account}</Tab>
                                    <Tab value="c" disabled>
                                        {billing}
                                    </Tab>
                                </TabList>
                                <TabPanel value="a">{general}</TabPanel>
                                <TabPanel value="b">{account}</TabPanel>
                            </Tabs>
                        ),
                    },
                    {
                        label: "manual",
                        node: (
                            <Tabs defaultValue="a" activation="manual">
                                <TabList aria-label="manual">
                                    <Tab value="a">{general}</Tab>
                                    <Tab value="b">{account}</Tab>
                                </TabList>
                                <TabPanel value="a">{general}</TabPanel>
                                <TabPanel value="b">{account}</TabPanel>
                            </Tabs>
                        ),
                    },
                ],
            },
        ],
        "segmented-control": [
            ...shared(segCode, segNode, true),
            {
                title: statesTitle,
                file: statesFile,
                code: `<SegmentedControl aria-label="…" disabled>…</SegmentedControl>`,
                items: [
                    {
                        label: t("disabled", "desabilitado", "deshabilitado"),
                        node: segNode({ disabled: true }, "disabled"),
                    },
                ],
            },
        ],
        breadcrumb: [
            {
                title: t("Separator", "Separador", "Separador"),
                file: t("separator.tsx", "separador.tsx", "separador.tsx"),
                code: `<Breadcrumb separator="›">…</Breadcrumb>\n<Breadcrumb separator="→">…</Breadcrumb>`,
                items: ["/", "›", "→"].map((sep) => ({
                    label: sep,
                    node: (
                        <Breadcrumb separator={sep}>
                            <BreadcrumbItem href="#">Home</BreadcrumbItem>
                            <BreadcrumbItem href="#">
                                {t("Library", "Biblioteca", "Biblioteca")}
                            </BreadcrumbItem>
                            <BreadcrumbItem current>{t("Data", "Dados", "Datos")}</BreadcrumbItem>
                        </Breadcrumb>
                    ),
                })),
            },
            {
                title: t("Collapsed", "Recolhido", "Colapsado"),
                file: t("collapsed.tsx", "recolhido.tsx", "colapsado.tsx"),
                code: `<Breadcrumb maxItems={3}>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/a">A</BreadcrumbItem>
  <BreadcrumbItem href="/b">B</BreadcrumbItem>
  <BreadcrumbItem href="/c">C</BreadcrumbItem>
  <BreadcrumbItem current>D</BreadcrumbItem>
</Breadcrumb>`,
                items: [
                    {
                        label: "maxItems={3}",
                        node: (
                            <Breadcrumb
                                maxItems={3}
                                expandLabel={t(
                                    "Show hidden items",
                                    "Mostrar itens ocultos",
                                    "Mostrar items ocultos",
                                )}
                            >
                                <BreadcrumbItem href="#">Home</BreadcrumbItem>
                                <BreadcrumbItem href="#">A</BreadcrumbItem>
                                <BreadcrumbItem href="#">B</BreadcrumbItem>
                                <BreadcrumbItem href="#">C</BreadcrumbItem>
                                <BreadcrumbItem current>D</BreadcrumbItem>
                            </Breadcrumb>
                        ),
                    },
                ],
            },
            {
                title: sizesTitle,
                file: sizesFile,
                code: SIZES.map((s) => `<Breadcrumb size="${s}">…</Breadcrumb>`).join("\n"),
                items: SIZES.map((s) => ({
                    label: s,
                    node: (
                        <Breadcrumb size={s}>
                            <BreadcrumbItem href="#">Home</BreadcrumbItem>
                            <BreadcrumbItem href="#">
                                {t("Library", "Biblioteca", "Biblioteca")}
                            </BreadcrumbItem>
                            <BreadcrumbItem current>{t("Data", "Dados", "Datos")}</BreadcrumbItem>
                        </Breadcrumb>
                    ),
                })),
            },
            {
                title: customTitle,
                file: customFile,
                code: `<Breadcrumb customColor="#f97316">…</Breadcrumb>`,
                items: customs.map((c) => ({
                    label: c.label,
                    node: (
                        <Breadcrumb customColor={c.color}>
                            <BreadcrumbItem href="#">Home</BreadcrumbItem>
                            <BreadcrumbItem current>{t("Data", "Dados", "Datos")}</BreadcrumbItem>
                        </Breadcrumb>
                    ),
                })),
            },
        ],
        pagination: [
            ...shared(pagCode, (props, label) => pagNode(props, label), true),
            {
                title: t("Siblings", "Vizinhas", "Vecinas"),
                file: t("siblings.tsx", "vizinhas.tsx", "vecinas.tsx"),
                code: `<Pagination page={page} pageCount={30} siblingCount={2} onPageChange={setPage} />`,
                items: [
                    {
                        label: "siblingCount={2}",
                        node: pagNode(
                            { siblingCount: 2, pageCount: 30, initialPage: 10 },
                            "siblings",
                        ),
                    },
                ],
            },
        ],
        stepper: [
            ...shared(stepCode, stepNode, false),
            {
                title: t("Vertical", "Vertical", "Vertical"),
                file: t("vertical.tsx", "vertical.tsx", "vertical.tsx"),
                code: `<Stepper current={1} orientation="vertical">
  <Step description="…">${stepNames[0]}</Step>
  …
</Stepper>`,
                items: [
                    {
                        label: "vertical",
                        node: (
                            <Stepper current={1} orientation="vertical" aria-label="vertical">
                                <Step
                                    description={t(
                                        "Email and password",
                                        "E-mail e senha",
                                        "Correo y contraseña",
                                    )}
                                >
                                    {stepNames[0]}
                                </Step>
                                <Step
                                    description={t(
                                        "Where to ship",
                                        "Onde entregar",
                                        "Dónde enviar",
                                    )}
                                >
                                    {stepNames[1]}
                                </Step>
                                <Step
                                    description={t(
                                        "Card or slip",
                                        "Cartão ou boleto",
                                        "Tarjeta o boleto",
                                    )}
                                >
                                    {stepNames[2]}
                                </Step>
                            </Stepper>
                        ),
                    },
                ],
            },
        ],
    };
}
