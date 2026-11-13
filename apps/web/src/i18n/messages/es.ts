import type { Dictionary } from "./en";

export const es: Dictionary = {
    meta: {
        title: "vaiperui · Biblioteca de componentes React con Tailwind CSS",
        description:
            "Biblioteca de componentes React para Tailwind CSS: Button, Input y Select tipados y accesibles, con máscaras (teléfono, tarjeta, fecha, CPF, CNPJ, código postal), ripple y una única prop de color para personalizar toda la interfaz.",
        keywords: [
            "vaiperui",
            "biblioteca de componentes React",
            "componentes React",
            "librería de UI para React",
            "Tailwind CSS",
            "componentes Tailwind",
            "sistema de diseño",
            "TypeScript",
            "componentes accesibles",
            "input con máscara",
            "máscara de input React",
            "máscara de teléfono React",
            "input de tarjeta de crédito",
            "React Select",
            "React Button",
            "customColor",
            "modo oscuro",
            "efecto ripple",
            "npm",
        ],
        ogTagline: "Componentes React listos para producción",
        ogFeatures: "Tailwind CSS · Máscaras · customColor · Accesible · TypeScript",
        componentTitle: "componente React",
    },
    header: {
        githubLabel: "Repositorio en GitHub",
        window: {
            group: "Controles de la ventana",
            close: "Cerrar ventana",
            minimize: "Minimizar ventana",
            fullscreen: "Pantalla completa",
            exitFullscreen: "Salir de pantalla completa",
            exited: "Proceso terminado con código 0",
            reopen: "Pulsa cualquier tecla para reabrir",
            restore: "Restaurar vaiperui",
            zoom: "Ampliar ventana",
            desktop: {
                open: "Abrir {app}",
                back: "Volver al sitio",
                apps: { terminal: "Terminal", snake: "Snake", mines: "Buscaminas" },
                snake: {
                    score: "Puntos",
                    best: "Récord",
                    start: "Pulsa una flecha para empezar",
                    paused: "En pausa. Pulsa espacio",
                    over: "Fin del juego. Pulsa R",
                    maps: { small: "Mapa pequeño", large: "Mapa grande" },
                },
                games: {
                    title: "Juegos",
                    difficulty: "Dificultad",
                    names: {
                        snake: "Snake",
                        mines: "Buscaminas",
                        tictactoe: "Tres en raya",
                        memory: "Memoria",
                        colormatch: "Color Match",
                        g2048: "2048",
                        wordle: "Wordle",
                        bughunt: "Caza de bugs",
                        flappy: "Flappy",
                        dino: "Dino Run",
                        pong: "Pong",
                        breakout: "Breakout",
                        stack: "Stack the Buttons",
                        invaders: "Space Invaders",
                    },
                    ui: {
                        score: "Puntos",
                        best: "Récord",
                        start: "Pulsa espacio para empezar",
                        restart: "Pulsa R para reiniciar",
                        over: "Fin del juego",
                        paused: "En pausa. Pulsa espacio",
                        newGame: "Nuevo juego",
                        win: "¡Ganaste!",
                        draw: "Empate",
                        lines: "Líneas",
                        level: "Nivel",
                        lives: "Vidas",
                        moves: "Jugadas",
                        time: "Tiempo",
                        wave: "Oleada",
                        round: "Ronda",
                        next: "Siguiente",
                        easy: "Fácil",
                        unbeatable: "Imbatible",
                        you: "Tú",
                        player: "Jugador",
                        wins: "Victorias",
                        played: "Partidas",
                        streak: "Racha",
                        players1: "1 jugador",
                        players2: "2 jugadores",
                    },
                    colormatch: {
                        target: "Objetivo",
                        yours: "Tu color",
                        hue: "Tono",
                        saturation: "Saturación",
                        lightness: "Luminosidad",
                        check: "Comprobar",
                        perfect: "¡Perfecto!",
                        accuracy: "Precisión",
                    },
                    wordle: {
                        hint: "Adivina la palabra de 5 letras",
                        won: "¡Acertaste!",
                        lost: "La palabra era {word}",
                        enter: "Enter",
                    },
                    bughunt: {
                        hint: "Aplasta los bugs antes de que escapen. Haz clic o pulsa espacio para empezar",
                        combo: "Combo",
                    },
                },
                mines: {
                    mines: "Minas",
                    time: "Tiempo",
                    best: "Récord",
                    newGame: "Nuevo juego",
                    flag: "Modo bandera",
                    won: "¡Despejaste el campo!",
                    lost: "Boom. Inténtalo de nuevo.",
                    levels: {
                        easy: "Fácil",
                        medium: "Medio",
                        hard: "Difícil",
                        veryHard: "Muy difícil",
                    },
                },
            },
        },
        languageLabel: "Idioma",
    },
    home: {
        tagline:
            "Componentes listos para ti, con una gramática visual que crece junto con tu producto.",
        viewDocs: "Ver documentación",
        stats: {
            downloads: ["descarga total en npm", "descargas totales en npm"],
            stars: ["estrella en GitHub", "estrellas en GitHub"],
            forks: ["fork en GitHub", "forks en GitHub"],
            version: "versión actual en npm",
        },
    },
    hero: {
        color: "Color",
        mask: "Máscara",
        colors: { orange: "naranja", green: "verde", violet: "violeta" },
        viewCode: "Ver código",
        viewLive: "Ver vista previa en vivo",
        masks: {
            cpf: "CPF",
            cnpj: "CNPJ",
            cei: "CEI",
            cep: "Cód. postal",
            phone: "Teléfono",
            creditCard: "Tarjeta",
            cardExpiry: "Vencimiento",
            date: "Fecha",
            time: "Hora",
        },
    },
    install: {
        packageManager: "Gestor de paquetes",
        copy: "copiar",
        copied: "copiado",
    },
    search: {
        trigger: "Buscar",
        placeholder: "Buscar en la documentación…",
        empty: "Sin resultados para “{query}”",
        hint: "Escribe para buscar componentes, props y guías",
        kinds: {
            page: "Página",
            component: "Componente",
            section: "Sección",
            prop: "Prop",
            example: "Ejemplo",
        },
        keys: { navigate: "navegar", open: "abrir", close: "cerrar" },
    },
    docs: {
        sidebarAria: "Documentación",
        components: "componentes",
        groups: {
            forms: "formularios",
            dataDisplay: "visualización de datos",
            feedback: "feedback",
            navigation: "navegación",
            overlays: "superposiciones",
            layout: "diseño",
            media: "multimedia",
        },
        paginationAria: "Navegación entre guías",
        previous: "anterior",
        next: "siguiente",
        guides: {
            intro: "Introducción",
            installation: "Instalación",
            gettingStarted: "Primeros pasos",
            ai: "Usar con IA",
        },
        onThisPage: "En esta página",
        howToUse: "Cómo usar",
        accessibility: "Accesibilidad",
        a11yKeyboard: "Teclado",
        a11yCols: { key: "Tecla", action: "Acción" },
        a11yCaveats: "Ten en cuenta",
        props: "Props",
        propsCols: {
            prop: "Prop",
            values: "Valores",
            default: "Predeterminado",
            description: "Descripción",
        },
        themeToLight: "Cambiar a claro",
        themeToDark: "Cambiar a oscuro",
    },
    guides: {
        intro: {
            crumb: "docs / introducción",
            description:
                "Biblioteca de componentes React con estilos de Tailwind CSS. Máscaras listas en el Input y un único color para personalizar cualquier componente.",
            whatIs: {
                title: "Qué es",
                body: "Componentes accesibles y listos para usar. El <c>Input</c> formatea teléfonos, tarjetas, fechas y documentos mientras escribes, el <c>Select</c> es un combobox con búsqueda y navegación por teclado, y un único color pinta el borde, el foco y el icono en cualquiera de ellos.",
            },
            startHere: {
                title: "Empieza aquí",
                body: "Instala el paquete, importa el CSS una vez y usa tu primer componente.",
            },
            components: {
                title: "Componentes",
                body: "La referencia de todos los componentes está en la barra lateral. Cada página trae ejemplos en vivo, el código y la tabla de props.",
            },
        },
        installation: {
            crumb: "docs / instalación",
            description:
                "El paquete se instala con un comando; solo necesitas React y Tailwind CSS v4.",
            install: {
                title: "Instalar",
                body: "Instala el paquete desde npm (publicado como <c>vaiperui</c>):",
            },
            requirements: {
                title: "Requisitos",
                body: "<c>react</c> y <c>react-dom</c> son peer dependencies (versión <c>>=19</c>); tu proyecto ya debe tener ambos instalados. La librería usa Tailwind CSS v4, así que tu proyecto también necesita Tailwind configurado.",
            },
            css: {
                title: "Importar el CSS",
                body: "Importa la hoja de estilos de la librería una sola vez, junto con Tailwind, en tu CSS raíz:",
            },
            components: {
                title: "Importar componentes",
                body: "Todo se exporta desde la raíz del paquete. Importa el componente que necesites y úsalo:",
                code: `import { Button } from "vaiperui";

export function Ejemplo() {
  return <Button variantColor="primary">Haz clic aquí</Button>;
}`,
            },
            dark: {
                title: "Modo oscuro",
                intro: "El modo oscuro es opt-in: agrega la clase <c>dark</c> a cualquier ancestro (normalmente el <c><html></c>). Sin ella, los componentes se ven exactamente como en el modo claro. La variante <c>dark</c> ya viene definida en <c>vaiperui/theme.css</c>.",
                variables:
                    "Los colores de superficie, texto y borde vienen de variables CSS (<c>--vpd-surface</c>, <c>--vpd-surface-muted</c>, <c>--vpd-text</c>, <c>--vpd-text-placeholder</c>, <c>--vpd-border</c>…). Para usar otra paleta en modo oscuro, sobrescribe las variables en tu CSS:",
            },
        },
        gettingStarted: {
            crumb: "docs / primeros pasos",
            description:
                "De cero a tu primera pantalla: CSS importado, un componente renderizado y la variante que quieras.",
            first: {
                title: "Tu primer componente",
                body: "Con el CSS importado, usar un componente es una línea. Aquí, un <c>Button</c> con la variante primaria:",
                demoLabel: "Guardar",
                code: `import { Button } from "vaiperui";

export function Guardar() {
  return <Button variantColor="primary">Guardar</Button>;
}`,
            },
            variants: {
                title: "Variantes",
                body: "Los componentes comparten las mismas props de diseño — <c>variantColor</c>, <c>size</c>, <c>radius</c> y <c>animation</c>. El <c>Button</c> suma además <c>variant</c> y <c>hover</c>; consulta la referencia de cada componente para la lista completa.",
                confirm: "Confirmar",
                review: "Revisar",
                remove: "Eliminar",
            },
            masks: {
                title: "El diferencial: máscaras",
                body: "El <c>Input</c> formatea teléfonos, tarjetas, fechas y documentos automáticamente mientras el usuario escribe. Basta con pasar <c>mask</c>.",
                label: "Teléfono",
                mask: "phone",
                component: "Telefono",
            },
            next: {
                title: "A dónde ir ahora",
                callout: "siguiente paso",
                body: "Esta guía cubrió lo esencial con <c>Button</c> e <c>Input</c>, pero la librería no se detiene ahí. Consulta la referencia completa de <link:button>Button</link>, <link:input>Input</link> o <link:select>Select</link>.",
            },
        },
        ai: {
            crumb: "docs / usar con ia",
            description:
                "Haz que tu agente de IA use vaiperui correctamente: un plugin de Claude Code, un servidor MCP alojado y una Agent Skill, todo generado a partir de estos docs.",
            what: {
                title: "Qué recibes",
                body: "Tres piezas, generadas de los mismos datos de este sitio, así que nunca lo contradicen. La <c>skill</c> enseña las convenciones de antemano (las props compartidas, cómo funciona el valor de cada componente, qué componente elegir) y trae un archivo de referencia por componente. El <c>servidor MCP</c> responde en vivo: busca en los docs y lee las props, los ejemplos y las notas de accesibilidad de cualquier componente. El <c>plugin</c> instala ambos de una vez en Claude Code.",
            },
            plugin: {
                title: "Plugin de Claude Code (recomendado)",
                body: "Añade este repositorio como marketplace e instala el plugin. Instala la skill y conecta el servidor MCP:",
                after: "La skill se carga sola cuando trabajas con <c>vaiperui</c>; también puedes llamarla con <c>/vaiperui:vaiperui</c>. Si no aparece de inmediato, ejecuta <c>/reload-plugins</c>.",
            },
            mcp: {
                title: "Servidor MCP",
                body: "El servidor está alojado en este sitio, así que nada corre en tu máquina: es público, de solo lectura y no necesita cuenta. Añádelo a Claude Code con:",
                clients:
                    "Otros clientes usan la misma URL. Cursor y VS Code quedan así; en cualquier otro cliente, añade un servidor MCP remoto (HTTP) con la URL <c>{url}</c> en sus ajustes de MCP. Revisa la documentación de tu cliente, porque los nombres de archivo cambian entre versiones.",
                browser: "Abrir <c>{url}</c> en el navegador también muestra estas instrucciones.",
            },
            tools: {
                title: "Qué responde el servidor",
                body: "Cuatro herramientas de solo lectura. Cada una acepta un <c>locale</c> opcional (<c>en</c>, <c>pt</c> o <c>es</c>):",
                items: [
                    {
                        name: "list_components",
                        text: "Todos los componentes con una línea de descripción, por grupo.",
                    },
                    {
                        name: "search_docs",
                        text: "Encuentra el componente para una necesidad (dropdown, scroll infinito en un select, máscara de teléfono). Busca en componentes, props, ejemplos, notas de accesibilidad y guías.",
                    },
                    {
                        name: "get_component",
                        text: "La referencia completa de un componente: import, uso, cada prop con valores y valor por defecto, accesibilidad y, bajo petición, todos los ejemplos. El nombre es flexible: Button, DatePicker, date-picker.",
                    },
                    {
                        name: "get_setup",
                        text: "Comando de instalación, imports de CSS, modo oscuro y tema.",
                    },
                ],
                resources:
                    "Cada componente también es un recurso (<c>vaiperui://component/slug</c>) para clientes que adjuntan documentos como contexto.",
            },
            skill: {
                title: "Solo la skill",
                body: "Sin el plugin, copia la skill que viene dentro del paquete a tu proyecto, o a <c>~/.claude/skills</c> para usarla en todos los proyectos:",
                after: "Funciona con cualquier agente que soporte Agent Skills. En los demás, apunta al agente hacia <c>SKILL.md</c> y los archivos de <c>references/</c>: son Markdown simple.",
            },
            prompts: {
                title: "Pruébalo",
                body: "Pide pantallas enteras: el agente consulta cada componente en lugar de adivinar sus props.",
                items: [
                    "Crea un formulario de reserva con vaiperui: teléfono con máscara, select de país con búsqueda, un rango de fechas con atajos y un toast de éxito.",
                    "Añade una tabla de usuarios con avatar, badge de estado, un menú de acciones por fila, un modal de confirmación de borrado y paginación.",
                    "Haz que el select cargue usuarios de mi API, con scroll infinito y búsqueda en el servidor.",
                ],
            },
            trust: {
                title: "Cómo se mantiene correcto",
                body: "La skill, sus referencias y el servidor se generan de los mismos datos de estas páginas. Las pruebas comprueban que cada prop que declara un componente está documentada, que cada ejemplo importa exports reales, que las recetas de la skill compilan y que el endpoint habla el protocolo. Cuando los docs cambian, el servidor cambia con el siguiente despliegue.",
            },
        },
    },
};
