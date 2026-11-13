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
            zoom: "Ampliar janela",
            desktop: {
                open: "Abrir {app}",
                back: "Voltar ao site",
                apps: { terminal: "Terminal", snake: "Snake", mines: "Campo Minado" },
                snake: {
                    score: "Pontos",
                    best: "Recorde",
                    start: "Aperte uma seta para começar",
                    paused: "Pausado. Aperte espaço",
                    over: "Fim de jogo. Aperte R",
                    maps: { small: "Mapa pequeno", large: "Mapa grande" },
                },
                games: {
                    title: "Jogos",
                    difficulty: "Dificuldade",
                    names: {
                        snake: "Snake",
                        mines: "Campo Minado",
                        tictactoe: "Jogo da Velha",
                        memory: "Memória",
                        colormatch: "Color Match",
                        g2048: "2048",
                        wordle: "Wordle",
                        bughunt: "Caça-Bugs",
                        flappy: "Flappy",
                        dino: "Dino Run",
                        pong: "Pong",
                        breakout: "Breakout",
                        stack: "Stack the Buttons",
                        invaders: "Space Invaders",
                    },
                    ui: {
                        score: "Pontos",
                        best: "Recorde",
                        start: "Aperte espaço para começar",
                        restart: "Aperte R para recomeçar",
                        over: "Fim de jogo",
                        paused: "Pausado. Aperte espaço",
                        newGame: "Novo jogo",
                        win: "Você venceu!",
                        draw: "Empate",
                        lines: "Linhas",
                        level: "Nível",
                        lives: "Vidas",
                        moves: "Jogadas",
                        time: "Tempo",
                        wave: "Onda",
                        round: "Rodada",
                        next: "Próxima",
                        easy: "Fácil",
                        unbeatable: "Imbatível",
                        you: "Você",
                        player: "Jogador",
                        wins: "Vitórias",
                        played: "Jogos",
                        streak: "Sequência",
                        players1: "1 jogador",
                        players2: "2 jogadores",
                    },
                    colormatch: {
                        target: "Alvo",
                        yours: "Sua cor",
                        hue: "Matiz",
                        saturation: "Saturação",
                        lightness: "Luminosidade",
                        check: "Conferir",
                        perfect: "Perfeito!",
                        accuracy: "Precisão",
                    },
                    wordle: {
                        hint: "Adivinhe a palavra de 5 letras",
                        won: "Você acertou!",
                        lost: "A palavra era {word}",
                        enter: "Enter",
                    },
                    bughunt: {
                        hint: "Esmague os bugs antes que fujam. Clique ou aperte espaço para começar",
                        combo: "Combo",
                    },
                },
                mines: {
                    mines: "Minas",
                    time: "Tempo",
                    best: "Recorde",
                    newGame: "Novo jogo",
                    flag: "Modo bandeira",
                    won: "Você limpou o campo!",
                    lost: "Boom. Tente de novo.",
                    levels: {
                        easy: "Fácil",
                        medium: "Médio",
                        hard: "Difícil",
                        veryHard: "Muito difícil",
                    },
                },
            },
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
        groups: {
            forms: "formulários",
            dataDisplay: "exibição de dados",
            feedback: "feedback",
            navigation: "navegação",
            overlays: "sobreposições",
            layout: "layout",
            media: "mídia",
        },
        paginationAria: "Navegação entre guias",
        previous: "anterior",
        next: "próximo",
        guides: {
            intro: "Introdução",
            installation: "Instalação",
            gettingStarted: "Começando",
            ai: "Usar com IA",
        },
        onThisPage: "Nesta página",
        howToUse: "Como usar",
        accessibility: "Acessibilidade",
        a11yKeyboard: "Teclado",
        a11yCols: { key: "Tecla", action: "Ação" },
        a11yCaveats: "Tenha em mente",
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
                body: "A referência de todos os componentes está na barra lateral. Cada página traz exemplos ao vivo, o código e a tabela de props.",
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
        ai: {
            crumb: "docs / usar com ia",
            description:
                "Faça seu agente de IA usar o vaiperui do jeito certo: um plugin do Claude Code, um servidor MCP hospedado e uma Agent Skill, tudo gerado a partir destes docs.",
            what: {
                title: "O que você recebe",
                body: "Três peças, geradas dos mesmos dados deste site, então nunca discordam dele. A <c>skill</c> ensina as convenções de antemão (as props compartilhadas, como funciona o valor de cada componente, qual componente escolher) e traz um arquivo de referência por componente. O <c>servidor MCP</c> responde ao vivo: busca nos docs e lê as props, os exemplos e as notas de acessibilidade de qualquer componente. O <c>plugin</c> instala os dois de uma vez no Claude Code.",
            },
            plugin: {
                title: "Plugin do Claude Code (recomendado)",
                body: "Adicione este repositório como marketplace e instale o plugin. Ele instala a skill e conecta o servidor MCP:",
                after: "A skill carrega sozinha quando você trabalha com o <c>vaiperui</c>; também dá para chamá-la com <c>/vaiperui:vaiperui</c>. Se ela não aparecer de imediato, rode <c>/reload-plugins</c>.",
            },
            mcp: {
                title: "Servidor MCP",
                body: "O servidor fica hospedado neste site, então nada roda na sua máquina: é público, somente leitura e não exige conta. Adicione ao Claude Code com:",
                clients:
                    "Outros clientes usam a mesma URL. Cursor e VS Code ficam assim; em qualquer outro cliente, adicione um servidor MCP remoto (HTTP) com a URL <c>{url}</c> nas configurações de MCP. Confira a documentação do seu cliente, porque os nomes dos arquivos mudam entre versões.",
                browser: "Abrir <c>{url}</c> no navegador também mostra estas instruções.",
            },
            tools: {
                title: "O que o servidor responde",
                body: "Quatro ferramentas somente leitura. Cada uma aceita um <c>locale</c> opcional (<c>en</c>, <c>pt</c> ou <c>es</c>):",
                items: [
                    {
                        name: "list_components",
                        text: "Todos os componentes com uma linha de descrição, por grupo.",
                    },
                    {
                        name: "search_docs",
                        text: "Acha o componente para uma necessidade (dropdown, scroll infinito num select, máscara de telefone). Busca em componentes, props, exemplos, notas de acessibilidade e guias.",
                    },
                    {
                        name: "get_component",
                        text: "A referência completa de um componente: import, uso, cada prop com valores e padrão, acessibilidade e, sob pedido, todos os exemplos. O nome é flexível: Button, DatePicker, date-picker.",
                    },
                    {
                        name: "get_setup",
                        text: "Comando de instalação, imports de CSS, modo escuro e tema.",
                    },
                ],
                resources:
                    "Cada componente também é um recurso (<c>vaiperui://component/slug</c>) para clientes que anexam documentos como contexto.",
            },
            skill: {
                title: "Só a skill",
                body: "Sem o plugin, copie a skill que vem dentro do pacote para o seu projeto, ou para <c>~/.claude/skills</c> para usá-la em todos os projetos:",
                after: "Funciona com qualquer agente que suporte Agent Skills. Nos outros, aponte o agente para o <c>SKILL.md</c> e para os arquivos de <c>references/</c>: são Markdown simples.",
            },
            prompts: {
                title: "Experimente",
                body: "Peça telas inteiras: o agente consulta cada componente em vez de adivinhar as props.",
                items: [
                    "Monte um formulário de reserva com o vaiperui: telefone com máscara, select de país com busca, um período de datas com atalhos e um toast de sucesso.",
                    "Adicione uma tabela de usuários com avatar, badge de status, um menu de ações por linha, um modal de confirmação de exclusão e paginação.",
                    "Faça o select carregar usuários da minha API, com scroll infinito e busca no servidor.",
                ],
            },
            trust: {
                title: "Como isso se mantém correto",
                body: "A skill, as referências e o servidor são gerados dos mesmos dados destas páginas. Testes conferem que toda prop que um componente declara está documentada, que todo exemplo importa exports reais, que as receitas da skill compilam e que o endpoint fala o protocolo. Quando os docs mudam, o servidor muda no próximo deploy.",
            },
        },
    },
};
