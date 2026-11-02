"use client";

import { QRCodeSVG } from "qrcode.react";

export default function InviteQr({ url, label }: { url: string; label: string }) {
  return (
    <div className="inline-block rounded-3xl border border-gold/40 bg-white p-4 shadow-md">
      <QRCodeSVG
        value={url}
        size={192}
        level="M"
        marginSize={1}
        fgColor="#4a2c35"
        bgColor="#ffffff"
        title={label}
      />
    </div>
  );
}
