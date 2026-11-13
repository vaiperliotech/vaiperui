import type {
    ControlAnimation,
    ControlColors,
    ControlRadius,
    ControlSize,
} from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";

export type AudioPlayerColors = ControlColors;
export type AudioPlayerSize = ControlSize;
export type AudioPlayerRadius = ControlRadius;
export type AudioPlayerAnimation = ControlAnimation;

/** Built-in texts, all overridable. */
export interface AudioPlayerLabels {
    play: string;
    pause: string;
    mute: string;
    unmute: string;
    seek: string;
    volume: string;
    /** Accessible name of the speed button. The current speed is appended. */
    speed: string;
    /** Between the current time and the duration in the waveform's spoken value, e.g. "2:21 of 6:12". */
    of: string;
}

export interface AudioPlayerProps {
    src: string;
    /**
     * `default`: seek bar, volume and mute. `waveform`: a compact card like a voice message, with a
     * clickable waveform to seek, "current / total" time and the speed button.
     */
    variant?: "default" | "waveform";
    /** `waveform` variant: number of bars. Defaults to 52. */
    bars?: number;
    /**
     * `waveform` variant: peaks from 0 to 1, resampled to `bars`. Skips the download and analysis of
     * the audio, which is worth it for long audio (the analysis decodes the whole file in memory) or
     * when the file is on another origin without CORS headers (the default pattern is shown then).
     */
    waveform?: number[];
    /** Accessible name of the player. Defaults to "Audio". */
    label?: string;
    preload?: "none" | "metadata" | "auto";
    loop?: boolean;
    autoPlay?: boolean;
    /** Playback speeds the speed button cycles through. Defaults to `[1, 1.5, 2]`; an empty list hides the button. */
    speeds?: number[];
    labels?: Partial<AudioPlayerLabels>;
    onPlay?: () => void;
    onPause?: () => void;
    onEnded?: () => void;
    onTimeUpdate?: (currentTime: number) => void;
    variantColor?: AudioPlayerColors;
    /** A CSS color, or a `{ light, dark }` pair. Overrides `variantColor` when set. */
    customColor?: CustomColor;
    size?: AudioPlayerSize;
    radius?: AudioPlayerRadius;
    animation?: AudioPlayerAnimation;
    className?: string;
}
