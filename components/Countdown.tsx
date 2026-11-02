"use client";

import { useEffect, useState } from "react";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    Días: Math.floor(ms / 86_400_000),
    Horas: Math.floor((ms / 3_600_000) % 24),
    Min: Math.floor((ms / 60_000) % 60),
    Seg: Math.floor((ms / 1000) % 60),
  };
}

export default function Countdown({ date }: { date: string }) {
  const target = new Date(date).getTime();
  const [time, setTime] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    const tick = () => setTime(diff(target));
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [target]);

  const entries = Object.entries(time ?? { Días: 0, Horas: 0, Min: 0, Seg: 0 });

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-6">
      {entries.map(([label, value]) => (
        <div
          key={label}
          className="flex flex-col items-center rounded-2xl border border-gold/40 bg-white/60 px-2 py-4 shadow-sm backdrop-blur sm:px-6 sm:py-6"
        >
          <span
            suppressHydrationWarning
            className="font-display text-3xl tabular-nums text-rose sm:text-5xl"
          >
            {time ? String(value).padStart(2, "0") : "--"}
          </span>
          <span className="mt-1 text-[0.65rem] uppercase tracking-[0.25em] text-ink/70 sm:text-xs">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
