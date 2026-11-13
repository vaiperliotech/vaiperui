import * as React from "react";

import { cn } from "../../lib/cn";

const MIN_HEIGHT = 6;
const MAX_HEIGHT = 34;
const SEEK_STEP = 5;

/** A fixed, natural-looking pattern shown while the audio is analyzed and when it can't be. */
function defaultPeaks(bars: number): number[] {
    return Array.from(
        { length: bars },
        (_, i) => 0.25 + 0.5 * Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.23)),
    );
}

/** Resamples any list of peaks (0 to 1) to exactly `bars` values. */
function resample(peaks: number[], bars: number): number[] {
    if (peaks.length === 0) return defaultPeaks(bars);
    return Array.from(
        { length: bars },
        (_, i) => peaks[Math.floor((i * peaks.length) / bars)] ?? 0,
    );
}

// The same audio in several players is downloaded and decoded only once.
const analysis = new Map<string, Promise<number[]>>();

/** Downloads and decodes the file, then takes the RMS volume of each slice (like messaging apps). */
function analyze(src: string, bars: number): Promise<number[]> {
    const key = `${src}|${bars}`;
    let pending = analysis.get(key);
    if (!pending) {
        pending = (async () => {
            const response = await fetch(src);
            const data = await response.arrayBuffer();
            // 8 kHz is enough for a volume envelope and keeps the decoded buffer small (~1 MB per minute).
            const context = new OfflineAudioContext(1, 1, 8000);
            const samples = (await context.decodeAudioData(data)).getChannelData(0);
            const size = Math.max(1, Math.floor(samples.length / bars));
            const rms = Array.from({ length: bars }, (_, i) => {
                let sum = 0;
                for (let j = i * size; j < Math.min((i + 1) * size, samples.length); j++) {
                    sum += (samples[j] ?? 0) ** 2;
                }
                return Math.sqrt(sum / size);
            });
            const loudest = Math.max(...rms, Number.EPSILON);
            return rms.map((value) => value / loudest);
        })();
        analysis.set(key, pending);
        // A failed analysis must be retried next time, not cached.
        pending.catch(() => analysis.delete(key));
    }
    return pending;
}

/** Peaks for the bars: the `waveform` you pass, else computed from the file, else a default pattern. `null` while computing. */
function usePeaks(src: string, bars: number, given?: number[]) {
    const [peaks, setPeaks] = React.useState<number[] | null>(null);

    React.useEffect(() => {
        if (given) {
            setPeaks(resample(given, bars));
            return;
        }
        let cancelled = false;
        setPeaks(null);
        analyze(src, bars).then(
            (result) => !cancelled && setPeaks(result),
            () => !cancelled && setPeaks(defaultPeaks(bars)),
        );
        return () => {
            cancelled = true;
        };
    }, [src, bars, given]);

    return peaks;
}

export function Waveform({
    src,
    bars,
    waveform,
    label,
    valueText,
    current,
    duration,
    onSeek,
}: {
    src: string;
    bars: number;
    waveform?: number[];
    label: string;
    valueText: string;
    current: number;
    duration: number;
    onSeek: (seconds: number) => void;
}) {
    const peaks = usePeaks(src, bars, waveform);
    const ref = React.useRef<HTMLDivElement>(null);
    const dragging = React.useRef(false);
    const progress = duration > 0 ? current / duration : 0;

    function seekFromPointer(clientX: number) {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect || rect.width === 0 || !duration) return;
        onSeek(Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) * duration);
    }

    function handleKeyDown(event: React.KeyboardEvent) {
        const targets: Record<string, number> = {
            ArrowLeft: current - SEEK_STEP,
            ArrowRight: current + SEEK_STEP,
            Home: 0,
            End: duration,
        };
        const target = targets[event.key];
        if (target === undefined) return;
        // The player root also seeks on arrows: this slider owns them.
        event.preventDefault();
        event.stopPropagation();
        onSeek(Math.min(duration, Math.max(0, target)));
    }

    return (
        <div
            ref={ref}
            role="slider"
            tabIndex={duration ? 0 : -1}
            aria-label={label}
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(current)}
            aria-valuetext={valueText}
            aria-disabled={!duration || undefined}
            onKeyDown={handleKeyDown}
            onPointerDown={(event) => {
                if (!duration) return;
                dragging.current = true;
                event.currentTarget.setPointerCapture?.(event.pointerId);
                seekFromPointer(event.clientX);
            }}
            onPointerMove={(event) => dragging.current && seekFromPointer(event.clientX)}
            onPointerUp={() => {
                dragging.current = false;
            }}
            onPointerCancel={() => {
                dragging.current = false;
            }}
            className={cn(
                "flex h-[34px] min-w-0 flex-1 touch-none select-none items-center gap-[2px] rounded-md focus:outline-none focus-visible:ring-4 focus-visible:ring-current/30",
                duration ? "cursor-pointer" : "cursor-default",
            )}
        >
            {Array.from({ length: bars }, (_, i) => {
                const played = (i + 0.5) / bars <= progress;
                // Low and pulsing while the file is analyzed.
                const height = peaks
                    ? MIN_HEIGHT + (peaks[i] ?? 0) * (MAX_HEIGHT - MIN_HEIGHT)
                    : MIN_HEIGHT + (i % 3) * 2;
                return (
                    <span
                        // biome-ignore lint/suspicious/noArrayIndexKey: bars are positional and never reorder
                        key={i}
                        aria-hidden="true"
                        className={cn(
                            "min-w-[2px] flex-1 rounded-full",
                            played ? "bg-current" : "bg-[var(--vpd-border-strong)]",
                            !peaks && "animate-pulse motion-reduce:animate-none",
                        )}
                        style={{ height }}
                    />
                );
            })}
        </div>
    );
}
