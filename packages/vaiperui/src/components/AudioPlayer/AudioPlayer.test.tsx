import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AudioPlayer } from "./AudioPlayer";

// jsdom does not implement media playback: fake play/pause and the events the element would fire.
function setPaused(el: HTMLMediaElement, paused: boolean) {
    Object.defineProperty(el, "paused", { value: paused, configurable: true });
}
beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (
        this: HTMLMediaElement,
    ) {
        setPaused(this, false);
        this.dispatchEvent(new Event("play"));
        return Promise.resolve();
    });
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(function (
        this: HTMLMediaElement,
    ) {
        setPaused(this, true);
        this.dispatchEvent(new Event("pause"));
    });
});
afterEach(() => vi.restoreAllMocks());

const audio = (c: HTMLElement) => c.querySelector("audio") as HTMLAudioElement;
function loaded(el: HTMLAudioElement, duration = 100) {
    Object.defineProperty(el, "duration", { value: duration, configurable: true });
    Object.defineProperty(el, "currentTime", { value: 0, writable: true, configurable: true });
    act(() => {
        el.dispatchEvent(new Event("durationchange"));
    });
}

describe("AudioPlayer", () => {
    it("renders a labelled group with the audio source", () => {
        const { container } = render(<AudioPlayer src="/a.mp3" label="Voice note" />);
        expect(screen.getByRole("group", { name: "Voice note" })).toBeInTheDocument();
        expect(audio(container).getAttribute("src")).toBe("/a.mp3");
    });

    it("toggles play and pause", () => {
        const onPlay = vi.fn();
        const onPause = vi.fn();
        render(<AudioPlayer src="/a.mp3" onPlay={onPlay} onPause={onPause} />);
        fireEvent.click(screen.getByRole("button", { name: "Play" }));
        expect(onPlay).toHaveBeenCalledTimes(1);
        fireEvent.click(screen.getByRole("button", { name: "Pause" }));
        expect(onPause).toHaveBeenCalledTimes(1);
        expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    });

    it("shows current time and duration, and seeks with the slider", () => {
        const { container } = render(<AudioPlayer src="/a.mp3" />);
        const el = audio(container);
        loaded(el, 125);
        expect(screen.getByText("2:05")).toBeInTheDocument();
        const seek = screen.getByRole("slider", { name: "Seek" });
        expect(seek).toHaveAttribute("aria-valuemax", "125");
        fireEvent.keyDown(seek, { key: "End" });
        expect(el.currentTime).toBe(125);
    });

    it("mutes and unmutes", () => {
        const { container } = render(<AudioPlayer src="/a.mp3" />);
        fireEvent.click(screen.getByRole("button", { name: "Mute" }));
        expect(audio(container).muted).toBe(true);
        fireEvent.click(screen.getByRole("button", { name: "Unmute" }));
        expect(audio(container).muted).toBe(false);
    });

    it("cycles the playback speed", () => {
        const { container } = render(<AudioPlayer src="/a.mp3" />);
        fireEvent.click(screen.getByRole("button", { name: "Playback speed: 1x" }));
        expect(audio(container).playbackRate).toBe(1.5);
        expect(screen.getByRole("button", { name: "Playback speed: 1.5x" })).toBeInTheDocument();
    });

    it("supports keyboard shortcuts on the group", () => {
        const { container } = render(<AudioPlayer src="/a.mp3" />);
        const el = audio(container);
        loaded(el);
        const group = screen.getByRole("group");
        fireEvent.keyDown(group, { key: "k" });
        expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
        fireEvent.keyDown(group, { key: "ArrowRight" });
        expect(el.currentTime).toBe(5);
        fireEvent.keyDown(group, { key: "ArrowDown" });
        expect(el.volume).toBeCloseTo(0.9);
        fireEvent.keyDown(group, { key: "m" });
        expect(el.muted).toBe(true);
    });

    it("overrides labels and hides the speed button", () => {
        render(
            <AudioPlayer
                src="/a.mp3"
                speeds={[]}
                labels={{ play: "Reproduzir", seek: "Buscar" }}
            />,
        );
        expect(screen.getByRole("button", { name: "Reproduzir" })).toBeInTheDocument();
        expect(screen.getByRole("slider", { name: "Buscar" })).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /speed/ })).toBeNull();
    });
});

describe("AudioPlayer waveform variant", () => {
    const bars = () =>
        Array.from(screen.getByRole("slider", { name: "Seek" }).children) as HTMLElement[];
    const heights = () => bars().map((b) => b.style.height);
    const settle = () => act(async () => {});

    it("renders a compact card with the waveform, 'current / total' time and the speed button, no volume", () => {
        render(<AudioPlayer variant="waveform" src="/w1.mp3" />);
        expect(bars()).toHaveLength(52);
        expect(screen.getByText("0:00 / 0:00")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Playback speed: 1x" })).toBeInTheDocument();
        expect(screen.queryByRole("slider", { name: "Volume" })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Mute" })).not.toBeInTheDocument();
    });

    it("bars sets the number of bars", () => {
        render(<AudioPlayer variant="waveform" src="/w2.mp3" bars={10} />);
        expect(bars()).toHaveLength(10);
    });

    it("waveform peaks are resampled to the bars and skip the download", async () => {
        const fetchSpy = vi.fn();
        vi.stubGlobal("fetch", fetchSpy);
        render(<AudioPlayer variant="waveform" src="/w3.mp3" bars={4} waveform={[0, 1]} />);
        await settle();
        expect(heights()).toEqual(["6px", "6px", "34px", "34px"]);
        expect(fetchSpy).not.toHaveBeenCalled();
        vi.unstubAllGlobals();
    });

    it("pulses while the audio is analyzed, then draws bars from its loudness", async () => {
        vi.stubGlobal("fetch", async () => ({ arrayBuffer: async () => new ArrayBuffer(8) }));
        const samples = new Float32Array(100).fill(0);
        samples.fill(0.5, 50);
        vi.stubGlobal(
            "OfflineAudioContext",
            class {
                decodeAudioData = async () => ({ getChannelData: () => samples });
            },
        );
        render(<AudioPlayer variant="waveform" src="/w4.mp3" bars={2} />);
        expect(bars()[0]?.className).toContain("animate-pulse");
        await settle();
        expect(bars()[0]?.className).not.toContain("animate-pulse");
        expect(heights()).toEqual(["6px", "34px"]);
        vi.unstubAllGlobals();
    });

    it("falls back to a default pattern when the analysis fails, and the audio still plays", async () => {
        vi.stubGlobal("fetch", async () => {
            throw new Error("CORS");
        });
        render(<AudioPlayer variant="waveform" src="/w5.mp3" bars={6} />);
        await settle();
        expect(bars()[0]?.className).not.toContain("animate-pulse");
        expect(new Set(heights()).size).toBeGreaterThan(1);
        fireEvent.click(screen.getByRole("button", { name: "Play" }));
        expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
        vi.unstubAllGlobals();
    });

    it("is a slider with the position as text, moved by the keyboard (5 s steps, Home, End)", () => {
        const { container } = render(
            <AudioPlayer variant="waveform" src="/w6.mp3" waveform={[0.5]} />,
        );
        loaded(audio(container), 100);
        const slider = screen.getByRole("slider", { name: "Seek" });
        expect(slider).toHaveAttribute("aria-valuemax", "100");
        expect(slider).toHaveAttribute("aria-valuetext", "0:00 of 1:40");
        fireEvent.keyDown(slider, { key: "ArrowRight" });
        expect(audio(container).currentTime).toBe(5);
        fireEvent.keyDown(slider, { key: "End" });
        expect(audio(container).currentTime).toBe(100);
        fireEvent.keyDown(slider, { key: "ArrowLeft" });
        expect(audio(container).currentTime).toBe(95);
        fireEvent.keyDown(slider, { key: "Home" });
        expect(audio(container).currentTime).toBe(0);
    });

    it("seeks where the waveform is pressed", () => {
        const { container } = render(
            <AudioPlayer variant="waveform" src="/w7.mp3" waveform={[0.5]} />,
        );
        loaded(audio(container), 100);
        const slider = screen.getByRole("slider", { name: "Seek" });
        slider.getBoundingClientRect = () =>
            ({
                left: 0,
                width: 200,
                right: 200,
                top: 0,
                bottom: 34,
                height: 34,
                x: 0,
                y: 0,
                toJSON: () => ({}),
            }) as DOMRect;
        fireEvent(slider, new MouseEvent("pointerdown", { bubbles: true, clientX: 100 }));
        expect(audio(container).currentTime).toBe(50);
    });

    it("colors the bars already played", () => {
        const { container } = render(
            <AudioPlayer variant="waveform" src="/w8.mp3" bars={4} waveform={[0.5]} />,
        );
        loaded(audio(container), 100);
        Object.defineProperty(audio(container), "currentTime", {
            value: 50,
            writable: true,
            configurable: true,
        });
        act(() => {
            audio(container).dispatchEvent(new Event("timeupdate"));
        });
        expect(bars().map((b) => b.className.includes("bg-current"))).toEqual([
            true,
            true,
            false,
            false,
        ]);
    });
});
