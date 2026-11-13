import * as React from "react";

import { cn } from "../../lib/cn";
import { controlRadius } from "../../lib/controlStyles";
import { accent, buttonSizes, ChevronIcon } from "../shared/mediaControls";
import { useMediaControlled } from "../shared/useMediaControlled";
import type { CarouselAnimation, CarouselProps } from "./types";

const motion: Record<CarouselAnimation, string> = {
    none: "",
    smooth: "transition-transform duration-500 ease-in-out",
    fast: "transition-transform duration-150 ease-out",
    bounce: "transition-transform duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]",
};

const dotSizes = { sm: "h-1.5", md: "h-2", lg: "h-2.5" };

export function Carousel({
    children,
    "aria-label": ariaLabel,
    index,
    defaultIndex = 0,
    onIndexChange,
    slidesPerView = 1,
    loop = false,
    autoplay = false,
    showArrows = true,
    showDots = true,
    previousLabel = "Previous slide",
    nextLabel = "Next slide",
    dotLabel = (i) => `Go to slide ${i + 1}`,
    slideLabel = (i, total) => `${i + 1} of ${total}`,
    variantColor = "primary",
    customColor,
    size = "md",
    radius = "lg",
    animation = "smooth",
    className,
}: CarouselProps) {
    const slides = React.Children.toArray(children);
    const total = slides.length;
    const max = Math.max(0, total - slidesPerView);
    const [raw, setIndex] = useMediaControlled(index, defaultIndex, onIndexChange);
    const current = Math.min(Math.max(0, raw), max);
    const setRef = React.useRef(setIndex);
    setRef.current = setIndex;

    const [paused, setPaused] = React.useState(false);
    const [reduced, setReduced] = React.useState(false);
    React.useEffect(() => {
        const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
        if (!query) return;
        setReduced(query.matches);
        const onChange = () => setReduced(query.matches);
        query.addEventListener?.("change", onChange);
        return () => query.removeEventListener?.("change", onChange);
    }, []);

    const next = current < max ? current + 1 : loop ? 0 : null;
    const previous = current > 0 ? current - 1 : loop ? max : null;
    const delay = autoplay === true ? 5000 : autoplay || 0;
    const running = delay > 0 && !paused && !reduced && next !== null;
    React.useEffect(() => {
        if (!running || next === null) return;
        const id = setTimeout(() => setRef.current(next), delay);
        return () => clearTimeout(id);
    }, [running, next, delay]);

    const { className: color, style } = accent(variantColor, customColor);
    const arrow = cn(
        "absolute top-1/2 z-10 -translate-y-1/2 inline-flex items-center justify-center rounded-full bg-[var(--vpd-surface)]/90 text-[var(--vpd-text)] shadow hover:bg-[var(--vpd-surface)] focus:outline-none focus-visible:ring-4 focus-visible:ring-current/30 disabled:pointer-events-none disabled:opacity-40",
        buttonSizes[size],
    );

    return (
        <section
            aria-roledescription="carousel"
            aria-label={ariaLabel}
            className={cn("relative w-full", color, className)}
            style={style}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onKeyDown={(event) => {
                const target =
                    event.key === "ArrowLeft"
                        ? previous
                        : event.key === "ArrowRight"
                          ? next
                          : event.key === "Home"
                            ? 0
                            : event.key === "End"
                              ? max
                              : undefined;
                if (target === undefined) return;
                event.preventDefault();
                if (target !== null) setIndex(target);
            }}
        >
            <div
                className={cn("overflow-hidden", controlRadius[radius])}
                aria-live={running ? "off" : "polite"}
            >
                <div
                    className={cn("flex", motion[animation], "motion-reduce:transition-none")}
                    style={{ transform: `translateX(-${(current * 100) / slidesPerView}%)` }}
                >
                    {slides.map((slide, i) => {
                        const hidden = i < current || i >= current + slidesPerView;
                        return (
                            // biome-ignore lint/a11y/useSemanticElements: the ARIA carousel pattern requires role="group" on slides
                            <div
                                // biome-ignore lint/suspicious/noArrayIndexKey: slides are positional
                                key={i}
                                role="group"
                                aria-roledescription="slide"
                                aria-label={slideLabel(i, total)}
                                aria-hidden={hidden || undefined}
                                inert={hidden}
                                className="min-w-0 flex-none"
                                style={{ flexBasis: `${100 / slidesPerView}%` }}
                            >
                                {slide}
                            </div>
                        );
                    })}
                </div>
            </div>
            {showArrows && max > 0 ? (
                <>
                    <button
                        type="button"
                        aria-label={previousLabel}
                        disabled={previous === null}
                        onClick={() => previous !== null && setIndex(previous)}
                        className={cn(arrow, "left-2")}
                    >
                        <ChevronIcon dir="left" />
                    </button>
                    <button
                        type="button"
                        aria-label={nextLabel}
                        disabled={next === null}
                        onClick={() => next !== null && setIndex(next)}
                        className={cn(arrow, "right-2")}
                    >
                        <ChevronIcon dir="right" />
                    </button>
                </>
            ) : null}
            {showDots && max > 0 ? (
                <div className="mt-3 flex items-center justify-center gap-1.5">
                    {Array.from({ length: max + 1 }, (_, i) => (
                        <button
                            // biome-ignore lint/suspicious/noArrayIndexKey: dots are positional
                            key={i}
                            type="button"
                            aria-label={dotLabel(i)}
                            aria-current={i === current ? "true" : undefined}
                            onClick={() => setIndex(i)}
                            className={cn(
                                "rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-current/30 motion-reduce:transition-none",
                                dotSizes[size],
                                animation === "none" ? "" : "transition-all duration-300",
                                i === current
                                    ? "w-5 bg-current"
                                    : "w-2 bg-[var(--vpd-border-strong)]",
                            )}
                        />
                    ))}
                </div>
            ) : null}
        </section>
    );
}
