import { expect, test } from '@playwright/test';

const enabled = process.env.E2E_TESTS === 'true';
const viewports = [
  { width: 320, height: 720 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 900 },
  { width: 1440, height: 1000 },
];

test.skip(!enabled, 'Activa E2E_TESTS=true para comprobar la landing con un evento publicado.');
for (const viewport of viewports) {
  test(`landing principal se mantiene centrada en ${viewport.width}px`, async ({ page }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('main section').first()).toHaveCSS('max-width', '520px');
    expect(
      await page.locator('html').evaluate((element) => element.scrollWidth <= element.clientWidth)
    ).toBeTruthy();
    await page.getByRole('button', { name: 'Confirma tu asistencia' }).click();
    expect(pageErrors).toEqual([]);
    await expect(page.getByRole('dialog', { name: 'Confirma tu asistencia' })).toBeVisible();
    await expect(page.getByLabel('Nombre')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enviar respuesta' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Confirma tu asistencia' })).toBeHidden();
  });
}
