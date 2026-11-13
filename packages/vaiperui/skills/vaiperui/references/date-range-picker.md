# DateRangePicker
Field that opens a Calendar to choose a start and an end, with shortcut presets.

Import: `import { DateRangePicker, getDatePresets, type DateRange } from "vaiperui"`
Types (same import): `DatePreset`, `DateRangePickerProps`

## Usage
Shows `start – end` and opens a `Calendar` in range mode; the panel closes after the second click. `onValueChange` runs twice per range: first with only `from`, then with `from` and `to`. `presets` adds a column of shortcuts (Today, Last 7 days...) that set the whole range; pass `true` for the defaults or your own list, starting from `getDatePresets()`.

```tsx
import { DateRangePicker, getDatePresets, type DateRange } from "vaiperui";

const [period, setPeriod] = useState<DateRange>({});

<DateRangePicker label="Stay" presets value={period} onValueChange={setPeriod} />

// Custom list, translated labels
<DateRangePicker presets={[
  ...getDatePresets({ today: "Today" }).slice(0, 3),
  { label: "Q4", range: { from: new Date(2026, 9, 1), to: new Date(2026, 11, 31) } },
]} />
```

## Props
- `value / defaultValue` ({ from?: Date; to?: Date }): Range, controlled or initial. Without `to`, only the start was chosen
- `onValueChange` ((range: DateRange) => void): Called on every click
- `presets` (boolean | { label: string; range: { from: Date; to: Date } }[]): Shortcut column; true uses getDatePresets(). Presets outside minDate/maxDate are disabled
- `presetLabels` ({ today, last7Days, last30Days, thisMonth, lastMonth }): Translates the default presets (presets={true})
- `fromName / toName` (string): Form field names for start and end; each sends yyyy-mm-dd
- `label / helperText` (string): Label above the field and help text below
- `errorMessage` (string): Error text; its presence alone forces the error state
- `placeholder` (string, default from the locale): Text when nothing is chosen (e.g. mm/dd/yyyy)
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
- The trigger text reads as `start – end`; while only the start is chosen it shows `start – …`.
- Presets are `<button>`s with `aria-pressed` when they match the current range, and `disabled` when they fall outside `minDate`/`maxDate`.
- Opening the panel focuses a day in the range `Calendar`, which follows its grid pattern.

Keyboard:
- `Enter / Space`: Opens or closes the panel from the trigger.
- `Arrow keys, Home, End, Page Up/Down`: Navigate the days inside the open panel (see Calendar); Enter or Space picks the start, then the end, which closes the panel.
- `Esc`: Closes the panel and returns focus to the trigger.

Keep in mind:
- The panel does not trap focus: Tab leaves it, and because it is rendered at the end of `<body>`, Tab from the trigger does not enter it on its own.
- Clicking outside closes the panel without moving focus back; only Esc restores focus to the trigger.
- Pass `presetLabels` (or your own `presets`) translated when using presets; the defaults are in English. The dates cannot be typed.

## Examples

### Presets
`presets` adds a shortcut column. `true` uses the defaults; pass a list for your own.
```tsx
<DateRangePicker presets />
<DateRangePicker presets={[{ label: "Q4", range: { from, to } }]} />
```

### Sizes
```tsx
<DateRangePicker size="sm" />
<DateRangePicker size="md" />
<DateRangePicker size="lg" />
```

### States
```tsx
<DateRangePicker label="..." helperText="..." />
<DateRangePicker label="..." errorMessage="..." />
<DateRangePicker label="..." disabled />
<DateRangePicker label="..." readOnly />
```
