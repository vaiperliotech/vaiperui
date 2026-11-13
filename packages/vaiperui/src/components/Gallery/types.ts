import type { ControlAnimation, ControlRadius } from "../../lib/controlStyles";
import type { LightboxProps } from "../Lightbox/types";

export type GalleryRadius = ControlRadius;
export type GalleryAnimation = ControlAnimation;

export interface GalleryItem {
    /** Full-size image, shown in the viewer. */
    src: string;
    alt: string;
    /** Smaller image for the grid. Defaults to `src`. */
    thumbnail?: string;
    /** Shown under the image in the viewer, and over the thumbnail on hover. */
    caption?: string;
}

export interface GalleryProps {
    items: GalleryItem[];
    /** Number of grid columns. Defaults to 3. */
    columns?: number;
    /** Space between thumbnails, in px. Defaults to 8. */
    gap?: number;
    /** CSS aspect ratio of each thumbnail, e.g. `"4 / 3"` (default) or `"1"`. */
    aspectRatio?: string;
    /** Opens the viewer on click. Defaults to `true`. */
    lightbox?: boolean;
    /** Called on every thumbnail click, before the viewer opens. */
    onItemClick?: (item: GalleryItem, index: number) => void;
    /** Accessible name of each thumbnail button. Defaults to `Open image N: alt`. */
    openLabel?: (item: GalleryItem, index: number) => string;
    /** Labels of the viewer: `label`, `closeLabel`, `previousLabel`, `nextLabel`, `counterLabel`. */
    lightboxProps?: Pick<
        LightboxProps,
        "label" | "closeLabel" | "previousLabel" | "nextLabel" | "counterLabel"
    >;
    radius?: GalleryRadius;
    animation?: GalleryAnimation;
    "aria-label"?: string;
    className?: string;
}
