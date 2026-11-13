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

## Use it with an AI agent

The package ships an [Agent Skill](https://docs.claude.com/en/docs/claude-code/skills) at `node_modules/vaiperui/skills/vaiperui`: setup, the shared props, how each component's value works, a component picker and a reference file per component (props, examples, accessibility). Copy it to `.claude/skills/vaiperui` in your project, or install the Claude Code plugin: `/plugin marketplace add vaiperliotech/vaiperui` then `/plugin install vaiperui@vaiperui`.

For live lookups, add the MCP server (a route of the website, nothing runs on your machine): `claude mcp add --transport http vaiperui https://vaiperui.vercel.app/mcp`, or just the URL in any MCP client that takes one. See the [MCP README](../mcp/README.md).

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
| `custom`     | Your own rules, see below                                           |

#### Custom mask

With `mask="custom"`, `maskRegex` keeps only the characters that match it (each typed or pasted
character is tested on its own) and the optional `maskFormat` turns the kept characters into the
displayed text. Example: a hex color that fills the `#` by itself.

```tsx
<Input
  label="Color"
  mask="custom"
  maskRegex={/[0-9a-f]/i}
  maskFormat={(value) => (value ? `#${value.slice(0, 6)}` : "")}
  placeholder="#ff6600"
/>
```

Return `""` from `maskFormat` when there is nothing typed, otherwise a fixed prefix can't be
deleted. Without `maskFormat` the kept characters are shown as they are, and `g`/`y` flags on the
regex are ignored.

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
| `loading` / `loadingMessage`              | Spinner row at the end of the list (default text `Loading...`)          |
| `onReachEnd`                              | Called when the user scrolls near the end of the list (not while `loading`) |
| `hasMore`                                 | `true` (default) · `false` after the last page                          |
| `onSearchChange`                          | Server-side search: receives the typed text, turns the local filter off |
| `disabled`                                | Disables the whole select                                               |
| `name`                                    | Mirrors the value in a hidden input, so it is submitted with a `<form>` |
| `label` / `aria-label`                    | Visible label, or an accessible name when there is no label             |

### Loading, infinite scroll and server-side search

Load options in pages: `onReachEnd` fires when the user scrolls near the end, you fetch the next
page, append it to `options` and show the spinner with `loading` meanwhile. Set `hasMore={false}`
after the last page. While `hasMore` is true, `onReachEnd` also fires when the options don't fill
the menu (no scrollbar), until they do.

```tsx
<Select
  options={options}
  loading={loading}
  hasMore={hasMore}
  onReachEnd={() => {
    setLoading(true); // set it synchronously so the event can't fire twice
    fetchNextPage().then(() => setLoading(false));
  }}
/>
```

For server-side search, `onSearchChange` (needs `searchable`) receives the typed text and turns the
local filter off, so `options` should already be the matches. It is called on every keystroke:
debounce it yourself. The selected option keeps its label on the button even when a search removes
it from `options`.

```tsx
<Select searchable options={options} loading={loading} onSearchChange={(q) => search(q)} />
```

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
  loadingMessage="Carregando..."
  options={options}
/>
```

## Textarea

A `<textarea>` with every native prop, a label, helper and error text. It shares `variant`,
`variantColor`, `customColor`, `size`, `radius` and `animation` with `Input`.

```tsx
<Textarea label="Message" rows={4} />
<Textarea label="Bio" helperText="A few words about you" resize="none" />
<Textarea label="Message" errorMessage="Write at least 20 characters" />
```

`resize` is `none` · `vertical` (default) · `horizontal` · `both`; `rows` defaults to `3`.

## Checkbox

A native `<input type="checkbox">` with its own look, so forms, `ref` and the keyboard work as
usual. The `label` wraps the control: clicking the text toggles it.

```tsx
<Checkbox label="Accept the terms" />
<Checkbox defaultChecked variantColor="success" label="Newsletter" helperText="One email per week" />
<Checkbox indeterminate label="Select all" />
<Checkbox label="Accept the terms" errorMessage="You must accept to continue" />
```

| Prop                           | Values                                       | Default   |
| ------------------------------ | -------------------------------------------- | --------- |
| `variantColor` / `customColor` | `primary` · `success` · `warning` · `danger` / any CSS color | `primary` |
| `size`                         | `sm` · `md` · `lg`                           | `md`      |
| `radius`                       | `none` · `sm` · `md` · `lg` · `full`         | `sm`      |
| `animation`                    | `none` · `smooth` · `fast` · `bounce`        | `smooth`  |
| `label` / `helperText`         | `ReactNode` / `string`                       | —         |
| `errorMessage`                 | `string`: its presence alone forces the error state | —  |
| `indeterminate`                | `boolean`: shows a dash instead of the check | `false`   |

## Radio

`RadioGroup` renders a set of options from an array, like `Select`. It shares one `name`, works
controlled (`value`) or uncontrolled (`defaultValue`), and the arrow keys move between options.

```tsx
<RadioGroup
  label="Plan"
  defaultValue="free"
  onValueChange={(plan) => console.log(plan)}
  options={[
    { value: "free", label: "Free", description: "For side projects" },
    { value: "pro", label: "Pro", description: "For small teams" },
    { value: "team", label: "Team", disabled: true },
  ]}
/>
```

| Prop                                | Description                                                       |
| ----------------------------------- | ----------------------------------------------------------------- |
| `options`                           | `{ value, label, description?, disabled? }[]`                     |
| `value` / `defaultValue`            | Controlled / uncontrolled selection                               |
| `onValueChange`                     | Called with the selected value                                    |
| `name`                              | Shared name, so the value is submitted with a `<form>`            |
| `label`                             | Title of the group (rendered as a `<legend>`)                     |
| `orientation`                       | `vertical` (default) · `horizontal`                               |
| `helperText` / `errorMessage`       | Text under the group; an error colors every radio                 |
| `disabled`                          | Disables every option                                             |
| `variantColor` / `customColor` / `size` / `animation` | Same as `Checkbox`                              |

For full control of each row, use `Radio` on its own: it takes `label`, `helperText`,
`errorMessage`, the style props above and every native `<input>` prop.

```tsx
<Radio name="shipping" value="express" label="Express" />
```

## Switch

A native checkbox exposed as `role="switch"`: it works in forms, with `ref` and with Space. Use it
for settings that apply immediately, and `Checkbox` for choices that are submitted later.

```tsx
<Switch label="Wi-Fi" />
<Switch defaultChecked variantColor="success" label="Notifications" helperText="Sent by email" />
```

It takes the same props as `Checkbox`, except `radius` and `indeterminate`.

## Slider

Pick a number, or an interval, by dragging a thumb or with the keyboard (arrows, Page Up/Down,
Home, End). The value is **always an array**, one number per thumb: `[40]` for one value,
`[20, 80]` for an interval with the track filled between the thumbs. The Slider does not print the
chosen number: show it next to the control.

```tsx
const [volume, setVolume] = useState([40]);

<p>Volume: {volume[0]}%</p>
<Slider aria-label="Volume" value={volume} onValueChange={setVolume} />

<Slider
  aria-label="Price"
  thumbLabels={["Minimum price", "Maximum price"]}
  defaultValue={[200, 800]}
  min={0}
  max={1000}
  step={10}
  onValueCommit={(range) => fetchProducts(range)}
/>
```

| Prop                                   | Description                                                            |
| -------------------------------------- | ---------------------------------------------------------------------- |
| `value` / `defaultValue`               | `number[]`, one per thumb (default `[min]`)                            |
| `onValueChange`                        | Called with the array while a thumb moves                              |
| `onValueCommit`                        | Called when the thumb is released or a key press ends                  |
| `min` / `max` / `step`                 | `0` / `100` / `1` by default                                           |
| `minStepsBetweenThumbs`                | In an interval, the minimum distance between thumbs, in steps          |
| `aria-label`                           | **Required** accessible name; with several thumbs a number is appended |
| `thumbLabels`                          | Accessible name of each thumb, replacing the numbered `aria-label`     |
| `name`                                 | Form field name; every thumb submits its value under it                |
| `disabled`                             | Blocks use                                                             |
| `variantColor` / `customColor` / `size` / `animation` | Same as `Checkbox`                                      |

## Upload

An area to pick files by clicking or dragging them in. It only **captures** files: listing them,
validating the size and sending them to a server are up to you. It is a real
`<input type="file">` hidden only visually (Tab to focus, Enter or Space to open).

```tsx
const [files, setFiles] = useState<File[]>([]);

<Upload
  multiple
  accept=".pdf,image/*"
  label="Attachments"
  description="PDF or image, up to 5 MB"
  onFilesChange={(chosen) => setFiles((current) => [...current, ...chosen])}
/>
```

| Prop                           | Description                                                              |
| ------------------------------ | ------------------------------------------------------------------------ |
| `onFilesChange`                | **Required.** Called with a `File[]` of the files just chosen, not the sum with earlier ones |
| `title` / `description`        | Main text (default `Drag files here or click to choose`) and support text |
| `accept`                       | `.pdf`, `image/*`, `image/png`, comma-separated. Also filters dragged files |
| `multiple`                     | Without it, only the first file of a selection is kept                   |
| `label` / `helperText`         | Label above the area, help text below                                    |
| `errorMessage`                 | Its presence alone forces the error state (red border, `aria-invalid`)   |
| `disabled`                     | Blocks click and drag                                                    |
| `name`                         | Field name for a native `<form>`; dropped files are mirrored into the input |
| `variantColor` / `customColor` / `size` / `radius` / `animation` | Same as `Checkbox`            |

There is no `maxSize`, `maxFiles`, preview or progress: check `file.size` yourself and show the
result with `errorMessage`. Validate again on the server, because `accept` can be bypassed.

## Date and time

Five components share one design. `Calendar` is the base; `DatePicker`, `DateRangePicker`,
`TimePicker` and `DateTimePicker` are fields that look like an `Input` (same `variant`,
`variantColor`, `customColor`, `size`, `radius`, `animation`, `label`, `helperText`,
`errorMessage`, `disabled` and `readOnly`) and open a panel in a portal. Focus enters the panel on
open and returns to the field on `Esc`.

Dates are JavaScript `Date`s that represent a **day** (the hour is ignored), except in
`DateTimePicker`. Month and day names, the date format and the placeholder come from `locale`
(BCP 47, default `en-US`) through `Intl`, so nothing is translated for you: pass `locale`,
`previousMonthLabel`, `nextMonthLabel`, `panelLabel` and `placeholder` in your language.

```tsx
const [date, setDate] = useState<Date>();
const [period, setPeriod] = useState<DateRange>({});

<Calendar value={date} onValueChange={setDate} />
<Calendar mode="range" value={period} onValueChange={setPeriod} />

<DatePicker label="Delivery date" value={date} onValueChange={setDate} minDate={new Date()} />
<DateRangePicker label="Stay" presets value={period} onValueChange={setPeriod} />
<TimePicker label="Time" defaultValue="14:30" hour12 minuteStep={15} />
<DateTimePicker label="Appointment" onValueChange={(when) => console.log(when)} />
```

| Component         | Value                                     | Form value (`name`)                     |
| ----------------- | ----------------------------------------- | --------------------------------------- |
| `Calendar`        | `Date`, or `{ from?, to? }` with `mode="range"` | none                              |
| `DatePicker`      | `Date`                                    | `yyyy-mm-dd`                            |
| `DateRangePicker` | `{ from?: Date; to?: Date }`              | `fromName` / `toName`, `yyyy-mm-dd`     |
| `TimePicker`      | `"HH:mm"` string (24h, even with `hour12`) | `HH:mm`                                |
| `DateTimePicker`  | `Date` with day and time                  | `yyyy-mm-ddTHH:mm`                      |

Shared by `Calendar` and the date fields: `minDate` / `maxDate` (days outside are disabled, and so
are the month arrows leading there), `weekStartsOn` (`0` = Sunday, default), `locale`,
`previousMonthLabel` / `nextMonthLabel`.

- **Calendar keyboard:** arrows move by day/week, `Home`/`End` the edges of the week, `Page Up/Down`
  the month (with `Shift`, the year), `Enter`/`Space` choose. Only one day is in the tab order.
  In range mode the first click sets the start, the second the end, and a click before the start
  or on a finished range starts over.
- **DatePicker** closes after a day is chosen. The date is not typed: for typed dates use an
  `Input` with `mask="date"`.
- **DateRangePicker** calls `onValueChange` twice per range (first only `from`) and closes after the
  second click. `presets` adds a shortcut column: `true` uses `getDatePresets()`; pass your own
  `{ label, range }[]`, or translate the defaults with
  `presetLabels={{ today: "Hoje", last7Days: "Últimos 7 dias", ... }}` (also available as
  `getDatePresets(labels)` to build your own list).
- **TimePicker** shows hour and minute columns (plus AM/PM with `hour12`; the value stays 24h).
  `minuteStep` limits the minutes. The panel stays open while you pick.
- **DateTimePicker** puts the calendar and the time columns in one panel with an `OK` button
  (`confirmLabel`). Picking a day keeps the time; picking a time before a day uses today.

## Avatar

Round user picture; falls back to initials when `src` is missing or fails to load. `name` is required (initials + accessible label, `role="img"`).

```tsx
<Avatar name="Camila Souza" />
<Avatar name="Yuki Tanaka" src="/avatars/yuki.jpg" size="lg" />
```

| Prop | Values | Default |
| --- | --- | --- |
| `name` | `string` (required) | - |
| `src` | `string` | - |
| `size` | `sm` \| `md` \| `lg` (32/40/56px) | `md` |
| `radius` | `none` \| `sm` \| `md` \| `lg` \| `full` | `full` |
| `variantColor` | `primary` \| `success` \| `warning` \| `danger` (tints the initials) | neutral |
| `customColor` | `string` \| `{ light, dark }` | - |

## Badge

Small status label with an optional decorative dot. Not interactive.

```tsx
<Badge status="success" dot>Active</Badge>
```

| Prop | Values | Default |
| --- | --- | --- |
| `status` | `success` \| `error` \| `warning` \| `info` \| `neutral` \| `pending` | `neutral` |
| `dot` | `boolean` | `false` |
| `size` | `sm` \| `md` \| `lg` | `md` |
| `radius` | `none` \| `sm` \| `md` \| `lg` \| `full` | `full` |
| `customColor` | `string` \| `{ light, dark }` (overrides `status`) | - |

## Tag

Label for categories or filters, with an optional remove button.

```tsx
<Tag variant="outline">Code</Tag>
<Tag onDismiss={() => remove("React")} dismissLabel="Remove React">React</Tag>
```

| Prop | Values | Default |
| --- | --- | --- |
| `variant` | `filled` \| `outline` | `filled` |
| `variantColor` | `primary` \| `success` \| `warning` \| `danger` | neutral |
| `size` | `sm` \| `md` \| `lg` | `md` |
| `radius` | `none` \| `sm` \| `md` \| `lg` \| `full` | `md` |
| `customColor` | `string` \| `{ light, dark }` | - |
| `onDismiss` | `() => void` (renders the remove button) | - |
| `dismissLabel` | `string` | `"Remove"` |

## Card

Elevated surface. `CardHeader`, `CardBody` and `CardFooter` are optional sections.

```tsx
<Card>
  <CardHeader>Pro plan</CardHeader>
  <CardBody>Up to 10 users.</CardBody>
  <CardFooter>Billed monthly</CardFooter>
</Card>
```

| Prop | Values | Default |
| --- | --- | --- |
| `padding` | `none` \| `md` \| `lg` | `md` |
| `radius` | `none` \| `sm` \| `md` \| `lg` \| `full` | `lg` |

## List

Semantic `<ul>`; `ListItem` lays out title, description, leading and trailing content.

```tsx
<List divided>
  <ListItem leading={<Avatar name="Camila Souza" />} title="Camila Souza"
    description="Designer" trailing={<Badge status="success">Active</Badge>} />
</List>
```

| Prop | Values | Default |
| --- | --- | --- |
| `divided` (List) | `boolean` | `false` |
| `title` (ListItem) | `ReactNode` (required) | - |
| `description` | `ReactNode` | - |
| `leading` / `trailing` | `ReactNode` | - |

## Table

Styled native table parts: `Table`, `TableCaption`, `TableHeader`, `TableBody`, `TableRow`, `TableHead` (`scope="col"` by default), `TableCell`. Each accepts the native props of its element. Name the table with a caption or `aria-label`; sorting is up to you.

```tsx
<Table striped>
  <TableCaption>Recent orders</TableCaption>
  <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Total</TableHead></TableRow></TableHeader>
  <TableBody><TableRow><TableCell>#1042</TableCell><TableCell>$120</TableCell></TableRow></TableBody>
</Table>
```

| Prop | Values | Default |
| --- | --- | --- |
| `striped` (Table) | `boolean` | `false` |
| `wrapperClassName` (Table) | `string` (scroll wrapper; `className` goes on the table) | - |

## Accordion

Sections that expand and collapse. Arrow Up/Down, Home and End move focus between headers.

```tsx
<Accordion type="single" collapsible defaultValue="payment">
  <AccordionItem value="payment" title="Which payment methods?">Card, bank slip and Pix.</AccordionItem>
</Accordion>
```

| Prop | Values | Default |
| --- | --- | --- |
| `type` | `single` \| `multiple` (required) | - |
| `collapsible` | `boolean` (single only) | `false` |
| `value` / `defaultValue` | `string` (single) or `string[]` (multiple) | - |
| `onValueChange` | `(value) => void` (`""` when a single closes) | - |
| `variantColor` | `primary` \| `success` \| `warning` \| `danger` (focus ring) | `primary` |
| `customColor` | `string` \| `{ light, dark }` | - |
| `animation` | `none` \| `smooth` \| `fast` \| `bounce` | `smooth` |
| `value`, `title`, `disabled` (AccordionItem) | `string`, `ReactNode`, `boolean` | - |

## Alert

Inline message with a title, description, icon, optional action and close button. `warning` and
`danger` use `role="alert"`, the other colors `role="status"`. The close button only appears with
`onDismiss`; you decide whether to unmount.

```tsx
<Alert variantColor="success" title="Saved">Your changes were saved.</Alert>
<Alert
  variantColor="warning"
  title="Unsaved changes"
  action={<Button size="sm" variant="transparent">Save now</Button>}
  onDismiss={() => setOpen(false)}
>
  You have pending edits.
</Alert>
```

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `variantColor` | `primary \| success \| warning \| danger` | `primary` | Color and default icon |
| `customColor` | `string \| { light, dark }` | none | Any CSS color; overrides `variantColor` |
| `size` | `sm \| md \| lg` | `md` | Padding and text size |
| `radius` | `none \| sm \| md \| lg \| full` | `lg` | Corner rounding |
| `title` | `ReactNode` | none | Bold summary above the children |
| `icon` | `ReactNode \| false` | status icon | Own icon, or `false` to hide it |
| `action` | `ReactNode` | none | Slot under the description |
| `onDismiss` | `() => void` | none | Shows the close button |
| `dismissLabel` | `string` | `Dismiss` | Accessible name of the close button |

Native `<div>` props (including `role`) are accepted.

## Banner

Full-width page-level message with no radius: place it at the top of the page. Same props as
`Alert` except `title` and `radius`; `action` sits beside the message.

```tsx
<Banner action={<Button size="sm" variant="transparent">Learn more</Button>} onDismiss={close}>
  Scheduled maintenance today at 10 PM.
</Banner>
```

## Toast

Mount `<Toaster />` once near the root, then call `toast()` (or `useToast()`) from anywhere. Toasts
render in a portal region, stack, close after `duration` and pause while hovered or focused; `Esc`
closes the focused one. `toast()` returns the id; `toast.dismiss(id)` closes it (no id closes all).

```tsx
<Toaster position="top-right" />

toast({ variantColor: "success", title: "Saved", description: "Your changes were saved." });
toast({ description: "Item removed.", action: { label: "Undo", onClick: restore } });
toast("A plain string is the description");
```

| `Toaster` prop | Values | Default | Description |
| --- | --- | --- | --- |
| `position` | `top-left \| top-center \| top-right \| bottom-left \| bottom-center \| bottom-right` | `top-right` | Where the stack sits |
| `limit` | `number` | `5` | Most toasts shown at once |
| `duration` | `number` | `5000` | Default ms before auto-close |
| `radius` | `none \| sm \| md \| lg \| full` | `lg` | Corner rounding |
| `label` | `string` | `Notifications` | Accessible name of the region |
| `dismissLabel` | `string` | `Dismiss` | Accessible name of the close buttons |

| `toast()` option | Values | Default | Description |
| --- | --- | --- | --- |
| `title`, `description` | `ReactNode` | none | Content |
| `variantColor` | `primary \| success \| warning \| danger` | `primary` | Color and icon |
| `customColor` | `string \| { light, dark }` | none | Overrides `variantColor` |
| `icon` | `ReactNode \| false` | status icon | Own icon, or `false` |
| `action` | `{ label, onClick }` | none | Action button; also closes the toast |
| `duration` | `number` | `5000` | `0` keeps it until dismissed |
| `dismissible` | `boolean` | `true` | Show the close button |
| `id` | `string` | generated | A repeated id replaces the toast |
| `onClose` | `() => void` | none | Runs when it closes |

## Skeleton

Loading placeholder. It is `aria-hidden`: set `aria-busy` on the container while loading. The pulse
is disabled under `prefers-reduced-motion`.

```tsx
<div aria-busy={loading}>
  <Skeleton variant="avatar" />
  <Skeleton variant="title" width="60%" />
  <Skeleton lines={3} />
</div>
```

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `variant` | `text \| title \| avatar \| rectangle \| card` | `text` | Shape and default size |
| `lines` | `number` | `1` | `text` only; the last of several is shorter |
| `width`, `height` | `number \| string` | per variant | CSS size (number = px) |
| `radius` | `none \| sm \| md \| lg \| full` | per variant | Corner rounding |
| `animation` | `pulse \| none` | `pulse` | Static with `none` |

## Tabs

Switch between distinct sections of content (WAI-ARIA tabs pattern: `tablist`, `tab`, `tabpanel`, roving tabindex, arrows/Home/End).

```tsx
import { Tab, TabList, TabPanel, Tabs } from "vaiperui";

<Tabs defaultValue="general">
  <TabList aria-label="Settings">
    <Tab value="general">General</Tab>
    <Tab value="account">Account</Tab>
    <Tab value="billing" disabled>Billing</Tab>
  </TabList>
  <TabPanel value="general">General preferences.</TabPanel>
  <TabPanel value="account">Account details.</TabPanel>
</Tabs>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` / `defaultValue` | `string` | - | Active tab (controlled / uncontrolled). Set one of them so a tab is reachable by keyboard |
| `onValueChange` | `(value: string) => void` | - | Called when the active tab changes |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Direction of the list and of the arrow keys |
| `activation` | `"auto" \| "manual"` | `"auto"` | `manual` waits for Enter or Space |
| `variantColor` | `"primary" \| "success" \| "warning" \| "danger"` | `"primary"` | Accent color |
| `customColor` | `string \| { light, dark }` | - | Any CSS color; overrides `variantColor` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size |
| `animation` | `"none" \| "smooth" \| "fast" \| "bounce"` | `"smooth"` | Transition |

`Tab` takes `value`, `icon` and `disabled`; `TabPanel` takes `value`. `TabList` should get an `aria-label`.

## SegmentedControl

A single choice among a few options (`radiogroup` semantics; arrows move and select).

```tsx
import { SegmentedControl, SegmentedItem } from "vaiperui";

<SegmentedControl aria-label="View" defaultValue="list" onValueChange={setView}>
  <SegmentedItem value="list">List</SegmentedItem>
  <SegmentedItem value="grid">Grid</SegmentedItem>
  <SegmentedItem value="map" disabled>Map</SegmentedItem>
</SegmentedControl>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `aria-label` | `string` | required | Names what the control selects |
| `value` / `defaultValue` | `string` | - | Selected item (controlled / uncontrolled) |
| `onValueChange` | `(value: string) => void` | - | Called when the selection changes |
| `disabled` | `boolean` | `false` | Disables the whole control |
| `variantColor` / `customColor` | colors | neutral | Color of the selected item's text |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size |
| `radius` | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` | Corner rounding |
| `animation` | `"none" \| "smooth" \| "fast" \| "bounce"` | `"smooth"` | Transition |

`SegmentedItem` takes `value` and `disabled`.

## Breadcrumb

A `nav` with an ordered list showing where the current page sits in the hierarchy. Router-agnostic: use `href`, or pass your router's link as the child with `asChild`.

```tsx
import { Breadcrumb, BreadcrumbItem } from "vaiperui";

<Breadcrumb maxItems={4}>
  <BreadcrumbItem href="/">Dashboard</BreadcrumbItem>
  <BreadcrumbItem asChild><Link href="/settings">Settings</Link></BreadcrumbItem>
  <BreadcrumbItem current>Profile</BreadcrumbItem>
</Breadcrumb>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `separator` | `ReactNode` | `"/"` | Drawn between items (`aria-hidden`) |
| `maxItems` | `number` | - | Longer trails collapse to the first item, an ellipsis button and the last `maxItems - 1` |
| `expandLabel` | `string` | `"Show hidden items"` | Accessible name of the ellipsis button |
| `aria-label` | `string` | `"Breadcrumb"` | Name of the navigation |
| `variantColor` / `customColor` | colors | `"primary"` | Focus ring (and link hover with `customColor`) |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Text size |

`BreadcrumbItem` takes `href`, `current` (renders text with `aria-current="page"`) and `asChild`.

## Pagination

Controlled page navigation. With many pages it shows the first, last, current and neighbors with ellipses, keeping a constant width.

```tsx
import { Pagination } from "vaiperui";

const [page, setPage] = useState(1);

<Pagination page={page} pageCount={20} onPageChange={setPage} />
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | `number` | required | Current page, starting at 1 |
| `pageCount` | `number` | required | Total number of pages |
| `onPageChange` | `(page: number) => void` | required | Called with the chosen page |
| `siblingCount` | `number` | `1` | Pages shown on each side of the current one |
| `previousLabel` / `nextLabel` | `string` | `"Previous page"` / `"Next page"` | Accessible names of the arrows |
| `pageLabel` | `(page: number) => string` | `"Page n"` | Accessible name of a page button |
| `aria-label` | `string` | `"Pagination"` | Name of the navigation |
| `disabled` | `boolean` | `false` | Disables every button |
| `variantColor` / `customColor` | colors | `"primary"` | Accent of the current page |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size |
| `radius` | `"none" \| "sm" \| "md" \| "lg" \| "full"` | `"md"` | Corner rounding |
| `animation` | `"none" \| "smooth" \| "fast" \| "bounce"` | `"smooth"` | Transition |

## Stepper

Shows progress through a sequential flow. Earlier steps are completed, `current` is highlighted (`aria-current="step"`), later ones are upcoming.

```tsx
import { Step, Stepper } from "vaiperui";

<Stepper current={1} aria-label="Signup steps">
  <Step>Account</Step>
  <Step description="Where to ship">Address</Step>
  <Step>Payment</Step>
</Stepper>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `current` | `number` | required | Zero-based index of the active step |
| `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Layout |
| `onStepClick` | `(index: number) => void` | - | Makes completed steps buttons that go back |
| `completedLabel` | `string` | `"Completed"` | Screen-reader text on completed steps |
| `variantColor` / `customColor` | colors | `"primary"` | Accent color |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Size |
| `animation` | `"none" \| "smooth" \| "fast" \| "bounce"` | `"smooth"` | Transition |

`Step` takes `children` (the label) and an optional `description`.

## Modal

A dialog over a backdrop: `role="dialog"` + `aria-modal`, rendered in a portal, named by `title`.
The page behind does not scroll, Tab stays inside, focus moves in when it opens and returns to the
trigger when it closes. Escape and a backdrop click close it. Use `trigger` (uncontrolled) or
`open` + `onOpenChange` (controlled), and wrap a footer button in `ModalClose` to close it.

```tsx
<Modal
  trigger={<Button>Open</Button>}
  title="Delete project?"
  footer={
    <>
      <ModalClose><Button variant="outlined">Cancel</Button></ModalClose>
      <ModalClose><Button variantColor="danger">Delete</Button></ModalClose>
    </>
  }
>
  This action cannot be undone.
</Modal>
```

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | required | Heading and accessible name |
| `footer` | `ReactNode` | none | Action buttons; no footer without it |
| `trigger` | `ReactElement` | none | Element that opens it (needs ref and `onClick`) |
| `open` / `defaultOpen` / `onOpenChange` | `boolean` / `boolean` / `(open) => void` | none | Controlled or uncontrolled state |
| `size` | `sm` \| `md` \| `lg` | `sm` | Max width 480 / 640 / 800px |
| `radius` / `animation` | `none`..`full` / `none` \| `smooth` \| `fast` \| `bounce` | `lg` / `smooth` | Corners and enter transition |
| `showClose` / `closeLabel` | `boolean` / `string` | `true` / `"Close"` | × button and its accessible name |
| `showHeaderDivider` / `showFooterDivider` | `boolean` | `true` | Lines between sections |
| `closeOnEscape` / `closeOnBackdropClick` | `boolean` | `true` | What closes it |

## Drawer

The same dialog behavior as `Modal`, sliding from an edge. Left/right panels are up to 400px wide;
top/bottom ones span the width up to 80% of the height. `DrawerClose` closes it from inside.

```tsx
<Drawer trigger={<Button>Open</Button>} side="right" title="Filters"
  footer={<DrawerClose><Button>Apply</Button></DrawerClose>}>
  ...
</Drawer>
```

It takes the dialog props of `Modal` (`title`, `footer`, `trigger`, `open`, `defaultOpen`,
`onOpenChange`, `showClose`, `closeLabel`, `closeOnEscape`, `closeOnBackdropClick`, `animation`)
plus `side` (`left` | `right` | `top` | `bottom`, default `right`).

## Popover

A click-triggered panel anchored to an element, positioned with flip and shift. The trigger gets
`aria-expanded` / `aria-controls`; the panel is a `role="dialog"` named by `label`. Outside click
and Escape close it (Escape returns focus to the trigger). Use `PopoverClose` for an inner close
button.

```tsx
<Popover trigger={<Button>Details</Button>} label="Details" side="bottom" align="center">
  <p>Anchored content.</p>
  <PopoverClose><Button size="sm">Got it</Button></PopoverClose>
</Popover>
```

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `trigger` | `ReactElement` | required | Element that toggles it (needs ref, focus, `onClick`) |
| `label` | `string` | required | Accessible name of the panel |
| `side` / `align` | `top` \| `right` \| `bottom` \| `left` / `start` \| `center` \| `end` | `bottom` / `center` | Placement |
| `open` / `defaultOpen` / `onOpenChange` | | none | Controlled or uncontrolled state |
| `radius` / `animation` | | `lg` / `fast` | Corners and enter transition |

## Menu

A dropdown menu button: `role="menu"` with `menuitem` buttons. Arrows, Home and End move between
items (disabled ones are skipped), typing a letter jumps to a match, Enter/Space selects, Escape
closes and returns focus to the trigger. `onSelect` runs on click and keyboard; call
`event.preventDefault()` in it to keep the menu open.

```tsx
<Menu trigger={<Button>Actions</Button>} label="Actions">
  <MenuLabel>Project</MenuLabel>
  <MenuItem icon="✎" onSelect={() => rename()}>Rename</MenuItem>
  <MenuItem disabled>Archive</MenuItem>
  <MenuSeparator />
  <MenuItem destructive>Delete</MenuItem>
</Menu>
```

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `trigger` | `ReactElement` | required | Button that opens it |
| `label` | `string` | none | Accessible name of the menu |
| `side` / `align` | as `Popover` | `bottom` / `start` | Placement |
| `open` / `defaultOpen` / `onOpenChange` | | none | Controlled or uncontrolled state |
| `size` / `radius` / `animation` | | `md` / `lg` / `fast` | Text size, corners, transition |

`MenuItem` props: `onSelect`, `icon`, `destructive`, `disabled` (plus button attributes).

## Tooltip

A short description on hover and keyboard focus: `role="tooltip"`, linked to the child with
`aria-describedby`. It opens after `delayDuration` on hover (immediately on focus) and closes on
leave, blur or Escape. It is not interactive and capped at 240px: never put links or essential
information in it.

```tsx
<Tooltip title="Shortcut" content="Save your changes" side="top">
  <Button>Save</Button>
</Tooltip>
```

| Prop | Values | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactElement` | required | Described element (needs ref and focus) |
| `content` / `title` | `ReactNode` | required / none | Text and optional heading |
| `side` | `top` \| `right` \| `bottom` \| `left` | `top` | Flips when there is no room |
| `showArrow` / `delayDuration` | `boolean` / `number` | `true` / `200` | Arrow and hover delay (ms) |
| `open` / `defaultOpen` / `onOpenChange` | | none | Controlled or uncontrolled state |
| `variantColor` / `customColor` / `radius` | `neutral` \| `primary` \| ... / CSS color | `neutral` / `md` | Look |

## Container

Centered wrapper with a max width and responsive side padding (16 / 24 / 32px). Presentational, so
it also works in Server Components.

```tsx
<Container size="md" as="main">
  <h1>Title</h1>
</Container>
```

| Prop        | Values                      | Default | Description                      |
| ----------- | --------------------------- | ------- | -------------------------------- |
| `size`      | `sm` `md` `lg` `xl` `full`  | `lg`    | Max width: 672 / 896 / 1152 / 1280px / none |
| `padded`    | `boolean`                   | `true`  | Responsive side padding          |
| `as`        | `ElementType`               | `div`   | Element to render                |

## Grid

CSS grid with responsive columns. `columns` takes 1 to 12 or an object per breakpoint
(`base`, `sm`, `md`, `lg`, `xl`). `GridItem` spans columns or rows.

```tsx
<Grid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
  <GridItem colSpan={2}>Wide</GridItem>
  <GridItem>Item</GridItem>
</Grid>
```

| Prop                        | Values                                | Default | Description                     |
| --------------------------- | ------------------------------------- | ------- | ------------------------------- |
| `columns`                   | `1`-`12` or `{ base, sm, md, lg, xl }` | `1`     | Number of columns               |
| `gap`                       | `0` `1` `2` `3` `4` `6` `8`           | `4`     | Space between cells (4px steps) |
| `as`                        | `ElementType`                         | `div`   | Element to render               |
| `GridItem` `colSpan`/`rowSpan` | `1`-`12` / `1`-`6`                 | none    | Columns / rows the item spans   |

## Stack

Flex layout in one direction. `direction` can change per breakpoint, and `divider` is rendered
between every pair of children.

```tsx
<Stack direction={{ base: "vertical", md: "horizontal" }} gap={3} align="center"
  divider={<Divider orientation="vertical" />}>
  <span>One</span>
  <span>Two</span>
</Stack>
```

| Prop        | Values                                              | Default    | Description                  |
| ----------- | --------------------------------------------------- | ---------- | ---------------------------- |
| `direction` | `vertical` `horizontal` or `{ base, sm, md, lg, xl }` | `vertical` | Main axis                    |
| `gap`       | `0` `1` `2` `3` `4` `6` `8`                         | `4`        | Space between children       |
| `align`     | `start` `center` `end` `stretch` `baseline`         | none       | `align-items`                |
| `justify`   | `start` `center` `end` `between` `around` `evenly`  | none       | `justify-content`            |
| `wrap`      | `boolean`                                           | `false`    | Let children wrap            |
| `divider`   | `ReactNode`                                         | none       | Element between children     |
| `as`        | `ElementType`                                       | `div`      | Element to render            |

## Divider

Horizontal or vertical separator with `role="separator"` and `aria-orientation`; set `decorative`
for pure decoration. A vertical divider stretches to the height of a flex parent.

```tsx
<Divider />
<Divider label="or" variant="dashed" spacing="md" />
<Divider orientation="vertical" customColor="#7c3aed" />
```

| Prop                  | Values                                    | Default      | Description                              |
| --------------------- | ----------------------------------------- | ------------ | ---------------------------------------- |
| `orientation`         | `horizontal` `vertical`                   | `horizontal` | Direction of the line                    |
| `variant`             | `solid` `dashed` `dotted`                 | `solid`      | Line style                               |
| `spacing`             | `none` `sm` `md` `lg`                     | `none`       | Margin around the line                   |
| `color`               | `default` `strong` `soft`                 | `default`    | Theme border token                       |
| `customColor`         | CSS color or `{ light, dark }`            | none         | Overrides `color`                        |
| `label`/`labelAlign`  | `ReactNode` / `start` `center` `end`      | none / `center` | Text inside the line                  |
| `decorative`          | `boolean`                                 | `false`      | `role="presentation"` instead of separator |

## AudioPlayer

Custom accessible controls over a native `<audio>`: play/pause, seek slider, current/total time, playback speed, mute and volume. Shortcuts on the player: Space/K, arrows (seek 5s / volume), M.

`variant="waveform"` is a compact card like a voice message: play button, a **clickable waveform** to seek (it is a slider: click or drag, arrows move 5s, Home/End), `current / total` time and the speed button. The file is downloaded and decoded in memory (8 kHz, about 1 MB per minute) to draw the bars from its loudness; they pulse meanwhile, and a default pattern is shown if the analysis fails (for audio on another origin it needs an `Access-Control-Allow-Origin` header). For long audio pass the peaks in `waveform`: it skips the download.

```tsx
<AudioPlayer src="/audio/note.mp3" variant="waveform" speeds={[0.75, 1, 1.25, 1.5]} />
<AudioPlayer src="/audio/note.mp3" variant="waveform" bars={40} waveform={[0.1, 0.4, 0.9, 0.6, 0.2]} />
```

```tsx
import { AudioPlayer } from "vaiperui";

<AudioPlayer src="/audio/note.mp3" label="Voice note" onEnded={() => console.log("done")} />
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | — | Audio URL |
| `variant` | `"default" \| "waveform"` | `"default"` | `waveform`: compact card with a clickable waveform, `current / total` time and speed (no volume or mute) |
| `bars` | `number` | `52` | `waveform` variant: number of bars |
| `waveform` | `number[]` | — | `waveform` variant: peaks from 0 to 1, resampled to `bars`; skips the audio analysis |
| `label` | `string` | `"Audio"` | Accessible name of the player |
| `preload` | `"none" \| "metadata" \| "auto"` | `"metadata"` | Native preload |
| `loop`, `autoPlay` | `boolean` | `false` | Native behaviors |
| `speeds` | `number[]` | `[1, 1.5, 2]` | Speeds the speed button cycles through; `[]` hides it |
| `labels` | `Partial<{ play, pause, mute, unmute, seek, volume, speed, of }>` | English | Overrides the built-in texts |
| `onPlay`, `onPause`, `onEnded` | `() => void` | — | Media events |
| `onTimeUpdate` | `(currentTime: number) => void` | — | Position in seconds |
| `variantColor` | `primary \| success \| warning \| danger` | `primary` | Accent color |
| `customColor` | `string \| { light, dark }` | — | Overrides `variantColor` |
| `size` | `sm \| md \| lg` | `md` | Size |
| `radius` | `none \| sm \| md \| lg \| full` | `lg` | Corner rounding |
| `animation` | `none \| smooth \| fast \| bounce` | `smooth` | Transition |

## VideoPlayer

Native `<video>` with custom controls: play/pause, seek, time, volume, fullscreen and a captions button when a `<track>` is present. Controls hide after inactivity while playing. Shortcuts: Space/K, arrows, M, F.

`variant="overlay"` adds a **large play button in the center** while paused (with a light veil; it is a shortcut for mouse and touch, the keyboard uses the play button of the bar) and adapts to the player width with a container query: narrower than 560px the seek bar moves below the buttons and the volume slider is hidden (mute stays). The cursor also hides with the controls while playing.

```tsx
import { VideoPlayer } from "vaiperui";

<VideoPlayer src="/video/flower.mp4" poster="/video/poster.jpg" label="Flower">
  <track kind="captions" src="/video/en.vtt" srcLang="en" label="English" />
</VideoPlayer>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | `string` | — | Video URL |
| `variant` | `"default" \| "overlay"` | `"default"` | `overlay`: large central play button while paused and a layout that adapts below 560px |
| `poster` | `string` | — | Image shown before playing |
| `label` | `string` | `"Video"` | Accessible name |
| `autoPlay`, `muted`, `loop` | `boolean` | `false` | Native behaviors |
| `preload` | `"none" \| "metadata" \| "auto"` | `"metadata"` | Native preload |
| `hideControlsAfter` | `number` | `2500` | Idle ms before hiding the controls while playing; `0` keeps them |
| `children` | `ReactNode` | — | `<track>` and extra `<source>` elements |
| `labels` | `Partial<{ play, pause, mute, unmute, seek, volume, fullscreen, exitFullscreen, captions }>` | English | Built-in texts |
| `onPlay`, `onPause`, `onEnded`, `onTimeUpdate` | see AudioPlayer | — | Media events |
| `variantColor`, `customColor`, `size`, `radius`, `animation` | see AudioPlayer | — | Style props |

## Gallery

Responsive grid of thumbnails. Each one is a button that opens the `Lightbox` on that image; focus goes back to it on close.

```tsx
import { Gallery } from "vaiperui";

<Gallery
  aria-label="Trip photos"
  columns={3}
  items={[
    { src: "/photos/road.jpg", alt: "Mountain road", caption: "Road" },
    { src: "/photos/sky.jpg", alt: "Starry sky", thumbnail: "/photos/sky-sm.jpg" },
  ]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `{ src, alt, thumbnail?, caption? }[]` | — | Images; `thumbnail` is used in the grid |
| `columns` | `number` | `3` | Grid columns |
| `gap` | `number` | `8` | Space between thumbnails (px) |
| `aspectRatio` | `string` | `"4 / 3"` | CSS aspect ratio of a thumbnail |
| `lightbox` | `boolean` | `true` | Open the viewer on click |
| `onItemClick` | `(item, index) => void` | — | Called on every click |
| `openLabel` | `(item, index) => string` | `Open image N: alt` | Name of each thumbnail button |
| `lightboxProps` | `{ label, closeLabel, previousLabel, nextLabel, counterLabel }` | — | Viewer texts |
| `radius` | `none \| sm \| md \| lg \| full` | `md` | Thumbnail rounding |
| `animation` | `none \| smooth \| fast \| bounce` | `smooth` | Hover zoom transition |

## Lightbox

Full-screen image viewer: modal `role="dialog"` in a portal, focus trap, body scroll lock, Escape closes, ←/→ navigate (wrapping), counter and captions. Focus returns to the opener on close.

```tsx
import { Lightbox } from "vaiperui";

<Lightbox open={open} onOpenChange={setOpen} items={[{ src: "/1.jpg", alt: "One", caption: "First" }]} />
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `{ src, alt, caption? }[]` | — | Images |
| `open`, `defaultOpen` | `boolean` | `false` | Controlled / initial visibility |
| `onOpenChange` | `(open: boolean) => void` | — | Called when it asks to close |
| `index`, `defaultIndex` | `number` | `0` | Controlled / initial image |
| `onIndexChange` | `(index: number) => void` | — | Called when the image changes |
| `label` | `string` | `"Image viewer"` | Name of the dialog |
| `closeLabel`, `previousLabel`, `nextLabel` | `string` | `Close`, `Previous image`, `Next image` | Button names |
| `counterLabel` | `(index, total) => string` | `1 / 6` | Counter text |
| `onCloseAutoFocus` | `(event: Event) => void` | — | `preventDefault()` skips returning the focus |

## Carousel

Slides with arrows, dots and keyboard (←/→/Home/End). `region` with `aria-roledescription="carousel"`; slides are `group`s and off-screen ones are hidden from assistive tech. Autoplay pauses on hover/focus and is disabled with `prefers-reduced-motion`.

```tsx
import { Carousel } from "vaiperui";

<Carousel aria-label="Featured" loop autoplay={4000}>
  <img src="/1.jpg" alt="One" />
  <img src="/2.jpg" alt="Two" />
</Carousel>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | One slide per child |
| `aria-label` | `string` | — | Name of the carousel |
| `index`, `defaultIndex` | `number` | `0` | Controlled / initial first visible slide |
| `onIndexChange` | `(index: number) => void` | — | Position change |
| `slidesPerView` | `number` | `1` | Slides visible at once |
| `loop` | `boolean` | `false` | Wrap around the ends |
| `autoplay` | `boolean \| number` | `false` | Advance every N ms (`true` = 5000) |
| `showArrows`, `showDots` | `boolean` | `true` | Show arrows / dots |
| `previousLabel`, `nextLabel` | `string` | `Previous slide`, `Next slide` | Arrow names |
| `dotLabel` | `(index) => string` | `Go to slide N` | Dot names |
| `slideLabel` | `(index, total) => string` | `N of total` | Slide names |
| `variantColor`, `customColor`, `size`, `radius`, `animation` | see AudioPlayer | — | Style props |

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
