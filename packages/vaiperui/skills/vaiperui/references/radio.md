# Radio
RadioGroup renders a set of options from an array; Radio is the single native radio.

Import: `import { RadioGroup } from "vaiperui"`
Types (same import): `RadioAnimation`, `RadioColors`, `RadioGroupProps`, `RadioOption`, `RadioProps`, `RadioSize`

## Usage
Use `RadioGroup` with an `options` array (like `Select`): it shares one `name`, works controlled (`value`) or not (`defaultValue`), and arrow keys move between options natively. Use `Radio` alone when you need full control of each row.

```tsx
import { RadioGroup } from "vaiperui";

<RadioGroup
  label="Plan"
  defaultValue="free"
  onValueChange={(plan) => console.log(plan)}
  options={[
    { value: "free", label: "Free", description: "For side projects" },
    { value: "pro", label: "Pro", description: "For small teams" },
    { value: "team", label: "Team", disabled: true },
  ]}
/>
```

## Props
- `options` ({ value, label, description?, disabled? }[]): The options of the RadioGroup
- `value / defaultValue` (string): Controlled / uncontrolled selection
- `onValueChange` ((value: string) => void): Called with the selected value
- `name` (string, default generated): Shared name of the radios, so they submit with a <form>
- `label` (string): Title of the group (a <legend>)
- `orientation` (vertical | horizontal, default vertical): Direction of the options
- `helperText / errorMessage` (string): Text under the group; an error colors every radio
- `disabled` (boolean, default false): Disables every option
- `variantColor` (primary | success | warning | danger, default primary): Color of the checked state and focus ring
- `customColor` (string | { light, dark }): Any CSS color (or a pair per theme). Overrides variantColor
- `size` (sm | md | lg, default md): Size of the control and its text
- `animation` (none | smooth | fast | bounce, default smooth): Transition when it toggles
- `Radio` (InputHTMLAttributes<HTMLInputElement>): Standalone radio: label, helperText, errorMessage, the style props above, and every native input prop

## Accessibility
- `RadioGroup` renders a `<fieldset>` with a `<legend>` (from `label`) and an inner `role="radiogroup"` named by the same `label`.
- Each option is a native `<input type="radio">` sharing one `name`, so the browser provides arrow-key navigation and a single tab stop.
- Each option `label` names its radio and its `description` becomes the radio's `aria-describedby` text.
- `errorMessage` sets `aria-invalid` on the fieldset and on every radio; `aria-describedby` on the fieldset points to the error or helper text.
- `disabled` on the group disables the fieldset; an option can also be disabled on its own.

Keyboard:
- `Tab`: Moves focus into and out of the group (one stop, on the selected option).
- `Arrow keys`: Move to the next or previous option and select it (native radio behavior).
- `Space`: Selects the focused option when none is selected yet.

Keep in mind:
- Always pass `label` to `RadioGroup`; without it the group has no accessible name.
- A standalone `Radio` has no group semantics: give related radios the same `name` and wrap them yourself.

## Examples

### Colors
```tsx
<RadioGroup variantColor="primary" options={options} defaultValue="free" />
<RadioGroup variantColor="success" options={options} defaultValue="free" />
<RadioGroup variantColor="warning" options={options} defaultValue="free" />
<RadioGroup variantColor="danger" options={options} defaultValue="free" />
```

### Orientation
```tsx
<RadioGroup orientation="vertical" options={options} />
<RadioGroup orientation="horizontal" options={options} />
```

### Sizes
```tsx
<RadioGroup size="sm" options={options} />
<RadioGroup size="md" options={options} />
<RadioGroup size="lg" options={options} />
```

### States
```tsx
<RadioGroup helperText="..." options={options} />
<RadioGroup errorMessage="..." options={options} />
<RadioGroup disabled options={options} />
```

### Custom color
```tsx
<RadioGroup customColor="#ff6600" options={options} />
<Radio name="single" label="A standalone radio" />
```
