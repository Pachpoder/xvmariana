import { expect, test, type Page } from "@playwright/test";

const enabled = process.env.E2E_TESTS === "true";
const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const invitationSlug = process.env.E2E_TEST_SLUG;
const canRun = enabled && !!adminEmail && !!adminPassword && !!invitationSlug;

test.describe.configure({ mode: "serial" });
test.skip(!canRun, "Configura E2E_TESTS=true y las variables E2E_* para usar un proyecto Supabase de prueba aislado.");

async function login(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Correo electrónico").fill(adminEmail!);
  await page.getByLabel("Contraseña").fill(adminPassword!);
  await page.getByRole("button", { name: "Ingresar" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test("protege /admin y permite login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  await login(page);
});

test("crea y edita una invitación", async ({ page }) => {
  await login(page);
  await page.goto("/admin/invitaciones/nueva");
  await page.getByLabel("Etiqueta interna").fill("E2E invitación temporal");
  await page.getByLabel(/Slug personalizado/).fill(invitationSlug!);
  await page.getByLabel("Extras permitidos").fill("1");
  await page.getByPlaceholder("Nombre completo").fill("Invitado E2E");
  await page.getByRole("button", { name: "Crear invitación" }).click();
  await expect(page).toHaveURL(/\/admin\/invitaciones/);
  await page.getByText("E2E invitación temporal").locator("xpath=ancestor::tr").getByRole("link", { name: "Editar invitación" }).click();
  await page.getByLabel("Etiqueta interna").fill("E2E invitación editada");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(page).toHaveURL(/\/admin\/invitaciones/);
});

test("muestra invitación pública, RSVP positivo, negativo y actualización", async ({ page }) => {
  await page.goto(`/${invitationSlug}`);
  await page.getByRole("button", { name: "Abrir invitación" }).click();
  await expect(page.getByText("Confirmación de asistencia")).toBeVisible();
  await page.getByLabel("Personas nombradas").fill("1");
  await page.getByLabel("Acompañantes extras").fill("1");
  await page.getByRole("button", { name: "Confirmar asistencia" }).click();
  await expect(page.getByRole("status")).toContainText("respuesta ha sido guardada");
  await page.getByLabel("Acompañantes extras").fill("2");
  await page.getByRole("button", { name: "Confirmar asistencia" }).click();
  await expect(page.getByRole("alert")).toContainText("acompañantes supera");
  await page.getByText("No podré asistir").click();
  await page.getByRole("button", { name: "Confirmar asistencia" }).click();
  await expect(page.getByRole("status")).toContainText("respuesta ha sido guardada");
});

test("muestra estados de enlace inválido e invitación inactiva", async ({ page }) => {
  await page.goto("/enlace-invalido-e2e");
  await expect(page.getByText("Esta invitación no está disponible")).toBeVisible();
  await login(page);
  await page.goto("/admin/invitaciones");
  page.on("dialog", (dialog) => dialog.accept());
  await page.getByText("E2E invitación editada").locator("xpath=ancestor::tr").getByRole("button", { name: "Archivar invitación" }).click();
  await expect(page.getByText("Invitación archivada.")).toBeVisible();
  await page.goto(`/${invitationSlug}`);
  await expect(page.getByText("Esta invitación no está disponible")).toBeVisible();
});
