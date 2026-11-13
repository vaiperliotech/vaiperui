import * as React from "react";

import { cn } from "../../lib/cn";
import { controlAnimations, controlRadius } from "../../lib/controlStyles";
import { Slider } from "../Slider/Slider";
import {
    accent,
    CaptionsIcon,
    ExitFullscreenIcon,
    FullscreenIcon,
    formatTime,
    MediaButton,
    MutedIcon,
    PauseIcon,
    PlayIcon,
    textSizes,
    VolumeIcon,
} from "../shared/mediaControls";
import { handleMediaKey, useMediaPlayer } from "../shared/useMediaPlayer";
import type { VideoPlayerLabels, VideoPlayerProps } from "./types";

const defaultLabels: VideoPlayerLabels = {
    play: "Play",
    pause: "Pause",
    mute: "Mute",
    unmute: "Unmute",
    seek: "Seek",
    volume: "Volume",
    fullscreen: "Fullscreen",
    exitFullscreen: "Exit fullscreen",
    captions: "Captions",
};

export function VideoPlayer({
    src,
    variant = "default",
    poster,
    label = "Video",
    autoPlay,
    muted: startMuted,
    loop,
    preload = "metadata",
    hideControlsAfter = 2500,
    children,
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
}: VideoPlayerProps) {
    const text = { ...defaultLabels, ...labels };
    const player = useMediaPlayer<HTMLVideoElement>({
        onPlay: () => onPlay?.(),
        onPause: () => onPause?.(),
        onEnded: () => onEnded?.(),
        onTimeUpdate: (e) =>
            onTimeUpdate?.((e.currentTarget as unknown as HTMLVideoElement).currentTime),
    });
    const { playing, current, duration, volume, muted } = player.state;
    const rootRef = React.useRef<HTMLDivElement>(null);
    const [visible, setVisible] = React.useState(true);
    const [fullscreen, setFullscreen] = React.useState(false);
    const [hasTracks, setHasTracks] = React.useState(false);
    const [captionsOn, setCaptionsOn] = React.useState(false);
    const { className: color, style } = accent(variantColor, customColor);

    React.useEffect(() => {
        const tracks = player.ref.current?.textTracks;
        setHasTracks(!!tracks && tracks.length > 0);
        setCaptionsOn(!!tracks && Array.from(tracks).some((t) => t.mode === "showing"));
    }, [player.ref]);

    React.useEffect(() => {
        const onChange = () => setFullscreen(document.fullscreenElement === rootRef.current);
        document.addEventListener("fullscreenchange", onChange);
        return () => document.removeEventListener("fullscreenchange", onChange);
    }, []);

    // The controls show on any activity and hide after a pause of activity while playing,
    // unless a control has focus.
    const [activity, setActivity] = React.useState(0);
    // biome-ignore lint/correctness/useExhaustiveDependencies: `activity` restarts the idle timer on every interaction
    React.useEffect(() => {
        setVisible(true);
        if (!playing || !hideControlsAfter) return;
        const id = setTimeout(() => {
            if (!rootRef.current?.contains(document.activeElement)) setVisible(false);
        }, hideControlsAfter);
        return () => clearTimeout(id);
    }, [playing, hideControlsAfter, activity]);
    const poke = () => setActivity((n) => n + 1);

    function toggleFullscreen() {
        if (document.fullscreenElement) void document.exitFullscreen?.();
        else void rootRef.current?.requestFullscreen?.();
    }
    function toggleCaptions() {
        const tracks = player.ref.current?.textTracks;
        if (!tracks) return;
        for (const track of Array.from(tracks)) track.mode = captionsOn ? "hidden" : "showing";
        setCaptionsOn(!captionsOn);
    }

    return (
        // biome-ignore lint/a11y/useSemanticElements: a group of controls over a video, <fieldset> does not fit
        <div
            ref={rootRef}
            role="group"
            aria-label={label}
            // biome-ignore lint/a11y/noNoninteractiveTabindex: focusable so the player shortcuts work after a click on the video
            tabIndex={0}
            className={cn(
                "@container relative w-full overflow-hidden bg-black text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--vpd-border-strong)]",
                controlRadius[radius],
                color,
                // Overlay: the cursor goes away with the controls while playing.
                variant === "overlay" && playing && !visible && "cursor-none",
                className,
            )}
            style={style}
            onMouseMove={poke}
            onTouchStart={poke}
            onFocus={poke}
            onKeyDown={(event) => {
                poke();
                if (
                    event.key.toLowerCase() === "f" &&
                    !(event.target as HTMLElement).closest("input")
                ) {
                    event.preventDefault();
                    toggleFullscreen();
                } else handleMediaKey(event, player);
            }}
        >
            <video
                ref={player.ref}
                src={src}
                poster={poster}
                autoPlay={autoPlay}
                muted={startMuted}
                loop={loop}
                preload={preload}
                playsInline
                className={cn("aspect-video w-full", fullscreen && "h-full")}
                onClick={player.toggle}
                {...player.bind}
            >
                {children}
            </video>
            {variant === "overlay" && !playing ? (
                <>
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-black/30"
                    />
                    {/* A shortcut for mouse and touch: the keyboard uses the play button of the bar. */}
                    <button
                        type="button"
                        tabIndex={-1}
                        aria-hidden="true"
                        onClick={player.toggle}
                        className={cn(
                            "absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white pl-1 shadow-lg hover:scale-105 [&_svg]:h-8 [&_svg]:w-8",
                            controlAnimations[animation],
                        )}
                    >
                        <PlayIcon />
                    </button>
                </>
            ) : null}
            <div
                inert={!visible}
                className={cn(
                    "absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/80 to-transparent px-3 pt-8 pb-2",
                    // Narrow player: the seek bar moves below the buttons.
                    variant === "overlay" && "@max-[560px]:flex-col-reverse",
                    textSizes[size],
                    controlAnimations[animation],
                    visible ? "opacity-100" : "pointer-events-none opacity-0",
                )}
            >
                <Slider
                    aria-label={text.seek}
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
                <div className="flex items-center gap-1 [&_button]:text-white [&_button:hover]:bg-white/20">
                    <MediaButton
                        size={size}
                        aria-label={playing ? text.pause : text.play}
                        onClick={player.toggle}
                    >
                        {playing ? <PauseIcon /> : <PlayIcon />}
                    </MediaButton>
                    <MediaButton
                        size={size}
                        aria-label={muted || volume === 0 ? text.unmute : text.mute}
                        onClick={player.toggleMute}
                    >
                        {muted || volume === 0 ? <MutedIcon /> : <VolumeIcon />}
                    </MediaButton>
                    <Slider
                        aria-label={text.volume}
                        className={cn(
                            "w-20 shrink-0",
                            variant === "overlay" ? "flex @max-[560px]:hidden" : "hidden sm:flex",
                        )}
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
                    <span className="ml-2 tabular-nums">
                        {formatTime(current)} / {formatTime(duration)}
                    </span>
                    <span className="flex-1" />
                    {hasTracks ? (
                        <MediaButton
                            size={size}
                            aria-label={text.captions}
                            aria-pressed={captionsOn}
                            className={captionsOn ? "bg-white/25" : undefined}
                            onClick={toggleCaptions}
                        >
                            <CaptionsIcon />
                        </MediaButton>
                    ) : null}
                    <MediaButton
                        size={size}
                        aria-label={fullscreen ? text.exitFullscreen : text.fullscreen}
                        onClick={toggleFullscreen}
                    >
                        {fullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
                    </MediaButton>
                </div>
            </div>
        </div>
    );
}
