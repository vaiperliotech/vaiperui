# Tag
Label for categories or filters, with an optional remove button.

Import: `import { Tag } from "vaiperui"`
Types (same import): `TagColors`, `TagProps`, `TagRadius`, `TagSize`, `TagVariant`

## Usage
`variant` is `filled` or `outline`. Passing `onDismiss` renders a real remove `<button>`; give each one a specific `dismissLabel` so screen readers tell them apart. For semantic status use `Badge`.

```tsx
import { Tag } from "vaiperui";

<Tag>Design</Tag>
<Tag variant="outline">Code</Tag>
<Tag onDismiss={() => remove("React")} dismissLabel="Remove React">React</Tag>
```

## Props
- `variant` (filled | outline, default filled): Tinted background or border only
- `variantColor` (primary | success | warning | danger): Color (neutral when omitted)
- `size` (sm | md | lg, default md): Size of the element and its text
- `radius` (none | sm | md | lg | full, default md): Corner rounding
- `customColor` (string | { light, dark }): Any CSS color (or a pair per theme) for the tag (overrides variantColor)
- `onDismiss` (() => void): Renders a remove button that calls it
- `dismissLabel` (string, default Remove): Accessible name of the remove button
- `(native)` (span): Every native prop of the element, className, ref, etc.

## Accessibility
- The tag is a plain `<span>` with no role; its text is read as ordinary content.
- With `onDismiss`, it renders a real `<button type="button">` with `aria-label` from `dismissLabel` (default "Remove").
- The X icon is `aria-hidden`, and the button shows a focus outline with `:focus-visible`.
- Without `onDismiss` there is no button and the tag is not focusable.

Keyboard:
- `Tab / Shift+Tab`: Moves focus to and from the dismiss button.
- `Enter / Space`: Activates the dismiss button and calls `onDismiss`.

Keep in mind:
- Translate `dismissLabel` yourself; the default is English.
- Give each tag a specific label ("Remove design"), or screen reader users hear the same "Remove" repeatedly.
- Moving focus after a tag is removed is up to your app; the component does not do it.

## Examples

### Variants
```tsx
<Tag>filled</Tag>
<Tag variant="outline">outline</Tag>
```

### Colors
```tsx
<Tag variantColor="primary">primary</Tag>
<Tag variantColor="success">success</Tag>
<Tag variantColor="warning">warning</Tag>
<Tag variantColor="danger">danger</Tag>
```

### Sizes
```tsx
<Tag size="sm">sm</Tag>
<Tag size="md">md</Tag>
<Tag size="lg">lg</Tag>
```

### Custom color
```tsx
<Tag customColor="#ff6600" />
<Tag customColor={{ light: "#a855f7", dark: "#fde047" }} />
```
