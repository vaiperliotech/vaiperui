"use client";

import { useCallback, useState } from "react";
import { Button } from "vaiperui";

import { type GameProps, GameShell, PillButton, StatBar, useBest } from "./shared";

const ROUNDS = 5;

type Hsl = { h: number; s: number; l: number };
const css = ({ h, s, l }: Hsl) => `hsl(${h} ${s}% ${l}%)`;

function randomColor(): Hsl {
    return {
        h: Math.floor(Math.random() * 360),
        s: 35 + Math.floor(Math.random() * 60),
        l: 25 + Math.floor(Math.random() * 50),
    };
}

// how far two colors are, as a 0-100 score: hue wraps around, so 350 and 10 are close
function accuracy(a: Hsl, b: Hsl): number {
    const dh = Math.min(Math.abs(a.h - b.h), 360 - Math.abs(a.h - b.h)) / 180;
    const ds = Math.abs(a.s - b.s) / 100;
    const dl = Math.abs(a.l - b.l) / 100;
    const distance = Math.sqrt((dh * 1.4) ** 2 + ds ** 2 + (dl * 1.2) ** 2) / 1.9;
    return Math.max(0, Math.round(100 - distance * 100 * 1.6));
}

function Slider({
    label,
    value,
    max,
    track,
    onChange,
}: {
    label: string;
    value: number;
    max: number;
    track: string;
    onChange: (value: number) => void;
}) {
    return (
        <label className="flex items-center gap-3 font-mono text-xs text-ink-dim">
            <span className="w-24 shrink-0">{label}</span>
            <input
                type="range"
                min={0}
                max={max}
                value={value}
                onChange={(event) => onChange(Number(event.target.value))}
                style={{ background: track }}
                className="h-2 w-full cursor-pointer appearance-none rounded-full accent-accent-blue"
            />
            <span className="w-8 text-right text-ink tabular-nums">{value}</span>
        </label>
    );
}

export function ColorMatch({ active, t }: GameProps) {
    const ui = t.ui;
    const c = t.colormatch;
    const [round, setRound] = useState(1);
    const [target, setTarget] = useState<Hsl>(() => randomColor());
    const [mine, setMine] = useState<Hsl>({ h: 180, s: 60, l: 50 });
    const [checked, setChecked] = useState<number | null>(null);
    const [total, setTotal] = useState(0);
    const [done, setDone] = useState(false);
    const [best, report] = useBest("colormatch-best");

    const check = useCallback(() => {
        const score = accuracy(target, mine);
        setChecked(score);
        setTotal((value) => value + score);
    }, [target, mine]);

    function next() {
        if (round >= ROUNDS) {
            setDone(true);
            report(total);
            return;
        }
        setRound((r) => r + 1);
        setTarget(randomColor());
        setChecked(null);
    }

    function restart() {
        setRound(1);
        setTarget(randomColor());
        setMine({ h: 180, s: 60, l: 50 });
        setChecked(null);
        setTotal(0);
        setDone(false);
    }

    const hueTrack =
        "linear-gradient(to right, hsl(0 80% 55%), hsl(60 80% 55%), hsl(120 80% 55%), hsl(180 80% 55%), hsl(240 80% 55%), hsl(300 80% 55%), hsl(360 80% 55%))";

    return (
        <GameShell gap="gap-4">
            <StatBar
                width={340}
                items={[
                    [ui.round, `${Math.min(round, ROUNDS)}/${ROUNDS}`],
                    [ui.score, total],
                    [ui.best, best ?? "–"],
                ]}
            />
            <div className="flex w-[340px] overflow-hidden rounded-xl border border-line-strong">
                <div className="flex h-28 flex-1 items-end p-2" style={{ background: css(target) }}>
                    <span className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-white">
                        {c.target}
                    </span>
                </div>
                <div className="flex h-28 flex-1 items-end p-2" style={{ background: css(mine) }}>
                    <span className="rounded bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-white">
                        {c.yours}
                    </span>
                </div>
            </div>

            <div className="flex w-[340px] flex-col gap-2.5">
                <Slider
                    label={c.hue}
                    value={mine.h}
                    max={360}
                    track={hueTrack}
                    onChange={(h) => !checked && setMine({ ...mine, h })}
                />
                <Slider
                    label={c.saturation}
                    value={mine.s}
                    max={100}
                    track={`linear-gradient(to right, hsl(${mine.h} 0% ${mine.l}%), hsl(${mine.h} 100% ${mine.l}%))`}
                    onChange={(s) => !checked && setMine({ ...mine, s })}
                />
                <Slider
                    label={c.lightness}
                    value={mine.l}
                    max={100}
                    track={`linear-gradient(to right, #000, hsl(${mine.h} ${mine.s}% 50%), #fff)`}
                    onChange={(l) => !checked && setMine({ ...mine, l })}
                />
            </div>

            <div className="flex h-10 items-center gap-3">
                {done ? (
                    <>
                        <span aria-live="polite" className="font-mono text-xs text-[#28c840]">
                            {ui.score} {total}/{ROUNDS * 100}
                        </span>
                        <PillButton onClick={restart}>{ui.newGame}</PillButton>
                    </>
                ) : checked === null ? (
                    <Button
                        size="sm"
                        customColor="#4da3ff"
                        onClick={check}
                        disabled={!active && false}
                    >
                        {c.check}
                    </Button>
                ) : (
                    <>
                        <span aria-live="polite" className="font-mono text-xs text-ink">
                            {checked >= 97 ? c.perfect : `${c.accuracy} ${checked}%`}
                        </span>
                        <Button size="sm" customColor={css(target)} onClick={next}>
                            {round >= ROUNDS ? ui.over : ui.next}
                        </Button>
                    </>
                )}
            </div>
        </GameShell>
    );
}
