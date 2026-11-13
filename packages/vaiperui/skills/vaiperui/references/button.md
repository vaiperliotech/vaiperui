# Button
All the native <button> props, plus variant, color, size, radius, hover and ready-made animations.

Import: `import { Button } from "vaiperui"`
Types (same import): `ButtonAnimation`, `ButtonColors`, `ButtonHover`, `ButtonProps`, `ButtonRadius`, `ButtonSize`, `ButtonVariant`

## Usage
Import from `vaiperui` and use it like a `<button>`: every native prop (`onClick`, `disabled`, `type`, `aria-*`…) keeps working. The look is controlled by the `variant`, `variantColor`, `size`, `radius`, `hover` and `animation` props.

```tsx
import { Button } from "vaiperui";

<Button variantColor="primary" hover="lift">
  Click here
</Button>
<Button variant="outlined2" variantColor="danger">
  Delete
</Button>
```

## Props
- `variant` (solid | solid-inverse | outlined | outlined2 | transparent, default solid): solid: filled background. solid-inverse: filled background with a lighter hover. outlined: soft border and tinted hover. outlined2: strong border and filling hover. transparent: no background/border
- `variantColor` (primary | success | warning | danger, default primary): Semantic color of the button
- `size` (sm | md | lg, default md): Height, padding and font size
- `radius` (none | sm | md | lg | full, default md): Border rounding
- `hover` (none | lift | scale | glow): Extra effect on mouse hover. glow uses the variant color
- `animation` (none | float | pulse | shine | wiggle | wobble | nudge | jelly | heartbeat | jump | gradient | glow): Continuous button animation; respects prefers-reduced-motion
- `customColor` (string | { light: string; dark: string }): Overrides variantColor with any CSS color (or a light/dark pair); hover, border and focus derive from it
- `ripple` (boolean, default false): Ripple effect from the click point; also triggers from the keyboard. Respects prefers-reduced-motion
- `iconStart / iconEnd` (ReactNode): Icon/content before or after the text
- `(native)` (ButtonHTMLAttributes<HTMLButtonElement>): onClick, disabled, type, aria-*, className (overrides styles), etc.

## Accessibility
- Renders a native `<button>`, so role, focus and Enter/Space activation come from the browser.
- `type` defaults to `"button"`, so it does not submit a form unless you pass `type="submit"`.
- `disabled` uses the native attribute: the button leaves the tab order and ignores clicks.
- A visible focus ring (`focus-visible`) is applied on keyboard focus.
- The ripple is `aria-hidden` and hidden with `prefers-reduced-motion`; the looping `animation` presets only run under `motion-safe`.

Keyboard:
- `Enter`: Activates the button.
- `Space`: Activates the button.

Keep in mind:
- Icon-only buttons have no accessible name: pass `aria-label`. `iconStart`/`iconEnd` are not hidden from assistive tech, so mark decorative icons `aria-hidden`.
- There is no built-in loading or pressed state: set `aria-busy` or `aria-pressed` yourself when needed.

## Examples

### Colors
```tsx
<Button variantColor="primary">Button</Button>
<Button variantColor="success">Button</Button>
<Button variantColor="warning">Button</Button>
<Button variantColor="danger">Button</Button>
```

### Styles
Same color (`primary`) on all of them: what changes is the fill and the outline.
```tsx
<Button variant="solid" variantColor="primary">Button</Button>
<Button variant="solid-inverse" variantColor="primary">Button</Button>
<Button variant="outlined" variantColor="primary">Button</Button>
<Button variant="outlined2" variantColor="primary">Button</Button>
<Button variant="transparent" variantColor="primary">Button</Button>
```

### Sizes
```tsx
<Button size="sm">Button</Button>
<Button size="md">Button</Button>
<Button size="lg">Button</Button>
```

### Radius
```tsx
<Button radius="none">Button</Button>
<Button radius="sm">Button</Button>
<Button radius="md">Button</Button>
<Button radius="lg">Button</Button>
<Button radius="full">Button</Button>
```

### Hover
`glow` uses the variant color for the glow. Hover to see it.
```tsx
<Button hover="none">Button</Button>
<Button hover="lift">Button</Button>
<Button hover="scale">Button</Button>
<Button hover="glow" variantColor="primary">Button</Button>
```

### Animations
They respect `prefers-reduced-motion`.
```tsx
<Button animation="float">Float</Button>
<Button animation="pulse">Pulse</Button>
<Button animation="shine">Shine</Button>
<Button animation="jelly">Jelly</Button>
<Button animation="jump">Jump</Button>
<Button animation="gradient">Gradient</Button>
```

### Custom color
`customColor` overrides `variantColor` with a single color, or a `{ light, dark }` object with one color per theme.
```tsx
<Button customColor="#ff6600">Orange</Button>
<Button customColor="#a78bfa" variant="outlined">Violet</Button>
<Button customColor={{ light: "#a855f7", dark: "#f472b6" }}>Light/dark</Button>
```

### Ripple
`ripple` creates a wave from the click point. It uses the button's text color.
```tsx
<Button ripple>Solid</Button>
<Button ripple variant="outlined">Outlined</Button>
<Button ripple variant="transparent" variantColor="success">Transparent</Button>
```
