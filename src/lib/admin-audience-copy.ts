/**
 * Nombres visibles de los dos canales de invitación en el panel administrativo.
 * Si cambia el público de la landing, estos textos se actualizan desde un solo lugar.
 */
export const adminAudienceCopy = {
  personalized: {
    navLabel: 'Invitaciones familiares',
    eyebrow: 'FAMILIARES',
    heading: 'Invitaciones familiares',
    description: 'Pases personalizados que se entregan a familiares y grupos familiares.',
    rowLabel: 'Pase personalizado para familiares',
  },
  publicLanding: {
    navLabel: 'Respuestas de amigos',
    eyebrow: 'AMIGOS · LANDING PÚBLICA',
    heading: 'Respuestas de amigos',
    description:
      'Amigos que respondieron directamente desde la landing pública. Cada respuesta representa a una persona.',
  },
} as const;
