/**
 * Test Case: End-to-End Shopping Flow
 *
 * Tags: @master @end-to-end @regression @web
 *
 * Steps:
 * 1) Navigate to the application URL
 * 2) Register a new customer using dynamically generated unique data
 * 3) Verify successful registration
 * 4) Log out
 * 5) Log in again using the newly created credentials
 * 6) Verify successful authentication
 * 7) Search for a known product
 * 8) Open the product details page
 * 9) Add the product to the cart
 * 10) Open the shopping cart
 * 11) Verify the product, quantity, unit price and applicable cart total
 * 12) Verify the complete journey finishes without errors
 */

// using custom fixtures
import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';

test('End-to-end shopping flow test @master @e2e @regression @web', async ({
    homePage,
    registerPage,
    accountSuccessPage,
    myAccountPage,
    logoutPage,
    loginPage,
    searchResultsPage,
    productPage,
    shoppingCartPage,
}) => {
    const email = RandomDataUtil.getUniqueEmail();
    const password = RandomDataUtil.getPassword(10);
    const { productName, productQuantity, totalPrice } = Helper.getProductDetails();

    await test.step('1) Register a new customer with unique data', async () => {
        await homePage.clickRegister();
        const isRegisterPage = await registerPage.isRegisterPageExists();
        expect(isRegisterPage).toBeTruthy();

        await registerPage.completeRegistration({
            firstName: RandomDataUtil.getFirstName(),
            lastName: RandomDataUtil.getLastName(),
            email: email,
            telephone: RandomDataUtil.getPhoneNumber(),
            password: password,
        });
    });

    await test.step('2) Verify successful registration', async () => {
        const isAccountCreated = await accountSuccessPage.isAccountCreated();
        expect(isAccountCreated).toBeTruthy();
        expect(await accountSuccessPage.getConfirmationText()).toContain('Your Account Has Been Created!');
        await accountSuccessPage.clickContinue();
    });

    await test.step('3) Log out of the newly created account', async () => {
        const isMyAccountPage = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountPage).toBeTruthy();

        await myAccountPage.clickLogout();
        const isLogoutPage = await logoutPage.isLogoutPageExists();
        expect(isLogoutPage).toBeTruthy();
        await logoutPage.clickContinue();
    });

    await test.step('4) Log in again using the newly created credentials', async () => {
        await homePage.clickLogin();
        const isLoginPage = await loginPage.isLoginPageExists();
        expect(isLoginPage).toBeTruthy();

        await loginPage.login(email, password);
    });

    await test.step('5) Verify successful authentication', async () => {
        const isMyAccountPage = await myAccountPage.isMyAccountPageExists();
        expect(isMyAccountPage).toBeTruthy();
    });

    await test.step('6) Search for a known product', async () => {
        await homePage.searchProduct(productName);
        const isSearchResultsPage = await searchResultsPage.isSearchResultsPageExists();
        expect(isSearchResultsPage).toBeTruthy();
        expect(await searchResultsPage.getSearchHeading()).toContain(productName);
    });

    await test.step('7) Open the product details page', async () => {
        await searchResultsPage.clickProduct(productName);
        const isProductPage = await productPage.isProductPageExists();
        expect(isProductPage).toBeTruthy();
        expect(await productPage.getProductName()).toBe(productName);
    });

    await test.step('8) Add the product to the cart', async () => {
        await productPage.setQuantity(productQuantity);
        await productPage.clickAddToCart();
        expect(await productPage.getSuccessMessage()).toContain(`You have added ${productName} to your shopping cart!`);
    });

    await test.step('9) Open the shopping cart', async () => {
        await productPage.clickShoppingCart();
        const isShoppingCartPage = await shoppingCartPage.isShoppingCartPageExists();
        expect(isShoppingCartPage).toBeTruthy();
    });

    await test.step('10) Verify the product and quantity in the cart', async () => {
        expect(await shoppingCartPage.getProductNames()).toContain(productName);
        expect(await shoppingCartPage.getProductQuantity()).toBe(productQuantity);
    });

    await test.step('11) Verify the product price and applicable cart total', async () => {
        expect(await shoppingCartPage.getProductUnitPrice()).toBe(totalPrice);
        expect(await shoppingCartPage.getCartTotal()).toBe(totalPrice);
    });

    console.log('✅ ✔️ End-to-end shopping flow completed successfully!');
});
