import { Page, Locator } from '@playwright/test';
import { HomePage } from './HomePage';

export class LogoutPage {
    private readonly page: Page;

    // Locators
    private readonly headingLogout: Locator;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingLogout = page.getByRole('heading', { name: 'Account Logout' });
        this.btnContinue = page.locator('#content .buttons a', { hasText: 'Continue' });
    }

    /**
     * Clicks the "Continue" button on the logout confirmation page
     * @returns Promise<HomePage> - Instance of the home page
     */
    async clickContinue(): Promise<HomePage> {
        await this.btnContinue.click();
        await this.page.waitForLoadState('domcontentloaded');
        return new HomePage(this.page);
    }

    /**
     * Verifies the logout confirmation page exists
     * @returns Promise<boolean> - true if the logout confirmation is displayed
     */
    async isLogoutPageExists(): Promise<boolean> {
        try {
            return await this.headingLogout.isVisible();
        } catch (error) {
            console.log(`Error checking logout page: ${error}`);
            return false;
        }
    }
}
