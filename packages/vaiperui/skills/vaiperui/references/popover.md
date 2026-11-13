# Popover
Click-triggered panel anchored to an element, with flip/shift and outside click or Escape to close.

Import: `import { Button, Popover, PopoverClose } from "vaiperui"`
Types (same import): `PopoverAlign`, `PopoverAnimation`, `PopoverProps`, `PopoverRadius`, `PopoverSide`

## Usage
The trigger gets `aria-expanded` and `aria-controls`; the panel is a `role="dialog"` named by `label`. Focus moves into the panel on open and returns to the trigger on Escape. It can hold interactive content; use `PopoverClose` for an internal close button. For short hints use `Tooltip`.

```tsx
import { Button, Popover, PopoverClose } from "vaiperui";

<Popover trigger={<Button variant="outlined">Details</Button>} label="Details">
  <p>Anchored content.</p>
  <PopoverClose><Button size="sm">Got it</Button></PopoverClose>
</Popover>
```

## Props
- `trigger` (ReactElement): Element that toggles the panel (needs ref, focus and onClick)
- `label` (string, default required): Accessible name of the panel
- `side / align` (top | right | bottom | left / start | center | end, default bottom / center): Side of the trigger (flips when there is no room) and alignment
- `open / defaultOpen / onOpenChange` (boolean / boolean / (open) => void): Controlled or uncontrolled open state
- `radius / animation` (none | sm | md | lg | full / none | smooth | fast | bounce, default lg / fast): Corner radius and enter transition speed

## Accessibility
- The panel is a `role="dialog"` named by `label` (required), rendered in a portal.
- The trigger gets `aria-haspopup="dialog"`, `aria-expanded` and, while open, `aria-controls` pointing to the panel.
- On open, focus moves to the first focusable element in the panel (or the panel itself).
- Esc closes it and returns focus to the trigger; a click outside also closes it.

Keyboard:
- `Enter / Space`: On the trigger, toggles the panel (native button click)
- `Esc`: Closes the panel and focuses the trigger

Keep in mind:
- It is non-modal: Tab is not trapped, focus leaving the panel does not close it, and the page does not lock scrolling. Tab order follows the DOM, and the panel is at the end of `body`.
- Focus is not restored to the trigger when closing by outside click or `PopoverClose`; the `trigger` must be a focusable element that forwards `ref` and `onClick`.

## Examples

### Sides
```tsx
<Popover side="top" label="top" trigger={<Button>top</Button>}>...</Popover>
<Popover side="right" label="right" trigger={<Button>right</Button>}>...</Popover>
<Popover side="bottom" label="bottom" trigger={<Button>bottom</Button>}>...</Popover>
<Popover side="left" label="left" trigger={<Button>left</Button>}>...</Popover>
```
