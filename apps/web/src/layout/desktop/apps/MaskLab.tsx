"use client";

import { useEffect, useRef, useState } from "react";
import { Input, type InputMask } from "vaiperui";

import { makeT } from "@/data/samples";
import { Pills } from "../games/shared";
import { type AppProps, CopyButton, Label, Pane } from "./kit";

const MASKS: InputMask[] = [
    "phone",
    "creditCard",
    "cardExpiry",
    "date",
    "time",
    "cpf",
    "cnpj",
    "cei",
    "cep",
];

const SAMPLES: Record<InputMask, string> = {
    phone: "5511987654321",
    creditCard: "4111111111111111",
    cardExpiry: "1228",
    date: "31122025",
    time: "2359",
    cpf: "12345678901",
    cnpj: "12345678000199",
    cei: "123456789012",
    cep: "12345678",
};

function Row({ name, value, locale }: { name: string; value: string; locale: AppProps["locale"] }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-line bg-bg-0 px-3 py-2">
            <div className="min-w-0">
                <p className="font-mono text-[10px] text-ink-faint uppercase tracking-wider">
                    {name}
                </p>
                <p className="mt-0.5 truncate font-mono text-sm text-ink">{value || "–"}</p>
            </div>
            <CopyButton text={value} locale={locale} />
        </div>
    );
}

// An Input with each mask in turn: what you type, and what the mask makes of it.
export function MaskLab({ locale }: AppProps) {
    const t = makeT(locale);
    const [mask, setMask] = useState<InputMask>("phone");
    const [value, setValue] = useState("");
    const digits = value.replace(/\D/g, "");
    // the text the field shows is what onChange would emit, also after "fill an example"
    const holder = useRef<HTMLDivElement>(null);
    const [masked, setMasked] = useState("");
    // biome-ignore lint/correctness/useExhaustiveDependencies: value and mask are the triggers, the text is read from the DOM
    useEffect(() => {
        setMasked(holder.current?.querySelector("input")?.value ?? "");
    }, [value, mask]);

    return (
        <Pane className="flex flex-col gap-4">
            <div>
                <Label>mask</Label>
                <Pills
                    value={mask}
                    options={MASKS.map((id) => ({ id, label: id }))}
                    onChange={(next) => {
                        setMask(next);
                        setValue("");
                    }}
                />
            </div>
            <div className="rounded-xl border border-line-strong bg-white p-4 dark:bg-neutral-950">
                <div className="dark" ref={holder}>
                    <div className="rounded-lg bg-neutral-950 p-3">
                        <Input
                            key={mask}
                            label={t("Type here", "Digite aqui", "Escribe aquí")}
                            mask={mask}
                            value={value}
                            onChange={(event) => setValue(event.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <Row
                    name={t(
                        "Masked value (what onChange emits)",
                        "Valor com máscara (o que o onChange emite)",
                        "Valor con máscara (lo que emite onChange)",
                    )}
                    value={masked}
                    locale={locale}
                />
                <Row
                    name={t("Only the digits", "Só os dígitos", "Solo los dígitos")}
                    value={digits}
                    locale={locale}
                />
            </div>
            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={() => setValue(SAMPLES[mask])}
                    className="cursor-pointer rounded-full border border-line-strong px-3 py-1 font-mono text-xs text-ink-dim transition-colors hover:border-accent-blue/60 hover:text-ink"
                >
                    {t("Fill an example", "Preencher um exemplo", "Rellenar un ejemplo")}
                </button>
                <code className="font-mono text-[11px] text-ink-faint">{`<Input mask="${mask}" />`}</code>
            </div>
        </Pane>
    );
}
