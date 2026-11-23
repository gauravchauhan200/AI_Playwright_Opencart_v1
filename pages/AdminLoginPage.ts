import { Page, Locator } from '@playwright/test';

export class AdminLoginPage {
    private readonly page: Page;

    // Locators
    private readonly txtUsername: Locator;
    private readonly txtPassword: Locator;
    private readonly btnLogin: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.txtUsername = page.getByLabel('Username', { exact: true });
        this.txtPassword = page.getByLabel('Password', { exact: true });
        this.btnLogin = page.getByRole('button', { name: /Login/ });
    }

    /**
     * Signs in to the OpenCart administration portal.
     * @param username - Configured administrator username
     * @param password - Configured administrator password
     */
    async login(username: string, password: string): Promise<void> {
        await this.txtUsername.fill(username);
        await this.txtPassword.fill(password);
        await this.btnLogin.click();
        await this.page.waitForURL((url) => url.searchParams.has('user_token'));
    }
}