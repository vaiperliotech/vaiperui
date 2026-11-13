# Modal
Dialog over a backdrop with focus trap, scroll lock, Escape/backdrop close and role="dialog".

Import: `import { Button, Modal, ModalClose } from "vaiperui"`
Types (same import): `ModalAnimation`, `ModalProps`, `ModalRadius`, `ModalSize`

## Usage
Rendered in a portal with `aria-modal`, named by `title`. Focus moves in when it opens and returns to the trigger on close; Tab stays inside and the page behind does not scroll. Pass `trigger` for the uncontrolled case, or `open` + `onOpenChange` to control it. Wrap a footer button in `ModalClose` to close it.

```tsx
import { Button, Modal, ModalClose } from "vaiperui";

<Modal
  trigger={<Button>Open</Button>}
  title="Delete project?"
  footer={
    <>
      <ModalClose><Button variant="outlined">Cancel</Button></ModalClose>
      <ModalClose><Button variantColor="danger">Delete</Button></ModalClose>
    </>
  }
>
  This action cannot be undone.
</Modal>
```

## Props
- `title` (ReactNode, default required): Heading and accessible name (aria-labelledby)
- `footer` (ReactNode): Action buttons; without it neither the footer nor its divider render
- `trigger` (ReactElement): Element that opens it; not needed when controlled
- `open / defaultOpen / onOpenChange` (boolean / boolean / (open) => void): Controlled or uncontrolled open state
- `showClose / closeLabel` (boolean / string, default true / "Close"): × button in the header and its accessible name
- `closeOnEscape / closeOnBackdropClick` (boolean, default true): Whether Escape or a backdrop click closes it
- `size` (sm | md | lg, default sm): Max width: 480, 640 or 800px
- `showHeaderDivider / showFooterDivider` (boolean, default true): Lines between header, body and footer
- `radius / animation` (none | sm | md | lg | full / none | smooth | fast | bounce, default lg / smooth): Corner radius and enter transition speed

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

### Sizes
```tsx
<Modal size="sm" title="sm" trigger={<Button>sm</Button>}>...</Modal>
<Modal size="md" title="md" trigger={<Button>md</Button>}>...</Modal>
<Modal size="lg" title="lg" trigger={<Button>lg</Button>}>...</Modal>
```

### Controlled
The parent owns `open` and reacts to the answer.
```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open</Button>
<Modal open={open} onOpenChange={setOpen} title="..." footer={...}>...</Modal>
```
