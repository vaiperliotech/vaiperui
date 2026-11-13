# VideoPlayer
Video player with custom controls, fullscreen, captions and keyboard shortcuts.

Import: `import { VideoPlayer } from "vaiperui"`
Types (same import): `VideoPlayerAnimation`, `VideoPlayerColors`, `VideoPlayerLabels`, `VideoPlayerProps`, `VideoPlayerRadius`, `VideoPlayerSize`

## Usage
Wraps a native `<video>`. The controls hide after `hideControlsAfter` ms of inactivity while playing and come back on mouse, touch or keyboard. Clicking the video toggles play. Shortcuts: Space/K, arrows (seek and volume), M, F (fullscreen). Put `<track kind="captions">` as children and a captions button appears. `variant="overlay"` adds a large play button in the center while paused and adapts to the player width (container query).

```tsx
import { VideoPlayer } from "vaiperui";

<VideoPlayer src="/video/flower.mp4" poster="/video/poster.jpg" label="Flower">
  <track kind="captions" src="/video/en.vtt" srcLang="en" label="English" />
</VideoPlayer>
```

## Props
- `variant` (default | overlay, default default): overlay: large play button in the center while paused; narrower than 560px the seek bar moves below the buttons and the volume slider hides
- `src` (string): Video URL
- `poster` (string): Image shown before playing
- `label` (string, default Video): Accessible name of the player
- `autoPlay / muted / loop` (boolean, default false): Native behaviors (autoPlay almost always needs muted)
- `preload` (none | metadata | auto, default metadata): How much the browser loads before play
- `hideControlsAfter` (number, default 2500): Idle ms before hiding the controls while playing; 0 keeps them visible
- `children` (ReactNode): `<track>` (captions) and extra `<source>` elements
- `labels` (Partial<{ play, pause, mute, unmute, seek, volume, fullscreen, exitFullscreen, captions }>, default English texts): Overrides the built-in texts (aria-labels of the buttons and sliders)
- `onPlay / onPause / onEnded` (() => void): Called by the matching media events
- `onTimeUpdate` ((currentTime: number) => void): Called while playing, with the position in seconds
- `variantColor` (primary | success | warning | danger, default primary): Accent color (play button, progress, dots)
- `customColor` (string | { light, dark }): Any CSS color (or a pair per theme). Overrides variantColor
- `size` (sm | md | lg, default md): Size of the controls and text
- `radius` (none | sm | md | lg | full, default lg): Corner rounding
- `animation` (none | smooth | fast | bounce, default smooth): Transition of the controls

## Accessibility
- The player is a focusable `role="group"` named by `label`; focus it (Tab or click on the video) and the shortcuts work.
- The play, mute and fullscreen buttons change their name with the state (`play`/`pause`, `mute`/`unmute`, `fullscreen`/`exitFullscreen` in `labels`).
- The seek bar and the volume are `Slider`s (`role="slider"`) named by `labels.seek` and `labels.volume`.
- The captions button only appears when the video has `<track>` children, and it exposes `aria-pressed` for on/off.
- The controls hide after `hideControlsAfter` of inactivity while playing, never while a control has focus; hidden controls are `inert`, so they leave the tab order, and any key, focus or mouse movement brings them back.
- With `variant="overlay"`, the big central play button is `aria-hidden` and `tabIndex={-1}`: it is a shortcut for mouse and touch, and keyboard and screen reader users use the play button of the bar.

Keyboard:
- `Space / K`: Play or pause (when focus is not on a button or slider)
- `ArrowLeft / ArrowRight`: Seek 5s back / forward
- `ArrowUp / ArrowDown`: Volume up / down by 10%
- `M`: Mute or unmute
- `F`: Toggle fullscreen

Keep in mind:
- Captions are not generated: pass `<track kind="captions">` as children, and provide a transcript or audio description when the content needs it.
- Avoid `autoPlay`; if you must, start `startMuted`, since browsers block autoplay with sound and it surprises users. Translate `labels` for the page language.

## Examples

### Variants
`overlay` adds a large play button in the center while paused. Narrower than 560px the seek bar moves below the buttons and the volume slider hides.
```tsx
<VideoPlayer src="/video/flower.mp4" />
<VideoPlayer src="/video/flower.mp4" variant="overlay" />
```

### Colors
```tsx
<VideoPlayer src="/video/flower.mp4" variantColor="primary" />
<VideoPlayer src="/video/flower.mp4" variantColor="success" />
<VideoPlayer src="/video/flower.mp4" variantColor="warning" />
<VideoPlayer src="/video/flower.mp4" variantColor="danger" />
```

### Sizes
```tsx
<VideoPlayer src="/video/flower.mp4" size="sm" />
<VideoPlayer src="/video/flower.mp4" size="md" />
<VideoPlayer src="/video/flower.mp4" size="lg" />
```

### Custom color
```tsx
<VideoPlayer src="/video/flower.mp4" customColor="#db2777" />
<VideoPlayer src="/video/flower.mp4" customColor={{ light: "#7c3aed", dark: "#c4b5fd" }} />
```
