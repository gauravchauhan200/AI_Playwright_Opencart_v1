import { Page, Locator } from '@playwright/test';
import { ProductPage } from './ProductPage';

export class SearchResultsPage {
    private readonly page: Page;

    // Locators
    private readonly headingSearch: Locator;
    private readonly lnkProductNames: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingSearch = page.locator('#content h1');
        this.lnkProductNames = page.locator('.product-thumb h4 a');
    }

    /**
     * Returns the search results heading text
     * @returns Promise<string> - Heading text such as "Search - MacBook"
     */
    async getSearchHeading(): Promise<string> {
        return (await this.headingSearch.innerText()).trim();
    }

    /**
     * Returns the names of all products listed in the search results
     * @returns Promise<string[]> - Product names
     */
    async getProductNames(): Promise<string[]> {
        return (await this.lnkProductNames.allInnerTexts()).map((name) => name.trim());
    }

    /**
     * Opens a product from the search results by its name
     * @param productName - Name of the product to open
     * @returns Promise<ProductPage> - Instance of the product page
     */
    async clickProduct(productName: string): Promise<ProductPage> {
        try {
            await this.lnkProductNames.filter({ hasText: productName }).first().click();
            await this.page.waitForLoadState('domcontentloaded');
            return new ProductPage(this.page);
        } catch (error) {
            console.log(`Error opening product '${productName}': ${error}`);
            throw error;
        }
    }

    /**
     * Verifies the search results page exists
     * @returns Promise<boolean> - true if the search results heading is displayed
     */
    async isSearchResultsPageExists(): Promise<boolean> {
        try {
            return await this.headingSearch.isVisible();
        } catch (error) {
            console.log(`Error checking search results page: ${error}`);
            return false;
        }
    }
}
