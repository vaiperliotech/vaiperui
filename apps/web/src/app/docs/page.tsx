import type { Metadata } from "next";

import { Code, CodePanel, Guide, GuidePagination, P, Section } from "@/components/Guide";

export const metadata: Metadata = {
    title: "Introdução — vaiperui",
    description:
        "Biblioteca de componentes React estilizada com Tailwind CSS — máscaras de input prontas e customização por uma única cor.",
};

export default function DocsIndexPage() {
    return (
        <Guide
            crumb="docs / introdução"
            title="Introdução"
            description="Biblioteca de componentes React estilizada com Tailwind CSS — máscaras de input prontas e customização por uma única cor."
        >
            <Section title="O que é">
                <P>
                    Componentes acessíveis e prontos para usar: máscaras de formatação prontas no{" "}
                    <Code>Input</Code>, aplicadas enquanto o usuário digita, e uma única cor pinta
                    borda, foco e ícones de qualquer componente.
                </P>
            </Section>

            <Section title="Comece aqui">
                <P>Instale o pacote, importe o CSS uma vez e use o primeiro componente.</P>
                <CodePanel title="terminal" code={`npm install vaiperui`} />
            </Section>

            <Section title="Componentes">
                <P>
                    A referência de <Code>Button</Code> e <Code>Input</Code> está na barra lateral —
                    cada página traz exemplos ao vivo, o código e a tabela de props.
                </P>
            </Section>

            <GuidePagination current="/docs" />
        </Guide>
    );
}
