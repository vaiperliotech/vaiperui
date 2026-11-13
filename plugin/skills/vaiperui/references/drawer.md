# Drawer
Side panel that slides from any edge, with the same dialog behavior as Modal.

Import: `import { Button, Drawer, DrawerClose } from "vaiperui"`
Types (same import): `DrawerAnimation`, `DrawerProps`, `DrawerSide`

## Usage
Same accessibility as `Modal` (focus trap, scroll lock, Escape, backdrop). `side` picks the edge: left/right panels are up to 400px wide, top/bottom ones span the width up to 80% of the height. Use `DrawerClose` around a button to close from inside.

```tsx
import { Button, Drawer, DrawerClose } from "vaiperui";

<Drawer
  trigger={<Button>Open</Button>}
  side="right"
  title="Filters"
  footer={<DrawerClose><Button>Apply</Button></DrawerClose>}
>
  Drawer content
</Drawer>
```

## Props
- `title` (ReactNode, default required): Heading and accessible name (aria-labelledby)
- `footer` (ReactNode): Action buttons; without it neither the footer nor its divider render
- `trigger` (ReactElement): Element that opens it; not needed when controlled
- `open / defaultOpen / onOpenChange` (boolean / boolean / (open) => void): Controlled or uncontrolled open state
- `showClose / closeLabel` (boolean / string, default true / "Close"): × button in the header and its accessible name
- `closeOnEscape / closeOnBackdropClick` (boolean, default true): Whether Escape or a backdrop click closes it
- `side` (left | right | top | bottom, default right): Edge where the panel sits
- `animation` (none | smooth | fast | bounce, default smooth): Slide-in transition

## Accessibility
- The panel is rendered in a portal on `document.body` with `role="dialog"` and `aria-modal="true"`.
- `title` is rendered as an `h2` and linked through `aria-labelledby`; the body is linked through `aria-describedby`.
- On open, focus moves to the first focusable element in the panel (or the panel itself) and returns to the previously focused element on close, if it is still in the DOM.
- Tab and Shift+Tab are trapped inside the panel while it is open, and the body scroll is locked.
- The trigger gets `aria-haspopup="dialog"` and `aria-expanded`.
- The close button has `aria-label` from `closeLabel` (default "Close"); the backdrop is `aria-hidden`.

Keyboard:
- `Tab / Shift+Tab`: Moves focus between elements inside the panel, wrapping at the ends
- `Esc`: Closes it (disabled with `closeOnEscape={false}`)

Keep in mind:
- `title` is required and must describe the dialog; translate `closeLabel` since its default is English.
- The page behind is not marked `inert` or `aria-hidden`; it relies on `aria-modal` and the Tab trap. Clicking the backdrop closes it unless `closeOnBackdropClick={false}`.

## Examples

### Sides
```tsx
<Drawer side="top" title="top" trigger={<Button>top</Button>}>...</Drawer>
<Drawer side="right" title="right" trigger={<Button>right</Button>}>...</Drawer>
<Drawer side="bottom" title="bottom" trigger={<Button>bottom</Button>}>...</Drawer>
<Drawer side="left" title="left" trigger={<Button>left</Button>}>...</Drawer>
```
