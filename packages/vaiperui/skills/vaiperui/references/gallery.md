# Gallery
Responsive grid of thumbnails that opens a full-screen viewer.

Import: `import { Gallery } from "vaiperui"`
Types (same import): `GalleryAnimation`, `GalleryItem`, `GalleryProps`, `GalleryRadius`

## Usage
Pass `items` (`src`, `alt`, optional `thumbnail` and `caption`). Each thumbnail is a button that opens the `Lightbox` on that image; focus returns to the thumbnail on close. Control the grid with `columns`, `gap` and `aspectRatio`, or turn the viewer off with `lightbox={false}` and use `onItemClick`.

```tsx
import { Gallery } from "vaiperui";

<Gallery
  aria-label="Trip photos"
  columns={3}
  items={[
    { src: "/photos/road.jpg", alt: "Mountain road", caption: "Road" },
    { src: "/photos/sky.jpg", alt: "Starry sky", thumbnail: "/photos/sky-sm.jpg" },
  ]}
/>
```

## Props
- `items` ({ src, alt, thumbnail?, caption? }[]): Images. `thumbnail` is used in the grid, `src` in the viewer
- `columns` (number, default 3): Grid columns
- `gap` (number, default 8): Space between thumbnails, in px
- `aspectRatio` (string, default 4 / 3): CSS aspect ratio of each thumbnail
- `lightbox` (boolean, default true): Open the viewer on click
- `onItemClick` ((item, index) => void): Called on every thumbnail click
- `openLabel` ((item, index) => string, default Open image N: alt): Accessible name of each thumbnail button
- `lightboxProps` ({ label, closeLabel, previousLabel, nextLabel, counterLabel }): Texts of the viewer
- `radius` (none | sm | md | lg | full, default md): Thumbnail rounding
- `animation` (none | smooth | fast | bounce, default smooth): Hover zoom transition
- `aria-label` (string): Describes the list of images

## Accessibility
- Items are a list (`<ul aria-label>`), and each thumbnail is a real `<button>`, reachable with Tab and activated with Enter or Space.
- Each button is named by `openLabel(item, index)`, which by default is `Open image N: <alt>`.
- `alt` is required on every item and is used on the thumbnail and in the viewer.
- The hover caption is also shown when the button has keyboard focus.
- With `lightbox`, the click opens the `Lightbox` (a modal dialog); without it, the buttons only call `onItemClick`.

Keyboard:
- `Tab`: Moves between thumbnails
- `Enter / Space`: Opens the image in the viewer

Keep in mind:
- Write a real `alt` for each image (describe it, or use an empty string only for purely decorative ones, which should not be in a gallery); the component does not check it.
- Pass `aria-label` for the list and translate `openLabel` for the page language.

## Examples

### Columns
```tsx
<Gallery columns={2} items={items} />
<Gallery columns={4} aspectRatio="1 / 1" items={items} />
```

### Radius and gap
```tsx
<Gallery radius="none" gap={2} items={items} />
<Gallery radius="lg" gap={16} items={items} />
```

### Without viewer
```tsx
<Gallery lightbox={false} onItemClick={(item, i) => select(i)} items={items} />
```
