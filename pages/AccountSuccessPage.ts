import { Page, Locator } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';

export class AccountSuccessPage {
    private readonly page: Page;

    // Locators
    private readonly headingConfirmation: Locator;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingConfirmation = page.getByRole('heading', { name: 'Your Account Has Been Created!' });
        this.btnContinue = page.getByRole('link', { name: 'Continue', exact: true });
    }

    /**
     * Returns the account-created confirmation text
     * @returns Promise<string> - Confirmation heading text
     */
    async getConfirmationText(): Promise<string> {
        return (await this.headingConfirmation.innerText()).trim();
    }

    /**
     * Clicks the "Continue" button on the account success page
     * @returns Promise<MyAccountPage> - Instance of the my account page
     */
    async clickContinue(): Promise<MyAccountPage> {
        await this.btnContinue.click();
        await this.page.waitForLoadState('domcontentloaded');
        return new MyAccountPage(this.page);
    }

    /**
     * Verifies the account-created confirmation page exists
     * @returns Promise<boolean> - true if the confirmation heading is displayed
     */
    async isAccountCreated(): Promise<boolean> {
        try {
            return await this.headingConfirmation.isVisible();
        } catch (error) {
            console.log(`Error checking account success page: ${error}`);
            return false;
        }
    }
}
