# Banner
Full-width page-level message, with an optional action and close button.

Import: `import { Banner, Button } from "vaiperui"`
Types (same import): `BannerColors`, `BannerProps`, `BannerSize`

## Usage
Fills the width of its container with no radius, so place it at the top of the page. Use it for maintenance windows, announcements and trial notices. Same status roles as `Alert`.

```tsx
import { Banner, Button } from "vaiperui";

<Banner
  action={<Button size="sm" variant="transparent">Learn more</Button>}
  onDismiss={() => setOpen(false)}
>
  Scheduled maintenance today at 10 PM.
</Banner>
```

## Props
- `variantColor` (primary | success | warning | danger, default primary): Color and default icon. warning and danger use role=alert, the rest role=status
- `customColor` (string | { light, dark }): Any CSS color (or a pair per theme). Overrides variantColor
- `size` (sm | md | lg, default md): Padding and text size
- `icon` (ReactNode | false, default status icon): Your own icon, or false to hide it
- `action` (ReactNode): Slot for an action, such as a small ghost Button or a link
- `onDismiss` (() => void): Shows the close button and runs on click; you decide whether to unmount
- `dismissLabel` (string, default Dismiss): Accessible name of the close button
- `(native)` (HTMLAttributes<HTMLDivElement>): role (overrides the default), className, style, aria-*, ref, etc.

## Accessibility
- Same roles as `Alert`: `role="alert"` for warning and danger, `role="status"` for primary and success; `role` can be overridden.
- A banner is a plain `div`, not a landmark; it does not get `role="banner"`.
- The status icon is `aria-hidden`.
- The close button is a real `<button>` with `aria-label` from `dismissLabel` (default "Dismiss").
- The `action` slot renders your own element; keep it a focusable button or link.

Keep in mind:
- Translate `dismissLabel`; the default is English.
- Do not rely on color alone; the message text must state what happened.
- Dismissing does not manage focus, and a banner shown at load may not be announced by every screen reader.

## Examples

### Colors
```tsx
<Banner variantColor="primary">primary</Banner>
<Banner variantColor="success">success</Banner>
<Banner variantColor="warning">warning</Banner>
<Banner variantColor="danger">danger</Banner>
```

### Sizes
```tsx
<Banner size="sm">sm</Banner>
<Banner size="md">md</Banner>
<Banner size="lg">lg</Banner>
```

### Custom color
```tsx
<Banner customColor="#8b5cf6">Violet</Banner>
```
