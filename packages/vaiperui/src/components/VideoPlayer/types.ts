import type * as React from "react";

import type {
    ControlAnimation,
    ControlColors,
    ControlRadius,
    ControlSize,
} from "../../lib/controlStyles";
import type { CustomColor } from "../../lib/customColorVars";

export type VideoPlayerColors = ControlColors;
export type VideoPlayerSize = ControlSize;
export type VideoPlayerRadius = ControlRadius;
export type VideoPlayerAnimation = ControlAnimation;

/** Built-in texts, all overridable. */
export interface VideoPlayerLabels {
    play: string;
    pause: string;
    mute: string;
    unmute: string;
    seek: string;
    volume: string;
    fullscreen: string;
    exitFullscreen: string;
    captions: string;
}

export interface VideoPlayerProps {
    src: string;
    /**
     * `default`: controls bar over the video. `overlay`: also a large play button in the center while
     * paused (with a light veil), a seek bar that sits above the buttons and moves below them when the
     * player is narrower than 560px, where the volume slider is hidden too (the mute button stays).
     */
    variant?: "default" | "overlay";
    /** Image shown before playback starts. */
    poster?: string;
    /** Accessible name of the player. Defaults to "Video". */
    label?: string;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    preload?: "none" | "metadata" | "auto";
    /** Milliseconds of inactivity before the controls hide while playing. Defaults to 2500; `0` keeps them visible. */
    hideControlsAfter?: number;
    /** `<track>` (captions) and extra `<source>` elements. A captions button appears when there is a track. */
    children?: React.ReactNode;
    labels?: Partial<VideoPlayerLabels>;
    onPlay?: () => void;
    onPause?: () => void;
    onEnded?: () => void;
    onTimeUpdate?: (currentTime: number) => void;
    variantColor?: VideoPlayerColors;
    /** A CSS color, or a `{ light, dark }` pair. Overrides `variantColor` when set. */
    customColor?: CustomColor;
    size?: VideoPlayerSize;
    radius?: VideoPlayerRadius;
    animation?: VideoPlayerAnimation;
    className?: string;
}
