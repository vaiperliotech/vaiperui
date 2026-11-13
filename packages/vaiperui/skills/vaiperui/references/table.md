# Table
Styled native table parts for comparable data across columns.

Import: `import { Table, TableCaption, TableHeader, TableBody, TableRow, TableHead, TableCell } from "vaiperui"`
Types (same import): `TableCaptionProps`, `TableCellProps`, `TableHeadProps`, `TableProps`, `TableRowProps`, `TableSectionProps`

## Usage
Compose `Table`, `TableCaption`, `TableHeader`, `TableBody`, `TableRow`, `TableHead` and `TableCell`; each maps to its native element and takes its native props. Name the table with a `TableCaption` or `aria-label`. `TableHead` defaults to `scope="col"`. Sorting is up to you (`aria-sort` plus a button in the header).

```tsx
import { Table, TableCaption, TableHeader, TableBody, TableRow, TableHead, TableCell } from "vaiperui";

<Table striped>
  <TableCaption>Recent orders</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Order</TableHead>
      <TableHead className="text-right">Total</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>#1042</TableCell>
      <TableCell className="text-right">$120.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Props
- `striped` (boolean, default false): Zebra background on body rows (Table)
- `wrapperClassName` (string): Classes of the scroll wrapper (className goes on the table)
- `scope` (col | row | ..., default col): Scope of a TableHead
- `(native)` (table / caption / thead / tbody / tr / th / td): Every native prop of the element, className, ref, etc.

## Accessibility
- Each part maps to its native element (`<table>`, `<caption>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`), so table navigation in screen readers works.
- `TableHead` sets `scope="col"` by default; pass `scope="row"` for a row header cell.
- `TableCaption` is a real `<caption>` and names the table.
- `striped` and row hover are visual only and add no semantics.

Keep in mind:
- Always add a `TableCaption` or `aria-label`; without one the table has no accessible name.
- The table is wrapped in a `<div>` with `overflow-x: auto` that is not focusable, so keyboard-only users cannot scroll a wide table; wrap the table in your own focusable, labelled container if wide tables are expected.
- There is no built-in sorting, selection or keyboard navigation; add `aria-sort` and header buttons yourself.

## Examples

### Striped
```tsx
<Table striped>…</Table>
```
