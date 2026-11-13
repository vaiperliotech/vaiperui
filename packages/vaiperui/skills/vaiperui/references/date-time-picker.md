# DateTimePicker
Field that opens a Calendar and time columns to choose a day and a time.

Import: `import { DateTimePicker } from "vaiperui"`
Types (same import): `DateTimePickerProps`

## Usage
Combines `Calendar` and the `TimePicker` columns in one panel. The value is a `Date` with the day and the time (seconds are ignored). Picking a day keeps the time; picking a time before a day uses today. The panel stays open until `OK`, `Esc` or a click outside. With `name`, the form receives `yyyy-mm-ddTHH:mm`.

```tsx
import { DateTimePicker } from "vaiperui";

const [when, setWhen] = useState<Date>();

<DateTimePicker label="Appointment" value={when} onValueChange={setWhen} />
<DateTimePicker label="Appointment" hour12 minuteStep={15} minDate={new Date()} />
```

## Props
- `value / defaultValue` (Date): Day and time, controlled or initial
- `onValueChange` ((date: Date) => void): Called when the day, hour, minute or period changes
- `confirmLabel` (string, default "OK"): Text of the button that closes the panel
- `hour12` (boolean, default false): 12h with an AM/PM column
- `minuteStep` (number, default 1): Granularity of the minutes column
- `labels` ({ hours, minutes, period, am, pm }): Texts of the time columns
- `label / helperText` (string): Label above the field and help text below
- `errorMessage` (string): Error text; its presence alone forces the error state
- `placeholder` (string, default from the locale): Text when nothing is chosen (e.g. mm/dd/yyyy)
- `name` (string): Form field name
- `disabled / readOnly` (boolean, default false): Does not open the panel; readOnly still shows the value
- `variant` (ring | outline, default ring): Focus style, same as Input
- `size / radius` (sm | md | lg / none | sm | md | lg | full, default md / md): Field height and corner rounding
- `aria-label` (string): Accessible name when there is no label
- `id / className` (string): id of the field button (the label points to it) and classes for the wrapper
- `panelLabel` (string): Accessible name of the open panel
- `minDate / maxDate` (Date): First and last allowed day; the rest and the month arrows leading outside are disabled
- `locale` (string, default "en-US"): Language of month/day names and the date format (BCP 47)
- `weekStartsOn` (0 – 6, default 0): First weekday (0 = Sunday)
- `previousMonthLabel / nextMonthLabel` (string, default "Previous month" / "Next month"): Accessible names of the month buttons
- `variantColor / customColor / animation` (primary | success | warning | danger / CSS color / none | smooth | fast | bounce, default primary / smooth): Color of the selection and focus, and transition speed

## Accessibility
- The trigger is a `<button>` with `aria-haspopup="dialog"` and `aria-expanded` reflecting the panel state.
- `label` is linked with `htmlFor`; without `label`, the trigger uses `aria-label`.
- `errorMessage` sets `aria-invalid` and `aria-describedby` to the message; otherwise `helperText` is linked through `aria-describedby`.
- The panel is a `role="dialog"` named by `panelLabel`, rendered in a portal on `document.body`.
- `disabled` disables the button; `readOnly` keeps it focusable but the panel never opens.
- The panel holds a `Calendar` (focused on open, grid pattern) and the time columns, each a `role="group"` named by `labels`.
- Time options are `<button>`s with `aria-pressed` on the selected one; a final confirm button (`confirmLabel`) closes the panel.

Keyboard:
- `Enter / Space`: Opens or closes the panel from the trigger.
- `Arrow keys, Home, End, Page Up/Down`: In the calendar, navigate the days (see Calendar); picking a day keeps the chosen time and does not close the panel.
- `Arrow Up / Down`: In a time column, moves focus to the previous / next option.
- `Tab`: Moves from the calendar to the time options and the confirm button.
- `Esc`: Closes the panel and returns focus to the trigger.

Keep in mind:
- The panel does not trap focus: Tab leaves it, and because it is rendered at the end of `<body>`, Tab from the trigger does not enter it on its own.
- Clicking outside closes the panel without moving focus back; only Esc restores focus to the trigger.
- Date and time cannot be typed. Pass `labels`, `confirmLabel`, `panelLabel` and the month button labels translated; the defaults are in English.

## Examples

### 24h and 12h
```tsx
<DateTimePicker />
<DateTimePicker hour12 />
```

### Limits
```tsx
<DateTimePicker minDate={new Date()} minuteStep={15} />
```

### Sizes
```tsx
<DateTimePicker size="sm" />
<DateTimePicker size="md" />
<DateTimePicker size="lg" />
```

### States
```tsx
<DateTimePicker label="..." helperText="..." />
<DateTimePicker label="..." errorMessage="..." />
<DateTimePicker label="..." disabled />
<DateTimePicker label="..." readOnly />
```
