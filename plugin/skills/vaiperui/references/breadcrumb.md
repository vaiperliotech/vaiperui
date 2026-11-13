# Breadcrumb
Shows where the current page sits in the hierarchy, with a link back to each level.

Import: `import { Breadcrumb, BreadcrumbItem } from "vaiperui"`
Types (same import): `BreadcrumbColors`, `BreadcrumbItemProps`, `BreadcrumbProps`, `BreadcrumbSize`

## Usage
A `nav` with an ordered list of `BreadcrumbItem`s. Give earlier items an `href` and mark the last one `current` (it becomes text with `aria-current="page"`). To use a router link, pass it as the child with `asChild`. Set `maxItems` to collapse long trails behind an ellipsis button, and `separator` to change the divider.

```tsx
import { Breadcrumb, BreadcrumbItem } from "vaiperui";

<Breadcrumb>
  <BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
  <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
  <BreadcrumbItem current>Profile</BreadcrumbItem>
</Breadcrumb>

// with a router link
<BreadcrumbItem asChild>
  <Link href="/settings">Settings</Link>
</BreadcrumbItem>
```

## Props
- `separator` (ReactNode, default /): Drawn between items, hidden from screen readers
- `maxItems` (number): Collapses longer trails into first item, ellipsis and the last maxItems - 1
- `expandLabel` (string, default Show hidden items): Accessible name of the ellipsis button
- `aria-label` (string, default Breadcrumb): Name of the navigation
- `variantColor / customColor` (ControlColors | CustomColor, default primary): Color of the focus ring (and link hover with customColor)
- `size` (sm | md | lg, default md): Text size
- `BreadcrumbItem: href, current, asChild` (string, boolean, boolean): Link target; marks the current page; uses the child element as the link

## Accessibility
- Renders a `<nav>` with `aria-label` (default "Breadcrumb") wrapping an ordered list (`<ol>`/`<li>`).
- `BreadcrumbItem current` renders a `<span>` with `aria-current="page"` instead of a link.
- Separators are `aria-hidden`, so screen readers do not announce them.
- Items with `href` are real links; an item without `href` is plain text, not focusable.
- With `maxItems`, the hidden middle becomes a button labeled by `expandLabel` that reveals all items.

Keyboard:
- `Tab`: Moves through the links and the expand button in order.
- `Enter`: Follows the focused link; Enter or Space activates the expand button.

Keep in mind:
- Translate `expandLabel` and `aria-label`; their defaults are in English.
- Mark the last item with `current`; the component does not infer the current page.

## Examples

### Separator
```tsx
<Breadcrumb separator="›">…</Breadcrumb>
<Breadcrumb separator="→">…</Breadcrumb>
```

### Collapsed
```tsx
<Breadcrumb maxItems={3}>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/a">A</BreadcrumbItem>
  <BreadcrumbItem href="/b">B</BreadcrumbItem>
  <BreadcrumbItem href="/c">C</BreadcrumbItem>
  <BreadcrumbItem current>D</BreadcrumbItem>
</Breadcrumb>
```

### Sizes
```tsx
<Breadcrumb size="sm">…</Breadcrumb>
<Breadcrumb size="md">…</Breadcrumb>
<Breadcrumb size="lg">…</Breadcrumb>
```

### Custom color
```tsx
<Breadcrumb customColor="#f97316">…</Breadcrumb>
```
