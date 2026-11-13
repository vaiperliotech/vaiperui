import { Alert, Banner, Skeleton } from "vaiperui";

import { DismissibleDemo, ToastDemo } from "@/components/FeedbackDemo";
import type { Locale } from "@/i18n/config";
import type { ComponentEntry, PropRow } from "./components";
import { makeT } from "./samples";
import type { VariationGroup } from "./variations";

const COLORS = ["primary", "success", "warning", "danger"] as const;
const SIZES = ["sm", "md", "lg"] as const;

export function getFeedbackComponents(locale: Locale): ComponentEntry[] {
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

    const colorRows = (): PropRow[] => [
        row(
            "variantColor",
            "primary | success | warning | danger",
            "primary",
            "Color and default icon. warning and danger use role=alert, the rest role=status",
            "Cor e ícone padrão. warning e danger usam role=alert, os demais role=status",
            "Color e icono por defecto. warning y danger usan role=alert, los demás role=status",
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
            "Padding and text size",
            "Espaçamento e tamanho do texto",
            "Espaciado y tamaño del texto",
        ),
    ];
    const messageRows: PropRow[] = [
        row(
            "icon",
            "ReactNode | false",
            t("status icon", "ícone de status", "icono de estado"),
            "Your own icon, or false to hide it",
            "Seu próprio ícone, ou false para ocultar",
            "Tu propio icono, o false para ocultarlo",
        ),
        row(
            "action",
            "ReactNode",
            none,
            "Slot for an action, such as a small ghost Button or a link",
            "Espaço para uma ação, como um Button pequeno transparente ou um link",
            "Espacio para una acción, como un Button pequeño transparente o un enlace",
        ),
        row(
            "onDismiss",
            "() => void",
            none,
            "Shows the close button and runs on click; you decide whether to unmount",
            "Mostra o botão de fechar e roda ao clicar; você decide se desmonta",
            "Muestra el botón de cerrar y se ejecuta al hacer clic; tú decides si desmontar",
        ),
        row(
            "dismissLabel",
            "string",
            "Dismiss",
            "Accessible name of the close button",
            "Nome acessível do botão de fechar",
            "Nombre accesible del botón de cerrar",
        ),
    ];
    const native = row(
        t("(native)", "(nativas)", "(nativas)"),
        "HTMLAttributes<HTMLDivElement>",
        none,
        "role (overrides the default), className, style, aria-*, ref, etc.",
        "role (substitui o padrão), className, style, aria-*, ref etc.",
        "role (reemplaza el predeterminado), className, style, aria-*, ref, etc.",
    );

    const alertText = t(
        "Your changes were saved.",
        "Suas alterações foram salvas.",
        "Tus cambios se guardaron.",
    );
    const restore = t("Show again", "Mostrar de novo", "Mostrar de nuevo");
    const close = t("Dismiss", "Fechar", "Cerrar");

    return [
        {
            slug: "alert",
            name: "Alert",
            blurb: t(
                "Inline message with a title, description, icon, optional action and a close button.",
                "Mensagem inline com título, descrição, ícone, ação opcional e botão de fechar.",
                "Mensaje en línea con título, descripción, icono, acción opcional y botón de cerrar.",
            ),
            usage: t(
                'Use it for feedback tied to a place on the page, such as form validation or an integration status. `warning` and `danger` are announced assertively (`role="alert"`), the others politely. The close button only appears with `onDismiss`. For transient notices use `Toast`, for page-wide ones `Banner`.',
                'Use para feedback ligado a um lugar da página, como validação de formulário ou status de integração. `warning` e `danger` são anunciados de forma assertiva (`role="alert"`), os demais de forma educada. O botão de fechar só aparece com `onDismiss`. Para avisos temporários use `Toast`, para os da página inteira `Banner`.',
                'Úsalo para feedback ligado a un lugar de la página, como validación de formularios o estado de una integración. `warning` y `danger` se anuncian de forma asertiva (`role="alert"`), los demás de forma cortés. El botón de cerrar solo aparece con `onDismiss`. Para avisos temporales usa `Toast`, para los de toda la página `Banner`.',
            ),
            code: `import { Alert, Button } from "vaiperui";

<Alert variantColor="success" title="${t("Saved", "Salvo", "Guardado")}">
  ${alertText}
</Alert>
<Alert
  variantColor="warning"
  title="${t("Unsaved changes", "Alterações não salvas", "Cambios sin guardar")}"
  action={<Button size="sm" variant="transparent">${t("Save now", "Salvar agora", "Guardar ahora")}</Button>}
  onDismiss={() => setOpen(false)}
>
  ...
</Alert>`,
            demo: (
                <div className="flex w-full max-w-md flex-col gap-3">
                    <Alert variantColor="success" title={t("Saved", "Salvo", "Guardado")}>
                        {alertText}
                    </Alert>
                    <DismissibleDemo
                        kind="alert"
                        variantColor="warning"
                        title={t("Unsaved changes", "Alterações não salvas", "Cambios sin guardar")}
                        text={t(
                            "You have pending edits.",
                            "Você tem edições pendentes.",
                            "Tienes ediciones pendientes.",
                        )}
                        actionLabel={t("Save now", "Salvar agora", "Guardar ahora")}
                        restoreLabel={restore}
                        dismissLabel={close}
                    />
                </div>
            ),
            props: [
                ...colorRows(),
                row(
                    "radius",
                    "none | sm | md | lg | full",
                    "lg",
                    "Corner rounding",
                    "Arredondamento dos cantos",
                    "Redondeo de las esquinas",
                ),
                row(
                    "title",
                    "ReactNode",
                    none,
                    "Bold summary above the description (the children)",
                    "Resumo em negrito acima da descrição (os children)",
                    "Resumen en negrita sobre la descripción (los children)",
                ),
                ...messageRows,
                native,
            ],
        },
        {
            slug: "banner",
            name: "Banner",
            blurb: t(
                "Full-width page-level message, with an optional action and close button.",
                "Mensagem de página inteira, com ação opcional e botão de fechar.",
                "Mensaje de página completa, con acción opcional y botón de cerrar.",
            ),
            usage: t(
                "Fills the width of its container with no radius, so place it at the top of the page. Use it for maintenance windows, announcements and trial notices. Same status roles as `Alert`.",
                "Ocupa a largura do container, sem arredondamento, então coloque-o no topo da página. Use para janelas de manutenção, anúncios e avisos de teste. Mesmos roles de status do `Alert`.",
                "Ocupa el ancho de su contenedor sin redondeo, así que colócalo arriba de la página. Úsalo para ventanas de mantenimiento, anuncios y avisos de prueba. Mismos roles de estado que `Alert`.",
            ),
            code: `import { Banner, Button } from "vaiperui";

<Banner
  action={<Button size="sm" variant="transparent">${t("Learn more", "Saiba mais", "Saber más")}</Button>}
  onDismiss={() => setOpen(false)}
>
  ${t("Scheduled maintenance today at 10 PM.", "Manutenção programada hoje às 22h.", "Mantenimiento programado hoy a las 22 h.")}
</Banner>`,
            demo: (
                <div className="w-full max-w-xl overflow-hidden rounded-lg">
                    <DismissibleDemo
                        kind="banner"
                        variantColor="primary"
                        text={t(
                            "Scheduled maintenance today at 10 PM.",
                            "Manutenção programada hoje às 22h.",
                            "Mantenimiento programado hoy a las 22 h.",
                        )}
                        actionLabel={t("Learn more", "Saiba mais", "Saber más")}
                        restoreLabel={restore}
                        dismissLabel={close}
                    />
                </div>
            ),
            props: [...colorRows(), ...messageRows, native],
        },
        {
            slug: "toast",
            name: "Toast",
            blurb: t(
                "Transient notifications fired from anywhere with toast(), rendered by a single Toaster.",
                "Notificações temporárias disparadas de qualquer lugar com toast(), renderizadas por um único Toaster.",
                "Notificaciones temporales disparadas desde cualquier lugar con toast(), renderizadas por un único Toaster.",
            ),
            usage: t(
                "Mount `<Toaster />` once near the root, then call `toast({ ... })` (or `useToast()`) anywhere; it returns the id, and `toast.dismiss(id)` closes it. Toasts stack in a portal region, auto-close after `duration` (5000 ms) and pause while hovered or focused; `Esc` closes the focused one. `warning` and `danger` are announced assertively.",
                "Monte `<Toaster />` uma vez perto da raiz e chame `toast({ ... })` (ou `useToast()`) em qualquer lugar; retorna o id, e `toast.dismiss(id)` fecha. Os toasts se empilham numa região em portal, fecham sozinhos após `duration` (5000 ms) e pausam com hover ou foco; `Esc` fecha o focado. `warning` e `danger` são anunciados de forma assertiva.",
                "Monta `<Toaster />` una vez cerca de la raíz y llama `toast({ ... })` (o `useToast()`) desde cualquier lugar; devuelve el id, y `toast.dismiss(id)` lo cierra. Los toasts se apilan en una región en portal, se cierran solos tras `duration` (5000 ms) y se pausan con hover o foco; `Esc` cierra el enfocado. `warning` y `danger` se anuncian de forma asertiva.",
            ),
            code: `import { Toaster, toast } from "vaiperui";

// once, at the app root
<Toaster position="top-right" />

toast({ variantColor: "success", title: "${t("Saved", "Salvo", "Guardado")}", description: "${alertText}" })
toast({
  description: "${t("Item removed.", "Item removido.", "Elemento eliminado.")}",
  action: { label: "${t("Undo", "Desfazer", "Deshacer")}", onClick: restore },
})`,
            demo: (
                <ToastDemo
                    undoLabel={t("Undo", "Desfazer", "Deshacer")}
                    dismissLabel={close}
                    buttons={[
                        {
                            label: t("Success", "Sucesso", "Éxito"),
                            variantColor: "success",
                            title: t("Saved", "Salvo", "Guardado"),
                            description: alertText,
                        },
                        {
                            label: t("Error", "Erro", "Error"),
                            variantColor: "danger",
                            description: t(
                                "Could not connect.",
                                "Não foi possível conectar.",
                                "No se pudo conectar.",
                            ),
                        },
                        {
                            label: t("With action", "Com ação", "Con acción"),
                            description: t(
                                "Item removed.",
                                "Item removido.",
                                "Elemento eliminado.",
                            ),
                            withAction: true,
                        },
                    ]}
                />
            ),
            props: [
                row(
                    "position",
                    "top-left | top-center | top-right | bottom-left | bottom-center | bottom-right",
                    "top-right",
                    "Toaster: where the stack sits",
                    "Toaster: onde a pilha fica",
                    "Toaster: dónde queda la pila",
                ),
                row(
                    "limit",
                    "number",
                    "5",
                    "Toaster: most toasts shown at once",
                    "Toaster: máximo de toasts visíveis",
                    "Toaster: máximo de toasts visibles",
                ),
                row(
                    "duration",
                    "number",
                    "5000",
                    "Toaster default, or per toast: ms before auto-close; 0 keeps it until dismissed",
                    "Padrão do Toaster, ou por toast: ms até fechar sozinho; 0 mantém até fechar",
                    "Predeterminado del Toaster, o por toast: ms hasta cerrarse; 0 lo mantiene hasta cerrar",
                ),
                row(
                    "label",
                    "string",
                    "Notifications",
                    "Toaster: accessible name of the region",
                    "Toaster: nome acessível da região",
                    "Toaster: nombre accesible de la región",
                ),
                row(
                    "dismissLabel",
                    "string",
                    "Dismiss",
                    "Toaster: accessible name of the close buttons",
                    "Toaster: nome acessível dos botões de fechar",
                    "Toaster: nombre accesible de los botones de cerrar",
                ),
                row(
                    "radius",
                    "none | sm | md | lg | full",
                    "lg",
                    "Toaster: corner rounding",
                    "Toaster: arredondamento dos cantos",
                    "Toaster: redondeo de las esquinas",
                ),
                row(
                    "title / description",
                    "ReactNode",
                    none,
                    "toast(): the content (a plain string works as the description)",
                    "toast(): o conteúdo (uma string simples vira a descrição)",
                    "toast(): el contenido (un string simple es la descripción)",
                ),
                row(
                    "variantColor / customColor",
                    "primary | success | warning | danger / CSS color",
                    "primary",
                    "toast(): color; customColor overrides it",
                    "toast(): cor; customColor a substitui",
                    "toast(): color; customColor lo reemplaza",
                ),
                row(
                    "icon",
                    "ReactNode | false",
                    t("status icon", "ícone de status", "icono de estado"),
                    "toast(): your own icon, or false to hide it",
                    "toast(): seu ícone, ou false para ocultar",
                    "toast(): tu icono, o false para ocultarlo",
                ),
                row(
                    "action",
                    "{ label, onClick }",
                    none,
                    "toast(): an action button; it also closes the toast",
                    "toast(): botão de ação; também fecha o toast",
                    "toast(): botón de acción; también cierra el toast",
                ),
                row(
                    "dismissible",
                    "boolean",
                    "true",
                    "toast(): show the close button",
                    "toast(): mostrar o botão de fechar",
                    "toast(): mostrar el botón de cerrar",
                ),
                row(
                    "id / onClose",
                    "string / () => void",
                    none,
                    "toast(): a repeated id replaces the toast; onClose runs when it closes",
                    "toast(): id repetido substitui o toast; onClose roda ao fechar",
                    "toast(): un id repetido reemplaza el toast; onClose se ejecuta al cerrar",
                ),
            ],
        },
        {
            slug: "skeleton",
            name: "Skeleton",
            blurb: t(
                "Loading placeholder shaped like the content: text lines, title, avatar, rectangle or card.",
                "Placeholder de carregamento com a forma do conteúdo: linhas de texto, título, avatar, retângulo ou card.",
                "Marcador de carga con la forma del contenido: líneas de texto, título, avatar, rectángulo o tarjeta.",
            ),
            usage: t(
                "Decorative (`aria-hidden`), so set `aria-busy` on the container while loading. The pulse stops under `prefers-reduced-motion`. Resize with `width`/`height` or `className`; `lines` draws several text lines, the last one shorter.",
                "Decorativo (`aria-hidden`), então use `aria-busy` no container enquanto carrega. O pulso para com `prefers-reduced-motion`. Redimensione com `width`/`height` ou `className`; `lines` desenha várias linhas de texto, a última menor.",
                "Decorativo (`aria-hidden`), así que usa `aria-busy` en el contenedor mientras carga. El pulso se detiene con `prefers-reduced-motion`. Cambia el tamaño con `width`/`height` o `className`; `lines` dibuja varias líneas de texto, la última más corta.",
            ),
            code: `import { Skeleton } from "vaiperui";

<div aria-busy={loading}>
  <Skeleton variant="avatar" />
  <Skeleton variant="title" width="60%" />
  <Skeleton lines={3} />
</div>`,
            demo: (
                <div aria-busy="true" className="flex w-full max-w-sm gap-3">
                    <Skeleton variant="avatar" />
                    <div className="flex flex-1 flex-col gap-2">
                        <Skeleton variant="title" width="60%" />
                        <Skeleton lines={3} />
                    </div>
                </div>
            ),
            props: [
                row(
                    "variant",
                    "text | title | avatar | rectangle | card",
                    "text",
                    "Shape and default size",
                    "Forma e tamanho padrão",
                    "Forma y tamaño por defecto",
                ),
                row(
                    "lines",
                    "number",
                    "1",
                    "text only: number of lines; the last of several is shorter",
                    "só text: número de linhas; a última de várias é menor",
                    "solo text: número de líneas; la última de varias es más corta",
                ),
                row(
                    "width / height",
                    "number | string",
                    t("per variant", "por variante", "por variante"),
                    "CSS size (a number is px)",
                    "Tamanho CSS (número é px)",
                    "Tamaño CSS (un número es px)",
                ),
                row(
                    "radius",
                    "none | sm | md | lg | full",
                    t("per variant", "por variante", "por variante"),
                    "Overrides the corner rounding",
                    "Substitui o arredondamento",
                    "Reemplaza el redondeo",
                ),
                row(
                    "animation",
                    "pulse | none",
                    "pulse",
                    "Pulse is off with prefers-reduced-motion",
                    "O pulso desliga com prefers-reduced-motion",
                    "El pulso se apaga con prefers-reduced-motion",
                ),
                native,
            ],
        },
    ];
}

export function getFeedbackVariations(locale: Locale): Record<string, VariationGroup[]> {
    const t = makeT(locale);
    const colorsTitle = t("Colors", "Cores", "Colores");
    const colorsFile = t("colors.tsx", "cores.tsx", "colores.tsx");
    const sizesTitle = t("Sizes", "Tamanhos", "Tamaños");
    const sizesFile = t("sizes.tsx", "tamanhos.tsx", "tamanos.tsx");
    const customTitle = t("Custom color", "Cor personalizada", "Color personalizado");
    const customFile = t("custom-color.tsx", "cor-personalizada.tsx", "color-personalizado.tsx");
    const text = t(
        "Your changes were saved.",
        "Suas alterações foram salvas.",
        "Tus cambios se guardaron.",
    );
    const violet = t("Violet", "Violeta", "Violeta");

    const message = (
        tag: "Alert" | "Banner",
        Component: typeof Alert | typeof Banner,
    ): VariationGroup[] => [
        {
            title: colorsTitle,
            file: colorsFile,
            code: COLORS.map((c) => `<${tag} variantColor="${c}">${c}</${tag}>`).join("\n"),
            items: COLORS.map((c) => ({
                label: c,
                node: <Component variantColor={c}>{c}</Component>,
            })),
        },
        {
            title: sizesTitle,
            file: sizesFile,
            code: SIZES.map((s) => `<${tag} size="${s}">${s}</${tag}>`).join("\n"),
            items: SIZES.map((s) => ({ label: s, node: <Component size={s}>{s}</Component> })),
        },
        {
            title: customTitle,
            file: customFile,
            code: `<${tag} customColor="#8b5cf6">${violet}</${tag}>`,
            items: [{ label: violet, node: <Component customColor="#8b5cf6">{violet}</Component> }],
        },
    ];

    return {
        alert: message("Alert", Alert),
        banner: message("Banner", Banner),
        toast: [
            {
                title: colorsTitle,
                file: colorsFile,
                code: COLORS.map(
                    (c) => `toast({ variantColor: "${c}", description: "${c}" })`,
                ).join("\n"),
                items: [
                    {
                        label: "variantColor",
                        node: (
                            <ToastDemo
                                undoLabel="Undo"
                                dismissLabel={t("Dismiss", "Fechar", "Cerrar")}
                                buttons={COLORS.map((c) => ({
                                    label: c,
                                    variantColor: c,
                                    description: text,
                                }))}
                            />
                        ),
                    },
                ],
            },
            {
                title: t(
                    "Persistent and custom",
                    "Persistente e personalizado",
                    "Persistente y personalizado",
                ),
                file: t("persistent.tsx", "persistente.tsx", "persistente.tsx"),
                code: `toast({ description: "...", duration: 0 })
toast({ customColor: "#8b5cf6", description: "${violet}" })`,
                items: [
                    {
                        label: "duration: 0",
                        node: (
                            <ToastDemo
                                undoLabel="Undo"
                                dismissLabel={t("Dismiss", "Fechar", "Cerrar")}
                                buttons={[
                                    {
                                        label: "duration: 0",
                                        description: t(
                                            "Stays until closed",
                                            "Fica até fechar",
                                            "Se queda hasta cerrar",
                                        ),
                                        duration: 0,
                                    },
                                    { label: violet, customColor: "#8b5cf6", description: violet },
                                ]}
                            />
                        ),
                    },
                ],
            },
        ],
        skeleton: [
            {
                title: t("Variants", "Variantes", "Variantes"),
                file: t("variants.tsx", "variantes.tsx", "variantes.tsx"),
                code: `<Skeleton variant="text" />
<Skeleton variant="title" />
<Skeleton variant="avatar" />
<Skeleton variant="rectangle" />
<Skeleton variant="card" />`,
                items: (["text", "title", "avatar", "rectangle", "card"] as const).map((v) => ({
                    label: v,
                    node: (
                        <div className="w-48">
                            <Skeleton variant={v} />
                        </div>
                    ),
                })),
            },
            {
                title: t("Lines and static", "Linhas e estático", "Líneas y estático"),
                file: t("lines.tsx", "linhas.tsx", "lineas.tsx"),
                code: `<Skeleton lines={3} />
<Skeleton animation="none" variant="card" />`,
                items: [
                    {
                        label: "lines={3}",
                        node: (
                            <div className="w-48">
                                <Skeleton lines={3} />
                            </div>
                        ),
                    },
                    {
                        label: 'animation="none"',
                        node: (
                            <div className="w-48">
                                <Skeleton variant="card" animation="none" />
                            </div>
                        ),
                    },
                ],
            },
        ],
    };
}
