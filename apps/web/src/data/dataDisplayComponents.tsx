import type { ReactNode } from "react";
import {
    Accordion,
    AccordionItem,
    Avatar,
    Badge,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    List,
    ListItem,
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Tag,
} from "vaiperui";

import { TagsDemo } from "@/components/TagsDemo";

import type { Locale } from "@/i18n/config";
import type { ComponentEntry, PropRow } from "./components";
import { makeT } from "./samples";
import type { VariationGroup } from "./variations";

const COLORS = ["primary", "success", "warning", "danger"] as const;
const SIZES = ["sm", "md", "lg"] as const;
const STATUSES = ["success", "error", "warning", "info", "neutral", "pending"] as const;

const NAMES = ["Camila Souza", "Yuki Tanaka", "Ada Lovelace"];

export function getDataDisplayComponents(locale: Locale): ComponentEntry[] {
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
    const native = (el: string): PropRow =>
        row(
            t("(native)", "(nativas)", "(nativas)"),
            el,
            none,
            "Every native prop of the element, className, ref, etc.",
            "Todas as props nativas do elemento, className, ref etc.",
            "Todas las props nativas del elemento, className, ref, etc.",
        );
    const radiusRow = (d: string): PropRow =>
        row(
            "radius",
            "none | sm | md | lg | full",
            d,
            "Corner rounding",
            "Arredondamento dos cantos",
            "Redondeo de las esquinas",
        );
    const sizeRow: PropRow = row(
        "size",
        "sm | md | lg",
        "md",
        "Size of the element and its text",
        "Tamanho do elemento e do texto",
        "Tamaño del elemento y del texto",
    );
    const customRow = (what: string, pt: string, es: string): PropRow =>
        row(
            "customColor",
            "string | { light, dark }",
            none,
            `Any CSS color (or a pair per theme) for ${what}`,
            `Qualquer cor CSS (ou um par por tema) para ${pt}`,
            `Cualquier color CSS (o un par por tema) para ${es}`,
        );
    const person = (name: string, role: string, status: string, st: "success" | "pending") => (
        <ListItem
            key={name}
            leading={<Avatar name={name} />}
            title={name}
            description={role}
            trailing={<Badge status={st}>{status}</Badge>}
        />
    );
    const faq = (
        <>
            <AccordionItem
                value="payment"
                title={t(
                    "Which payment methods?",
                    "Quais formas de pagamento?",
                    "¿Qué formas de pago?",
                )}
            >
                {t(
                    "We accept credit card, bank slip and Pix.",
                    "Aceitamos cartão de crédito, boleto e Pix.",
                    "Aceptamos tarjeta de crédito, boleto y Pix.",
                )}
            </AccordionItem>
            <AccordionItem
                value="shipping"
                title={t(
                    "How long is shipping?",
                    "Qual o prazo de entrega?",
                    "¿Cuál es el plazo de entrega?",
                )}
            >
                {t("From 3 to 7 business days.", "De 3 a 7 dias úteis.", "De 3 a 7 días hábiles.")}
            </AccordionItem>
        </>
    );

    return [
        {
            slug: "avatar",
            name: "Avatar",
            blurb: t(
                "Round user picture that falls back to initials when there is no image or it fails to load.",
                "Foto redonda do usuário que cai para as iniciais quando não há imagem ou ela falha ao carregar.",
                "Foto redonda del usuario que vuelve a las iniciales cuando no hay imagen o falla al cargar.",
            ),
            usage: t(
                '`name` is required: it gives the initials (first and last words) and the accessible label (`role="img"`), while the image is decorative. Pass `src` for a picture; if it is missing or breaks, the initials show.',
                '`name` é obrigatório: gera as iniciais (primeira e última palavras) e o rótulo acessível (`role="img"`), enquanto a imagem é decorativa. Passe `src` para uma foto; se faltar ou quebrar, aparecem as iniciais.',
                '`name` es obligatorio: da las iniciales (primera y última palabra) y la etiqueta accesible (`role="img"`), mientras la imagen es decorativa. Pasa `src` para una foto; si falta o falla, se muestran las iniciales.',
            ),
            code: `import { Avatar } from "vaiperui";

<Avatar name="Camila Souza" />
<Avatar name="Yuki Tanaka" src="/avatars/yuki.jpg" size="lg" />
<Avatar name="Ada Lovelace" variantColor="success" />`,
            demo: (
                <div className="flex items-center gap-3">
                    <Avatar name="Camila Souza" />
                    <Avatar name="Yuki Tanaka" size="lg" variantColor="success" />
                    <Avatar name="Ada Lovelace" size="sm" customColor="#ff6600" />
                </div>
            ),
            props: [
                row(
                    "name",
                    "string",
                    t("required", "obrigatório", "obligatorio"),
                    "Full name: initials and accessible label",
                    "Nome completo: iniciais e rótulo acessível",
                    "Nombre completo: iniciales y etiqueta accesible",
                ),
                row(
                    "src",
                    "string",
                    none,
                    "Image URL; initials show if missing or broken",
                    "URL da imagem; as iniciais aparecem se faltar ou quebrar",
                    "URL de la imagen; se muestran las iniciales si falta o falla",
                ),
                row(
                    "size",
                    "sm | md | lg",
                    "md",
                    "32, 40 or 56px",
                    "32, 40 ou 56px",
                    "32, 40 o 56px",
                ),
                radiusRow("full"),
                row(
                    "variantColor",
                    "primary | success | warning | danger",
                    none,
                    "Tints the initials fallback (neutral when omitted)",
                    "Colore o fallback de iniciais (neutro se omitido)",
                    "Colorea el fallback de iniciales (neutro si se omite)",
                ),
                customRow(
                    "the initials fallback",
                    "o fallback de iniciais",
                    "el fallback de iniciales",
                ),
                native("span"),
            ],
        },
        {
            slug: "badge",
            name: "Badge",
            blurb: t(
                "Small status label with semantic colors and an optional dot.",
                "Pequeno rótulo de status com cores semânticas e um ponto opcional.",
                "Pequeña etiqueta de estado con colores semánticos y un punto opcional.",
            ),
            usage: t(
                "Use `status` for the semantic color and `dot` for a decorative indicator. It is not interactive. Color must not be the only signal, so the text should state the status. For categories or filters use `Tag`.",
                "Use `status` para a cor semântica e `dot` para um indicador decorativo. Não é interativo. A cor não deve ser o único sinal, então o texto deve dizer o status. Para categorias ou filtros use `Tag`.",
                "Usa `status` para el color semántico y `dot` para un indicador decorativo. No es interactivo. El color no debe ser la única señal, así que el texto debe decir el estado. Para categorías o filtros usa `Tag`.",
            ),
            code: `import { Badge } from "vaiperui";

<Badge status="success" dot>${t("Active", "Ativo", "Activo")}</Badge>
<Badge status="warning">${t("Attention", "Atenção", "Atención")}</Badge>`,
            demo: (
                <div className="flex flex-wrap gap-2">
                    <Badge status="success" dot>
                        {t("Active", "Ativo", "Activo")}
                    </Badge>
                    <Badge status="warning">{t("Attention", "Atenção", "Atención")}</Badge>
                    <Badge status="error">{t("Refused", "Recusado", "Rechazado")}</Badge>
                </div>
            ),
            props: [
                row(
                    "status",
                    "success | error | warning | info | neutral | pending",
                    "neutral",
                    "Semantic color",
                    "Cor semântica",
                    "Color semántico",
                ),
                row(
                    "dot",
                    "boolean",
                    "false",
                    "Decorative dot before the text",
                    "Ponto decorativo antes do texto",
                    "Punto decorativo antes del texto",
                ),
                sizeRow,
                radiusRow("full"),
                customRow(
                    "the badge (overrides status)",
                    "o badge (substitui o status)",
                    "el badge (reemplaza a status)",
                ),
                native("span"),
            ],
        },
        {
            slug: "tag",
            name: "Tag",
            blurb: t(
                "Label for categories or filters, with an optional remove button.",
                "Rótulo para categorias ou filtros, com botão de remover opcional.",
                "Etiqueta para categorías o filtros, con botón de quitar opcional.",
            ),
            usage: t(
                "`variant` is `filled` or `outline`. Passing `onDismiss` renders a real remove `<button>`; give each one a specific `dismissLabel` so screen readers tell them apart. For semantic status use `Badge`.",
                "`variant` é `filled` ou `outline`. Passar `onDismiss` renderiza um `<button>` real de remover; dê a cada um um `dismissLabel` específico para leitores de tela os distinguirem. Para status semântico use `Badge`.",
                "`variant` es `filled` u `outline`. Pasar `onDismiss` renderiza un `<button>` real para quitar; da a cada uno un `dismissLabel` específico para que los lectores de pantalla los distingan. Para estado semántico usa `Badge`.",
            ),
            code: `import { Tag } from "vaiperui";

<Tag>Design</Tag>
<Tag variant="outline">Code</Tag>
<Tag onDismiss={() => remove("React")} dismissLabel="${t("Remove", "Remover", "Quitar")} React">React</Tag>`,
            demo: (
                <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <Tag>Design</Tag>
                        <Tag variant="outline">{t("Code", "Código", "Código")}</Tag>
                    </div>
                    <TagsDemo
                        tags={["React", "Next.js", "Tailwind"]}
                        label={t("Remove", "Remover", "Quitar")}
                    />
                </div>
            ),
            props: [
                row(
                    "variant",
                    "filled | outline",
                    "filled",
                    "Tinted background or border only",
                    "Fundo colorido ou apenas borda",
                    "Fondo coloreado o solo borde",
                ),
                row(
                    "variantColor",
                    "primary | success | warning | danger",
                    none,
                    "Color (neutral when omitted)",
                    "Cor (neutra se omitida)",
                    "Color (neutro si se omite)",
                ),
                sizeRow,
                radiusRow("md"),
                customRow(
                    "the tag (overrides variantColor)",
                    "a tag (substitui variantColor)",
                    "la tag (reemplaza a variantColor)",
                ),
                row(
                    "onDismiss",
                    "() => void",
                    none,
                    "Renders a remove button that calls it",
                    "Renderiza um botão de remover que a chama",
                    "Renderiza un botón de quitar que la llama",
                ),
                row(
                    "dismissLabel",
                    "string",
                    "Remove",
                    "Accessible name of the remove button",
                    "Nome acessível do botão de remover",
                    "Nombre accesible del botón de quitar",
                ),
                native("span"),
            ],
        },
        {
            slug: "card",
            name: "Card",
            blurb: t(
                "Elevated surface that groups related content, with optional header, body and footer.",
                "Superfície elevada que agrupa conteúdo relacionado, com cabeçalho, corpo e rodapé opcionais.",
                "Superficie elevada que agrupa contenido relacionado, con encabezado, cuerpo y pie opcionales.",
            ),
            usage: t(
                "`Card` has no ARIA role: give it a heading that fits the page. `CardHeader`, `CardBody` and `CardFooter` are optional helpers. `padding` is `none` (edge-to-edge media), `md` or `lg`.",
                "O `Card` não tem role ARIA: dê a ele um título que caiba na página. `CardHeader`, `CardBody` e `CardFooter` são auxiliares opcionais. `padding` é `none` (mídia de ponta a ponta), `md` ou `lg`.",
                "`Card` no tiene rol ARIA: dale un encabezado acorde a la página. `CardHeader`, `CardBody` y `CardFooter` son ayudas opcionales. `padding` es `none` (media de borde a borde), `md` o `lg`.",
            ),
            code: `import { Card, CardHeader, CardBody, CardFooter } from "vaiperui";

<Card>
  <CardHeader>${t("Pro plan", "Plano Pro", "Plan Pro")}</CardHeader>
  <CardBody>${t("Up to 10 users.", "Até 10 usuários.", "Hasta 10 usuarios.")}</CardBody>
  <CardFooter>${t("Billed monthly", "Cobrado mensalmente", "Facturado mensualmente")}</CardFooter>
</Card>`,
            demo: (
                <Card className="w-full max-w-xs">
                    <CardHeader>{t("Pro plan", "Plano Pro", "Plan Pro")}</CardHeader>
                    <CardBody>
                        {t("Up to 10 users.", "Até 10 usuários.", "Hasta 10 usuarios.")}
                    </CardBody>
                    <CardFooter>
                        {t("Billed monthly", "Cobrado mensalmente", "Facturado mensualmente")}
                    </CardFooter>
                </Card>
            ),
            props: [
                row(
                    "padding",
                    "none | md | lg",
                    "md",
                    "Inner spacing: 0, 16px or 24px",
                    "Espaçamento interno: 0, 16px ou 24px",
                    "Espaciado interno: 0, 16px o 24px",
                ),
                radiusRow("lg"),
                native("div (Card, CardHeader, CardBody, CardFooter)"),
            ],
        },
        {
            slug: "list",
            name: "List",
            blurb: t(
                "Semantic list of items with title, description, leading and trailing elements.",
                "Lista semântica de itens com título, descrição e elementos no início e no fim.",
                "Lista semántica de elementos con título, descripción y elementos al inicio y al final.",
            ),
            usage: t(
                "`List` renders a `<ul>` (`divided` draws lines between items); `ListItem` takes `title`, `description`, `leading` (e.g. an Avatar), `trailing` (e.g. a Badge or button) and extra `children`. The list is not interactive: put a link or button inside `title` or `trailing`.",
                "`List` renderiza um `<ul>` (`divided` desenha linhas entre os itens); `ListItem` recebe `title`, `description`, `leading` (ex.: um Avatar), `trailing` (ex.: um Badge ou botão) e `children` extras. A lista não é interativa: coloque um link ou botão em `title` ou `trailing`.",
                "`List` renderiza un `<ul>` (`divided` dibuja líneas entre elementos); `ListItem` recibe `title`, `description`, `leading` (p. ej. un Avatar), `trailing` (p. ej. un Badge o botón) y `children` extra. La lista no es interactiva: pon un enlace o botón en `title` o `trailing`.",
            ),
            code: `import { List, ListItem, Avatar, Badge } from "vaiperui";

<List divided>
  <ListItem
    leading={<Avatar name="Camila Souza" />}
    title="Camila Souza"
    description="${t("Product designer", "Designer de produto", "Diseñadora de producto")}"
    trailing={<Badge status="success">${t("Active", "Ativa", "Activa")}</Badge>}
  />
</List>`,
            demo: (
                <List divided className="w-full max-w-sm">
                    {person(
                        "Camila Souza",
                        t("Product designer", "Designer de produto", "Diseñadora de producto"),
                        t("Active", "Ativa", "Activa"),
                        "success",
                    )}
                    {person(
                        "Yuki Tanaka",
                        t("Engineer", "Engenheiro", "Ingeniero"),
                        t("Pending", "Pendente", "Pendiente"),
                        "pending",
                    )}
                </List>
            ),
            props: [
                row(
                    "divided",
                    "boolean",
                    "false",
                    "Line between items (List)",
                    "Linha entre os itens (List)",
                    "Línea entre elementos (List)",
                ),
                row(
                    "title",
                    "ReactNode",
                    t("required", "obrigatório", "obligatorio"),
                    "Item heading (ListItem)",
                    "Título do item (ListItem)",
                    "Título del elemento (ListItem)",
                ),
                row(
                    "description",
                    "ReactNode",
                    none,
                    "Supporting text under the title",
                    "Texto de apoio abaixo do título",
                    "Texto de apoyo bajo el título",
                ),
                row(
                    "leading",
                    "ReactNode",
                    none,
                    "Element before the text",
                    "Elemento antes do texto",
                    "Elemento antes del texto",
                ),
                row(
                    "trailing",
                    "ReactNode",
                    none,
                    "Element at the end of the row",
                    "Elemento no fim da linha",
                    "Elemento al final de la fila",
                ),
                native("ul / li"),
            ],
        },
        {
            slug: "table",
            name: "Table",
            blurb: t(
                "Styled native table parts for comparable data across columns.",
                "Partes de tabela nativa estilizadas para dados comparáveis entre colunas.",
                "Partes de tabla nativa con estilo para datos comparables entre columnas.",
            ),
            usage: t(
                'Compose `Table`, `TableCaption`, `TableHeader`, `TableBody`, `TableRow`, `TableHead` and `TableCell`; each maps to its native element and takes its native props. Name the table with a `TableCaption` or `aria-label`. `TableHead` defaults to `scope="col"`. Sorting is up to you (`aria-sort` plus a button in the header).',
                'Componha `Table`, `TableCaption`, `TableHeader`, `TableBody`, `TableRow`, `TableHead` e `TableCell`; cada um mapeia ao elemento nativo e aceita suas props nativas. Nomeie a tabela com um `TableCaption` ou `aria-label`. `TableHead` usa `scope="col"` por padrão. A ordenação fica por sua conta (`aria-sort` mais um botão no cabeçalho).',
                'Compón `Table`, `TableCaption`, `TableHeader`, `TableBody`, `TableRow`, `TableHead` y `TableCell`; cada uno corresponde a su elemento nativo y acepta sus props nativas. Nombra la tabla con un `TableCaption` o `aria-label`. `TableHead` usa `scope="col"` por defecto. La ordenación corre por tu cuenta (`aria-sort` más un botón en el encabezado).',
            ),
            code: `import { Table, TableCaption, TableHeader, TableBody, TableRow, TableHead, TableCell } from "vaiperui";

<Table striped>
  <TableCaption>${t("Recent orders", "Pedidos recentes", "Pedidos recientes")}</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>${t("Order", "Pedido", "Pedido")}</TableHead>
      <TableHead className="text-right">Total</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>#1042</TableCell>
      <TableCell className="text-right">$120.00</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
            demo: (
                <Table striped className="max-w-lg">
                    <TableCaption>
                        {t("Recent orders", "Pedidos recentes", "Pedidos recientes")}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t("Order", "Pedido", "Pedido")}</TableHead>
                            <TableHead>{t("Customer", "Cliente", "Cliente")}</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {NAMES.map((n, i) => (
                            <TableRow key={n}>
                                <TableCell>#{1042 + i}</TableCell>
                                <TableCell>{n}</TableCell>
                                <TableCell className="text-right">
                                    ${(120 + i * 45).toFixed(2)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ),
            props: [
                row(
                    "striped",
                    "boolean",
                    "false",
                    "Zebra background on body rows (Table)",
                    "Fundo zebrado nas linhas do corpo (Table)",
                    "Fondo cebra en las filas del cuerpo (Table)",
                ),
                row(
                    "wrapperClassName",
                    "string",
                    none,
                    "Classes of the scroll wrapper (className goes on the table)",
                    "Classes do wrapper de rolagem (className vai na tabela)",
                    "Clases del wrapper de scroll (className va en la tabla)",
                ),
                row(
                    "scope",
                    "col | row | ...",
                    "col",
                    "Scope of a TableHead",
                    "Escopo de um TableHead",
                    "Alcance de un TableHead",
                ),
                native("table / caption / thead / tbody / tr / th / td"),
            ],
        },
        {
            slug: "accordion",
            name: "Accordion",
            blurb: t(
                "Stack of sections that expand and collapse, with keyboard navigation.",
                "Pilha de seções que expandem e recolhem, com navegação por teclado.",
                "Pila de secciones que se expanden y colapsan, con navegación por teclado.",
            ),
            usage: t(
                '`type="single"` keeps one section open (add `collapsible` to allow closing it); `type="multiple"` lets several stay open. Use `defaultValue` or `value` + `onValueChange` (a string for single, `string[]` for multiple). Arrow Up/Down, Home and End move focus between headers.',
                '`type="single"` mantém uma seção aberta (adicione `collapsible` para poder fechá-la); `type="multiple"` permite várias abertas. Use `defaultValue` ou `value` + `onValueChange` (string para single, `string[]` para multiple). Setas cima/baixo, Home e End movem o foco entre os cabeçalhos.',
                '`type="single"` mantiene una sección abierta (agrega `collapsible` para poder cerrarla); `type="multiple"` permite varias abiertas. Usa `defaultValue` o `value` + `onValueChange` (string para single, `string[]` para multiple). Flechas arriba/abajo, Home y End mueven el foco entre encabezados.',
            ),
            code: `import { Accordion, AccordionItem } from "vaiperui";

<Accordion type="single" collapsible defaultValue="payment">
  <AccordionItem value="payment" title="${t("Which payment methods?", "Quais formas de pagamento?", "¿Qué formas de pago?")}">
    ${t("We accept credit card, bank slip and Pix.", "Aceitamos cartão de crédito, boleto e Pix.", "Aceptamos tarjeta de crédito, boleto y Pix.")}
  </AccordionItem>
</Accordion>`,
            demo: (
                <Accordion
                    type="single"
                    collapsible
                    defaultValue="payment"
                    className="w-full max-w-md"
                >
                    {faq}
                </Accordion>
            ),
            props: [
                row(
                    "type",
                    "single | multiple",
                    t("required", "obrigatório", "obligatorio"),
                    "One or several sections open",
                    "Uma ou várias seções abertas",
                    "Una o varias secciones abiertas",
                ),
                row(
                    "collapsible",
                    "boolean",
                    "false",
                    "Single only: allow closing the open section",
                    "Só single: permite fechar a seção aberta",
                    "Solo single: permite cerrar la sección abierta",
                ),
                row(
                    "value / defaultValue",
                    "string | string[]",
                    none,
                    "Open item value(s), controlled / initial",
                    "Valor(es) aberto(s), controlado / inicial",
                    "Valor(es) abierto(s), controlado / inicial",
                ),
                row(
                    "onValueChange",
                    "(value) => void",
                    none,
                    'Called with the new value(s); "" when single closes',
                    'Chamado com o(s) novo(s) valor(es); "" quando o single fecha',
                    'Llamado con el/los nuevo(s) valor(es); "" cuando el single cierra',
                ),
                row(
                    "variantColor",
                    "primary | success | warning | danger",
                    "primary",
                    "Focus ring color",
                    "Cor do anel de foco",
                    "Color del anillo de foco",
                ),
                customRow("the focus ring", "o anel de foco", "el anillo de foco"),
                row(
                    "animation",
                    "none | smooth | fast | bounce",
                    "smooth",
                    "Chevron transition",
                    "Transição do ícone",
                    "Transición del ícono",
                ),
                row(
                    "value (item)",
                    "string",
                    t("required", "obrigatório", "obligatorio"),
                    "AccordionItem identifier",
                    "Identificador do AccordionItem",
                    "Identificador del AccordionItem",
                ),
                row(
                    "title (item)",
                    "ReactNode",
                    t("required", "obrigatório", "obligatorio"),
                    "AccordionItem header",
                    "Cabeçalho do AccordionItem",
                    "Encabezado del AccordionItem",
                ),
                row(
                    "disabled (item)",
                    "boolean",
                    "false",
                    "Cannot be expanded or focused",
                    "Não pode ser expandido nem focado",
                    "No se puede expandir ni enfocar",
                ),
                native("div"),
            ],
        },
    ];
}

export function getDataDisplayVariations(locale: Locale): Record<string, VariationGroup[]> {
    const t = makeT(locale);
    const colorsTitle = t("Colors", "Cores", "Colores");
    const colorsFile = t("colors.tsx", "cores.tsx", "colores.tsx");
    const sizesTitle = t("Sizes", "Tamanhos", "Tamaños");
    const sizesFile = t("sizes.tsx", "tamanhos.tsx", "tamanos.tsx");
    const customTitle = t("Custom color", "Cor personalizada", "Color personalizado");
    const customFile = t("custom-color.tsx", "cor-personalizada.tsx", "color-personalizado.tsx");
    const radiusTitle = t("Radius", "Radius", "Radius");
    const orange = t("Orange", "Laranja", "Naranja");
    const violet = t("Violet", "Violeta", "Violeta");
    const RADII = ["none", "sm", "md", "lg", "full"] as const;

    const custom = (
        tag: string,
        render: (p: { customColor: string | { light: string; dark: string } }) => ReactNode,
        extra = "",
    ): VariationGroup => ({
        title: customTitle,
        file: customFile,
        code: `<${tag}${extra} customColor="#ff6600" />\n<${tag}${extra} customColor={{ light: "#a855f7", dark: "#fde047" }} />`,
        items: [
            { label: orange, node: render({ customColor: "#ff6600" }) },
            { label: violet, node: render({ customColor: { light: "#a855f7", dark: "#fde047" } }) },
        ],
    });

    return {
        avatar: [
            {
                title: sizesTitle,
                file: sizesFile,
                code: SIZES.map((s) => `<Avatar name="Ada Lovelace" size="${s}" />`).join("\n"),
                items: SIZES.map((s) => ({
                    label: s,
                    node: <Avatar name="Ada Lovelace" size={s} />,
                })),
            },
            {
                title: colorsTitle,
                file: colorsFile,
                code: COLORS.map((c) => `<Avatar name="Ada Lovelace" variantColor="${c}" />`).join(
                    "\n",
                ),
                items: COLORS.map((c) => ({
                    label: c,
                    node: <Avatar name="Ada Lovelace" variantColor={c} />,
                })),
            },
            {
                title: radiusTitle,
                file: t("radius.tsx", "radius.tsx", "radius.tsx"),
                code: RADII.map((r) => `<Avatar name="Ada Lovelace" radius="${r}" />`).join("\n"),
                items: RADII.map((r) => ({
                    label: r,
                    node: <Avatar name="Ada Lovelace" radius={r} />,
                })),
            },
            custom('Avatar name="Ada Lovelace"', (p) => <Avatar name="Ada Lovelace" {...p} />),
        ],
        badge: [
            {
                title: t("Statuses", "Status", "Estados"),
                file: t("statuses.tsx", "status.tsx", "estados.tsx"),
                code: STATUSES.map((s) => `<Badge status="${s}">${s}</Badge>`).join("\n"),
                items: STATUSES.map((s) => ({ label: s, node: <Badge status={s}>{s}</Badge> })),
            },
            {
                title: t("With dot", "Com ponto", "Con punto"),
                file: t("dot.tsx", "ponto.tsx", "punto.tsx"),
                code: STATUSES.map((s) => `<Badge status="${s}" dot>${s}</Badge>`).join("\n"),
                items: STATUSES.map((s) => ({
                    label: s,
                    node: (
                        <Badge status={s} dot>
                            {s}
                        </Badge>
                    ),
                })),
            },
            {
                title: sizesTitle,
                file: sizesFile,
                code: SIZES.map((s) => `<Badge size="${s}">${s}</Badge>`).join("\n"),
                items: SIZES.map((s) => ({ label: s, node: <Badge size={s}>{s}</Badge> })),
            },
            custom("Badge", (p) => <Badge {...p}>{orange}</Badge>),
        ],
        tag: [
            {
                title: t("Variants", "Variantes", "Variantes"),
                file: t("variants.tsx", "variantes.tsx", "variantes.tsx"),
                code: `<Tag>filled</Tag>\n<Tag variant="outline">outline</Tag>`,
                items: [
                    { label: "filled", node: <Tag>filled</Tag> },
                    { label: "outline", node: <Tag variant="outline">outline</Tag> },
                ],
            },
            {
                title: colorsTitle,
                file: colorsFile,
                code: COLORS.map((c) => `<Tag variantColor="${c}">${c}</Tag>`).join("\n"),
                items: COLORS.map((c) => ({ label: c, node: <Tag variantColor={c}>{c}</Tag> })),
            },
            {
                title: sizesTitle,
                file: sizesFile,
                code: SIZES.map((s) => `<Tag size="${s}">${s}</Tag>`).join("\n"),
                items: SIZES.map((s) => ({ label: s, node: <Tag size={s}>{s}</Tag> })),
            },
            custom("Tag", (p) => <Tag {...p}>{orange}</Tag>),
        ],
        card: [
            {
                title: t("Padding", "Padding", "Padding"),
                file: t("padding.tsx", "padding.tsx", "padding.tsx"),
                code: (["none", "md", "lg"] as const)
                    .map((p) => `<Card padding="${p}">${p}</Card>`)
                    .join("\n"),
                items: (["none", "md", "lg"] as const).map((p) => ({
                    label: p,
                    node: <Card padding={p}>{p}</Card>,
                })),
            },
            {
                title: radiusTitle,
                file: t("radius.tsx", "radius.tsx", "radius.tsx"),
                code: RADII.map((r) => `<Card radius="${r}">${r}</Card>`).join("\n"),
                items: RADII.map((r) => ({ label: r, node: <Card radius={r}>{r}</Card> })),
            },
        ],
        list: [
            {
                title: t("Divided", "Com divisórias", "Con divisores"),
                file: t("divided.tsx", "divisorias.tsx", "divisores.tsx"),
                code: `<List divided>\n  <ListItem title="Camila Souza" description="Designer" />\n  <ListItem title="Yuki Tanaka" description="Engineer" />\n</List>`,
                items: [
                    {
                        label: "divided",
                        node: (
                            <List divided className="w-64">
                                <ListItem title="Camila Souza" description="Designer" />
                                <ListItem title="Yuki Tanaka" description="Engineer" />
                            </List>
                        ),
                    },
                ],
            },
        ],
        table: [
            {
                title: t("Striped", "Zebrada", "Cebra"),
                file: t("striped.tsx", "zebrada.tsx", "cebra.tsx"),
                code: `<Table striped>…</Table>`,
                items: [
                    {
                        label: "striped",
                        node: (
                            <Table striped className="w-72">
                                <TableBody>
                                    {NAMES.map((n) => (
                                        <TableRow key={n}>
                                            <TableCell>{n}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ),
                    },
                ],
            },
        ],
        accordion: [
            {
                title: t("Multiple", "Múltiplo", "Múltiple"),
                file: t("multiple.tsx", "multiplo.tsx", "multiple.tsx"),
                code: `<Accordion type="multiple" defaultValue={["payment", "shipping"]}>…</Accordion>`,
                items: [
                    {
                        label: "multiple",
                        node: (
                            <Accordion type="multiple" defaultValue={["a", "b"]} className="w-72">
                                <AccordionItem value="a" title="A">
                                    …
                                </AccordionItem>
                                <AccordionItem value="b" title="B">
                                    …
                                </AccordionItem>
                            </Accordion>
                        ),
                    },
                ],
            },
            {
                title: colorsTitle,
                file: colorsFile,
                code: COLORS.map(
                    (c) => `<Accordion type="single" variantColor="${c}">…</Accordion>`,
                ).join("\n"),
                items: COLORS.map((c) => ({
                    label: c,
                    node: (
                        <Accordion type="single" variantColor={c} className="w-56">
                            <AccordionItem value="a" title={c}>
                                …
                            </AccordionItem>
                        </Accordion>
                    ),
                })),
            },
        ],
    };
}
