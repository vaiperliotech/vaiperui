import * as React from "react";

export interface MediaState {
    playing: boolean;
    current: number;
    duration: number;
    volume: number;
    muted: boolean;
}

export interface MediaHandlers {
    onPlay?: React.ReactEventHandler<never>;
    onPause?: React.ReactEventHandler<never>;
    onEnded?: React.ReactEventHandler<never>;
    onTimeUpdate?: React.ReactEventHandler<never>;
}

/** Mirrors a native `<audio>`/`<video>` into React state and exposes the actions the custom controls need. */
export function useMediaPlayer<T extends HTMLMediaElement>(handlers: MediaHandlers) {
    const ref = React.useRef<T>(null);
    const [state, setState] = React.useState<MediaState>({
        playing: false,
        current: 0,
        duration: 0,
        volume: 1,
        muted: false,
    });

    const sync = React.useCallback(() => {
        const el = ref.current;
        if (!el) return;
        setState({
            playing: !el.paused,
            current: el.currentTime || 0,
            duration: Number.isFinite(el.duration) ? el.duration : 0,
            volume: el.volume,
            muted: el.muted,
        });
    }, []);

    React.useEffect(sync, [sync]);

    const toggle = React.useCallback(() => {
        const el = ref.current;
        if (!el) return;
        if (el.paused) Promise.resolve(el.play()).catch(() => {});
        else el.pause();
    }, []);
    const seek = React.useCallback(
        (time: number) => {
            const el = ref.current;
            if (!el) return;
            el.currentTime = Math.min(Math.max(0, time), el.duration || 0);
            sync();
        },
        [sync],
    );
    const seekBy = React.useCallback(
        (delta: number) => seek((ref.current?.currentTime ?? 0) + delta),
        [seek],
    );
    const setVolume = React.useCallback(
        (volume: number) => {
            const el = ref.current;
            if (!el) return;
            el.volume = Math.min(1, Math.max(0, volume));
            el.muted = el.volume === 0;
            sync();
        },
        [sync],
    );
    const toggleMute = React.useCallback(() => {
        const el = ref.current;
        if (!el) return;
        el.muted = !el.muted;
        sync();
    }, [sync]);

    const bind = {
        onPlay: (e: React.SyntheticEvent<T>) => {
            sync();
            handlers.onPlay?.(e as never);
        },
        onPause: (e: React.SyntheticEvent<T>) => {
            sync();
            handlers.onPause?.(e as never);
        },
        onEnded: (e: React.SyntheticEvent<T>) => {
            sync();
            handlers.onEnded?.(e as never);
        },
        onTimeUpdate: (e: React.SyntheticEvent<T>) => {
            sync();
            handlers.onTimeUpdate?.(e as never);
        },
        onDurationChange: sync,
        onLoadedMetadata: sync,
        onVolumeChange: sync,
        onSeeked: sync,
    };

    return { ref, state, bind, toggle, seek, seekBy, setVolume, toggleMute };
}

/** Handles the shortcuts shared by both players. Returns true when the key was consumed. */
export function handleMediaKey(
    event: React.KeyboardEvent,
    p: Pick<
        ReturnType<typeof useMediaPlayer>,
        "toggle" | "seekBy" | "setVolume" | "toggleMute" | "state"
    >,
) {
    const target = event.target as HTMLElement;
    // Sliders and buttons own their keys (arrows, Space).
    if (target.closest("[role=slider]")) return false;
    if (target.closest("button") && event.key === " ") return false;
    const key = event.key.toLowerCase();
    const volume = p.state.muted ? 0 : p.state.volume;
    if (key === " " || key === "k") p.toggle();
    else if (key === "arrowleft") p.seekBy(-5);
    else if (key === "arrowright") p.seekBy(5);
    else if (key === "arrowup") p.setVolume(volume + 0.1);
    else if (key === "arrowdown") p.setVolume(volume - 0.1);
    else if (key === "m") p.toggleMute();
    else return false;
    event.preventDefault();
    return true;
}
