# Theming vaiperui

## Colors

- `variantColor`: `primary` | `success` | `warning` | `danger`. They alias the Tailwind palettes blue, green, amber and red as `primary-*`, `success-*`, `warning-*`, `danger-*` (50 to 900), declared in `@theme` inside `vaiperui/theme.css`. Redefine them in your own `@theme` to rebrand every component at once.
- `customColor`: any CSS color (`"#ff6600"`, `"oklch(...)"`, `"var(--brand)"`) or `{ light: string; dark: string }`. It overrides `variantColor`. Hover, tint and ring shades are derived with `color-mix`.
- An `errorMessage` on a field forces the `danger` look and ignores `customColor`.

```tsx
<Button customColor="#7c3aed">Brand</Button>
<Checkbox customColor={{ light: "#7c3aed", dark: "#c4b5fd" }} label="Per theme" />
```

## Surfaces, text and borders

Components read CSS variables instead of fixed colors. Light values live on `:root`, dark values on `.dark`:

`--vpd-surface`, `--vpd-surface-muted`, `--vpd-surface-hover`, `--vpd-text`, `--vpd-text-secondary`, `--vpd-text-muted`, `--vpd-text-placeholder`, `--vpd-text-disabled`, `--vpd-border`, `--vpd-border-strong`, `--vpd-border-soft`, `--vpd-border-subtle`.

Override them in your CSS to change a whole palette:

```css
.dark {
  --vpd-surface: #0b0f19;
  --vpd-surface-muted: #131a2a;
  --vpd-text: #e2e8f0;
  --vpd-border: #1f2937;
}
```

## Dark mode

Opt-in. Add the `dark` class to an ancestor, usually `<html className="dark">`. The `dark` variant is already defined in `theme.css` (`@custom-variant dark (&:where(.dark, .dark *))`), so your own `dark:` utilities follow the same class. `customColor` with `{ light, dark }` also follows the class (`color-scheme` is set on `.dark`).

## Overriding a single component

Pass `className`: it is merged with `tailwind-merge`, so a conflicting utility of yours (`rounded-none`, `bg-...`) replaces the component's. Prefer the component's own props (`radius`, `size`, `variant`) when one exists.

## Portals

Menus, popovers, dialogs, toasts, tooltips and date pickers render in a portal on `document.body`. They are outside your component's DOM, so a CSS selector scoped to a parent will not reach them; the `dark` class on `<html>` (not on a wrapper) is what themes them.
