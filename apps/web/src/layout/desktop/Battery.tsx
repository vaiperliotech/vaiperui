"use client";

import { useEffect, useState } from "react";

import { makeT } from "@/data/samples";
import type { Locale } from "@/i18n/config";

// `navigator.getBattery()` is not in TypeScript's DOM types: it only exists in Chromium browsers
type BatteryManager = EventTarget & {
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
};
type WithBattery = Navigator & {
    getBattery?: () => Promise<BatteryManager>;
    brave?: { isBrave: () => Promise<boolean> };
};

// What Brave answers to every site: its privacy protection hides the real battery, and the
// invented "full and plugged in" reading would be wrong for almost everyone.
const isGeneric = (b: BatteryManager) =>
    b.level === 1 &&
    b.charging &&
    b.chargingTime === 0 &&
    b.dischargingTime === Number.POSITIVE_INFINITY;

type Reading = { level: number; charging: boolean };

// The battery in the menu bar, like macOS: only in browsers that expose it (Chrome, Edge, Brave…).
export function Battery({ locale }: { locale: Locale }) {
    const t = makeT(locale);
    const [reading, setReading] = useState<Reading | null>(null);

    useEffect(() => {
        let battery: BatteryManager | undefined;
        let cancelled = false;
        let brave = false;
        let changed = false;

        const read = () => {
            if (!battery) return;
            // in Brave a fixed reading means "hidden", not "full": wait for a real change
            if (brave && !changed && isGeneric(battery)) return setReading(null);
            setReading({ level: battery.level, charging: battery.charging });
        };
        const onChange = () => {
            changed = true;
            read();
        };

        // a browser that throws instead of rejecting must not take the whole desktop down
        try {
            const nav = navigator as WithBattery;
            Promise.all([nav.getBattery?.(), nav.brave?.isBrave().catch(() => false)])
                .then(([manager, isBrave]) => {
                    if (cancelled || !manager) return;
                    brave = Boolean(isBrave);
                    battery = manager;
                    read();
                    manager.addEventListener("levelchange", onChange);
                    manager.addEventListener("chargingchange", onChange);
                })
                .catch(() => {
                    // blocked by a permissions policy: simply no battery in the bar
                });
        } catch {
            // same: no battery in the bar
        }

        return () => {
            cancelled = true;
            battery?.removeEventListener("levelchange", onChange);
            battery?.removeEventListener("chargingchange", onChange);
        };
    }, []);

    if (!reading) return null;

    const percent = Math.round(reading.level * 100);
    const low = percent <= 20 && !reading.charging;
    const label = `${t("Battery", "Bateria", "Batería")} ${percent}%${
        reading.charging ? `, ${t("charging", "carregando", "cargando")}` : ""
    }`;

    return (
        <span
            role="img"
            aria-label={label}
            title={label}
            className="flex items-center gap-1.5 text-ink-dim tabular-nums"
        >
            <span>{percent}%</span>
            <svg viewBox="0 0 26 12" className="h-3 w-[26px]" aria-hidden="true">
                <rect
                    x="0.75"
                    y="0.75"
                    width="21.5"
                    height="10.5"
                    rx="3"
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.55"
                    strokeWidth="1.2"
                />
                <rect
                    x="23"
                    y="4"
                    width="2"
                    height="4"
                    rx="1"
                    fill="currentColor"
                    fillOpacity="0.55"
                />
                <rect
                    x="2.4"
                    y="2.4"
                    width={Math.max(1.5, 18.2 * reading.level)}
                    height="7.2"
                    rx="1.8"
                    fill={low ? "#ff5f57" : reading.charging ? "#28c840" : "currentColor"}
                />
                {reading.charging ? (
                    <path d="M12.5 2.2 8.6 6.4h2.6l-.9 3.4 3.9-4.2h-2.6l.9-3.4Z" fill="#05070d" />
                ) : null}
            </svg>
        </span>
    );
}
