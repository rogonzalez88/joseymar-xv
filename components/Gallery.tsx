"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { galleryPhotos, galleryVideo } from "@/lib/gallery";

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);
  const total = galleryPhotos.length;

  const open = (i: number) => {
    lastFocused.current = document.activeElement as HTMLElement;
    setActive(i);
  };
  const close = useCallback(() => {
    setActive(null);
    lastFocused.current?.focus();
  }, []);
  const step = useCallback(
    (dir: 1 | -1) => setActive((i) => (i === null ? i : (i + dir + total) % total)),
    [total],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, step]);

  // Precarga la foto siguiente y la anterior para que el modal navegue sin esperas
  useEffect(() => {
    if (active === null) return;
    [1, -1].forEach((d) => {
      const img = new window.Image();
      img.src = galleryPhotos[(active + d + total) % total].full;
    });
  }, [active, total]);

  const current = active !== null ? galleryPhotos[active] : null;

  return (
    <>
      <div className="mx-auto mb-14 w-full max-w-[18rem] sm:max-w-xs">
        <div className="overflow-hidden rounded-3xl border border-gold/40 bg-black shadow-xl">
          <video
            controls
            playsInline
            preload="none"
            poster={galleryVideo.poster}
            className="aspect-[9/16] w-full object-cover"
          >
            <source src={galleryVideo.src} type="video/mp4" />
          </video>
        </div>
      </div>

      <ul className="columns-2 gap-3 sm:gap-4 md:columns-3">
        {galleryPhotos.map((photo, i) => (
          <li key={photo.src} className="mb-3 break-inside-avoid sm:mb-4">
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`Ampliar ${photo.alt}`}
              className="group relative block w-full cursor-zoom-in overflow-hidden rounded-2xl shadow-md transition duration-300 ease-out hover:z-10 hover:scale-[1.04] hover:shadow-2xl focus-visible:z-10 focus-visible:scale-[1.04] focus-visible:outline-2 focus-visible:outline-rose"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 768px) 224px, 45vw"
                loading="lazy"
                unoptimized
                className="h-auto w-full bg-blush"
              />
            </button>
          </li>
        ))}
      </ul>

      {current && active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visor de fotos"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={close}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/30"
          >
            ×
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/30 sm:left-6"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Foto siguiente"
            className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/30 sm:right-6"
          >
            ›
          </button>

          <Image
            key={current.full}
            src={current.full}
            alt={current.alt}
            width={Math.round((current.width * 5) / 3)}
            height={Math.round((current.height * 5) / 3)}
            unoptimized
            priority
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88svh] w-auto max-w-[92vw] rounded-xl object-contain shadow-2xl"
          />
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs tracking-[0.3em] text-white/70">
            {active + 1} / {total}
          </p>
        </div>
      )}
    </>
  );
}
