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
