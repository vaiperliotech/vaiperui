"use client";

import { useState } from "react";

import { makeT } from "@/data/samples";
import { Pills } from "../games/shared";
import { type AppProps, CopyButton, fieldClass, Label, Pane, Select } from "./kit";

type Tab = "color" | "size" | "temperature" | "length" | "weight";

// ---- color ----
type Rgb = [number, number, number];

function parseColor(input: string): Rgb | null {
    const text = input.trim().toLowerCase();
    const hex = text.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/);
    if (hex?.[1]) {
        const value = hex[1].length === 3 ? [...hex[1]].map((c) => c + c).join("") : hex[1];
        return [0, 2, 4].map((i) => Number.parseInt(value.slice(i, i + 2), 16)) as Rgb;
    }
    const rgb = text.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/);
    if (rgb)
        return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])].map((n) => Math.min(255, n)) as Rgb;
    const hsl = text.match(/^hsla?\(\s*(\d+)[\s,]+(\d+)%?[\s,]+(\d+)%?/);
    if (hsl) {
        const h = Number(hsl[1]) % 360;
        const s = Math.min(100, Number(hsl[2])) / 100;
        const l = Math.min(100, Number(hsl[3])) / 100;
        const a = s * Math.min(l, 1 - l);
        const f = (n: number) => {
            const k = (n + h / 30) % 12;
            return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
        };
        return [f(0), f(8), f(4)];
    }
    return null;
}

function toHsl([r, g, b]: Rgb): [number, number, number] {
    const [rn, gn, bn] = [r / 255, g / 255, b / 255];
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;
    const d = max - min;
    if (d === 0) return [0, 0, Math.round(l * 100)];
    const s = d / (1 - Math.abs(2 * l - 1));
    const h = max === rn ? ((gn - bn) / d) % 6 : max === gn ? (bn - rn) / d + 2 : (rn - gn) / d + 4;
    return [Math.round((h * 60 + 360) % 360), Math.round(s * 100), Math.round(l * 100)];
}

// ---- units: every unit is a factor to a base unit ----
const UNITS = {
    length: {
        m: 1,
        km: 1000,
        cm: 0.01,
        mm: 0.001,
        mi: 1609.344,
        yd: 0.9144,
        ft: 0.3048,
        in: 0.0254,
    },
    weight: { kg: 1, g: 0.001, mg: 0.000001, t: 1000, lb: 0.45359237, oz: 0.028349523 },
} as const;

const trim = (value: number) =>
    Number.isFinite(value) ? String(Number(value.toPrecision(10))) : "";

function UnitConverter({
    units,
    locale,
}: {
    units: Record<string, number>;
    locale: AppProps["locale"];
}) {
    const names = Object.keys(units);
    const [value, setValue] = useState("1");
    const [from, setFrom] = useState(names[0] ?? "");
    const [to, setTo] = useState(names[1] ?? "");
    const result = trim((Number(value) * (units[from] ?? 1)) / (units[to] ?? 1));

    return (
        <div className="flex w-full flex-col gap-3">
            <div className="grid grid-cols-[1fr_6rem] gap-2">
                <div>
                    <Label htmlFor="uc-value">{makeT(locale)("Value", "Valor", "Valor")}</Label>
                    <input
                        id="uc-value"
                        type="number"
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        className={fieldClass}
                    />
                </div>
                <div>
                    <Label htmlFor="uc-from">{makeT(locale)("From", "De", "De")}</Label>
                    <Select id="uc-from" value={from} options={names} onChange={setFrom} />
                </div>
            </div>
            <div className="grid grid-cols-[1fr_6rem] gap-2">
                <div className="flex items-center justify-between rounded-lg border border-line bg-bg-0 px-3 py-2 font-mono text-lg text-ink">
                    <span className="truncate tabular-nums">{result || "–"}</span>
                    <CopyButton text={result} locale={locale} />
                </div>
                <div>
                    <Label htmlFor="uc-to">{makeT(locale)("To", "Para", "A")}</Label>
                    <Select id="uc-to" value={to} options={names} onChange={setTo} />
                </div>
            </div>
        </div>
    );
}

export function Converter({ locale }: AppProps) {
    const t = makeT(locale);
    const [tab, setTab] = useState<Tab>("color");

    // color
    const [color, setColor] = useState("#4da3ff");
    const rgb = parseColor(color);
    const hex = rgb ? `#${rgb.map((n) => n.toString(16).padStart(2, "0")).join("")}` : "";
    const hsl = rgb ? toHsl(rgb) : null;

    // size
    const [base, setBase] = useState(16);
    const [px, setPx] = useState("16");
    const rem = trim(Number(px) / (base || 16));

    // temperature (always kept as Celsius underneath)
    const [celsius, setCelsius] = useState("20");
    const c = Number(celsius);
    const setFromTemp = (kind: "c" | "f" | "k", raw: string) => {
        const n = Number(raw);
        setCelsius(
            raw === ""
                ? ""
                : trim(kind === "c" ? n : kind === "f" ? ((n - 32) * 5) / 9 : n - 273.15),
        );
    };

    return (
        <Pane className="flex flex-col gap-4">
            <Pills
                value={tab}
                options={[
                    { id: "color", label: t("Color", "Cor", "Color") },
                    { id: "size", label: "px ↔ rem" },
                    { id: "temperature", label: t("Temperature", "Temperatura", "Temperatura") },
                    { id: "length", label: t("Length", "Comprimento", "Longitud") },
                    { id: "weight", label: t("Weight", "Peso", "Peso") },
                ]}
                onChange={setTab}
            />

            {tab === "color" ? (
                <div className="flex flex-col gap-3">
                    <div className="flex items-end gap-3">
                        <div className="flex-1">
                            <Label htmlFor="cv-color">
                                {t(
                                    "Any format: #hex, rgb() or hsl()",
                                    "Qualquer formato: #hex, rgb() ou hsl()",
                                    "Cualquier formato: #hex, rgb() o hsl()",
                                )}
                            </Label>
                            <input
                                id="cv-color"
                                value={color}
                                onChange={(event) => setColor(event.target.value)}
                                spellCheck={false}
                                className={fieldClass}
                            />
                        </div>
                        <span
                            className="size-10 shrink-0 rounded-lg border border-line-strong"
                            style={{ background: rgb ? hex : "transparent" }}
                        />
                    </div>
                    {rgb && hsl ? (
                        <div className="flex flex-col gap-2">
                            {[
                                ["HEX", hex],
                                ["RGB", `rgb(${rgb.join(", ")})`],
                                ["HSL", `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`],
                            ].map(([name, value]) => (
                                <div
                                    key={name}
                                    className="flex items-center justify-between rounded-lg border border-line bg-bg-0 px-3 py-2 font-mono text-sm"
                                >
                                    <span className="text-ink-faint">{name}</span>
                                    <span className="text-ink">{value}</span>
                                    <CopyButton text={value as string} locale={locale} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="font-mono text-ink-faint text-xs">
                            {t(
                                "Not a color yet.",
                                "Ainda não é uma cor.",
                                "Todavía no es un color.",
                            )}
                        </p>
                    )}
                </div>
            ) : null}

            {tab === "size" ? (
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label htmlFor="sz-px">px</Label>
                        <input
                            id="sz-px"
                            type="number"
                            value={px}
                            onChange={(event) => setPx(event.target.value)}
                            className={fieldClass}
                        />
                    </div>
                    <div>
                        <Label htmlFor="sz-rem">rem</Label>
                        <input
                            id="sz-rem"
                            type="number"
                            step="0.0625"
                            value={rem}
                            onChange={(event) =>
                                setPx(trim(Number(event.target.value) * (base || 16)))
                            }
                            className={fieldClass}
                        />
                    </div>
                    <div className="col-span-2">
                        <Label htmlFor="sz-base">
                            {t(
                                "Base font size (px)",
                                "Tamanho da fonte base (px)",
                                "Tamaño de fuente base (px)",
                            )}
                        </Label>
                        <input
                            id="sz-base"
                            type="number"
                            value={base}
                            min={1}
                            onChange={(event) => setBase(Number(event.target.value))}
                            className={fieldClass}
                        />
                    </div>
                </div>
            ) : null}

            {tab === "temperature" ? (
                <div className="grid grid-cols-3 gap-3">
                    {(
                        [
                            ["c", "°C", celsius],
                            ["f", "°F", celsius === "" ? "" : trim((c * 9) / 5 + 32)],
                            ["k", "K", celsius === "" ? "" : trim(c + 273.15)],
                        ] as const
                    ).map(([kind, label, value]) => (
                        <div key={kind}>
                            <Label htmlFor={`tp-${kind}`}>{label}</Label>
                            <input
                                id={`tp-${kind}`}
                                type="number"
                                value={value}
                                onChange={(event) => setFromTemp(kind, event.target.value)}
                                className={fieldClass}
                            />
                        </div>
                    ))}
                </div>
            ) : null}

            {tab === "length" ? <UnitConverter units={UNITS.length} locale={locale} /> : null}
            {tab === "weight" ? <UnitConverter units={UNITS.weight} locale={locale} /> : null}
        </Pane>
    );
}
