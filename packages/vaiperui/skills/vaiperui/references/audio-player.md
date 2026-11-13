# AudioPlayer
Accessible audio player with play/pause, seek bar, time, speed and volume.

Import: `import { AudioPlayer } from "vaiperui"`
Types (same import): `AudioPlayerAnimation`, `AudioPlayerColors`, `AudioPlayerLabels`, `AudioPlayerProps`, `AudioPlayerRadius`, `AudioPlayerSize`

## Usage
Wraps a native `<audio>` with custom controls. The seek bar and the volume use the library's `Slider`. Keyboard on the player: Space or K play/pause, arrows seek 5s and change the volume, M mutes. Every built-in text is overridable through `labels`. With `variant="waveform"` it becomes a compact voice-message card: the file is downloaded and decoded in memory to draw the bars from its loudness (pulsing meanwhile; a default pattern if it fails, e.g. no CORS on another origin), and the waveform is a slider (click or drag to seek, arrows move 5s). For long audio, pass the peaks in `waveform`.

```tsx
import { AudioPlayer } from "vaiperui";

<AudioPlayer
  src="/audio/roar.mp3"
  label="Voice note"
  onEnded={() => console.log("done")}
/>
```

## Props
- `variant` (default | waveform, default default): default: seek bar, volume and mute. waveform: a compact card like a voice message, with a clickable waveform, current / total time and the speed button
- `bars` (number, default 52): waveform variant: number of bars
- `waveform` (number[]): waveform variant: peaks from 0 to 1, resampled to bars. Skips the download and analysis of the audio
- `src` (string): Audio URL
- `label` (string, default Audio): Accessible name of the player
- `preload` (none | metadata | auto, default metadata): How much the browser loads before play
- `loop / autoPlay` (boolean, default false): Native behaviors
- `speeds` (number[], default [1, 1.5, 2]): Speeds the speed button cycles through; an empty list hides it
- `labels` (Partial<{ play, pause, mute, unmute, seek, volume, speed }>, default English texts): Overrides the built-in texts (aria-labels of the buttons and sliders)
- `onPlay / onPause / onEnded` (() => void): Called by the matching media events
- `onTimeUpdate` ((currentTime: number) => void): Called while playing, with the position in seconds
- `variantColor` (primary | success | warning | danger, default primary): Accent color (play button, progress, dots)
- `customColor` (string | { light, dark }): Any CSS color (or a pair per theme). Overrides variantColor
- `size` (sm | md | lg, default md): Size of the controls and text
- `radius` (none | sm | md | lg | full, default lg): Corner rounding
- `animation` (none | smooth | fast | bounce, default smooth): Transition of the controls

## Accessibility
- The player is a `role="group"` named by `label`, so screen readers announce it as one control.
- The play button changes its name between `labels.play` and `labels.pause`; the mute button between `labels.mute` and `labels.unmute`.
- The seek bar and the volume are `Slider`s (`role="slider"`) named by `labels.seek` and `labels.volume`; the speed button announces the current rate (e.g. `Playback speed: 1.5x`).
- With `variant="waveform"`, the waveform is a `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and an `aria-valuetext` like `0:12 of 0:40`; it is focusable only once the duration is known and `aria-disabled` before that.
- The waveform bars are `aria-hidden`, so only the slider is announced.
- While the waveform is being analyzed the bars pulse, and the pulse is turned off under `prefers-reduced-motion`; if the analysis fails (e.g. no CORS) a default pattern is drawn and the player keeps working.

Keyboard:
- `Space / K`: Play or pause (when focus is not on a button or slider)
- `ArrowLeft / ArrowRight`: Seek 5s back / forward
- `ArrowUp / ArrowDown`: Volume up / down by 10%
- `M`: Mute or unmute
- `Home / End`: On the waveform slider: jump to the start / end (arrows move 5s there)
- `Tab`: Moves between the buttons and sliders

Keep in mind:
- There are no captions or transcript: provide a text alternative for spoken content (e.g. a transcript next to the player).
- Pass a meaningful `label` and translate `labels` for the page language; the defaults are in English. `autoPlay` starts sound without a user action, avoid it.

## Examples

### Variants
`waveform` is a compact voice-message card: a clickable waveform, current / total time and the speed button.
```tsx
<AudioPlayer src="/audio/roar.mp3" />
<AudioPlayer src="/audio/roar.mp3" variant="waveform" />
<AudioPlayer src="/audio/roar.mp3" variant="waveform" speeds={[0.75, 1, 1.25, 1.5]} />
// peaks from 0 to 1, computed on the server: skips the download and analysis
<AudioPlayer src="/audio/roar.mp3" variant="waveform" waveform={[0.1, 0.4, 0.9, 0.6, 0.2]} />
```

### Colors
```tsx
<AudioPlayer src="/audio/roar.mp3" variantColor="primary" />
<AudioPlayer src="/audio/roar.mp3" variantColor="success" />
<AudioPlayer src="/audio/roar.mp3" variantColor="warning" />
<AudioPlayer src="/audio/roar.mp3" variantColor="danger" />
```

### Sizes
```tsx
<AudioPlayer src="/audio/roar.mp3" size="sm" />
<AudioPlayer src="/audio/roar.mp3" size="md" />
<AudioPlayer src="/audio/roar.mp3" size="lg" />
```

### Custom color
```tsx
<AudioPlayer src="/audio/roar.mp3" customColor="#db2777" />
<AudioPlayer src="/audio/roar.mp3" customColor={{ light: "#7c3aed", dark: "#c4b5fd" }} />
```
