import { Page, Locator } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly headingLogIn: Locator;
    private readonly txtEmail: Locator;
    private readonly txtPassword: Locator;
    private readonly btnLogin: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.headingLogIn = page.getByRole('heading', { name: 'Returning Customer' });
        this.txtEmail = page.getByLabel('E-Mail Address', { exact: true });
        this.txtPassword = page.getByLabel('Password', { exact: true });
        this.btnLogin = page.getByRole('button', { name: 'Login', exact: true });
    }

    /**
     * Logs in with the supplied customer credentials
     * @param email - Customer e-mail address
     * @param password - Customer password
     */
    async login(email: string, password: string): Promise<void> {
        await this.txtEmail.fill(email);
        await this.txtPassword.fill(password);
        await this.btnLogin.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Verifies the login page exists
     * @returns Promise<boolean> - true if the login page is displayed
     */
    async isLoginPageExists(): Promise<boolean> {
        try {
            return await this.headingLogIn.isVisible();
        } catch (error) {
            console.log(`Error checking login page: ${error}`);
            return false;
        }
    }
}
