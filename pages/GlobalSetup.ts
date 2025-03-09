import { chromium } from "@playwright/test";
import { LoginPage } from "./LoginPage";

async function globalSetup() {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    let username = "standard_user";
    let password = "secret_sauce";

    let loginPage = new LoginPage(page);

    // login
    await page.goto('https://www.saucedemo.com/');
    await loginPage.login(username, password);

    await page.waitForLoadState("domcontentloaded");
    await page.waitForURL(/inventory.html/);

    await context.storageState({ path: 'cookies.json' });
    await browser.close();
}

export default globalSetup;