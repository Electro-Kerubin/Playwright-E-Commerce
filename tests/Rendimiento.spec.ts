import { test, expect } from '@playwright/test';

// Visualiazcion de los resultados: npx playwright show-trace trace.zip

test.describe('Pruebas Rendimiento', () => {

    let page;
    let context;
    let tracingStarted = false;

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();
        tracingStarted = false;
    });

    test.afterAll(async () => {
        if (tracingStarted) { 
            await context.tracing.stop({ path: `trace-${test.info().title}.zip` });
        }
        await page.close();
        await context.close();
    });

    test('TC16: Carga de la página de inicio', async ({ }) => {
        // iniciar traza de rendimiento
        await page.context().tracing.start({ screenshots: true, snapshots: true });
        const startTime = performance.now();
        await page.goto('https://www.saucedemo.com/');
        await page.waitForLoadState('domcontentloaded');
        const endTime = performance.now();

        expect(endTime - startTime).toBeLessThanOrEqual(3000);
        await page.context().tracing.stop({ path: 'trace.zip' });
    });

    test('TC17: Carga de productos al carrito', async ({ }) => {
        // iniciar traza de rendimiento
        await page.context().tracing.start({ screenshots: true, snapshots: true });
        const startTime = performance.now();
        await page.goto('https://www.saucedemo.com/inventory.html');
        await page.waitForLoadState('domcontentloaded');
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        const endTime = performance.now();

        expect(endTime - startTime).toBeLessThanOrEqual(3000);
        await page.context().tracing.stop({ path: 'trace.zip' });
    });

    test('TC18: Carga de checkout', async ({ }) => {
        // iniciar traza de rendimiento
        await page.context().tracing.start({ screenshots: true, snapshots: true });
        await page.goto('https://www.saucedemo.com/inventory.html');
        await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
        await page.locator('[data-test="shopping-cart-link"]').click();
        await page.locator('[data-test="checkout"]').click();
        await page.locator('[data-test="firstName"]').fill('John');
        await page.locator('[data-test="lastName"]').fill('Doe');
        await page.locator('[data-test="postalCode"]').fill('12345');
        await page.locator('[data-test="continue"]').click();     
        const startTime = performance.now();
        await page.locator('[data-test="finish"]').click();
        await page.waitForURL('https://www.saucedemo.com/checkout-complete.html');
        await page.waitForLoadState('domcontentloaded');
        const endTime = performance.now();

        expect(endTime - startTime).toBeLessThanOrEqual(3000);
        await page.context().tracing.stop({ path: 'trace.zip' });
    });

});