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
  eventDetails: {
    invitation: ['ACOMPÁÑAME EN ESTE', 'DÍA TAN ESPECIAL', 'JUNTO A MIS PADRES:'],
    parents: {
      first: 'Marco Antonio Morales Tomas',
      second: 'Elizabeth Castillo González',
    },
    ceremony: {
      label: 'MISA',
      venue: 'IGLESIA ESCUELA DE CRISTO',
      time: '5:00 p.m.',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Iglesia+Escuela+de+Cristo',
    },
    reception: {
      label: 'RECEPCIÓN',
      venue: 'JARDÍN EMANUEL, SAN ANTONIO A.C.',
      time: '6:45 p.m.',
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jard%C3%ADn+Emanuel+San+Antonio+A.C.',
    },
  },
  itinerary: {
    heading: 'Itinerario',
    connector: 'DE',
    subheading: 'actividades',
    notice: 'INICIAREMOS PUNTUALES.',
    items: [
      { title: 'Entrada', time: '6:45 p.m.' },
      { title: 'Brindis', time: '7:00' },
      { title: 'Vals', time: '7:15' },
      { title: 'Cena', time: '7:30' },
      { title: 'Baile', time: '8:00' },
      { title: 'Pastel', time: '10:00' },
      { title: 'Baile', time: '10:30-12:00' },
    ],
  },
  dressAndAttendance: {
    title: 'CÓDIGO DE VESTIMENTA',
    dressCode: 'Etiqueta / formal',
    message: 'NOS RESERVAMOS EL USO DEL COLOR ROSADO Y SUS VARIANTES.',
    attendanceTitle: 'Confirmar su asistencia',
    attendanceMessage: 'Agradeceremos confirmar antes del 10 de agosto.',
    buttonLabel: 'CONFIRMAR ASISTENCIA',
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
