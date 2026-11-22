import { Page, Locator } from '@playwright/test';
import { RegisterPage } from './RegisterPage';
import { LoginPage } from './LoginPage';
import { SearchResultsPage } from './SearchResultsPage';
import { ShoppingCartPage } from './ShoppingCartPage';

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly lnkMyAccount: Locator;
    private readonly mnuAccount: Locator;
    private readonly lnkRegister: Locator;
    private readonly lnkLogin: Locator;
    private readonly lnkShoppingCart: Locator;
    private readonly txtSearch: Locator;
    private readonly btnSearch: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lnkMyAccount = page.locator('#top-links li.dropdown > a');
        this.mnuAccount = page.locator('#top-links li.dropdown ul.dropdown-menu');
        this.lnkRegister = page.locator('#top-links li.dropdown ul.dropdown-menu a', { hasText: 'Register' });
        this.lnkLogin = page.locator('#top-links li.dropdown ul.dropdown-menu a', { hasText: 'Login' });
        this.lnkShoppingCart = page.locator('#top-links a[title="Shopping Cart"]');
        this.txtSearch = page.locator('#search input[name="search"]');
        this.btnSearch = page.locator('#search button');
    }

    /**
     * Opens the "My Account" dropdown in the header
     */
    async clickMyAccount(): Promise<void> {
        await this.openAccountMenu();
    }

    /**
     * Opens the account menu and clicks the "Register" link
     * @returns Promise<RegisterPage> - Instance of the register page
     */
    async clickRegister(): Promise<RegisterPage> {
        await this.openAccountMenu();
        await this.lnkRegister.click();
        await this.page.waitForLoadState('domcontentloaded');
        return new RegisterPage(this.page);
    }

    /**
     * Opens the account menu and clicks the "Login" link
     * @returns Promise<LoginPage> - Instance of the login page
     */
    async clickLogin(): Promise<LoginPage> {
        await this.openAccountMenu();
        await this.lnkLogin.click();
        await this.page.waitForLoadState('domcontentloaded');
        return new LoginPage(this.page);
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
     * Searches for a product using the header search field
     * @param productName - Product name to search for
     * @returns Promise<SearchResultsPage> - Instance of the search results page
     */
    async searchProduct(productName: string): Promise<SearchResultsPage> {
        try {
            await this.txtSearch.fill(productName);
            await this.btnSearch.click();
            await this.page.waitForLoadState('domcontentloaded');
            return new SearchResultsPage(this.page);
        } catch (error) {
            console.log(`Error searching for product '${productName}': ${error}`);
            throw error;
        }
    }

    /**
     * Ensures the "My Account" dropdown menu is open
     */
    private async openAccountMenu(): Promise<void> {
        if (!(await this.mnuAccount.isVisible())) {
            await this.lnkMyAccount.click();
            await this.mnuAccount.waitFor({ state: 'visible' });
        }
    }
}
