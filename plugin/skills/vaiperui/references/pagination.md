# Pagination
Moves between pages of results; the parent owns the page and fetches the data.

Import: `import { Pagination } from "vaiperui"`
Types (same import): `PaginationAnimation`, `PaginationColors`, `PaginationProps`, `PaginationRadius`, `PaginationSize`

## Usage
A controlled component: pass `page` (starting at 1), `pageCount` and `onPageChange`. With many pages it shows the first, last, current and `siblingCount` neighbors with ellipses, keeping the bar the same width. Every built-in text is overridable (`previousLabel`, `nextLabel`, `pageLabel`, `aria-label`). If each page has its own URL, prefer real links.

```tsx
import { Pagination } from "vaiperui";

const [page, setPage] = useState(1);

<Pagination
  page={page}
  pageCount={20}
  onPageChange={setPage}
  previousLabel="Previous page"
  nextLabel="Next page"
  pageLabel={(n) => `Page ${n}`}
/>
```

## Props
- `page` (number, default required): Current page, starting at 1
- `pageCount` (number, default required): Total number of pages
- `onPageChange` ((page: number) => void, default required): Called with the chosen page
- `siblingCount` (number, default 1): Pages shown on each side of the current one
- `previousLabel` (string, default Previous page): Accessible name of the previous button
- `nextLabel` (string, default Next page): Accessible name of the next button
- `pageLabel` ((page: number) => string, default Page n): Accessible name of a page button
- `aria-label` (string, default Pagination): Name of the navigation
- `disabled` (boolean, default false): Disables every button
- `variantColor` (primary | success | warning | danger, default primary): Accent color of the active state and focus ring
- `customColor` (string | { light, dark }): Any CSS color (or a pair per theme). Overrides variantColor
- `size` (sm | md | lg, default md): Size of the control and its text
- `radius` (none | sm | md | lg | full, default md): Corner rounding
- `animation` (none | smooth | fast | bounce, default smooth): Transition between states

## Accessibility
- Renders a `<nav>` with `aria-label` (default "Pagination") containing a list (`<ul>`/`<li>`) of native buttons.
- The current page button has `aria-current="page"` and does nothing when clicked.
- Each button has an `aria-label` from `previousLabel`, `nextLabel` and `pageLabel(n)`; the chevron icons are `aria-hidden`.
- Previous is disabled on the first page and next on the last; `disabled` disables every button.
- The "…" ellipses are `aria-hidden` and not focusable.

Keyboard:
- `Tab / Shift+Tab`: Moves through the enabled buttons in order.
- `Enter / Space`: Activates the focused button (native behavior).

Keep in mind:
- Translate `previousLabel`, `nextLabel`, `pageLabel` and `aria-label`; their defaults are in English.
- Changing page does not move focus or announce anything; handle that in `onPageChange` if needed.

## Examples

### Colors
```tsx
<Pagination page={page} pageCount={20} onPageChange={setPage} variantColor="primary" />

<Pagination page={page} pageCount={20} onPageChange={setPage} variantColor="success" />

<Pagination page={page} pageCount={20} onPageChange={setPage} variantColor="warning" />

<Pagination page={page} pageCount={20} onPageChange={setPage} variantColor="danger" />
```

### Sizes
```tsx
<Pagination page={page} pageCount={20} onPageChange={setPage} size="sm" />

<Pagination page={page} pageCount={20} onPageChange={setPage} size="md" />

<Pagination page={page} pageCount={20} onPageChange={setPage} size="lg" />
```

### Radius
```tsx
<Pagination page={page} pageCount={20} onPageChange={setPage} radius="none" />

<Pagination page={page} pageCount={20} onPageChange={setPage} radius="sm" />

<Pagination page={page} pageCount={20} onPageChange={setPage} radius="md" />

<Pagination page={page} pageCount={20} onPageChange={setPage} radius="lg" />

<Pagination page={page} pageCount={20} onPageChange={setPage} radius="full" />
```

### Custom color
```tsx
<Pagination page={page} pageCount={20} onPageChange={setPage} customColor="#f97316" />

<Pagination page={page} pageCount={20} onPageChange={setPage} customColor="#8b5cf6" />
```

### Siblings
```tsx
<Pagination page={page} pageCount={30} siblingCount={2} onPageChange={setPage} />
```
