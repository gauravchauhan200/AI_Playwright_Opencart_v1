import { Page, Locator } from '@playwright/test';
import { LogoutPage } from './LogoutPage';

export class MyAccountPage {
    private readonly page: Page;

    // Locators
    private readonly headingMyAccount: Locator;
    private readonly lnkLogout: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingMyAccount = page.locator('#content h2', { hasText: 'My Account' }).first();
        this.lnkLogout = page.locator('#column-right a', { hasText: 'Logout' });
    }

    /**
     * Clicks the "Logout" link in the account navigation
     * @returns Promise<LogoutPage> - Instance of the logout page
     */
    async clickLogout(): Promise<LogoutPage> {
        await this.lnkLogout.click();
        await this.page.waitForLoadState('domcontentloaded');
        return new LogoutPage(this.page);
    }

    /**
     * Verifies the my account page exists
     * @returns Promise<boolean> - true if the account dashboard heading is displayed
     */
    async isMyAccountPageExists(): Promise<boolean> {
        try {
            return await this.headingMyAccount.isVisible();
        } catch (error) {
            console.log(`Error checking my account page: ${error}`);
            return false;
        }
    }

    /**
     * Verifies the "Logout" option is available to an authenticated customer
     * @returns Promise<boolean> - true if the logout option is displayed
     */
    async isLogoutLinkExists(): Promise<boolean> {
        try {
            return await this.lnkLogout.isVisible();
        } catch (error) {
            console.log(`Error checking logout link: ${error}`);
            return false;
        }
    }
}
