import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Carousel } from "./Carousel";

const slides = ["A", "B", "C"].map((s) => <div key={s}>{`Slide ${s}`}</div>);
const dots = () => screen.getAllByRole("button", { name: /Go to slide/ });
const current = () => dots().findIndex((d) => d.getAttribute("aria-current") === "true");

afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
});

describe("Carousel", () => {
    it("exposes region and slide semantics", () => {
        render(<Carousel aria-label="Featured">{slides}</Carousel>);
        const region = screen.getByRole("region", { name: "Featured" });
        expect(region).toHaveAttribute("aria-roledescription", "carousel");
        const groups = screen.getAllByRole("group", { hidden: true });
        expect(groups).toHaveLength(3);
        expect(groups[0]).toHaveAttribute("aria-roledescription", "slide");
        expect(groups[0]).toHaveAttribute("aria-label", "1 of 3");
        expect(groups[1]).toHaveAttribute("aria-hidden", "true");
        expect(groups[0]).not.toHaveAttribute("aria-hidden");
    });

    it("navigates with arrows and disables them at the ends", () => {
        const onIndexChange = vi.fn();
        render(
            <Carousel aria-label="c" onIndexChange={onIndexChange}>
                {slides}
            </Carousel>,
        );
        const prev = screen.getByRole("button", { name: "Previous slide" });
        const next = screen.getByRole("button", { name: "Next slide" });
        expect(prev).toBeDisabled();
        fireEvent.click(next);
        fireEvent.click(next);
        expect(current()).toBe(2);
        expect(next).toBeDisabled();
        expect(onIndexChange).toHaveBeenLastCalledWith(2);
        fireEvent.click(prev);
        expect(current()).toBe(1);
    });

    it("jumps with the dots and the keyboard", () => {
        render(<Carousel aria-label="c">{slides}</Carousel>);
        fireEvent.click(screen.getByRole("button", { name: "Go to slide 3" }));
        expect(current()).toBe(2);
        const region = screen.getByRole("region");
        fireEvent.keyDown(region, { key: "ArrowLeft" });
        expect(current()).toBe(1);
        fireEvent.keyDown(region, { key: "Home" });
        expect(current()).toBe(0);
        fireEvent.keyDown(region, { key: "End" });
        expect(current()).toBe(2);
        fireEvent.keyDown(region, { key: "ArrowRight" });
        expect(current()).toBe(2);
    });

    it("loops past the ends", () => {
        render(
            <Carousel aria-label="c" loop>
                {slides}
            </Carousel>,
        );
        const prev = screen.getByRole("button", { name: "Previous slide" });
        expect(prev).toBeEnabled();
        fireEvent.click(prev);
        expect(current()).toBe(2);
        fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
        expect(current()).toBe(0);
    });

    it("is controlled by index", () => {
        const onIndexChange = vi.fn();
        const { rerender } = render(
            <Carousel aria-label="c" index={1} onIndexChange={onIndexChange}>
                {slides}
            </Carousel>,
        );
        expect(current()).toBe(1);
        fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
        expect(onIndexChange).toHaveBeenCalledWith(2);
        expect(current()).toBe(1);
        rerender(
            <Carousel aria-label="c" index={2} onIndexChange={onIndexChange}>
                {slides}
            </Carousel>,
        );
        expect(current()).toBe(2);
    });

    it("shows several slides per view and has one dot per position", () => {
        render(
            <Carousel aria-label="c" slidesPerView={2}>
                {slides}
            </Carousel>,
        );
        expect(dots()).toHaveLength(2);
        const groups = screen.getAllByRole("group", { hidden: true });
        expect(groups.map((g) => g.hasAttribute("aria-hidden"))).toEqual([false, false, true]);
    });

    it("advances on its own, pauses on hover and focus", () => {
        vi.useFakeTimers();
        render(
            <Carousel aria-label="c" autoplay={1000}>
                {slides}
            </Carousel>,
        );
        act(() => {
            vi.advanceTimersByTime(1000);
        });
        expect(current()).toBe(1);
        const region = screen.getByRole("region");
        fireEvent.mouseEnter(region);
        act(() => {
            vi.advanceTimersByTime(5000);
        });
        expect(current()).toBe(1);
        fireEvent.mouseLeave(region);
        fireEvent.focus(region);
        act(() => {
            vi.advanceTimersByTime(5000);
        });
        expect(current()).toBe(1);
        fireEvent.blur(region);
        act(() => {
            vi.advanceTimersByTime(1000);
        });
        expect(current()).toBe(2);
        act(() => {
            vi.advanceTimersByTime(5000);
        });
        expect(current()).toBe(2);
    });

    it("does not autoplay with prefers-reduced-motion", () => {
        vi.useFakeTimers();
        vi.stubGlobal("matchMedia", () => ({
            matches: true,
            addEventListener: () => {},
            removeEventListener: () => {},
        }));
        render(
            <Carousel aria-label="c" autoplay={1000}>
                {slides}
            </Carousel>,
        );
        act(() => {
            vi.advanceTimersByTime(5000);
        });
        expect(current()).toBe(0);
    });

    it("hides arrows and dots on request and overrides labels", () => {
        const { rerender } = render(
            <Carousel
                aria-label="c"
                previousLabel="Anterior"
                nextLabel="Próximo"
                dotLabel={(i) => `Ir para ${i + 1}`}
                slideLabel={(i, n) => `${i + 1} de ${n}`}
            >
                {slides}
            </Carousel>,
        );
        expect(screen.getByRole("button", { name: "Anterior" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Ir para 2" })).toBeInTheDocument();
        expect(screen.getAllByRole("group", { hidden: true })[0]).toHaveAttribute(
            "aria-label",
            "1 de 3",
        );
        rerender(
            <Carousel aria-label="c" showArrows={false} showDots={false}>
                {slides}
            </Carousel>,
        );
        expect(screen.queryAllByRole("button")).toHaveLength(0);
    });
});
