import test from 'node:test';
import assert from 'node:assert/strict';
import { createInvitationSlug, isReservedSlug, normalizeSlug } from '../src/lib/slugs.ts';

test('normaliza tildes y caracteres del slug', () => {
  assert.equal(normalizeSlug('  Andrés & Ovando  '), 'andres-ovando');
});

test('crea un slug con sufijo de seis caracteres', () => {
  assert.equal(createInvitationSlug('María José', 'k7m4p2'), 'maria-jose-k7m4p2');
});

test('detecta slugs reservados', () => {
  assert.equal(isReservedSlug('admin'), true);
  assert.equal(isReservedSlug('mariana'), false);
});
