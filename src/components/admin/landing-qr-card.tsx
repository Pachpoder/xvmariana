"use client";
/* eslint-disable @next/next/no-img-element -- El QR se genera localmente como data URL para descargarlo. */

import { Download, ExternalLink, Link2, QrCode } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

export function LandingQrCard({ landingUrl }: { landingUrl: string | null }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!landingUrl) return;
    let active = true;
    void QRCode.toDataURL(landingUrl, { width: 1024, margin: 2, errorCorrectionLevel: "M", color: { dark: "#37251f", light: "#fffdf8" } })
      .then((url) => { if (active) setImageUrl(url); })
      .catch(() => { if (active) setImageUrl(null); });
    return () => { active = false; };
  }, [landingUrl]);

  async function copyLink() {
    if (!landingUrl) return;
    await navigator.clipboard.writeText(landingUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return <section className="max-w-3xl rounded-3xl border border-rose/20 bg-white p-6 sm:p-8"><div className="flex gap-4"><div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-rose/10 text-wine"><QrCode size={22} /></div><div><h2 className="font-serif text-2xl text-wine">Código QR de la página pública</h2><p className="mt-2 text-sm leading-6 text-stone-500">Este es el único QR que debes imprimir o enviar. Abre la página pública principal, no una invitación personal.</p></div></div>
    {!landingUrl ? <div className="mt-6 rounded-2xl border border-gold/30 bg-cream p-4 text-sm leading-6 text-stone-700"><strong>Antes de generarlo:</strong> publica el proyecto en Vercel y configura <code>NEXT_PUBLIC_APP_URL</code> con su URL de producción, por ejemplo <code>https://tu-proyecto.vercel.app</code>. Luego haz un nuevo deployment y vuelve aquí.</div> : <div className="mt-6 grid items-center gap-6 sm:grid-cols-[12rem_1fr]"><div className="grid aspect-square place-items-center rounded-2xl border border-stone-200 bg-[#fffdf8] p-3">{imageUrl ? <img src={imageUrl} alt={`Código QR que abre ${landingUrl}`} className="size-full" /> : <span className="text-sm text-stone-500">Generando QR…</span>}</div><div><p className="break-all rounded-xl bg-cream px-4 py-3 font-mono text-xs text-stone-700">{landingUrl}</p><p className="mt-3 text-sm leading-6 text-stone-500">No cambies esta variable después de enviar o imprimir el QR. Las siguientes publicaciones pueden actualizar el sitio sin cambiar esta dirección.</p><div className="mt-5 flex flex-wrap gap-3"><a href={landingUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-wine px-4 py-2 text-sm font-semibold text-wine"><ExternalLink size={16} />Probar página</a><button type="button" onClick={() => void copyLink()} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700"><Link2 size={16} />{copied ? "Enlace copiado" : "Copiar enlace"}</button>{imageUrl && <a href={imageUrl} download="qr-landing-xv-mariana.png" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-wine px-4 py-2 text-sm font-semibold text-white"><Download size={16} />Descargar PNG</a>}</div></div></div>}
  </section>;
}
