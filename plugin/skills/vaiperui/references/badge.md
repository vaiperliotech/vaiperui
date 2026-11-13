# Badge
Small status label with semantic colors and an optional dot.

Import: `import { Badge } from "vaiperui"`
Types (same import): `BadgeProps`, `BadgeRadius`, `BadgeSize`, `BadgeStatus`

## Usage
Use `status` for the semantic color and `dot` for a decorative indicator. It is not interactive. Color must not be the only signal, so the text should state the status. For categories or filters use `Tag`.

```tsx
import { Badge } from "vaiperui";

<Badge status="success" dot>Active</Badge>
<Badge status="warning">Attention</Badge>
```

## Props
- `status` (success | error | warning | info | neutral | pending, default neutral): Semantic color
- `dot` (boolean, default false): Decorative dot before the text
- `size` (sm | md | lg, default md): Size of the element and its text
- `radius` (none | sm | md | lg | full, default full): Corner rounding
- `customColor` (string | { light, dark }): Any CSS color (or a pair per theme) for the badge (overrides status)
- `(native)` (span): Every native prop of the element, className, ref, etc.

## Accessibility
- The badge is a plain `<span>` with no role, so it is read as ordinary text.
- `status` changes only colors (and a dashed border for `pending`); no text or ARIA attribute is added for it.
- The `dot` is `aria-hidden` decoration.
- It is not a live region, so changing its text does not trigger an announcement.

Keep in mind:
- Put the status in the text ("Paid", "Failed"); color alone does not reach screen readers or color-blind users.
- To announce a change, render the badge inside your own `role="status"` region.

## Examples

### Statuses
```tsx
<Badge status="success">success</Badge>
<Badge status="error">error</Badge>
<Badge status="warning">warning</Badge>
<Badge status="info">info</Badge>
<Badge status="neutral">neutral</Badge>
<Badge status="pending">pending</Badge>
```

### With dot
```tsx
<Badge status="success" dot>success</Badge>
<Badge status="error" dot>error</Badge>
<Badge status="warning" dot>warning</Badge>
<Badge status="info" dot>info</Badge>
<Badge status="neutral" dot>neutral</Badge>
<Badge status="pending" dot>pending</Badge>
```

### Sizes
```tsx
<Badge size="sm">sm</Badge>
<Badge size="md">md</Badge>
<Badge size="lg">lg</Badge>
```

### Custom color
```tsx
<Badge customColor="#ff6600" />
<Badge customColor={{ light: "#a855f7", dark: "#fde047" }} />
```
