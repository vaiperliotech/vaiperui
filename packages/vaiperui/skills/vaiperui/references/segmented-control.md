# SegmentedControl
A single choice among a few options, to switch between views of the same content.

Import: `import { SegmentedControl, SegmentedItem } from "vaiperui"`
Types (same import): `SegmentedControlAnimation`, `SegmentedControlColors`, `SegmentedControlProps`, `SegmentedControlRadius`, `SegmentedControlSize`, `SegmentedItemProps`

## Usage
Place `SegmentedItem`s inside a `SegmentedControl`. It is a `radiogroup`: one item is always selected, arrows move and select (skipping disabled items), and `aria-label` is required. Works controlled (`value`) or uncontrolled (`defaultValue`). For navigating between sections use `Tabs`.

```tsx
import { SegmentedControl, SegmentedItem } from "vaiperui";

<SegmentedControl aria-label="View" defaultValue="list">
  <SegmentedItem value="list">List</SegmentedItem>
  <SegmentedItem value="grid">Grid</SegmentedItem>
  <SegmentedItem value="map">Map</SegmentedItem>
</SegmentedControl>
```

## Props
- `aria-label` (string, default required): Names what the control selects
- `value` (string): Selected item (controlled)
- `defaultValue` (string): Initial item (uncontrolled)
- `onValueChange` ((value: string) => void): Called when the selection changes
- `disabled` (boolean, default false): Disables the whole control
- `variantColor / customColor` (ControlColors | CustomColor, default neutral): Color of the selected item's text; neutral when neither is set
- `size` (sm | md | lg, default md): Size of the control and its text
- `radius` (none | sm | md | lg | full, default md): Corner rounding
- `animation` (none | smooth | fast | bounce, default smooth): Transition between states
- `SegmentedItem: value, disabled` (string, boolean): The item's value; disables only this item

## Accessibility
- The container has `role="radiogroup"`, and `aria-disabled` when the whole control is `disabled`.
- Each `SegmentedItem` is a button with `role="radio"` and `aria-checked`.
- Roving tabindex: only the selected item is in the Tab order (`tabIndex=0`).
- Arrow keys move focus and select at once, wrap around, and skip disabled items.

Keyboard:
- `Tab`: Moves focus into and out of the group (to the selected item).
- `Right / Down`: Selects the next enabled item.
- `Left / Up`: Selects the previous enabled item.
- `Enter / Space`: Selects the focused item (native button click).

Keep in mind:
- Pass an `aria-label` or `aria-labelledby` on `SegmentedControl`; the component does not add a name to the group.
- Pass `value` or `defaultValue`; with no selected item every item has `tabIndex=-1` and the group is unreachable by keyboard.
- Home and End are not handled.

## Examples

### Colors
```tsx
<SegmentedControl aria-label="…" defaultValue="list" variantColor="primary">
  <SegmentedItem value="list">List</SegmentedItem>
  <SegmentedItem value="grid">Grid</SegmentedItem>
</SegmentedControl>

<SegmentedControl aria-label="…" defaultValue="list" variantColor="success">
  <SegmentedItem value="list">List</SegmentedItem>
  <SegmentedItem value="grid">Grid</SegmentedItem>
</SegmentedControl>

<SegmentedControl aria-label="…" defaultValue="list" variantColor="warning">
  <SegmentedItem value="list">List</SegmentedItem>
  <SegmentedItem value="grid">Grid</SegmentedItem>
</SegmentedControl>

<SegmentedControl aria-label="…" defaultValue="list" variantColor="danger">
  <SegmentedItem value="list">List</SegmentedItem>
  <SegmentedItem value="grid">Grid</SegmentedItem>
</SegmentedControl>
```

### Sizes
```tsx
<SegmentedControl aria-label="…" defaultValue="list" size="sm">
  <SegmentedItem value="list">List</SegmentedItem>
  <SegmentedItem value="grid">Grid</SegmentedItem>
</SegmentedControl>

<SegmentedControl aria-label="…" defaultValue="list" size="md">
  <SegmentedItem value="list">List</SegmentedItem>
  <SegmentedItem value="grid">Grid</SegmentedItem>
</SegmentedControl>

<SegmentedControl aria-label="…" defaultValue="list" size="lg">
  <SegmentedItem value="list">List</SegmentedItem>
  <SegmentedItem value="grid">Grid</SegmentedItem>
</SegmentedControl>
```

### Radius
```tsx
<SegmentedControl aria-label="…" defaultValue="list" radius="none">
  <SegmentedItem value="list">List</SegmentedItem>
  <SegmentedItem value="grid">Grid</SegmentedItem>
</SegmentedControl>

<SegmentedControl aria-label="…" defaultValue="list" radius="sm">
  <SegmentedItem value="list">List</SegmentedItem>
  <SegmentedItem value="grid">Grid</SegmentedItem>
</SegmentedControl>

<SegmentedControl aria-label="…" defaultValue="list" radius="md">
  <SegmentedItem value="list">List</SegmentedItem>
  <SegmentedItem value="grid">Grid</SegmentedItem>
</SegmentedControl>

<SegmentedControl aria-label="…" defaultValue="list" radius="lg">
  <SegmentedItem value="list">List</SegmentedItem>
  <SegmentedItem value="grid">Grid</SegmentedItem>
</SegmentedControl>

<SegmentedControl aria-label="…" defaultValue="list" radius="full">
  <SegmentedItem value="list">List</SegmentedItem>
  <SegmentedItem value="grid">Grid</SegmentedItem>
</SegmentedControl>
```

### Custom color
```tsx
<SegmentedControl aria-label="…" defaultValue="list" customColor="#f97316">
  <SegmentedItem value="list">List</SegmentedItem>
  <SegmentedItem value="grid">Grid</SegmentedItem>
</SegmentedControl>

<SegmentedControl aria-label="…" defaultValue="list" customColor="#8b5cf6">
  <SegmentedItem value="list">List</SegmentedItem>
  <SegmentedItem value="grid">Grid</SegmentedItem>
</SegmentedControl>
```

### States
```tsx
<SegmentedControl aria-label="…" disabled>…</SegmentedControl>
```
