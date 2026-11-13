# Calendar
One-month calendar to pick a day or a range, with full keyboard navigation.

Import: `import { Calendar } from "vaiperui"`
Types (same import): `CalendarAnimation`, `CalendarColors`, `CalendarOptions`, `CalendarProps`, `CalendarRangeProps`, `CalendarSingleProps`, `DateRange`

## Usage
The base of `DatePicker` and `DateRangePicker`, also usable on its own (agendas, filters, panels). Values are JavaScript `Date`s that represent a day: the hour is ignored. With `mode="range"`, `value` is a `{ from, to }` object: the first click sets the start, the second sets the end, and a click before the start or on a finished range starts over.

```tsx
import { Calendar } from "vaiperui";

const [date, setDate] = useState<Date>();
const [period, setPeriod] = useState<DateRange>({});

<Calendar value={date} onValueChange={setDate} />
<Calendar mode="range" value={period} onValueChange={setPeriod} />
```

## Props
- `mode` (single | range, default single): One day or a range. Changes the type of value
- `value / defaultValue` (Date | { from?: Date; to?: Date }): Selection, controlled or initial
- `onValueChange` ((date: Date) => void | (range: DateRange) => void): Called on every click
- `autoFocus` (boolean, default false): Focuses the day on mount; use it when the calendar opens inside a panel
- `minDate / maxDate` (Date): First and last allowed day; the rest and the month arrows leading outside are disabled
- `locale` (string, default "en-US"): Language of month/day names and the date format (BCP 47)
- `weekStartsOn` (0 – 6, default 0): First weekday (0 = Sunday)
- `previousMonthLabel / nextMonthLabel` (string, default "Previous month" / "Next month"): Accessible names of the month buttons
- `variantColor / customColor / animation` (primary | success | warning | danger / CSS color / none | smooth | fast | bounce, default primary / smooth): Color of the selection and focus, and transition speed

## Accessibility
- The grid is a `<table role="grid">` named by the month title, with `role="gridcell"` cells and `<th scope="col">` weekday headers.
- Each day is a real `<button>` with `aria-label` holding the full date (for example weekday, day, month, year) in the `locale`.
- Roving tabindex: only the focused day has `tabIndex=0`, so Tab goes through the calendar in a single stop.
- Selected days (and every day inside a range) set `aria-selected` on the cell; today gets `aria-current="date"`.
- The month title is an `aria-live="polite"` region, so a month change is announced.
- Days outside `minDate`/`maxDate` are `disabled` buttons; the previous/next buttons are disabled when the month would be out of range.

Keyboard:
- `Tab / Shift+Tab`: Enters and leaves the grid (one stop on the focused day); also reaches the previous/next month buttons.
- `Arrow Left / Right`: Moves focus one day back / forward.
- `Arrow Up / Down`: Moves focus one week back / forward.
- `Home / End`: Moves focus to the first / last day of the week (according to `weekStartsOn`).
- `Page Up / Page Down`: Moves focus one month back / forward.
- `Shift + Page Up / Page Down`: Moves focus one year back / forward.
- `Enter / Space`: Selects the focused day (native button click).

Keep in mind:
- Pass `previousMonthLabel` and `nextMonthLabel` translated; the defaults are in English.
- Set `locale` to the language of the page: it drives the month title, weekday names and the day `aria-label`.
- Keys that move to another month change the shown month, clamped to `minDate`/`maxDate`; the previous/next buttons change the month without moving focus to a day.

## Examples

### Single day and range
```tsx
<Calendar defaultValue={new Date(2026, 9, 19)} />
<Calendar mode="range" defaultValue={{ from: new Date(2026, 9, 12), to: new Date(2026, 9, 18) }} />
```

### Colors
```tsx
<Calendar variantColor="primary" defaultValue={date} />
<Calendar variantColor="success" defaultValue={date} />
<Calendar variantColor="warning" defaultValue={date} />
<Calendar variantColor="danger" defaultValue={date} />
```

### Limits
`minDate` and `maxDate` disable the days outside and the month arrows that lead there.
```tsx
<Calendar minDate={new Date(2026, 9, 10)} maxDate={new Date(2026, 9, 25)} />
```

### Language and first weekday
```tsx
<Calendar locale="pt-BR" weekStartsOn={1} />
<Calendar locale="es-ES" weekStartsOn={1} />
```
