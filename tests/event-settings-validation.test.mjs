import test from 'node:test';
import assert from 'node:assert/strict';
import { eventSettingsSchema } from '../src/lib/validation/event-settings.ts';

const validSettings = {
  id: '11111111-1111-4111-8111-111111111111',
  name: 'XV Años de Mariana',
  slug: 'xv-mariana',
  invitationImagePath: '/assets/invitacion-placeholder.svg',
  eventDate: '2027-01-10T18:00',
  loadingDurationMs: 3000,
  isPublished: true,
};

test('acepta la configuración operativa mínima del evento', () => {
  assert.equal(eventSettingsSchema.safeParse(validSettings).success, true);
});

test('requiere los datos esenciales de las invitaciones', () => {
  assert.equal(eventSettingsSchema.safeParse({ ...validSettings, name: '' }).success, false);
  assert.equal(
    eventSettingsSchema.safeParse({ ...validSettings, invitationImagePath: '' }).success,
    false
  );
});

test('valida el enlace y los tiempos de las invitaciones', () => {
  assert.equal(eventSettingsSchema.safeParse({ ...validSettings, slug: '***' }).success, false);
  assert.equal(
    eventSettingsSchema.safeParse({ ...validSettings, loadingDurationMs: 10001 }).success,
    false
  );
});
