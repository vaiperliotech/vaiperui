# Menu
Dropdown menu button with arrow-key navigation, typeahead, icons, separators and danger items.

Import: `import { Button, Menu, MenuItem, MenuLabel, MenuSeparator } from "vaiperui"`
Types (same import): `MenuAlign`, `MenuAnimation`, `MenuItemProps`, `MenuProps`, `MenuRadius`, `MenuSide`, `MenuSize`

## Usage
The list is `role="menu"` with `menuitem` buttons. Arrows, Home and End move between items (disabled ones are skipped), typing a letter jumps to a match, Enter/Space selects, Escape closes and returns focus to the trigger. `onSelect` runs on click and keyboard; call `event.preventDefault()` there to keep the menu open. Compose it with `MenuItem`, `MenuLabel` and `MenuSeparator`.

```tsx
import { Button, Menu, MenuItem, MenuLabel, MenuSeparator } from "vaiperui";

<Menu trigger={<Button variant="outlined">Actions</Button>} label="Actions">
  <MenuLabel>Project</MenuLabel>
  <MenuItem icon="✎" onSelect={() => rename()}>Rename</MenuItem>
  <MenuItem disabled>Archive</MenuItem>
  <MenuSeparator />
  <MenuItem destructive icon="✕">Delete</MenuItem>
</Menu>
```

## Props
- `trigger` (ReactElement): Button that opens the menu (needs ref, focus and onClick)
- `label` (string): Accessible name of the menu
- `side / align` (top | right | bottom | left / start | center | end, default bottom / start): Side of the trigger and alignment
- `open / defaultOpen / onOpenChange` (boolean / boolean / (open) => void): Controlled or uncontrolled open state
- `size` (sm | md | lg, default md): Text size of the items
- `radius / animation` (none | sm | md | lg | full / none | smooth | fast | bounce, default lg / fast): Corner radius and enter transition speed
- `MenuItem` (onSelect, icon, destructive, disabled): Item; `onSelect(event: MouseEvent<HTMLButtonElement>)` runs on click/keyboard and the menu closes unless you call `event.preventDefault()`

## Accessibility
- The list is `role="menu"` named by `label`; each `MenuItem` is a `button` with `role="menuitem"`.
- The trigger gets `aria-haspopup="menu"`, `aria-expanded` and, while open, `aria-controls`.
- On open, focus moves to the first enabled item; disabled items are skipped by the arrow keys.
- Arrow navigation wraps around, and typing letters within 500ms jumps to the next item whose text starts with them.
- Selecting an item closes the menu and returns focus to the trigger, unless `onSelect` calls `event.preventDefault()`.
- `MenuSeparator` is `role="separator"`, `MenuLabel` is `role="presentation"` and item icons are `aria-hidden`.

Keyboard:
- `ArrowDown`: On the closed trigger, opens the menu; inside, moves to the next item
- `ArrowUp`: Moves to the previous item
- `Home / End`: Moves to the first / last item
- `A-Z`: Typeahead: jumps to the item whose text starts with the typed letters
- `Enter / Space`: Activates the focused item
- `Esc`: Closes the menu and focuses the trigger
- `Tab`: Closes the menu and lets focus move on

Keep in mind:
- Menu items must be plain actions; this is not a menu bar and there are no checkable (`menuitemcheckbox`/`menuitemradio`) or nested submenu items.
- Pass `label` so the menu has an accessible name; the trigger needs a visible text or its own `aria-label`.

## Examples

### Alignment
```tsx
<Menu align="start" trigger={<Button>start</Button>}>...</Menu>
<Menu align="center" trigger={<Button>center</Button>}>...</Menu>
<Menu align="end" trigger={<Button>end</Button>}>...</Menu>
```
