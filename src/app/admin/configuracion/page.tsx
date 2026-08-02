import { notFound } from "next/navigation";
import { EventSettingsForm } from "@/components/admin/event-settings-form";
import { getEventSettings } from "@/lib/queries/invitations";
export default async function SettingsPage() { const event = await getEventSettings(); if (!event) notFound(); return <><p className="text-sm font-medium text-gold">EVENTO</p><h1 className="mt-2 font-serif text-4xl text-wine">Configuración</h1><p className="mt-3 text-sm text-stone-500">Administra el evento, las invitaciones personales y el contenido de la landing pública.</p><div className="mt-8"><EventSettingsForm event={event} /></div></>; }
