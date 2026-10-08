import type { ReactNode } from "react";

export function TerminalWindow({
    title,
    children,
    className = "",
    bodyClassName = "",
    actions,
}: {
    title: string;
    children: ReactNode;
    className?: string;
    bodyClassName?: string;
    actions?: ReactNode;
}) {
    return (
        <div
            className={`overflow-hidden rounded-xl border border-line bg-bg-2 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.7)] ${className}`}
        >
            <div className="flex items-center gap-2 border-b border-line bg-bg-1 px-4 py-2.5">
                <span className="flex gap-1.5">
                    <span className="size-2.5 rounded-full bg-mac-red" />
                    <span className="size-2.5 rounded-full bg-mac-yellow" />
                    <span className="size-2.5 rounded-full bg-mac-green" />
                </span>
                <span className="ml-2 truncate font-mono text-xs text-ink-faint">{title}</span>
                {actions ? <div className="ml-auto shrink-0">{actions}</div> : null}
            </div>
            <div className={bodyClassName || "p-5"}>{children}</div>
        </div>
    );
}
