# Accordion
Stack of sections that expand and collapse, with keyboard navigation.

Import: `import { Accordion, AccordionItem } from "vaiperui"`
Types (same import): `AccordionAnimation`, `AccordionColors`, `AccordionItemProps`, `AccordionMultipleProps`, `AccordionProps`, `AccordionSingleProps`

## Usage
`type="single"` keeps one section open (add `collapsible` to allow closing it); `type="multiple"` lets several stay open. Use `defaultValue` or `value` + `onValueChange` (a string for single, `string[]` for multiple). Arrow Up/Down, Home and End move focus between headers.

```tsx
import { Accordion, AccordionItem } from "vaiperui";

<Accordion type="single" collapsible defaultValue="payment">
  <AccordionItem value="payment" title="Which payment methods?">
    We accept credit card, bank slip and Pix.
  </AccordionItem>
</Accordion>
```

## Props
- `type` (single | multiple, default required): One or several sections open
- `collapsible` (boolean, default false): Single only: allow closing the open section
- `value / defaultValue` (string | string[]): Open item value(s), controlled / initial
- `onValueChange` ((value) => void): Called with the new value(s); "" when single closes
- `variantColor` (primary | success | warning | danger, default primary): Focus ring color
- `customColor` (string | { light, dark }): Any CSS color (or a pair per theme) for the focus ring
- `animation` (none | smooth | fast | bounce, default smooth): Chevron transition
- `value (item)` (string, default required): AccordionItem identifier
- `title (item)` (ReactNode, default required): AccordionItem header
- `disabled (item)` (boolean, default false): Cannot be expanded or focused
- `(native)` (div): Every native prop of the element, className, ref, etc.

## Accessibility
- Each title is a `<button type="button">` inside an `<h3>`, so it is a heading and a control at once.
- The button sets `aria-expanded` and `aria-controls` pointing to its panel.
- The panel is a `<section>` with `aria-labelledby` pointing to the button, and it uses the `hidden` attribute while closed.
- A `disabled` item uses the native `disabled` attribute: it cannot be focused or activated, and arrow keys skip it.
- The chevron is `aria-hidden` and has a visible focus ring on the button.

Keyboard:
- `Tab / Shift+Tab`: Moves focus through the headers (and any focusable content in open panels).
- `Enter / Space`: Opens or closes the focused section.
- `Arrow Down / Arrow Up`: Moves focus to the next or previous header, wrapping around at the ends.
- `Home / End`: Moves focus to the first or last enabled header.

Keep in mind:
- The chevron transition has no `prefers-reduced-motion` check; use `animation="none"` for users who need it.
- An open panel is a labelled `<section>`, which many screen readers expose as a region landmark; many open items mean many landmarks.

## Examples

### Multiple
```tsx
<Accordion type="multiple" defaultValue={["payment", "shipping"]}>…</Accordion>
```

### Colors
```tsx
<Accordion type="single" variantColor="primary">…</Accordion>
<Accordion type="single" variantColor="success">…</Accordion>
<Accordion type="single" variantColor="warning">…</Accordion>
<Accordion type="single" variantColor="danger">…</Accordion>
```
