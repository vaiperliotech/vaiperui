"use client";

import { useState } from "react";
import { Button, Input, type InputMask, Select as VaiperSelect } from "vaiperui";

import { CodeBlock } from "@/components/CodeBlock";
import { makeT } from "@/data/samples";
import { Pills } from "../games/shared";
import { type AppProps, Label, Pane, Select, Toggle } from "./kit";

const COLORS = ["primary", "success", "warning", "danger"] as const;
const SIZES = ["sm", "md", "lg"] as const;
const RADII = ["none", "sm", "md", "lg", "full"] as const;
const BUTTON_VARIANTS = ["solid", "solid-inverse", "outlined", "outlined2", "transparent"] as const;
const HOVERS = ["none", "lift", "scale", "glow"] as const;
const ANIMATIONS = [
    "none",
    "float",
    "pulse",
    "shine",
    "wiggle",
    "jelly",
    "heartbeat",
    "gradient",
    "glow",
] as const;
const MASKS = [
    "none",
    "phone",
    "creditCard",
    "cardExpiry",
    "date",
    "time",
    "cpf",
    "cnpj",
    "cep",
] as const;

type Kind = "button" | "input" | "select";

// `<Button variant="solid" …>` with only the props that differ from the defaults
function jsx(
    tag: string,
    props: Array<[string, string | boolean, string | boolean]>,
    children?: string,
) {
    const parts = props
        .filter(([, value, fallback]) => value !== fallback && value !== "" && value !== false)
        .map(([name, value]) => (value === true ? name : `${name}="${value}"`));
    const open =
        parts.length > 2
            ? `<${tag}\n  ${parts.join("\n  ")}\n`
            : `<${tag}${parts.length ? ` ${parts.join(" ")}` : ""}`;
    return children === undefined
        ? `${open}${parts.length > 2 ? "" : " "}/>`
        : `${open}>${children}</${tag}>`;
}

export function Playground({ locale }: AppProps) {
    const t = makeT(locale);
    const [kind, setKind] = useState<Kind>("button");
    const [dark, setDark] = useState(false);
    const [variant, setVariant] = useState("solid");
    const [color, setColor] = useState("primary");
    const [size, setSize] = useState("md");
    const [radius, setRadius] = useState("md");
    const [hover, setHover] = useState("none");
    const [animation, setAnimation] = useState("none");
    const [ripple, setRipple] = useState(false);
    const [mask, setMask] = useState("none");
    const [searchable, setSearchable] = useState(false);
    const [custom, setCustom] = useState("");

    const change = (next: Kind) => {
        setKind(next);
        setVariant(next === "button" ? "solid" : next === "input" ? "ring" : "default");
    };

    const variants =
        kind === "button"
            ? BUTTON_VARIANTS
            : kind === "input"
              ? (["ring", "outline"] as const)
              : (["default", "detailed"] as const);
    const defaultVariant = variants[0];
    const customProp = custom.trim();
    const label = t("Label", "Rótulo", "Etiqueta");
    const countries = [
        { value: "br", label: t("Brazil", "Brasil", "Brasil") },
        { value: "us", label: t("United States", "Estados Unidos", "Estados Unidos") },
        { value: "pt", label: "Portugal" },
    ];

    const shared = { variant, size, radius } as const;
    const tint = customProp
        ? ({ customColor: customProp } as const)
        : ({ variantColor: color } as never);

    const code =
        kind === "button"
            ? jsx(
                  "Button",
                  [
                      ["variant", variant, defaultVariant],
                      ["variantColor", customProp ? "" : color, "primary"],
                      ["customColor", customProp, ""],
                      ["size", size, "md"],
                      ["radius", radius, "md"],
                      ["hover", hover, "none"],
                      ["animation", animation, "none"],
                      ["ripple", ripple, false],
                  ],
                  t("Click me", "Clique aqui", "Haz clic"),
              )
            : kind === "input"
              ? jsx("Input", [
                    ["variant", variant, defaultVariant],
                    ["variantColor", customProp ? "" : color, "primary"],
                    ["customColor", customProp, ""],
                    ["size", size, "md"],
                    ["radius", radius, "md"],
                    ["mask", mask === "none" ? "" : mask, ""],
                    ["label", label, ""],
                ])
              : jsx("Select", [
                    ["variant", variant, defaultVariant],
                    ["variantColor", customProp ? "" : color, "primary"],
                    ["customColor", customProp, ""],
                    ["size", size, "md"],
                    ["radius", radius, "md"],
                    ["searchable", searchable, false],
                    ["label", label, ""],
                    ["options", "{options}", ""],
                ]);

    return (
        <Pane className="flex flex-col gap-4 md:flex-row">
            <div className="flex w-full shrink-0 flex-col gap-3 md:w-52">
                <Pills
                    value={kind}
                    options={[
                        { id: "button", label: "Button" },
                        { id: "input", label: "Input" },
                        { id: "select", label: "Select" },
                    ]}
                    onChange={change}
                />
                <div>
                    <Label htmlFor="pg-variant">variant</Label>
                    <Select
                        id="pg-variant"
                        value={variant}
                        options={variants}
                        onChange={setVariant}
                    />
                </div>
                <div>
                    <Label htmlFor="pg-color">variantColor</Label>
                    <Select id="pg-color" value={color} options={COLORS} onChange={setColor} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label htmlFor="pg-size">size</Label>
                        <Select id="pg-size" value={size} options={SIZES} onChange={setSize} />
                    </div>
                    <div>
                        <Label htmlFor="pg-radius">radius</Label>
                        <Select
                            id="pg-radius"
                            value={radius}
                            options={RADII}
                            onChange={setRadius}
                        />
                    </div>
                </div>
                {kind === "button" ? (
                    <>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label htmlFor="pg-hover">hover</Label>
                                <Select
                                    id="pg-hover"
                                    value={hover}
                                    options={HOVERS}
                                    onChange={setHover}
                                />
                            </div>
                            <div>
                                <Label htmlFor="pg-anim">animation</Label>
                                <Select
                                    id="pg-anim"
                                    value={animation}
                                    options={ANIMATIONS}
                                    onChange={setAnimation}
                                />
                            </div>
                        </div>
                        <Toggle label="ripple" checked={ripple} onChange={setRipple} />
                    </>
                ) : null}
                {kind === "input" ? (
                    <div>
                        <Label htmlFor="pg-mask">mask</Label>
                        <Select id="pg-mask" value={mask} options={MASKS} onChange={setMask} />
                    </div>
                ) : null}
                {kind === "select" ? (
                    <Toggle label="searchable" checked={searchable} onChange={setSearchable} />
                ) : null}
                <div>
                    <Label htmlFor="pg-custom">customColor</Label>
                    <input
                        id="pg-custom"
                        value={custom}
                        onChange={(event) => setCustom(event.target.value)}
                        placeholder="#ff6600"
                        spellCheck={false}
                        className="h-8 w-full rounded-md border border-line-strong bg-bg-0 px-2 font-mono text-xs text-ink outline-none focus:border-accent-blue"
                    />
                </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-ink-faint uppercase tracking-wider">
                        {t("Preview", "Pré-visualização", "Vista previa")}
                    </span>
                    <Pills
                        value={dark ? "dark" : "light"}
                        options={[
                            { id: "light", label: t("Light", "Claro", "Claro") },
                            { id: "dark", label: t("Dark", "Escuro", "Oscuro") },
                        ]}
                        onChange={(next) => setDark(next === "dark")}
                    />
                </div>
                <div className={dark ? "dark" : ""}>
                    <div
                        className={`flex min-h-48 items-center justify-center rounded-xl border border-line-strong p-6 ${
                            dark ? "bg-neutral-950" : "bg-white"
                        }`}
                    >
                        {kind === "button" ? (
                            <Button
                                key={`${hover}${animation}${ripple}`}
                                {...(shared as object)}
                                {...tint}
                                hover={hover as never}
                                animation={animation as never}
                                ripple={ripple}
                            >
                                {t("Click me", "Clique aqui", "Haz clic")}
                            </Button>
                        ) : kind === "input" ? (
                            <div className="w-full max-w-xs">
                                <Input
                                    key={mask}
                                    {...(shared as object)}
                                    {...tint}
                                    label={label}
                                    mask={mask === "none" ? undefined : (mask as InputMask)}
                                    placeholder="…"
                                />
                            </div>
                        ) : (
                            <div className="w-full max-w-xs">
                                <VaiperSelect
                                    {...(shared as object)}
                                    {...tint}
                                    label={label}
                                    placeholder={t("Choose", "Escolha", "Elige")}
                                    options={countries}
                                    searchable={searchable}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <CodeBlock
                    code={`import { ${kind === "button" ? "Button" : kind === "input" ? "Input" : "Select"} } from "vaiperui";\n\n${code}`}
                    className="rounded-xl border border-line bg-bg-0 p-4"
                />
            </div>
        </Pane>
    );
}
