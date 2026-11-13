# DatePicker
Field that opens a Calendar to choose a day.

Import: `import { DatePicker } from "vaiperui"`
Types (same import): `DatePickerProps`, `PickerBaseProps`

## Usage
A button that looks like an `Input` shows the chosen day and opens a `Calendar`; choosing a day closes it. The date is not typed (for a typed date, use an `Input` with `mask="date"`). With `name`, the form receives `yyyy-mm-dd`. Focus enters the day on open and returns to the field on `Esc`.

```tsx
import { DatePicker } from "vaiperui";

const [date, setDate] = useState<Date>();

<DatePicker label="Delivery date" value={date} onValueChange={setDate} />
<DatePicker
  label="Delivery date"
  minDate={new Date()}
  weekStartsOn={1}
  locale="en-US"
/>
```

## Props
- `value / defaultValue` (Date): Chosen day, controlled or initial
- `onValueChange` ((date: Date) => void): Called when a day is chosen
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
- Opening the panel focuses the selected day (or today) in the `Calendar`, which follows its grid pattern.

Keyboard:
- `Enter / Space`: Opens or closes the panel from the trigger.
- `Arrow keys, Home, End, Page Up/Down`: Navigate the days inside the open panel (see Calendar); Enter or Space on a day picks it and closes the panel.
- `Esc`: Closes the panel and returns focus to the trigger.

Keep in mind:
- The panel does not trap focus: Tab leaves it, and because it is rendered at the end of `<body>`, Tab from the trigger does not enter it on its own.
- Clicking outside closes the panel without moving focus back; only Esc restores focus to the trigger.
- The date cannot be typed: the only way to set it is the calendar. Use `Input` with `mask="date"` for typed dates.

## Examples

### Sizes
```tsx
<DatePicker size="sm" />
<DatePicker size="md" />
<DatePicker size="lg" />
```

### States
```tsx
<DatePicker label="..." helperText="..." />
<DatePicker label="..." errorMessage="..." />
<DatePicker label="..." disabled />
<DatePicker label="..." readOnly />
```

### Limits
```tsx
<DatePicker label="..." minDate={new Date(2026, 9, 10)} maxDate={new Date(2026, 9, 25)} />
```

### Colors
```tsx
<DatePicker variantColor="success" />
<DatePicker customColor="#ff6600" />
```
