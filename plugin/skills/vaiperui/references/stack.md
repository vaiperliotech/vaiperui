# Stack
Flex layout in one direction with gap, alignment and an optional divider.

Import: `import { Divider, Stack } from "vaiperui"`
Types (same import): `StackAlign`, `StackBreakpoint`, `StackDirection`, `StackGap`, `StackJustify`, `StackProps`

## Usage
Lines up children vertically (default) or horizontally. `direction` can change per breakpoint: `{ base: 'vertical', md: 'horizontal' }`. `divider` is rendered between every pair of children, never before the first or after the last.

```tsx
import { Divider, Stack } from "vaiperui";

<Stack direction={{ base: "vertical", md: "horizontal" }} gap={3} align="center"
  divider={<Divider orientation="vertical" />}>
  <span>One</span>
  <span>Two</span>
</Stack>
```

## Props
- `direction` (vertical | horizontal | { base, sm, md, lg, xl }, default vertical): Main axis, optionally per breakpoint
- `gap` (0 | 1 | 2 | 3 | 4 | 6 | 8, default 4): Space between children (4px steps)
- `align` (start | center | end | stretch | baseline): Cross axis alignment (`align-items`)
- `justify` (start | center | end | between | around | evenly): Main axis distribution (`justify-content`)
- `wrap` (boolean, default false): Let children flow onto a new line
- `divider` (ReactNode): Element rendered between children
- `as` (ElementType, default "div"): Element or component to render (`section`, `ul`, `main`...)

## Accessibility
- Renders a plain `<div>` (flex) by default, with no role; `as` changes the element (for example `ul`, `nav`, `section`).
- It adds no focus, keyboard or ARIA behavior; extra props reach the element.
- Responsive `direction` only changes how it looks; reading and Tab order stay the DOM order.
- The `divider` prop is inserted between children as given, so a `Divider` there is announced as a separator unless it is `decorative`.

Keep in mind:
- With `as="ul"`, a divider between items becomes a non-`li` child of the list, which is invalid HTML.

## Examples

### Direction
```tsx
<Stack direction="vertical" />
<Stack direction="horizontal" />
```

### Gap
```tsx
<Stack direction="horizontal" gap={1} />
<Stack direction="horizontal" gap={8} />
```

### Align and justify
```tsx
<Stack direction="horizontal" align="end" />
<Stack direction="horizontal" justify="between" />
```

### Divider
```tsx
<Stack divider={<Divider />}>...</Stack>
```
