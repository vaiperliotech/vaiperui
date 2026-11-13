# Textarea
Multi-line text field with label, helper and error text, and the same focus styles as Input.

Import: `import { Textarea } from "vaiperui"`
Types (same import): `TextareaAnimation`, `TextareaColors`, `TextareaProps`, `TextareaRadius`, `TextareaSize`, `TextareaVariant`

## Usage
A `<textarea>` with every native prop, a `label`, `helperText` and `errorMessage`. It shares `variant` (`ring` or `outline`), colors, sizes, radius and `customColor` with `Input`, and lets you choose the `resize` handle.

```tsx
import { Textarea } from "vaiperui";

<Textarea label="Message" rows={4} />
<Textarea
  label="Bio"
  helperText="A few words about you"
  resize="none"
/>
```

## Props
- `variant` (ring | outline, default ring): Focus style: a ring or only an outline
- `variantColor` (primary | success | warning | danger, default primary): Color of the focus style
- `customColor` (string | { light, dark }): Any CSS color (or a pair per theme). Overrides variantColor
- `size` (sm | md | lg, default md): Padding and text size
- `radius` (none | sm | md | lg | full, default md): Corner rounding
- `animation` (none | smooth | fast | bounce, default smooth): Transition on focus
- `resize` (none | vertical | horizontal | both, default vertical): Which directions the user can drag to resize
- `rows` (number, default 3): Visible lines
- `label` (string): Label above the field
- `helperText` (string): Help text under the field
- `errorMessage` (string): Error text; its presence alone forces the error state
- `(native)` (TextareaHTMLAttributes<HTMLTextAreaElement>): value, defaultValue, onChange, placeholder, maxLength, disabled, aria-*, className, ref, etc.

## Accessibility
- Renders a native `<textarea>`, so role, text editing, selection and spellcheck come from the browser.
- `label` is a `<label htmlFor>` tied to the field through its `id` (generated when you do not pass one).
- `errorMessage` sets `aria-invalid="true"`, and `aria-describedby` points to the error text, or to `helperText` when there is no error.
- Only one description is linked at a time: the error replaces the helper text.
- `disabled` and other native attributes (`readOnly`, `required`, `maxLength`) pass straight to the element.

Keep in mind:
- Without `label`, pass `aria-label` or `aria-labelledby` yourself; the field has no other name.
- The error text is not a live region, so it is not announced when it appears; it is read when the field is focused.

## Examples

### Colors
```tsx
<Textarea variantColor="primary" placeholder="primary" />
<Textarea variantColor="success" placeholder="success" />
<Textarea variantColor="warning" placeholder="warning" />
<Textarea variantColor="danger" placeholder="danger" />
```

### Sizes
```tsx
<Textarea size="sm" placeholder="sm" />
<Textarea size="md" placeholder="md" />
<Textarea size="lg" placeholder="lg" />
```

### Resize
```tsx
<Textarea resize="none" />
<Textarea resize="vertical" />
<Textarea resize="both" />
```

### States
```tsx
<Textarea label="..." helperText="..." />
<Textarea label="..." errorMessage="..." />
<Textarea label="..." disabled />
```

### Custom color
```tsx
<Textarea customColor="#ff6600" label="Orange" />
```
