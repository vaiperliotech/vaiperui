import { AudioPlayer, VideoPlayer } from "vaiperui";

import { CarouselDemo, GalleryDemo, LightboxDemo } from "@/components/MediaDemo";

import type { Locale } from "@/i18n/config";
import type { ComponentEntry, PropRow } from "./components";
import { makeT } from "./samples";
import type { VariationGroup } from "./variations";

// Public CC0 samples from MDN: no files to host.
const AUDIO = "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3";
const VIDEO = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const COLORS = ["primary", "success", "warning", "danger"] as const;
const SIZES = ["sm", "md", "lg"] as const;

export function getMediaComponents(locale: Locale): ComponentEntry[] {
    const t = makeT(locale);
    const none = t("none", "nenhum", "ninguno");
    const row = (
        prop: string,
        values: string,
        defaultValue: string,
        en: string,
        pt: string,
        es: string,
    ): PropRow => ({ prop, values, defaultValue, description: t(en, pt, es) });

    const styleRows = (radius: boolean): PropRow[] => [
        row(
            "variantColor",
            "primary | success | warning | danger",
            "primary",
            "Accent color (play button, progress, dots)",
            "Cor de destaque (botão play, progresso, indicadores)",
            "Color de acento (botón play, progreso, indicadores)",
        ),
        row(
            "customColor",
            "string | { light, dark }",
            none,
            "Any CSS color (or a pair per theme). Overrides variantColor",
            "Qualquer cor CSS (ou um par por tema). Substitui o variantColor",
            "Cualquier color CSS (o un par por tema). Reemplaza a variantColor",
        ),
        row(
            "size",
            "sm | md | lg",
            "md",
            "Size of the controls and text",
            "Tamanho dos controles e do texto",
            "Tamaño de los controles y del texto",
        ),
        ...(radius
            ? [
                  row(
                      "radius",
                      "none | sm | md | lg | full",
                      "lg",
                      "Corner rounding",
                      "Arredondamento dos cantos",
                      "Redondeo de las esquinas",
                  ),
              ]
            : []),
        row(
            "animation",
            "none | smooth | fast | bounce",
            "smooth",
            "Transition of the controls",
            "Transição dos controles",
            "Transición de los controles",
        ),
    ];
    const events: PropRow[] = [
        row(
            "onPlay / onPause / onEnded",
            "() => void",
            none,
            "Called by the matching media events",
            "Chamados pelos eventos de mídia correspondentes",
            "Llamados por los eventos de medios correspondientes",
        ),
        row(
            "onTimeUpdate",
            "(currentTime: number) => void",
            none,
            "Called while playing, with the position in seconds",
            "Chamado durante a reprodução, com a posição em segundos",
            "Llamado durante la reproducción, con la posición en segundos",
        ),
    ];
    const labelsRow = (keys: string): PropRow =>
        row(
            "labels",
            `Partial<{ ${keys} }>`,
            t("English texts", "textos em inglês", "textos en inglés"),
            "Overrides the built-in texts (aria-labels of the buttons and sliders)",
            "Substitui os textos internos (aria-labels dos botões e sliders)",
            "Reemplaza los textos internos (aria-labels de los botones y sliders)",
        );
    const demoAlt = t("Slide", "Slide", "Slide");
    const dotPrefix = t("Go to slide", "Ir para o slide", "Ir al slide");
    const carouselText = {
        alt: demoAlt,
        label: t("Featured slides", "Slides em destaque", "Slides destacados"),
        previousLabel: t("Previous slide", "Slide anterior", "Slide anterior"),
        nextLabel: t("Next slide", "Próximo slide", "Siguiente slide"),
        dotPrefix,
    };

    return [
        {
            slug: "audio-player",
            name: "AudioPlayer",
            blurb: t(
                "Accessible audio player with play/pause, seek bar, time, speed and volume.",
                "Player de áudio acessível com play/pause, barra de busca, tempo, velocidade e volume.",
                "Reproductor de audio accesible con play/pausa, barra de búsqueda, tiempo, velocidad y volumen.",
            ),
            usage: t(
                'Wraps a native `<audio>` with custom controls. The seek bar and the volume use the library\'s `Slider`. Keyboard on the player: Space or K play/pause, arrows seek 5s and change the volume, M mutes. Every built-in text is overridable through `labels`. With `variant="waveform"` it becomes a compact voice-message card: the file is downloaded and decoded in memory to draw the bars from its loudness (pulsing meanwhile; a default pattern if it fails, e.g. no CORS on another origin), and the waveform is a slider (click or drag to seek, arrows move 5s). For long audio, pass the peaks in `waveform`.',
                'Envolve um `<audio>` nativo com controles próprios. A barra de busca e o volume usam o `Slider` da biblioteca. Teclado no player: Espaço ou K play/pause, setas buscam 5s e mudam o volume, M silencia. Todo texto interno pode ser trocado em `labels`. Com `variant="waveform"` vira um cartão compacto de mensagem de voz: o arquivo é baixado e decodificado em memória para desenhar as barras pelo volume (pulsando enquanto isso; um padrão se falhar, ex.: sem CORS em outra origem), e a onda é um slider (clique ou arraste para buscar, setas movem 5s). Para áudio longo, passe os picos em `waveform`.',
                'Envuelve un `<audio>` nativo con controles propios. La barra de búsqueda y el volumen usan el `Slider` de la biblioteca. Teclado en el reproductor: Espacio o K play/pausa, las flechas buscan 5s y cambian el volumen, M silencia. Todo texto interno se puede cambiar en `labels`. Con `variant="waveform"` se convierte en una tarjeta compacta de mensaje de voz: el archivo se descarga y decodifica en memoria para dibujar las barras según el volumen (pulsando mientras tanto; un patrón si falla, p. ej. sin CORS en otro origen), y la onda es un slider (clic o arrastre para buscar, las flechas mueven 5s). Para audio largo, pasa los picos en `waveform`.',
            ),
            code: `import { AudioPlayer } from "vaiperui";

<AudioPlayer
  src="/audio/roar.mp3"
  label="${t("Voice note", "Nota de voz", "Nota de voz")}"
  onEnded={() => console.log("done")}
/>`,
            demo: (
                <div className="w-full max-w-md">
                    <AudioPlayer
                        src={AUDIO}
                        label={t("Voice note", "Nota de voz", "Nota de voz")}
                        labels={{
                            play: t("Play", "Reproduzir", "Reproducir"),
                            pause: t("Pause", "Pausar", "Pausar"),
                            mute: t("Mute", "Silenciar", "Silenciar"),
                            unmute: t("Unmute", "Ativar som", "Activar sonido"),
                            seek: t("Seek", "Buscar", "Buscar"),
                            volume: t("Volume", "Volume", "Volumen"),
                            speed: t("Playback speed", "Velocidade", "Velocidad"),
                        }}
                    />
                </div>
            ),
            accessibility: {
                notes: [
                    t(
                        'The player is a `role="group"` named by `label`, so screen readers announce it as one control.',
                        'O player é um `role="group"` nomeado por `label`, então leitores de tela o anunciam como um único controle.',
                        'El reproductor es un `role="group"` nombrado por `label`, así que los lectores de pantalla lo anuncian como un solo control.',
                    ),
                    t(
                        "The play button changes its name between `labels.play` and `labels.pause`; the mute button between `labels.mute` and `labels.unmute`.",
                        "O botão de play troca o nome entre `labels.play` e `labels.pause`; o de silenciar, entre `labels.mute` e `labels.unmute`.",
                        "El botón de play cambia su nombre entre `labels.play` y `labels.pause`; el de silenciar, entre `labels.mute` y `labels.unmute`.",
                    ),
                    t(
                        'The seek bar and the volume are `Slider`s (`role="slider"`) named by `labels.seek` and `labels.volume`; the speed button announces the current rate (e.g. `Playback speed: 1.5x`).',
                        'A barra de busca e o volume são `Slider`s (`role="slider"`) nomeados por `labels.seek` e `labels.volume`; o botão de velocidade anuncia a taxa atual (ex.: `Playback speed: 1.5x`).',
                        'La barra de búsqueda y el volumen son `Slider`s (`role="slider"`) nombrados por `labels.seek` y `labels.volume`; el botón de velocidad anuncia la tasa actual (p. ej. `Playback speed: 1.5x`).',
                    ),
                    t(
                        'With `variant="waveform"`, the waveform is a `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and an `aria-valuetext` like `0:12 of 0:40`; it is focusable only once the duration is known and `aria-disabled` before that.',
                        'Com `variant="waveform"`, a onda é um `role="slider"` com `aria-valuemin`, `aria-valuemax`, `aria-valuenow` e um `aria-valuetext` como `0:12 of 0:40`; só recebe foco depois que a duração é conhecida e fica `aria-disabled` antes disso.',
                        'Con `variant="waveform"`, la onda es un `role="slider"` con `aria-valuemin`, `aria-valuemax`, `aria-valuenow` y un `aria-valuetext` como `0:12 of 0:40`; solo recibe foco cuando se conoce la duración y está `aria-disabled` antes.',
                    ),
                    t(
                        "The waveform bars are `aria-hidden`, so only the slider is announced.",
                        "As barras da onda são `aria-hidden`, então apenas o slider é anunciado.",
                        "Las barras de la onda son `aria-hidden`, así que solo se anuncia el slider.",
                    ),
                    t(
                        "While the waveform is being analyzed the bars pulse, and the pulse is turned off under `prefers-reduced-motion`; if the analysis fails (e.g. no CORS) a default pattern is drawn and the player keeps working.",
                        "Enquanto a onda é analisada as barras pulsam, e o pulso é desligado com `prefers-reduced-motion`; se a análise falhar (ex.: sem CORS) um padrão é desenhado e o player continua funcionando.",
                        "Mientras se analiza la onda las barras pulsan, y el pulso se desactiva con `prefers-reduced-motion`; si el análisis falla (p. ej. sin CORS) se dibuja un patrón y el reproductor sigue funcionando.",
                    ),
                ],
                keys: [
                    {
                        keys: "Space / K",
                        action: t(
                            "Play or pause (when focus is not on a button or slider)",
                            "Play ou pause (quando o foco não está em um botão ou slider)",
                            "Play o pausa (cuando el foco no está en un botón o slider)",
                        ),
                    },
                    {
                        keys: "ArrowLeft / ArrowRight",
                        action: t(
                            "Seek 5s back / forward",
                            "Voltar / avançar 5s",
                            "Retroceder / avanzar 5s",
                        ),
                    },
                    {
                        keys: "ArrowUp / ArrowDown",
                        action: t("Volume up / down by 10%", "Volume +/- 10%", "Volumen +/- 10%"),
                    },
                    {
                        keys: "M",
                        action: t(
                            "Mute or unmute",
                            "Silenciar ou ativar o som",
                            "Silenciar o activar el sonido",
                        ),
                    },
                    {
                        keys: "Home / End",
                        action: t(
                            "On the waveform slider: jump to the start / end (arrows move 5s there)",
                            "No slider da onda: ir ao início / fim (as setas movem 5s ali)",
                            "En el slider de la onda: ir al inicio / final (las flechas mueven 5s ahí)",
                        ),
                    },
                    {
                        keys: "Tab",
                        action: t(
                            "Moves between the buttons and sliders",
                            "Percorre botões e sliders",
                            "Recorre botones y sliders",
                        ),
                    },
                ],
                caveats: [
                    t(
                        "There are no captions or transcript: provide a text alternative for spoken content (e.g. a transcript next to the player).",
                        "Não há legendas nem transcrição: ofereça uma alternativa em texto para conteúdo falado (ex.: transcrição ao lado do player).",
                        "No hay subtítulos ni transcripción: ofrece una alternativa en texto para el contenido hablado (p. ej. una transcripción junto al reproductor).",
                    ),
                    t(
                        "Pass a meaningful `label` and translate `labels` for the page language; the defaults are in English. `autoPlay` starts sound without a user action, avoid it.",
                        "Passe um `label` significativo e traduza `labels` para o idioma da página; os padrões estão em inglês. `autoPlay` inicia o som sem ação do usuário, evite.",
                        "Pasa un `label` significativo y traduce `labels` al idioma de la página; los predeterminados están en inglés. `autoPlay` inicia el sonido sin acción del usuario, evítalo.",
                    ),
                ],
            },
            props: [
                row(
                    "variant",
                    "default | waveform",
                    "default",
                    "default: seek bar, volume and mute. waveform: a compact card like a voice message, with a clickable waveform, current / total time and the speed button",
                    "default: barra de busca, volume e mudo. waveform: um cartão compacto como uma mensagem de voz, com onda clicável, tempo atual / total e botão de velocidade",
                    "default: barra de búsqueda, volumen y silencio. waveform: una tarjeta compacta como un mensaje de voz, con onda clicable, tiempo actual / total y botón de velocidad",
                ),
                row(
                    "bars",
                    "number",
                    "52",
                    "waveform variant: number of bars",
                    "variante waveform: quantidade de barras",
                    "variante waveform: cantidad de barras",
                ),
                row(
                    "waveform",
                    "number[]",
                    "—",
                    "waveform variant: peaks from 0 to 1, resampled to bars. Skips the download and analysis of the audio",
                    "variante waveform: picos de 0 a 1, reamostrados para as barras. Pula o download e a análise do áudio",
                    "variante waveform: picos de 0 a 1, remuestreados a las barras. Omite la descarga y el análisis del audio",
                ),
                row("src", "string", "—", "Audio URL", "URL do áudio", "URL del audio"),
                row(
                    "label",
                    "string",
                    "Audio",
                    "Accessible name of the player",
                    "Nome acessível do player",
                    "Nombre accesible del reproductor",
                ),
                row(
                    "preload",
                    "none | metadata | auto",
                    "metadata",
                    "How much the browser loads before play",
                    "Quanto o navegador carrega antes do play",
                    "Cuánto carga el navegador antes del play",
                ),
                row(
                    "loop / autoPlay",
                    "boolean",
                    "false",
                    "Native behaviors",
                    "Comportamentos nativos",
                    "Comportamientos nativos",
                ),
                row(
                    "speeds",
                    "number[]",
                    "[1, 1.5, 2]",
                    "Speeds the speed button cycles through; an empty list hides it",
                    "Velocidades pelas quais o botão alterna; lista vazia o esconde",
                    "Velocidades por las que alterna el botón; una lista vacía lo oculta",
                ),
                labelsRow("play, pause, mute, unmute, seek, volume, speed"),
                ...events,
                ...styleRows(true),
            ],
        },
        {
            slug: "video-player",
            name: "VideoPlayer",
            blurb: t(
                "Video player with custom controls, fullscreen, captions and keyboard shortcuts.",
                "Player de vídeo com controles próprios, tela cheia, legendas e atalhos de teclado.",
                "Reproductor de video con controles propios, pantalla completa, subtítulos y atajos de teclado.",
            ),
            usage: t(
                'Wraps a native `<video>`. The controls hide after `hideControlsAfter` ms of inactivity while playing and come back on mouse, touch or keyboard. Clicking the video toggles play. Shortcuts: Space/K, arrows (seek and volume), M, F (fullscreen). Put `<track kind="captions">` as children and a captions button appears. `variant="overlay"` adds a large play button in the center while paused and adapts to the player width (container query).',
                'Envolve um `<video>` nativo. Os controles somem após `hideControlsAfter` ms de inatividade durante a reprodução e voltam com mouse, toque ou teclado. Clicar no vídeo alterna o play. Atalhos: Espaço/K, setas (busca e volume), M, F (tela cheia). Passe `<track kind="captions">` como filho e um botão de legendas aparece. `variant="overlay"` adiciona um botão play grande no centro enquanto pausado e se adapta à largura do player (container query).',
                'Envuelve un `<video>` nativo. Los controles se ocultan tras `hideControlsAfter` ms de inactividad durante la reproducción y vuelven con ratón, toque o teclado. Hacer clic en el video alterna el play. Atajos: Espacio/K, flechas (búsqueda y volumen), M, F (pantalla completa). Pasa `<track kind="captions">` como hijo y aparece un botón de subtítulos. `variant="overlay"` añade un botón play grande en el centro mientras está en pausa y se adapta al ancho del reproductor (container query).',
            ),
            code: `import { VideoPlayer } from "vaiperui";

<VideoPlayer src="/video/flower.mp4" poster="/video/poster.jpg" label="Flower">
  <track kind="captions" src="/video/en.vtt" srcLang="en" label="English" />
</VideoPlayer>`,
            demo: (
                <div className="w-full max-w-xl">
                    <VideoPlayer
                        src={VIDEO}
                        label={t("Flower blooming", "Flor desabrochando", "Flor floreciendo")}
                        labels={{
                            play: t("Play", "Reproduzir", "Reproducir"),
                            pause: t("Pause", "Pausar", "Pausar"),
                            mute: t("Mute", "Silenciar", "Silenciar"),
                            unmute: t("Unmute", "Ativar som", "Activar sonido"),
                            seek: t("Seek", "Buscar", "Buscar"),
                            volume: t("Volume", "Volume", "Volumen"),
                            fullscreen: t("Fullscreen", "Tela cheia", "Pantalla completa"),
                            exitFullscreen: t(
                                "Exit fullscreen",
                                "Sair da tela cheia",
                                "Salir de pantalla completa",
                            ),
                            captions: t("Captions", "Legendas", "Subtítulos"),
                        }}
                    />
                </div>
            ),
            accessibility: {
                notes: [
                    t(
                        'The player is a focusable `role="group"` named by `label`; focus it (Tab or click on the video) and the shortcuts work.',
                        'O player é um `role="group"` focável nomeado por `label`; foque nele (Tab ou clique no vídeo) e os atalhos funcionam.',
                        'El reproductor es un `role="group"` enfocable nombrado por `label`; enfócalo (Tab o clic en el video) y los atajos funcionan.',
                    ),
                    t(
                        "The play, mute and fullscreen buttons change their name with the state (`play`/`pause`, `mute`/`unmute`, `fullscreen`/`exitFullscreen` in `labels`).",
                        "Os botões de play, silenciar e tela cheia mudam de nome conforme o estado (`play`/`pause`, `mute`/`unmute`, `fullscreen`/`exitFullscreen` em `labels`).",
                        "Los botones de play, silenciar y pantalla completa cambian de nombre según el estado (`play`/`pause`, `mute`/`unmute`, `fullscreen`/`exitFullscreen` en `labels`).",
                    ),
                    t(
                        'The seek bar and the volume are `Slider`s (`role="slider"`) named by `labels.seek` and `labels.volume`.',
                        'A barra de busca e o volume são `Slider`s (`role="slider"`) nomeados por `labels.seek` e `labels.volume`.',
                        'La barra de búsqueda y el volumen son `Slider`s (`role="slider"`) nombrados por `labels.seek` y `labels.volume`.',
                    ),
                    t(
                        "The captions button only appears when the video has `<track>` children, and it exposes `aria-pressed` for on/off.",
                        "O botão de legendas só aparece quando o vídeo tem filhos `<track>`, e expõe `aria-pressed` para ligado/desligado.",
                        "El botón de subtítulos solo aparece cuando el video tiene hijos `<track>`, y expone `aria-pressed` para activado/desactivado.",
                    ),
                    t(
                        "The controls hide after `hideControlsAfter` of inactivity while playing, never while a control has focus; hidden controls are `inert`, so they leave the tab order, and any key, focus or mouse movement brings them back.",
                        "Os controles somem após `hideControlsAfter` de inatividade durante a reprodução, nunca enquanto um controle tem foco; controles ocultos ficam `inert` (saem da ordem de tabulação) e qualquer tecla, foco ou movimento do mouse os traz de volta.",
                        "Los controles se ocultan tras `hideControlsAfter` de inactividad durante la reproducción, nunca mientras un control tiene el foco; los controles ocultos quedan `inert` (salen del orden de tabulación) y cualquier tecla, foco o movimiento del mouse los devuelve.",
                    ),
                    t(
                        'With `variant="overlay"`, the big central play button is `aria-hidden` and `tabIndex={-1}`: it is a shortcut for mouse and touch, and keyboard and screen reader users use the play button of the bar.',
                        'Com `variant="overlay"`, o botão de play central grande é `aria-hidden` e `tabIndex={-1}`: é um atalho para mouse e toque, e quem usa teclado e leitor de tela usa o botão de play da barra.',
                        'Con `variant="overlay"`, el botón de play central grande es `aria-hidden` y `tabIndex={-1}`: es un atajo para mouse y táctil, y quien usa teclado y lector de pantalla usa el botón de play de la barra.',
                    ),
                ],
                keys: [
                    {
                        keys: "Space / K",
                        action: t(
                            "Play or pause (when focus is not on a button or slider)",
                            "Play ou pause (quando o foco não está em um botão ou slider)",
                            "Play o pausa (cuando el foco no está en un botón o slider)",
                        ),
                    },
                    {
                        keys: "ArrowLeft / ArrowRight",
                        action: t(
                            "Seek 5s back / forward",
                            "Voltar / avançar 5s",
                            "Retroceder / avanzar 5s",
                        ),
                    },
                    {
                        keys: "ArrowUp / ArrowDown",
                        action: t("Volume up / down by 10%", "Volume +/- 10%", "Volumen +/- 10%"),
                    },
                    {
                        keys: "M",
                        action: t(
                            "Mute or unmute",
                            "Silenciar ou ativar o som",
                            "Silenciar o activar el sonido",
                        ),
                    },
                    {
                        keys: "F",
                        action: t(
                            "Toggle fullscreen",
                            "Alternar tela cheia",
                            "Alternar pantalla completa",
                        ),
                    },
                ],
                caveats: [
                    t(
                        'Captions are not generated: pass `<track kind="captions">` as children, and provide a transcript or audio description when the content needs it.',
                        'As legendas não são geradas: passe `<track kind="captions">` como filhos e ofereça transcrição ou audiodescrição quando o conteúdo precisar.',
                        'Los subtítulos no se generan: pasa `<track kind="captions">` como hijos y ofrece transcripción o audiodescripción cuando el contenido lo necesite.',
                    ),
                    t(
                        "Avoid `autoPlay`; if you must, start `startMuted`, since browsers block autoplay with sound and it surprises users. Translate `labels` for the page language.",
                        "Evite `autoPlay`; se precisar, comece com `startMuted`, pois navegadores bloqueiam autoplay com som e isso surpreende o usuário. Traduza `labels` para o idioma da página.",
                        "Evita `autoPlay`; si es necesario, empieza con `startMuted`, pues los navegadores bloquean el autoplay con sonido y sorprende al usuario. Traduce `labels` al idioma de la página.",
                    ),
                ],
            },
            props: [
                row(
                    "variant",
                    "default | overlay",
                    "default",
                    "overlay: large play button in the center while paused; narrower than 560px the seek bar moves below the buttons and the volume slider hides",
                    "overlay: botão play grande no centro enquanto pausado; abaixo de 560px a barra de busca vai para baixo dos botões e o slider de volume some",
                    "overlay: botón play grande en el centro mientras está en pausa; por debajo de 560px la barra de búsqueda baja de los botones y el slider de volumen se oculta",
                ),
                row("src", "string", "—", "Video URL", "URL do vídeo", "URL del video"),
                row(
                    "poster",
                    "string",
                    none,
                    "Image shown before playing",
                    "Imagem exibida antes de tocar",
                    "Imagen mostrada antes de reproducir",
                ),
                row(
                    "label",
                    "string",
                    "Video",
                    "Accessible name of the player",
                    "Nome acessível do player",
                    "Nombre accesible del reproductor",
                ),
                row(
                    "autoPlay / muted / loop",
                    "boolean",
                    "false",
                    "Native behaviors (autoPlay almost always needs muted)",
                    "Comportamentos nativos (autoPlay quase sempre precisa de muted)",
                    "Comportamientos nativos (autoPlay casi siempre necesita muted)",
                ),
                row(
                    "preload",
                    "none | metadata | auto",
                    "metadata",
                    "How much the browser loads before play",
                    "Quanto o navegador carrega antes do play",
                    "Cuánto carga el navegador antes del play",
                ),
                row(
                    "hideControlsAfter",
                    "number",
                    "2500",
                    "Idle ms before hiding the controls while playing; 0 keeps them visible",
                    "Ms de inatividade antes de esconder os controles ao tocar; 0 os mantém visíveis",
                    "Ms de inactividad antes de ocultar los controles al reproducir; 0 los mantiene visibles",
                ),
                row(
                    "children",
                    "ReactNode",
                    none,
                    "`<track>` (captions) and extra `<source>` elements",
                    "`<track>` (legendas) e elementos `<source>` extras",
                    "`<track>` (subtítulos) y elementos `<source>` extra",
                ),
                labelsRow(
                    "play, pause, mute, unmute, seek, volume, fullscreen, exitFullscreen, captions",
                ),
                ...events,
                ...styleRows(true),
            ],
        },
        {
            slug: "gallery",
            name: "Gallery",
            blurb: t(
                "Responsive grid of thumbnails that opens a full-screen viewer.",
                "Grade responsiva de miniaturas que abre um visualizador em tela cheia.",
                "Cuadrícula responsiva de miniaturas que abre un visor a pantalla completa.",
            ),
            usage: t(
                "Pass `items` (`src`, `alt`, optional `thumbnail` and `caption`). Each thumbnail is a button that opens the `Lightbox` on that image; focus returns to the thumbnail on close. Control the grid with `columns`, `gap` and `aspectRatio`, or turn the viewer off with `lightbox={false}` and use `onItemClick`.",
                "Passe `items` (`src`, `alt`, `thumbnail` e `caption` opcionais). Cada miniatura é um botão que abre o `Lightbox` naquela imagem; o foco volta para a miniatura ao fechar. Controle a grade com `columns`, `gap` e `aspectRatio`, ou desligue o visualizador com `lightbox={false}` e use `onItemClick`.",
                "Pasa `items` (`src`, `alt`, `thumbnail` y `caption` opcionales). Cada miniatura es un botón que abre el `Lightbox` en esa imagen; el foco vuelve a la miniatura al cerrar. Controla la cuadrícula con `columns`, `gap` y `aspectRatio`, o desactiva el visor con `lightbox={false}` y usa `onItemClick`.",
            ),
            code: `import { Gallery } from "vaiperui";

<Gallery
  aria-label="${t("Trip photos", "Fotos da viagem", "Fotos del viaje")}"
  columns={3}
  items={[
    { src: "/photos/road.jpg", alt: "Mountain road", caption: "Road" },
    { src: "/photos/sky.jpg", alt: "Starry sky", thumbnail: "/photos/sky-sm.jpg" },
  ]}
/>`,
            demo: (
                <GalleryDemo
                    alt={t("Photo", "Foto", "Foto")}
                    openPrefix={t("Open image", "Ampliar imagem", "Ampliar imagen")}
                />
            ),
            accessibility: {
                notes: [
                    t(
                        "Items are a list (`<ul aria-label>`), and each thumbnail is a real `<button>`, reachable with Tab and activated with Enter or Space.",
                        "Os itens formam uma lista (`<ul aria-label>`) e cada miniatura é um `<button>` real, alcançável com Tab e ativado com Enter ou Espaço.",
                        "Los elementos forman una lista (`<ul aria-label>`) y cada miniatura es un `<button>` real, accesible con Tab y activado con Enter o Espacio.",
                    ),
                    t(
                        "Each button is named by `openLabel(item, index)`, which by default is `Open image N: <alt>`.",
                        "Cada botão é nomeado por `openLabel(item, index)`, que por padrão é `Open image N: <alt>`.",
                        "Cada botón se nombra con `openLabel(item, index)`, que por defecto es `Open image N: <alt>`.",
                    ),
                    t(
                        "`alt` is required on every item and is used on the thumbnail and in the viewer.",
                        "`alt` é obrigatório em cada item e é usado na miniatura e no visualizador.",
                        "`alt` es obligatorio en cada elemento y se usa en la miniatura y en el visor.",
                    ),
                    t(
                        "The hover caption is also shown when the button has keyboard focus.",
                        "A legenda de hover também aparece quando o botão tem foco do teclado.",
                        "El pie de foto de hover también se muestra cuando el botón tiene el foco del teclado.",
                    ),
                    t(
                        "With `lightbox`, the click opens the `Lightbox` (a modal dialog); without it, the buttons only call `onItemClick`.",
                        "Com `lightbox`, o clique abre o `Lightbox` (um diálogo modal); sem ele, os botões só chamam `onItemClick`.",
                        "Con `lightbox`, el clic abre el `Lightbox` (un diálogo modal); sin él, los botones solo llaman a `onItemClick`.",
                    ),
                ],
                keys: [
                    {
                        keys: "Tab",
                        action: t(
                            "Moves between thumbnails",
                            "Percorre as miniaturas",
                            "Recorre las miniaturas",
                        ),
                    },
                    {
                        keys: "Enter / Space",
                        action: t(
                            "Opens the image in the viewer",
                            "Abre a imagem no visualizador",
                            "Abre la imagen en el visor",
                        ),
                    },
                ],
                caveats: [
                    t(
                        "Write a real `alt` for each image (describe it, or use an empty string only for purely decorative ones, which should not be in a gallery); the component does not check it.",
                        "Escreva um `alt` real para cada imagem (descreva-a); o componente não valida isso.",
                        "Escribe un `alt` real para cada imagen (descríbela); el componente no lo valida.",
                    ),
                    t(
                        "Pass `aria-label` for the list and translate `openLabel` for the page language.",
                        "Passe `aria-label` para a lista e traduza `openLabel` para o idioma da página.",
                        "Pasa `aria-label` para la lista y traduce `openLabel` al idioma de la página.",
                    ),
                ],
            },
            props: [
                row(
                    "items",
                    "{ src, alt, thumbnail?, caption? }[]",
                    "—",
                    "Images. `thumbnail` is used in the grid, `src` in the viewer",
                    "Imagens. `thumbnail` vai na grade, `src` no visualizador",
                    "Imágenes. `thumbnail` va en la cuadrícula, `src` en el visor",
                ),
                row(
                    "columns",
                    "number",
                    "3",
                    "Grid columns",
                    "Colunas da grade",
                    "Columnas de la cuadrícula",
                ),
                row(
                    "gap",
                    "number",
                    "8",
                    "Space between thumbnails, in px",
                    "Espaço entre miniaturas, em px",
                    "Espacio entre miniaturas, en px",
                ),
                row(
                    "aspectRatio",
                    "string",
                    "4 / 3",
                    "CSS aspect ratio of each thumbnail",
                    "Proporção CSS de cada miniatura",
                    "Proporción CSS de cada miniatura",
                ),
                row(
                    "lightbox",
                    "boolean",
                    "true",
                    "Open the viewer on click",
                    "Abrir o visualizador ao clicar",
                    "Abrir el visor al hacer clic",
                ),
                row(
                    "onItemClick",
                    "(item, index) => void",
                    none,
                    "Called on every thumbnail click",
                    "Chamado a cada clique em uma miniatura",
                    "Llamado en cada clic en una miniatura",
                ),
                row(
                    "openLabel",
                    "(item, index) => string",
                    "Open image N: alt",
                    "Accessible name of each thumbnail button",
                    "Nome acessível de cada botão de miniatura",
                    "Nombre accesible de cada botón de miniatura",
                ),
                row(
                    "lightboxProps",
                    "{ label, closeLabel, previousLabel, nextLabel, counterLabel }",
                    none,
                    "Texts of the viewer",
                    "Textos do visualizador",
                    "Textos del visor",
                ),
                row(
                    "radius",
                    "none | sm | md | lg | full",
                    "md",
                    "Thumbnail rounding",
                    "Arredondamento das miniaturas",
                    "Redondeo de las miniaturas",
                ),
                row(
                    "animation",
                    "none | smooth | fast | bounce",
                    "smooth",
                    "Hover zoom transition",
                    "Transição do zoom ao passar o mouse",
                    "Transición del zoom al pasar el ratón",
                ),
                row(
                    "aria-label",
                    "string",
                    none,
                    "Describes the list of images",
                    "Descreve a lista de imagens",
                    "Describe la lista de imágenes",
                ),
            ],
        },
        {
            slug: "lightbox",
            name: "Lightbox",
            blurb: t(
                "Full-screen image viewer with navigation, counter and captions.",
                "Visualizador de imagens em tela cheia com navegação, contador e legendas.",
                "Visor de imágenes a pantalla completa con navegación, contador y subtítulos.",
            ),
            usage: t(
                'A modal `role="dialog"` rendered in a portal: focus is trapped, the page scroll is locked, Escape closes and ←/→ navigate (wrapping around). `open` and `index` can be controlled; without them it keeps its own state (`defaultOpen`, `defaultIndex`). Focus returns to the opener on close unless `onCloseAutoFocus` calls `preventDefault()`.',
                'Um `role="dialog"` modal renderizado em portal: o foco fica preso, o scroll da página é travado, Esc fecha e ←/→ navegam (com volta ao início). `open` e `index` podem ser controlados; sem eles guarda o próprio estado (`defaultOpen`, `defaultIndex`). O foco volta ao elemento de origem ao fechar, a menos que `onCloseAutoFocus` chame `preventDefault()`.',
                'Un `role="dialog"` modal renderizado en un portal: el foco queda atrapado, el scroll de la página se bloquea, Esc cierra y ←/→ navegan (dando la vuelta). `open` e `index` pueden ser controlados; sin ellos guarda su propio estado (`defaultOpen`, `defaultIndex`). El foco vuelve al elemento de origen al cerrar, salvo que `onCloseAutoFocus` llame a `preventDefault()`.',
            ),
            code: `import { useState } from "react";
import { Lightbox } from "vaiperui";

const [open, setOpen] = useState(false);

<button onClick={() => setOpen(true)}>${t("Open", "Abrir", "Abrir")}</button>
<Lightbox
  open={open}
  onOpenChange={setOpen}
  items={[
    { src: "/photos/road.jpg", alt: "Mountain road", caption: "Road" },
    { src: "/photos/sky.jpg", alt: "Starry sky" },
  ]}
/>`,
            demo: (
                <LightboxDemo
                    alt={t("Photo", "Foto", "Foto")}
                    trigger={t("Open viewer", "Abrir visualizador", "Abrir visor")}
                    labels={{
                        label: t("Image viewer", "Visualizador de imagens", "Visor de imágenes"),
                        closeLabel: t("Close", "Fechar", "Cerrar"),
                        previousLabel: t("Previous image", "Imagem anterior", "Imagen anterior"),
                        nextLabel: t("Next image", "Próxima imagem", "Imagen siguiente"),
                    }}
                />
            ),
            accessibility: {
                notes: [
                    t(
                        'The viewer is a `role="dialog"` with `aria-modal="true"`, named by `label`, rendered in a portal.',
                        'O visualizador é um `role="dialog"` com `aria-modal="true"`, nomeado por `label`, renderizado em um portal.',
                        'El visor es un `role="dialog"` con `aria-modal="true"`, nombrado por `label`, renderizado en un portal.',
                    ),
                    t(
                        "On open, focus moves inside and Tab cycles inside the dialog (focus trap); the page scroll is locked while it is open.",
                        "Ao abrir, o foco vai para dentro e o Tab circula dentro do diálogo (focus trap); a rolagem da página fica bloqueada enquanto está aberto.",
                        "Al abrir, el foco entra y Tab circula dentro del diálogo (focus trap); el scroll de la página se bloquea mientras está abierto.",
                    ),
                    t(
                        "On close, focus returns to the element that had it before, unless `onCloseAutoFocus` calls `preventDefault()`.",
                        "Ao fechar, o foco volta ao elemento que o tinha antes, a menos que `onCloseAutoFocus` chame `preventDefault()`.",
                        "Al cerrar, el foco vuelve al elemento que lo tenía antes, salvo que `onCloseAutoFocus` llame a `preventDefault()`.",
                    ),
                    t(
                        "Close, previous and next are real buttons named by `closeLabel`, `previousLabel` and `nextLabel`; previous/next only exist with more than one image and wrap around.",
                        "Fechar, anterior e próxima são botões reais nomeados por `closeLabel`, `previousLabel` e `nextLabel`; anterior/próxima só existem com mais de uma imagem e dão a volta.",
                        "Cerrar, anterior y siguiente son botones reales nombrados por `closeLabel`, `previousLabel` y `nextLabel`; anterior/siguiente solo existen con más de una imagen y dan la vuelta.",
                    ),
                    t(
                        "The image uses its `alt`, inside a `<figure>` with the `caption` as `<figcaption>`.",
                        "A imagem usa seu `alt`, dentro de um `<figure>` com a `caption` como `<figcaption>`.",
                        "La imagen usa su `alt`, dentro de un `<figure>` con la `caption` como `<figcaption>`.",
                    ),
                    t(
                        'The counter (`counterLabel`, e.g. `2 / 5`) is an `aria-live="polite"` region, so the change of image is announced.',
                        'O contador (`counterLabel`, ex.: `2 / 5`) é uma região `aria-live="polite"`, então a troca de imagem é anunciada.',
                        'El contador (`counterLabel`, p. ej. `2 / 5`) es una región `aria-live="polite"`, así que el cambio de imagen se anuncia.',
                    ),
                ],
                keys: [
                    {
                        keys: "Esc",
                        action: t("Closes the viewer", "Fecha o visualizador", "Cierra el visor"),
                    },
                    {
                        keys: "ArrowLeft / ArrowRight",
                        action: t(
                            "Previous / next image (with more than one)",
                            "Imagem anterior / próxima (com mais de uma)",
                            "Imagen anterior / siguiente (con más de una)",
                        ),
                    },
                    {
                        keys: "Tab / Shift+Tab",
                        action: t(
                            "Cycles through the buttons inside the dialog",
                            "Circula pelos botões dentro do diálogo",
                            "Circula por los botones dentro del diálogo",
                        ),
                    },
                ],
                caveats: [
                    t(
                        "Every item needs an `alt`; the component does not generate one.",
                        "Todo item precisa de um `alt`; o componente não gera um.",
                        "Cada elemento necesita un `alt`; el componente no lo genera.",
                    ),
                    t(
                        "Clicking the dark backdrop also closes it, but that is a mouse shortcut; keyboard users close it with Esc or the close button. Translate the labels for the page language.",
                        "Clicar no fundo escuro também fecha, mas é um atalho de mouse; quem usa teclado fecha com Esc ou o botão de fechar. Traduza os rótulos para o idioma da página.",
                        "Hacer clic en el fondo oscuro también cierra, pero es un atajo de mouse; quien usa teclado cierra con Esc o el botón de cerrar. Traduce las etiquetas al idioma de la página.",
                    ),
                ],
            },
            props: [
                row(
                    "items",
                    "{ src, alt, caption? }[]",
                    "—",
                    "Images to show",
                    "Imagens a mostrar",
                    "Imágenes a mostrar",
                ),
                row(
                    "open / defaultOpen",
                    "boolean",
                    "false",
                    "Controlled / initial visibility",
                    "Visibilidade controlada / inicial",
                    "Visibilidad controlada / inicial",
                ),
                row(
                    "onOpenChange",
                    "(open: boolean) => void",
                    none,
                    "Called when it asks to close",
                    "Chamado quando pede para fechar",
                    "Llamado cuando pide cerrarse",
                ),
                row(
                    "index / defaultIndex",
                    "number",
                    "0",
                    "Controlled / initial image",
                    "Imagem controlada / inicial",
                    "Imagen controlada / inicial",
                ),
                row(
                    "onIndexChange",
                    "(index: number) => void",
                    none,
                    "Called when the image changes",
                    "Chamado quando a imagem muda",
                    "Llamado cuando cambia la imagen",
                ),
                row(
                    "label",
                    "string",
                    "Image viewer",
                    "Accessible name of the dialog",
                    "Nome acessível do diálogo",
                    "Nombre accesible del diálogo",
                ),
                row(
                    "closeLabel / previousLabel / nextLabel",
                    "string",
                    "Close / Previous image / Next image",
                    "Accessible names of the buttons",
                    "Nomes acessíveis dos botões",
                    "Nombres accesibles de los botones",
                ),
                row(
                    "counterLabel",
                    "(index, total) => string",
                    "1 / 6",
                    "Text of the counter",
                    "Texto do contador",
                    "Texto del contador",
                ),
                row(
                    "onCloseAutoFocus",
                    "(event: Event) => void",
                    none,
                    "On close; preventDefault() skips returning the focus",
                    "Ao fechar; preventDefault() evita devolver o foco",
                    "Al cerrar; preventDefault() evita devolver el foco",
                ),
            ],
        },
        {
            slug: "carousel",
            name: "Carousel",
            blurb: t(
                "Slides with arrows, dots, keyboard, optional autoplay and loop.",
                "Slides com setas, indicadores, teclado, autoplay opcional e loop.",
                "Slides con flechas, indicadores, teclado, autoplay opcional y loop.",
            ),
            usage: t(
                'Each child is a slide. It is a `region` with `aria-roledescription="carousel"`; slides are `group`s and the ones out of view are hidden from assistive tech and not focusable. ←/→/Home/End navigate. `autoplay` pauses on hover and focus and never runs with `prefers-reduced-motion`. `index` can be controlled; `slidesPerView` shows several slides at once.',
                'Cada filho é um slide. É uma `region` com `aria-roledescription="carousel"`; os slides são `group`s e os fora da vista ficam ocultos para tecnologias assistivas e sem foco. ←/→/Home/End navegam. O `autoplay` pausa com o mouse e o foco e nunca roda com `prefers-reduced-motion`. `index` pode ser controlado; `slidesPerView` mostra vários slides de uma vez.',
                'Cada hijo es un slide. Es una `region` con `aria-roledescription="carousel"`; los slides son `group`s y los que no se ven quedan ocultos para tecnologías de apoyo y sin foco. ←/→/Home/End navegan. El `autoplay` se pausa con el ratón y el foco y nunca corre con `prefers-reduced-motion`. `index` puede ser controlado; `slidesPerView` muestra varios slides a la vez.',
            ),
            code: `import { Carousel } from "vaiperui";

<Carousel aria-label="${carouselText.label}" loop autoplay={4000}>
  <img src="/photos/1.jpg" alt="One" />
  <img src="/photos/2.jpg" alt="Two" />
  <img src="/photos/3.jpg" alt="Three" />
</Carousel>`,
            demo: <CarouselDemo {...carouselText} loop />,
            accessibility: {
                notes: [
                    t(
                        'The root is a `<section>` with `aria-roledescription="carousel"` and the `aria-label` you pass.',
                        'A raiz é uma `<section>` com `aria-roledescription="carousel"` e o `aria-label` que você passa.',
                        'La raíz es una `<section>` con `aria-roledescription="carousel"` y el `aria-label` que pasas.',
                    ),
                    t(
                        'Each slide is a `role="group"` with `aria-roledescription="slide"` and a name from `slideLabel` (default `1 of 5`).',
                        'Cada slide é um `role="group"` com `aria-roledescription="slide"` e um nome vindo de `slideLabel` (padrão `1 of 5`).',
                        'Cada slide es un `role="group"` con `aria-roledescription="slide"` y un nombre de `slideLabel` (por defecto `1 of 5`).',
                    ),
                    t(
                        "Slides out of view are `aria-hidden` and `inert`, so their content is neither read nor focusable.",
                        "Slides fora de vista ficam `aria-hidden` e `inert`, então seu conteúdo não é lido nem focável.",
                        "Los slides fuera de vista quedan `aria-hidden` e `inert`, así que su contenido no se lee ni se enfoca.",
                    ),
                    t(
                        'The arrows are buttons named by `previousLabel` / `nextLabel` (disabled at the ends unless `loop`), and the dots are buttons named by `dotLabel` with `aria-current="true"` on the current one.',
                        'As setas são botões nomeados por `previousLabel` / `nextLabel` (desabilitados nas pontas, exceto com `loop`), e os pontos são botões nomeados por `dotLabel` com `aria-current="true"` no atual.',
                        'Las flechas son botones nombrados por `previousLabel` / `nextLabel` (deshabilitadas en los extremos salvo con `loop`), y los puntos son botones nombrados por `dotLabel` con `aria-current="true"` en el actual.',
                    ),
                    t(
                        "Autoplay pauses while the pointer is over the carousel or focus is inside it, and does not run at all under `prefers-reduced-motion: reduce`; the slide transition is also removed there.",
                        "O autoplay pausa enquanto o ponteiro está sobre o carrossel ou o foco está dentro dele, e não roda sob `prefers-reduced-motion: reduce`; a transição entre slides também é removida.",
                        "El autoplay se pausa mientras el puntero está sobre el carrusel o el foco está dentro, y no corre con `prefers-reduced-motion: reduce`; la transición entre slides también se elimina.",
                    ),
                    t(
                        'The slide area is `aria-live="off"` while autoplay runs and `polite` otherwise, so manual changes are announced.',
                        'A área dos slides é `aria-live="off"` enquanto o autoplay roda e `polite` caso contrário, então trocas manuais são anunciadas.',
                        'El área de slides es `aria-live="off"` mientras corre el autoplay y `polite` en otro caso, así que los cambios manuales se anuncian.',
                    ),
                ],
                keys: [
                    {
                        keys: "ArrowLeft / ArrowRight",
                        action: t(
                            "Previous / next slide (wraps with `loop`)",
                            "Slide anterior / próximo (dá a volta com `loop`)",
                            "Slide anterior / siguiente (da la vuelta con `loop`)",
                        ),
                    },
                    {
                        keys: "Home / End",
                        action: t(
                            "First / last slide",
                            "Primeiro / último slide",
                            "Primer / último slide",
                        ),
                    },
                    {
                        keys: "Tab",
                        action: t(
                            "Moves through the arrows, dots and focusable content of the visible slides",
                            "Percorre setas, pontos e conteúdo focável dos slides visíveis",
                            "Recorre flechas, puntos y contenido enfocable de los slides visibles",
                        ),
                    },
                ],
                caveats: [
                    t(
                        "Autoplay has no pause button; hover or focus pauses it. Prefer no autoplay, or a long delay, for content people need to read.",
                        "O autoplay não tem botão de pausa; hover ou foco o pausam. Prefira sem autoplay, ou um intervalo longo, para conteúdo que precisa ser lido.",
                        "El autoplay no tiene botón de pausa; hover o foco lo pausan. Prefiere sin autoplay, o un intervalo largo, para contenido que hay que leer.",
                    ),
                    t(
                        "Alt text of images, and the labels (`aria-label`, `slideLabel`, `dotLabel`, arrows) in the page language, are up to your app.",
                        "O texto alternativo das imagens e os rótulos (`aria-label`, `slideLabel`, `dotLabel`, setas) no idioma da página são responsabilidade do seu app.",
                        "El texto alternativo de las imágenes y las etiquetas (`aria-label`, `slideLabel`, `dotLabel`, flechas) en el idioma de la página son responsabilidad de tu app.",
                    ),
                ],
            },
            props: [
                row(
                    "children",
                    "ReactNode",
                    "—",
                    "One slide per child",
                    "Um slide por filho",
                    "Un slide por hijo",
                ),
                row(
                    "aria-label",
                    "string",
                    "—",
                    "Accessible name of the carousel",
                    "Nome acessível do carrossel",
                    "Nombre accesible del carrusel",
                ),
                row(
                    "index / defaultIndex",
                    "number",
                    "0",
                    "Controlled / initial first visible slide",
                    "Primeiro slide visível controlado / inicial",
                    "Primer slide visible controlado / inicial",
                ),
                row(
                    "onIndexChange",
                    "(index: number) => void",
                    none,
                    "Called when the position changes",
                    "Chamado quando a posição muda",
                    "Llamado cuando cambia la posición",
                ),
                row(
                    "slidesPerView",
                    "number",
                    "1",
                    "Slides visible at once",
                    "Slides visíveis ao mesmo tempo",
                    "Slides visibles a la vez",
                ),
                row(
                    "loop",
                    "boolean",
                    "false",
                    "Wrap from the last position to the first",
                    "Voltar do fim ao início",
                    "Volver del final al inicio",
                ),
                row(
                    "autoplay",
                    "boolean | number",
                    "false",
                    "Advance every N ms (true = 5000). Pauses on hover/focus",
                    "Avança a cada N ms (true = 5000). Pausa com mouse/foco",
                    "Avanza cada N ms (true = 5000). Se pausa con ratón/foco",
                ),
                row(
                    "showArrows / showDots",
                    "boolean",
                    "true",
                    "Show the arrows / dots",
                    "Mostrar as setas / indicadores",
                    "Mostrar las flechas / indicadores",
                ),
                row(
                    "previousLabel / nextLabel",
                    "string",
                    "Previous slide / Next slide",
                    "Accessible names of the arrows",
                    "Nomes acessíveis das setas",
                    "Nombres accesibles de las flechas",
                ),
                row(
                    "dotLabel",
                    "(index) => string",
                    "Go to slide N",
                    "Accessible name of each dot",
                    "Nome acessível de cada indicador",
                    "Nombre accesible de cada indicador",
                ),
                row(
                    "slideLabel",
                    "(index, total) => string",
                    "N of total",
                    "Accessible name of each slide",
                    "Nome acessível de cada slide",
                    "Nombre accesible de cada slide",
                ),
                ...styleRows(true),
            ],
        },
    ];
}

export function getMediaVariations(locale: Locale): Record<string, VariationGroup[]> {
    const t = makeT(locale);
    const colorsTitle = t("Colors", "Cores", "Colores");
    const colorsFile = t("colors.tsx", "cores.tsx", "colores.tsx");
    const sizesTitle = t("Sizes", "Tamanhos", "Tamaños");
    const sizesFile = t("sizes.tsx", "tamanhos.tsx", "tamanos.tsx");
    const customTitle = t("Custom color", "Cor personalizada", "Color personalizado");
    const customFile = t("custom-color.tsx", "cor-personalizada.tsx", "color-personalizado.tsx");
    const alt = t("Photo", "Foto", "Foto");
    const openPrefix = t("Open image", "Ampliar imagem", "Ampliar imagen");
    const carouselText = {
        alt: t("Slide", "Slide", "Slide"),
        label: t("Featured slides", "Slides em destaque", "Slides destacados"),
        previousLabel: t("Previous slide", "Slide anterior", "Slide anterior"),
        nextLabel: t("Next slide", "Próximo slide", "Siguiente slide"),
        dotPrefix: t("Go to slide", "Ir para o slide", "Ir al slide"),
    };

    const player = (tag: "AudioPlayer" | "VideoPlayer"): VariationGroup[] => {
        const render = (props: {
            variantColor?: (typeof COLORS)[number];
            size?: (typeof SIZES)[number];
            customColor?: string;
        }) =>
            tag === "AudioPlayer" ? (
                <AudioPlayer src={AUDIO} label="Audio" {...props} />
            ) : (
                <VideoPlayer src={VIDEO} label="Video" {...props} />
            );
        const wrap = (node: React.ReactNode) => <div className="w-full max-w-md">{node}</div>;
        const src = tag === "AudioPlayer" ? "/audio/roar.mp3" : "/video/flower.mp4";
        const variants: VariationGroup =
            tag === "AudioPlayer"
                ? {
                      title: t("Variants", "Variantes", "Variantes"),
                      file: t("variants.tsx", "variantes.tsx", "variantes.tsx"),
                      description: t(
                          "`waveform` is a compact voice-message card: a clickable waveform, current / total time and the speed button.",
                          "`waveform` é um cartão compacto de mensagem de voz: onda clicável, tempo atual / total e botão de velocidade.",
                          "`waveform` es una tarjeta compacta de mensaje de voz: onda clicable, tiempo actual / total y botón de velocidad.",
                      ),
                      code: `<AudioPlayer src="${src}" />
<AudioPlayer src="${src}" variant="waveform" />
<AudioPlayer src="${src}" variant="waveform" speeds={[0.75, 1, 1.25, 1.5]} />
// peaks from 0 to 1, computed on the server: skips the download and analysis
<AudioPlayer src="${src}" variant="waveform" waveform={[0.1, 0.4, 0.9, 0.6, 0.2]} />`,
                      items: [
                          {
                              label: "default",
                              node: wrap(<AudioPlayer src={AUDIO} label="Audio" />),
                          },
                          {
                              label: "waveform",
                              node: wrap(
                                  <AudioPlayer src={AUDIO} label="Audio" variant="waveform" />,
                              ),
                          },
                          {
                              label: "waveform + speeds",
                              node: wrap(
                                  <AudioPlayer
                                      src={AUDIO}
                                      label="Audio"
                                      variant="waveform"
                                      speeds={[0.75, 1, 1.25, 1.5]}
                                  />,
                              ),
                          },
                          {
                              label: "waveform + peaks",
                              node: wrap(
                                  <AudioPlayer
                                      src={AUDIO}
                                      label="Audio"
                                      variant="waveform"
                                      bars={40}
                                      waveform={[0.1, 0.4, 0.9, 0.6, 0.2, 0.7, 1, 0.5, 0.3, 0.8]}
                                  />,
                              ),
                          },
                      ],
                  }
                : {
                      title: t("Variants", "Variantes", "Variantes"),
                      file: t("variants.tsx", "variantes.tsx", "variantes.tsx"),
                      description: t(
                          "`overlay` adds a large play button in the center while paused. Narrower than 560px the seek bar moves below the buttons and the volume slider hides.",
                          "`overlay` adiciona um botão play grande no centro enquanto pausado. Abaixo de 560px a barra de busca vai para baixo dos botões e o slider de volume some.",
                          "`overlay` añade un botón play grande en el centro mientras está en pausa. Por debajo de 560px la barra de búsqueda baja de los botones y el slider de volumen se oculta.",
                      ),
                      code: `<VideoPlayer src="${src}" />
<VideoPlayer src="${src}" variant="overlay" />`,
                      items: [
                          {
                              label: "default",
                              node: wrap(<VideoPlayer src={VIDEO} label="Video" />),
                          },
                          {
                              label: "overlay",
                              node: wrap(
                                  <VideoPlayer src={VIDEO} label="Video" variant="overlay" />,
                              ),
                          },
                          {
                              label: t(
                                  "overlay, narrow (300px)",
                                  "overlay, estreito (300px)",
                                  "overlay, estrecho (300px)",
                              ),
                              node: (
                                  <div className="w-[300px] max-w-full">
                                      <VideoPlayer src={VIDEO} label="Video" variant="overlay" />
                                  </div>
                              ),
                          },
                      ],
                  };
        return [
            variants,
            {
                title: colorsTitle,
                file: colorsFile,
                code: COLORS.map((c) => `<${tag} src="${src}" variantColor="${c}" />`).join("\n"),
                items: COLORS.map((c) => ({ label: c, node: wrap(render({ variantColor: c })) })),
            },
            {
                title: sizesTitle,
                file: sizesFile,
                code: SIZES.map((s) => `<${tag} src="${src}" size="${s}" />`).join("\n"),
                items: SIZES.map((s) => ({ label: s, node: wrap(render({ size: s })) })),
            },
            {
                title: customTitle,
                file: customFile,
                code: `<${tag} src="${src}" customColor="#db2777" />\n<${tag} src="${src}" customColor={{ light: "#7c3aed", dark: "#c4b5fd" }} />`,
                items: [
                    {
                        label: t("Pink", "Rosa", "Rosa"),
                        node: wrap(render({ customColor: "#db2777" })),
                    },
                    {
                        label: t("Per theme", "Por tema", "Por tema"),
                        node: wrap(
                            tag === "AudioPlayer" ? (
                                <AudioPlayer
                                    src={AUDIO}
                                    customColor={{ light: "#7c3aed", dark: "#c4b5fd" }}
                                />
                            ) : (
                                <VideoPlayer
                                    src={VIDEO}
                                    customColor={{ light: "#7c3aed", dark: "#c4b5fd" }}
                                />
                            ),
                        ),
                    },
                ],
            },
        ];
    };

    return {
        "audio-player": player("AudioPlayer"),
        "video-player": player("VideoPlayer"),
        gallery: [
            {
                title: t("Columns", "Colunas", "Columnas"),
                file: t("columns.tsx", "colunas.tsx", "columnas.tsx"),
                code: `<Gallery columns={2} items={items} />\n<Gallery columns={4} aspectRatio="1 / 1" items={items} />`,
                items: [
                    {
                        label: "2",
                        node: (
                            <GalleryDemo alt={alt} openPrefix={openPrefix} columns={2} count={4} />
                        ),
                    },
                    {
                        label: `4 · 1 / 1`,
                        node: (
                            <GalleryDemo
                                alt={alt}
                                openPrefix={openPrefix}
                                columns={4}
                                aspectRatio="1 / 1"
                            />
                        ),
                    },
                ],
            },
            {
                title: t("Radius and gap", "Radius e espaçamento", "Radius y espaciado"),
                file: t("radius.tsx", "radius.tsx", "radius.tsx"),
                code: `<Gallery radius="none" gap={2} items={items} />\n<Gallery radius="lg" gap={16} items={items} />`,
                items: [
                    {
                        label: "none · 2",
                        node: (
                            <GalleryDemo
                                alt={alt}
                                openPrefix={openPrefix}
                                radius="none"
                                gap={2}
                                count={3}
                            />
                        ),
                    },
                    {
                        label: "lg · 16",
                        node: (
                            <GalleryDemo
                                alt={alt}
                                openPrefix={openPrefix}
                                radius="lg"
                                gap={16}
                                count={3}
                            />
                        ),
                    },
                ],
            },
            {
                title: t("Without viewer", "Sem visualizador", "Sin visor"),
                file: t("no-viewer.tsx", "sem-visualizador.tsx", "sin-visor.tsx"),
                code: `<Gallery lightbox={false} onItemClick={(item, i) => select(i)} items={items} />`,
                items: [
                    {
                        label: "lightbox={false}",
                        node: (
                            <GalleryDemo
                                alt={alt}
                                openPrefix={openPrefix}
                                lightbox={false}
                                count={3}
                            />
                        ),
                    },
                ],
            },
        ],
        lightbox: [
            {
                title: t("Default", "Padrão", "Predeterminado"),
                file: t("default.tsx", "padrao.tsx", "predeterminado.tsx"),
                code: `<Lightbox open={open} onOpenChange={setOpen} items={items} />`,
                items: [
                    {
                        label: t("Click to open", "Clique para abrir", "Clic para abrir"),
                        node: (
                            <LightboxDemo
                                alt={alt}
                                trigger={t("Open viewer", "Abrir visualizador", "Abrir visor")}
                                labels={{
                                    label: t(
                                        "Image viewer",
                                        "Visualizador de imagens",
                                        "Visor de imágenes",
                                    ),
                                    closeLabel: t("Close", "Fechar", "Cerrar"),
                                    previousLabel: t(
                                        "Previous image",
                                        "Imagem anterior",
                                        "Imagen anterior",
                                    ),
                                    nextLabel: t(
                                        "Next image",
                                        "Próxima imagem",
                                        "Imagen siguiente",
                                    ),
                                }}
                            />
                        ),
                    },
                ],
            },
        ],
        carousel: [
            {
                title: t("Several per view", "Vários por vez", "Varios a la vez"),
                file: t("per-view.tsx", "por-vez.tsx", "a-la-vez.tsx"),
                code: `<Carousel aria-label="..." slidesPerView={2}>...</Carousel>`,
                items: [
                    {
                        label: "slidesPerView={2}",
                        node: <CarouselDemo {...carouselText} slidesPerView={2} />,
                    },
                ],
            },
            {
                title: t("Autoplay and loop", "Autoplay e loop", "Autoplay y loop"),
                file: "autoplay.tsx",
                description: t(
                    "Pauses on hover and focus; does not run with prefers-reduced-motion.",
                    "Pausa com mouse e foco; não roda com prefers-reduced-motion.",
                    "Se pausa con ratón y foco; no corre con prefers-reduced-motion.",
                ),
                code: `<Carousel aria-label="..." loop autoplay={3000}>...</Carousel>`,
                items: [
                    {
                        label: "autoplay={3000}",
                        node: <CarouselDemo {...carouselText} loop autoplay={3000} />,
                    },
                ],
            },
            {
                title: t("Controlled", "Controlado", "Controlado"),
                file: t("controlled.tsx", "controlado.tsx", "controlado.tsx"),
                code: `const [index, setIndex] = useState(0);\n\n<Carousel aria-label="..." index={index} onIndexChange={setIndex}>...</Carousel>`,
                items: [
                    {
                        label: "index",
                        node: (
                            <CarouselDemo
                                {...carouselText}
                                controlled
                                controlledText={t("Slide", "Slide", "Slide")}
                            />
                        ),
                    },
                ],
            },
            {
                title: colorsTitle,
                file: colorsFile,
                code: COLORS.map((c) => `<Carousel variantColor="${c}" ...>`).join("\n"),
                items: COLORS.map((c) => ({
                    label: c,
                    node: <CarouselDemo {...carouselText} variantColor={c} />,
                })),
            },
            {
                title: customTitle,
                file: customFile,
                code: `<Carousel customColor="#db2777" ...>`,
                items: [
                    {
                        label: t("Pink", "Rosa", "Rosa"),
                        node: <CarouselDemo {...carouselText} customColor="#db2777" />,
                    },
                ],
            },
        ],
    };
}
