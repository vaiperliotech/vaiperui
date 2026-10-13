import type { Metadata } from "next";
import Link from "next/link";
import { Callout, Code, CodePanel, Guide, GuidePagination, P, Section } from "@/components/Guide";
import { ButtonDemo, ButtonVariants, InputDemo } from "@/components/GuideDemos";
import { TerminalWindow } from "@/components/TerminalWindow";

export const metadata: Metadata = {
    title: "Começando · vaiperui",
    description: "Monte sua primeira tela com a vaiperui em poucos passos.",
};

export default function ComecandoPage() {
    return (
        <Guide
            crumb="docs / começando"
            title="Começando"
            description="Do zero à primeira tela: CSS importado, um componente renderizado e a variante que você quiser."
        >
            <Section title="Seu primeiro componente">
                <P>
                    Com o CSS importado, usar um componente é uma linha. Aqui, um{" "}
                    <Code>Button</Code> com a variante primária:
                </P>
                <div className="grid gap-6 lg:grid-cols-2">
                    <CodePanel
                        title="Button.tsx"
                        code={`import { Button } from "vaiperui";

export function Salvar() {
  return <Button variantColor="primary">Salvar</Button>;
}`}
                    />
                    <TerminalWindow
                        title="preview"
                        bodyClassName="flex min-h-40 items-center justify-center bg-bg-1 p-6"
                    >
                        <ButtonDemo />
                    </TerminalWindow>
                </div>
            </Section>

            <Section title="Variantes">
                <P>
                    Os componentes compartilham as mesmas props de layout —{" "}
                    <Code>variantColor</Code>, <Code>size</Code>, <Code>radius</Code> e{" "}
                    <Code>animation</Code>. O <Code>Button</Code> soma ainda <Code>variant</Code> e{" "}
                    <Code>hover</Code>; veja a referência de cada componente para a lista completa.
                </P>
                <CodePanel
                    title="variantes.tsx"
                    code={`<Button variantColor="success" radius="full">
  Confirmar
</Button>
<Button variant="outlined" variantColor="warning">
  Revisar
</Button>
<Button variantColor="danger" hover="lift">
  Excluir
</Button>`}
                />
                <ButtonVariants />
            </Section>

            <Section title="O diferencial: máscaras">
                <P>
                    O <Code>Input</Code> formata documentos brasileiros automaticamente enquanto o
                    usuário digita. Basta passar <Code>mask</Code>.
                </P>
                <div className="grid gap-6 lg:grid-cols-2">
                    <CodePanel
                        title="Input.tsx"
                        code={`import { Input } from "vaiperui";

export function Cpf() {
  return <Input label="CPF" mask="cpf" />;
}`}
                    />
                    <TerminalWindow
                        title="preview"
                        bodyClassName="flex min-h-40 items-center justify-center bg-bg-1 p-6"
                    >
                        <InputDemo />
                    </TerminalWindow>
                </div>
            </Section>

            <Section title="Onde ir agora">
                <Callout title="próximo passo">
                    Este guia cobriu o essencial com <Code>Button</Code> e <Code>Input</Code>, mas a
                    biblioteca não para por aí. Veja a referência completa de{" "}
                    <Link href="/docs/button" className="text-accent-blue hover:text-ink">
                        Button
                    </Link>
                    ,{" "}
                    <Link href="/docs/input" className="text-accent-blue hover:text-ink">
                        Input
                    </Link>{" "}
                    ou{" "}
                    <Link href="/docs/select" className="text-accent-blue hover:text-ink">
                        Select
                    </Link>
                    .
                </Callout>
            </Section>

            <GuidePagination current="/docs/comecando" />
        </Guide>
    );
}
