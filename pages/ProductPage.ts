import { Page, Locator } from '@playwright/test';
import { ShoppingCartPage } from './ShoppingCartPage';

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly headingProduct: Locator;
    private readonly productPrice: Locator;
    private readonly txtQuantity: Locator;
    private readonly btnAddToCart: Locator;
    private readonly msgSuccess: Locator;
    private readonly lnkShoppingCart: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingProduct = page.locator('#content h1');
        this.productPrice = page.locator('#content ul.list-unstyled li h2');
        this.txtQuantity = page.getByLabel('Qty', { exact: true });
        this.btnAddToCart = page.locator('#button-cart');
        this.msgSuccess = page.locator('.alert-success');
        this.lnkShoppingCart = page.locator('#top-links a[title="Shopping Cart"]');
    }

    /**
     * Returns the displayed product name
     * @returns Promise<string> - Product heading text
     */
    async getProductName(): Promise<string> {
        return (await this.headingProduct.innerText()).trim();
    }

    /**
     * Returns the displayed product unit price
     * @returns Promise<string> - Product price, e.g. "$602.00"
     */
    async getProductPrice(): Promise<string> {
        return (await this.productPrice.innerText()).trim();
    }

    /**
     * Sets the product quantity
     * @param quantity - Quantity to add to the cart
     */
    async setQuantity(quantity: string): Promise<void> {
        await this.txtQuantity.fill(quantity);
    }

    /**
     * Clicks the "Add to Cart" button and waits for the confirmation message
     */
    async clickAddToCart(): Promise<void> {
        try {
            await this.btnAddToCart.click();
            await this.msgSuccess.waitFor({ state: 'visible' });
        } catch (error) {
            console.log(`Error adding product to cart: ${error}`);
            throw error;
        }
    }

    /**
     * Returns the product-added confirmation message
     * @returns Promise<string> - Success message text
     */
    async getSuccessMessage(): Promise<string> {
        return (await this.msgSuccess.innerText()).trim();
    }

    /**
     * Clicks the "Shopping Cart" link in the header
     * @returns Promise<ShoppingCartPage> - Instance of the shopping cart page
     */
    async clickShoppingCart(): Promise<ShoppingCartPage> {
        await this.lnkShoppingCart.click();
        await this.page.waitForLoadState('domcontentloaded');
        return new ShoppingCartPage(this.page);
    }

    /**
     * Verifies the product details page exists
     * @returns Promise<boolean> - true if the product heading is displayed
     */
    async isProductPageExists(): Promise<boolean> {
        try {
            return await this.headingProduct.isVisible();
        } catch (error) {
            console.log(`Error checking product page: ${error}`);
            return false;
        }
    }
}
