# Slider
Pick a number or an interval by dragging a thumb or using the keyboard.

Import: `import { Slider } from "vaiperui"`
Types (same import): `SliderAnimation`, `SliderColors`, `SliderProps`, `SliderSize`

## Usage
The value is always an array, one number per thumb: `[40]` for a single value, `[20, 80]` for an interval with the track filled between the thumbs. The Slider does not print the chosen number, so show it next to the control. Name it with `aria-label` (required) and, in an interval, each thumb with `thumbLabels`.

```tsx
import { Slider } from "vaiperui";

const [volume, setVolume] = useState([40]);
const [price, setPrice] = useState([200, 800]);

<p>Volume: {volume[0]}%</p>
<Slider aria-label="Volume" value={volume} onValueChange={setVolume} />

<Slider
  aria-label="Price"
  thumbLabels={["Minimum price", "Maximum price"]}
  value={price}
  onValueChange={setPrice}
  min={0}
  max={1000}
  step={10}
/>
```

## Props
- `value / defaultValue` (number[], default [min]): Values, controlled or initial: one number per thumb
- `onValueChange` ((value: number[]) => void): Called while a thumb moves
- `onValueCommit` ((value: number[]) => void): Called when the thumb is released or a key press ends. Use it to fetch data only at the end
- `min / max` (number, default 0 / 100): Limits of the range
- `step` (number, default 1): Step between values
- `minStepsBetweenThumbs` (number, default 0): In an interval, the minimum distance between thumbs, in steps
- `disabled` (boolean, default false): Blocks use
- `name` (string): Form field name; every thumb submits its value under it
- `aria-label` (string, default required): Accessible name. With several thumbs a number is appended
- `thumbLabels` (string[]): Accessible name of each thumb, replacing the numbered aria-label
- `variantColor` (primary | success | warning | danger, default primary): Color of the checked state and focus ring
- `customColor` (string | { light, dark }): Any CSS color (or a pair per theme). Overrides variantColor
- `size` (sm | md | lg, default md): Size of the control and its text
- `animation` (none | smooth | fast | bounce, default smooth): Transition when it toggles

## Accessibility
- Each thumb is a `<div role="slider">` (not a native input) with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and `aria-orientation="horizontal"`.
- `aria-label` is required. With several thumbs a number is appended ("Price 1", "Price 2"), or use `thumbLabels` for custom names.
- Every thumb is a tab stop (`tabIndex=0`); a thumb never crosses its neighbor, and `minStepsBetweenThumbs` keeps a gap between them.
- When `disabled`, thumbs get `aria-disabled="true"` and `tabIndex=-1`, and the control ignores pointer and keyboard input.
- Pressing the track focuses the nearest thumb; `name` adds one hidden input per thumb for form submission.

Keyboard:
- `Arrow Right / Up`: Increase by one `step`.
- `Arrow Left / Down`: Decrease by one `step`.
- `Page Up / Page Down`: Change by 10 steps.
- `Home / End`: Jump to `min` / `max` (limited by neighboring thumbs).

Keep in mind:
- `aria-valuetext` is not set, so screen readers announce the raw number; if it needs a unit, name it in the `aria-label`.
- Dragging is pointer-only; keyboard users rely on the keys above. There is no `aria-labelledby` support, only `aria-label`.

## Examples

### Colors
```tsx
<Slider aria-label="primary" variantColor="primary" defaultValue={[50]} />
<Slider aria-label="success" variantColor="success" defaultValue={[50]} />
<Slider aria-label="warning" variantColor="warning" defaultValue={[50]} />
<Slider aria-label="danger" variantColor="danger" defaultValue={[50]} />
```

### Sizes
```tsx
<Slider aria-label="sm" size="sm" defaultValue={[50]} />
<Slider aria-label="md" size="md" defaultValue={[50]} />
<Slider aria-label="lg" size="lg" defaultValue={[50]} />
```

### Interval
Two values give two thumbs, with the track filled between them. `minStepsBetweenThumbs` keeps a minimum distance.
```tsx
<Slider aria-label="..." defaultValue={[20, 80]} />
<Slider aria-label="..." defaultValue={[30, 70]} minStepsBetweenThumbs={10} />
```

### Steps
```tsx
<Slider aria-label="..." step={25} defaultValue={[50]} />
```

### Disabled
```tsx
<Slider aria-label="..." defaultValue={[30]} disabled />
```

### Custom color
```tsx
<Slider aria-label="..." customColor="#ff6600" defaultValue={[40]} />
```
