import type { Metadata } from "next";

import { Code, CodePanel, Guide, GuidePagination, P, Section } from "@/components/Guide";

export const metadata: Metadata = {
    title: "Instalação — vaiperui",
    description:
        "Como instalar a vaiperui: requisitos, import do CSS e primeiro import de componentes.",
};

export default function InstalacaoPage() {
    return (
        <Guide
            crumb="docs / instalação"
            title="Instalação"
            description="O pacote instala em um comando; você só precisa do React e do Tailwind CSS v4."
        >
            <Section title="Instalar">
                <P>
                    Instale o pacote a partir do npm (publicado como <Code>vaiperui</Code>):
                </P>
                <CodePanel title="terminal" code={`npm install vaiperui`} />
            </Section>

            <Section title="Requisitos">
                <P>
                    <Code>react</Code> e <Code>react-dom</Code> são peer dependencies (versão{" "}
                    <Code>&gt;=19</Code>) — seu projeto precisa já ter as duas instaladas. A lib é
                    estilizada com Tailwind CSS v4, então seu projeto precisa ter o Tailwind
                    configurado.
                </P>
            </Section>

            <Section title="Importar o CSS">
                <P>
                    Importe o stylesheet da lib uma única vez, junto do Tailwind, no seu CSS raiz:
                </P>
                <CodePanel
                    title="globals.css"
                    code={`@import "tailwindcss";
@import "vaiperui/theme.css";

@source "../node_modules/vaiperui/src";`}
                />
            </Section>

            <Section title="Importar componentes">
                <P>
                    Tudo é exportado a partir da raiz do pacote — importe o componente que precisar
                    e use:
                </P>
                <CodePanel
                    title="Button.tsx"
                    code={`import { Button } from "vaiperui";

export function Example() {
  return <Button variantColor="primary">Clique aqui</Button>;
}`}
                />
            </Section>

            <Section title="Dark mode">
                <P>
                    O dark mode é opt-in: adicione a classe <Code>dark</Code> em qualquer ancestral
                    (normalmente o <Code>&lt;html&gt;</Code>). Sem ela, os componentes ficam
                    exatamente como no modo claro. A variante <Code>dark</Code> já vem definida no{" "}
                    <Code>vaiperui/theme.css</Code>.
                </P>
                <CodePanel title="app/layout.tsx" code={`<html lang="pt-BR" className="dark">`} />
                <P>
                    As cores de superfície, texto e borda vêm de variáveis CSS (
                    <Code>--vpd-surface</Code>, <Code>--vpd-surface-muted</Code>,{" "}
                    <Code>--vpd-text</Code>, <Code>--vpd-text-placeholder</Code>,{" "}
                    <Code>--vpd-border</Code>…). Para usar outra paleta no dark, sobrescreva as
                    variáveis no seu CSS:
                </P>
                <CodePanel
                    title="globals.css"
                    code={`.dark {
  --vpd-surface: #0b0f19;
  --vpd-surface-muted: #131a2a;
  --vpd-text: #e2e8f0;
  --vpd-border: #1f2937;
}`}
                />
            </Section>

            <GuidePagination current="/docs/instalacao" />
        </Guide>
    );
}
