# Tooltip
Short description on hover and keyboard focus, with delay, arrow and role="tooltip".

Import: `import { Button, Tooltip } from "vaiperui"`
Types (same import): `TooltipColors`, `TooltipProps`, `TooltipRadius`, `TooltipSide`

## Usage
The child gets `aria-describedby` while the tooltip is open. It opens after `delayDuration` on hover (immediately on focus) and closes on leave, blur or Escape. It is non-interactive and capped at 240px wide, so do not put links or buttons inside and do not rely on it for essential information (touch screens have no hover).

```tsx
import { Button, Tooltip } from "vaiperui";

<Tooltip content="Save your changes" title="Shortcut">
  <Button>Save</Button>
</Tooltip>
```

## Props
- `children` (ReactElement, default required): The described element (needs ref and focus)
- `content / title` (ReactNode): Text and optional highlighted heading
- `side` (top | right | bottom | left, default top): Side of the trigger; flips when there is no room
- `showArrow / delayDuration` (boolean / number, default true / 200): Arrow and hover delay in ms
- `open / defaultOpen / onOpenChange` (boolean / boolean / (open) => void): Controlled or uncontrolled open state
- `variantColor / customColor / radius` (neutral | primary | success | warning | danger / CSS color / none | sm | md | lg | full, default neutral / md): Background color and corner radius

## Accessibility
- The bubble has `role="tooltip"` and the child gets `aria-describedby` pointing to it only while it is open.
- It opens on hover after `delayDuration` (default 200ms) and immediately on keyboard focus.
- It closes on mouse leave, blur or Esc; Esc is listened on the document only while it is open.
- The arrow is `aria-hidden`, and the bubble is `pointer-events-none`, so it is never a target.

Keyboard:
- `Tab (focus)`: Focusing the child shows the tooltip; blur hides it
- `Esc`: Closes the tooltip

Keep in mind:
- The child must be focusable (button, link, input) for keyboard and screen reader users to reach the tooltip.
- Keep it short and non-interactive, and never put essential information in it: touch screens have no hover, and the bubble cannot be hovered or clicked.

## Examples

### Sides
```tsx
<Tooltip side="top" content="top"><Button>top</Button></Tooltip>
<Tooltip side="right" content="right"><Button>right</Button></Tooltip>
<Tooltip side="bottom" content="bottom"><Button>bottom</Button></Tooltip>
<Tooltip side="left" content="left"><Button>left</Button></Tooltip>
```

### Colors
```tsx
<Tooltip variantColor="neutral" content="neutral"><Button>neutral</Button></Tooltip>
<Tooltip variantColor="primary" content="primary"><Button>primary</Button></Tooltip>
<Tooltip variantColor="success" content="success"><Button>success</Button></Tooltip>
<Tooltip variantColor="warning" content="warning"><Button>warning</Button></Tooltip>
<Tooltip variantColor="danger" content="danger"><Button>danger</Button></Tooltip>
```
