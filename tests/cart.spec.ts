import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';

test.describe('Pruebas Carrito', () => {
    
    // let loginPage: LoginPage;
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

    test('TC5: Agregar un producto al carrito', async ({ }) => {
        await cartPage.addItemToCart('sauce-labs-backpack');
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText("1");

        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page.locator('[data-test="item-4-title-link"]')).toHaveText('Sauce Labs Backpack');
    });

    test('TC6: Agregar dos productos al carrito', async ({ }) => {
        await cartPage.addItemToCart('sauce-labs-backpack');
        await cartPage.addItemToCart('sauce-labs-bike-light');
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText("2");

        await page.locator('[data-test="shopping-cart-link"]').click();
        await expect(page.locator('[data-test="item-4-title-link"]')).toHaveText('Sauce Labs Backpack');
        await expect(page.locator('[data-test="item-0-title-link"]')).toHaveText('Sauce Labs Bike Light');
    });

    test('TC7: Eliminar un producto del carrito', async ({ }) => {
        await cartPage.addItemToCart('sauce-labs-backpack');
        await cartPage.addItemToCart('sauce-labs-bike-light');
        await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText("1");
    });

    test('TC8: Eliminar todos los productos del carrito', async ({ }) => {
        await cartPage.addItemToCart('sauce-labs-backpack');
        await cartPage.addItemToCart('sauce-labs-bike-light');
        await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
        await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
        await expect(page.locator('[data-test="shopping-cart-badge"]')).toBeHidden();
    });

    test('TC9: Filtrar productos por precio de alto a mas bajo', async ({ }) => {
        await page.locator('[data-test="product-sort-container"]').selectOption({ label: 'Price (high to low)' });
        const priceElements = await page.locator('[data-test="inventory_item_price"]').allInnerTexts();
        const prices = priceElements.map(price => parseFloat(price.replace('$', '')));
        const sortedPrices = [...prices].sort((a, b) => b - a);

        expect(prices).toEqual(sortedPrices);
    });

    test('TC10: Filtrar productos por precio de bajo a mas alto', async ({ }) => {
        await page.locator('[data-test="product-sort-container"]').selectOption({ label: 'Price (low to high)' });
        const priceElements = await page.locator('[data-test="inventory_item_price"]').allInnerTexts();
        const prices = priceElements.map(price => parseFloat(price.replace('$', '')));
        const sortedPrices = [...prices].sort((a, b) => a - b);

        expect(prices).toEqual(sortedPrices);
    });

    test('TC11: Filtrar productos por nombre de A a Z', async ({ }) => {
        await page.locator('[data-test="product-sort-container"]').selectOption({ label: 'Name (A to Z)' });
        const nameElements = await page.locator('[data-test="inventory_item_name"]').allInnerTexts();
        const names = nameElements.map(name => name.toLowerCase());
        const sortedNames = [...names].sort();

        expect(names).toEqual(sortedNames);
    });

    test('TC12: Filtrar productos por nombre de Z a A', async ({ }) => {
        await page.locator('[data-test="product-sort-container"]').selectOption({ label: 'Name (Z to A)' });
        const nameElements = await page.locator('[data-test="inventory_item_name"]').allInnerTexts();
        const names = nameElements.map(name => name.toLowerCase());
        const sortedNames = [...names].sort().reverse();

        expect(names).toEqual(sortedNames);
    });

});