import { Page, Locator } from '@playwright/test';

export class ShoppingCartPage {
    private readonly page: Page;

    // Locators
    private readonly headingCart: Locator;
    private readonly productRows: Locator;
    private readonly productNameLinks: Locator;
    private readonly quantityInputs: Locator;
    private readonly totalsTable: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingCart = page.getByRole('heading', { name: /^Shopping Cart/ });
        this.productRows = page.locator('#content form table tbody tr');
        this.productNameLinks = page.locator('#content form table tbody tr td:nth-child(2) a');
        this.quantityInputs = page.locator('#content form table tbody tr input[name^="quantity"]');
        this.totalsTable = page.locator('#content table').last();
    }

    /**
     * Returns the names of all products present in the cart
     * @returns Promise<string[]> - Product names
     */
    async getProductNames(): Promise<string[]> {
        return (await this.productNameLinks.allInnerTexts()).map((name) => name.trim());
    }

    /**
     * Returns the quantity shown for the cart product at the given index
     * @param index - Zero-based product index
     * @returns Promise<string> - Quantity value
     */
    async getProductQuantity(index: number = 0): Promise<string> {
        return await this.quantityInputs.nth(index).inputValue();
    }

    /**
     * Returns the unit price shown for the cart product at the given index
     * @param index - Zero-based product index
     * @returns Promise<string> - Unit price, e.g. "$602.00"
     */
    async getProductUnitPrice(index: number = 0): Promise<string> {
        return (await this.productRows.nth(index).locator('td').nth(4).innerText()).trim();
    }

    /**
     * Returns the applicable cart total displayed in the totals table
     * @returns Promise<string> - Cart total, e.g. "$602.00"
     */
    async getCartTotal(): Promise<string> {
        return (await this.totalsTable.locator('tbody tr').last().locator('td').last().innerText()).trim();
    }

    /**
     * Verifies the shopping cart page exists
     * @returns Promise<boolean> - true if the cart heading is displayed
     */
    async isShoppingCartPageExists(): Promise<boolean> {
        try {
            return await this.headingCart.isVisible();
        } catch (error) {
            console.log(`Error checking shopping cart page: ${error}`);
            return false;
        }
    }
}
