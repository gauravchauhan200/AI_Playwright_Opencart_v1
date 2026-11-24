/**
 * Test Case: User Registration Flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Navigate to the application URL
 * 2) Open My Account -> Register
 * 3) Verify the registration page is displayed
 * 4) Fill the registration form with dynamically generated unique data
 * 5) Accept the Privacy Policy and submit the form
 * 6) Verify the account-created confirmation message
 * 7) Continue to My Account and verify the account navigation is available
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('User registration flow test @master @sanity @regression @e2e @web' , async ({ homePage, registerPage, accountSuccessPage, myAccountPage }) => {
    const email = RandomDataUtil.getUniqueEmail();
    const password = RandomDataUtil.getPassword(10);

    await test.step('1) Navigate to the registration page', async () => {
        await homePage.clickRegister();
    });

    await test.step('2) Verify the registration page is displayed', async () => {
        const isRegisterPage = await registerPage.isRegisterPageExists();
        expect(isRegisterPage).toBeTruthy();
    });

    await test.step('3) Submit the registration form with unique customer data', async () => {
        await registerPage.completeRegistration({
            firstName: RandomDataUtil.getFirstName(),
            lastName: RandomDataUtil.getLastName(),
            email: email,
            telephone: RandomDataUtil.getPhoneNumber(),
            password: password,
        });
    });

    await test.step('4) Verify the registration succeeded', async () => {
        const isAccountCreated = await accountSuccessPage.isAccountCreated();
        expect(isAccountCreated).toBeTruthy();
    });

    await test.step('5) Verify the account-created confirmation message', async () => {
        const confirmation = await accountSuccessPage.getConfirmationText();
        expect(confirmation).toContain('Your Account Has Been Created!');
    });

    await test.step('6) Verify the new account is available through the account navigation', async () => {
        await accountSuccessPage.clickContinue();
        const isMyAccountPage = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountPage).toBeTruthy();
        expect(await myAccountPage.isLogoutLinkExists()).toBeTruthy();
    });

    console.log('✅ ✔️ User registration flow completed successfully!');
});
