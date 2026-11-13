# TimePicker
Field that opens hour and minute columns to choose a time of day.

Import: `import { TimePicker } from "vaiperui"`
Types (same import): `TimeLabels`, `TimePickerProps`

## Usage
The value is a string `"HH:mm"` in 24h (`"14:30"`), also with `hour12`, which only changes how it is shown and adds an AM/PM column. The panel stays open while you pick: choose the hour, then the minute, and close with `Esc` or by clicking outside. `minuteStep` limits the minutes (e.g. 15).

```tsx
import { TimePicker } from "vaiperui";

const [time, setTime] = useState("14:30");

<TimePicker label="Time" value={time} onValueChange={setTime} />
<TimePicker label="Time" hour12 minuteStep={15} />
```

## Props
- `value / defaultValue` (string): Time of day as "HH:mm" (24h), controlled or initial
- `onValueChange` ((time: string) => void): Called with "HH:mm" when the hour, minute or period changes
- `hour12` (boolean, default false): 12h with an AM/PM column
- `minuteStep` (number, default 1): Granularity of the minutes column
- `labels` ({ hours, minutes, period, am, pm }): Texts of the time columns
- `placeholder` (string, default "--:--"): Text when nothing is chosen ("--:-- --" with hour12)
- `label / helperText` (string): Label above the field and help text below
- `errorMessage` (string): Error text; its presence alone forces the error state
- `name` (string): Form field name
- `disabled / readOnly` (boolean, default false): Does not open the panel; readOnly still shows the value
- `variant` (ring | outline, default ring): Focus style, same as Input
- `size / radius` (sm | md | lg / none | sm | md | lg | full, default md / md): Field height and corner rounding
- `aria-label` (string): Accessible name when there is no label
- `id / className` (string): id of the field button (the label points to it) and classes for the wrapper
- `panelLabel` (string): Accessible name of the open panel
- `variantColor / customColor / animation` (primary | success | warning | danger / CSS color / none | smooth | fast | bounce, default primary / smooth): Color of the selected hour and minute, and of the focus; transition speed

## Accessibility
- The trigger is a `<button>` with `aria-haspopup="dialog"` and `aria-expanded` reflecting the panel state.
- `label` is linked with `htmlFor`; without `label`, the trigger uses `aria-label`.
- `errorMessage` sets `aria-invalid` and `aria-describedby` to the message; otherwise `helperText` is linked through `aria-describedby`.
- The panel is a `role="dialog"` named by `panelLabel`, rendered in a portal on `document.body`.
- `disabled` disables the button; `readOnly` keeps it focusable but the panel never opens.
- Hours, minutes and (with `hour12`) AM/PM are columns, each a `role="group"` named by `labels.hours`, `labels.minutes` and `labels.period`.
- Each option is a `<button>` with `aria-pressed` on the selected one; the selected option is scrolled into view when the panel opens.

Keyboard:
- `Enter / Space`: Opens or closes the panel from the trigger.
- `Arrow Up / Down`: Inside a column, moves focus to the previous / next option.
- `Tab`: Moves between the options of the panel (every option is a tab stop).
- `Enter / Space`: Picks the focused option; the panel stays open.
- `Esc`: Closes the panel and returns focus to the trigger.

Keep in mind:
- Focus is not moved into the panel on open and the panel stays open after a pick: close it with Esc or by clicking outside.
- Clicking outside closes the panel without moving focus back; only Esc restores focus to the trigger.
- The time is only picked from the columns (no typing, no `minuteStep` outside the listed minutes). Pass `labels` and `panelLabel` translated; the defaults are in English.

## Examples

### 24h and 12h
```tsx
<TimePicker defaultValue="14:30" />
<TimePicker hour12 defaultValue="14:30" />
```

### Minute step
```tsx
<TimePicker minuteStep={15} />
<TimePicker minuteStep={30} />
```

### Sizes
```tsx
<TimePicker size="sm" />
<TimePicker size="md" />
<TimePicker size="lg" />
```

### States
```tsx
<TimePicker label="..." helperText="..." />
<TimePicker label="..." errorMessage="..." />
<TimePicker label="..." disabled />
<TimePicker label="..." readOnly />
```
