import { Locator, Page } from '@playwright/test';

export class AdminCustomersPage {
    private readonly page: Page;

    // Locators
    private readonly lnkCustomersMenu: Locator;
    private readonly lnkCustomerList: Locator;
    private readonly txtFilterEmail: Locator;
    private readonly btnFilter: Locator;
    private readonly customerTable: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators with CSS selectors
        this.lnkCustomersMenu = page.locator('#menu-customer > a');
        this.lnkCustomerList = page.locator('#menu-customer a[href*="route=customer/customer&"]');
        this.txtFilterEmail = page.locator('input[name="filter_email"]');
        this.btnFilter = page.locator('#button-filter');
        this.customerTable = page.locator('table.table-bordered.table-hover');
    }

    /**
     * Opens the customer list in the administration portal.
     */
    async openCustomerList(): Promise<void> {
        await this.lnkCustomersMenu.click();
        await this.lnkCustomerList.click();
        await this.page.waitForURL((url) => url.searchParams.get('route') === 'customer/customer');
    }

    /**
     * Filters the customer list by email address.
     * @param email - Unique email address to search for
     * @returns Locator for the matching customer row
     */
    async searchByEmail(email: string): Promise<Locator> {
        await this.txtFilterEmail.fill(email);
        await this.btnFilter.click();
        return this.customerTable.locator('tbody tr').filter({ hasText: email });
    }
}