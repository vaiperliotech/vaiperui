# Stepper
Shows progress through a sequential flow such as a checkout or onboarding.

Import: `import { Step, Stepper } from "vaiperui"`
Types (same import): `StepProps`, `StepperAnimation`, `StepperColors`, `StepperProps`, `StepperSize`

## Usage
Put `Step`s inside a `Stepper` and set `current` (zero-based): earlier steps are completed (check), the current one is highlighted with `aria-current="step"`, later ones are upcoming. It only displays progress; your screen handles moving and validating. Pass `onStepClick` to turn completed steps into buttons that go back. Use `orientation="vertical"` with a `description` on each step.

```tsx
import { Step, Stepper } from "vaiperui";

<Stepper current={1} aria-label="Signup steps">
  <Step>Account</Step>
  <Step>Address</Step>
  <Step>Payment</Step>
</Stepper>
```

## Props
- `current` (number, default required): Zero-based index of the active step
- `orientation` (horizontal | vertical, default horizontal): Layout of the steps
- `onStepClick` ((index: number) => void): Makes completed steps buttons that call this with their index
- `completedLabel` (string, default Completed): Screen-reader text added to completed steps
- `variantColor` (primary | success | warning | danger, default primary): Accent color of the active state and focus ring
- `customColor` (string | { light, dark }): Any CSS color (or a pair per theme). Overrides variantColor
- `size` (sm | md | lg, default md): Size of the control and its text
- `animation` (none | smooth | fast | bounce, default smooth): Transition between states
- `Step: children, description` (ReactNode, ReactNode): The step's label and an optional secondary line

## Accessibility
- Renders an ordered list (`<ol>`) with one `<li>` per step, in reading order.
- The current step's `<li>` has `aria-current="step"`.
- Completed steps include visually hidden text from `completedLabel` (default "Completed").
- The number, check icon and connector lines are `aria-hidden`.
- With `onStepClick`, only completed steps become native buttons; current and upcoming steps are plain text.

Keyboard:
- `Tab`: Moves through completed steps when `onStepClick` is set.
- `Enter / Space`: Activates the focused completed step.

Keep in mind:
- Translate `completedLabel`; its default is in English.
- It is a progress indicator, not a navigation widget: it adds no `aria-label` to the list and does not let users jump to future steps.

## Examples

### Colors
```tsx
<Stepper current={1} variantColor="primary">
  <Step>Account</Step>
  <Step>Address</Step>
  <Step>Payment</Step>
</Stepper>

<Stepper current={1} variantColor="success">
  <Step>Account</Step>
  <Step>Address</Step>
  <Step>Payment</Step>
</Stepper>

<Stepper current={1} variantColor="warning">
  <Step>Account</Step>
  <Step>Address</Step>
  <Step>Payment</Step>
</Stepper>

<Stepper current={1} variantColor="danger">
  <Step>Account</Step>
  <Step>Address</Step>
  <Step>Payment</Step>
</Stepper>
```

### Sizes
```tsx
<Stepper current={1} size="sm">
  <Step>Account</Step>
  <Step>Address</Step>
  <Step>Payment</Step>
</Stepper>

<Stepper current={1} size="md">
  <Step>Account</Step>
  <Step>Address</Step>
  <Step>Payment</Step>
</Stepper>

<Stepper current={1} size="lg">
  <Step>Account</Step>
  <Step>Address</Step>
  <Step>Payment</Step>
</Stepper>
```

### Custom color
```tsx
<Stepper current={1} customColor="#f97316">
  <Step>Account</Step>
  <Step>Address</Step>
  <Step>Payment</Step>
</Stepper>

<Stepper current={1} customColor="#8b5cf6">
  <Step>Account</Step>
  <Step>Address</Step>
  <Step>Payment</Step>
</Stepper>
```

### Vertical
```tsx
<Stepper current={1} orientation="vertical">
  <Step description="…">Account</Step>
  …
</Stepper>
```
