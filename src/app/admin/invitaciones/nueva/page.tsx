import { notFound } from "next/navigation";
import { InvitationForm } from "@/components/admin/invitation-form";
import { getFirstEvent } from "@/lib/queries/invitations";
export default async function NewInvitationPage() { const event = await getFirstEvent(); if (!event) notFound(); return <><p className="text-sm font-medium text-gold">INVITACIONES</p><h1 className="mt-2 font-serif text-4xl text-wine">Nueva invitación</h1><div className="mt-8 max-w-2xl"><InvitationForm event={event} /></div></>; }
