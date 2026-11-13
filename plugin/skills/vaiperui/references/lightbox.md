# Lightbox
Full-screen image viewer with navigation, counter and captions.

Import: `import { Lightbox } from "vaiperui"`
Types (same import): `LightboxItem`, `LightboxProps`

## Usage
A modal `role="dialog"` rendered in a portal: focus is trapped, the page scroll is locked, Escape closes and ←/→ navigate (wrapping around). `open` and `index` can be controlled; without them it keeps its own state (`defaultOpen`, `defaultIndex`). Focus returns to the opener on close unless `onCloseAutoFocus` calls `preventDefault()`.

```tsx
import { useState } from "react";
import { Lightbox } from "vaiperui";

const [open, setOpen] = useState(false);

<button onClick={() => setOpen(true)}>Open</button>
<Lightbox
  open={open}
  onOpenChange={setOpen}
  items={[
    { src: "/photos/road.jpg", alt: "Mountain road", caption: "Road" },
    { src: "/photos/sky.jpg", alt: "Starry sky" },
  ]}
/>
```

## Props
- `items` ({ src, alt, caption? }[]): Images to show
- `open / defaultOpen` (boolean, default false): Controlled / initial visibility
- `onOpenChange` ((open: boolean) => void): Called when it asks to close
- `index / defaultIndex` (number, default 0): Controlled / initial image
- `onIndexChange` ((index: number) => void): Called when the image changes
- `label` (string, default Image viewer): Accessible name of the dialog
- `closeLabel / previousLabel / nextLabel` (string, default Close / Previous image / Next image): Accessible names of the buttons
- `counterLabel` ((index, total) => string, default 1 / 6): Text of the counter
- `onCloseAutoFocus` ((event: Event) => void): On close; preventDefault() skips returning the focus

## Accessibility
- The viewer is a `role="dialog"` with `aria-modal="true"`, named by `label`, rendered in a portal.
- On open, focus moves inside and Tab cycles inside the dialog (focus trap); the page scroll is locked while it is open.
- On close, focus returns to the element that had it before, unless `onCloseAutoFocus` calls `preventDefault()`.
- Close, previous and next are real buttons named by `closeLabel`, `previousLabel` and `nextLabel`; previous/next only exist with more than one image and wrap around.
- The image uses its `alt`, inside a `<figure>` with the `caption` as `<figcaption>`.
- The counter (`counterLabel`, e.g. `2 / 5`) is an `aria-live="polite"` region, so the change of image is announced.

Keyboard:
- `Esc`: Closes the viewer
- `ArrowLeft / ArrowRight`: Previous / next image (with more than one)
- `Tab / Shift+Tab`: Cycles through the buttons inside the dialog

Keep in mind:
- Every item needs an `alt`; the component does not generate one.
- Clicking the dark backdrop also closes it, but that is a mouse shortcut; keyboard users close it with Esc or the close button. Translate the labels for the page language.

## Examples

### Default
```tsx
<Lightbox open={open} onOpenChange={setOpen} items={items} />
```
