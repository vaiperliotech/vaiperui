import { Checkbox, Radio, RadioGroup, Slider, Switch, Textarea, Upload } from "vaiperui";

import { SliderDemo } from "@/components/SliderDemo";
import { UploadDemo } from "@/components/UploadDemo";

import type { Locale } from "@/i18n/config";
import type { ComponentEntry, PropRow } from "./components";
import { makeT } from "./samples";
import type { VariationGroup } from "./variations";

const COLORS = ["primary", "success", "warning", "danger"] as const;
const SIZES = ["sm", "md", "lg"] as const;

export function getFormComponents(locale: Locale): ComponentEntry[] {
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

    const colorRows = (radius: boolean): PropRow[] => [
        row(
            "variantColor",
            "primary | success | warning | danger",
            "primary",
            "Color of the checked state and focus ring",
            "Cor do estado marcado e do anel de foco",
            "Color del estado marcado y del anillo de foco",
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
                      "sm",
                      "Corner rounding of the box",
                      "Arredondamento dos cantos da caixa",
                      "Redondeo de las esquinas de la caja",
                  ),
              ]
            : []),
        row(
            "animation",
            "none | smooth | fast | bounce",
            "smooth",
            "Transition when it toggles",
            "Transição ao alternar",
            "Transición al alternar",
        ),
    ];
    const textRows: PropRow[] = [
        row(
            "label",
            "ReactNode",
            none,
            "Text next to the control; clicking it toggles",
            "Texto ao lado do controle; clicar nele alterna",
            "Texto junto al control; al hacer clic se alterna",
        ),
        row(
            "helperText",
            "string",
            none,
            "Secondary line under the label",
            "Linha secundária abaixo do rótulo",
            "Línea secundaria bajo la etiqueta",
        ),
        row(
            "errorMessage",
            "string",
            none,
            "Error text; its presence alone forces the error state",
            "Texto de erro; só a presença dele já força o estado de erro",
            "Texto de error; su sola presencia fuerza el estado de error",
        ),
    ];
    const native = (el: string): PropRow =>
        row(
            t("(native)", "(nativas)", "(nativas)"),
            el,
            none,
            "checked, defaultChecked, onChange, name, value, disabled, required, aria-*, className, ref, etc.",
            "checked, defaultChecked, onChange, name, value, disabled, required, aria-*, className, ref etc.",
            "checked, defaultChecked, onChange, name, value, disabled, required, aria-*, className, ref, etc.",
        );

    return [
        {
            slug: "textarea",
            name: "Textarea",
            blurb: t(
                "Multi-line text field with label, helper and error text, and the same focus styles as Input.",
                "Campo de texto de várias linhas com rótulo, texto de ajuda e de erro, e os mesmos estilos de foco do Input.",
                "Campo de texto de varias líneas con etiqueta, texto de ayuda y de error, y los mismos estilos de foco que Input.",
            ),
            usage: t(
                "A `<textarea>` with every native prop, a `label`, `helperText` and `errorMessage`. It shares `variant` (`ring` or `outline`), colors, sizes, radius and `customColor` with `Input`, and lets you choose the `resize` handle.",
                "Um `<textarea>` com todas as props nativas, `label`, `helperText` e `errorMessage`. Compartilha `variant` (`ring` ou `outline`), cores, tamanhos, radius e `customColor` com o `Input`, e deixa escolher o `resize`.",
                "Un `<textarea>` con todas las props nativas, `label`, `helperText` y `errorMessage`. Comparte `variant` (`ring` u `outline`), colores, tamaños, radius y `customColor` con `Input`, y permite elegir el `resize`.",
            ),
            accessibility: {
                notes: [
                    t(
                        "Renders a native `<textarea>`, so role, text editing, selection and spellcheck come from the browser.",
                        "Renderiza um `<textarea>` nativo, então papel, edição de texto, seleção e corretor ortográfico vêm do navegador.",
                        "Renderiza un `<textarea>` nativo, así que el rol, la edición de texto, la selección y el corrector ortográfico vienen del navegador.",
                    ),
                    t(
                        "`label` is a `<label htmlFor>` tied to the field through its `id` (generated when you do not pass one).",
                        "`label` é um `<label htmlFor>` ligado ao campo pelo `id` (gerado quando você não passa um).",
                        "`label` es un `<label htmlFor>` vinculado al campo mediante su `id` (generado si no pasas uno).",
                    ),
                    t(
                        '`errorMessage` sets `aria-invalid="true"`, and `aria-describedby` points to the error text, or to `helperText` when there is no error.',
                        '`errorMessage` define `aria-invalid="true"`, e `aria-describedby` aponta para o texto de erro, ou para o `helperText` quando não há erro.',
                        '`errorMessage` define `aria-invalid="true"` y `aria-describedby` apunta al texto de error, o al `helperText` cuando no hay error.',
                    ),
                    t(
                        "Only one description is linked at a time: the error replaces the helper text.",
                        "Só uma descrição é vinculada por vez: o erro substitui o texto de ajuda.",
                        "Solo se vincula una descripción a la vez: el error reemplaza al texto de ayuda.",
                    ),
                    t(
                        "`disabled` and other native attributes (`readOnly`, `required`, `maxLength`) pass straight to the element.",
                        "`disabled` e os demais atributos nativos (`readOnly`, `required`, `maxLength`) vão direto para o elemento.",
                        "`disabled` y los demás atributos nativos (`readOnly`, `required`, `maxLength`) pasan directo al elemento.",
                    ),
                ],
                caveats: [
                    t(
                        "Without `label`, pass `aria-label` or `aria-labelledby` yourself; the field has no other name.",
                        "Sem `label`, passe `aria-label` ou `aria-labelledby`; o campo não tem outro nome.",
                        "Sin `label`, pasa `aria-label` o `aria-labelledby`; el campo no tiene otro nombre.",
                    ),
                    t(
                        "The error text is not a live region, so it is not announced when it appears; it is read when the field is focused.",
                        "O texto de erro não é uma live region, então não é anunciado quando aparece; é lido quando o campo recebe foco.",
                        "El texto de error no es una live region, así que no se anuncia al aparecer; se lee cuando el campo recibe el foco.",
                    ),
                ],
            },
            code: `import { Textarea } from "vaiperui";

<Textarea label="${t("Message", "Mensagem", "Mensaje")}" rows={4} />
<Textarea
  label="Bio"
  helperText="${t("A few words about you", "Algumas palavras sobre você", "Unas palabras sobre ti")}"
  resize="none"
/>`,
            demo: (
                <div className="flex w-full max-w-sm flex-col gap-4">
                    <Textarea label={t("Message", "Mensagem", "Mensaje")} rows={4} />
                    <Textarea
                        label="Bio"
                        helperText={t(
                            "A few words about you",
                            "Algumas palavras sobre você",
                            "Unas palabras sobre ti",
                        )}
                        resize="none"
                    />
                </div>
            ),
            props: [
                row(
                    "variant",
                    "ring | outline",
                    "ring",
                    "Focus style: a ring or only an outline",
                    "Estilo de foco: anel ou apenas contorno",
                    "Estilo de foco: anillo o solo contorno",
                ),
                row(
                    "variantColor",
                    "primary | success | warning | danger",
                    "primary",
                    "Color of the focus style",
                    "Cor do estilo de foco",
                    "Color del estilo de foco",
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
                row(
                    "radius",
                    "none | sm | md | lg | full",
                    "md",
                    "Corner rounding",
                    "Arredondamento dos cantos",
                    "Redondeo de las esquinas",
                ),
                row(
                    "animation",
                    "none | smooth | fast | bounce",
                    "smooth",
                    "Transition on focus",
                    "Transição ao focar",
                    "Transición al enfocar",
                ),
                row(
                    "resize",
                    "none | vertical | horizontal | both",
                    "vertical",
                    "Which directions the user can drag to resize",
                    "Em quais direções o usuário pode arrastar para redimensionar",
                    "En qué direcciones puede arrastrar el usuario para redimensionar",
                ),
                row("rows", "number", "3", "Visible lines", "Linhas visíveis", "Líneas visibles"),
                row(
                    "label",
                    "string",
                    none,
                    "Label above the field",
                    "Rótulo acima do campo",
                    "Etiqueta sobre el campo",
                ),
                row(
                    "helperText",
                    "string",
                    none,
                    "Help text under the field",
                    "Texto de ajuda abaixo do campo",
                    "Texto de ayuda bajo el campo",
                ),
                row(
                    "errorMessage",
                    "string",
                    none,
                    "Error text; its presence alone forces the error state",
                    "Texto de erro; só a presença dele já força o estado de erro",
                    "Texto de error; su sola presencia fuerza el estado de error",
                ),
                row(
                    t("(native)", "(nativas)", "(nativas)"),
                    "TextareaHTMLAttributes<HTMLTextAreaElement>",
                    none,
                    "value, defaultValue, onChange, placeholder, maxLength, disabled, aria-*, className, ref, etc.",
                    "value, defaultValue, onChange, placeholder, maxLength, disabled, aria-*, className, ref etc.",
                    "value, defaultValue, onChange, placeholder, maxLength, disabled, aria-*, className, ref, etc.",
                ),
            ],
        },
        {
            slug: "checkbox",
            name: "Checkbox",
            blurb: t(
                "Accessible checkbox with label, helper and error text, an indeterminate state and colors.",
                "Checkbox acessível com rótulo, texto de ajuda e de erro, estado indeterminado e cores.",
                "Checkbox accesible con etiqueta, texto de ayuda y de error, estado indeterminado y colores.",
            ),
            usage: t(
                'A native `<input type="checkbox">` (so forms, `ref` and keyboard just work) with a custom look. Pass `label` to make the whole row clickable, and `indeterminate` for a parent that has only some children checked.',
                'Um `<input type="checkbox">` nativo (então formulários, `ref` e teclado funcionam) com visual próprio. Passe `label` para a linha inteira ser clicável e `indeterminate` para um pai com só alguns filhos marcados.',
                'Un `<input type="checkbox">` nativo (así que formularios, `ref` y teclado funcionan) con aspecto propio. Pasa `label` para que toda la fila sea clicable e `indeterminate` para un padre con solo algunos hijos marcados.',
            ),
            accessibility: {
                notes: [
                    t(
                        'Renders a native `<input type="checkbox">` (visually hidden, drawn over by the custom box), so role, Space toggle and form behavior are native.',
                        'Renderiza um `<input type="checkbox">` nativo (oculto visualmente, com a caixa customizada desenhada por cima), então papel, alternância com Space e comportamento em formulários são nativos.',
                        'Renderiza un `<input type="checkbox">` nativo (oculto visualmente, con la casilla personalizada dibujada encima), así que el rol, el cambio con Space y el comportamiento en formularios son nativos.',
                    ),
                    t(
                        "The `<label>` wraps the input, so the label text names it and the whole row is clickable.",
                        "O `<label>` envolve o input, então o texto do rótulo dá o nome e a linha inteira é clicável.",
                        "El `<label>` envuelve el input, así que el texto de la etiqueta le da nombre y toda la fila es clicable.",
                    ),
                    t(
                        '`indeterminate` sets the DOM `indeterminate` property, which assistive tech reads as "mixed".',
                        '`indeterminate` define a propriedade `indeterminate` do DOM, que tecnologias assistivas leem como "misto".',
                        '`indeterminate` define la propiedad `indeterminate` del DOM, que las tecnologías asistivas leen como "mixto".',
                    ),
                    t(
                        '`errorMessage` sets `aria-invalid="true"`; `aria-describedby` points to the error, or to `helperText` when there is no error.',
                        '`errorMessage` define `aria-invalid="true"`; `aria-describedby` aponta para o erro, ou para o `helperText` quando não há erro.',
                        '`errorMessage` define `aria-invalid="true"`; `aria-describedby` apunta al error, o al `helperText` si no hay error.',
                    ),
                    t(
                        "The check and dash icons are `aria-hidden`; state is exposed only by the native input.",
                        "Os ícones de check e traço são `aria-hidden`; o estado é exposto só pelo input nativo.",
                        "Los iconos de check y guion son `aria-hidden`; el estado lo expone solo el input nativo.",
                    ),
                ],
                keys: [
                    {
                        keys: "Space",
                        action: t(
                            "Toggles the checkbox.",
                            "Alterna o checkbox.",
                            "Alterna el checkbox.",
                        ),
                    },
                ],
                caveats: [
                    t(
                        "Without `label`, pass `aria-label`; the control has no other name.",
                        "Sem `label`, passe `aria-label`; o controle não tem outro nome.",
                        "Sin `label`, pasa `aria-label`; el control no tiene otro nombre.",
                    ),
                    t(
                        "`indeterminate` is visual state only: clicking still resolves to checked or unchecked, and you decide what that means.",
                        "`indeterminate` é só estado visual: o clique continua resultando em marcado ou desmarcado, e você decide o que isso significa.",
                        "`indeterminate` es solo estado visual: el clic sigue resultando en marcado o desmarcado, y tú decides qué significa.",
                    ),
                ],
            },
            code: `import { Checkbox } from "vaiperui";

<Checkbox label="${t("Accept the terms", "Aceito os termos", "Acepto los términos")}" />
<Checkbox
  defaultChecked
  label="${t("Newsletter", "Newsletter", "Newsletter")}"
  helperText="${t("One email per week", "Um e-mail por semana", "Un correo por semana")}"
/>
<Checkbox indeterminate label="${t("Select all", "Selecionar tudo", "Seleccionar todo")}" />`,
            demo: (
                <div className="flex flex-col gap-3">
                    <Checkbox
                        label={t("Accept the terms", "Aceito os termos", "Acepto los términos")}
                    />
                    <Checkbox
                        defaultChecked
                        label="Newsletter"
                        helperText={t(
                            "One email per week",
                            "Um e-mail por semana",
                            "Un correo por semana",
                        )}
                    />
                    <Checkbox
                        indeterminate
                        label={t("Select all", "Selecionar tudo", "Seleccionar todo")}
                    />
                </div>
            ),
            props: [
                ...colorRows(true),
                ...textRows,
                row(
                    "indeterminate",
                    "boolean",
                    "false",
                    "Shows a dash instead of the check",
                    "Mostra um traço no lugar do check",
                    "Muestra un guion en lugar del check",
                ),
                native("InputHTMLAttributes<HTMLInputElement>"),
            ],
        },
        {
            slug: "radio",
            name: "Radio",
            blurb: t(
                "RadioGroup renders a set of options from an array; Radio is the single native radio.",
                "RadioGroup renderiza um conjunto de opções a partir de um array; Radio é o radio nativo avulso.",
                "RadioGroup renderiza un conjunto de opciones desde un array; Radio es el radio nativo suelto.",
            ),
            usage: t(
                "Use `RadioGroup` with an `options` array (like `Select`): it shares one `name`, works controlled (`value`) or not (`defaultValue`), and arrow keys move between options natively. Use `Radio` alone when you need full control of each row.",
                "Use `RadioGroup` com um array `options` (como o `Select`): ele compartilha um `name`, funciona controlado (`value`) ou não (`defaultValue`) e as setas movem entre as opções nativamente. Use `Radio` sozinho quando precisar de controle total de cada linha.",
                "Usa `RadioGroup` con un array `options` (como `Select`): comparte un `name`, funciona controlado (`value`) o no (`defaultValue`) y las flechas se mueven entre opciones de forma nativa. Usa `Radio` solo cuando necesites control total de cada fila.",
            ),
            accessibility: {
                notes: [
                    t(
                        '`RadioGroup` renders a `<fieldset>` with a `<legend>` (from `label`) and an inner `role="radiogroup"` named by the same `label`.',
                        '`RadioGroup` renderiza um `<fieldset>` com `<legend>` (vindo de `label`) e um `role="radiogroup"` interno nomeado pelo mesmo `label`.',
                        '`RadioGroup` renderiza un `<fieldset>` con `<legend>` (de `label`) y un `role="radiogroup"` interno nombrado con el mismo `label`.',
                    ),
                    t(
                        'Each option is a native `<input type="radio">` sharing one `name`, so the browser provides arrow-key navigation and a single tab stop.',
                        'Cada opção é um `<input type="radio">` nativo com o mesmo `name`, então o navegador entrega a navegação por setas e uma única parada de Tab.',
                        'Cada opción es un `<input type="radio">` nativo con el mismo `name`, así que el navegador aporta la navegación con flechas y una única parada de Tab.',
                    ),
                    t(
                        "Each option `label` names its radio and its `description` becomes the radio's `aria-describedby` text.",
                        "O `label` de cada opção dá o nome ao radio e a `description` vira o texto de `aria-describedby` dele.",
                        "El `label` de cada opción nombra a su radio y su `description` pasa a ser el texto de `aria-describedby`.",
                    ),
                    t(
                        "`errorMessage` sets `aria-invalid` on the fieldset and on every radio; `aria-describedby` on the fieldset points to the error or helper text.",
                        "`errorMessage` define `aria-invalid` no fieldset e em cada radio; o `aria-describedby` do fieldset aponta para o erro ou o texto de ajuda.",
                        "`errorMessage` define `aria-invalid` en el fieldset y en cada radio; el `aria-describedby` del fieldset apunta al error o al texto de ayuda.",
                    ),
                    t(
                        "`disabled` on the group disables the fieldset; an option can also be disabled on its own.",
                        "`disabled` no grupo desabilita o fieldset; uma opção também pode ser desabilitada individualmente.",
                        "`disabled` en el grupo deshabilita el fieldset; una opción también puede deshabilitarse por separado.",
                    ),
                ],
                keys: [
                    {
                        keys: "Tab",
                        action: t(
                            "Moves focus into and out of the group (one stop, on the selected option).",
                            "Move o foco para dentro e para fora do grupo (uma parada, na opção selecionada).",
                            "Mueve el foco hacia dentro y fuera del grupo (una parada, en la opción seleccionada).",
                        ),
                    },
                    {
                        keys: "Arrow keys",
                        action: t(
                            "Move to the next or previous option and select it (native radio behavior).",
                            "Vão para a opção seguinte ou anterior e a selecionam (comportamento nativo de radio).",
                            "Van a la opción siguiente o anterior y la seleccionan (comportamiento nativo de radio).",
                        ),
                    },
                    {
                        keys: "Space",
                        action: t(
                            "Selects the focused option when none is selected yet.",
                            "Seleciona a opção focada quando nenhuma está selecionada ainda.",
                            "Selecciona la opción enfocada cuando aún no hay ninguna seleccionada.",
                        ),
                    },
                ],
                caveats: [
                    t(
                        "Always pass `label` to `RadioGroup`; without it the group has no accessible name.",
                        "Sempre passe `label` ao `RadioGroup`; sem ele o grupo não tem nome acessível.",
                        "Pasa siempre `label` a `RadioGroup`; sin él el grupo no tiene nombre accesible.",
                    ),
                    t(
                        "A standalone `Radio` has no group semantics: give related radios the same `name` and wrap them yourself.",
                        "Um `Radio` avulso não tem semântica de grupo: dê o mesmo `name` aos radios relacionados e envolva-os você mesmo.",
                        "Un `Radio` suelto no tiene semántica de grupo: dale el mismo `name` a los radios relacionados y envuélvelos tú.",
                    ),
                ],
            },
            code: `import { RadioGroup } from "vaiperui";

<RadioGroup
  label="${t("Plan", "Plano", "Plan")}"
  defaultValue="free"
  onValueChange={(plan) => console.log(plan)}
  options={[
    { value: "free", label: "Free", description: "${t("For side projects", "Para projetos pessoais", "Para proyectos personales")}" },
    { value: "pro", label: "Pro", description: "${t("For small teams", "Para times pequenos", "Para equipos pequeños")}" },
    { value: "team", label: "Team", disabled: true },
  ]}
/>`,
            demo: (
                <RadioGroup
                    label={t("Plan", "Plano", "Plan")}
                    defaultValue="free"
                    options={[
                        {
                            value: "free",
                            label: "Free",
                            description: t(
                                "For side projects",
                                "Para projetos pessoais",
                                "Para proyectos personales",
                            ),
                        },
                        {
                            value: "pro",
                            label: "Pro",
                            description: t(
                                "For small teams",
                                "Para times pequenos",
                                "Para equipos pequeños",
                            ),
                        },
                        { value: "team", label: "Team", disabled: true },
                    ]}
                />
            ),
            props: [
                row(
                    "options",
                    "{ value, label, description?, disabled? }[]",
                    none,
                    "The options of the RadioGroup",
                    "As opções do RadioGroup",
                    "Las opciones del RadioGroup",
                ),
                row(
                    "value / defaultValue",
                    "string",
                    none,
                    "Controlled / uncontrolled selection",
                    "Seleção controlada / não controlada",
                    "Selección controlada / no controlada",
                ),
                row(
                    "onValueChange",
                    "(value: string) => void",
                    none,
                    "Called with the selected value",
                    "Chamado com o valor selecionado",
                    "Se llama con el valor seleccionado",
                ),
                row(
                    "name",
                    "string",
                    t("generated", "gerado", "generado"),
                    "Shared name of the radios, so they submit with a <form>",
                    "Nome compartilhado dos radios, para enviarem com um <form>",
                    "Nombre compartido de los radios, para enviarse con un <form>",
                ),
                row(
                    "label",
                    "string",
                    none,
                    "Title of the group (a <legend>)",
                    "Título do grupo (um <legend>)",
                    "Título del grupo (un <legend>)",
                ),
                row(
                    "orientation",
                    "vertical | horizontal",
                    "vertical",
                    "Direction of the options",
                    "Direção das opções",
                    "Dirección de las opciones",
                ),
                row(
                    "helperText / errorMessage",
                    "string",
                    none,
                    "Text under the group; an error colors every radio",
                    "Texto abaixo do grupo; um erro colore todos os radios",
                    "Texto bajo el grupo; un error colorea todos los radios",
                ),
                row(
                    "disabled",
                    "boolean",
                    "false",
                    "Disables every option",
                    "Desabilita todas as opções",
                    "Deshabilita todas las opciones",
                ),
                ...colorRows(false),
                row(
                    "Radio",
                    "InputHTMLAttributes<HTMLInputElement>",
                    none,
                    "Standalone radio: label, helperText, errorMessage, the style props above, and every native input prop",
                    "Radio avulso: label, helperText, errorMessage, as props de estilo acima e todas as props nativas de input",
                    "Radio suelto: label, helperText, errorMessage, las props de estilo anteriores y todas las props nativas de input",
                ),
            ],
        },
        {
            slug: "slider",
            name: "Slider",
            blurb: t(
                "Pick a number or an interval by dragging a thumb or using the keyboard.",
                "Escolha um número ou um intervalo arrastando o botão ou usando o teclado.",
                "Elige un número o un intervalo arrastrando el botón o usando el teclado.",
            ),
            usage: t(
                "The value is always an array, one number per thumb: `[40]` for a single value, `[20, 80]` for an interval with the track filled between the thumbs. The Slider does not print the chosen number, so show it next to the control. Name it with `aria-label` (required) and, in an interval, each thumb with `thumbLabels`.",
                "O valor é sempre um array, um número por botão: `[40]` para um valor, `[20, 80]` para um intervalo com a trilha preenchida entre os botões. O Slider não exibe o número escolhido, então mostre-o ao lado do controle. Dê nome com `aria-label` (obrigatório) e, no intervalo, a cada botão com `thumbLabels`.",
                "El valor es siempre un array, un número por botón: `[40]` para un valor, `[20, 80]` para un intervalo con la pista rellena entre los botones. El Slider no muestra el número elegido, así que muéstralo junto al control. Ponle nombre con `aria-label` (obligatorio) y, en un intervalo, a cada botón con `thumbLabels`.",
            ),
            accessibility: {
                notes: [
                    t(
                        'Each thumb is a `<div role="slider">` (not a native input) with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and `aria-orientation="horizontal"`.',
                        'Cada thumb é um `<div role="slider">` (não um input nativo) com `aria-valuemin`, `aria-valuemax`, `aria-valuenow` e `aria-orientation="horizontal"`.',
                        'Cada thumb es un `<div role="slider">` (no un input nativo) con `aria-valuemin`, `aria-valuemax`, `aria-valuenow` y `aria-orientation="horizontal"`.',
                    ),
                    t(
                        '`aria-label` is required. With several thumbs a number is appended ("Price 1", "Price 2"), or use `thumbLabels` for custom names.',
                        '`aria-label` é obrigatório. Com vários thumbs um número é acrescentado ("Preço 1", "Preço 2"), ou use `thumbLabels` para nomes próprios.',
                        '`aria-label` es obligatorio. Con varios thumbs se añade un número ("Precio 1", "Precio 2"), o usa `thumbLabels` para nombres propios.',
                    ),
                    t(
                        "Every thumb is a tab stop (`tabIndex=0`); a thumb never crosses its neighbor, and `minStepsBetweenThumbs` keeps a gap between them.",
                        "Cada thumb é uma parada de Tab (`tabIndex=0`); um thumb nunca cruza o vizinho, e `minStepsBetweenThumbs` mantém uma distância entre eles.",
                        "Cada thumb es una parada de Tab (`tabIndex=0`); un thumb nunca cruza a su vecino y `minStepsBetweenThumbs` mantiene una separación entre ellos.",
                    ),
                    t(
                        'When `disabled`, thumbs get `aria-disabled="true"` and `tabIndex=-1`, and the control ignores pointer and keyboard input.',
                        'Com `disabled`, os thumbs recebem `aria-disabled="true"` e `tabIndex=-1`, e o controle ignora ponteiro e teclado.',
                        'Con `disabled`, los thumbs reciben `aria-disabled="true"` y `tabIndex=-1`, y el control ignora puntero y teclado.',
                    ),
                    t(
                        "Pressing the track focuses the nearest thumb; `name` adds one hidden input per thumb for form submission.",
                        "Clicar na trilha foca o thumb mais próximo; `name` adiciona um input hidden por thumb para envio em formulários.",
                        "Pulsar la pista enfoca el thumb más cercano; `name` añade un input hidden por thumb para el envío de formularios.",
                    ),
                ],
                keys: [
                    {
                        keys: "Arrow Right / Up",
                        action: t(
                            "Increase by one `step`.",
                            "Aumentam um `step`.",
                            "Aumentan un `step`.",
                        ),
                    },
                    {
                        keys: "Arrow Left / Down",
                        action: t(
                            "Decrease by one `step`.",
                            "Diminuem um `step`.",
                            "Disminuyen un `step`.",
                        ),
                    },
                    {
                        keys: "Page Up / Page Down",
                        action: t("Change by 10 steps.", "Mudam 10 steps.", "Cambian 10 steps."),
                    },
                    {
                        keys: "Home / End",
                        action: t(
                            "Jump to `min` / `max` (limited by neighboring thumbs).",
                            "Vão para `min` / `max` (limitado pelos thumbs vizinhos).",
                            "Van a `min` / `max` (limitado por los thumbs vecinos).",
                        ),
                    },
                ],
                caveats: [
                    t(
                        "`aria-valuetext` is not set, so screen readers announce the raw number; if it needs a unit, name it in the `aria-label`.",
                        "`aria-valuetext` não é definido, então leitores de tela anunciam o número bruto; se precisar de unidade, ponha no `aria-label`.",
                        "`aria-valuetext` no se define, así que los lectores de pantalla anuncian el número crudo; si necesita unidad, inclúyela en el `aria-label`.",
                    ),
                    t(
                        "Dragging is pointer-only; keyboard users rely on the keys above. There is no `aria-labelledby` support, only `aria-label`.",
                        "Arrastar é só por ponteiro; usuários de teclado dependem das teclas acima. Não há suporte a `aria-labelledby`, apenas `aria-label`.",
                        "Arrastrar es solo con puntero; quien usa teclado depende de las teclas anteriores. No hay soporte para `aria-labelledby`, solo `aria-label`.",
                    ),
                ],
            },
            code: `import { Slider } from "vaiperui";

const [volume, setVolume] = useState([40]);
const [price, setPrice] = useState([200, 800]);

<p>${t("Volume", "Volume", "Volumen")}: {volume[0]}%</p>
<Slider aria-label="${t("Volume", "Volume", "Volumen")}" value={volume} onValueChange={setVolume} />

<Slider
  aria-label="${t("Price", "Preço", "Precio")}"
  thumbLabels={["${t("Minimum price", "Preço mínimo", "Precio mínimo")}", "${t("Maximum price", "Preço máximo", "Precio máximo")}"]}
  value={price}
  onValueChange={setPrice}
  min={0}
  max={1000}
  step={10}
/>`,
            demo: (
                <div className="flex w-full max-w-sm flex-col gap-6">
                    <SliderDemo
                        mode="single"
                        format="percent"
                        label={t("Volume", "Volume", "Volumen")}
                    />
                    <SliderDemo
                        mode="interval"
                        format="price"
                        label={t("Price", "Preço", "Precio")}
                        thumbLabels={[
                            t("Minimum price", "Preço mínimo", "Precio mínimo"),
                            t("Maximum price", "Preço máximo", "Precio máximo"),
                        ]}
                    />
                </div>
            ),
            props: [
                row(
                    "value / defaultValue",
                    "number[]",
                    "[min]",
                    "Values, controlled or initial: one number per thumb",
                    "Valores, controlados ou iniciais: um número por botão",
                    "Valores, controlados o iniciales: un número por botón",
                ),
                row(
                    "onValueChange",
                    "(value: number[]) => void",
                    none,
                    "Called while a thumb moves",
                    "Chamado enquanto o botão se move",
                    "Se llama mientras el botón se mueve",
                ),
                row(
                    "onValueCommit",
                    "(value: number[]) => void",
                    none,
                    "Called when the thumb is released or a key press ends. Use it to fetch data only at the end",
                    "Chamado quando o botão é solto ou uma tecla termina. Use para buscar dados só no final",
                    "Se llama al soltar el botón o terminar una tecla. Úsalo para pedir datos solo al final",
                ),
                row(
                    "min / max",
                    "number",
                    "0 / 100",
                    "Limits of the range",
                    "Limites do intervalo",
                    "Límites del intervalo",
                ),
                row(
                    "step",
                    "number",
                    "1",
                    "Step between values",
                    "Passo entre os valores",
                    "Paso entre valores",
                ),
                row(
                    "minStepsBetweenThumbs",
                    "number",
                    "0",
                    "In an interval, the minimum distance between thumbs, in steps",
                    "No intervalo, a distância mínima entre os botões, em passos",
                    "En un intervalo, la distancia mínima entre botones, en pasos",
                ),
                row(
                    "disabled",
                    "boolean",
                    "false",
                    "Blocks use",
                    "Bloqueia o uso",
                    "Bloquea el uso",
                ),
                row(
                    "name",
                    "string",
                    none,
                    "Form field name; every thumb submits its value under it",
                    "Nome do campo no formulário; cada botão envia seu valor com ele",
                    "Nombre del campo del formulario; cada botón envía su valor con él",
                ),
                row(
                    "aria-label",
                    "string",
                    t("required", "obrigatório", "obligatorio"),
                    "Accessible name. With several thumbs a number is appended",
                    "Nome acessível. Com vários botões, um número é acrescentado",
                    "Nombre accesible. Con varios botones se añade un número",
                ),
                row(
                    "thumbLabels",
                    "string[]",
                    none,
                    "Accessible name of each thumb, replacing the numbered aria-label",
                    "Nome acessível de cada botão, no lugar do aria-label numerado",
                    "Nombre accesible de cada botón, en lugar del aria-label numerado",
                ),
                ...colorRows(false),
            ],
        },
        {
            slug: "upload",
            name: "Upload",
            blurb: t(
                "Area to pick files by clicking or dragging them in, with an accept filter.",
                "Área para escolher arquivos clicando ou arrastando, com filtro de tipos aceitos.",
                "Área para elegir archivos haciendo clic o arrastrándolos, con filtro de tipos aceptados.",
            ),
            usage: t(
                'The Upload only **captures** files: listing them, validating the size and sending them to a server are up to you. `onFilesChange` receives plain `File[]` with the files just chosen, not the sum with earlier ones, so merge them into your own state to accumulate. It is a real `<input type="file">` hidden only visually (Tab to focus, Enter or Space to open), and `accept` also filters dragged files, which the browser does not do by itself. Without `multiple`, only the first file of a selection is kept. Always validate again on the server.',
                'O Upload só **captura** os arquivos: listar, validar o tamanho e enviar para um servidor ficam com você. `onFilesChange` recebe `File[]` puro com os arquivos recém-escolhidos, não a soma com os anteriores, então junte-os no seu próprio estado para acumular. É um `<input type="file">` de verdade escondido só visualmente (Tab para focar, Enter ou Espaço para abrir), e o `accept` também filtra arquivos arrastados, o que o navegador não faz sozinho. Sem `multiple`, só o primeiro arquivo da seleção é mantido. Valide sempre de novo no servidor.',
                'El Upload solo **captura** los archivos: listarlos, validar el tamaño y enviarlos a un servidor depende de ti. `onFilesChange` recibe `File[]` puro con los archivos recién elegidos, no la suma con los anteriores, así que únelos en tu propio estado para acumular. Es un `<input type="file">` real oculto solo visualmente (Tab para enfocar, Enter o Espacio para abrir), y `accept` también filtra los archivos arrastrados, lo que el navegador no hace solo. Sin `multiple`, solo se conserva el primer archivo de la selección. Valida siempre de nuevo en el servidor.',
            ),
            accessibility: {
                notes: [
                    t(
                        'A native `<input type="file">` (visually hidden) is the real control; the dashed area is a `<label htmlFor>` for it.',
                        'Um `<input type="file">` nativo (oculto visualmente) é o controle real; a área tracejada é um `<label htmlFor>` dele.',
                        'Un `<input type="file">` nativo (oculto visualmente) es el control real; el área punteada es un `<label htmlFor>` suyo.',
                    ),
                    t(
                        "The input is focusable and the focus ring shows on the drop area (`peer-focus-visible`), so keyboard focus is visible.",
                        "O input recebe foco e o anel de foco aparece na área de soltar (`peer-focus-visible`), então o foco por teclado fica visível.",
                        "El input recibe el foco y el anillo de foco aparece en el área de soltar (`peer-focus-visible`), así que el foco con teclado es visible.",
                    ),
                    t(
                        "The accessible name is the `title` text inside the area, plus `label` when you pass one (the input has both labels).",
                        "O nome acessível é o texto de `title` dentro da área, mais o `label` quando você passa um (o input tem os dois rótulos).",
                        "El nombre accesible es el texto de `title` dentro del área, más `label` si lo pasas (el input tiene ambas etiquetas).",
                    ),
                    t(
                        '`errorMessage` sets `aria-invalid="true"`; `aria-describedby` points to the error, or to `helperText` when there is no error.',
                        '`errorMessage` define `aria-invalid="true"`; `aria-describedby` aponta para o erro, ou para o `helperText` quando não há erro.',
                        '`errorMessage` define `aria-invalid="true"`; `aria-describedby` apunta al error, o al `helperText` si no hay error.',
                    ),
                    t(
                        "Drag and drop is an extra path: keyboard and screen reader users open the system picker through the native input. The upload icon is `aria-hidden`.",
                        "Arrastar e soltar é um caminho extra: usuários de teclado e leitor de tela abrem o seletor do sistema pelo input nativo. O ícone de upload é `aria-hidden`.",
                        "Arrastrar y soltar es una vía adicional: quienes usan teclado y lector de pantalla abren el selector del sistema con el input nativo. El icono de subida es `aria-hidden`.",
                    ),
                ],
                keys: [
                    {
                        keys: "Tab",
                        action: t(
                            "Focuses the file input.",
                            "Foca o input de arquivo.",
                            "Enfoca el input de archivo.",
                        ),
                    },
                    {
                        keys: "Enter / Space",
                        action: t(
                            "Opens the system file picker (native input behavior).",
                            "Abre o seletor de arquivos do sistema (comportamento nativo do input).",
                            "Abre el selector de archivos del sistema (comportamiento nativo del input).",
                        ),
                    },
                ],
                caveats: [
                    t(
                        "Files rejected by `accept` are dropped silently, with no message or live region; validate and tell the user in `errorMessage`.",
                        "Arquivos recusados por `accept` são descartados em silêncio, sem mensagem nem live region; valide e avise o usuário via `errorMessage`.",
                        "Los archivos rechazados por `accept` se descartan en silencio, sin mensaje ni live region; valida y avisa al usuario con `errorMessage`.",
                    ),
                    t(
                        "Selected files are not listed by the component; render the list yourself and make it readable by assistive tech.",
                        "Os arquivos escolhidos não são listados pelo componente; renderize a lista você mesmo e deixe-a acessível a tecnologias assistivas.",
                        "Los archivos elegidos no los lista el componente; renderiza la lista tú mismo y hazla accesible para tecnologías asistivas.",
                    ),
                ],
            },
            code: `import { Upload } from "vaiperui";

const [files, setFiles] = useState<File[]>([]);

<Upload
  multiple
  accept=".pdf,image/*"
  label="${t("Attachments", "Anexos", "Adjuntos")}"
  description="${t("PDF or image, up to 5 MB", "PDF ou imagem, até 5 MB", "PDF o imagen, hasta 5 MB")}"
  onFilesChange={(chosen) => setFiles((current) => [...current, ...chosen])}
/>`,
            demo: (
                <UploadDemo
                    label={t("Attachments", "Anexos", "Adjuntos")}
                    title={t(
                        "Drag files here or click to choose",
                        "Arraste arquivos aqui ou clique para escolher",
                        "Arrastra archivos aquí o haz clic para elegir",
                    )}
                    description={t(
                        "PDF or image, up to 5 MB",
                        "PDF ou imagem, até 5 MB",
                        "PDF o imagen, hasta 5 MB",
                    )}
                    emptyText={t("No files yet", "Nenhum arquivo ainda", "Ningún archivo todavía")}
                />
            ),
            props: [
                row(
                    "onFilesChange",
                    "(files: File[]) => void",
                    t("required", "obrigatório", "obligatorio"),
                    "Called with the files just chosen (not the sum with earlier ones)",
                    "Chamado com os arquivos recém-escolhidos (não a soma com os anteriores)",
                    "Se llama con los archivos recién elegidos (no la suma con los anteriores)",
                ),
                row(
                    "title",
                    "ReactNode",
                    '"Drag files here or click to choose"',
                    "Main text of the area",
                    "Texto principal da área",
                    "Texto principal del área",
                ),
                row(
                    "description",
                    "ReactNode",
                    none,
                    "Support text, e.g. accepted formats and size",
                    "Texto de apoio, ex.: formatos aceitos e tamanho",
                    "Texto de apoyo, p. ej. formatos aceptados y tamaño",
                ),
                row(
                    "accept",
                    "string",
                    none,
                    "Accepted types: .pdf, image/*, image/png, comma-separated. Also filters dragged files; files that do not match are ignored silently (no callback), so validate and inform the user yourself",
                    "Tipos aceitos: .pdf, image/*, image/png, separados por vírgula. Também filtra arquivos arrastados; arquivos que não casam são ignorados em silêncio (sem callback), então valide e avise o usuário você mesmo",
                    "Tipos aceptados: .pdf, image/*, image/png, separados por coma. También filtra archivos arrastrados; los archivos que no coinciden se ignoran en silencio (sin callback), así que valida e informa al usuario tú mismo",
                ),
                row(
                    "multiple",
                    "boolean",
                    "false",
                    "Accepts several files. Without it, only the first of a selection is kept",
                    "Aceita vários arquivos. Sem ele, só o primeiro da seleção é mantido",
                    "Acepta varios archivos. Sin él, solo se conserva el primero de la selección",
                ),
                row(
                    "label / helperText",
                    "string",
                    none,
                    "Label above the area and help text below",
                    "Rótulo acima da área e texto de ajuda abaixo",
                    "Etiqueta sobre el área y texto de ayuda debajo",
                ),
                row(
                    "errorMessage",
                    "string",
                    none,
                    "Error text; its presence alone forces the error state (red border, aria-invalid)",
                    "Texto de erro; só a presença dele já força o estado de erro (borda vermelha, aria-invalid)",
                    "Texto de error; su sola presencia fuerza el estado de error (borde rojo, aria-invalid)",
                ),
                row(
                    "disabled",
                    "boolean",
                    "false",
                    "Blocks click and drag",
                    "Bloqueia clique e arraste",
                    "Bloquea clic y arrastre",
                ),
                row(
                    "name",
                    "string",
                    none,
                    "Field name for a native <form> (dropped files are mirrored into the input)",
                    "Nome do campo para um <form> nativo (arquivos soltos são copiados para o input)",
                    "Nombre del campo para un <form> nativo (los archivos soltados se copian al input)",
                ),
                ...colorRows(true)
                    .filter((r) => r.prop !== "radius")
                    .concat(
                        row(
                            "radius",
                            "none | sm | md | lg | full",
                            "lg",
                            "Corner rounding of the area",
                            "Arredondamento dos cantos da área",
                            "Redondeo de las esquinas del área",
                        ),
                    ),
                native("InputHTMLAttributes<HTMLInputElement>"),
            ],
        },
        {
            slug: "switch",
            name: "Switch",
            blurb: t(
                'On/off toggle with role="switch", label, helper and error text and colors.',
                'Alternador liga/desliga com role="switch", rótulo, texto de ajuda e de erro e cores.',
                'Interruptor encendido/apagado con role="switch", etiqueta, texto de ayuda y de error y colores.',
            ),
            usage: t(
                'A native checkbox exposed as `role="switch"`, so it works in forms, with `ref` and the keyboard (Space). Use it for settings that apply immediately; use `Checkbox` for choices that are submitted later.',
                'Um checkbox nativo exposto como `role="switch"`, então funciona em formulários, com `ref` e teclado (Espaço). Use para ajustes que valem na hora; use `Checkbox` para escolhas enviadas depois.',
                'Un checkbox nativo expuesto como `role="switch"`, así que funciona en formularios, con `ref` y teclado (Espacio). Úsalo para ajustes que se aplican al instante; usa `Checkbox` para elecciones que se envían después.',
            ),
            accessibility: {
                notes: [
                    t(
                        'Renders a native `<input type="checkbox" role="switch">` (visually hidden), so Space toggles it and the checked state is exposed natively.',
                        'Renderiza um `<input type="checkbox" role="switch">` nativo (oculto visualmente), então Space alterna e o estado marcado é exposto nativamente.',
                        'Renderiza un `<input type="checkbox" role="switch">` nativo (oculto visualmente), así que Space lo alterna y el estado marcado se expone de forma nativa.',
                    ),
                    t(
                        "The `<label>` wraps the input, so the label text names the switch and the whole row is clickable.",
                        "O `<label>` envolve o input, então o texto do rótulo dá o nome ao switch e a linha inteira é clicável.",
                        "El `<label>` envuelve el input, así que el texto de la etiqueta nombra al switch y toda la fila es clicable.",
                    ),
                    t(
                        '`errorMessage` sets `aria-invalid="true"`; `aria-describedby` points to the error, or to `helperText` when there is no error.',
                        '`errorMessage` define `aria-invalid="true"`; `aria-describedby` aponta para o erro, ou para o `helperText` quando não há erro.',
                        '`errorMessage` define `aria-invalid="true"`; `aria-describedby` apunta al error, o al `helperText` si no hay error.',
                    ),
                    t(
                        "`disabled` is the native attribute: the switch leaves the tab order and the row dims.",
                        "`disabled` é o atributo nativo: o switch sai da ordem de Tab e a linha fica esmaecida.",
                        "`disabled` es el atributo nativo: el switch sale del orden de Tab y la fila se atenúa.",
                    ),
                    t(
                        "The track and thumb are `aria-hidden`; the on/off state is not conveyed by color alone to assistive tech.",
                        "A trilha e o thumb são `aria-hidden`; o estado ligado/desligado não depende só da cor para tecnologias assistivas.",
                        "La pista y el thumb son `aria-hidden`; el estado encendido/apagado no depende solo del color para las tecnologías asistivas.",
                    ),
                ],
                keys: [
                    {
                        keys: "Space",
                        action: t("Toggles the switch.", "Alterna o switch.", "Alterna el switch."),
                    },
                ],
                caveats: [
                    t(
                        "Without `label`, pass `aria-label`; the control has no other name.",
                        "Sem `label`, passe `aria-label`; o controle não tem outro nome.",
                        "Sin `label`, pasa `aria-label`; el control no tiene otro nombre.",
                    ),
                    t(
                        "Use it for settings that apply immediately; for choices submitted later with a form, prefer `Checkbox`.",
                        "Use para ajustes que valem na hora; para escolhas enviadas depois num formulário, prefira `Checkbox`.",
                        "Úsalo para ajustes que se aplican al instante; para opciones enviadas luego en un formulario, prefiere `Checkbox`.",
                    ),
                ],
            },
            code: `import { Switch } from "vaiperui";

<Switch label="Wi-Fi" />
<Switch
  defaultChecked
  variantColor="success"
  label="${t("Notifications", "Notificações", "Notificaciones")}"
  helperText="${t("Sent by email", "Enviadas por e-mail", "Enviadas por correo")}"
/>`,
            demo: (
                <div className="flex flex-col gap-3">
                    <Switch label="Wi-Fi" />
                    <Switch
                        defaultChecked
                        variantColor="success"
                        label={t("Notifications", "Notificações", "Notificaciones")}
                        helperText={t(
                            "Sent by email",
                            "Enviadas por e-mail",
                            "Enviadas por correo",
                        )}
                    />
                </div>
            ),
            props: [
                ...colorRows(false),
                ...textRows,
                native("InputHTMLAttributes<HTMLInputElement>"),
            ],
        },
    ];
}

export function getFormVariations(locale: Locale): Record<string, VariationGroup[]> {
    const t = makeT(locale);
    const colorsTitle = t("Colors", "Cores", "Colores");
    const colorsFile = t("colors.tsx", "cores.tsx", "colores.tsx");
    const sizesTitle = t("Sizes", "Tamanhos", "Tamaños");
    const sizesFile = t("sizes.tsx", "tamanhos.tsx", "tamanos.tsx");
    const statesTitle = t("States", "Estados", "Estados");
    const statesFile = t("states.tsx", "estados.tsx", "estados.tsx");
    const customTitle = t("Custom color", "Cor personalizada", "Color personalizado");
    const customFile = t("custom-color.tsx", "cor-personalizada.tsx", "color-personalizado.tsx");
    const helper = t("helper", "ajuda", "ayuda");
    const error = t("error", "erro", "error");
    const disabled = t("disabled", "desabilitado", "deshabilitado");
    const orange = t("Orange", "Laranja", "Naranja");
    const violet = t("Violet", "Violeta", "Violeta");
    const disabledTitle = t("Disabled", "Desabilitado", "Deshabilitado");

    // Same four groups for the three toggle controls.
    const toggle = (
        tag: "Checkbox" | "Switch",
        Component: typeof Checkbox | typeof Switch,
    ): VariationGroup[] => [
        {
            title: colorsTitle,
            file: colorsFile,
            code: COLORS.map(
                (c) => `<${tag} defaultChecked variantColor="${c}" label="${c}" />`,
            ).join("\n"),
            items: COLORS.map((c) => ({
                label: c,
                node: <Component defaultChecked variantColor={c} label={c} />,
            })),
        },
        {
            title: sizesTitle,
            file: sizesFile,
            code: SIZES.map((s) => `<${tag} defaultChecked size="${s}" label="${s}" />`).join("\n"),
            items: SIZES.map((s) => ({
                label: s,
                node: <Component defaultChecked size={s} label={s} />,
            })),
        },
        {
            title: statesTitle,
            file: statesFile,
            code: `<${tag} label="${helper}" helperText="..." />
<${tag} label="${error}" errorMessage="..." />
<${tag} label="${disabled}" disabled />
<${tag} label="${disabled}" disabled defaultChecked />`,
            items: [
                {
                    label: helper,
                    node: (
                        <Component
                            label={helper}
                            helperText={t("Extra detail", "Detalhe extra", "Detalle extra")}
                        />
                    ),
                },
                {
                    label: error,
                    node: (
                        <Component
                            label={error}
                            errorMessage={t(
                                "This is required",
                                "Isto é obrigatório",
                                "Esto es obligatorio",
                            )}
                        />
                    ),
                },
                { label: disabled, node: <Component label={disabled} disabled /> },
                {
                    label: `${disabled} ✓`,
                    node: <Component label={disabled} disabled defaultChecked />,
                },
            ],
        },
        {
            title: customTitle,
            file: customFile,
            description: t(
                "`customColor` takes any CSS color, or a `{ light, dark }` pair.",
                "`customColor` aceita qualquer cor CSS, ou um par `{ light, dark }`.",
                "`customColor` acepta cualquier color CSS, o un par `{ light, dark }`.",
            ),
            code: `<${tag} defaultChecked customColor="#ff6600" label="${orange}" />
<${tag} defaultChecked customColor={{ light: "#7c3aed", dark: "#a78bfa" }} label="${violet}" />`,
            items: [
                {
                    label: orange,
                    node: <Component defaultChecked customColor="#ff6600" label={orange} />,
                },
                {
                    label: violet,
                    node: (
                        <Component
                            defaultChecked
                            customColor={{ light: "#7c3aed", dark: "#a78bfa" }}
                            label={violet}
                        />
                    ),
                },
            ],
        },
    ];

    const checkbox = toggle("Checkbox", Checkbox);
    checkbox.splice(2, 0, {
        title: t("Indeterminate", "Indeterminado", "Indeterminado"),
        file: t("indeterminate.tsx", "indeterminado.tsx", "indeterminado.tsx"),
        description: t(
            "`indeterminate` shows a dash, for a parent checkbox with only some children checked.",
            "`indeterminate` mostra um traço, para um checkbox pai com só alguns filhos marcados.",
            "`indeterminate` muestra un guion, para un checkbox padre con solo algunos hijos marcados.",
        ),
        code: `<Checkbox indeterminate label="${t("Select all", "Selecionar tudo", "Seleccionar todo")}" />`,
        items: [
            {
                label: "indeterminate",
                node: (
                    <Checkbox
                        indeterminate
                        label={t("Select all", "Selecionar tudo", "Seleccionar todo")}
                    />
                ),
            },
        ],
    });

    const options = [
        {
            value: "free",
            label: "Free",
            description: t(
                "For side projects",
                "Para projetos pessoais",
                "Para proyectos personales",
            ),
        },
        {
            value: "pro",
            label: "Pro",
            description: t("For small teams", "Para times pequenos", "Para equipos pequeños"),
        },
        { value: "team", label: "Team", disabled: true },
    ];

    return {
        textarea: [
            {
                title: colorsTitle,
                file: colorsFile,
                code: COLORS.map((c) => `<Textarea variantColor="${c}" placeholder="${c}" />`).join(
                    "\n",
                ),
                items: COLORS.map((c) => ({
                    label: c,
                    node: <Textarea variantColor={c} placeholder={c} />,
                })),
            },
            {
                title: sizesTitle,
                file: sizesFile,
                code: SIZES.map((s) => `<Textarea size="${s}" placeholder="${s}" />`).join("\n"),
                items: SIZES.map((s) => ({
                    label: s,
                    node: <Textarea size={s} placeholder={s} />,
                })),
            },
            {
                title: t("Resize", "Redimensionar", "Redimensionar"),
                file: t("resize.tsx", "redimensionar.tsx", "redimensionar.tsx"),
                code: `<Textarea resize="none" />
<Textarea resize="vertical" />
<Textarea resize="both" />`,
                items: (["none", "vertical", "both"] as const).map((r) => ({
                    label: r,
                    node: <Textarea resize={r} placeholder={r} />,
                })),
            },
            {
                title: statesTitle,
                file: statesFile,
                code: `<Textarea label="..." helperText="..." />
<Textarea label="..." errorMessage="..." />
<Textarea label="..." disabled />`,
                items: [
                    {
                        label: helper,
                        node: (
                            <Textarea
                                label={helper}
                                helperText={t("Extra detail", "Detalhe extra", "Detalle extra")}
                            />
                        ),
                    },
                    {
                        label: error,
                        node: (
                            <Textarea
                                label={error}
                                errorMessage={t(
                                    "This is required",
                                    "Isto é obrigatório",
                                    "Esto es obligatorio",
                                )}
                            />
                        ),
                    },
                    { label: disabled, node: <Textarea label={disabled} disabled /> },
                ],
            },
            {
                title: customTitle,
                file: customFile,
                code: `<Textarea customColor="#ff6600" label="${orange}" />`,
                items: [{ label: orange, node: <Textarea customColor="#ff6600" label={orange} /> }],
            },
        ],
        slider: [
            {
                title: colorsTitle,
                file: colorsFile,
                code: COLORS.map(
                    (c) => `<Slider aria-label="${c}" variantColor="${c}" defaultValue={[50]} />`,
                ).join("\n"),
                items: COLORS.map((c) => ({
                    label: c,
                    node: <Slider aria-label={c} variantColor={c} defaultValue={[50]} />,
                })),
            },
            {
                title: sizesTitle,
                file: sizesFile,
                code: SIZES.map(
                    (s) => `<Slider aria-label="${s}" size="${s}" defaultValue={[50]} />`,
                ).join("\n"),
                items: SIZES.map((s) => ({
                    label: s,
                    node: <Slider aria-label={s} size={s} defaultValue={[50]} />,
                })),
            },
            {
                title: t("Interval", "Intervalo", "Intervalo"),
                file: t("interval.tsx", "intervalo.tsx", "intervalo.tsx"),
                description: t(
                    "Two values give two thumbs, with the track filled between them. `minStepsBetweenThumbs` keeps a minimum distance.",
                    "Dois valores dão dois botões, com a trilha preenchida entre eles. `minStepsBetweenThumbs` mantém uma distância mínima.",
                    "Dos valores dan dos botones, con la pista rellena entre ellos. `minStepsBetweenThumbs` mantiene una distancia mínima.",
                ),
                code: `<Slider aria-label="..." defaultValue={[20, 80]} />
<Slider aria-label="..." defaultValue={[30, 70]} minStepsBetweenThumbs={10} />`,
                items: [
                    {
                        label: "[20, 80]",
                        node: <Slider aria-label="[20, 80]" defaultValue={[20, 80]} />,
                    },
                    {
                        label: "minStepsBetweenThumbs 10",
                        node: (
                            <Slider
                                aria-label="gap"
                                defaultValue={[30, 70]}
                                minStepsBetweenThumbs={10}
                            />
                        ),
                    },
                ],
            },
            {
                title: t("Steps", "Passos", "Pasos"),
                file: t("steps.tsx", "passos.tsx", "pasos.tsx"),
                code: `<Slider aria-label="..." step={25} defaultValue={[50]} />`,
                items: [
                    {
                        label: "step 25",
                        node: <Slider aria-label="step" step={25} defaultValue={[50]} />,
                    },
                ],
            },
            {
                title: disabledTitle,
                file: statesFile,
                code: `<Slider aria-label="..." defaultValue={[30]} disabled />`,
                items: [
                    {
                        label: disabled,
                        node: <Slider aria-label={disabled} defaultValue={[30]} disabled />,
                    },
                ],
            },
            {
                title: customTitle,
                file: customFile,
                code: `<Slider aria-label="..." customColor="#ff6600" defaultValue={[40]} />`,
                items: [
                    {
                        label: orange,
                        node: (
                            <Slider aria-label={orange} customColor="#ff6600" defaultValue={[40]} />
                        ),
                    },
                ],
            },
        ],
        upload: [
            {
                title: sizesTitle,
                file: sizesFile,
                code: SIZES.map((s) => `<Upload size="${s}" onFilesChange={...} />`).join("\n"),
                items: SIZES.map((s) => ({
                    label: s,
                    node: <Upload size={s} aria-label={s} onFilesChange={() => {}} />,
                })),
            },
            {
                title: colorsTitle,
                file: colorsFile,
                description: t(
                    "The color shows on hover, while dragging and on keyboard focus.",
                    "A cor aparece ao passar o mouse, ao arrastar e no foco do teclado.",
                    "El color aparece al pasar el ratón, al arrastrar y en el foco del teclado.",
                ),
                code: COLORS.map((c) => `<Upload variantColor="${c}" onFilesChange={...} />`).join(
                    "\n",
                ),
                items: COLORS.map((c) => ({
                    label: c,
                    node: <Upload variantColor={c} aria-label={c} onFilesChange={() => {}} />,
                })),
            },
            {
                title: t("Accepted types", "Tipos aceitos", "Tipos aceptados"),
                file: t("accept.tsx", "aceitos.tsx", "aceptados.tsx"),
                code: `<Upload accept=".pdf" description="PDF" />
<Upload accept="image/*" multiple description="Images" />`,
                items: [
                    {
                        label: ".pdf",
                        node: (
                            <Upload
                                accept=".pdf"
                                aria-label="pdf"
                                description="PDF"
                                onFilesChange={() => {}}
                            />
                        ),
                    },
                    {
                        label: "image/* + multiple",
                        node: (
                            <Upload
                                accept="image/*"
                                multiple
                                aria-label="images"
                                description={t("Images", "Imagens", "Imágenes")}
                                onFilesChange={() => {}}
                            />
                        ),
                    },
                ],
            },
            {
                title: statesTitle,
                file: statesFile,
                code: `<Upload label="..." helperText="..." />
<Upload label="..." errorMessage="..." />
<Upload label="..." disabled />`,
                items: [
                    {
                        label: t("helper", "ajuda", "ayuda"),
                        node: (
                            <Upload
                                label={t("helper", "ajuda", "ayuda")}
                                helperText={t("Extra detail", "Detalhe extra", "Detalle extra")}
                                onFilesChange={() => {}}
                            />
                        ),
                    },
                    {
                        label: t("error", "erro", "error"),
                        node: (
                            <Upload
                                label={t("error", "erro", "error")}
                                errorMessage={t(
                                    "The file must be a PDF",
                                    "O arquivo precisa ser um PDF",
                                    "El archivo debe ser un PDF",
                                )}
                                onFilesChange={() => {}}
                            />
                        ),
                    },
                    {
                        label: t("disabled", "desabilitado", "deshabilitado"),
                        node: (
                            <Upload
                                label={t("disabled", "desabilitado", "deshabilitado")}
                                disabled
                                onFilesChange={() => {}}
                            />
                        ),
                    },
                ],
            },
            {
                title: customTitle,
                file: customFile,
                code: `<Upload customColor="#ff6600" onFilesChange={...} />`,
                items: [
                    {
                        label: orange,
                        node: (
                            <Upload
                                customColor="#ff6600"
                                aria-label={orange}
                                onFilesChange={() => {}}
                            />
                        ),
                    },
                ],
            },
        ],
        checkbox,
        switch: toggle("Switch", Switch),
        radio: [
            {
                title: colorsTitle,
                file: colorsFile,
                code: COLORS.map(
                    (c) =>
                        `<RadioGroup variantColor="${c}" options={options} defaultValue="free" />`,
                ).join("\n"),
                items: COLORS.map((c) => ({
                    label: c,
                    node: (
                        <RadioGroup
                            variantColor={c}
                            options={options.slice(0, 2)}
                            defaultValue="free"
                        />
                    ),
                })),
            },
            {
                title: t("Orientation", "Orientação", "Orientación"),
                file: t("orientation.tsx", "orientacao.tsx", "orientacion.tsx"),
                code: `<RadioGroup orientation="vertical" options={options} />
<RadioGroup orientation="horizontal" options={options} />`,
                items: (["vertical", "horizontal"] as const).map((o) => ({
                    label: o,
                    node: (
                        <RadioGroup
                            orientation={o}
                            options={options.slice(0, 2)}
                            defaultValue="free"
                        />
                    ),
                })),
            },
            {
                title: sizesTitle,
                file: sizesFile,
                code: SIZES.map((s) => `<RadioGroup size="${s}" options={options} />`).join("\n"),
                items: SIZES.map((s) => ({
                    label: s,
                    node: <RadioGroup size={s} options={options.slice(0, 2)} defaultValue="free" />,
                })),
            },
            {
                title: statesTitle,
                file: statesFile,
                code: `<RadioGroup helperText="..." options={options} />
<RadioGroup errorMessage="..." options={options} />
<RadioGroup disabled options={options} />`,
                items: [
                    {
                        label: helper,
                        node: (
                            <RadioGroup
                                helperText={t(
                                    "You can change it later",
                                    "Você pode mudar depois",
                                    "Puedes cambiarlo después",
                                )}
                                options={options.slice(0, 2)}
                            />
                        ),
                    },
                    {
                        label: error,
                        node: (
                            <RadioGroup
                                errorMessage={t("Pick one", "Escolha uma", "Elige una")}
                                options={options.slice(0, 2)}
                            />
                        ),
                    },
                    {
                        label: disabled,
                        node: (
                            <RadioGroup
                                disabled
                                options={options.slice(0, 2)}
                                defaultValue="free"
                            />
                        ),
                    },
                ],
            },
            {
                title: customTitle,
                file: customFile,
                code: `<RadioGroup customColor="#ff6600" options={options} />
<Radio name="single" label="${t("A standalone radio", "Um radio avulso", "Un radio suelto")}" />`,
                items: [
                    {
                        label: orange,
                        node: (
                            <RadioGroup
                                customColor="#ff6600"
                                options={options.slice(0, 2)}
                                defaultValue="free"
                            />
                        ),
                    },
                    {
                        label: "Radio",
                        node: (
                            <Radio
                                name="single"
                                label={t(
                                    "A standalone radio",
                                    "Um radio avulso",
                                    "Un radio suelto",
                                )}
                            />
                        ),
                    },
                ],
            },
        ],
    };
}
