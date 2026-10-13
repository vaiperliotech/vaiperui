import type { AppId } from "./registry";

const tile =
    "flex size-11 items-center justify-center overflow-hidden rounded-[10px] border border-line-strong";

// Dock and Games-window icons, drawn with primitives so they stay crisp at any size.
export function AppIcon({ id }: { id: AppId | "page" }) {
    switch (id) {
        case "page":
            return (
                <span className="flex h-9 w-11 flex-col overflow-hidden rounded-lg border border-line-strong bg-bg-1">
                    <span className="flex items-center gap-[2px] border-line border-b bg-bg-2 px-1 py-[3px]">
                        <span className="size-[3px] rounded-full bg-mac-red" />
                        <span className="size-[3px] rounded-full bg-mac-yellow" />
                        <span className="size-[3px] rounded-full bg-mac-green" />
                    </span>
                    <span className="flex flex-1 items-center justify-center font-display font-semibold text-[8px] text-ink leading-none">
                        vaiper<span className="text-accent-blue">ui</span>
                    </span>
                </span>
            );
        case "terminal":
            return (
                <span className={`${tile} bg-[#05070d] font-bold font-mono text-[#28c840] text-sm`}>
                    &gt;_
                </span>
            );
        case "arcade":
            // a game controller: d-pad on the left, two buttons on the right
            return (
                <span className={`${tile} bg-bg-1`}>
                    <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
                        <path
                            d="M9.5 9h13a5.5 5.5 0 0 1 5.4 4.6l.9 6.2a3.6 3.6 0 0 1-6.3 2.9L20 20.5h-8l-2.5 2.2a3.6 3.6 0 0 1-6.3-2.9l.9-6.2A5.5 5.5 0 0 1 9.5 9Z"
                            fill="#1a2234"
                            stroke="#7d8fac"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M10 12.5v5M7.5 15h5"
                            stroke="#eef2fb"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        <circle cx="21" cy="13.5" r="1.7" fill="#4da3ff" />
                        <circle cx="24.4" cy="16.4" r="1.7" fill="#28c840" />
                        <circle cx="21" cy="16.9" r="1.7" fill="#febc2e" />
                    </svg>
                </span>
            );
        case "snake":
            return (
                <span className={`${tile} bg-bg-1`}>
                    <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
                        <path
                            d="M6 24h10a4 4 0 0 0 0-8h-2a4 4 0 0 1 0-8h12"
                            fill="none"
                            stroke="#4da3ff"
                            strokeWidth="4"
                            strokeLinecap="round"
                        />
                        <rect x="23" y="5" width="6" height="6" rx="2" fill="#a78bfa" />
                    </svg>
                </span>
            );
        case "mines":
            return (
                <span className={`${tile} grid grid-cols-3 gap-px bg-line-strong p-px`}>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((cell) => (
                        <span
                            key={cell}
                            className={`flex items-center justify-center font-bold font-mono text-[9px] ${
                                cell === 4 ? "bg-[#ff5f57]/40" : "bg-bg-3"
                            } ${cell === 1 ? "text-accent-blue" : cell === 3 ? "text-[#28c840]" : ""}`}
                        >
                            {cell === 1 ? "1" : cell === 3 ? "2" : ""}
                        </span>
                    ))}
                </span>
            );
        case "tictactoe":
            return (
                <span className={`${tile} bg-bg-1`}>
                    <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
                        <path
                            d="M12 5v22M20 5v22M5 12h22M5 20h22"
                            stroke="#3a4560"
                            strokeWidth="1.5"
                        />
                        <path
                            d="M6.5 6.5l4 4M10.5 6.5l-4 4"
                            stroke="#4da3ff"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        <circle
                            cx="16"
                            cy="16"
                            r="2.6"
                            fill="none"
                            stroke="#a78bfa"
                            strokeWidth="2"
                        />
                    </svg>
                </span>
            );
        case "memory":
            return (
                <span className={`${tile} grid grid-cols-2 gap-1 bg-bg-1 p-1.5`}>
                    <span className="size-full rounded-[4px] bg-bg-3" />
                    <span className="flex size-full items-center justify-center rounded-[4px] bg-bg-0">
                        <span className="size-2 rounded-full bg-[#28c840]" />
                    </span>
                    <span className="flex size-full items-center justify-center rounded-[4px] bg-bg-0">
                        <span className="size-2 rounded-full bg-[#28c840]" />
                    </span>
                    <span className="size-full rounded-[4px] bg-bg-3" />
                </span>
            );
        case "colormatch":
            return (
                <span className={`${tile} bg-bg-1`}>
                    <span className="flex size-8 overflow-hidden rounded-full border border-line-strong">
                        <span className="w-1/2 bg-[#a78bfa]" />
                        <span className="w-1/2 bg-[#4da3ff]" />
                    </span>
                </span>
            );
        case "g2048":
            return (
                <span className={`${tile} bg-[#3a86f0] font-bold font-mono text-[13px] text-white`}>
                    2048
                </span>
            );
        case "wordle":
            return (
                <span className={`${tile} gap-[2px] bg-bg-1`}>
                    {[
                        ["#28c840", "V"],
                        ["#febc2e", "A"],
                        ["#3a4560", "I"],
                    ].map(([bg, letter]) => (
                        <span
                            key={letter}
                            style={{ background: bg }}
                            className="flex size-[11px] items-center justify-center rounded-[3px] font-bold font-mono text-[8px] text-[#05070d]"
                        >
                            {letter}
                        </span>
                    ))}
                </span>
            );
        case "bughunt":
            return (
                <span className={`${tile} bg-bg-1`}>
                    <svg viewBox="0 0 32 32" className="size-7" aria-hidden="true">
                        <g stroke="#ff5f57" strokeWidth="2" strokeLinecap="round">
                            <path d="M6 10l5 4M26 10l-5 4M4 17h7M28 17h-7M6 25l5-4M26 25l-5-4" />
                        </g>
                        <ellipse cx="16" cy="18" rx="7" ry="9" fill="#ff5f57" />
                        <path d="M16 9v18" stroke="#05070d" strokeWidth="1.4" />
                    </svg>
                </span>
            );
        case "flappy":
            return (
                <span className={`${tile} relative bg-bg-1`}>
                    <span className="absolute top-0 left-1 h-3 w-2 bg-[#3a4560]" />
                    <span className="absolute right-1 bottom-0 h-3 w-2 bg-[#3a4560]" />
                    <span className="flex size-5 items-center justify-center rounded-[6px] bg-gradient-to-br from-[#4da3ff] to-[#a78bfa] font-bold text-[8px] text-[#05070d]">
                        ui
                    </span>
                </span>
            );
        case "dino":
            return (
                <span className={`${tile} bg-[#05070d] font-bold font-mono text-[#4da3ff] text-xl`}>
                    $
                </span>
            );
        case "pong":
            return (
                <span className={`${tile} relative bg-[#05070d]`}>
                    <span className="absolute left-1.5 h-5 w-1 rounded-full bg-[#4da3ff]" />
                    <span className="absolute right-1.5 h-5 w-1 rounded-full bg-[#a78bfa]" />
                    <span className="size-1.5 rounded-[2px] bg-ink" />
                </span>
            );
        case "breakout":
            return (
                <span className={`${tile} flex-col justify-between bg-[#05070d] p-1.5`}>
                    <span className="flex w-full gap-[2px]">
                        <span className="h-2 flex-1 rounded-[2px] bg-[#eef2fb]" />
                        <span className="h-2 flex-1 rounded-[2px] bg-[#4da3ff]" />
                        <span className="h-2 flex-1 rounded-[2px] bg-[#eef2fb]" />
                        <span className="h-2 flex-1 rounded-[2px] bg-[#4da3ff]" />
                    </span>
                    <span className="h-1 w-5 self-center rounded-full bg-[#a78bfa]" />
                </span>
            );
        case "stack":
            return (
                <span className={`${tile} bg-bg-1`}>
                    <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
                        <rect x="8" y="6" width="7" height="7" rx="2" fill="#a78bfa" />
                        <rect x="15" y="6" width="7" height="7" rx="2" fill="#a78bfa" />
                        <rect x="15" y="13" width="7" height="7" rx="2" fill="#a78bfa" />
                        <rect x="8" y="20" width="7" height="7" rx="2" fill="#4da3ff" />
                        <rect x="15" y="20" width="7" height="7" rx="2" fill="#4da3ff" />
                    </svg>
                </span>
            );
        case "invaders":
            return (
                <span className={`${tile} gap-1 bg-[#05070d]`}>
                    <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="size-2.5 rounded-full bg-[#febc2e]" />
                    <span className="size-2.5 rounded-full bg-[#28c840]" />
                </span>
            );
        default:
            return null;
    }
}
