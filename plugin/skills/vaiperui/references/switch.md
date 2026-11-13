# Switch
On/off toggle with role="switch", label, helper and error text and colors.

Import: `import { Switch } from "vaiperui"`
Types (same import): `SwitchAnimation`, `SwitchColors`, `SwitchProps`, `SwitchSize`

## Usage
A native checkbox exposed as `role="switch"`, so it works in forms, with `ref` and the keyboard (Space). Use it for settings that apply immediately; use `Checkbox` for choices that are submitted later.

```tsx
import { Switch } from "vaiperui";

<Switch label="Wi-Fi" />
<Switch
  defaultChecked
  variantColor="success"
  label="Notifications"
  helperText="Sent by email"
/>
```

## Props
- `variantColor` (primary | success | warning | danger, default primary): Color of the checked state and focus ring
- `customColor` (string | { light, dark }): Any CSS color (or a pair per theme). Overrides variantColor
- `size` (sm | md | lg, default md): Size of the control and its text
- `animation` (none | smooth | fast | bounce, default smooth): Transition when it toggles
- `label` (ReactNode): Text next to the control; clicking it toggles
- `helperText` (string): Secondary line under the label
- `errorMessage` (string): Error text; its presence alone forces the error state
- `(native)` (InputHTMLAttributes<HTMLInputElement>): checked, defaultChecked, onChange, name, value, disabled, required, aria-*, className, ref, etc.

## Accessibility
- Renders a native `<input type="checkbox" role="switch">` (visually hidden), so Space toggles it and the checked state is exposed natively.
- The `<label>` wraps the input, so the label text names the switch and the whole row is clickable.
- `errorMessage` sets `aria-invalid="true"`; `aria-describedby` points to the error, or to `helperText` when there is no error.
- `disabled` is the native attribute: the switch leaves the tab order and the row dims.
- The track and thumb are `aria-hidden`; the on/off state is not conveyed by color alone to assistive tech.

Keyboard:
- `Space`: Toggles the switch.

Keep in mind:
- Without `label`, pass `aria-label`; the control has no other name.
- Use it for settings that apply immediately; for choices submitted later with a form, prefer `Checkbox`.

## Examples

### Colors
```tsx
<Switch defaultChecked variantColor="primary" label="primary" />
<Switch defaultChecked variantColor="success" label="success" />
<Switch defaultChecked variantColor="warning" label="warning" />
<Switch defaultChecked variantColor="danger" label="danger" />
```

### Sizes
```tsx
<Switch defaultChecked size="sm" label="sm" />
<Switch defaultChecked size="md" label="md" />
<Switch defaultChecked size="lg" label="lg" />
```

### States
```tsx
<Switch label="helper" helperText="..." />
<Switch label="error" errorMessage="..." />
<Switch label="disabled" disabled />
<Switch label="disabled" disabled defaultChecked />
```

### Custom color
`customColor` takes any CSS color, or a `{ light, dark }` pair.
```tsx
<Switch defaultChecked customColor="#ff6600" label="Orange" />
<Switch defaultChecked customColor={{ light: "#7c3aed", dark: "#a78bfa" }} label="Violet" />
```
