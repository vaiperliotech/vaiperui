export interface LightboxItem {
    src: string;
    alt: string;
    /** Text under the image. */
    caption?: string;
}

export interface LightboxProps {
    items: LightboxItem[];
    /** Controlled visibility. */
    open?: boolean;
    /** Initial visibility when uncontrolled. Defaults to `false`. */
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** Controlled index of the shown item. */
    index?: number;
    /** Initial index when uncontrolled. Defaults to 0. */
    defaultIndex?: number;
    onIndexChange?: (index: number) => void;
    /** Accessible name of the dialog. Defaults to "Image viewer". */
    label?: string;
    /** Defaults to "Close". */
    closeLabel?: string;
    /** Defaults to "Previous image". */
    previousLabel?: string;
    /** Defaults to "Next image". */
    nextLabel?: string;
    /** Text of the counter. Defaults to `1 / 6`. */
    counterLabel?: (index: number, total: number) => string;
    /** Called when the viewer closes. `event.preventDefault()` stops focus returning to the previously focused element. */
    onCloseAutoFocus?: (event: Event) => void;
    className?: string;
}
