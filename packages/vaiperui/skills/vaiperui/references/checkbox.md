# Checkbox
Accessible checkbox with label, helper and error text, an indeterminate state and colors.

Import: `import { Checkbox } from "vaiperui"`
Types (same import): `CheckboxAnimation`, `CheckboxColors`, `CheckboxProps`, `CheckboxRadius`, `CheckboxSize`

## Usage
A native `<input type="checkbox">` (so forms, `ref` and keyboard just work) with a custom look. Pass `label` to make the whole row clickable, and `indeterminate` for a parent that has only some children checked.

```tsx
import { Checkbox } from "vaiperui";

<Checkbox label="Accept the terms" />
<Checkbox
  defaultChecked
  label="Newsletter"
  helperText="One email per week"
/>
<Checkbox indeterminate label="Select all" />
```

## Props
- `variantColor` (primary | success | warning | danger, default primary): Color of the checked state and focus ring
- `customColor` (string | { light, dark }): Any CSS color (or a pair per theme). Overrides variantColor
- `size` (sm | md | lg, default md): Size of the control and its text
- `radius` (none | sm | md | lg | full, default sm): Corner rounding of the box
- `animation` (none | smooth | fast | bounce, default smooth): Transition when it toggles
- `label` (ReactNode): Text next to the control; clicking it toggles
- `helperText` (string): Secondary line under the label
- `errorMessage` (string): Error text; its presence alone forces the error state
- `indeterminate` (boolean, default false): Shows a dash instead of the check
- `(native)` (InputHTMLAttributes<HTMLInputElement>): checked, defaultChecked, onChange, name, value, disabled, required, aria-*, className, ref, etc.

## Accessibility
- Renders a native `<input type="checkbox">` (visually hidden, drawn over by the custom box), so role, Space toggle and form behavior are native.
- The `<label>` wraps the input, so the label text names it and the whole row is clickable.
- `indeterminate` sets the DOM `indeterminate` property, which assistive tech reads as "mixed".
- `errorMessage` sets `aria-invalid="true"`; `aria-describedby` points to the error, or to `helperText` when there is no error.
- The check and dash icons are `aria-hidden`; state is exposed only by the native input.

Keyboard:
- `Space`: Toggles the checkbox.

Keep in mind:
- Without `label`, pass `aria-label`; the control has no other name.
- `indeterminate` is visual state only: clicking still resolves to checked or unchecked, and you decide what that means.

## Examples

### Colors
```tsx
<Checkbox defaultChecked variantColor="primary" label="primary" />
<Checkbox defaultChecked variantColor="success" label="success" />
<Checkbox defaultChecked variantColor="warning" label="warning" />
<Checkbox defaultChecked variantColor="danger" label="danger" />
```

### Sizes
```tsx
<Checkbox defaultChecked size="sm" label="sm" />
<Checkbox defaultChecked size="md" label="md" />
<Checkbox defaultChecked size="lg" label="lg" />
```

### Indeterminate
`indeterminate` shows a dash, for a parent checkbox with only some children checked.
```tsx
<Checkbox indeterminate label="Select all" />
```

### States
```tsx
<Checkbox label="helper" helperText="..." />
<Checkbox label="error" errorMessage="..." />
<Checkbox label="disabled" disabled />
<Checkbox label="disabled" disabled defaultChecked />
```

### Custom color
`customColor` takes any CSS color, or a `{ light, dark }` pair.
```tsx
<Checkbox defaultChecked customColor="#ff6600" label="Orange" />
<Checkbox defaultChecked customColor={{ light: "#7c3aed", dark: "#a78bfa" }} label="Violet" />
```
