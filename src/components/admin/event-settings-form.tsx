"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { updateEventSettings, type EventSettingsState } from "@/actions/event-settings";
import { eventSettingsSchema, type EventSettingsInput } from "@/lib/validation/event-settings";

type EventFormValues = z.input<typeof eventSettingsSchema>;
type EventSettings = {
  id: string; name: string; slug: string; invitation_image_path: string; loading_image_path: string | null;
  event_date: string; rsvp_deadline: string | null; loading_duration_ms: number; is_published: boolean;
  public_landing_enabled: boolean; landing_heading: string | null; landing_celebrant_name: string;
  landing_banner_image_path: string | null; landing_crown_image_path: string | null; landing_celebrant_image_path: string | null;
  landing_description: string | null; landing_details: string | null; landing_music_url: string | null;
  landing_music_autoplay: boolean; landing_rsvp_cta_text: string;
};

const initialState: EventSettingsState = { status: "idle" };
const asLocalDateTime = (value: string | null) => value ? new Date(value).toLocaleString("sv-SE", { timeZone: "America/Guatemala" }).replace(" ", "T").slice(0, 16) : "";
const fieldClass = "mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3";

export function EventSettingsForm({ event }: { event: EventSettings }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(updateEventSettings, initialState);
  const { register, handleSubmit, formState: { errors } } = useForm<EventFormValues, unknown, EventSettingsInput>({
    resolver: zodResolver(eventSettingsSchema),
    defaultValues: {
      id: event.id, name: event.name, slug: event.slug, invitationImagePath: event.invitation_image_path,
      loadingImagePath: event.loading_image_path ?? "", eventDate: asLocalDateTime(event.event_date),
      rsvpDeadline: asLocalDateTime(event.rsvp_deadline), loadingDurationMs: event.loading_duration_ms,
      isPublished: event.is_published, publicLandingEnabled: event.public_landing_enabled,
      landingHeading: event.landing_heading ?? "", landingCelebrantName: event.landing_celebrant_name,
      landingBannerImagePath: event.landing_banner_image_path ?? "", landingCrownImagePath: event.landing_crown_image_path ?? "",
      landingCelebrantImagePath: event.landing_celebrant_image_path ?? "", landingDescription: event.landing_description ?? "",
      landingDetails: event.landing_details ?? "", landingMusicUrl: event.landing_music_url ?? "",
      landingMusicAutoplay: event.landing_music_autoplay, landingRsvpCtaText: event.landing_rsvp_cta_text,
    },
  });

  useEffect(() => { if (state.status === "success") formRef.current?.focus(); }, [state.status]);
  function submit() { if (formRef.current) startTransition(() => formAction(new FormData(formRef.current!))); }
  const firstError = Object.values(errors)[0]?.message;

  return <form ref={formRef} tabIndex={-1} className="max-w-3xl space-y-8 rounded-3xl border border-rose/20 bg-white p-6 sm:p-8" noValidate onSubmit={(formEvent) => { formEvent.preventDefault(); void handleSubmit(submit)(); }}>
    <input type="hidden" {...register("id")} />
    <fieldset className="space-y-5"><legend className="font-serif text-2xl text-wine">Evento e invitaciones personales</legend><div className="grid gap-5 sm:grid-cols-2">
      <Field label="Nombre del evento"><input {...register("name")} className={fieldClass} /></Field>
      <Field label="Slug del evento"><input {...register("slug")} className={fieldClass} /></Field>
      <Field label="Fecha y hora del evento"><input {...register("eventDate")} type="datetime-local" className={fieldClass} /></Field>
      <Field label={<>Fecha límite RSVP <span className="font-normal text-stone-500">(opcional)</span></>}><input {...register("rsvpDeadline")} type="datetime-local" className={fieldClass} /></Field>
      <Field label="Duración de loading (ms)"><input {...register("loadingDurationMs", { valueAsNumber: true })} type="number" min="0" max="10000" className={fieldClass} /></Field>
      <label className="flex items-center gap-3 self-end rounded-xl border border-rose/20 p-4 text-sm font-medium"><input {...register("isPublished")} type="checkbox" className="size-4 accent-wine" />Publicar evento y habilitar invitaciones activas</label>
    </div><Field label="Ruta de imagen de invitación"><input {...register("invitationImagePath")} className={fieldClass} /></Field><Field label={<>Ruta de imagen de loading <span className="font-normal text-stone-500">(opcional)</span></>}><input {...register("loadingImagePath")} className={fieldClass} /></Field></fieldset>

    <fieldset className="space-y-5 border-t border-[#e7e4d9] pt-8"><legend className="font-serif text-2xl text-wine">Landing pública principal</legend><p className="mt-2 text-sm leading-6 text-stone-500">Estos datos se muestran únicamente en <code>/</code>. No alteran los enlaces personalizados de invitados.</p>
      <label className="mt-5 flex items-center gap-3 rounded-xl border border-rose/20 p-4 text-sm font-medium"><input {...register("publicLandingEnabled")} type="checkbox" className="size-4 accent-wine" />Habilitar landing pública principal</label>
      <div className="grid gap-5 sm:grid-cols-2"><Field label="Título o heading visible"><input {...register("landingHeading")} className={fieldClass} placeholder="Una noche para celebrar" /></Field><Field label="Nombre de la quinceañera"><input {...register("landingCelebrantName")} className={fieldClass} /></Field><Field label="Texto del botón RSVP"><input {...register("landingRsvpCtaText")} className={fieldClass} /></Field><label className="flex items-center gap-3 self-end rounded-xl border border-rose/20 p-4 text-sm font-medium"><input {...register("landingMusicAutoplay")} type="checkbox" className="size-4 accent-wine" />Intentar reproducir música automáticamente</label></div>
      <div className="grid gap-5 sm:grid-cols-2"><Field label="Imagen de banner (ruta o URL)"><input {...register("landingBannerImagePath")} className={fieldClass} /></Field><Field label="Imagen de corona (ruta o URL)"><input {...register("landingCrownImagePath")} className={fieldClass} /></Field><Field label="Imagen principal de Mariana (ruta o URL)"><input {...register("landingCelebrantImagePath")} className={fieldClass} /></Field><Field label="URL o ruta de música"><input {...register("landingMusicUrl")} className={fieldClass} placeholder="/audio/cancion.mp3" /></Field></div>
      <Field label="Texto descriptivo principal"><textarea {...register("landingDescription")} rows={4} className={fieldClass} /></Field><Field label="Acompañantes y detalles adicionales"><textarea {...register("landingDetails")} rows={5} className={fieldClass} /></Field>
    </fieldset>
    {firstError && <p role="alert" className="text-sm text-red-700">{firstError}</p>}
    <button disabled={pending} className="rounded-full bg-wine px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">{pending ? "Guardando…" : "Guardar configuración"}</button>
    {state.status === "success" && <p role="status" aria-live="polite" className="text-sm text-emerald-800">{state.message}</p>}{state.status === "error" && <p role="alert" className="text-sm text-red-700">{state.message}</p>}
  </form>;
}

function Field({ label, children }: { label: React.ReactNode; children: React.ReactNode }) { return <label className="block text-sm font-medium">{label}{children}</label>; }
