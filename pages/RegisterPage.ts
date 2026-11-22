import { Page, Locator } from '@playwright/test';
import { AccountSuccessPage } from './AccountSuccessPage';

export interface RegistrationDetails {
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    password: string;
}

export class RegisterPage {
    private readonly page: Page;

    // Locators
    private readonly heading: Locator;
    private readonly txtFirstName: Locator;
    private readonly txtLastName: Locator;
    private readonly txtEmail: Locator;
    private readonly txtTelephone: Locator;
    private readonly txtPassword: Locator;
    private readonly txtConfirmPassword: Locator;
    private readonly chkPrivacyPolicy: Locator;
    private readonly btnContinue: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.heading = page.getByRole('heading', { name: 'Register Account' });
        this.txtFirstName = page.getByLabel('First Name', { exact: true });
        this.txtLastName = page.getByLabel('Last Name', { exact: true });
        this.txtEmail = page.getByLabel('E-Mail', { exact: true });
        this.txtTelephone = page.getByLabel('Telephone', { exact: true });
        this.txtPassword = page.getByLabel('Password', { exact: true });
        this.txtConfirmPassword = page.getByLabel('Password Confirm', { exact: true });
        this.chkPrivacyPolicy = page.getByRole('checkbox');
        this.btnContinue = page.getByRole('button', { name: 'Continue', exact: true });
    }

    /**
     * Fills the registration form with the supplied customer details and submits it
     * @param details - Registration details of the new customer
     * @returns Promise<AccountSuccessPage> - Instance of the account success page
     */
    async completeRegistration(details: RegistrationDetails): Promise<AccountSuccessPage> {
        try {
            await this.txtFirstName.fill(details.firstName);
            await this.txtLastName.fill(details.lastName);
            await this.txtEmail.fill(details.email);
            await this.txtTelephone.fill(details.telephone);
            await this.txtPassword.fill(details.password);
            await this.txtConfirmPassword.fill(details.password);
            await this.chkPrivacyPolicy.check();
            await this.btnContinue.click();
            await this.page.waitForLoadState('domcontentloaded');
            return new AccountSuccessPage(this.page);
        } catch (error) {
            console.log(`Error completing registration: ${error}`);
            throw error;
        }
    }

    /**
     * Verifies the registration page exists
     * @returns Promise<boolean> - true if the registration page is displayed
     */
    async isRegisterPageExists(): Promise<boolean> {
        try {
            return await this.heading.isVisible();
        } catch (error) {
            console.log(`Error checking registration page: ${error}`);
            return false;
        }
    }
}
