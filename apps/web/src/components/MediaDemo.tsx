"use client";

import { useState } from "react";
import { Carousel, Gallery, Lightbox } from "vaiperui";

type Colors = "primary" | "success" | "warning" | "danger";

const PALETTE = ["#4f46e5", "#059669", "#db2777", "#d97706", "#0891b2", "#7c3aed"];

const svg = (color: string, n: number) =>
    `data:image/svg+xml;utf8,${encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="100%" height="100%" fill="${color}"/><text x="50%" y="50%" fill="white" fill-opacity=".9" font-size="160" font-weight="700" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${n}</text></svg>`,
    )}`;

/** Stable inline images, no hotlinking. */
export const sampleImages = (alt: string, count = 6) =>
    PALETTE.slice(0, count).map((color, i) => ({
        src: svg(color, i + 1),
        alt: `${alt} ${i + 1}`,
        caption: `${alt} ${i + 1}`,
    }));

// The components take functions (labels), which cannot cross from a server component: the demos
// receive plain texts and build them here.
export function GalleryDemo({
    alt,
    openPrefix,
    ...props
}: {
    alt: string;
    openPrefix: string;
    columns?: number;
    gap?: number;
    aspectRatio?: string;
    lightbox?: boolean;
    radius?: "none" | "sm" | "md" | "lg" | "full";
    count?: number;
}) {
    const { count, ...rest } = props;
    return (
        <div className="w-full max-w-lg">
            <Gallery
                aria-label={alt}
                items={sampleImages(alt, count)}
                openLabel={(item, i) => `${openPrefix} ${i + 1}: ${item.alt}`}
                {...rest}
            />
        </div>
    );
}

export function LightboxDemo({
    alt,
    trigger,
    labels,
}: {
    alt: string;
    trigger: string;
    labels: { label: string; closeLabel: string; previousLabel: string; nextLabel: string };
}) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/30"
            >
                {trigger}
            </button>
            <Lightbox
                items={sampleImages(alt, 4)}
                open={open}
                onOpenChange={setOpen}
                index={index}
                onIndexChange={setIndex}
                {...labels}
            />
        </>
    );
}

export function CarouselDemo({
    alt,
    label,
    previousLabel,
    nextLabel,
    dotPrefix,
    controlledText,
    controlled,
    ...props
}: {
    alt: string;
    label: string;
    previousLabel: string;
    nextLabel: string;
    dotPrefix: string;
    /** Text shown above a controlled carousel, e.g. "Slide". */
    controlledText?: string;
    controlled?: boolean;
    slidesPerView?: number;
    loop?: boolean;
    autoplay?: boolean | number;
    variantColor?: Colors;
    customColor?: string;
}) {
    const [index, setIndex] = useState(0);
    return (
        <div className="flex w-full max-w-lg flex-col gap-2">
            {controlled ? (
                <span className="text-sm text-[var(--vpd-text-secondary)]">
                    {controlledText}: {index + 1}
                </span>
            ) : null}
            <Carousel
                aria-label={label}
                previousLabel={previousLabel}
                nextLabel={nextLabel}
                dotLabel={(i) => `${dotPrefix} ${i + 1}`}
                {...(controlled ? { index, onIndexChange: setIndex } : {})}
                {...props}
            >
                {sampleImages(alt).map((image) => (
                    // biome-ignore lint/performance/noImgElement: plain data-URI demo image
                    <img
                        key={image.src}
                        src={image.src}
                        alt={image.alt}
                        className="block aspect-[3/2] w-full object-cover"
                    />
                ))}
            </Carousel>
        </div>
    );
}
