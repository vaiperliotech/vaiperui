# Upload
Area to pick files by clicking or dragging them in, with an accept filter.

Import: `import { Upload } from "vaiperui"`
Types (same import): `UploadAnimation`, `UploadColors`, `UploadProps`, `UploadRadius`, `UploadSize`

## Usage
The Upload only **captures** files: listing them, validating the size and sending them to a server are up to you. `onFilesChange` receives plain `File[]` with the files just chosen, not the sum with earlier ones, so merge them into your own state to accumulate. It is a real `<input type="file">` hidden only visually (Tab to focus, Enter or Space to open), and `accept` also filters dragged files, which the browser does not do by itself. Without `multiple`, only the first file of a selection is kept. Always validate again on the server.

```tsx
import { Upload } from "vaiperui";

const [files, setFiles] = useState<File[]>([]);

<Upload
  multiple
  accept=".pdf,image/*"
  label="Attachments"
  description="PDF or image, up to 5 MB"
  onFilesChange={(chosen) => setFiles((current) => [...current, ...chosen])}
/>
```

## Props
- `onFilesChange` ((files: File[]) => void, default required): Called with the files just chosen (not the sum with earlier ones)
- `title` (ReactNode, default "Drag files here or click to choose"): Main text of the area
- `description` (ReactNode): Support text, e.g. accepted formats and size
- `accept` (string): Accepted types: .pdf, image/*, image/png, comma-separated. Also filters dragged files; files that do not match are ignored silently (no callback), so validate and inform the user yourself
- `multiple` (boolean, default false): Accepts several files. Without it, only the first of a selection is kept
- `label / helperText` (string): Label above the area and help text below
- `errorMessage` (string): Error text; its presence alone forces the error state (red border, aria-invalid)
- `disabled` (boolean, default false): Blocks click and drag
- `name` (string): Field name for a native <form> (dropped files are mirrored into the input)
- `variantColor` (primary | success | warning | danger, default primary): Color of the checked state and focus ring
- `customColor` (string | { light, dark }): Any CSS color (or a pair per theme). Overrides variantColor
- `size` (sm | md | lg, default md): Size of the control and its text
- `animation` (none | smooth | fast | bounce, default smooth): Transition when it toggles
- `radius` (none | sm | md | lg | full, default lg): Corner rounding of the area
- `(native)` (InputHTMLAttributes<HTMLInputElement>): checked, defaultChecked, onChange, name, value, disabled, required, aria-*, className, ref, etc.

## Accessibility
- A native `<input type="file">` (visually hidden) is the real control; the dashed area is a `<label htmlFor>` for it.
- The input is focusable and the focus ring shows on the drop area (`peer-focus-visible`), so keyboard focus is visible.
- The accessible name is the `title` text inside the area, plus `label` when you pass one (the input has both labels).
- `errorMessage` sets `aria-invalid="true"`; `aria-describedby` points to the error, or to `helperText` when there is no error.
- Drag and drop is an extra path: keyboard and screen reader users open the system picker through the native input. The upload icon is `aria-hidden`.

Keyboard:
- `Tab`: Focuses the file input.
- `Enter / Space`: Opens the system file picker (native input behavior).

Keep in mind:
- Files rejected by `accept` are dropped silently, with no message or live region; validate and tell the user in `errorMessage`.
- Selected files are not listed by the component; render the list yourself and make it readable by assistive tech.

## Examples

### Sizes
```tsx
<Upload size="sm" onFilesChange={...} />
<Upload size="md" onFilesChange={...} />
<Upload size="lg" onFilesChange={...} />
```

### Colors
The color shows on hover, while dragging and on keyboard focus.
```tsx
<Upload variantColor="primary" onFilesChange={...} />
<Upload variantColor="success" onFilesChange={...} />
<Upload variantColor="warning" onFilesChange={...} />
<Upload variantColor="danger" onFilesChange={...} />
```

### Accepted types
```tsx
<Upload accept=".pdf" description="PDF" />
<Upload accept="image/*" multiple description="Images" />
```

### States
```tsx
<Upload label="..." helperText="..." />
<Upload label="..." errorMessage="..." />
<Upload label="..." disabled />
```

### Custom color
```tsx
<Upload customColor="#ff6600" onFilesChange={...} />
```
