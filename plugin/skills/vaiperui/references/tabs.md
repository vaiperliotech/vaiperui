# Tabs
Switch between distinct sections of content, following the WAI-ARIA tabs pattern.

Import: `import { Tab, TabList, TabPanel, Tabs } from "vaiperui"`
Types (same import): `TabListProps`, `TabPanelProps`, `TabProps`, `TabsAnimation`, `TabsColors`, `TabsProps`, `TabsSize`

## Usage
Compose `Tabs` with a `TabList` of `Tab`s and one `TabPanel` per tab; a tab and a panel are paired by `value`. Works uncontrolled (`defaultValue`) or controlled (`value` + `onValueChange`). Arrow keys, Home and End move between tabs and skip disabled ones; use `activation="manual"` to require Enter or Space.

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

## Props
- `value` (string): Active tab (controlled)
- `defaultValue` (string): Initial active tab (uncontrolled)
- `onValueChange` ((value: string) => void): Called when the active tab changes
- `orientation` (horizontal | vertical, default horizontal): Direction of the tab list and of the arrow keys
- `activation` (auto | manual, default auto): auto activates on focus; manual waits for Enter or Space
- `variantColor` (primary | success | warning | danger, default primary): Accent color of the active state and focus ring
- `customColor` (string | { light, dark }): Any CSS color (or a pair per theme). Overrides variantColor
- `size` (sm | md | lg, default md): Size of the control and its text
- `animation` (none | smooth | fast | bounce, default smooth): Transition between states
- `Tab: value, icon, disabled` (string, ReactNode, boolean): value pairs the tab with its panel; icon is shown before the label
- `TabPanel: value` (string): Panel shown while the tab with the same value is active

## Accessibility
- `TabList` has `role="tablist"` and `aria-orientation`; each `Tab` is a button with `role="tab"`; each `TabPanel` has `role="tabpanel"`.
- `aria-selected` marks the active tab; `aria-controls` and `aria-labelledby` pair each tab with its panel by `value`.
- Roving tabindex: only the active tab is in the Tab order (`tabIndex=0`); the others use `-1`.
- Arrows follow the orientation (Left/Right horizontal, Up/Down vertical) and wrap around; disabled tabs are skipped.
- With `activation="auto"` (default) focus selects the tab; with `"manual"` focus only moves and Enter or Space selects.
- Inactive panels get `hidden`; the panel is focusable (`tabIndex=0`) so keyboard users can reach its content.

Keyboard:
- `Tab`: Moves focus into the active tab, then into its panel.
- `Arrow keys`: Moves focus to the previous/next tab along the orientation.
- `Home / End`: Moves focus to the first/last enabled tab.
- `Enter / Space`: Selects the focused tab (only needed with `activation="manual"`).

Keep in mind:
- Pass `value` or `defaultValue`; with neither, no tab is selected and every tab has `tabIndex=-1`, so the list is unreachable by keyboard.
- Give the `TabList` an `aria-label` or `aria-labelledby`; the component does not add one.

## Examples

### Colors
```tsx
<Tabs defaultValue="a" variantColor="primary">
  <TabList aria-label="…">
    <Tab value="a">General</Tab>
    <Tab value="b">Account</Tab>
  </TabList>
</Tabs>

<Tabs defaultValue="a" variantColor="success">
  <TabList aria-label="…">
    <Tab value="a">General</Tab>
    <Tab value="b">Account</Tab>
  </TabList>
</Tabs>

<Tabs defaultValue="a" variantColor="warning">
  <TabList aria-label="…">
    <Tab value="a">General</Tab>
    <Tab value="b">Account</Tab>
  </TabList>
</Tabs>

<Tabs defaultValue="a" variantColor="danger">
  <TabList aria-label="…">
    <Tab value="a">General</Tab>
    <Tab value="b">Account</Tab>
  </TabList>
</Tabs>
```

### Sizes
```tsx
<Tabs defaultValue="a" size="sm">
  <TabList aria-label="…">
    <Tab value="a">General</Tab>
    <Tab value="b">Account</Tab>
  </TabList>
</Tabs>

<Tabs defaultValue="a" size="md">
  <TabList aria-label="…">
    <Tab value="a">General</Tab>
    <Tab value="b">Account</Tab>
  </TabList>
</Tabs>

<Tabs defaultValue="a" size="lg">
  <TabList aria-label="…">
    <Tab value="a">General</Tab>
    <Tab value="b">Account</Tab>
  </TabList>
</Tabs>
```

### Custom color
```tsx
<Tabs defaultValue="a" customColor="#f97316">
  <TabList aria-label="…">
    <Tab value="a">General</Tab>
    <Tab value="b">Account</Tab>
  </TabList>
</Tabs>

<Tabs defaultValue="a" customColor="#8b5cf6">
  <TabList aria-label="…">
    <Tab value="a">General</Tab>
    <Tab value="b">Account</Tab>
  </TabList>
</Tabs>
```

### Orientation and activation
```tsx
<Tabs defaultValue="a" orientation="vertical">…</Tabs>

<Tabs defaultValue="a" activation="manual">…</Tabs>
```
