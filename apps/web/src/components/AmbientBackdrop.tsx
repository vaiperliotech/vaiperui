/**
 * Atmosfera do hero: grade blueprint + dois halos (azul/violeta), 100% CSS —
 * só anima opacity/transform, então o compositor da GPU resolve tudo sem
 * custo de main thread (ao contrário de um canvas em loop).
 */
export function AmbientBackdrop() {
    return (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 blueprint opacity-40" />

            <div
                className="absolute -top-1/3 left-1/2 aspect-square w-[min(120rem,180%)] -translate-x-1/2 animate-halo rounded-full mix-blend-screen motion-reduce:animate-none"
                style={{
                    background:
                        "radial-gradient(circle, rgb(77 163 255 / 28%) 0%, transparent 58%)",
                    opacity: 0.35,
                }}
            />
            <div
                className="absolute top-[8%] -right-[18%] aspect-square w-[min(70rem,95%)] animate-halo rounded-full mix-blend-screen [animation-delay:-6s] motion-reduce:animate-none"
                style={{
                    background:
                        "radial-gradient(circle, rgb(167 139 250 / 18%) 0%, transparent 62%)",
                    opacity: 0.35,
                }}
            />
        </div>
    );
}
