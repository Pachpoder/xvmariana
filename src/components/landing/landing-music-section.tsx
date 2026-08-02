"use client";

import { Pause, Play, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type PlaybackState = "idle" | "playing" | "blocked" | "unavailable";

export function LandingMusicSection({ musicUrl, autoplay }: { musicUrl: string | null; autoplay: boolean }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playback, setPlayback] = useState<PlaybackState>(musicUrl ? "idle" : "unavailable");

  useEffect(() => {
    if (!autoplay || !musicUrl || !audioRef.current) return;
    void audioRef.current.play().then(() => setPlayback("playing")).catch(() => setPlayback("blocked"));
  }, [autoplay, musicUrl]);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      setPlayback("idle");
      return;
    }
    try {
      await audio.play();
      setPlayback("playing");
    } catch {
      setPlayback("blocked");
    }
  }

  const available = Boolean(musicUrl);
  const status = playback === "blocked"
    ? "Tu navegador necesita que inicies la música manualmente."
    : playback === "unavailable"
      ? "La música estará disponible próximamente."
      : autoplay
        ? "Música de la celebración"
        : "Puedes acompañar la invitación con música.";

  return <section aria-labelledby="music-heading" className="rounded-[1.5rem] border border-[#d8d9c8] bg-[#f5f4ea] px-5 py-5 text-left">
    {musicUrl && <audio ref={audioRef} src={musicUrl} preload="metadata" onEnded={() => setPlayback("idle")} onError={() => setPlayback("unavailable")} />}
    <div className="flex items-center gap-4">
      <div aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e7d5d3] text-[#8a6870]"><Volume2 size={19} /></div>
      <div className="min-w-0 flex-1"><h2 id="music-heading" className="font-serif text-xl text-[#59664d]">Nuestra canción</h2><p role="status" className="mt-1 text-xs leading-5 text-[#70796c]">{status}</p></div>
      <button type="button" onClick={() => void togglePlayback()} disabled={!available} aria-pressed={playback === "playing"} aria-label={playback === "playing" ? "Pausar música" : "Reproducir música"} className="grid size-11 shrink-0 place-items-center rounded-full bg-[#59664d] text-white transition-colors hover:bg-[#46513c] disabled:cursor-not-allowed disabled:bg-[#aab0a2]">
        {playback === "playing" ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
      </button>
    </div>
  </section>;
}
