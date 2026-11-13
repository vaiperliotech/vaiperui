import { Calendar, DatePicker, DateRangePicker, DateTimePicker, TimePicker } from "vaiperui";

import type { Locale } from "@/i18n/config";
import type { ComponentEntry, PropRow } from "./components";
import { makeT } from "./samples";
import type { VariationGroup } from "./variations";

const SIZES = ["sm", "md", "lg"] as const;
const COLORS = ["primary", "success", "warning", "danger"] as const;
const DAY = new Date(2026, 9, 19);
const RANGE = { from: new Date(2026, 9, 12), to: new Date(2026, 9, 18) };
const DATE_TIME = new Date(2026, 9, 19, 14, 30);

/** Locale and the texts every date/time component needs translated. */
function ui(locale: Locale) {
    const t = makeT(locale);
    return {
        t,
        locale: t("en-US", "pt-BR", "es-ES"),
        weekStartsOn: (locale === "es" ? 1 : 0) as 0 | 1,
        previousMonthLabel: t("Previous month", "Mês anterior", "Mes anterior"),
        nextMonthLabel: t("Next month", "Próximo mês", "Mes siguiente"),
        // Plain object: getDatePresets() lives in the client bundle and can't be called from here.
        presetLabels: {
            today: t("Today", "Hoje", "Hoy"),
            last7Days: t("Last 7 days", "Últimos 7 dias", "Últimos 7 días"),
            last30Days: t("Last 30 days", "Últimos 30 dias", "Últimos 30 días"),
            thisMonth: t("This month", "Este mês", "Este mes"),
            lastMonth: t("Last month", "Mês passado", "Mes pasado"),
        },
        timeLabels: {
            hours: t("Hours", "Horas", "Horas"),
            minutes: t("Minutes", "Minutos", "Minutos"),
        },
    };
}

export function getDateComponents(locale: Locale): ComponentEntry[] {
    const u = ui(locale);
    const { t } = u;
    const none = t("none", "nenhum", "ninguno");
    const row = (
        prop: string,
        values: string,
        defaultValue: string,
        en: string,
        pt: string,
        es: string,
    ): PropRow => ({ prop, values, defaultValue, description: t(en, pt, es) });

    const calendarRows: PropRow[] = [
        row(
            "minDate / maxDate",
            "Date",
            none,
            "First and last allowed day; the rest and the month arrows leading outside are disabled",
            "Primeiro e último dia permitidos; o resto e as setas de mês que levam para fora ficam desabilitados",
            "Primer y último día permitidos; el resto y las flechas de mes que llevan fuera quedan deshabilitados",
        ),
        row(
            "locale",
            "string",
            '"en-US"',
            "Language of month/day names and the date format (BCP 47)",
            "Idioma dos nomes de mês/dia e formato da data (BCP 47)",
            "Idioma de los nombres de mes/día y formato de la fecha (BCP 47)",
        ),
        row(
            "weekStartsOn",
            "0 – 6",
            "0",
            "First weekday (0 = Sunday)",
            "Primeiro dia da semana (0 = domingo)",
            "Primer día de la semana (0 = domingo)",
        ),
        row(
            "previousMonthLabel / nextMonthLabel",
            "string",
            '"Previous month" / "Next month"',
            "Accessible names of the month buttons",
            "Nomes acessíveis dos botões de mês",
            "Nombres accesibles de los botones de mes",
        ),
        row(
            "variantColor / customColor / animation",
            "primary | success | warning | danger / CSS color / none | smooth | fast | bounce",
            "primary / smooth",
            "Color of the selection and focus, and transition speed",
            "Cor da seleção e do foco, e velocidade da transição",
            "Color de la selección y del foco, y velocidad de la transición",
        ),
    ];
    const fieldRows: PropRow[] = [
        row(
            "label / helperText",
            "string",
            none,
            "Label above the field and help text below",
            "Rótulo acima do campo e texto de ajuda abaixo",
            "Etiqueta sobre el campo y texto de ayuda debajo",
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
            "placeholder",
            "string",
            t("from the locale", "do idioma", "del idioma"),
            "Text when nothing is chosen (e.g. mm/dd/yyyy)",
            "Texto quando nada foi escolhido (ex.: dd/mm/aaaa)",
            "Texto cuando no se eligió nada (p. ej. dd/mm/aaaa)",
        ),
        row(
            "name",
            "string",
            none,
            "Form field name",
            "Nome do campo no formulário",
            "Nombre del campo del formulario",
        ),
        row(
            "disabled / readOnly",
            "boolean",
            "false",
            "Does not open the panel; readOnly still shows the value",
            "Não abre o painel; readOnly ainda mostra o valor",
            "No abre el panel; readOnly aún muestra el valor",
        ),
        row(
            "variant",
            "ring | outline",
            "ring",
            "Focus style, same as Input",
            "Estilo de foco, igual ao Input",
            "Estilo de foco, igual que Input",
        ),
        row(
            "size / radius",
            "sm | md | lg / none | sm | md | lg | full",
            "md / md",
            "Field height and corner rounding",
            "Altura do campo e arredondamento dos cantos",
            "Altura del campo y redondeo de las esquinas",
        ),
        row(
            "aria-label",
            "string",
            none,
            "Accessible name when there is no label",
            "Nome acessível quando não há rótulo",
            "Nombre accesible cuando no hay etiqueta",
        ),
        row(
            "panelLabel",
            "string",
            none,
            "Accessible name of the open panel",
            "Nome acessível do painel aberto",
            "Nombre accesible del panel abierto",
        ),
    ];
    const timeRows: PropRow[] = [
        row(
            "hour12",
            "boolean",
            "false",
            "12h with an AM/PM column",
            "12h com uma coluna AM/PM",
            "12h con una columna AM/PM",
        ),
        row(
            "minuteStep",
            "number",
            "1",
            "Granularity of the minutes column",
            "Granularidade da coluna de minutos",
            "Granularidad de la columna de minutos",
        ),
        row(
            "labels",
            "{ hours, minutes, period, am, pm }",
            none,
            "Texts of the time columns",
            "Textos das colunas de hora",
            "Textos de las columnas de hora",
        ),
    ];

    const code = (s: string) => s;

    return [
        {
            slug: "calendar",
            name: "Calendar",
            blurb: t(
                "One-month calendar to pick a day or a range, with full keyboard navigation.",
                "Calendário de um mês para escolher um dia ou um intervalo, com navegação completa pelo teclado.",
                "Calendario de un mes para elegir un día o un intervalo, con navegación completa por teclado.",
            ),
            usage: t(
                'The base of `DatePicker` and `DateRangePicker`, also usable on its own (agendas, filters, panels). Values are JavaScript `Date`s that represent a day: the hour is ignored. With `mode="range"`, `value` is a `{ from, to }` object: the first click sets the start, the second sets the end, and a click before the start or on a finished range starts over.',
                'A base do `DatePicker` e do `DateRangePicker`, que também funciona sozinha (agendas, filtros, painéis). Os valores são `Date` do JavaScript que representam um dia: a hora é ignorada. Com `mode="range"`, o `value` é um objeto `{ from, to }`: o primeiro clique define o início, o segundo o fim, e um clique antes do início ou num intervalo completo recomeça.',
                'La base de `DatePicker` y `DateRangePicker`, que también funciona sola (agendas, filtros, paneles). Los valores son `Date` de JavaScript que representan un día: la hora se ignora. Con `mode="range"`, `value` es un objeto `{ from, to }`: el primer clic define el inicio, el segundo el fin, y un clic antes del inicio o en un intervalo completo empieza de nuevo.',
            ),
            code: code(`import { Calendar } from "vaiperui";

const [date, setDate] = useState<Date>();
const [period, setPeriod] = useState<DateRange>({});

<Calendar value={date} onValueChange={setDate} />
<Calendar mode="range" value={period} onValueChange={setPeriod} />`),
            demo: (
                <div className="flex flex-wrap gap-4">
                    <Calendar
                        defaultValue={DAY}
                        locale={u.locale}
                        weekStartsOn={u.weekStartsOn}
                        previousMonthLabel={u.previousMonthLabel}
                        nextMonthLabel={u.nextMonthLabel}
                        className="rounded-lg border border-[var(--vpd-border)]"
                    />
                    <Calendar
                        mode="range"
                        defaultValue={RANGE}
                        locale={u.locale}
                        weekStartsOn={u.weekStartsOn}
                        previousMonthLabel={u.previousMonthLabel}
                        nextMonthLabel={u.nextMonthLabel}
                        className="rounded-lg border border-[var(--vpd-border)]"
                    />
                </div>
            ),
            props: [
                row(
                    "mode",
                    "single | range",
                    "single",
                    "One day or a range. Changes the type of value",
                    "Um dia ou um intervalo. Muda o tipo do value",
                    "Un día o un intervalo. Cambia el tipo de value",
                ),
                row(
                    "value / defaultValue",
                    "Date | { from?: Date; to?: Date }",
                    none,
                    "Selection, controlled or initial",
                    "Seleção, controlada ou inicial",
                    "Selección, controlada o inicial",
                ),
                row(
                    "onValueChange",
                    "(date: Date) => void | (range: DateRange) => void",
                    none,
                    "Called on every click",
                    "Chamado a cada clique",
                    "Se llama en cada clic",
                ),
                row(
                    "autoFocus",
                    "boolean",
                    "false",
                    "Focuses the day on mount; use it when the calendar opens inside a panel",
                    "Foca o dia ao montar; use quando o calendário abre dentro de um painel",
                    "Enfoca el día al montar; úsalo cuando el calendario se abre dentro de un panel",
                ),
                ...calendarRows,
            ],
        },
        {
            slug: "date-picker",
            name: "DatePicker",
            blurb: t(
                "Field that opens a Calendar to choose a day.",
                "Campo que abre um Calendar para escolher um dia.",
                "Campo que abre un Calendar para elegir un día.",
            ),
            usage: t(
                'A button that looks like an `Input` shows the chosen day and opens a `Calendar`; choosing a day closes it. The date is not typed (for a typed date, use an `Input` with `mask="date"`). With `name`, the form receives `yyyy-mm-dd`. Focus enters the day on open and returns to the field on `Esc`.',
                'Um botão com cara de `Input` mostra o dia escolhido e abre um `Calendar`; escolher um dia fecha. A data não é digitada (para data digitada, use um `Input` com `mask="date"`). Com `name`, o formulário recebe `yyyy-mm-dd`. O foco entra no dia ao abrir e volta ao campo no `Esc`.',
                'Un botón con aspecto de `Input` muestra el día elegido y abre un `Calendar`; elegir un día lo cierra. La fecha no se escribe (para una fecha escrita, usa un `Input` con `mask="date"`). Con `name`, el formulario recibe `yyyy-mm-dd`. El foco entra en el día al abrir y vuelve al campo con `Esc`.',
            ),
            code: code(`import { DatePicker } from "vaiperui";

const [date, setDate] = useState<Date>();

<DatePicker label="${t("Delivery date", "Data de entrega", "Fecha de entrega")}" value={date} onValueChange={setDate} />
<DatePicker
  label="${t("Delivery date", "Data de entrega", "Fecha de entrega")}"
  minDate={new Date()}
  weekStartsOn={1}
  locale="${u.locale}"
/>`),
            demo: (
                <div className="flex w-full max-w-xs flex-col gap-4">
                    <DatePicker
                        label={t("Delivery date", "Data de entrega", "Fecha de entrega")}
                        defaultValue={DAY}
                        locale={u.locale}
                        weekStartsOn={u.weekStartsOn}
                        panelLabel={t("Choose a date", "Escolher uma data", "Elegir una fecha")}
                        previousMonthLabel={u.previousMonthLabel}
                        nextMonthLabel={u.nextMonthLabel}
                    />
                    <DatePicker
                        label={t("Birthday", "Aniversário", "Cumpleaños")}
                        locale={u.locale}
                        weekStartsOn={u.weekStartsOn}
                        panelLabel={t("Choose a date", "Escolher uma data", "Elegir una fecha")}
                        previousMonthLabel={u.previousMonthLabel}
                        nextMonthLabel={u.nextMonthLabel}
                    />
                </div>
            ),
            props: [
                row(
                    "value / defaultValue",
                    "Date",
                    none,
                    "Chosen day, controlled or initial",
                    "Dia escolhido, controlado ou inicial",
                    "Día elegido, controlado o inicial",
                ),
                row(
                    "onValueChange",
                    "(date: Date) => void",
                    none,
                    "Called when a day is chosen",
                    "Chamado quando um dia é escolhido",
                    "Se llama cuando se elige un día",
                ),
                ...fieldRows,
                ...calendarRows,
            ],
        },
        {
            slug: "date-range-picker",
            name: "DateRangePicker",
            blurb: t(
                "Field that opens a Calendar to choose a start and an end, with shortcut presets.",
                "Campo que abre um Calendar para escolher início e fim, com atalhos prontos.",
                "Campo que abre un Calendar para elegir inicio y fin, con atajos listos.",
            ),
            usage: t(
                "Shows `start – end` and opens a `Calendar` in range mode; the panel closes after the second click. `onValueChange` runs twice per range: first with only `from`, then with `from` and `to`. `presets` adds a column of shortcuts (Today, Last 7 days...) that set the whole range; pass `true` for the defaults or your own list, starting from `getDatePresets()`.",
                "Mostra `início – fim` e abre um `Calendar` em modo intervalo; o painel fecha após o segundo clique. `onValueChange` roda duas vezes por intervalo: primeiro só com `from`, depois com `from` e `to`. `presets` adiciona uma coluna de atalhos (Hoje, Últimos 7 dias...) que define o intervalo todo; passe `true` para os padrões ou sua própria lista, a partir de `getDatePresets()`.",
                "Muestra `inicio – fin` y abre un `Calendar` en modo intervalo; el panel se cierra tras el segundo clic. `onValueChange` se ejecuta dos veces por intervalo: primero solo con `from`, luego con `from` y `to`. `presets` añade una columna de atajos (Hoy, Últimos 7 días...) que fijan todo el intervalo; pasa `true` para los predeterminados o tu propia lista, a partir de `getDatePresets()`.",
            ),
            code: code(`import { DateRangePicker, getDatePresets } from "vaiperui";

const [period, setPeriod] = useState<DateRange>({});

<DateRangePicker label="${t("Stay", "Hospedagem", "Estancia")}" presets value={period} onValueChange={setPeriod} />

// Custom list, translated labels
<DateRangePicker presets={[
  ...getDatePresets({ today: "${t("Today", "Hoje", "Hoy")}" }).slice(0, 3),
  { label: "Q4", range: { from: new Date(2026, 9, 1), to: new Date(2026, 11, 31) } },
]} />`),
            demo: (
                <div className="flex w-full max-w-sm flex-col gap-4">
                    <DateRangePicker
                        label={t("Stay", "Hospedagem", "Estancia")}
                        defaultValue={RANGE}
                        presets
                        presetLabels={u.presetLabels}
                        locale={u.locale}
                        weekStartsOn={u.weekStartsOn}
                        panelLabel={t(
                            "Choose a period",
                            "Escolher um período",
                            "Elegir un período",
                        )}
                        previousMonthLabel={u.previousMonthLabel}
                        nextMonthLabel={u.nextMonthLabel}
                    />
                </div>
            ),
            props: [
                row(
                    "value / defaultValue",
                    "{ from?: Date; to?: Date }",
                    none,
                    "Range, controlled or initial. Without `to`, only the start was chosen",
                    "Intervalo, controlado ou inicial. Sem `to`, só o início foi escolhido",
                    "Intervalo, controlado o inicial. Sin `to`, solo se eligió el inicio",
                ),
                row(
                    "onValueChange",
                    "(range: DateRange) => void",
                    none,
                    "Called on every click",
                    "Chamado a cada clique",
                    "Se llama en cada clic",
                ),
                row(
                    "presets",
                    "boolean | { label: string; range: { from: Date; to: Date } }[]",
                    none,
                    "Shortcut column; true uses getDatePresets(). Presets outside minDate/maxDate are disabled",
                    "Coluna de atalhos; true usa getDatePresets(). Atalhos fora de minDate/maxDate ficam desabilitados",
                    "Columna de atajos; true usa getDatePresets(). Los atajos fuera de minDate/maxDate quedan deshabilitados",
                ),
                row(
                    "presetLabels",
                    "{ today, last7Days, last30Days, thisMonth, lastMonth }",
                    none,
                    "Translates the default presets (presets={true})",
                    "Traduz os atalhos padrão (presets={true})",
                    "Traduce los atajos predeterminados (presets={true})",
                ),
                row(
                    "fromName / toName",
                    "string",
                    none,
                    "Form field names for start and end; each sends yyyy-mm-dd",
                    "Nomes dos campos de início e fim; cada um envia yyyy-mm-dd",
                    "Nombres de los campos de inicio y fin; cada uno envía yyyy-mm-dd",
                ),
                ...fieldRows.filter((r) => r.prop !== "name"),
                ...calendarRows,
            ],
        },
        {
            slug: "time-picker",
            name: "TimePicker",
            blurb: t(
                "Field that opens hour and minute columns to choose a time of day.",
                "Campo que abre colunas de hora e minuto para escolher um horário.",
                "Campo que abre columnas de hora y minuto para elegir una hora del día.",
            ),
            usage: t(
                'The value is a string `"HH:mm"` in 24h (`"14:30"`), also with `hour12`, which only changes how it is shown and adds an AM/PM column. The panel stays open while you pick: choose the hour, then the minute, and close with `Esc` or by clicking outside. `minuteStep` limits the minutes (e.g. 15).',
                'O valor é uma string `"HH:mm"` em 24h (`"14:30"`), mesmo com `hour12`, que só muda como aparece e adiciona uma coluna AM/PM. O painel fica aberto enquanto você escolhe: escolha a hora, depois o minuto, e feche com `Esc` ou clicando fora. `minuteStep` limita os minutos (ex.: 15).',
                'El valor es una cadena `"HH:mm"` en 24h (`"14:30"`), también con `hour12`, que solo cambia cómo se muestra y añade una columna AM/PM. El panel queda abierto mientras eliges: elige la hora, luego el minuto, y cierra con `Esc` o haciendo clic fuera. `minuteStep` limita los minutos (p. ej. 15).',
            ),
            code: code(`import { TimePicker } from "vaiperui";

const [time, setTime] = useState("14:30");

<TimePicker label="${t("Time", "Horário", "Hora")}" value={time} onValueChange={setTime} />
<TimePicker label="${t("Time", "Horário", "Hora")}" hour12 minuteStep={15} />`),
            demo: (
                <div className="flex w-full max-w-xs flex-col gap-4">
                    <TimePicker
                        label={t("Time", "Horário", "Hora")}
                        defaultValue="14:30"
                        panelLabel={t("Choose a time", "Escolher um horário", "Elegir una hora")}
                        labels={u.timeLabels}
                    />
                    <TimePicker
                        label={t(
                            "Time (12h, every 15 min)",
                            "Horário (12h, a cada 15 min)",
                            "Hora (12h, cada 15 min)",
                        )}
                        hour12
                        minuteStep={15}
                        defaultValue="09:15"
                        panelLabel={t("Choose a time", "Escolher um horário", "Elegir una hora")}
                        labels={u.timeLabels}
                    />
                </div>
            ),
            props: [
                row(
                    "value / defaultValue",
                    "string",
                    none,
                    'Time of day as "HH:mm" (24h), controlled or initial',
                    'Horário como "HH:mm" (24h), controlado ou inicial',
                    'Hora del día como "HH:mm" (24h), controlada o inicial',
                ),
                row(
                    "onValueChange",
                    "(time: string) => void",
                    none,
                    'Called with "HH:mm" when the hour, minute or period changes',
                    'Chamado com "HH:mm" quando hora, minuto ou período mudam',
                    'Se llama con "HH:mm" cuando cambia la hora, el minuto o el período',
                ),
                ...timeRows,
                ...fieldRows.filter((r) => !["placeholder"].includes(r.prop)),
            ],
        },
        {
            slug: "date-time-picker",
            name: "DateTimePicker",
            blurb: t(
                "Field that opens a Calendar and time columns to choose a day and a time.",
                "Campo que abre um Calendar e colunas de hora para escolher dia e horário.",
                "Campo que abre un Calendar y columnas de hora para elegir día y hora.",
            ),
            usage: t(
                "Combines `Calendar` and the `TimePicker` columns in one panel. The value is a `Date` with the day and the time (seconds are ignored). Picking a day keeps the time; picking a time before a day uses today. The panel stays open until `OK`, `Esc` or a click outside. With `name`, the form receives `yyyy-mm-ddTHH:mm`.",
                "Combina o `Calendar` e as colunas do `TimePicker` num só painel. O valor é um `Date` com o dia e o horário (segundos são ignorados). Escolher um dia mantém o horário; escolher um horário antes de um dia usa hoje. O painel fica aberto até `OK`, `Esc` ou um clique fora. Com `name`, o formulário recebe `yyyy-mm-ddTHH:mm`.",
                "Combina el `Calendar` y las columnas del `TimePicker` en un solo panel. El valor es un `Date` con el día y la hora (los segundos se ignoran). Elegir un día mantiene la hora; elegir una hora antes de un día usa hoy. El panel queda abierto hasta `OK`, `Esc` o un clic fuera. Con `name`, el formulario recibe `yyyy-mm-ddTHH:mm`.",
            ),
            code: code(`import { DateTimePicker } from "vaiperui";

const [when, setWhen] = useState<Date>();

<DateTimePicker label="${t("Appointment", "Agendamento", "Cita")}" value={when} onValueChange={setWhen} />
<DateTimePicker label="${t("Appointment", "Agendamento", "Cita")}" hour12 minuteStep={15} minDate={new Date()} />`),
            demo: (
                <div className="flex w-full max-w-xs flex-col gap-4">
                    <DateTimePicker
                        label={t("Appointment", "Agendamento", "Cita")}
                        defaultValue={DATE_TIME}
                        locale={u.locale}
                        weekStartsOn={u.weekStartsOn}
                        confirmLabel={t("OK", "OK", "OK")}
                        panelLabel={t(
                            "Choose date and time",
                            "Escolher data e hora",
                            "Elegir fecha y hora",
                        )}
                        previousMonthLabel={u.previousMonthLabel}
                        nextMonthLabel={u.nextMonthLabel}
                        labels={u.timeLabels}
                    />
                </div>
            ),
            props: [
                row(
                    "value / defaultValue",
                    "Date",
                    none,
                    "Day and time, controlled or initial",
                    "Dia e horário, controlados ou iniciais",
                    "Día y hora, controlados o iniciales",
                ),
                row(
                    "onValueChange",
                    "(date: Date) => void",
                    none,
                    "Called when the day, hour, minute or period changes",
                    "Chamado quando dia, hora, minuto ou período mudam",
                    "Se llama cuando cambia el día, la hora, el minuto o el período",
                ),
                row(
                    "confirmLabel",
                    "string",
                    '"OK"',
                    "Text of the button that closes the panel",
                    "Texto do botão que fecha o painel",
                    "Texto del botón que cierra el panel",
                ),
                ...timeRows,
                ...fieldRows,
                ...calendarRows,
            ],
        },
    ];
}

export function getDateVariations(locale: Locale): Record<string, VariationGroup[]> {
    const u = ui(locale);
    const { t } = u;
    const common = {
        locale: u.locale,
        weekStartsOn: u.weekStartsOn,
        previousMonthLabel: u.previousMonthLabel,
        nextMonthLabel: u.nextMonthLabel,
    };
    const colorsTitle = t("Colors", "Cores", "Colores");
    const colorsFile = t("colors.tsx", "cores.tsx", "colores.tsx");
    const sizesTitle = t("Sizes", "Tamanhos", "Tamaños");
    const sizesFile = t("sizes.tsx", "tamanhos.tsx", "tamanos.tsx");
    const statesTitle = t("States", "Estados", "Estados");
    const statesFile = t("states.tsx", "estados.tsx", "estados.tsx");
    const limitsTitle = t("Limits", "Limites", "Límites");
    const limitsFile = t("limits.tsx", "limites.tsx", "limites.tsx");
    const helper = t("helper", "ajuda", "ayuda");
    const error = t("error", "erro", "error");
    const disabled = t("disabled", "desabilitado", "deshabilitado");
    const readOnly = t("read only", "somente leitura", "solo lectura");
    const field = t("Field", "Campo", "Campo");
    const helperText = t("Extra detail", "Detalhe extra", "Detalle extra");
    const errorText = t("This is required", "Isto é obrigatório", "Esto es obligatorio");
    const min = new Date(2026, 9, 10);
    const max = new Date(2026, 9, 25);

    // Same states for the four field-like pickers: a render function builds one of each.
    const states = (
        render: (props: Record<string, unknown>) => React.ReactNode,
        tag: string,
        extra: string,
    ): VariationGroup => ({
        title: statesTitle,
        file: statesFile,
        code: `<${tag} label="..." helperText="..."${extra} />
<${tag} label="..." errorMessage="..."${extra} />
<${tag} label="..." disabled${extra} />
<${tag} label="..." readOnly${extra} />`,
        items: [
            { label: helper, node: render({ label: helper, helperText }) },
            { label: error, node: render({ label: error, errorMessage: errorText }) },
            { label: disabled, node: render({ label: disabled, disabled: true }) },
            { label: readOnly, node: render({ label: readOnly, readOnly: true }) },
        ],
    });
    const sizes = (
        render: (props: Record<string, unknown>) => React.ReactNode,
        tag: string,
    ): VariationGroup => ({
        title: sizesTitle,
        file: sizesFile,
        code: SIZES.map((s) => `<${tag} size="${s}" />`).join("\n"),
        items: SIZES.map((s) => ({ label: s, node: render({ size: s, "aria-label": s }) })),
    });

    const date = (p: Record<string, unknown>) => (
        <DatePicker defaultValue={DAY} {...common} {...p} />
    );
    const rangePicker = (p: Record<string, unknown>) => (
        <DateRangePicker defaultValue={RANGE} {...common} {...p} />
    );
    const time = (p: Record<string, unknown>) => (
        <TimePicker defaultValue="14:30" labels={u.timeLabels} {...p} />
    );
    const dateTime = (p: Record<string, unknown>) => (
        <DateTimePicker defaultValue={DATE_TIME} {...common} labels={u.timeLabels} {...p} />
    );

    const cal = "rounded-lg border border-[var(--vpd-border)]";

    return {
        calendar: [
            {
                title: t("Single day and range", "Dia único e intervalo", "Día único e intervalo"),
                file: t("modes.tsx", "modos.tsx", "modos.tsx"),
                code: `<Calendar defaultValue={new Date(2026, 9, 19)} />
<Calendar mode="range" defaultValue={{ from: new Date(2026, 9, 12), to: new Date(2026, 9, 18) }} />`,
                items: [
                    {
                        label: "single",
                        node: <Calendar defaultValue={DAY} {...common} className={cal} />,
                    },
                    {
                        label: "range",
                        node: (
                            <Calendar
                                mode="range"
                                defaultValue={RANGE}
                                {...common}
                                className={cal}
                            />
                        ),
                    },
                ],
            },
            {
                title: colorsTitle,
                file: colorsFile,
                code: COLORS.map(
                    (c) => `<Calendar variantColor="${c}" defaultValue={date} />`,
                ).join("\n"),
                items: COLORS.map((c) => ({
                    label: c,
                    node: (
                        <Calendar variantColor={c} defaultValue={DAY} {...common} className={cal} />
                    ),
                })),
            },
            {
                title: limitsTitle,
                file: limitsFile,
                description: t(
                    "`minDate` and `maxDate` disable the days outside and the month arrows that lead there.",
                    "`minDate` e `maxDate` desabilitam os dias de fora e as setas de mês que levam até lá.",
                    "`minDate` y `maxDate` deshabilitan los días fuera y las flechas de mes que llevan allí.",
                ),
                code: `<Calendar minDate={new Date(2026, 9, 10)} maxDate={new Date(2026, 9, 25)} />`,
                items: [
                    {
                        label: "min / max",
                        node: (
                            <Calendar
                                defaultValue={DAY}
                                minDate={min}
                                maxDate={max}
                                {...common}
                                className={cal}
                            />
                        ),
                    },
                ],
            },
            {
                title: t(
                    "Language and first weekday",
                    "Idioma e primeiro dia da semana",
                    "Idioma y primer día de la semana",
                ),
                file: t("locale.tsx", "idioma.tsx", "idioma.tsx"),
                code: `<Calendar locale="pt-BR" weekStartsOn={1} />
<Calendar locale="es-ES" weekStartsOn={1} />`,
                items: [
                    {
                        label: "pt-BR",
                        node: (
                            <Calendar
                                defaultValue={DAY}
                                locale="pt-BR"
                                weekStartsOn={1}
                                className={cal}
                                previousMonthLabel="Mês anterior"
                                nextMonthLabel="Próximo mês"
                            />
                        ),
                    },
                    {
                        label: "es-ES",
                        node: (
                            <Calendar
                                defaultValue={DAY}
                                locale="es-ES"
                                weekStartsOn={1}
                                className={cal}
                                previousMonthLabel="Mes anterior"
                                nextMonthLabel="Mes siguiente"
                            />
                        ),
                    },
                ],
            },
        ],
        "date-picker": [
            sizes(date, "DatePicker"),
            states(date, "DatePicker", ""),
            {
                title: limitsTitle,
                file: limitsFile,
                code: `<DatePicker label="..." minDate={new Date(2026, 9, 10)} maxDate={new Date(2026, 9, 25)} />`,
                items: [
                    {
                        label: "min / max",
                        node: date({ label: "min / max", minDate: min, maxDate: max }),
                    },
                ],
            },
            {
                title: colorsTitle,
                file: colorsFile,
                code: `<DatePicker variantColor="success" />
<DatePicker customColor="#ff6600" />`,
                items: [
                    { label: "success", node: date({ variantColor: "success", label: "success" }) },
                    {
                        label: "customColor",
                        node: date({ customColor: "#ff6600", label: "customColor" }),
                    },
                ],
            },
        ],
        "date-range-picker": [
            {
                title: t("Presets", "Atalhos", "Atajos"),
                file: t("presets.tsx", "atalhos.tsx", "atajos.tsx"),
                description: t(
                    "`presets` adds a shortcut column. `true` uses the defaults; pass a list for your own.",
                    "`presets` adiciona uma coluna de atalhos. `true` usa os padrões; passe uma lista para os seus.",
                    "`presets` añade una columna de atajos. `true` usa los predeterminados; pasa una lista para los tuyos.",
                ),
                code: `<DateRangePicker presets />
<DateRangePicker presets={[{ label: "Q4", range: { from, to } }]} />`,
                items: [
                    {
                        label: "presets",
                        node: rangePicker({
                            label: "presets",
                            presets: true,
                            presetLabels: u.presetLabels,
                        }),
                    },
                    {
                        label: "no presets",
                        node: rangePicker({ label: t("no presets", "sem atalhos", "sin atajos") }),
                    },
                ],
            },
            sizes(rangePicker, "DateRangePicker"),
            states(rangePicker, "DateRangePicker", ""),
        ],
        "time-picker": [
            {
                title: t("24h and 12h", "24h e 12h", "24h y 12h"),
                file: t("hour-cycle.tsx", "formato-hora.tsx", "formato-hora.tsx"),
                code: `<TimePicker defaultValue="14:30" />
<TimePicker hour12 defaultValue="14:30" />`,
                items: [
                    { label: "24h", node: time({ label: "24h" }) },
                    { label: "12h", node: time({ label: "12h", hour12: true }) },
                ],
            },
            {
                title: t("Minute step", "Passo dos minutos", "Paso de los minutos"),
                file: t("minute-step.tsx", "passo-minutos.tsx", "paso-minutos.tsx"),
                code: `<TimePicker minuteStep={15} />
<TimePicker minuteStep={30} />`,
                items: [
                    { label: "15", node: time({ label: "15", minuteStep: 15 }) },
                    { label: "30", node: time({ label: "30", minuteStep: 30 }) },
                ],
            },
            sizes(time, "TimePicker"),
            states(time, "TimePicker", ""),
        ],
        "date-time-picker": [
            {
                title: t("24h and 12h", "24h e 12h", "24h y 12h"),
                file: t("hour-cycle.tsx", "formato-hora.tsx", "formato-hora.tsx"),
                code: `<DateTimePicker />
<DateTimePicker hour12 />`,
                items: [
                    { label: "24h", node: dateTime({ label: "24h" }) },
                    { label: "12h", node: dateTime({ label: "12h", hour12: true }) },
                ],
            },
            {
                title: limitsTitle,
                file: limitsFile,
                code: `<DateTimePicker minDate={new Date()} minuteStep={15} />`,
                items: [
                    {
                        label: "min / maxDate, step 15",
                        node: dateTime({
                            label: field,
                            minDate: min,
                            maxDate: max,
                            minuteStep: 15,
                        }),
                    },
                ],
            },
            sizes(dateTime, "DateTimePicker"),
            states(dateTime, "DateTimePicker", ""),
        ],
    };
}
