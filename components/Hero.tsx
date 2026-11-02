import Image from "next/image";
import { invitation as inv } from "@/lib/invitation";

const petals = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  size: 10 + ((i * 7) % 12),
  duration: 9 + ((i * 5) % 9),
  delay: -((i * 3) % 12),
}));

export default function Hero({ scrollHint = false }: { scrollHint?: boolean }) {
  return (
    <header className="relative flex h-svh min-h-[600px] items-end justify-center overflow-hidden bg-[#0b3b3c]">
      <Image
        src="/portada.png"
        alt={`${inv.name} en su sesión de XV años`}
        fill
        priority
        sizes="100vw"
        className="object-cover object-[30%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
      <div className="relative z-20 px-6 pb-28 text-center text-white">
        <p className="text-xs uppercase tracking-[0.5em] sm:text-sm">{inv.title}</p>
        <div className="mx-auto my-4 h-px w-24 bg-white/60" />
        <h1 className="font-script text-6xl drop-shadow-lg sm:text-8xl">{inv.name}</h1>
        <p className="mt-6 text-sm uppercase tracking-[0.35em] sm:text-lg">
          7 de noviembre de 2026
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.35em] text-white/80 sm:text-sm">
          {inv.timeLabel}
        </p>
      </div>
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        {petals.map((p, i) => (
          <span
            key={i}
            className="petal"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
      {scrollHint && (
        <a
          href="#cuenta"
          className="animate-float absolute bottom-6 z-30 flex flex-col items-center gap-1 text-[0.65rem] uppercase tracking-[0.3em] text-white/80"
        >
          Desliza hacia arriba
          <span aria-hidden>⌄</span>
        </a>
      )}
    </header>
  );
}
