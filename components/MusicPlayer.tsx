"use client";

import { useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/audio/vals.mp3";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  const play = () => audioRef.current?.play().catch(() => setPlaying(false));

  // Intenta sonar al cargar; si el navegador bloquea el autoplay, arranca con la primera interacción
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const events = ["pointerdown", "keydown", "touchend"] as const;
    const onGesture = () => {
      removeListeners();
      if (!userPaused.current) audio.play().catch(() => {});
    };
    const removeListeners = () =>
      events.forEach((e) => window.removeEventListener(e, onGesture));
    audio.play().catch(() => events.forEach((e) => window.addEventListener(e, onGesture)));
    return removeListeners;
  }, []);

  // Si el invitado reproduce el video de la galería, se pausa la música para no mezclar audios
  useEffect(() => {
    const onMediaPlay = (e: Event) => {
      if (e.target instanceof HTMLVideoElement) audioRef.current?.pause();
    };
    document.addEventListener("play", onMediaPlay, true);
    return () => document.removeEventListener("play", onMediaPlay, true);
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      userPaused.current = false;
      play();
    } else {
      userPaused.current = true;
      audio.pause();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setAvailable(false)}
        onLoadedMetadata={(e) => (e.currentTarget.volume = 0.6)}
      />

      {available && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pausar música" : "Reproducir música"}
          aria-pressed={playing}
          title={playing ? "Pausar música" : "Reproducir música"}
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-gold bg-rose text-white shadow-lg shadow-rose/30 transition hover:scale-105 hover:bg-rose/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose sm:bottom-8 sm:right-8"
        >
          {playing && (
            <span
              aria-hidden
              className="absolute inset-0 animate-ping rounded-full border border-gold/70 [animation-duration:2.4s]"
            />
          )}
          {playing ? (
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
              <rect x="6" y="5" width="4" height="14" rx="1.2" />
              <rect x="14" y="5" width="4" height="14" rx="1.2" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6" fill="currentColor" aria-hidden>
              <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
