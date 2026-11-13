import * as React from "react";
import { createPortal } from "react-dom";

/** Renders into `document.body`, only on the client (nothing on the server nor on the first render). */
export function MediaPortal({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    return mounted ? createPortal(children, document.body) : null;
}
