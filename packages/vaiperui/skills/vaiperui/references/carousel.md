# Carousel
Slides with arrows, dots, keyboard, optional autoplay and loop.

Import: `import { Carousel } from "vaiperui"`
Types (same import): `CarouselAnimation`, `CarouselColors`, `CarouselProps`, `CarouselRadius`, `CarouselSize`

## Usage
Each child is a slide. It is a `region` with `aria-roledescription="carousel"`; slides are `group`s and the ones out of view are hidden from assistive tech and not focusable. ←/→/Home/End navigate. `autoplay` pauses on hover and focus and never runs with `prefers-reduced-motion`. `index` can be controlled; `slidesPerView` shows several slides at once.

```tsx
import { Carousel } from "vaiperui";

<Carousel aria-label="Featured slides" loop autoplay={4000}>
  <img src="/photos/1.jpg" alt="One" />
  <img src="/photos/2.jpg" alt="Two" />
  <img src="/photos/3.jpg" alt="Three" />
</Carousel>
```

## Props
- `children` (ReactNode): One slide per child
- `aria-label` (string): Accessible name of the carousel
- `index / defaultIndex` (number, default 0): Controlled / initial first visible slide
- `onIndexChange` ((index: number) => void): Called when the position changes
- `slidesPerView` (number, default 1): Slides visible at once
- `loop` (boolean, default false): Wrap from the last position to the first
- `autoplay` (boolean | number, default false): Advance every N ms (true = 5000). Pauses on hover/focus
- `showArrows / showDots` (boolean, default true): Show the arrows / dots
- `previousLabel / nextLabel` (string, default Previous slide / Next slide): Accessible names of the arrows
- `dotLabel` ((index) => string, default Go to slide N): Accessible name of each dot
- `slideLabel` ((index, total) => string, default N of total): Accessible name of each slide
- `variantColor` (primary | success | warning | danger, default primary): Accent color (play button, progress, dots)
- `customColor` (string | { light, dark }): Any CSS color (or a pair per theme). Overrides variantColor
- `size` (sm | md | lg, default md): Size of the controls and text
- `radius` (none | sm | md | lg | full, default lg): Corner rounding
- `animation` (none | smooth | fast | bounce, default smooth): Transition of the controls

## Accessibility
- The root is a `<section>` with `aria-roledescription="carousel"` and the `aria-label` you pass.
- Each slide is a `role="group"` with `aria-roledescription="slide"` and a name from `slideLabel` (default `1 of 5`).
- Slides out of view are `aria-hidden` and `inert`, so their content is neither read nor focusable.
- The arrows are buttons named by `previousLabel` / `nextLabel` (disabled at the ends unless `loop`), and the dots are buttons named by `dotLabel` with `aria-current="true"` on the current one.
- Autoplay pauses while the pointer is over the carousel or focus is inside it, and does not run at all under `prefers-reduced-motion: reduce`; the slide transition is also removed there.
- The slide area is `aria-live="off"` while autoplay runs and `polite` otherwise, so manual changes are announced.

Keyboard:
- `ArrowLeft / ArrowRight`: Previous / next slide (wraps with `loop`)
- `Home / End`: First / last slide
- `Tab`: Moves through the arrows, dots and focusable content of the visible slides

Keep in mind:
- Autoplay has no pause button; hover or focus pauses it. Prefer no autoplay, or a long delay, for content people need to read.
- Alt text of images, and the labels (`aria-label`, `slideLabel`, `dotLabel`, arrows) in the page language, are up to your app.

## Examples

### Several per view
```tsx
<Carousel aria-label="..." slidesPerView={2}>...</Carousel>
```

### Autoplay and loop
Pauses on hover and focus; does not run with prefers-reduced-motion.
```tsx
<Carousel aria-label="..." loop autoplay={3000}>...</Carousel>
```

### Controlled
```tsx
const [index, setIndex] = useState(0);

<Carousel aria-label="..." index={index} onIndexChange={setIndex}>...</Carousel>
```

### Colors
```tsx
<Carousel variantColor="primary" ...>
<Carousel variantColor="success" ...>
<Carousel variantColor="warning" ...>
<Carousel variantColor="danger" ...>
```

### Custom color
```tsx
<Carousel customColor="#db2777" ...>
```
