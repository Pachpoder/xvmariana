"use client";
/* eslint-disable @next/next/no-img-element -- Las rutas configurables pueden ser externas; el fallback se controla en cliente. */

import { useState } from "react";

const fallbackImage = "/assets/invitacion-placeholder.svg";

export function LandingImage({ src, alt, className = "" }: { src: string | null; alt: string; className?: string }) {
  const [hasError, setHasError] = useState(false);
  const source = src && !hasError ? src : fallbackImage;

  return <img src={source} alt={alt} className={className} onError={() => setHasError(true)} />;
}
