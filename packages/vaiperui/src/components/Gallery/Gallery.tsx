import * as React from "react";

import { cn } from "../../lib/cn";
import { controlAnimations, controlRadius } from "../../lib/controlStyles";
import { Lightbox } from "../Lightbox/Lightbox";
import type { GalleryProps } from "./types";

export function Gallery({
    items,
    columns = 3,
    gap = 8,
    aspectRatio = "4 / 3",
    lightbox = true,
    onItemClick,
    openLabel = (item, i) => `Open image ${i + 1}: ${item.alt}`,
    lightboxProps,
    radius = "md",
    animation = "smooth",
    "aria-label": ariaLabel,
    className,
}: GalleryProps) {
    const [open, setOpen] = React.useState(false);
    const [index, setIndex] = React.useState(0);

    return (
        <>
            <ul
                aria-label={ariaLabel}
                className={cn("m-0 grid list-none p-0", className)}
                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap }}
            >
                {items.map((item, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: the same image may appear twice, the index disambiguates
                    <li key={`${item.src}-${i}`} className="min-w-0">
                        <button
                            type="button"
                            aria-label={openLabel(item, i)}
                            onClick={() => {
                                onItemClick?.(item, i);
                                if (!lightbox) return;
                                setIndex(i);
                                setOpen(true);
                            }}
                            className={cn(
                                "group relative block w-full overflow-hidden bg-[var(--vpd-surface-muted)] p-0 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/40",
                                lightbox || onItemClick ? "cursor-pointer" : "cursor-default",
                                controlRadius[radius],
                            )}
                            style={{ aspectRatio }}
                        >
                            {/* biome-ignore lint/performance/noImgElement: framework-agnostic library, no next/image available */}
                            <img
                                src={item.thumbnail ?? item.src}
                                alt={item.alt}
                                loading="lazy"
                                className={cn(
                                    "h-full w-full object-cover group-hover:scale-105",
                                    controlAnimations[animation],
                                )}
                            />
                            {item.caption ? (
                                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 pt-6 pb-1.5 text-left text-xs text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100">
                                    {item.caption}
                                </span>
                            ) : null}
                        </button>
                    </li>
                ))}
            </ul>
            {lightbox ? (
                <Lightbox
                    {...lightboxProps}
                    items={items}
                    open={open}
                    onOpenChange={setOpen}
                    index={index}
                    onIndexChange={setIndex}
                />
            ) : null}
        </>
    );
}
