import type { Metadata } from "next";
import { PublicLandingPage } from "@/components/landing/event-landing";
import { getPublishedPublicEvent } from "@/lib/queries/public-event";

export const metadata: Metadata = {
  title: "XV Mariana",
  description: "Celebración de los XV años de Mariana.",
  openGraph: { title: "XV Mariana", description: "Una celebración especial.", type: "website" },
};

export const dynamic = "force-dynamic";

export default async function Home() {
  const event = await getPublishedPublicEvent();
  return <PublicLandingPage event={event} />;
}
