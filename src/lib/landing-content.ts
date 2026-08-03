/**
 * Contenido fijo de la landing pública.
 *
 * Edita este archivo para actualizar textos, imágenes, horarios, lugares o
 * secciones de la landing. Ninguno de estos datos se administra desde /admin.
 */
export const landingContent = {
  // Debe coincidir con el slug del evento que recibirá las confirmaciones públicas.
  eventSlug: 'xv-mariana',
  hero: {
    eyebrow: 'MIS XV AÑOS',
    heading: 'Una noche para celebrar',
    bannerImagePath: null as string | null,
  },
  celebrant: {
    title: 'MIS XV AÑOS',
    name: 'Mariana',
    date: '20.08.2026',
    imagePath: '/assets/landing/background/background1.png' as string | null,
    description:
      'Hoy celebramos con alegría los XV años de Mariana, una etapa que simboliza crecimiento, ilusión y el comienzo de un hermoso camino hacia el futuro.',
  },
  music: { url: null as string | null, autoplay: false },
  // Añade aquí ceremonia y recepción cuando estén confirmadas.
  locations: [] as Array<{
    title: string;
    time: string;
    venue: string;
    address: string;
    mapsUrl: string;
    icon: string;
  }>,
  // Añade aquí las actividades en el orden en que ocurrirán.
  timeline: [] as Array<{ time: string; title: string; icon: string }>,
  dressCode: {
    enabled: false,
    title: 'Código de vestimenta',
    label: 'ETIQUETA',
    imagePath: null as string | null,
    message: '',
  },
  attendance: {
    title: 'Confirma tu asistencia',
    deadline: '' as string | null,
    buttonLabel: 'Confirmar asistencia',
    message: '',
    closing: '',
  },
} as const;

export type LandingContent = typeof landingContent;
