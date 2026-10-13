# vaiperui

React component library for [Tailwind CSS](https://tailwindcss.com): accessible **Button**,
**Input** and **Select**, with built-in input masks, a ripple effect and a single `customColor`
prop to theme any component.

- **Typed**: written in TypeScript, every prop and option is typed.
- **Accessible**: keyboard navigation, focus rings, correct roles and labels.
- **Input masks**: phone, credit card, date, CPF, CNPJ and more, with no extra library.
- **One color to theme everything**: `customColor="#ff6600"` paints borders, focus and highlights.
- **Dark mode** by adding a `dark` class, and every animation respects `prefers-reduced-motion`.

📚 **Documentation and live examples:** <https://vaiperui.vercel.app>

## Installation

```bash
npm install vaiperui
```

`react` and `react-dom` (v19 or newer) are peer dependencies, and your project needs
[Tailwind CSS v4](https://tailwindcss.com/docs/installation).

### Set up the styles

Import the theme once, next to Tailwind, in your root CSS file, and let Tailwind scan the
library so its classes are generated:

```css
@import "tailwindcss";
@import "vaiperui/theme.css";

@source "../node_modules/vaiperui/dist";
```

> Adjust the `@source` path so it points to `node_modules/vaiperui/dist` relative to this CSS file.

## Usage

Everything is exported from the package root:

```tsx
import { Button, Input, Select } from "vaiperui";

export function Example() {
  return (
    <form className="flex flex-col gap-4">
      <Input label="Phone" mask="phone" />
      <Select
        label="Country"
        placeholder="Choose a country"
        options={[
          { value: "br", label: "Brazil" },
          { value: "us", label: "United States" },
        ]}
      />
      <Button type="submit" variantColor="primary" ripple>
        Save
      </Button>
    </form>
  );
}
```

The components work in the Next.js App Router, since the package entry is already marked with
`"use client"`.

## Button

A `<button>` with every native prop plus styling options.

```tsx
<Button variant="outlined" variantColor="danger" hover="lift" iconStart={<TrashIcon />}>
  Delete
</Button>
```

| Prop                 | Values                                                                                                   | Default   |
| -------------------- | -------------------------------------------------------------------------------------------------------- | --------- |
| `variant`            | `solid` · `solid-inverse` · `outlined` · `outlined2` · `transparent`                                     | `solid`   |
| `variantColor`       | `primary` · `success` · `warning` · `danger`                                                             | `primary` |
| `size`               | `sm` · `md` · `lg`                                                                                       | `md`      |
| `radius`             | `none` · `sm` · `md` · `lg` · `full`                                                                     | `md`      |
| `hover`              | `none` · `lift` · `scale` · `glow`                                                                       | `none`    |
| `animation`          | `none` · `float` · `pulse` · `shine` · `wiggle` · `wobble` · `nudge` · `jelly` · `heartbeat` · `jump` · `gradient` · `glow` | `none` |
| `customColor`        | any CSS color, or `{ light, dark }`                                                                      | —         |
| `ripple`             | `boolean`: a wave that expands from the click point                                                      | `false`   |
| `iconStart` / `iconEnd` | `ReactNode`                                                                                           | —         |

## Input

An `<input>` with every native prop, a label, helper and error text, and **masks**.

```tsx
<Input label="Card number" mask="creditCard" />
<Input label="Email" helperText="We never share it" />
<Input label="Email" errorMessage="Enter a valid email" />
```

| Prop                          | Values                                         | Default   |
| ----------------------------- | ---------------------------------------------- | --------- |
| `variant`                     | `ring` (focus ring) · `outline` (focus outline) | `ring`    |
| `variantColor`                | `primary` · `success` · `warning` · `danger`   | `primary` |
| `customColor`                 | any CSS color, or `{ light, dark }`            | —         |
| `size`                        | `sm` · `md` · `lg`                             | `md`      |
| `radius`                      | `none` · `sm` · `md` · `lg` · `full`           | `md`      |
| `animation`                   | `none` · `smooth` · `fast` · `bounce`          | `smooth`  |
| `label`                       | `string`                                       | —         |
| `helperText`                  | `string`                                       | —         |
| `errorMessage`                | `string`: its presence alone forces the error state | —    |
| `leadingIcon` / `trailingIcon` | `ReactNode`                                   | —         |
| `mask`                        | see below                                      | —         |

### Masks

Pass `mask` and the value is formatted as the user types. `onChange` receives the event with the
already-masked value, and it works controlled or uncontrolled.

| Mask         | Result                                                              |
| ------------ | ------------------------------------------------------------------- |
| `phone`      | `+55 (11) 98765-4321` · `+1 (415) 555-2671` · `+442 079 460 958`    |
| `creditCard` | `4111 1111 1111 1111`                                               |
| `cardExpiry` | `12/28`                                                             |
| `date`       | `31/12/2025`                                                        |
| `time`       | `23:59`                                                             |
| `cpf`        | `123.456.789-01` (Brazil)                                           |
| `cnpj`       | `12.345.678/0001-99` (Brazil)                                       |
| `cei`        | `12.345.67890/12` (Brazil)                                          |
| `cep`        | `12345-678` (Brazil)                                                |

`phone` formats Brazilian (`+55`) and North American (`+1`) numbers and groups any other country
code in blocks of three digits.

## Select

An accessible combobox with keyboard navigation, type-to-search and a menu that is rendered in a
portal, so it is never clipped by an `overflow: hidden` parent.

```tsx
<Select
  label="Country"
  searchable
  options={[
    { value: "br", label: "Brazil", leading: <span>🇧🇷</span> },
    { value: "us", label: "United States", leading: <span>🇺🇸</span> },
    { value: "pt", label: "Portugal", disabled: true },
  ]}
  onValueChange={(value) => console.log(value)}
/>
```

| Prop                                      | Description                                                             |
| ----------------------------------------- | ----------------------------------------------------------------------- |
| `options`                                 | `{ value, label, disabled?, description?, leading? }[]`                 |
| `value` / `defaultValue`                  | Controlled / uncontrolled selection                                     |
| `onValueChange`                           | Called with the selected value                                          |
| `placeholder`                             | Text shown when nothing is selected                                     |
| `searchable`                              | Adds a search field that filters the options                            |
| `searchStyle`                             | `boxed` (default) · `full`: how the search field sits in the menu       |
| `variant`                                 | `default` · `detailed` (larger rows with a `description` line)          |
| `variantColor` / `customColor`            | Same as the other components                                            |
| `size` / `radius` / `animation`           | `sm`·`md`·`lg` / `none`…`full` / `none`·`smooth`·`fast`·`bounce`        |
| `disabled`                                | Disables the whole select                                               |
| `name`                                    | Mirrors the value in a hidden input, so it is submitted with a `<form>` |
| `label` / `aria-label`                    | Visible label, or an accessible name when there is no label             |

### Translating the built-in texts

The few texts the Select shows itself can be replaced:

```tsx
<Select
  searchable
  placeholder="Escolha um país"
  searchPlaceholder="Buscar..."
  emptyMessage="Nenhuma opção encontrada"
  noResultsMessage={(query) => `Nenhum resultado para "${query}"`}
  clearSearchLabel="Limpar busca"
  options={options}
/>
```

## Custom colors

`customColor` replaces `variantColor` with any CSS color. Hover, border, focus ring and highlight
are derived from it. Pass a `{ light, dark }` object to use a different color in each theme:

```tsx
<Button customColor="#ff6600">Orange</Button>
<Input customColor="var(--brand)" label="Name" />
<Select customColor={{ light: "#a855f7", dark: "#f472b6" }} options={options} />
```

## Dark mode

Dark mode is opt-in: add the `dark` class to any ancestor (usually `<html>`). Without it the
components look exactly like light mode.

```html
<html class="dark"></html>
```

Colors come from CSS variables, so you can use your own palette by overriding them:

```css
.dark {
  --vpd-surface: #0b0f19;
  --vpd-surface-muted: #131a2a;
  --vpd-text: #e2e8f0;
  --vpd-border: #1f2937;
}
```

The available variables are `--vpd-surface`, `--vpd-surface-muted`, `--vpd-surface-hover`,
`--vpd-text`, `--vpd-text-secondary`, `--vpd-text-muted`, `--vpd-text-placeholder`,
`--vpd-text-disabled`, `--vpd-border`, `--vpd-border-strong`, `--vpd-border-soft` and
`--vpd-border-subtle`.

## Overriding styles

Every component accepts `className`, and the library exports the `cn` helper (`clsx` +
`tailwind-merge`), so your classes win over the defaults:

```tsx
import { Button, cn } from "vaiperui";

<Button className={cn("w-full", isLoading && "opacity-70")}>Continue</Button>;
```

## TypeScript

Prop types are exported: `ButtonProps`, `InputProps`, `InputMask`, `SelectProps`,
`SelectOption`, `CustomColor` and the unions behind each prop (`ButtonVariant`, `InputSize`…).

## Contributing and license

Contributions are welcome, see
[CONTRIBUTING.md](https://github.com/vaiperliotech/vaiperui/blob/main/CONTRIBUTING.md).
Released under the [MIT License](LICENSE).
