# Divider
Horizontal or vertical separator, with optional text inside.

Import: `import { Divider } from "vaiperui"`
Types (same import): `DividerColor`, `DividerLabelAlign`, `DividerOrientation`, `DividerProps`, `DividerSpacing`, `DividerVariant`

## Usage
Renders `role="separator"` with `aria-orientation`. Screen readers announce it, so use it only where the separation means something; for pure decoration set `decorative`. A vertical divider stretches to the height of a flex parent.

```tsx
import { Divider } from "vaiperui";

<Divider />
<Divider label="or" variant="dashed" spacing="md" />
<Divider orientation="vertical" customColor="#7c3aed" />
```

## Props
- `orientation` (horizontal | vertical, default horizontal): Direction of the line
- `variant` (solid | dashed | dotted, default solid): Line style
- `spacing` (none | sm | md | lg): Margin around the line (8 / 16 / 24px)
- `color / customColor` (default | strong | soft / CSS color | { light, dark }, default default): Theme border token, or your own color (wins over `color`)
- `label / labelAlign` (ReactNode / start | center | end, default none / center): Text shown inside the line and where it sits
- `decorative` (boolean, default false): Uses role="presentation" instead of separator

## Accessibility
- Without `label` it renders an `<hr>`; with `label` it renders a `<div>`. Both get `role="separator"` and `aria-orientation` matching `orientation`.
- `decorative` switches the role to `presentation` and drops `aria-orientation`, so assistive tech ignores it.
- The label text stays readable; the lines beside it are `aria-hidden`.
- It is not focusable and has no keyboard behavior.

Keep in mind:
- Use `decorative` when the line is only visual, so screen readers do not announce a separator between every item.
- Color and `variant` are visual only: do not rely on them to convey meaning.

## Examples

### Line style
```tsx
<Divider variant="solid" />
<Divider variant="dashed" />
<Divider variant="dotted" />
```

### With label
```tsx
<Divider label="start" labelAlign="start" />
<Divider label="center" />
<Divider label="end" labelAlign="end" />
```

### Color
```tsx
<Divider color="soft" />
<Divider color="strong" />
<Divider customColor="#7c3aed" />
```

### Vertical
```tsx
<div className="flex h-8 items-center gap-3">
  A <Divider orientation="vertical" /> B
</div>
```
