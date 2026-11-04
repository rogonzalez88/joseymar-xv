"use client";

import { useEffect, useRef, useState } from "react";

const MAX_FILES = 10;
const MAX_SIDE = 2400;
const MAX_BYTES = 3.5 * 1024 * 1024;

type Status = "pending" | "compressing" | "uploading" | "done" | "error";
type Item = { id: number; name: string; status: Status; error?: string };

const ERRORS: Record<string, string> = {
  closed: "Aún no se habilitó la subida.",
  too_large: "La foto es demasiado pesada.",
  unsupported_type: "Formato no compatible.",
  not_configured: "La subida no está disponible por ahora.",
  forbidden: "Invitación no válida.",
  drive_error: "No se pudo guardar, intenta de nuevo.",
};

function toBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

async function compress(file: File) {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  for (const quality of [0.85, 0.75, 0.65, 0.5]) {
    const blob = await toBlob(canvas, quality);
    if (blob && blob.size <= MAX_BYTES) return blob;
  }
  throw new Error("too_large");
}

function formatOpenAt(iso: string) {
  return new Intl.DateTimeFormat("es-VE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Caracas",
  }).format(new Date(iso));
}

export default function PhotoUpload({ code, openAt }: { code: string; openAt: string }) {
  const openTime = new Date(openAt).getTime();
  const [now, setNow] = useState<number | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(0);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const isOpen = now !== null && now >= openTime;

  const update = (id: number, patch: Partial<Item>) =>
    setItems((list) => list.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  async function onSelect(files: FileList | null) {
    if (!files?.length || busy) return;
    const picked = Array.from(files).slice(0, MAX_FILES);
    const batch: Item[] = picked.map((f) => ({
      id: nextId.current++,
      name: f.name,
      status: "pending",
    }));
    setItems(batch);
    setBusy(true);

    for (let i = 0; i < picked.length; i++) {
      const { id } = batch[i];
      try {
        update(id, { status: "compressing" });
        const blob = await compress(picked[i]);
        update(id, { status: "uploading" });
        const body = new FormData();
        body.append("code", code);
        body.append("file", blob, "foto.jpg");
        const res = await fetch("/api/upload", { method: "POST", body });
        const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
        if (!res.ok || !data.ok) throw new Error(data.error ?? "drive_error");
        update(id, { status: "done" });
      } catch (e) {
        const key = e instanceof Error ? e.message : "";
        update(id, {
          status: "error",
          error: ERRORS[key] ?? "No se pudo procesar esta imagen.",
        });
      }
    }
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  const done = items.filter((i) => i.status === "done").length;

  if (!isOpen) {
    return (
      <div className="rounded-3xl border border-gold/40 bg-blush/60 px-6 py-10 text-center shadow-sm">
        <svg
          viewBox="0 0 24 24"
          className="mx-auto h-9 w-9 text-rose"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <rect x="4" y="10" width="16" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
        <p className="mt-4 font-display text-xl text-ink">Disponible durante la celebración</p>
        <p className="mt-2 text-sm text-ink/70">
          Podrás subir tus fotos a partir del {formatOpenAt(openAt)}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gold/40 bg-white p-6 shadow-sm sm:p-8">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => onSelect(e.target.files)}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-rose/40 bg-blush/40 px-4 py-10 text-center transition hover:bg-blush/70 disabled:cursor-wait disabled:opacity-70"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-9 w-9 text-rose"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" />
          <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
        </svg>
        <span className="font-display text-lg text-ink">
          {busy ? "Subiendo fotos…" : "Toca para seleccionar fotos"}
        </span>
        <span className="text-xs text-ink/60">Hasta {MAX_FILES} fotos por vez</span>
      </button>

      {items.length > 0 && (
        <ul className="mt-6 space-y-2 text-left text-sm" aria-live="polite">
          {items.map((it) => (
            <li
              key={it.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-blush/40 px-4 py-2"
            >
              <span className="truncate text-ink/80">{it.name}</span>
              <span
                className={
                  it.status === "done"
                    ? "shrink-0 text-emerald-700"
                    : it.status === "error"
                      ? "shrink-0 text-rose"
                      : "shrink-0 text-ink/60"
                }
              >
                {it.status === "pending" && "En espera"}
                {it.status === "compressing" && "Preparando…"}
                {it.status === "uploading" && "Subiendo…"}
                {it.status === "done" && "✓ Subida"}
                {it.status === "error" && it.error}
              </span>
            </li>
          ))}
        </ul>
      )}

      {!busy && done > 0 && (
        <p className="mt-5 text-center font-script text-3xl text-rose">
          ¡Gracias por compartir tus fotos!
        </p>
      )}
    </div>
  );
}
