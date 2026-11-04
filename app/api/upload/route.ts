import { getGuest } from "@/lib/guests";
import { invitation as inv } from "@/lib/invitation";

const MAX_BYTES = 4 * 1024 * 1024; // Vercel limita el cuerpo de una función a ~4.5 MB

function isOpen() {
  if (process.env.UPLOAD_ALWAYS_OPEN === "true") return true;
  return Date.now() >= new Date(inv.eventDate).getTime();
}

function safeName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function fail(error: string, status: number) {
  return Response.json({ ok: false, error }, { status });
}

export async function POST(request: Request) {
  const scriptUrl = process.env.DRIVE_UPLOAD_URL;
  const secret = process.env.DRIVE_UPLOAD_SECRET;
  if (!scriptUrl || !secret) return fail("not_configured", 503);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("bad_request", 400);
  }

  const guest = getGuest(String(form.get("code") ?? ""));
  if (!guest) return fail("forbidden", 403);
  if (!isOpen()) return fail("closed", 403);

  const file = form.get("file");
  if (!(file instanceof File)) return fail("bad_request", 400);
  if (file.size === 0 || file.size > MAX_BYTES) return fail("too_large", 413);

  const bytes = Buffer.from(await file.arrayBuffer());
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (!isJpeg) return fail("unsupported_type", 415);

  const filename = `${safeName(guest.name)}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.jpg`;

  try {
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        secret,
        filename,
        mimeType: "image/jpeg",
        guest: guest.name,
        data: bytes.toString("base64"),
      }),
      redirect: "follow",
    });
    const result = (await res.json()) as { ok?: boolean };
    if (!res.ok || !result.ok) return fail("drive_error", 502);
    return Response.json({ ok: true });
  } catch {
    return fail("drive_error", 502);
  }
}
