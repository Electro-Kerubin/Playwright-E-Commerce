import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';

test.describe('Pruebas checkout', () => {

    let cartPage: CartPage;
        let page;

        test.beforeEach(async ({ browser }) => {
            page = await browser.newPage();
            // loginPage = new LoginPage(page);
            cartPage = new CartPage(page);
            
            // await loginPage.navigate();
            // await loginPage.login(VALID_USER.username, VALID_USER.password);
            await page.goto("https://www.saucedemo.com/inventory.html");
            await page.waitForLoadState("domcontentloaded");
        });

        test.afterEach(async () => {
            await page.close();
    });

    test('TC13: Completar el proceso de compra', async ({ }) => {

        await cartPage.addItemToCart('sauce-labs-backpack');
        await page.locator('[data-test="shopping-cart-link"]').click();
        await page.locator('[data-test="checkout"]').click();

        await page.locator('[data-test="firstName"]').fill('Rodrigo');
        await page.locator('[data-test="lastName"]').fill('Baeza');
        await page.locator('[data-test="postalCode"]').fill('123456');
        await page.locator('[data-test="continue"]').click();

        await page.locator('[data-test="finish"]').click();

        await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
        await expect(page.locator('[data-test="title"]')).toHaveText('Checkout: Complete!');

    });

    test('TC14: Intentar comprar sin agregar productos', async ({ }) => {
        
        await page.locator('[data-test="shopping-cart-link"]').click();
        await page.locator('[data-test="checkout"]').click();
        
        await page.locator('[data-test="firstName"]').fill('Rodrigo');
        await page.locator('[data-test="lastName"]').fill('Baeza');
        await page.locator('[data-test="postalCode"]').fill('123456');
        await page.locator('[data-test="continue"]').click();

        await page.locator('[data-test="finish"]').click();

        // await expect(page).not.toHaveURL('https://www.saucedemo.com/checkout-complete.html');
        await expect(page.locator('[data-test="title"]')).not.toHaveText('Checkout: Complete!');
    });

    test('TC15: No se puede completar el checkout con los datos de información incompletos', async ({ }) => {
        
        await cartPage.addItemToCart('sauce-labs-backpack');
        await page.locator('[data-test="shopping-cart-link"]').click();
        await page.locator('[data-test="checkout"]').click();

        await page.locator('[data-test="continue"]').click();
        
        await expect(page.locator('[data-test="error"]').first()).toHaveText('Error: First Name is required');
    });
});