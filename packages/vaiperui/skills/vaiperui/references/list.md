# List
Semantic list of items with title, description, leading and trailing elements.

Import: `import { List, ListItem, Avatar, Badge } from "vaiperui"`
Types (same import): `ListItemProps`, `ListProps`

## Usage
`List` renders a `<ul>` (`divided` draws lines between items); `ListItem` takes `title`, `description`, `leading` (e.g. an Avatar), `trailing` (e.g. a Badge or button) and extra `children`. The list is not interactive: put a link or button inside `title` or `trailing`.

```tsx
import { List, ListItem, Avatar, Badge } from "vaiperui";

<List divided>
  <ListItem
    leading={<Avatar name="Camila Souza" />}
    title="Camila Souza"
    description="Product designer"
    trailing={<Badge status="success">Active</Badge>}
  />
</List>
```

## Props
- `divided` (boolean, default false): Line between items (List)
- `title` (ReactNode, default required): Item heading (ListItem)
- `description` (ReactNode): Supporting text under the title
- `leading` (ReactNode): Element before the text
- `trailing` (ReactNode): Element at the end of the row
- `(native)` (ul / li): Every native prop of the element, className, ref, etc.

## Accessibility
- `List` renders a native `<ul>` and `ListItem` a native `<li>`, so list semantics and item counts reach assistive technology.
- `title` and `description` are plain `<div>`s, not headings or a description list.
- `leading` and `trailing` are rendered as given; the library adds no ARIA to them.
- Items are not focusable and handle no keys; only the links or buttons you place inside are interactive.

Keep in mind:
- The list uses `list-none`; some browsers (notably Safari with VoiceOver) then stop announcing it as a list. Add `role="list"` if that matters to you.
- `title` is truncated visually with an ellipsis; the full text stays in the DOM and is read in full.

## Examples

### Divided
```tsx
<List divided>
  <ListItem title="Camila Souza" description="Designer" />
  <ListItem title="Yuki Tanaka" description="Engineer" />
</List>
```
