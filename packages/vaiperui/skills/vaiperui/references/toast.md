# Toast
Transient notifications fired from anywhere with toast(), rendered by a single Toaster.

Import: `import { Toaster, toast } from "vaiperui"`
Types (same import): `ToastAction`, `ToastColors`, `ToastOptions`, `ToastPosition`, `ToasterProps`

## Usage
Mount `<Toaster />` once near the root, then call `toast({ ... })` (or `useToast()`) anywhere; it returns the id, and `toast.dismiss(id)` closes it. Toasts stack in a portal region, auto-close after `duration` (5000 ms) and pause while hovered or focused; `Esc` closes the focused one. `warning` and `danger` are announced assertively.

```tsx
import { Toaster, toast } from "vaiperui";

// once, at the app root
<Toaster position="top-right" />

toast({ variantColor: "success", title: "Saved", description: "Your changes were saved." })
toast({
  description: "Item removed.",
  action: { label: "Undo", onClick: restore },
})
```

## Props
- `position` (top-left | top-center | top-right | bottom-left | bottom-center | bottom-right, default top-right): Toaster: where the stack sits
- `limit` (number, default 5): Toaster: most toasts shown at once
- `duration` (number, default 5000): Toaster default, or per toast: ms before auto-close; 0 keeps it until dismissed
- `label` (string, default Notifications): Toaster: accessible name of the region
- `dismissLabel` (string, default Dismiss): Toaster: accessible name of the close buttons
- `radius` (none | sm | md | lg | full, default lg): Toaster: corner rounding
- `title / description` (ReactNode): toast(): the content (a plain string works as the description)
- `variantColor / customColor` (primary | success | warning | danger / CSS color, default primary): toast(): color; customColor overrides it
- `icon` (ReactNode | false, default status icon): toast(): your own icon, or false to hide it
- `action` ({ label, onClick }): toast(): an action button; it also closes the toast
- `dismissible` (boolean, default true): toast(): show the close button
- `id / onClose` (string / () => void): toast(): a repeated id replaces the toast; onClose runs when it closes

## Accessibility
- `Toaster` renders a `<section>` with `aria-label` from `label` (default "Notifications") inside a portal on `document.body`.
- Each toast is its own live region: `role="alert"` for warning and danger, `role="status"` for primary and success.
- A toast never takes focus when it appears, so it does not interrupt typing or navigation.
- The auto-close timer pauses while the pointer is over the toast, while focus is inside it, and while the tab is hidden; it resumes with the remaining time.
- The close button is a real `<button>` with `aria-label` from `dismissLabel` (default "Dismiss"); `dismissible: false` removes it.
- A toast `action` is a real `<button>` that runs `onClick` and then closes the toast.

Keyboard:
- `Esc`: Closes the toast that contains the focus.
- `Tab / Shift+Tab`: Moves between the action and the close button of a toast; focus pauses its timer.

Keep in mind:
- Because toasts do not take focus and can vanish, keyboard and screen reader users may miss them: never use a toast as the only way to convey essential information or an error.
- `Esc` only works once focus is inside a toast; there is no global shortcut to reach or dismiss toasts.
- Translate `label` and `dismissLabel` yourself; the defaults are English. Give toasts with an `action` a long or infinite `duration` (`0`).

## Examples

### Colors
```tsx
toast({ variantColor: "primary", description: "primary" })
toast({ variantColor: "success", description: "success" })
toast({ variantColor: "warning", description: "warning" })
toast({ variantColor: "danger", description: "danger" })
```

### Persistent and custom
```tsx
toast({ description: "...", duration: 0 })
toast({ customColor: "#8b5cf6", description: "Violet" })
```
