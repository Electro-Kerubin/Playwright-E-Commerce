import { test, expect} from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const BASE_URL = 'https://www.saucedemo.com/';

const VALID_USER = {username: 'standard_user', password: 'secret_sauce'};
const INVALID_USER = {username: 'invalid_user', password: 'invalid_password'};
const LOCKED_USER = {username: 'locked_out_user', password: 'secret_sauce'};



test.describe("Pruebas Login", () => {
    
    let loginPage: LoginPage;
    let page;

    test.beforeEach(async ({ browser }) => {
        page = await browser.newPage();
        
        await page.goto(BASE_URL);
        loginPage = new LoginPage(page);
    });

    test.afterEach(async () => {
        await page.close();
    });

    test('TC1: Login exitoso con credenciales válidas', async ({ }) => {
        await loginPage.login(VALID_USER.username, VALID_USER.password);

        await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
        await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    });

    test('TC2: Login fallido con credenciales inválidas', async ({ }) => {
        await loginPage.login(INVALID_USER.username, INVALID_USER.password);
    
        const errorMessage = page.locator('[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');
    });

    test('TC3: Login fallido con usuario bloqueado', async ({ }) => {
        await loginPage.login(LOCKED_USER.username, LOCKED_USER.password);
    
        const errorMessage = page.locator('[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    });

    test('TC4: Logout de la aplicación', async ({ }) => {
        await loginPage.login(VALID_USER.username, VALID_USER.password);
        
        await page.getByRole('button', { name: 'Open Menu' }).click();
        await page.locator('[data-test="logout-sidebar-link"]').click();
    
        await expect(page).toHaveURL('https://www.saucedemo.com/');
        await expect(page.locator('[data-test=username]')).toBeVisible();
        await expect(page.locator('[data-test=password]')).toBeVisible();
        await expect(page.locator('[data-test=login-button]')).toBeVisible();
    });

});








