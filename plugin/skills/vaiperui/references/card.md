# Card
Elevated surface that groups related content, with optional header, body and footer.

Import: `import { Card, CardHeader, CardBody, CardFooter } from "vaiperui"`
Types (same import): `CardBodyProps`, `CardFooterProps`, `CardHeaderProps`, `CardPadding`, `CardProps`, `CardRadius`

## Usage
`Card` has no ARIA role: give it a heading that fits the page. `CardHeader`, `CardBody` and `CardFooter` are optional helpers. `padding` is `none` (edge-to-edge media), `md` or `lg`.

```tsx
import { Card, CardHeader, CardBody, CardFooter } from "vaiperui";

<Card>
  <CardHeader>Pro plan</CardHeader>
  <CardBody>Up to 10 users.</CardBody>
  <CardFooter>Billed monthly</CardFooter>
</Card>
```

## Props
- `padding` (none | md | lg, default md): Inner spacing: 0, 16px or 24px
- `radius` (none | sm | md | lg | full, default lg): Corner rounding
- `(native)` (div (Card, CardHeader, CardBody, CardFooter)): Every native prop of the element, className, ref, etc.

## Accessibility
- `Card` is a plain `<div>` with no role and is not a landmark.
- `CardHeader`, `CardBody` and `CardFooter` are also `<div>`s; `CardHeader` is not a heading element.
- The card is not focusable and handles no keys; the content you put inside defines the semantics.
- Any native `<div>` prop, such as `role`, `aria-labelledby` or `tabIndex`, is passed through.

Keep in mind:
- Put a real heading (`<h2>`, `<h3>`) inside `CardHeader` at the level that fits your page outline.
- For a clickable card, use a real link or button inside it; a click handler on the `<div>` is not keyboard accessible.

## Examples

### Padding
```tsx
<Card padding="none">none</Card>
<Card padding="md">md</Card>
<Card padding="lg">lg</Card>
```

### Radius
```tsx
<Card radius="none">none</Card>
<Card radius="sm">sm</Card>
<Card radius="md">md</Card>
<Card radius="lg">lg</Card>
<Card radius="full">full</Card>
```
