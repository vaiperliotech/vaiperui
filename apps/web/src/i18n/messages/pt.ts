import type { Dictionary } from "./en";

export const pt: Dictionary = {
    meta: {
        title: "vaiperui · Biblioteca de componentes React com Tailwind CSS",
        description:
            "Biblioteca de componentes React para Tailwind CSS: Button, Input e Select tipados e acessíveis, com máscaras (CPF, CNPJ, CEP, telefone, cartão), ripple e uma única prop de cor para customizar toda a interface.",
        keywords: [
            "vaiperui",
            "biblioteca de componentes React",
            "componentes React",
            "React UI library",
            "Tailwind CSS",
            "componentes Tailwind",
            "design system",
            "TypeScript",
            "componentes acessíveis",
            "Input com máscara",
            "máscara CPF CNPJ React",
            "máscara de telefone React",
            "máscara de CEP",
            "React Select",
            "React Button",
            "customColor",
            "dark mode",
            "ripple effect",
            "npm",
        ],
        ogTagline: "Componentes React prontos pra produção",
        ogFeatures: "Tailwind CSS · Máscaras · customColor · Acessível · TypeScript",
        componentTitle: "componente React",
    },
    header: {
        githubLabel: "Repositório no GitHub",
        window: {
            group: "Controles da janela",
            close: "Fechar janela",
            minimize: "Minimizar janela",
            fullscreen: "Tela cheia",
            exitFullscreen: "Sair da tela cheia",
            exited: "Processo encerrado com código 0",
            reopen: "Pressione qualquer tecla para reabrir",
            restore: "Restaurar vaiperui",
        },
        languageLabel: "Idioma",
    },
    home: {
        tagline:
            "Componentes prontos para você, com uma gramática visual que cresce junto com o seu produto.",
        viewDocs: "Ver documentação",
        stats: {
            downloads: ["download total no npm", "downloads totais no npm"],
            stars: ["estrela no GitHub", "estrelas no GitHub"],
            forks: ["fork no GitHub", "forks no GitHub"],
            version: "versão atual no npm",
        },
    },
    hero: {
        color: "Cor",
        mask: "Máscara",
        colors: { orange: "laranja", green: "verde", violet: "violeta" },
        viewCode: "Ver código",
        viewLive: "Ver preview ao vivo",
        masks: {
            cpf: "CPF",
            cnpj: "CNPJ",
            cei: "CEI",
            cep: "CEP",
            phone: "Telefone",
            creditCard: "Cartão",
            cardExpiry: "Validade",
            date: "Data",
            time: "Hora",
        },
    },
    install: {
        packageManager: "Gerenciador de pacotes",
        copy: "copiar",
        copied: "copiado",
    },
    search: {
        trigger: "Pesquisar",
        placeholder: "Pesquisar na documentação…",
        empty: "Nenhum resultado para “{query}”",
        hint: "Digite para buscar componentes, props e guias",
        kinds: {
            page: "Página",
            component: "Componente",
            section: "Seção",
            prop: "Prop",
            example: "Exemplo",
        },
        keys: { navigate: "navegar", open: "abrir", close: "fechar" },
    },
    docs: {
        sidebarAria: "Documentação",
        components: "componentes",
        paginationAria: "Navegação entre guias",
        previous: "anterior",
        next: "próximo",
        guides: {
            intro: "Introdução",
            installation: "Instalação",
            gettingStarted: "Começando",
        },
        onThisPage: "Nesta página",
        howToUse: "Como usar",
        props: "Props",
        propsCols: {
            prop: "Prop",
            values: "Valores",
            default: "Padrão",
            description: "Descrição",
        },
        themeToLight: "Alternar para claro",
        themeToDark: "Alternar para escuro",
    },
    guides: {
        intro: {
            crumb: "docs / introdução",
            description:
                "Biblioteca de componentes React estilizada com Tailwind CSS. Máscaras prontas no Input e uma única cor para customizar qualquer componente.",
            whatIs: {
                title: "O que é",
                body: "Componentes acessíveis e prontos para usar. O <c>Input</c> formata telefones, cartões, datas e documentos enquanto você digita, o <c>Select</c> é um combobox com busca e navegação por teclado, e uma única cor pinta borda, foco e ícone em qualquer um deles.",
            },
            startHere: {
                title: "Comece aqui",
                body: "Instale o pacote, importe o CSS uma vez e use o primeiro componente.",
            },
            components: {
                title: "Componentes",
                body: "A referência de <c>Button</c>, <c>Input</c> e <c>Select</c> está na barra lateral. Cada página traz exemplos ao vivo, o código e a tabela de props.",
            },
        },
        installation: {
            crumb: "docs / instalação",
            description:
                "O pacote instala em um comando; você só precisa do React e do Tailwind CSS v4.",
            install: {
                title: "Instalar",
                body: "Instale o pacote a partir do npm (publicado como <c>vaiperui</c>):",
            },
            requirements: {
                title: "Requisitos",
                body: "<c>react</c> e <c>react-dom</c> são peer dependencies (versão <c>>=19</c>); seu projeto precisa já ter as duas instaladas. A lib é estilizada com Tailwind CSS v4, então seu projeto também precisa do Tailwind configurado.",
            },
            css: {
                title: "Importar o CSS",
                body: "Importe o stylesheet da lib uma única vez, junto do Tailwind, no seu CSS raiz:",
            },
            components: {
                title: "Importar componentes",
                body: "Tudo é exportado a partir da raiz do pacote. Importe o componente que precisar e use:",
                code: `import { Button } from "vaiperui";

export function Exemplo() {
  return <Button variantColor="primary">Clique aqui</Button>;
}`,
            },
            dark: {
                title: "Dark mode",
                intro: "O dark mode é opt-in: adicione a classe <c>dark</c> em qualquer ancestral (normalmente o <c><html></c>). Sem ela, os componentes ficam exatamente como no modo claro. A variante <c>dark</c> já vem definida no <c>vaiperui/theme.css</c>.",
                variables:
                    "As cores de superfície, texto e borda vêm de variáveis CSS (<c>--vpd-surface</c>, <c>--vpd-surface-muted</c>, <c>--vpd-text</c>, <c>--vpd-text-placeholder</c>, <c>--vpd-border</c>…). Para usar outra paleta no dark, sobrescreva as variáveis no seu CSS:",
            },
        },
        gettingStarted: {
            crumb: "docs / começando",
            description:
                "Do zero à primeira tela: CSS importado, um componente renderizado e a variante que você quiser.",
            first: {
                title: "Seu primeiro componente",
                body: "Com o CSS importado, usar um componente é uma linha. Aqui, um <c>Button</c> com a variante primária:",
                demoLabel: "Salvar",
                code: `import { Button } from "vaiperui";

export function Salvar() {
  return <Button variantColor="primary">Salvar</Button>;
}`,
            },
            variants: {
                title: "Variantes",
                body: "Os componentes compartilham as mesmas props de layout — <c>variantColor</c>, <c>size</c>, <c>radius</c> e <c>animation</c>. O <c>Button</c> soma ainda <c>variant</c> e <c>hover</c>; veja a referência de cada componente para a lista completa.",
                confirm: "Confirmar",
                review: "Revisar",
                remove: "Excluir",
            },
            masks: {
                title: "O diferencial: máscaras",
                body: "O <c>Input</c> formata CPF, telefones, cartões, datas e outros documentos automaticamente enquanto o usuário digita. Basta passar <c>mask</c>.",
                label: "CPF",
                mask: "cpf",
                component: "Cpf",
            },
            next: {
                title: "Onde ir agora",
                callout: "próximo passo",
                body: "Este guia cobriu o essencial com <c>Button</c> e <c>Input</c>, mas a biblioteca não para por aí. Veja a referência completa de <link:button>Button</link>, <link:input>Input</link> ou <link:select>Select</link>.",
            },
        },
    },
};
