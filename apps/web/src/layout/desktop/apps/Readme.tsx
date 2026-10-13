"use client";

import { makeT } from "@/data/samples";
import { type AppProps, Pane } from "./kit";

// readme.txt on the desktop: what this place is, and where its secrets are.
export function Readme({ locale }: AppProps) {
    const t = makeT(locale);
    const lines = [
        t(
            "Welcome to the vaiperui desktop.",
            "Bem-vindo à mesa de trabalho do vaiperui.",
            "Bienvenido al escritorio de vaiperui.",
        ),
        "",
        t(
            "This is what the page becomes when you minimize it. Everything here runs in your browser.",
            "É no que a página vira quando você a minimiza. Tudo aqui roda no seu navegador.",
            "En esto se convierte la página al minimizarla. Todo aquí funciona en tu navegador.",
        ),
        "",
        t(
            "• Double-click an icon, or use the dock, to open an app.",
            "• Dê dois cliques num ícone, ou use o dock, para abrir um app.",
            "• Haz doble clic en un icono, o usa el dock, para abrir una app.",
        ),
        t(
            "• Right-click the desktop for shortcuts and wallpapers.",
            "• Clique com o botão direito na área de trabalho para atalhos e papéis de parede.",
            "• Haz clic derecho en el escritorio para accesos directos y fondos.",
        ),
        t(
            "• Drag the icons wherever you like: they stay there.",
            "• Arraste os ícones para onde quiser: eles ficam lá.",
            "• Arrastra los iconos donde quieras: se quedan ahí.",
        ),
        t(
            "• The Terminal knows more commands than it shows.",
            "• O Terminal conhece mais comandos do que mostra.",
            "• La Terminal conoce más comandos de los que muestra.",
        ),
        t(
            "• Your scores and notes are kept in this browser only.",
            "• Seus pontos e notas ficam salvos só neste navegador.",
            "• Tus puntos y notas se guardan solo en este navegador.",
        ),
        "",
        t(
            "There is a cheat code somewhere. You know the one.",
            "Existe um código secreto por aí. Você sabe qual.",
            "Hay un código secreto por ahí. Ya sabes cuál.",
        ),
        "",
        "— vaiperui",
    ];

    return (
        <Pane className="bg-[#fbfcff] font-mono text-[#1b2233] text-sm leading-7">
            {lines.map((line, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: a fixed text
                <p key={index} className="min-h-7">
                    {line}
                </p>
            ))}
        </Pane>
    );
}
