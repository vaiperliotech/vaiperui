import type { ReactNode } from "react";

import { Button, Input, Select } from "vaiperui";

export type PropRow = {
    prop: string;
    values: string;
    defaultValue: string;
    description: string;
};

export type ComponentEntry = {
    slug: string;
    name: string;
    blurb: string;
    usage: string;
    code: string;
    demo: ReactNode;
    props: PropRow[];
};

export const components: ComponentEntry[] = [
    {
        slug: "button",
        name: "Button",
        blurb: "Todas as props nativas de <button>, mais variante, cor, tamanho, raio, hover e animações prontas.",
        usage: "Importe de `vaiperui` e use como um `<button>` — todas as props nativas (`onClick`, `disabled`, `type`, `aria-*`…) continuam funcionando. A aparência é controlada pelas props `variant`, `variantColor`, `size`, `radius`, `hover` e `animation`.",
        code: `import { Button } from "vaiperui";

<Button variantColor="primary" hover="lift">
  Clique aqui
</Button>
<Button variant="outlined2" variantColor="danger">
  Excluir
</Button>`,
        demo: (
            <div className="flex flex-wrap items-center gap-3">
                <Button variantColor="primary" hover="lift">
                    Clique aqui
                </Button>
                <Button variant="outlined2" variantColor="danger">
                    Excluir
                </Button>
            </div>
        ),
        props: [
            {
                prop: "variant",
                values: "solid | solid-inverse | outlined | outlined2 | transparent",
                defaultValue: "solid",
                description:
                    "solid: fundo cheio. solid-inverse: fundo cheio com hover mais claro. outlined: borda suave e hover de tinta. outlined2: borda forte e hover preenche. transparent: sem fundo/borda",
            },
            {
                prop: "variantColor",
                values: "primary | success | warning | danger",
                defaultValue: "primary",
                description: "Cor semântica do botão",
            },
            {
                prop: "size",
                values: "sm | md | lg",
                defaultValue: "md",
                description: "Altura, padding e tamanho de fonte",
            },
            {
                prop: "radius",
                values: "none | sm | md | lg | full",
                defaultValue: "md",
                description: "Arredondamento das bordas",
            },
            {
                prop: "hover",
                values: "none | lift | scale | glow",
                defaultValue: "none",
                description: "Efeito extra ao passar o mouse. glow usa a cor da variante",
            },
            {
                prop: "animation",
                values: "none | float | pulse | shine | wiggle | wobble | nudge | jelly | heartbeat | jump | gradient | glow",
                defaultValue: "none",
                description: "Animação contínua do botão; respeita prefers-reduced-motion",
            },
            {
                prop: "iconStart / iconEnd",
                values: "ReactNode",
                defaultValue: "—",
                description: "Ícone/conteúdo antes ou depois do texto",
            },
            {
                prop: "(nativas)",
                values: "ButtonHTMLAttributes<HTMLButtonElement>",
                defaultValue: "—",
                description:
                    "onClick, disabled, type, aria-*, className (sobrescreve estilos) etc.",
            },
        ],
    },
    {
        slug: "input",
        name: "Input",
        blurb: "Todas as props nativas de <input>, mais o diferencial da lib: máscaras BR (cpf, cnpj, cei, cep, telefone).",
        usage: "Todas as props nativas de `<input>`, mais `mask`, que formata cpf/cnpj/cei/cep/telefone em tempo real enquanto o usuário digita. O foco pode ser um `ring` (padrão) ou apenas um `outline`.",
        code: `import { Input } from "vaiperui";

<Input label="CPF" mask="cpf" />
<Input
  label="E-mail"
  placeholder="voce@empresa.com"
  errorMessage="Informe um e-mail válido"
/>`,
        demo: (
            <div className="flex w-full max-w-sm flex-col gap-4">
                <Input label="CPF" mask="cpf" />
                <Input
                    label="E-mail"
                    placeholder="voce@empresa.com"
                    errorMessage="Informe um e-mail válido"
                />
            </div>
        ),
        props: [
            {
                prop: "variant",
                values: "ring | outline",
                defaultValue: "ring",
                description:
                    "Estilo de foco: ring desenha um anel (box-shadow) e destaca a borda; outline desenha apenas um contorno",
            },
            {
                prop: "variantColor",
                values: "primary | success | warning | danger",
                defaultValue: "primary",
                description: "Cor da borda/anel ao focar",
            },
            {
                prop: "customColor",
                values: "cor CSS válida | { light, dark }",
                defaultValue: "—",
                description:
                    "Sobrescreve variantColor — pinta borda e foco a partir de uma única cor, ou de um objeto { light, dark } com uma cor para cada tema",
            },
            {
                prop: "size",
                values: "sm | md | lg",
                defaultValue: "md",
                description: "Altura e tamanho de fonte",
            },
            {
                prop: "radius",
                values: "none | sm | md | lg | full",
                defaultValue: "md",
                description: "Arredondamento",
            },
            {
                prop: "animation",
                values: "none | smooth | fast | bounce",
                defaultValue: "smooth",
                description: "Transição da borda/anel de foco",
            },
            {
                prop: "label",
                values: "string",
                defaultValue: "—",
                description: "Rótulo acima do campo (associado ao input)",
            },
            {
                prop: "helperText",
                values: "string",
                defaultValue: "—",
                description: "Texto de ajuda abaixo do campo",
            },
            {
                prop: "errorMessage",
                values: "string",
                defaultValue: "—",
                description:
                    "Presença sozinha já força o estado de erro, independente de variantColor/customColor",
            },
            {
                prop: "leadingIcon / trailingIcon",
                values: "ReactNode",
                defaultValue: "—",
                description: "Ícone dentro do campo, à esquerda/direita",
            },
            {
                prop: "mask",
                values: "cpf | cnpj | cei | cep | telefone",
                defaultValue: "—",
                description:
                    "Formata o valor automaticamente enquanto o usuário digita (controlado ou não); o onChange emite a string já mascarada",
            },
            {
                prop: "(nativas)",
                values: "InputHTMLAttributes<HTMLInputElement>",
                defaultValue: "—",
                description:
                    "value, defaultValue, onChange, placeholder, disabled, type, aria-*, className etc.",
            },
        ],
    },
    {
        slug: "select",
        name: "Select",
        blurb: "Combobox acessível com navegação por teclado, busca por digitação e um estilo detalhado com ícone/descrição por opção.",
        usage: 'Combobox acessível (`role="combobox"` + `listbox`) com navegação por teclado, typeahead e seleção controlada ou não. Ative `searchable` para filtrar por texto e `variant="detailed"` para opções com `leading` e `description`.',
        code: `import { Select } from "vaiperui";

<Select
  label="País"
  placeholder="Escolha um país"
  searchable
  options={[
    { value: "br", label: "Brasil" },
    { value: "us", label: "Estados Unidos" },
  ]}
/>`,
        demo: (
            <div className="flex w-full max-w-xs flex-col gap-4">
                <Select
                    label="País"
                    placeholder="Escolha um país"
                    options={[
                        { value: "br", label: "Brasil" },
                        { value: "us", label: "Estados Unidos" },
                        { value: "pt", label: "Portugal", disabled: true },
                    ]}
                />
                <Select
                    label="Busca"
                    placeholder="Busque um país"
                    searchable
                    options={[
                        { value: "br", label: "Brasil" },
                        { value: "us", label: "Estados Unidos" },
                        { value: "pt", label: "Portugal" },
                    ]}
                />
            </div>
        ),
        props: [
            {
                prop: "options",
                values: "SelectOption[]",
                defaultValue: "—",
                description:
                    "Lista de opções ({ value, label, disabled?, description?, leading? })",
            },
            {
                prop: "value / defaultValue",
                values: "string",
                defaultValue: "—",
                description: "Controlado / não controlado",
            },
            {
                prop: "onValueChange",
                values: "(value: string) => void",
                defaultValue: "—",
                description: "Disparado ao selecionar uma opção",
            },
            {
                prop: "placeholder",
                values: "string",
                defaultValue: '"Select an option"',
                description: "Texto quando nada está selecionado",
            },
            {
                prop: "emptyMessage",
                values: "string",
                defaultValue: '"No options found"',
                description: "Texto quando não há opções (ou nenhum resultado de busca)",
            },
            {
                prop: "searchable",
                values: "boolean",
                defaultValue: "false",
                description: "Mostra um campo de busca dentro do menu para filtrar por texto",
            },
            {
                prop: "searchPlaceholder",
                values: "string",
                defaultValue: '"Search..."',
                description: "Placeholder do campo de busca",
            },
            {
                prop: "variant",
                values: "default | detailed",
                defaultValue: "default",
                description:
                    "default: dropdown compacto de uma linha. detailed: gatilho e opções maiores, com leading e description por opção e tinta na selecionada",
            },
            {
                prop: "variantColor",
                values: "primary | success | warning | danger",
                defaultValue: "primary",
                description: "Cor de foco, borda aberta e destaque da opção",
            },
            {
                prop: "customColor",
                values: "cor CSS válida | { light, dark }",
                defaultValue: "—",
                description:
                    "Sobrescreve variantColor — pinta foco, borda e destaque a partir de uma única cor, ou de um objeto { light, dark }",
            },
            {
                prop: "size",
                values: "sm | md | lg",
                defaultValue: "md",
                description: "Altura do gatilho e das opções",
            },
            {
                prop: "radius",
                values: "none | sm | md | lg | full",
                defaultValue: "md",
                description: "Arredondamento do gatilho e do menu",
            },
            {
                prop: "animation",
                values: "none | smooth | fast | bounce",
                defaultValue: "smooth",
                description: "Transição do menu",
            },
            {
                prop: "disabled",
                values: "boolean",
                defaultValue: "false",
                description: "Desabilita o select inteiro",
            },
            {
                prop: "name",
                values: "string",
                defaultValue: "—",
                description: 'Espelha o valor num <input type="hidden"> para envio em forms',
            },
            {
                prop: "label / id / className / style",
                values: "string / string / string / CSSProperties",
                defaultValue: "—",
                description: "Rótulo acima do gatilho e props de layout",
            },
            {
                prop: "option.leading / option.description",
                values: "ReactNode / string",
                defaultValue: "—",
                description:
                    'Slot visual e segunda linha por opção. Só renderizam com variant="detailed"',
            },
        ],
    },
];

export function getComponent(slug: string) {
    return components.find((entry) => entry.slug === slug);
}
