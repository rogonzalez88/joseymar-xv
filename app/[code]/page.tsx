import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Countdown from "@/components/Countdown";
import Gallery from "@/components/Gallery";
import Hero from "@/components/Hero";
import InviteQr from "@/components/InviteQr";
import MusicPlayer from "@/components/MusicPlayer";
import PhotoUpload from "@/components/PhotoUpload";
import Reveal from "@/components/Reveal";
import { companionsLabel, getGuest, getGuests, SITE_URL } from "@/lib/guests";
import { invitation as inv } from "@/lib/invitation";

function SectionTitle({ eyebrow, children }: { eyebrow?: string; children: string }) {
  return (
    <div className="mb-10 text-center">
      {eyebrow && (
        <p className="mb-2 text-xs uppercase tracking-[0.4em] text-gold">{eyebrow}</p>
      )}
      <h2 className="font-script text-5xl text-rose sm:text-6xl">{children}</h2>
      <div className="mx-auto mt-4 flex w-40 items-center gap-2">
        <span className="h-px flex-1 bg-gold/60" />
        <span className="text-gold">♥</span>
        <span className="h-px flex-1 bg-gold/60" />
      </div>
    </div>
  );
}

function Section({
  children,
  className = "",
  tone,
  wide = false,
}: {
  children: React.ReactNode;
  className?: string;
  tone: "white" | "pink";
  wide?: boolean;
}) {
  return (
    <section className={tone === "white" ? "bg-white" : "bg-blush"}>
      <div
        className={`mx-auto w-full px-6 py-20 ${wide ? "max-w-4xl" : "max-w-3xl"} ${className}`}
      >
        {children}
      </div>
    </section>
  );
}

export function generateStaticParams() {
  return getGuests().map((g) => ({ code: g.code }));
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function InvitationPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const guest = getGuest(code);
  if (!guest) notFound();
  // Con UPLOAD_ALWAYS_OPEN=true la sección de fotos se abre antes de la fiesta (solo para pruebas)
  const openAt =
    process.env.UPLOAD_ALWAYS_OPEN === "true" ? new Date(0).toISOString() : inv.eventDate;

  return (
    <main className="overflow-x-hidden">
      {/* Hero */}
      <Hero scrollHint />

      {/* Cuenta regresiva */}
      <Section tone="white" className="text-center">
        <div id="cuenta" className="scroll-mt-10" />
        <Reveal>
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-gold">Faltan</p>
          <Countdown date={inv.eventDate} />
        </Reveal>
      </Section>

      {/* Bendición */}
      <Section tone="pink" className="text-center">
        <Reveal>
          <SectionTitle eyebrow="Con la bendición de">Sus familias</SectionTitle>
          <div className="grid gap-6 sm:grid-cols-2">
            {inv.families.map((f) => (
              <div
                key={f}
                className="rounded-3xl border border-gold/40 bg-white px-6 py-8 shadow-sm"
              >
                <p className="font-display text-2xl text-ink">{f}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-ink/80">
            lo invitan a la celebración de los{" "}
            <span className="font-display text-rose">XV Años</span> de{" "}
            <span className="font-script text-3xl text-rose">{inv.name}</span>
          </p>
        </Reveal>
      </Section>

      {/* Frase */}
      <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden md:h-[min(56.25vw,92svh)] md:min-h-0">
        <Image
          src="/galeria/mensaje-movil.webp"
          alt="Joseymar de espalda levantando su ramo hacia el cielo"
          fill
          sizes="100vw"
          className="object-cover object-bottom md:hidden"
        />
        <Image
          src="/galeria/mensaje-escritorio.webp"
          alt="Joseymar de espalda levantando su ramo hacia el cielo"
          fill
          sizes="100vw"
          className="hidden object-cover object-[45%_45%] md:block"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-transparent" />
        <Reveal className="absolute inset-x-0 top-0 z-10 mx-auto max-w-2xl px-6 pt-12 text-center text-white md:max-w-3xl md:pt-12 lg:max-w-4xl">
          <blockquote className="font-display text-xl italic leading-relaxed [text-shadow:0_2px_12px_rgb(0_0_0/0.5)] sm:text-2xl lg:text-3xl">
            “{inv.quote}”
          </blockquote>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/90 [text-shadow:0_1px_8px_rgb(0_0_0/0.5)] sm:text-sm">
            — {inv.name}
          </p>
        </Reveal>
      </section>

      {/* Itinerario */}
      <Section tone="white">
        <SectionTitle>Itinerario</SectionTitle>
        <ol className="relative ml-4 border-l border-gold/60 sm:ml-0 sm:border-l-0">
          <span
            aria-hidden
            className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-gold/60 sm:block"
          />
          {inv.itinerary.map((item, i) => (
            <li key={item.time} className="relative pb-10 pl-8 last:pb-0 sm:pl-0">
              <span className="absolute -left-[7px] top-2 h-3.5 w-3.5 rounded-full border-2 border-gold bg-white sm:left-1/2 sm:-translate-x-1/2" />
              <Reveal
                className={`sm:w-1/2 ${
                  i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:ml-auto sm:pl-12"
                }`}
              >
                <p className="font-display text-2xl text-rose">{item.time}</p>
                <h3 className="mt-1 text-sm font-semibold uppercase tracking-[0.2em] text-ink">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-ink/70">{item.description}</p>
                <p className="mt-1 text-xs text-gold">📍 Salón Virgen del Valle</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* Galería */}
      <Section tone="pink" wide>
        <Reveal>
          <SectionTitle eyebrow="Galería">Mi sesión de fotos</SectionTitle>
        </Reveal>
        <Gallery />
      </Section>

      {/* Dress code */}
      <Section tone="white" className="text-center">
        <Reveal>
          <SectionTitle eyebrow="Dress code">Código de vestimenta</SectionTitle>
          <p className="mx-auto inline-block rounded-full border border-rose px-8 py-2 font-display text-xl text-rose">
            {inv.dressCode.label}
          </p>
          <p className="mx-auto mt-6 max-w-xl text-ink/80">{inv.dressCode.description}</p>
        </Reveal>
      </Section>

      {/* Ubicación */}
      <Section tone="pink">
        <Reveal>
          <SectionTitle>Ubicación</SectionTitle>
          <div className="rounded-3xl border border-gold/40 bg-white p-8 text-center shadow-sm">
            <h3 className="font-display text-2xl text-ink">{inv.venue.name}</h3>
            <p className="mt-4 text-sm text-ink/80">🕗 {inv.dateLabel} · {inv.timeLabel}</p>
            <p className="mt-2 text-sm text-ink/80">📍 {inv.venue.address}</p>
            <a
              href={inv.venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block rounded-full bg-rose px-8 py-3 text-sm font-medium uppercase tracking-widest text-white transition hover:bg-rose/90"
            >
              Cómo llegar
            </a>
          </div>
        </Reveal>
      </Section>

      {/* Fotos de la celebración */}
      <Section tone="white" className="text-center">
        <Reveal>
          <SectionTitle eyebrow="Durante la fiesta">Comparte tus fotos</SectionTitle>
          <p className="mx-auto mb-8 max-w-md text-sm text-ink/70">
            Sube las fotos que tomes durante la celebración y se guardarán en el álbum de Joseymar.
          </p>
          <PhotoUpload code={guest.code} openAt={openAt} />
        </Reveal>
      </Section>

      {/* Tu invitación (QR) */}
      <Section tone="pink" className="text-center">
        <Reveal>
          <SectionTitle eyebrow="Tu invitación">Pase de entrada</SectionTitle>
          <p className="font-display text-3xl text-ink">{guest.name}</p>
          <p className="mt-2 text-sm uppercase tracking-[0.25em] text-gold">
            {companionsLabel(guest.companions)}
          </p>
          <div className="mt-8">
            <InviteQr url={`${SITE_URL}/${guest.code}`} label={`Invitación de ${guest.name}`} />
          </div>
        </Reveal>
      </Section>

      <footer className="bg-white px-6 py-10 text-center text-xs uppercase tracking-[0.3em] text-ink/50">
        {inv.name} · XV Años · 2026
      </footer>
      <MusicPlayer />
    </main>
  );
}
