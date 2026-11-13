---
name: vaiperui
description: Use when writing or editing React UI with the vaiperui component library (imports from "vaiperui", Tailwind CSS v4). Covers setup, the shared props (variantColor, customColor, size, radius, animation), how values work in each component, a need-to-component picker, and per-component references with every prop, examples and accessibility notes for forms and masked inputs, selects, date and time pickers, upload, data display, alerts and toasts, tabs and pagination, modals, drawers, menus and tooltips, layout and media.
---

# vaiperui

React components for Tailwind CSS v4: accessible, typed, dark mode, one color prop. Everything is imported from the package root: `import { Button } from "vaiperui"`.

**Do not guess props.** Each component has its own value shape and a few non-obvious rules. Read `references/<slug>.md` for the component you use (full props, examples, accessibility). If the `vaiperui` MCP server is connected, call `get_component` instead, and `search_docs` when you know the need but not the component.

## 1. Set up (once per project)

```bash
npm install vaiperui
```

Needs `react` and `react-dom` >= 19 and Tailwind CSS v4 already configured. In the root stylesheet:

```css
@import "tailwindcss";
@import "vaiperui/theme.css";

@source "../node_modules/vaiperui/dist";
```

`theme.css` has the design tokens and the `dark` variant; `@source` lets Tailwind find the components' classes. Without both, components render unstyled. Dark mode is opt-in: put `className="dark"` on `<html>`. Theming details: `references/theming.md`.

## 2. Shared vocabulary

Most components take these, with the same meaning:

| Prop | Values | Notes |
| --- | --- | --- |
| `variantColor` | `primary` (default) `success` `warning` `danger` | Accent: focus, selection, checked state, progress |
| `customColor` | any CSS color, or `{ light, dark }` | Overrides `variantColor`; `{ light, dark }` is per theme |
| `size` | `sm` `md` (default) `lg` | |
| `radius` | `none` `sm` `md` `lg` `full` | Default depends on the component |
| `animation` | `none` `smooth` `fast` `bounce` | Transition. `Skeleton` uses `pulse` / `none` |

Check the reference before using one: not every component has all five (`Toast` and `Skeleton` differ; layout components have none).

- `className` is merged with `tailwind-merge`, so yours wins over the component's classes.
- **`Badge` is colored by `status`** (`success` `error` `warning` `info` `neutral` `pending`), not `variantColor`. `Tag`, `Alert`, `Banner`, `Toast`, `Tooltip` and the rest use `variantColor`.
- Components that wrap a native element forward the native props: `Input`, `Textarea`, `Checkbox`, `Switch`, `Radio`, `Upload`, `Button`... take `name`, `disabled`, `required`, `aria-*`, etc. `ref` is forwarded by those and by the layout and data-display components, not by `Select`, `Slider`, the pickers or the overlays. `Select`, `Slider`, `Calendar`, the date/time pickers, `Modal`, `Drawer`, `Popover`, `Tooltip`, `Toast`, `Gallery`, `Lightbox`, `Carousel` and the players take **only their documented props**: no arbitrary `data-*` or `id` unless the reference lists it. The layout and data-display components (`Container`, `Grid`, `Stack`, `Divider`, `Card`, `List`, `Table`, `Avatar`, `Badge`, `Tag`, `Alert`, `Banner`, `Skeleton`) do pass native attributes to their root element.
- Types are exported from the root too (`SelectOption`, `DateRange`, `BadgeStatus`, `ToastOptions`, `ButtonProps`...): each reference lists them under "Types".
- Fields with a visible label take `label`, `helperText` and `errorMessage`. **`errorMessage` alone turns on the error state** (red, `aria-invalid`) and replaces the helper text: no separate `error` flag. `Select` has `label` but no `helperText`/`errorMessage`.
- The library has **no built-in i18n**. Every built-in text is an English default you override with a prop (`labels`, `dismissLabel`, `previousMonthLabel`, `confirmLabel`, `placeholder`...), and dates use `locale` (BCP 47, default `en-US`).

## 3. How each value works (the part that breaks code)

Every stateful component works controlled (`value` + handler) or uncontrolled (`defaultValue`). Pick one; do not switch.

| Component | Value | Handler |
| --- | --- | --- |
| `Input`, `Textarea` | native `value` string | `onChange(event)` read `event.target.value` |
| `Checkbox`, `Switch`, single `Radio` | native `checked` | `onChange(event)` read `event.target.checked` |
| `Select`, `RadioGroup`, `Tabs`, `SegmentedControl` | `value` string | `onValueChange(value)`: the value, **not an event** |
| `Slider` | `number[]`: `[40]` or `[20, 80]` (always an array; read it as `const [min = 0, max = 100] = value` under `noUncheckedIndexedAccess`) | `onValueChange(number[])`, `onValueCommit` on release |
| `DatePicker`, `Calendar` | `Date` (a day: the hour is ignored) | `onValueChange(date)` |
| `DateRangePicker`, `Calendar mode="range"` | `{ from?: Date; to?: Date }` (type `DateRange`, exported) | `onValueChange(range)`, called twice per range |
| `TimePicker` | `"HH:mm"` string, 24h even with `hour12` | `onValueChange("14:30")` |
| `DateTimePicker` | `Date` with day and time | `onValueChange(date)` |
| `Accordion` | string (`type="single"`) or `string[]` (`"multiple"`) | `onValueChange` |
| `Pagination` | `page` (starts at 1) + `pageCount` | `onPageChange(page)` |
| `Stepper` | `current` (index from 0) | `onStepClick(index)` |
| `Modal`, `Drawer`, `Popover`, `Menu`, `Tooltip` | `open` boolean | `onOpenChange(open)`; or pass `trigger` and leave it uncontrolled |
| `Lightbox`, `Carousel` | `index`; Lightbox also `open` | `onIndexChange`, `onOpenChange` |
| `Upload` | none: it only captures | `onFilesChange(files: File[])` with the files just chosen, not the total; files that fail `accept` are dropped silently, so validate and show `errorMessage` yourself |

## 4. Pick the component

| Need | Use |
| --- | --- |
| Action, submit | `Button` (variants `solid` `solid-inverse` `outlined` `outlined2` `transparent`; `hover`, `ripple`, `iconStart`/`iconEnd`) |
| Text, number, masked value (CPF, CNPJ, CEI, CEP, phone, card, expiry, date, time, custom regex + format) | `Input` with `mask` (formats in `references/input.md`) |
| Multi-line text | `Textarea` |
| One choice from a list; searchable, async, infinite scroll | `Select` |
| One choice, all options visible | `RadioGroup` (or `SegmentedControl` for 2 to 5 compact options) |
| Yes/no that is submitted | `Checkbox`; applies immediately: `Switch` |
| A number or an interval | `Slider` |
| A day / a period / a time / both | `DatePicker` / `DateRangePicker` (with `presets`) / `TimePicker` / `DateTimePicker`; always-visible month: `Calendar` |
| Attach files | `Upload` |
| Person, status, label, group of fields | `Avatar`, `Badge`, `Tag` (removable), `Card`, `List` |
| Tabular data | `Table` (no sorting or pagination built in; add `Pagination`) |
| Expand / collapse sections | `Accordion` |
| Message in the page | `Alert` (inline), `Banner` (full width) |
| Transient message | `Toaster` once at the root, then `toast()` |
| Loading placeholder | `Skeleton` |
| Switch views | `Tabs`; steps of a flow: `Stepper`; location: `Breadcrumb`; pages: `Pagination` |
| Blocking dialog / side panel | `Modal` / `Drawer` |
| Anchored panel / actions menu / hint | `Popover` / `Menu` / `Tooltip` |
| Page structure | `Container`, `Grid` + `GridItem`, `Stack`, `Divider` |
| Audio, video, images | `AudioPlayer` (`variant="waveform"` for a voice-message card), `VideoPlayer` (`variant="overlay"` for a big central play button), `Gallery` (opens `Lightbox` itself), `Carousel` |
| Not in the library: compose them | icons (use any icon set or characters), charts, data grid, empty state, spinner (use `Skeleton`), a form/field wrapper (fields carry their own `label` and `errorMessage`) |

All 44 with one-liners: `references/components.md`.

## 5. Rules that avoid bugs

1. **Never hand-roll what exists** (dropdowns, modals, tooltips, date inputs, toasts): the library handles focus, keyboard and ARIA.
2. **Required accessible names**: `Slider` needs `aria-label`; `SegmentedControl` needs `aria-label`; `Avatar` needs `name`; `Carousel` needs `aria-label`; `Gallery`/`Lightbox` items need `alt`; a field without a visible `label` needs `aria-label` (pickers, `Select`, `Upload`); dialogs need a `title` (or `aria-label`); videos with speech need a `<track kind="captions">` child.
3. **`Tabs` and `SegmentedControl` need `value` or `defaultValue`**, otherwise no item is reachable by keyboard.
4. **Toasts**: render `<Toaster />` once near the root (it portals itself); then call `toast({...})` from anywhere (it is not a hook, not a provider).
5. **Triggers**: the `trigger` of `Modal`, `Popover`, `Menu` and the child of `Tooltip` must be ONE element that forwards `ref` and passes `onClick`/focus props through. `Button` does; wrap your own component with `forwardRef`. An icon-only trigger needs `aria-label`. `ModalClose`, `DrawerClose` and `PopoverClose` also wrap exactly one element and chain its `onClick`.
6. **Compound components are separate named exports**: `Card`, `CardHeader`, `CardBody`, `CardFooter`; `Table*`; `Tab`, `TabList`, `TabPanel`; `Menu`, `MenuItem`, `MenuLabel`, `MenuSeparator`; `Grid`, `GridItem`; `ModalClose`, `DrawerClose`, `PopoverClose`. There is no dot notation.
7. **Server Components (Next.js)**: the package is a client boundary, so you can render the components from a Server Component, but you cannot pass them functions or call exports like `toast()` there. Put interactive pieces in a `"use client"` file.
8. **Dates are days**: `Date` values ignore the hour (only `DateTimePicker` keeps it). Months, weekdays and the placeholder come from `locale`; set `weekStartsOn` for Monday.
9. **`Select` options** are `{ value, label, disabled?, description?, leading? }`. `description` shows only with `variant="detailed"`. For remote data pass `loading`, `hasMore`, `onReachEnd` (infinite scroll) and `onSearchChange` (server search, which turns the local filter off).
10. **Do not import from deep paths** (`vaiperui/dist/...`): only the package root, plus `vaiperui/theme.css`.
11. Colors beyond the four palettes: `customColor`, not arbitrary Tailwind classes on the internals.

## 6. Workflow

1. Identify the need and pick the component from section 4.
2. Open `references/<slug>.md`: copy the example, check every prop you use, read "Accessibility".
3. For a full screen, start from `references/patterns.md`: tested recipes (form with validation, async select, confirm modal, filter + table + pagination, uploads, settings, app shell with toasts and dark mode).
4. Check section 5 before finishing: labels, `value` shapes, `Toaster`, client boundaries.
