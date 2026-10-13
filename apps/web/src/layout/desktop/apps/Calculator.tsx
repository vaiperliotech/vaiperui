"use client";

import { useCallback, useState } from "react";

import { useGameKeys } from "../games/shared";
import type { AppProps } from "./kit";

type Op = "+" | "-" | "×" | "÷";

const compute = (a: number, b: number, op: Op) =>
    op === "+" ? a + b : op === "-" ? a - b : op === "×" ? a * b : b === 0 ? Number.NaN : a / b;

// avoids 0.1 + 0.2 = 0.30000000000000004
const clean = (value: number) =>
    Number.isFinite(value) ? String(Number(value.toPrecision(12))) : "Error";

const KEYS = [
    ["AC", "±", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
];

export function Calculator({ active }: AppProps) {
    const [display, setDisplay] = useState("0");
    const [stored, setStored] = useState<number | null>(null);
    const [op, setOp] = useState<Op | null>(null);
    const [fresh, setFresh] = useState(true);

    const press = useCallback(
        (key: string) => {
            const value = Number(display);
            if (/^\d$/.test(key)) {
                setDisplay(
                    fresh || display === "0" ? key : display.length < 14 ? display + key : display,
                );
                setFresh(false);
            } else if (key === ".") {
                if (fresh) setDisplay("0.");
                else if (!display.includes(".")) setDisplay(`${display}.`);
                setFresh(false);
            } else if (key === "AC") {
                setDisplay("0");
                setStored(null);
                setOp(null);
                setFresh(true);
            } else if (key === "±") {
                if (display !== "0" && display !== "Error")
                    setDisplay(display.startsWith("-") ? display.slice(1) : `-${display}`);
            } else if (key === "%") {
                setDisplay(clean(value / 100));
                setFresh(true);
            } else if (key === "=") {
                if (op !== null && stored !== null) {
                    setDisplay(clean(compute(stored, value, op)));
                    setStored(null);
                    setOp(null);
                    setFresh(true);
                }
            } else {
                // an operator: finish the pending operation first, so 2 + 3 + 4 chains
                const next =
                    op !== null && stored !== null && !fresh ? compute(stored, value, op) : value;
                setStored(next);
                setDisplay(clean(next));
                setOp(key as Op);
                setFresh(true);
            }
        },
        [display, stored, op, fresh],
    );

    useGameKeys(active, (event) => {
        const map: Record<string, string> = {
            "*": "×",
            "/": "÷",
            Enter: "=",
            Escape: "AC",
            Delete: "AC",
        };
        if (event.key === "Backspace") {
            event.preventDefault();
            setDisplay((current) => (current.length > 1 && !fresh ? current.slice(0, -1) : "0"));
            return;
        }
        const key = map[event.key] ?? event.key;
        if (/^[\d.+\-×÷=%]$/.test(key) || key === "AC") {
            event.preventDefault();
            press(key);
        }
    });

    return (
        <div className="flex h-full flex-col gap-3 bg-bg-1 p-3">
            <output
                aria-live="polite"
                className="flex h-20 items-end justify-end overflow-hidden rounded-xl bg-bg-0 px-4 pb-2 font-light font-mono text-4xl text-ink tabular-nums"
                style={{ fontSize: display.length > 9 ? "1.6rem" : undefined }}
            >
                {display}
            </output>
            <div className="grid flex-1 grid-cols-4 gap-2">
                {KEYS.flat().map((key) => {
                    const operator = ["+", "-", "×", "÷", "="].includes(key);
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => press(key)}
                            aria-pressed={operator && key === op && fresh ? true : undefined}
                            className={`cursor-pointer rounded-xl font-mono text-lg transition-colors ${key === "0" ? "col-span-2" : ""} ${
                                operator
                                    ? "bg-[#febc2e] text-[#05070d] hover:bg-[#ffc94d] aria-pressed:bg-white"
                                    : ["AC", "±", "%"].includes(key)
                                      ? "bg-bg-3 text-ink hover:bg-bg-2"
                                      : "bg-bg-2 text-ink hover:bg-bg-3"
                            }`}
                        >
                            {key}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
