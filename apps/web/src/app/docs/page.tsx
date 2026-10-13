import type { Metadata } from "next";

import { Code, CodePanel, Guide, GuidePagination, P, Section } from "@/components/Guide";

export const metadata: Metadata = {
    title: "Introdução · vaiperui",
    description:
        "Biblioteca de componentes React estilizada com Tailwind CSS. Máscaras de documento prontas no Input e uma única cor para customizar qualquer componente.",
};

export default function DocsIndexPage() {
    return (
        <Guide
            crumb="docs / introdução"
            title="Introdução"
            description="Biblioteca de componentes React estilizada com Tailwind CSS. Máscaras de documento prontas no Input e uma única cor para customizar qualquer componente."
        >
            <Section title="O que é">
                <P>
                    Componentes acessíveis e prontos para usar. O <Code>Input</Code> formata
                    documentos brasileiros enquanto você digita, o <Code>Select</Code> é um combobox
                    com busca e navegação por teclado, e uma única cor pinta borda, foco e ícone em
                    qualquer um deles.
                </P>
            </Section>

            <Section title="Comece aqui">
                <P>Instale o pacote, importe o CSS uma vez e use o primeiro componente.</P>
                <CodePanel title="terminal" code={`npm install vaiperui`} />
            </Section>

            <Section title="Componentes">
                <P>
                    A referência de <Code>Button</Code>, <Code>Input</Code> e <Code>Select</Code>{" "}
                    está na barra lateral. Cada página traz exemplos ao vivo, o código e a tabela de
                    props.
                </P>
            </Section>

            <GuidePagination current="/docs" />
        </Guide>
    );
}
