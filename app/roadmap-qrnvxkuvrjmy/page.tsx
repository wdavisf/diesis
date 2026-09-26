import type { Metadata } from "next";

/**
 * Will's private roadmap and strategy page (Will, 2026-09-26). Unlisted: not linked from
 * anywhere, not in the sitemap or robots.txt, noindex. The address is the only key, and the
 * repo is public, so nothing secret belongs here. Spanish only: it is for Will.
 */
export const metadata: Metadata = {
  title: { absolute: "Diesis · Roadmap" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

type Track = "Mástil" | "Práctica" | "Aprender" | "Equipo" | "Negocio" | "Plataforma";

const trackColor: Record<Track, string> = {
  Mástil: "bg-amber/15 text-amber-text",
  Práctica: "bg-correct/15 text-correct",
  Aprender: "bg-sky-400/15 text-sky-300",
  Equipo: "bg-orange-400/15 text-orange-300",
  Negocio: "bg-fuchsia-400/15 text-fuchsia-300",
  Plataforma: "bg-white/10 text-dim",
};

interface Item {
  title: string;
  note?: string;
  track: Track;
}

const columns: { title: string; tone: string; dot: string; items: Item[] }[] = [
  {
    title: "Hecho",
    tone: "border-correct/40",
    dot: "bg-correct",
    items: [
      { title: "Nombra la nota", track: "Mástil" },
      { title: "Encuentra la nota", track: "Mástil" },
      { title: "Retos, récords y logros", track: "Mástil" },
      { title: "El mástil: todas las notas y 13 escalas", note: "Tónica, notas o grados, toca para oír", track: "Mástil" },
      { title: "Metrónomo con subida de tempo", note: "2/4–7/8, subdivisiones hasta seisillos, tap", track: "Práctica" },
      { title: "Perfil: 6, 7 u 8 cuerdas y afinaciones", note: "Los ejercicios y el mástil lo usan", track: "Plataforma" },
      { title: "Botones de notas a la derecha", track: "Mástil" },
      { title: "Web EN/ES, diesis.es, barra común", track: "Plataforma" },
      { title: "App en dos puertas: Aprender o Practicar", note: "/start, /learn, /practice", track: "Plataforma" },
    ],
  },
  {
    title: "Ahora",
    tone: "border-amber/50",
    dot: "bg-amber",
    items: [
      { title: "Medir el uso", note: "Primer ejercicio, vuelta a los 7 días, herramientas", track: "Negocio" },
      { title: "Lista de correo / espera de Pro", track: "Negocio" },
      { title: "Tu vídeo personal en la portada", note: "YouTube, se carga al pulsar", track: "Negocio" },
      { title: "Decidir posiciones de escala", note: "CAGED o tres notas por cuerda", track: "Mástil" },
    ],
  },
  {
    title: "Siguiente",
    tone: "border-sky-400/40",
    dot: "bg-sky-400",
    items: [
      { title: "Glosario de técnicas", note: "Down picking, hammer-on, sweep… una página cada una", track: "Aprender" },
      { title: "Técnica de guitarra clásica", note: "Apoyando, tirando, p-i-m-a, rasgueado, trémolo", track: "Aprender" },
      { title: "Cuentas opcionales", note: "Supabase UE, enlace mágico, Google, Apple", track: "Plataforma" },
      { title: "Privacidad RGPD para cuentas", track: "Plataforma" },
      { title: "Ejercicios de escalas", note: "Construir, reconocer, grados", track: "Mástil" },
      { title: "Escucha la nota", track: "Mástil" },
      { title: "Rango de trastes y cuerda a cuerda", track: "Mástil" },
    ],
  },
  {
    title: "Más adelante",
    tone: "border-line",
    dot: "bg-dim",
    items: [
      { title: "Plan Pro con Stripe", track: "Negocio" },
      { title: "Calculadora de ajuste por modelo", note: "Les Paul, Tele, Strat, SG, RG, clásica…", track: "Equipo" },
      { title: "Tensión y calibre de cuerdas", track: "Equipo" },
      { title: "Comparativa de púas", note: "Material, grosor, estilo", track: "Equipo" },
      { title: "Tienda con afiliados de Amazon", track: "Negocio" },
      { title: "Inspiración: vídeos de guitarristas", track: "Aprender" },
      { title: "Afinador", track: "Práctica" },
      { title: "Leer partituras (clásica)", track: "Aprender" },
      { title: "Muestras reales, zurdos, app nativa", track: "Plataforma" },
    ],
  },
];

const phases = [
  { n: "1", title: "Medir y crear audiencia", when: "Estas semanas", items: ["Eventos de uso en GA4", "Lista de correo / espera de Pro", "Vídeos: «¿Qué nota es?», retos, riffs con la subida de tempo", "Tu vídeo en la portada"] },
  { n: "2", title: "Cuentas y contenido que atrae", when: "Después", items: ["Cuentas opcionales y sincronización", "Glosario (SEO en los dos idiomas)", "Ejercicios de escalas", "Escucha la nota y rango de trastes"] },
  { n: "3", title: "Lanzar Pro", when: "Con usuarios que vuelven cada semana", items: ["Stripe, precio de fundador", "Afiliados de Amazon", "Profesores y academias"] },
];

const free = ["Nombra y Encuentra la nota, con retos", "Metrónomo con subida de tempo", "El mástil con pentatónicas, mayor y menor", "Perfil con 6/7/8 cuerdas y afinaciones", "Glosario de técnicas"];
const pro = ["Todas las escalas y modos, y sus ejercicios", "Estadísticas: qué posiciones fallas y cómo mejoras", "Sincronización entre dispositivos", "Calculadora de ajuste completa", "Rutinas de práctica guardadas"];

const channels = [
  { title: "Tu contenido", body: "Instagram, TikTok y Shorts: «¿Qué nota es?», retos contra el reloj, tus riffs con la subida de tempo. Gratis y lo que más te diferencia de una app hecha por IA." },
  { title: "SEO con el glosario", body: "Una página por técnica («qué es palm mute», «cómo hacer hammer-on») en los dos idiomas: tráfico todo el año." },
  { title: "Comunidades", body: "r/guitarlessons, r/SevenString, foros y grupos en español. Aportar, no hacer spam." },
  { title: "Profesores y academias", body: "Un profesor que lo recomienda trae alumnos fieles. Más adelante, un plan para profesores." },
];

const funnel = [
  { step: "Visita", note: "Portada, redes, buscadores" },
  { step: "Primer ejercicio", note: "Activación" },
  { step: "Vuelve a los 7 días", note: "Retención" },
  { step: "Se registra", note: "Cuentas" },
  { step: "Paga Pro", note: "Conversión" },
];

const decisions = [
  "¿Suscripción, pago único o las dos?",
  "¿Cuánto tiempo a la semana para contenido?",
  "¿Qué va en Aprender y qué en Practicar?",
  "¿Métodos de acceso de las cuentas y si son opcionales?",
];

function Tag({ track }: { track: Track }) {
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${trackColor[track]}`}>{track}</span>;
}

function H2({ children, eyebrow }: { children: React.ReactNode; eyebrow: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-medium tracking-wide text-amber-text uppercase">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{children}</h2>
    </div>
  );
}

export default function RoadmapPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:py-16">
      <header className="mb-14">
        <p className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs text-dim">
          <span className="size-1.5 rounded-full bg-amber" aria-hidden />
          Privado · solo con este enlace · 26 sept 2026 · versión 0.14
        </p>
        <h1 className="mt-5 font-display text-5xl font-semibold tracking-tight sm:text-6xl">Roadmap y estrategia</h1>
        <p className="mt-4 max-w-2xl text-lg text-dim">
          Todo lo que necesitas para dominar la guitarra. Qué hay, qué viene, cómo gana dinero y cómo llega a la gente.
        </p>
      </header>

      <section className="mb-20">
        <H2 eyebrow="Producto">El roadmap</H2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((c) => (
            <div key={c.title} className={`flex flex-col rounded-2xl border-t-4 bg-surface/50 p-4 ${c.tone}`}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-xl font-semibold">
                  <span className={`size-2.5 rounded-full ${c.dot}`} aria-hidden />
                  {c.title}
                </h3>
                <span className="text-sm text-dim tabular-nums">{c.items.length}</span>
              </div>
              <ul className="flex flex-col gap-2">
                {c.items.map((i) => (
                  <li key={i.title} className="rounded-xl border border-line bg-stage p-3">
                    <p className="text-sm font-semibold leading-snug">{i.title}</p>
                    {i.note ? <p className="mt-1 text-xs text-dim">{i.note}</p> : null}
                    <div className="mt-2">
                      <Tag track={i.track} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-20">
        <H2 eyebrow="Plan">Tres fases</H2>
        <ol className="relative grid gap-4 lg:grid-cols-3">
          {phases.map((p, i) => (
            <li key={p.n} className="relative rounded-2xl border border-line bg-surface/50 p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-amber font-display text-lg font-semibold text-stage">{p.n}</span>
                <div>
                  <p className="font-display text-lg font-semibold leading-tight">{p.title}</p>
                  <p className="text-xs text-dim">{p.when}</p>
                </div>
              </div>
              <ul className="mt-4 flex flex-col gap-1.5 text-sm">
                {p.items.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber" aria-hidden />
                    {x}
                  </li>
                ))}
              </ul>
              {i < phases.length - 1 ? <span className="absolute top-1/2 -right-3 hidden size-6 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-stage text-dim lg:flex" aria-hidden>→</span> : null}
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-20">
        <H2 eyebrow="Monetización">Freemium con un plan Pro</H2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface/50 p-6">
            <p className="font-display text-2xl font-semibold">Gratis</p>
            <p className="mt-1 text-sm text-dim">Para siempre. Lo que engancha y hace que te recomienden.</p>
            <ul className="mt-5 flex flex-col gap-2 text-sm">
              {free.map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="text-correct">✓</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-amber/60 bg-amber/10 p-6">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-display text-2xl font-semibold text-amber-text">Pro</p>
              <p className="text-sm text-dim">
                <span className="font-display text-2xl font-semibold text-ink">~4 €</span>/mes · 29 €/año · ~59 € de por vida
              </p>
            </div>
            <p className="mt-1 text-sm text-dim">Para quien practica en serio. Precio orientativo, a validar.</p>
            <ul className="mt-5 flex flex-col gap-2 text-sm">
              {pro.map((x) => (
                <li key={x} className="flex gap-2">
                  <span className="text-amber-text">★</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-line p-5">
            <p className="text-sm font-semibold">Ingresos secundarios</p>
            <p className="mt-1 text-sm text-dim">Afiliados de Amazon desde la calculadora de cuerdas y la comparativa de púas. Poco dinero, sin molestar.</p>
          </div>
          <div className="rounded-2xl border border-line p-5">
            <p className="text-sm font-semibold">Referencias</p>
            <p className="mt-1 text-sm text-dim">Fender Play y Yousician rondan 10–20 $/mes; Guitar Pro, un pago único de unos 70 €. Comprobar antes de fijar precio.</p>
          </div>
          <div className="rounded-2xl border border-wrong/40 p-5">
            <p className="text-sm font-semibold text-wrong">Todavía no</p>
            <p className="mt-1 text-sm text-dim">Sin muro de pago hasta tener unos cientos de usuarios que vuelven cada semana. Luego, precio de fundador.</p>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <H2 eyebrow="Salida al mercado">Por dónde entrar</H2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface/50 p-6">
            <p className="text-xs font-semibold text-amber-text uppercase">Nicho 1</p>
            <p className="mt-1 font-display text-xl font-semibold">Guitarristas hispanohablantes</p>
            <p className="mt-2 text-sm text-dim">Todo en español nativo, cuando la competencia suele estar mal traducida.</p>
          </div>
          <div className="rounded-2xl border border-line bg-surface/50 p-6">
            <p className="text-xs font-semibold text-amber-text uppercase">Nicho 2</p>
            <p className="mt-1 font-display text-xl font-semibold">7 y 8 cuerdas, afinaciones graves</p>
            <p className="mt-2 text-sm text-dim">Tu mundo como WILLDAFER, y casi ninguna app los trata bien.</p>
          </div>
        </div>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((c, i) => (
            <li key={c.title} className="rounded-2xl border border-line p-5">
              <span className="font-display text-3xl font-semibold text-amber">{i + 1}</span>
              <p className="mt-2 font-semibold">{c.title}</p>
              <p className="mt-1 text-sm text-dim">{c.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-20">
        <H2 eyebrow="Métricas">El embudo a medir</H2>
        <div className="flex flex-col gap-2">
          {funnel.map((f, i) => (
            <div key={f.step} className="flex items-center gap-4">
              <div
                className="flex h-12 items-center justify-between rounded-xl bg-amber/15 px-4 ring-1 ring-amber/30"
                style={{ width: `${100 - i * 15}%` }}
              >
                <span className="font-semibold text-amber-text">{f.step}</span>
                <span className="hidden text-xs text-dim sm:inline">{f.note}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-dim">Hoy GA4 solo cuenta visitas. Medir cada escalón es lo primero de la fase 1.</p>
      </section>

      <section>
        <H2 eyebrow="Pendiente">Decisiones tuyas</H2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {decisions.map((d) => (
            <li key={d} className="flex items-center gap-3 rounded-xl border border-dashed border-amber/50 p-4 text-sm">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-amber/60 text-xs text-amber-text">?</span>
              {d}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
