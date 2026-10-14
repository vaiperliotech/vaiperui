"use client";

import type { DataConnection, Peer } from "peerjs";
import { useEffect, useRef, useState } from "react";

import { makeT } from "@/data/samples";
import type { Locale } from "@/i18n/config";
import { Overlay, PillButton } from "./shared";

export const CODE_LENGTH = 7;

export type Net = {
    phase: "idle" | "waiting" | "connected";
    role: "host" | "guest";
    code: string;
    error: string;
};

export type Room<M> = {
    net: Net;
    /** Both players are connected. */
    live: boolean;
    isHost: boolean;
    isGuest: boolean;
    create: () => Promise<void>;
    join: (code: string) => Promise<void>;
    /** Closes the room. `error` is shown in the lobby. */
    leave: (error?: string) => void;
    send: (message: M) => void;
};

const IDLE: Net = { phase: "idle", role: "host", code: "", error: "" };
const randomCode = () =>
    String(Math.floor(Math.random() * 10 ** CODE_LENGTH)).padStart(CODE_LENGTH, "0");

/** A small seeded generator, so both players of a race get the same course. */
export function seeded(seed: number) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// A room for two over WebRTC (PeerJS). The PeerJS broker only introduces the two browsers; what
// the game sends goes straight from one to the other. The host creates the code, the guest joins.
export function useRoom<M>(
    game: string,
    locale: Locale,
    onMessage: (message: M) => void,
    onLost: () => void,
): Room<M> {
    const tr = makeT(locale);
    const [net, setNet] = useState<Net>(IDLE);
    const peer = useRef<Peer | null>(null);
    const conn = useRef<DataConnection | null>(null);
    const latest = useRef({ onMessage, onLost });
    latest.current = { onMessage, onLost };
    const prefix = `vaiperui-${game}-`;

    function leave(error = "") {
        // detached first, so closing it does not read as the opponent leaving
        const link = conn.current;
        conn.current = null;
        link?.close();
        peer.current?.destroy();
        peer.current = null;
        setNet({ ...IDLE, error });
    }

    function attach(link: DataConnection) {
        conn.current = link;
        link.on("open", () => setNet((n) => ({ ...n, phase: "connected" })));
        link.on("close", () => {
            if (conn.current !== link) return;
            leave(tr("Your opponent left.", "O oponente saiu.", "Tu oponente se fue."));
            latest.current.onLost();
        });
        link.on("data", (raw) => latest.current.onMessage(raw as M));
    }

    async function create() {
        leave();
        const { Peer } = await import("peerjs");
        const code = randomCode();
        const host = new Peer(prefix + code);
        peer.current = host;
        setNet({ phase: "waiting", role: "host", code, error: "" });
        host.on("connection", (link) => (conn.current ? link.close() : attach(link)));
        host.on("error", () =>
            leave(
                tr(
                    "Could not open a room.",
                    "Não foi possível criar a sala.",
                    "No se pudo crear la sala.",
                ),
            ),
        );
    }

    async function join(code: string) {
        if (code.length !== CODE_LENGTH) return;
        leave();
        const { Peer } = await import("peerjs");
        const me = new Peer();
        peer.current = me;
        setNet({ phase: "waiting", role: "guest", code, error: "" });
        me.on("open", () => attach(me.connect(prefix + code)));
        me.on("error", () =>
            leave(
                tr(
                    "No room with that code.",
                    "Nenhuma sala com esse código.",
                    "Ninguna sala con ese código.",
                ),
            ),
        );
    }

    function send(message: M) {
        if (conn.current?.open) conn.current.send(message);
    }

    useEffect(
        () => () => {
            conn.current = null;
            peer.current?.destroy();
        },
        [],
    );

    return {
        net,
        live: net.phase === "connected",
        isHost: net.role === "host",
        isGuest: net.role === "guest",
        create,
        join,
        leave,
        send,
    };
}

/** What covers the board until the two players are connected: create a room, or join one. */
export function Lobby({ room, locale }: { room: Room<never>; locale: Locale }) {
    const tr = makeT(locale);
    const { net } = room;
    const [code, setCode] = useState("");

    return (
        <Overlay>
            <div className="flex flex-col items-center gap-3">
                {net.phase === "idle" ? (
                    <>
                        <PillButton onClick={room.create}>
                            {tr("Create a room", "Criar sala", "Crear sala")}
                        </PillButton>
                        <span className="text-ink-faint">
                            {tr("or enter a code", "ou digite um código", "o escribe un código")}
                        </span>
                        <span className="flex items-center gap-2">
                            <input
                                value={code}
                                onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                                onKeyDown={(event) => {
                                    // the game behind must not react to what is typed here
                                    event.stopPropagation();
                                    if (event.key === "Enter") room.join(code);
                                }}
                                maxLength={CODE_LENGTH}
                                inputMode="numeric"
                                spellCheck={false}
                                autoComplete="off"
                                aria-label={tr("Room code", "Código da sala", "Código de la sala")}
                                placeholder="0000000"
                                className="w-32 rounded-md border border-line-strong bg-bg-0 px-2 py-1 text-center tracking-widest outline-none focus:border-accent-blue"
                            />
                            <PillButton onClick={() => room.join(code)}>
                                {tr("Join", "Entrar", "Entrar")}
                            </PillButton>
                        </span>
                        {net.error ? <span className="text-[#ff5f57]">{net.error}</span> : null}
                    </>
                ) : (
                    <>
                        {net.role === "host" ? (
                            <>
                                <span className="text-ink-faint">
                                    {tr("Room code", "Código da sala", "Código de la sala")}
                                </span>
                                <span className="font-bold text-3xl tracking-[0.2em]">
                                    {net.code}
                                </span>
                                <span className="text-ink-faint">
                                    {tr(
                                        "Waiting for your opponent…",
                                        "Esperando o oponente…",
                                        "Esperando al oponente…",
                                    )}
                                </span>
                            </>
                        ) : (
                            <span>{tr("Connecting…", "Conectando…", "Conectando…")}</span>
                        )}
                        <PillButton onClick={() => room.leave()}>
                            {tr("Cancel", "Cancelar", "Cancelar")}
                        </PillButton>
                    </>
                )}
            </div>
        </Overlay>
    );
}
