import { expect, test } from '@playwright/test';

const enabled = process.env.E2E_TESTS === 'true';
const viewports = [
  { name: '320px', width: 320, height: 720 },
  { name: '375px', width: 375, height: 812 },
  { name: '390px', width: 390, height: 844 },
  { name: '430px', width: 430, height: 932 },
  { name: '768px', width: 768, height: 1024 },
  { name: '1440px', width: 1440, height: 1000 },
];

test.skip(!enabled, 'Activa E2E_TESTS=true únicamente con un entorno de prueba aislado.');
for (const viewport of viewports) {
  test(`login no tiene desbordamiento horizontal en ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/admin/login');
    await expect(page.getByRole('heading', { name: 'Bienvenida' })).toBeVisible();
    expect(
      await page.locator('html').evaluate((element) => element.scrollWidth <= element.clientWidth)
    ).toBeTruthy();
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus-visible')).toHaveCount(1);
  });
}
