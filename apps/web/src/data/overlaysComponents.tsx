import {
    Button,
    Drawer,
    DrawerClose,
    Modal,
    ModalClose,
    Popover,
    PopoverClose,
    Tooltip,
} from "vaiperui";

import { ControlledModalDemo, MenuSelectDemo } from "@/components/OverlayDemo";
import type { Locale } from "@/i18n/config";
import type { ComponentEntry, PropRow } from "./components";
import { makeT } from "./samples";
import type { VariationGroup } from "./variations";

const SIDES = ["top", "right", "bottom", "left"] as const;
const COLORS = ["neutral", "primary", "success", "warning", "danger"] as const;

export function getOverlaysComponents(locale: Locale): ComponentEntry[] {
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
    const openRow = row(
        "open / defaultOpen / onOpenChange",
        "boolean / boolean / (open) => void",
        none,
        "Controlled or uncontrolled open state",
        "Estado aberto controlado ou não controlado",
        "Estado abierto controlado o no controlado",
    );
    const triggerRow = (en: string, pt: string, es: string) =>
        row("trigger", "ReactElement", none, en, pt, es);
    const styleRow = row(
        "radius / animation",
        "none | sm | md | lg | full / none | smooth | fast | bounce",
        "lg / smooth",
        "Corner radius and enter transition speed",
        "Arredondamento e velocidade da transição de entrada",
        "Redondeo y velocidad de la transición de entrada",
    );
    const dialogRows = [
        row(
            "title",
            "ReactNode",
            t("required", "obrigatório", "obligatorio"),
            "Heading and accessible name (aria-labelledby)",
            "Título e nome acessível (aria-labelledby)",
            "Título y nombre accesible (aria-labelledby)",
        ),
        row(
            "footer",
            "ReactNode",
            none,
            "Action buttons; without it neither the footer nor its divider render",
            "Botões de ação; sem ele nem o rodapé nem a divisória aparecem",
            "Botones de acción; sin él no se muestran ni el pie ni su divisor",
        ),
        triggerRow(
            "Element that opens it; not needed when controlled",
            "Elemento que abre; desnecessário quando controlado",
            "Elemento que lo abre; innecesario si es controlado",
        ),
        openRow,
        row(
            "showClose / closeLabel",
            "boolean / string",
            'true / "Close"',
            "× button in the header and its accessible name",
            "Botão × no cabeçalho e seu nome acessível",
            "Botón × en el encabezado y su nombre accesible",
        ),
        row(
            "closeOnEscape / closeOnBackdropClick",
            "boolean",
            "true",
            "Whether Escape or a backdrop click closes it",
            "Se Esc ou clique no fundo fecham",
            "Si Esc o clic en el fondo lo cierran",
        ),
    ];
    const controlledLabels = {
        open: t("Open controlled modal", "Abrir modal controlado", "Abrir modal controlado"),
        title: t("Delete project?", "Excluir projeto?", "¿Eliminar proyecto?"),
        body: t(
            "This action cannot be undone.",
            "Esta ação não pode ser desfeita.",
            "Esta acción no se puede deshacer.",
        ),
        cancel: t("Cancel", "Cancelar", "Cancelar"),
        confirm: t("Delete", "Excluir", "Eliminar"),
        closeLabel: t("Close", "Fechar", "Cerrar"),
    };

    return [
        {
            slug: "modal",
            name: "Modal",
            blurb: t(
                'Dialog over a backdrop with focus trap, scroll lock, Escape/backdrop close and role="dialog".',
                'Diálogo sobre um fundo escurecido com foco preso, bloqueio de rolagem, fechamento por Esc/fundo e role="dialog".',
                'Diálogo sobre un fondo oscurecido con foco atrapado, bloqueo de scroll, cierre por Esc/fondo y role="dialog".',
            ),
            usage: t(
                "Rendered in a portal with `aria-modal`, named by `title`. Focus moves in when it opens and returns to the trigger on close; Tab stays inside and the page behind does not scroll. Pass `trigger` for the uncontrolled case, or `open` + `onOpenChange` to control it. Wrap a footer button in `ModalClose` to close it.",
                "Renderizado em um portal com `aria-modal`, nomeado por `title`. O foco entra ao abrir e volta ao gatilho ao fechar; o Tab fica dentro e a página atrás não rola. Passe `trigger` no caso não controlado, ou `open` + `onOpenChange` para controlar. Envolva um botão do rodapé em `ModalClose` para fechar.",
                "Renderizado en un portal con `aria-modal`, nombrado por `title`. El foco entra al abrir y vuelve al disparador al cerrar; el Tab queda dentro y la página de atrás no se desplaza. Pasa `trigger` en el caso no controlado, o `open` + `onOpenChange` para controlarlo. Envuelve un botón del pie en `ModalClose` para cerrar.",
            ),
            code: `import { Button, Modal, ModalClose } from "vaiperui";

<Modal
  trigger={<Button>${t("Open", "Abrir", "Abrir")}</Button>}
  title="${controlledLabels.title}"
  footer={
    <>
      <ModalClose><Button variant="outlined">${controlledLabels.cancel}</Button></ModalClose>
      <ModalClose><Button variantColor="danger">${controlledLabels.confirm}</Button></ModalClose>
    </>
  }
>
  ${controlledLabels.body}
</Modal>`,
            demo: (
                <Modal
                    trigger={<Button>{t("Open modal", "Abrir modal", "Abrir modal")}</Button>}
                    title={controlledLabels.title}
                    closeLabel={controlledLabels.closeLabel}
                    footer={
                        <>
                            <ModalClose>
                                <Button variant="outlined">{controlledLabels.cancel}</Button>
                            </ModalClose>
                            <ModalClose>
                                <Button variantColor="danger">{controlledLabels.confirm}</Button>
                            </ModalClose>
                        </>
                    }
                >
                    {controlledLabels.body}
                </Modal>
            ),
            props: [
                ...dialogRows,
                row(
                    "size",
                    "sm | md | lg",
                    "sm",
                    "Max width: 480, 640 or 800px",
                    "Largura máxima: 480, 640 ou 800px",
                    "Ancho máximo: 480, 640 u 800px",
                ),
                row(
                    "showHeaderDivider / showFooterDivider",
                    "boolean",
                    "true",
                    "Lines between header, body and footer",
                    "Linhas entre cabeçalho, corpo e rodapé",
                    "Líneas entre encabezado, cuerpo y pie",
                ),
                styleRow,
            ],
        },
        {
            slug: "drawer",
            name: "Drawer",
            blurb: t(
                "Side panel that slides from any edge, with the same dialog behavior as Modal.",
                "Painel lateral que desliza de qualquer borda, com o mesmo comportamento de diálogo do Modal.",
                "Panel lateral que se desliza desde cualquier borde, con el mismo comportamiento de diálogo que Modal.",
            ),
            usage: t(
                "Same accessibility as `Modal` (focus trap, scroll lock, Escape, backdrop). `side` picks the edge: left/right panels are up to 400px wide, top/bottom ones span the width up to 80% of the height. Use `DrawerClose` around a button to close from inside.",
                "Mesma acessibilidade do `Modal` (foco preso, bloqueio de rolagem, Esc, fundo). `side` escolhe a borda: painéis esquerdo/direito têm até 400px de largura, topo/base ocupam a largura e até 80% da altura. Use `DrawerClose` em volta de um botão para fechar por dentro.",
                "Misma accesibilidad que `Modal` (foco atrapado, bloqueo de scroll, Esc, fondo). `side` elige el borde: los paneles izquierdo/derecho miden hasta 400px, los de arriba/abajo ocupan el ancho y hasta 80% del alto. Usa `DrawerClose` alrededor de un botón para cerrar desde dentro.",
            ),
            code: `import { Button, Drawer, DrawerClose } from "vaiperui";

<Drawer
  trigger={<Button>${t("Open", "Abrir", "Abrir")}</Button>}
  side="right"
  title="${t("Filters", "Filtros", "Filtros")}"
  footer={<DrawerClose><Button>${t("Apply", "Aplicar", "Aplicar")}</Button></DrawerClose>}
>
  ${t("Drawer content", "Conteúdo do painel", "Contenido del panel")}
</Drawer>`,
            demo: (
                <Drawer
                    trigger={<Button>{t("Open drawer", "Abrir painel", "Abrir panel")}</Button>}
                    title={t("Filters", "Filtros", "Filtros")}
                    closeLabel={controlledLabels.closeLabel}
                    footer={
                        <DrawerClose>
                            <Button>{t("Apply", "Aplicar", "Aplicar")}</Button>
                        </DrawerClose>
                    }
                >
                    {t("Drawer content", "Conteúdo do painel", "Contenido del panel")}
                </Drawer>
            ),
            props: [
                ...dialogRows,
                row(
                    "side",
                    "left | right | top | bottom",
                    "right",
                    "Edge where the panel sits",
                    "Borda onde o painel fica",
                    "Borde donde se coloca el panel",
                ),
                row(
                    "animation",
                    "none | smooth | fast | bounce",
                    "smooth",
                    "Slide-in transition",
                    "Transição de entrada",
                    "Transición de entrada",
                ),
            ],
        },
        {
            slug: "popover",
            name: "Popover",
            blurb: t(
                "Click-triggered panel anchored to an element, with flip/shift and outside click or Escape to close.",
                "Painel aberto por clique, ancorado a um elemento, com flip/shift e fechamento por clique fora ou Esc.",
                "Panel abierto por clic, anclado a un elemento, con flip/shift y cierre por clic fuera o Esc.",
            ),
            usage: t(
                'The trigger gets `aria-expanded` and `aria-controls`; the panel is a `role="dialog"` named by `label`. Focus moves into the panel on open and returns to the trigger on Escape. It can hold interactive content; use `PopoverClose` for an internal close button. For short hints use `Tooltip`.',
                'O gatilho recebe `aria-expanded` e `aria-controls`; o painel é um `role="dialog"` nomeado por `label`. O foco entra no painel ao abrir e volta ao gatilho com Esc. Pode ter conteúdo interativo; use `PopoverClose` para um botão de fechar interno. Para dicas curtas use `Tooltip`.',
                'El disparador recibe `aria-expanded` y `aria-controls`; el panel es un `role="dialog"` nombrado por `label`. El foco entra al panel al abrir y vuelve al disparador con Esc. Puede tener contenido interactivo; usa `PopoverClose` para un botón de cierre interno. Para pistas cortas usa `Tooltip`.',
            ),
            code: `import { Button, Popover, PopoverClose } from "vaiperui";

<Popover trigger={<Button variant="outlined">${t("Details", "Detalhes", "Detalles")}</Button>} label="${t("Details", "Detalhes", "Detalles")}">
  <p>${t("Anchored content.", "Conteúdo ancorado.", "Contenido anclado.")}</p>
  <PopoverClose><Button size="sm">${t("Got it", "Entendi", "Entendido")}</Button></PopoverClose>
</Popover>`,
            demo: (
                <Popover
                    trigger={
                        <Button variant="outlined">{t("Details", "Detalhes", "Detalles")}</Button>
                    }
                    label={t("Details", "Detalhes", "Detalles")}
                >
                    <div className="flex w-56 flex-col items-start gap-2">
                        <p>{t("Anchored content.", "Conteúdo ancorado.", "Contenido anclado.")}</p>
                        <PopoverClose>
                            <Button size="sm">{t("Got it", "Entendi", "Entendido")}</Button>
                        </PopoverClose>
                    </div>
                </Popover>
            ),
            props: [
                triggerRow(
                    "Element that toggles the panel (needs ref, focus and onClick)",
                    "Elemento que alterna o painel (precisa de ref, foco e onClick)",
                    "Elemento que alterna el panel (necesita ref, foco y onClick)",
                ),
                row(
                    "label",
                    "string",
                    t("required", "obrigatório", "obligatorio"),
                    "Accessible name of the panel",
                    "Nome acessível do painel",
                    "Nombre accesible del panel",
                ),
                row(
                    "side / align",
                    "top | right | bottom | left / start | center | end",
                    "bottom / center",
                    "Side of the trigger (flips when there is no room) and alignment",
                    "Lado do gatilho (inverte se não houver espaço) e alinhamento",
                    "Lado del disparador (se invierte si no hay espacio) y alineación",
                ),
                openRow,
                { ...styleRow, defaultValue: "lg / fast" },
            ],
        },
        {
            slug: "menu",
            name: "Menu",
            blurb: t(
                "Dropdown menu button with arrow-key navigation, typeahead, icons, separators and danger items.",
                "Botão de menu suspenso com navegação por setas, busca por digitação, ícones, separadores e itens perigosos.",
                "Botón de menú desplegable con navegación por flechas, búsqueda al escribir, íconos, separadores e ítems peligrosos.",
            ),
            usage: t(
                'The list is `role="menu"` with `menuitem` buttons. Arrows, Home and End move between items (disabled ones are skipped), typing a letter jumps to a match, Enter/Space selects, Escape closes and returns focus to the trigger. `onSelect` runs on click and keyboard; call `event.preventDefault()` there to keep the menu open. Compose it with `MenuItem`, `MenuLabel` and `MenuSeparator`.',
                'A lista é `role="menu"` com botões `menuitem`. Setas, Home e End movem entre itens (desabilitados são pulados), digitar uma letra salta para um item correspondente, Enter/Espaço seleciona, Esc fecha e devolve o foco ao gatilho. `onSelect` roda no clique e no teclado; chame `event.preventDefault()` nele para manter o menu aberto. Monte com `MenuItem`, `MenuLabel` e `MenuSeparator`.',
                'La lista es `role="menu"` con botones `menuitem`. Flechas, Home y End mueven entre ítems (los deshabilitados se saltan), escribir una letra salta a una coincidencia, Enter/Espacio selecciona, Esc cierra y devuelve el foco al disparador. `onSelect` corre al hacer clic y con teclado; llama `event.preventDefault()` ahí para mantener el menú abierto. Se compone con `MenuItem`, `MenuLabel` y `MenuSeparator`.',
            ),
            code: `import { Button, Menu, MenuItem, MenuLabel, MenuSeparator } from "vaiperui";

<Menu trigger={<Button variant="outlined">${t("Actions", "Ações", "Acciones")}</Button>} label="${t("Actions", "Ações", "Acciones")}">
  <MenuLabel>${t("Project", "Projeto", "Proyecto")}</MenuLabel>
  <MenuItem icon="✎" onSelect={() => rename()}>${t("Rename", "Renomear", "Renombrar")}</MenuItem>
  <MenuItem disabled>${t("Archive", "Arquivar", "Archivar")}</MenuItem>
  <MenuSeparator />
  <MenuItem destructive icon="✕">${t("Delete", "Excluir", "Eliminar")}</MenuItem>
</Menu>`,
            demo: (
                <MenuSelectDemo
                    trigger={t("Actions", "Ações", "Acciones")}
                    label={t("Project", "Projeto", "Proyecto")}
                    chosen={t("Chosen", "Escolhido", "Elegido")}
                    items={[
                        { label: t("Rename", "Renomear", "Renombrar"), icon: "✎" },
                        { label: t("Duplicate", "Duplicar", "Duplicar"), icon: "⧉" },
                        { label: t("Archive", "Arquivar", "Archivar"), disabled: true },
                        { label: t("Delete", "Excluir", "Eliminar"), destructive: true, icon: "✕" },
                    ]}
                />
            ),
            props: [
                triggerRow(
                    "Button that opens the menu (needs ref, focus and onClick)",
                    "Botão que abre o menu (precisa de ref, foco e onClick)",
                    "Botón que abre el menú (necesita ref, foco y onClick)",
                ),
                row(
                    "label",
                    "string",
                    none,
                    "Accessible name of the menu",
                    "Nome acessível do menu",
                    "Nombre accesible del menú",
                ),
                row(
                    "side / align",
                    "top | right | bottom | left / start | center | end",
                    "bottom / start",
                    "Side of the trigger and alignment",
                    "Lado do gatilho e alinhamento",
                    "Lado del disparador y alineación",
                ),
                openRow,
                row(
                    "size",
                    "sm | md | lg",
                    "md",
                    "Text size of the items",
                    "Tamanho do texto dos itens",
                    "Tamaño del texto de los ítems",
                ),
                { ...styleRow, defaultValue: "lg / fast" },
                row(
                    "MenuItem",
                    "onSelect, icon, destructive, disabled",
                    none,
                    "Item; `onSelect` runs on click/keyboard and the menu closes unless prevented",
                    "Item; `onSelect` roda no clique/teclado e o menu fecha, a menos que seja impedido",
                    "Ítem; `onSelect` corre con clic/teclado y el menú se cierra salvo que se impida",
                ),
            ],
        },
        {
            slug: "tooltip",
            name: "Tooltip",
            blurb: t(
                'Short description on hover and keyboard focus, with delay, arrow and role="tooltip".',
                'Descrição curta ao passar o mouse e ao focar pelo teclado, com atraso, seta e role="tooltip".',
                'Descripción corta al pasar el mouse y al enfocar con teclado, con retraso, flecha y role="tooltip".',
            ),
            usage: t(
                "The child gets `aria-describedby` while the tooltip is open. It opens after `delayDuration` on hover (immediately on focus) and closes on leave, blur or Escape. It is non-interactive and capped at 240px wide, so do not put links or buttons inside and do not rely on it for essential information (touch screens have no hover).",
                "O filho recebe `aria-describedby` enquanto o tooltip está aberto. Abre após `delayDuration` no hover (na hora no foco) e fecha ao sair, perder o foco ou com Esc. Não é interativo e tem até 240px de largura, então não ponha links ou botões dentro nem dependa dele para informação essencial (telas de toque não têm hover).",
                "El hijo recibe `aria-describedby` mientras el tooltip está abierto. Abre tras `delayDuration` al pasar el mouse (al instante con foco) y cierra al salir, perder el foco o con Esc. No es interactivo y mide hasta 240px, así que no pongas enlaces o botones dentro ni dependas de él para información esencial (las pantallas táctiles no tienen hover).",
            ),
            code: `import { Button, Tooltip } from "vaiperui";

<Tooltip content="${t("Save your changes", "Salve suas alterações", "Guarda tus cambios")}" title="${t("Shortcut", "Atalho", "Atajo")}">
  <Button>${t("Save", "Salvar", "Guardar")}</Button>
</Tooltip>`,
            demo: (
                <Tooltip
                    title={t("Shortcut", "Atalho", "Atajo")}
                    content={t("Save your changes", "Salve suas alterações", "Guarda tus cambios")}
                >
                    <Button>{t("Save", "Salvar", "Guardar")}</Button>
                </Tooltip>
            ),
            props: [
                row(
                    "children",
                    "ReactElement",
                    t("required", "obrigatório", "obligatorio"),
                    "The described element (needs ref and focus)",
                    "O elemento descrito (precisa de ref e foco)",
                    "El elemento descrito (necesita ref y foco)",
                ),
                row(
                    "content / title",
                    "ReactNode",
                    none,
                    "Text and optional highlighted heading",
                    "Texto e título destacado opcional",
                    "Texto y encabezado destacado opcional",
                ),
                row(
                    "side",
                    "top | right | bottom | left",
                    "top",
                    "Side of the trigger; flips when there is no room",
                    "Lado do gatilho; inverte se não houver espaço",
                    "Lado del disparador; se invierte si no hay espacio",
                ),
                row(
                    "showArrow / delayDuration",
                    "boolean / number",
                    "true / 200",
                    "Arrow and hover delay in ms",
                    "Seta e atraso do hover em ms",
                    "Flecha y retraso del hover en ms",
                ),
                openRow,
                row(
                    "variantColor / customColor / radius",
                    "neutral | primary | success | warning | danger / CSS color / none | sm | md | lg | full",
                    "neutral / md",
                    "Background color and corner radius",
                    "Cor de fundo e arredondamento",
                    "Color de fondo y redondeo",
                ),
            ],
        },
    ];
}

export function getOverlaysVariations(locale: Locale): Record<string, VariationGroup[]> {
    const t = makeT(locale);
    const sidesTitle = t("Sides", "Lados", "Lados");
    const sidesFile = t("sides.tsx", "lados.tsx", "lados.tsx");
    const open = t("Open", "Abrir", "Abrir");
    const content = t("Content", "Conteúdo", "Contenido");

    return {
        modal: [
            {
                title: t("Sizes", "Tamanhos", "Tamaños"),
                file: t("sizes.tsx", "tamanhos.tsx", "tamanos.tsx"),
                code: (["sm", "md", "lg"] as const)
                    .map(
                        (s) =>
                            `<Modal size="${s}" title="${s}" trigger={<Button>${s}</Button>}>...</Modal>`,
                    )
                    .join("\n"),
                items: (["sm", "md", "lg"] as const).map((s) => ({
                    label: s,
                    node: (
                        <Modal size={s} title={s} trigger={<Button size="sm">{s}</Button>}>
                            {content}
                        </Modal>
                    ),
                })),
            },
            {
                title: t("Controlled", "Controlado", "Controlado"),
                file: t("controlled.tsx", "controlado.tsx", "controlado.tsx"),
                description: t(
                    "The parent owns `open` and reacts to the answer.",
                    "O pai controla `open` e reage à resposta.",
                    "El padre controla `open` y reacciona a la respuesta.",
                ),
                code: `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open</Button>
<Modal open={open} onOpenChange={setOpen} title="..." footer={...}>...</Modal>`,
                items: [
                    {
                        label: t("controlled", "controlado", "controlado"),
                        node: (
                            <ControlledModalDemo
                                doneText={t("Deleted!", "Excluído!", "¡Eliminado!")}
                                labels={{
                                    open,
                                    title: t(
                                        "Delete project?",
                                        "Excluir projeto?",
                                        "¿Eliminar proyecto?",
                                    ),
                                    body: t(
                                        "This action cannot be undone.",
                                        "Esta ação não pode ser desfeita.",
                                        "Esta acción no se puede deshacer.",
                                    ),
                                    cancel: t("Cancel", "Cancelar", "Cancelar"),
                                    confirm: t("Delete", "Excluir", "Eliminar"),
                                    closeLabel: t("Close", "Fechar", "Cerrar"),
                                }}
                            />
                        ),
                    },
                ],
            },
        ],
        drawer: [
            {
                title: sidesTitle,
                file: sidesFile,
                code: SIDES.map(
                    (s) =>
                        `<Drawer side="${s}" title="${s}" trigger={<Button>${s}</Button>}>...</Drawer>`,
                ).join("\n"),
                items: SIDES.map((s) => ({
                    label: s,
                    node: (
                        <Drawer side={s} title={s} trigger={<Button size="sm">{s}</Button>}>
                            {content}
                        </Drawer>
                    ),
                })),
            },
        ],
        popover: [
            {
                title: sidesTitle,
                file: sidesFile,
                code: SIDES.map(
                    (s) =>
                        `<Popover side="${s}" label="${s}" trigger={<Button>${s}</Button>}>...</Popover>`,
                ).join("\n"),
                items: SIDES.map((s) => ({
                    label: s,
                    node: (
                        <Popover
                            side={s}
                            label={s}
                            trigger={
                                <Button variant="outlined" size="sm">
                                    {s}
                                </Button>
                            }
                        >
                            {content}
                        </Popover>
                    ),
                })),
            },
        ],
        menu: [
            {
                title: t("Alignment", "Alinhamento", "Alineación"),
                file: t("alignment.tsx", "alinhamento.tsx", "alineacion.tsx"),
                code: (["start", "center", "end"] as const)
                    .map((a) => `<Menu align="${a}" trigger={<Button>${a}</Button>}>...</Menu>`)
                    .join("\n"),
                items: (["start", "center", "end"] as const).map((a) => ({
                    label: a,
                    node: (
                        <MenuSelectDemo
                            trigger={a}
                            label={a}
                            chosen={t("Chosen", "Escolhido", "Elegido")}
                            items={[{ label: "One" }, { label: "Two" }]}
                        />
                    ),
                })),
            },
        ],
        tooltip: [
            {
                title: sidesTitle,
                file: sidesFile,
                code: SIDES.map(
                    (s) => `<Tooltip side="${s}" content="${s}"><Button>${s}</Button></Tooltip>`,
                ).join("\n"),
                items: SIDES.map((s) => ({
                    label: s,
                    node: (
                        <Tooltip side={s} content={s}>
                            <Button variant="outlined" size="sm">
                                {s}
                            </Button>
                        </Tooltip>
                    ),
                })),
            },
            {
                title: t("Colors", "Cores", "Colores"),
                file: t("colors.tsx", "cores.tsx", "colores.tsx"),
                code: COLORS.map(
                    (c) =>
                        `<Tooltip variantColor="${c}" content="${c}"><Button>${c}</Button></Tooltip>`,
                ).join("\n"),
                items: COLORS.map((c) => ({
                    label: c,
                    node: (
                        <Tooltip variantColor={c} content={c}>
                            <Button variant="outlined" size="sm">
                                {c}
                            </Button>
                        </Tooltip>
                    ),
                })),
            },
        ],
    };
}
