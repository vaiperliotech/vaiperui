# Grid
CSS grid with responsive columns, gap and items that span columns or rows.

Import: `import { Grid, GridItem } from "vaiperui"`
Types (same import): `GridBreakpoint`, `GridColumns`, `GridItemProps`, `GridProps`

## Usage
`columns` takes a number (1 to 12) or an object per breakpoint (`base`, `sm`, `md`, `lg`, `xl`), mobile first: `{ base: 1, md: 2, lg: 4 }`. Use `GridItem` when a cell must span more than one column or row.

```tsx
import { Grid, GridItem } from "vaiperui";

<Grid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
  <GridItem colSpan={2}>Wide</GridItem>
  <GridItem>Item</GridItem>
</Grid>
```

## Props
- `columns` (1 – 12 | { base, sm, md, lg, xl }, default 1): Number of columns, or one value per breakpoint
- `gap` (0 | 1 | 2 | 3 | 4 | 6 | 8, default 4): Space between children (4px steps)
- `as` (ElementType, default "div"): Element or component to render (`section`, `ul`, `main`...)
- `GridItem colSpan / rowSpan` (1 – 12 / 1 – 6): Columns and rows the item spans

## Accessibility
- `Grid` and `GridItem` render plain `<div>`s by default, with no role; `as` changes the element (for example `ul`/`li`).
- They are purely visual: no focus, keyboard or ARIA behavior is added, and extra props reach the element.
- Screen readers and Tab follow DOM order, not the visual position.

Keep in mind:
- `colSpan`/`rowSpan` and responsive `columns` change the layout only; keep the source order meaningful at every breakpoint.
- It adds no list semantics: use `as="ul"` and `as="li"` on `GridItem` when the items are a list.

## Examples

### Columns
```tsx
<Grid columns={2} />
<Grid columns={3} />
<Grid columns={{ base: 1, md: 3 }} />
```

### Gap
```tsx
<Grid columns={3} gap={0} />
<Grid columns={3} gap={8} />
```

### Spans
```tsx
<GridItem colSpan={2} />
<GridItem rowSpan={2} />
```
