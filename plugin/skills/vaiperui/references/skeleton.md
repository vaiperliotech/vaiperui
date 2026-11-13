# Skeleton
Loading placeholder shaped like the content: text lines, title, avatar, rectangle or card.

Import: `import { Skeleton } from "vaiperui"`
Types (same import): `SkeletonAnimation`, `SkeletonProps`, `SkeletonRadius`, `SkeletonVariant`

## Usage
Decorative (`aria-hidden`), so set `aria-busy` on the container while loading. The pulse stops under `prefers-reduced-motion`. Resize with `width`/`height` or `className`; `lines` draws several text lines, the last one shorter.

```tsx
import { Skeleton } from "vaiperui";

<div aria-busy={loading}>
  <Skeleton variant="avatar" />
  <Skeleton variant="title" width="60%" />
  <Skeleton lines={3} />
</div>
```

## Props
- `variant` (text | title | avatar | rectangle | card, default text): Shape and default size
- `lines` (number, default 1): text only: number of lines; the last of several is shorter
- `width / height` (number | string, default per variant): CSS size (a number is px)
- `radius` (none | sm | md | lg | full, default per variant): Overrides the corner rounding
- `animation` (pulse | none, default pulse): Pulse is off with prefers-reduced-motion
- `(native)` (HTMLAttributes<HTMLDivElement>): role (overrides the default), className, style, aria-*, ref, etc.

## Accessibility
- Every element is `aria-hidden="true"`, so screen readers skip the placeholder entirely.
- It has no role and no text; it conveys nothing by itself.
- The pulse animation uses `motion-reduce:animate-none`, so it stops under `prefers-reduced-motion`.
- Pass `animation="none"` to render a static placeholder.

Keep in mind:
- Skeleton sets no `aria-busy` and announces nothing: put `aria-busy` on the loading container yourself.
- If users must know loading started or ended, announce it in your own live region (for example a visually hidden `role="status"` text).

## Examples

### Variants
```tsx
<Skeleton variant="text" />
<Skeleton variant="title" />
<Skeleton variant="avatar" />
<Skeleton variant="rectangle" />
<Skeleton variant="card" />
```

### Lines and static
```tsx
<Skeleton lines={3} />
<Skeleton animation="none" variant="card" />
```
