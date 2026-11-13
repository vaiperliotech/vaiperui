import * as React from "react";

import { cn } from "../../lib/cn";
import { controlAnimations, controlRadius } from "../../lib/controlStyles";
import { Slider } from "../Slider/Slider";
import {
    accent,
    formatTime,
    MediaButton,
    MutedIcon,
    PauseIcon,
    PlayIcon,
    textSizes,
    VolumeIcon,
} from "../shared/mediaControls";
import { handleMediaKey, useMediaPlayer } from "../shared/useMediaPlayer";
import type { AudioPlayerLabels, AudioPlayerProps } from "./types";
import { Waveform } from "./Waveform";

const defaultLabels: AudioPlayerLabels = {
    play: "Play",
    pause: "Pause",
    mute: "Mute",
    unmute: "Unmute",
    seek: "Seek",
    volume: "Volume",
    speed: "Playback speed",
    of: "of",
};

export function AudioPlayer({
    src,
    variant = "default",
    bars = 52,
    waveform,
    label = "Audio",
    preload = "metadata",
    loop,
    autoPlay,
    speeds = [1, 1.5, 2],
    labels,
    onPlay,
    onPause,
    onEnded,
    onTimeUpdate,
    variantColor = "primary",
    customColor,
    size = "md",
    radius = "lg",
    animation = "smooth",
    className,
}: AudioPlayerProps) {
    const text = { ...defaultLabels, ...labels };
    const player = useMediaPlayer<HTMLAudioElement>({
        onPlay: () => onPlay?.(),
        onPause: () => onPause?.(),
        onEnded: () => onEnded?.(),
        onTimeUpdate: (e) =>
            onTimeUpdate?.((e.currentTarget as unknown as HTMLAudioElement).currentTime),
    });
    const { playing, current, duration, volume, muted } = player.state;
    const [speedIndex, setSpeedIndex] = React.useState(0);
    const speed = speeds[speedIndex % Math.max(1, speeds.length)] ?? 1;
    const { className: color, style } = accent(variantColor, customColor);

    React.useEffect(() => {
        if (player.ref.current) player.ref.current.playbackRate = speed;
    }, [speed, player.ref]);

    const speedButton =
        speeds.length > 0 ? (
            <button
                type="button"
                aria-label={`${text.speed}: ${speed}x`}
                onClick={() => setSpeedIndex((i) => (i + 1) % speeds.length)}
                className={cn(
                    "shrink-0 rounded-full px-2 py-1 font-medium tabular-nums hover:bg-[var(--vpd-surface-hover)] focus:outline-none focus-visible:ring-4 focus-visible:ring-current/30",
                    controlAnimations[animation],
                )}
            >
                {speed}x
            </button>
        ) : null;

    if (variant === "waveform") {
        return (
            // biome-ignore lint/a11y/useSemanticElements: a group of controls, <fieldset> would add a border and legend
            <div
                role="group"
                aria-label={label}
                className={cn(
                    "flex w-full max-w-[480px] items-center gap-3 border border-[var(--vpd-border)] bg-[var(--vpd-surface)] p-3 text-[var(--vpd-text)]",
                    controlRadius[radius],
                    textSizes[size],
                    color,
                    className,
                )}
                style={style}
                onKeyDown={(event) => handleMediaKey(event, player)}
            >
                <audio
                    ref={player.ref}
                    src={src}
                    preload={preload}
                    loop={loop}
                    autoPlay={autoPlay}
                    {...player.bind}
                />
                <MediaButton
                    primary
                    size={size}
                    aria-label={playing ? text.pause : text.play}
                    onClick={player.toggle}
                >
                    {playing ? <PauseIcon /> : <PlayIcon />}
                </MediaButton>
                <Waveform
                    src={src}
                    bars={bars}
                    waveform={waveform}
                    label={text.seek}
                    valueText={`${formatTime(current)} ${text.of} ${formatTime(duration)}`}
                    current={current}
                    duration={duration}
                    onSeek={player.seek}
                />
                <span className="shrink-0 tabular-nums text-[var(--vpd-text-secondary)]">
                    {formatTime(current)} / {formatTime(duration)}
                </span>
                {speedButton}
            </div>
        );
    }

    return (
        // biome-ignore lint/a11y/useSemanticElements: a group of controls, <fieldset> would add a border and legend
        <div
            role="group"
            aria-label={label}
            className={cn(
                "flex w-full max-w-md items-center gap-2 border border-[var(--vpd-border)] bg-[var(--vpd-surface)] p-2 text-[var(--vpd-text)]",
                controlRadius[radius],
                textSizes[size],
                color,
                className,
            )}
            style={style}
            onKeyDown={(event) => handleMediaKey(event, player)}
        >
            <audio
                ref={player.ref}
                src={src}
                preload={preload}
                loop={loop}
                autoPlay={autoPlay}
                {...player.bind}
            />
            <MediaButton
                primary
                size={size}
                aria-label={playing ? text.pause : text.play}
                onClick={player.toggle}
            >
                {playing ? <PauseIcon /> : <PlayIcon />}
            </MediaButton>
            <span className="w-10 shrink-0 text-right tabular-nums text-[var(--vpd-text-secondary)]">
                {formatTime(current)}
            </span>
            <Slider
                aria-label={text.seek}
                className="min-w-16 flex-1"
                min={0}
                max={duration || 1}
                step={1}
                disabled={!duration}
                size="sm"
                animation={animation}
                variantColor={variantColor}
                customColor={customColor}
                value={[Math.min(current, duration || 1)]}
                onValueChange={([v]) => player.seek(v ?? 0)}
            />
            <span className="w-10 shrink-0 tabular-nums text-[var(--vpd-text-secondary)]">
                {formatTime(duration)}
            </span>
            {speedButton}
            <MediaButton
                size={size}
                aria-label={muted || volume === 0 ? text.unmute : text.mute}
                onClick={player.toggleMute}
            >
                {muted || volume === 0 ? <MutedIcon /> : <VolumeIcon />}
            </MediaButton>
            <Slider
                aria-label={text.volume}
                className="hidden w-16 shrink-0 sm:flex"
                min={0}
                max={1}
                step={0.05}
                size="sm"
                animation={animation}
                variantColor={variantColor}
                customColor={customColor}
                value={[muted ? 0 : volume]}
                onValueChange={([v]) => player.setVolume(v ?? 0)}
            />
        </div>
    );
}
