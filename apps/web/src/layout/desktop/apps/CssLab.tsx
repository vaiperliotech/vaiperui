"use client";

import { useState } from "react";

import { CodeBlock } from "@/components/CodeBlock";
import { makeT } from "@/data/samples";
import { Pills } from "../games/shared";
import { type AppProps, Label, Pane, Range, Select, Toggle } from "./kit";

type Tab = "gradient" | "shadow";

function Swatch({
    id,
    value,
    onChange,
}: {
    id: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <input
            id={id}
            type="color"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="size-8 cursor-pointer rounded-md border border-line-strong bg-transparent p-0.5"
        />
    );
}

const rgba = (hex: string, alpha: number) => {
    const n = Number.parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

// Two generators with a live preview: a gradient and a box-shadow, as CSS and as a Tailwind class.
export function CssLab({ locale }: AppProps) {
    const t = makeT(locale);
    const [tab, setTab] = useState<Tab>("gradient");

    // gradient
    const [kind, setKind] = useState("linear");
    const [angle, setAngle] = useState(135);
    const [a, setA] = useState("#4da3ff");
    const [b, setB] = useState("#a78bfa");
    const [c, setC] = useState("#28c840");
    const [three, setThree] = useState(false);
    const stops = three ? `${a}, ${b}, ${c}` : `${a}, ${b}`;
    const gradient =
        kind === "linear"
            ? `linear-gradient(${angle}deg, ${stops})`
            : kind === "radial"
              ? `radial-gradient(circle, ${stops})`
              : `conic-gradient(from ${angle}deg, ${stops})`;

    // shadow
    const [x, setX] = useState(0);
    const [y, setY] = useState(12);
    const [blur, setBlur] = useState(30);
    const [spread, setSpread] = useState(-6);
    const [color, setColor] = useState("#000000");
    const [alpha, setAlpha] = useState(0.45);
    const [inset, setInset] = useState(false);
    const shadow = `${inset ? "inset " : ""}${x}px ${y}px ${blur}px ${spread}px ${rgba(color, alpha)}`;

    const css = tab === "gradient" ? `background: ${gradient};` : `box-shadow: ${shadow};`;
    const tailwind =
        tab === "gradient"
            ? `bg-[${gradient.replace(/, /g, ",").replace(/ /g, "_")}]`
            : `shadow-[${shadow.replace(/, /g, ",").replace(/ /g, "_")}]`;

    return (
        <Pane className="flex flex-col gap-4 md:flex-row">
            <div className="flex w-full shrink-0 flex-col gap-3 md:w-72">
                <Pills
                    value={tab}
                    options={[
                        { id: "gradient", label: t("Gradient", "Gradiente", "Degradado") },
                        { id: "shadow", label: t("Shadow", "Sombra", "Sombra") },
                    ]}
                    onChange={setTab}
                />
                {tab === "gradient" ? (
                    <>
                        <div>
                            <Label htmlFor="cl-kind">{t("Type", "Tipo", "Tipo")}</Label>
                            <Select
                                id="cl-kind"
                                value={kind}
                                options={["linear", "radial", "conic"]}
                                onChange={setKind}
                            />
                        </div>
                        {kind !== "radial" ? (
                            <Range
                                label={t("Angle", "Ângulo", "Ángulo")}
                                value={angle}
                                min={0}
                                max={360}
                                suffix="°"
                                onChange={setAngle}
                            />
                        ) : null}
                        <div className="flex items-center gap-2">
                            <Swatch id="cl-a" value={a} onChange={setA} />
                            <Swatch id="cl-b" value={b} onChange={setB} />
                            {three ? <Swatch id="cl-c" value={c} onChange={setC} /> : null}
                        </div>
                        <Toggle
                            label={t("Three colors", "Três cores", "Tres colores")}
                            checked={three}
                            onChange={setThree}
                        />
                    </>
                ) : (
                    <>
                        <Range label="x" value={x} min={-60} max={60} suffix="px" onChange={setX} />
                        <Range label="y" value={y} min={-60} max={60} suffix="px" onChange={setY} />
                        <Range
                            label="blur"
                            value={blur}
                            min={0}
                            max={100}
                            suffix="px"
                            onChange={setBlur}
                        />
                        <Range
                            label="spread"
                            value={spread}
                            min={-40}
                            max={40}
                            suffix="px"
                            onChange={setSpread}
                        />
                        <Range
                            label={t("Opacity", "Opacidade", "Opacidad")}
                            value={alpha}
                            min={0}
                            max={1}
                            step={0.05}
                            onChange={setAlpha}
                        />
                        <div className="flex items-center justify-between">
                            <Swatch id="cl-color" value={color} onChange={setColor} />
                            <Toggle label="inset" checked={inset} onChange={setInset} />
                        </div>
                    </>
                )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex min-h-56 items-center justify-center rounded-xl border border-line-strong bg-[#e8ecf5] p-8">
                    <div
                        role="img"
                        aria-label={t("Preview", "Pré-visualização", "Vista previa")}
                        className="size-36 rounded-2xl bg-white"
                        style={
                            tab === "gradient" ? { background: gradient } : { boxShadow: shadow }
                        }
                    />
                </div>
                <CodeBlock
                    alwaysShowCopy
                    code={css}
                    className="rounded-xl border border-line bg-bg-0 p-4 pr-20"
                />
                <div>
                    <Label>Tailwind</Label>
                    <CodeBlock
                        code={tailwind}
                        className="break-all rounded-xl border border-line bg-bg-0 p-4 pr-20"
                    />
                </div>
            </div>
        </Pane>
    );
}
