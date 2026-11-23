import dotenv from 'dotenv';
import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { executeQuery } from '../../utils/dbClient';

dotenv.config();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const STOREFRONT_URL = process.env.WEB_APP_URL || 'http://localhost/opencart/upload/';
const ADMIN_URL = new URL('admin/index.php', STOREFRONT_URL).toString();

test('Register customer and verify it in Admin and MySQL @master @regression @db @end-to-end', async ({
    homePage,
    registerPage,
    accountSuccessPage,
    page,
    adminLoginPage,
    adminCustomersPage,
}) => {
    expect(ADMIN_USERNAME, 'ADMIN_USERNAME must be configured').toBeTruthy();
    expect(ADMIN_PASSWORD, 'ADMIN_PASSWORD must be configured').toBeTruthy();

    const customer = {
        firstName: RandomDataUtil.getFirstName(),
        lastName: RandomDataUtil.getLastName(),
        email: RandomDataUtil.getUniqueEmail(),
        telephone: RandomDataUtil.getPhoneNumber(),
        password: RandomDataUtil.getPassword(12),
    };

    await test.step('1) Register a customer through the storefront', async () => {
        await homePage.clickRegister();
        expect(await registerPage.isRegisterPageExists(), 'Registration page should be displayed').toBeTruthy();
        await registerPage.completeRegistration(customer);
        expect(await accountSuccessPage.isAccountCreated(), 'Registration should reach the success page').toBeTruthy();
        expect(await accountSuccessPage.getConfirmationText(), 'Success page should confirm account creation')
            .toContain('Your Account Has Been Created!');
    });

    await test.step('2) Find the registered customer in the Admin Portal', async () => {
        await page.goto(ADMIN_URL);
        await adminLoginPage.login(ADMIN_USERNAME!, ADMIN_PASSWORD!);
        await adminCustomersPage.openCustomerList();

        const customerRow = await adminCustomersPage.searchByEmail(customer.email);
        await expect(customerRow, 'The newly registered customer should appear in the Admin customer list').toBeVisible();
        await expect(customerRow).toContainText(`${customer.firstName} ${customer.lastName}`);
        await expect(customerRow).toContainText(customer.email);
        await expect(customerRow, 'A newly registered customer should have Enabled status').toContainText('Enabled');
    });

    await test.step('3) Verify the registered customer in MySQL', async () => {
        const [columnRows] = await executeQuery('SHOW COLUMNS FROM oc_customer');
        const columnNames = (columnRows as Array<{ Field: string }>).map((column) => column.Field);
        const requiredColumns = ['firstname', 'lastname', 'email', 'status'];

        for (const column of requiredColumns) {
            expect(columnNames, `The oc_customer table should contain the ${column} column`).toContain(column);
        }

        const selectedColumns = [...requiredColumns, ...(columnNames.includes('date_added') ? ['date_added'] : [])];
        const sql = `SELECT ${selectedColumns.map((column) => `\`${column}\``).join(', ')} FROM oc_customer WHERE email = ?`;
        const [rows] = await executeQuery(sql, [customer.email]);
        const matchingCustomers = rows as Array<Record<string, unknown>>;

        expect(matchingCustomers, 'Exactly one database record should match the unique email').toHaveLength(1);
        const databaseCustomer = matchingCustomers[0];
        expect(databaseCustomer.firstname, 'Database first name should match the registration').toBe(customer.firstName);
        expect(databaseCustomer.lastname, 'Database last name should match the registration').toBe(customer.lastName);
        expect(databaseCustomer.email, 'Database email should match the registration').toBe(customer.email);
        expect(Number(databaseCustomer.status), 'New customer status should be enabled').toBe(1);

        if (columnNames.includes('date_added')) {
            expect(databaseCustomer.date_added, 'Customer date_added should be populated').toBeTruthy();
        }
    });
});