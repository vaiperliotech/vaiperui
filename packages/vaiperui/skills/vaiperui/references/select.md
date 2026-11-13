# Select
Accessible combobox with keyboard navigation, type-to-search and a detailed style with an icon/description per option.

Import: `import { Select } from "vaiperui"`
Types (same import): `SelectAnimation`, `SelectColors`, `SelectOption`, `SelectProps`, `SelectRadius`, `SelectSize`, `SelectVariant`

## Usage
Accessible combobox (`role="combobox"` + `listbox`) with keyboard navigation, typeahead and controlled or uncontrolled selection. Enable `searchable` to filter by text and `variant="detailed"` for options with `leading` and `description`.

```tsx
import { Select } from "vaiperui";

<Select
  label="Country"
  placeholder="Choose a country"
  searchable
  options={[
    { value: "br", label: "Brazil" },
    { value: "us", label: "United States" },
    { value: "pt", label: "Portugal" },
  ]}
/>
```

## Props
- `options` (SelectOption[]): List of options ({ value, label, disabled?, description?, leading? })
- `value / defaultValue` (string): Controlled / uncontrolled
- `onValueChange` ((value: string) => void): Fired when an option is selected
- `placeholder` (string, default "Select an option"): Text shown when nothing is selected
- `emptyMessage` (string, default "No options found"): Text when there are no options
- `noResultsMessage` ((query: string) => string, default (query) => `No results for "${query}"`): Text when a search has no matches; receives the typed query
- `loading` (boolean, default false): Shows a spinner row at the end of the list while options load
- `loadingMessage` (string, default "Loading..."): Text shown next to the spinner
- `onReachEnd` (() => void): Fires when the user scrolls near the end of the list (not while loading): fetch the next page and append it to options
- `hasMore` (boolean, default true): Set false after the last page. While true, onReachEnd also fires when the options don't fill the menu, until they do
- `onSearchChange` ((query: string) => void): Server-side search (needs searchable): called with the typed text and turns off the local filter, so options should already be the matches. Debounce it yourself. It is also called with "" when the search is cleared or the menu reopens with a leftover query, and the selected option keeps its label on the button even when a search removes it from options
- `searchable` (boolean, default false): Shows a search field inside the menu to filter by text
- `searchPlaceholder` (string, default "Search..."): Search field placeholder
- `clearSearchLabel` (string, default "Clear search"): Accessible name of the button that clears the search
- `searchStyle` ("boxed" | "full", default "boxed"): `boxed`: inset, rounded field. `full`: the field spans the whole top of the menu, with a divider
- `variant` (default | detailed, default default): default: compact single-line dropdown. detailed: larger trigger and options, with leading and description per option and a tint on the selected one
- `variantColor` (primary | success | warning | danger, default primary): Focus color, open border and option highlight
- `customColor` (valid CSS color | { light, dark }): Overrides variantColor: paints focus, border and highlight from a single color, or from a { light, dark } object
- `size` (sm | md | lg, default md): Height of the trigger and the options
- `radius` (none | sm | md | lg | full, default md): Rounding of the trigger and the menu
- `animation` (none | smooth | fast | bounce, default smooth): Menu transition
- `disabled` (boolean, default false): Disables the whole select
- `name` (string): Mirrors the value into an <input type="hidden"> for form submission
- `label / aria-label / id / className / style` (string / string / string / string / CSSProperties): Label above the trigger, accessible name when there is no label, and layout props
- `option.leading / option.description` (ReactNode / string): Visual slot (flag, icon, avatar) before the text, and a second line per option. The slot works in both variants; the description only renders with variant="detailed"

## Accessibility
- The trigger is a `<button role="combobox">` with `aria-haspopup="listbox"`, `aria-expanded` and `aria-controls` pointing at the list.
- The list is `role="listbox"` with `role="option"` items carrying `aria-selected`, plus `aria-disabled` on disabled options.
- Focus stays on the trigger and the highlighted option is exposed with `aria-activedescendant`; with `searchable`, focus moves to the search field, which holds `aria-activedescendant` instead.
- `label` is a `<label htmlFor>` for the trigger; `aria-label` is set on it too. The search field is named by `searchPlaceholder`.
- While `loading`, the listbox has `aria-busy`. Selecting an option or pressing Esc returns focus to the trigger.
- `disabled` uses the native attribute on the trigger. With `name`, a hidden input carries the value for forms.

Keyboard:
- `Enter / Space`: Opens the list; when open, selects the highlighted option.
- `ArrowDown / ArrowUp`: Opens the list; when open, moves the highlight (skipping disabled options).
- `Home / End`: Highlights the first / last option while open.
- `Esc`: Closes the list; in the search field, also returns focus to the trigger.
- `Tab`: Closes the list and lets focus move on.
- `Letters`: Without `searchable`, typeahead jumps to the option starting with the typed text.

Keep in mind:
- Without a visible `label`, pass `aria-label`; the component does not name the trigger on its own.
- The list renders in a portal on `document.body`, outside the field in DOM order, and does not trap focus.
- Single selection only, and there is no `aria-invalid`/error state: show validation messages yourself.

## Examples

### Colors
```tsx
<Select variantColor="primary" label="Country" options={options} />
<Select variantColor="success" label="Country" options={options} />
<Select variantColor="warning" label="Country" options={options} />
<Select variantColor="danger" label="Country" options={options} />
```

### Styles
`detailed` enlarges the trigger and the options, with a `leading` slot and a `description` per item.
```tsx
<Select variant="default" label="Country" options={options} />
<Select variant="detailed" label="Country" options={options} />
```

### Sizes
```tsx
<Select size="sm" label="Country" options={options} />
<Select size="md" label="Country" options={options} />
<Select size="lg" label="Country" options={options} />
```

### Radius
```tsx
<Select radius="none" label="Country" options={options} />
<Select radius="sm" label="Country" options={options} />
<Select radius="md" label="Country" options={options} />
<Select radius="lg" label="Country" options={options} />
<Select radius="full" label="Country" options={options} />
```

### Search
`searchable` adds a field to filter the options by text.
```tsx
<Select searchable label="Country" options={options} />
<Select searchable searchStyle="full" label="Country" options={options} />
<Select label="Country" options={options} />
```

### Async loading
`loading` shows a spinner row, `onReachEnd` asks for the next page when the user scrolls to the end (stop it with `hasMore={false}`), and `onSearchChange` moves the search to the server.
```tsx
// Infinite scroll
<Select
  options={options}
  loading={loading}
  hasMore={hasMore}
  onReachEnd={() => {
    setLoading(true);
    fetchNextPage().then(() => setLoading(false));
  }}
/>

// Server-side search (debounce it yourself)
<Select
  searchable
  options={options}
  loading={loading}
  onSearchChange={(query) => search(query)}
/>
```

### States
`disabled` blocks the whole select. An option with `disabled: true` appears blocked and cannot be chosen.
```tsx
<Select label="Country" options={options} disabled />

const options = [
  { value: "br", label: "Brazil" },
  { value: "pt", label: "Portugal", disabled: true },
]
```

### Custom color
`customColor` overrides `variantColor` and paints focus, border and highlight from a single color.
```tsx
<Select customColor="#ff6600" label="Country" options={options} />
<Select customColor="#22c55e" label="Country" options={options} />
<Select customColor="#a78bfa" label="Country" options={options} />
```
