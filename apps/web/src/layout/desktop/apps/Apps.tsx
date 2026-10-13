"use client";

import type { Locale } from "@/i18n/config";
import { AppIcon } from "../icons";
import { appName, UTILITY_LIST, type UtilityId } from "../registry";

const GROUPS: Record<"lib" | "tools", Record<Locale, string>> = {
    lib: { en: "vaiperui", pt: "vaiperui", es: "vaiperui" },
    tools: { en: "Tools", pt: "Ferramentas", es: "Herramientas" },
};

// The Apps window: the apps about the library, then everyday tools.
export function Apps({ locale, onOpen }: { locale: Locale; onOpen: (id: UtilityId) => void }) {
    return (
        <div className="h-full space-y-5 overflow-auto bg-bg-1 p-4">
            {(["lib", "tools"] as const).map((group) => (
                <section key={group} aria-label={GROUPS[group][locale]}>
                    <h2 className="mb-2 font-mono text-[10px] text-ink-faint uppercase tracking-wider">
                        {GROUPS[group][locale]}
                    </h2>
                    <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                        {UTILITY_LIST.filter((app) => app.group === group).map((app) => (
                            <li key={app.id}>
                                <button
                                    type="button"
                                    onClick={() => onOpen(app.id)}
                                    className="group flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border border-line bg-bg-0 px-2 py-4 transition-colors hover:border-accent-blue/50 hover:bg-bg-2 focus-visible:outline-2 focus-visible:outline-accent-blue"
                                >
                                    <span className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110 motion-reduce:transition-none">
                                        <AppIcon id={app.id} />
                                    </span>
                                    <span className="text-center font-mono text-xs text-ink">
                                        {appName(app.id, locale)}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            ))}
        </div>
    );
}
