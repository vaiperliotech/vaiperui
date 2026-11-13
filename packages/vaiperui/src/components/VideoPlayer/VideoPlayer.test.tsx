import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { VideoPlayer } from "./VideoPlayer";

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
afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
});

const video = (c: HTMLElement) => c.querySelector("video") as HTMLVideoElement;

describe("VideoPlayer", () => {
    it("renders a labelled group with the video", () => {
        const { container } = render(<VideoPlayer src="/v.mp4" poster="/p.png" label="Demo" />);
        expect(screen.getByRole("group", { name: "Demo" })).toBeInTheDocument();
        expect(video(container).getAttribute("poster")).toBe("/p.png");
    });

    it("plays and pauses with the button and by clicking the video", () => {
        const { container } = render(<VideoPlayer src="/v.mp4" />);
        fireEvent.click(screen.getByRole("button", { name: "Play" }));
        expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
        fireEvent.click(video(container));
        expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument();
    });

    it("handles keyboard shortcuts: Space, arrows, M", () => {
        const { container } = render(<VideoPlayer src="/v.mp4" />);
        const el = video(container);
        Object.defineProperty(el, "duration", { value: 60, configurable: true });
        Object.defineProperty(el, "currentTime", { value: 0, writable: true, configurable: true });
        const group = screen.getByRole("group");
        fireEvent.keyDown(group, { key: " " });
        expect(screen.getByRole("button", { name: "Pause" })).toBeInTheDocument();
        fireEvent.keyDown(group, { key: "ArrowRight" });
        expect(el.currentTime).toBe(5);
        fireEvent.keyDown(group, { key: "ArrowLeft" });
        expect(el.currentTime).toBe(0);
        fireEvent.keyDown(group, { key: "m" });
        expect(screen.getByRole("button", { name: "Unmute" })).toBeInTheDocument();
    });

    it("toggles fullscreen with the button and the F key", () => {
        const request = vi.fn().mockResolvedValue(undefined);
        const { container } = render(<VideoPlayer src="/v.mp4" />);
        (container.firstElementChild as HTMLElement).requestFullscreen = request;
        fireEvent.click(screen.getByRole("button", { name: "Fullscreen" }));
        fireEvent.keyDown(screen.getByRole("group"), { key: "f" });
        expect(request).toHaveBeenCalledTimes(2);
    });

    it("shows a captions button only when there is a track, and toggles it", () => {
        const { unmount } = render(<VideoPlayer src="/v.mp4" />);
        expect(screen.queryByRole("button", { name: "Captions" })).toBeNull();
        unmount();
        const tracks = [{ mode: "hidden" }];
        Object.defineProperty(HTMLMediaElement.prototype, "textTracks", {
            value: tracks,
            configurable: true,
        });
        try {
            render(
                <VideoPlayer src="/v.mp4">
                    <track kind="captions" src="/c.vtt" srcLang="en" label="English" />
                </VideoPlayer>,
            );
            const button = screen.getByRole("button", { name: "Captions" });
            expect(button).toHaveAttribute("aria-pressed", "false");
            fireEvent.click(button);
            expect(tracks[0]?.mode).toBe("showing");
            expect(button).toHaveAttribute("aria-pressed", "true");
        } finally {
            Reflect.deleteProperty(HTMLMediaElement.prototype, "textTracks");
        }
    });

    it("hides the controls after inactivity while playing, not while paused", () => {
        vi.useFakeTimers();
        const { container } = render(<VideoPlayer src="/v.mp4" hideControlsAfter={1000} />);
        const controls = () => container.querySelector("[inert]");
        act(() => {
            vi.advanceTimersByTime(5000);
        });
        expect(controls()).toBeNull();
        fireEvent.click(screen.getByRole("button", { name: "Play" }));
        (document.activeElement as HTMLElement)?.blur();
        act(() => {
            vi.advanceTimersByTime(1100);
        });
        expect(controls()).not.toBeNull();
        fireEvent.mouseMove(screen.getByRole("group"));
        expect(controls()).toBeNull();
    });

    it("overrides labels", () => {
        render(<VideoPlayer src="/v.mp4" labels={{ fullscreen: "Tela cheia" }} />);
        expect(screen.getByRole("button", { name: "Tela cheia" })).toBeInTheDocument();
    });
});

describe("VideoPlayer overlay variant", () => {
    const central = (c: HTMLElement) =>
        c.querySelector("button[aria-hidden='true']") as HTMLElement | null;

    it("has no central play button in the default variant", () => {
        const { container } = render(<VideoPlayer src="/v.mp4" />);
        expect(central(container)).toBeNull();
    });

    it("shows a large play button while paused that plays on click and goes away", () => {
        const onPlay = vi.fn();
        const { container } = render(
            <VideoPlayer variant="overlay" src="/v.mp4" onPlay={onPlay} />,
        );
        const big = central(container) as HTMLElement;
        expect(big).not.toBeNull();
        // A shortcut for mouse and touch: not a tab stop, hidden from assistive tech.
        expect(big).toHaveAttribute("tabindex", "-1");
        fireEvent.click(big);
        expect(onPlay).toHaveBeenCalledTimes(1);
        expect(central(container)).toBeNull();
        fireEvent.click(screen.getByRole("button", { name: "Pause" }));
        expect(central(container)).not.toBeNull();
    });

    it("moves the seek bar below the buttons and hides the volume slider when narrow (container query classes)", () => {
        const { container, rerender } = render(<VideoPlayer variant="overlay" src="/v.mp4" />);
        const controls = container.querySelector("[inert], .bg-gradient-to-t") as HTMLElement;
        expect(controls.className).toContain("@max-[560px]:flex-col-reverse");
        const volume = screen
            .getByRole("slider", { name: "Volume" })
            .closest("div[class*='w-20']") as HTMLElement;
        expect(volume.className).toContain("@max-[560px]:hidden");
        expect(screen.getByRole("button", { name: "Mute" })).toBeInTheDocument();
        rerender(<VideoPlayer src="/v.mp4" />);
        expect(
            (container.querySelector(".bg-gradient-to-t") as HTMLElement).className,
        ).not.toContain("flex-col-reverse");
    });

    it("hides the cursor together with the controls while playing", () => {
        vi.useFakeTimers();
        render(<VideoPlayer variant="overlay" src="/v.mp4" hideControlsAfter={1000} />);
        fireEvent.click(screen.getByRole("button", { name: "Play" }));
        (document.activeElement as HTMLElement)?.blur();
        expect(screen.getByRole("group").className).not.toContain("cursor-none");
        act(() => {
            vi.advanceTimersByTime(1100);
        });
        expect(screen.getByRole("group").className).toContain("cursor-none");
    });
});
