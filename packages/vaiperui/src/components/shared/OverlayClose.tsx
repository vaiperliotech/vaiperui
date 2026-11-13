import * as React from "react";

export const OverlayCloseContext = React.createContext<(() => void) | null>(null);

/** Wraps one element (e.g. a Button) so that clicking it closes the nearest overlay. */
export function OverlayClose({
    children,
}: {
    children: React.ReactElement<{ onClick?: (event: React.MouseEvent) => void }>;
}) {
    const close = React.useContext(OverlayCloseContext);
    return React.cloneElement(children, {
        onClick: (event: React.MouseEvent) => {
            children.props.onClick?.(event);
            close?.();
        },
    });
}
