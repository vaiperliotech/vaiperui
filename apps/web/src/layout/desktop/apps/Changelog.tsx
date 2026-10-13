"use client";

import { COMPONENT_NAMES } from "@/data/guides";
import { makeT } from "@/data/samples";
import { GITHUB_URL } from "@/lib/site";
import { type AppProps, Pane } from "./kit";

// "About this Mac", for the library: what is installed, then what changed in each version.
export function Changelog({ locale, version }: AppProps & { version: string }) {
    const t = makeT(locale);

    const system: Array<[string, string]> = [
        [t("Version", "Versão", "Versión"), `v${version}`],
        [t("License", "Licença", "Licencia"), "MIT"],
        [t("Components", "Componentes", "Componentes"), Object.values(COMPONENT_NAMES).join(", ")],
        [t("Requires", "Requer", "Requiere"), "React 19+ · Tailwind CSS v4"],
        [t("Languages", "Idiomas", "Idiomas"), "English · Português · Español"],
    ];

    const releases = [
        {
            version: "1.0.0-beta",
            label: t("First public beta", "Primeira beta pública", "Primera beta pública"),
            notes: [
                t(
                    "Button, Input and Select: typed, accessible, with light and dark themes.",
                    "Button, Input e Select: tipados, acessíveis, com tema claro e escuro.",
                    "Button, Input y Select: tipados, accesibles, con tema claro y oscuro.",
                ),
                t(
                    "Input masks built in: phone, credit card, date, time, CPF, CNPJ, CEI and CEP.",
                    "Máscaras no Input: telefone, cartão, data, hora, CPF, CNPJ, CEI e CEP.",
                    "Máscaras en el Input: teléfono, tarjeta, fecha, hora, CPF, CNPJ, CEI y CEP.",
                ),
                t(
                    "customColor on every component, with a { light, dark } pair.",
                    "customColor em todos os componentes, com par { light, dark }.",
                    "customColor en todos los componentes, con par { light, dark }.",
                ),
                t(
                    "Button: ripple, hover effects and 11 animations.",
                    "Button: ripple, efeitos de hover e 11 animações.",
                    "Button: ripple, efectos de hover y 11 animaciones.",
                ),
                t(
                    "Select: menu in a portal that is never clipped, search, a detailed style and translatable texts.",
                    "Select: menu em portal que nunca é cortado, busca, estilo detalhado e textos traduzíveis.",
                    "Select: menú en un portal que nunca se recorta, búsqueda, estilo detallado y textos traducibles.",
                ),
            ],
        },
    ];

    return (
        <Pane className="flex flex-col gap-5">
            <div className="flex items-center gap-4">
                <span className="flex size-16 items-center justify-center rounded-2xl border border-line-strong bg-gradient-to-br from-[#4da3ff] to-[#a78bfa] font-bold font-display text-[#05070d] text-2xl">
                    ui
                </span>
                <div>
                    <h2 className="font-display font-semibold text-2xl text-ink">
                        vaiper<span className="text-accent-blue">ui</span>
                    </h2>
                    <p className="font-mono text-ink-dim text-xs">
                        {t(
                            "React components for Tailwind CSS",
                            "Componentes React para Tailwind CSS",
                            "Componentes React para Tailwind CSS",
                        )}
                    </p>
                </div>
            </div>

            <dl className="divide-y divide-line rounded-xl border border-line bg-bg-0 font-mono text-xs">
                {system.map(([name, value]) => (
                    <div key={name} className="flex items-baseline justify-between gap-4 px-3 py-2">
                        <dt className="text-ink-faint">{name}</dt>
                        <dd className="text-right text-ink">{value}</dd>
                    </div>
                ))}
            </dl>

            <div className="flex flex-wrap gap-2 font-mono text-xs">
                {[
                    ["npm", "https://www.npmjs.com/package/vaiperui"],
                    ["GitHub", GITHUB_URL],
                ].map(([label, href]) => (
                    <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border border-line-strong px-3 py-1 text-ink-dim transition-colors hover:border-accent-blue/60 hover:text-ink"
                    >
                        {label} ↗
                    </a>
                ))}
            </div>

            <section aria-label="Changelog">
                <h3 className="mb-3 font-mono text-[10px] text-ink-faint uppercase tracking-wider">
                    Changelog
                </h3>
                <ol className="flex flex-col gap-4">
                    {releases.map((release) => (
                        <li
                            key={release.version}
                            className="rounded-xl border border-line bg-bg-0 p-4"
                        >
                            <div className="mb-2 flex items-center gap-2">
                                <span className="rounded-md bg-accent-blue/15 px-2 py-0.5 font-bold font-mono text-accent-blue text-xs">
                                    v{release.version}
                                </span>
                                <span className="font-mono text-ink-dim text-xs">
                                    {release.label}
                                </span>
                            </div>
                            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-ink-dim text-sm marker:text-ink-faint">
                                {release.notes.map((note) => (
                                    <li key={note}>{note}</li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ol>
            </section>
        </Pane>
    );
}
