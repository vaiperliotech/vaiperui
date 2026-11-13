# Container
Centered wrapper with a max width and responsive side padding.

Import: `import { Container } from "vaiperui"`
Types (same import): `ContainerProps`, `ContainerSize`

## Usage
Wrap a page or a section so its content never stretches too wide. It adds 16px of side padding on mobile, 24px from `sm` and 32px from `lg`. It is presentational, so it also works in Server Components.

```tsx
import { Container } from "vaiperui";

<Container size="md" as="main">
  <h1>Title</h1>
</Container>
```

## Props
- `size` (sm | md | lg | xl | full, default lg): Max width: 672 / 896 / 1152 / 1280px / none
- `padded` (boolean, default true): Responsive side padding
- `as` (ElementType, default "div"): Element or component to render (`section`, `ul`, `main`...)
- `className` (string): Merged with the base classes; every native prop is forwarded

## Accessibility
- Renders a plain `<div>` by default, with no role of its own.
- Use `as` to give it a landmark element such as `main`, `section`, `header` or `footer`.
- It only sets width and padding: it has no focus, keyboard or ARIA behavior, and extra props such as `aria-label` go to the element.

Keep in mind:
- A `section` only becomes a landmark when it has an accessible name: pass `aria-label` or `aria-labelledby`.

## Examples

### Sizes
```tsx
<Container size="sm" />
<Container size="md" />
<Container size="full" padded={false} />
```
