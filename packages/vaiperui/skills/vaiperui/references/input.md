# Input
All the native <input> props, plus the library's differentiator: Brazilian masks (cpf, cnpj, cei, cep) and global ones (phone, creditCard, cardExpiry, date, time).

Import: `import { Input } from "vaiperui"`
Types (same import): `InputAnimation`, `InputColors`, `InputMask`, `InputProps`, `InputRadius`, `InputSize`, `InputVariant`

## Usage
All the native `<input>` props, plus `mask`, which formats cpf/cnpj/cei/cep (BR) and phone/creditCard/cardExpiry/date/time (global) in real time as the user types. Focus can be a `ring` (default) or just an `outline`.

```tsx
import { Input } from "vaiperui";

<Input label="Phone" mask="phone" />
<Input
  label="Email"
  placeholder="you@company.com"
  errorMessage="Enter a valid email"
/>
```

## Props
- `variant` (ring | outline, default ring): Focus style: ring draws a ring (box-shadow) and highlights the border; outline draws only an outline
- `variantColor` (primary | success | warning | danger, default primary): Border/ring color on focus
- `customColor` (valid CSS color | { light, dark }): Overrides variantColor: paints border and focus from a single color, or from a { light, dark } object with one color per theme
- `size` (sm | md | lg, default md): Height and font size
- `radius` (none | sm | md | lg | full, default md): Rounding
- `animation` (none | smooth | fast | bounce, default smooth): Border/focus ring transition
- `label` (string): Label above the field (associated with the input)
- `helperText` (string): Help text below the field
- `errorMessage` (string): Its mere presence forces the error state, regardless of variantColor/customColor
- `leadingIcon / trailingIcon` (ReactNode): Icon inside the field, on the left/right
- `mask` (cpf | cnpj | cei | cep | phone | creditCard | cardExpiry | date | time | custom): Formats the value automatically as the user types (controlled or not); onChange emits the already-masked string. Formats: cpf 123.456.789-01, cnpj 12.345.678/0001-99, cei 12.345.67890/12, cep 12345-678, phone +55 (11) 98765-4321 or +1 (415) 555-2671, creditCard 4111 1111 1111 1111, cardExpiry 12/28, date 31/12/2025, time 23:59
- `maskRegex` (RegExp): With mask="custom": each typed character must match this regex or it is dropped (e.g. /[0-9a-f]/i for a hex color)
- `maskFormat` ((value: string) => string): With mask="custom": receives the characters kept by maskRegex and returns the displayed text (e.g. prefix "#" for hex colors)
- `(native)` (InputHTMLAttributes<HTMLInputElement>): value, defaultValue, onChange, placeholder, disabled, type, aria-*, className, etc.

## Accessibility
- Renders a native `<input>`; `label` becomes a `<label>` linked by `htmlFor`/`id` (an id is generated if you do not pass one).
- `errorMessage` sets `aria-invalid="true"` and points `aria-describedby` to the error text.
- `helperText` is linked through `aria-describedby`; while an error is shown, only the error is linked and the helper is not rendered.
- `disabled` uses the native attribute and dims the label.
- Preset masks (digit masks) set `inputMode="numeric"`; the formatted value is what the input holds.
- Leading and trailing icons are decorative overlays with `pointer-events-none`.

Keep in mind:
- Without `label`, pass `aria-label` or `aria-labelledby`; a placeholder is not an accessible name.
- The error text has no `role="alert"` or `aria-live`, so it is not announced when it appears; it is read when the field is focused.
- `required` is passed to the native input, but no asterisk or "required" text is drawn in the label.

## Examples

### Colors
```tsx
<Input variantColor="primary" label="Name" placeholder="Type your name" />
<Input variantColor="success" label="Name" placeholder="Type your name" />
<Input variantColor="warning" label="Name" placeholder="Type your name" />
<Input variantColor="danger" label="Name" placeholder="Type your name" />
```

### Focus
`ring` (default) draws a ring and highlights the border; `outline` draws only an outline.
```tsx
<Input variant="ring" label="Name" placeholder="Ring focus" />
<Input variant="outline" label="Name" placeholder="Outline-only focus" />
```

### Masks
The library's differentiator: automatic formatting as the user types, with no external lib.
```tsx
<Input mask="cpf" label="CPF" />
<Input mask="cnpj" label="CNPJ" />
<Input mask="cei" label="CEI" />
<Input mask="cep" label="ZIP" />
<Input mask="phone" label="Phone" />
<Input mask="creditCard" label="Credit card" />
<Input mask="cardExpiry" label="Expiry" />
<Input mask="date" label="Date" />
<Input mask="time" label="Time" />
<Input
  mask="custom"
  maskRegex={/[0-9a-f]/i}
  maskFormat={(v) => (v ? "#" + v.slice(0, 6) : "")}
  placeholder="#ff6600"
  label="Hex color"
/>
```

### Sizes
```tsx
<Input size="sm" label="Name" />
<Input size="md" label="Name" />
<Input size="lg" label="Name" />
```

### Radius
```tsx
<Input radius="none" label="Name" />
<Input radius="sm" label="Name" />
<Input radius="md" label="Name" />
<Input radius="lg" label="Name" />
<Input radius="full" label="Name" />
```

### States
`helperText` adds help; the mere presence of `errorMessage` forces the error state.
```tsx
<Input label="Name" helperText="Full name" />
<Input label="Email" errorMessage="Enter a valid email" />
```

### Custom color
`customColor` overrides `variantColor` and paints border and focus from a single color, or a `{ light, dark }` object with one color per theme.
```tsx
<Input customColor="#ff6600" label="Name" placeholder="Type your name" />
<Input customColor="#22c55e" label="Name" placeholder="Type your name" />
<Input customColor="#a78bfa" label="Name" placeholder="Type your name" />
<Input
  customColor={{ light: "#a855f7", dark: "#fde047" }}
  label="Name"
  placeholder="Type your name"
/>
```
