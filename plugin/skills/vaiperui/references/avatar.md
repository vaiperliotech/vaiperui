# Avatar
Round user picture that falls back to initials when there is no image or it fails to load.

Import: `import { Avatar } from "vaiperui"`
Types (same import): `AvatarColors`, `AvatarProps`, `AvatarRadius`, `AvatarSize`

## Usage
`name` is required: it gives the initials (first and last words) and the accessible label (`role="img"`), while the image is decorative. Pass `src` for a picture; if it is missing or breaks, the initials show.

```tsx
import { Avatar } from "vaiperui";

<Avatar name="Camila Souza" />
<Avatar name="Yuki Tanaka" src="/avatars/yuki.jpg" size="lg" />
<Avatar name="Ada Lovelace" variantColor="success" />
```

## Props
- `name` (string, default required): Full name: initials and accessible label
- `src` (string): Image URL; initials show if missing or broken
- `size` (sm | md | lg, default md): 32, 40 or 56px
- `radius` (none | sm | md | lg | full, default full): Corner rounding
- `variantColor` (primary | success | warning | danger): Tints the initials fallback (neutral when omitted)
- `customColor` (string | { light, dark }): Any CSS color (or a pair per theme) for the initials fallback
- `(native)` (span): Every native prop of the element, className, ref, etc.

## Accessibility
- The root is a `<span>` with `role="img"` and `aria-label` set from `name`.
- The inner `<img>` has `alt=""` and the initials are `aria-hidden`, so screen readers announce only `name`.
- If `src` fails to load, the image is dropped and the initials are shown instead.
- It is not focusable and has no keyboard behavior.

Keep in mind:
- `name` is the accessible label: use the person's real name, not a filename.
- To make an avatar clickable, wrap it in your own `<button>` or link.

## Examples

### Sizes
```tsx
<Avatar name="Ada Lovelace" size="sm" />
<Avatar name="Ada Lovelace" size="md" />
<Avatar name="Ada Lovelace" size="lg" />
```

### Colors
```tsx
<Avatar name="Ada Lovelace" variantColor="primary" />
<Avatar name="Ada Lovelace" variantColor="success" />
<Avatar name="Ada Lovelace" variantColor="warning" />
<Avatar name="Ada Lovelace" variantColor="danger" />
```

### Radius
```tsx
<Avatar name="Ada Lovelace" radius="none" />
<Avatar name="Ada Lovelace" radius="sm" />
<Avatar name="Ada Lovelace" radius="md" />
<Avatar name="Ada Lovelace" radius="lg" />
<Avatar name="Ada Lovelace" radius="full" />
```

### Custom color
```tsx
<Avatar name="Ada Lovelace" customColor="#ff6600" />
<Avatar name="Ada Lovelace" customColor={{ light: "#a855f7", dark: "#fde047" }} />
```
