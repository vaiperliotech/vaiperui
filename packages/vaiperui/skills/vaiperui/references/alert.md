# Alert
Inline message with a title, description, icon, optional action and a close button.

Import: `import { Alert, Button } from "vaiperui"`
Types (same import): `AlertColors`, `AlertProps`, `AlertRadius`, `AlertSize`

## Usage
Use it for feedback tied to a place on the page, such as form validation or an integration status. `warning` and `danger` are announced assertively (`role="alert"`), the others politely. The close button only appears with `onDismiss`. For transient notices use `Toast`, for page-wide ones `Banner`.

```tsx
import { Alert, Button } from "vaiperui";

<Alert variantColor="success" title="Saved">
  Your changes were saved.
</Alert>
<Alert
  variantColor="warning"
  title="Unsaved changes"
  action={<Button size="sm" variant="transparent">Save now</Button>}
  onDismiss={() => setOpen(false)}
>
  ...
</Alert>
```

## Props
- `variantColor` (primary | success | warning | danger, default primary): Color and default icon. warning and danger use role=alert, the rest role=status
- `customColor` (string | { light, dark }): Any CSS color (or a pair per theme). Overrides variantColor
- `size` (sm | md | lg, default md): Padding and text size
- `radius` (none | sm | md | lg | full, default lg): Corner rounding
- `title` (ReactNode): Bold summary above the description (the children)
- `icon` (ReactNode | false, default status icon): Your own icon, or false to hide it
- `action` (ReactNode): Slot for an action, such as a small ghost Button or a link
- `onDismiss` (() => void): Shows the close button and runs on click; you decide whether to unmount
- `dismissLabel` (string, default Dismiss): Accessible name of the close button
- `(native)` (HTMLAttributes<HTMLDivElement>): role (overrides the default), className, style, aria-*, ref, etc.

## Accessibility
- Warning and danger use `role="alert"` (assertive); primary and success use `role="status"` (polite).
- Pass `role` to override the default, for example `role="status"` on a danger alert that should not interrupt.
- The default status icon is `aria-hidden`; it is decoration and carries no meaning for screen readers.
- The close button is a real `<button>` with `aria-label` from `dismissLabel` (default "Dismiss") and a visible focus ring.
- The `action` slot renders your own element, so keep it focusable (a button or link) with a clear label.

Keep in mind:
- Translate `dismissLabel` yourself; the default is English.
- Do not rely on color alone: always include a `title` or text that states the meaning.
- Dismissing does not move focus; if the alert had focus inside, send it somewhere sensible in `onDismiss`.

## Examples

### Colors
```tsx
<Alert variantColor="primary">primary</Alert>
<Alert variantColor="success">success</Alert>
<Alert variantColor="warning">warning</Alert>
<Alert variantColor="danger">danger</Alert>
```

### Sizes
```tsx
<Alert size="sm">sm</Alert>
<Alert size="md">md</Alert>
<Alert size="lg">lg</Alert>
```

### Custom color
```tsx
<Alert customColor="#8b5cf6">Violet</Alert>
```
