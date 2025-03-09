import { Page } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async addItemToCart(productName: string) {
        await this.page.locator(`[data-test="add-to-cart-${productName}"]`).click();
    }

    async getCartCounter() {
        return this.page.locator('[data-test="shopping-cart-badge"]');
    }
}