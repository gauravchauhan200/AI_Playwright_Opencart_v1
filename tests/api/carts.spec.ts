import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { buildUrl, CART_ID, expectIdsSorted, USER_ID } from './apiTestHelpers';

dotenv.config();

test.describe('FakeStore Carts API Tests', () => {
    test('GET - All carts returns a non-empty list @master @sanity @api', async ({ request }) => {
        const response = await request.get(buildUrl(Routes.GET_ALL_CARTS));
        expect(response.status(), 'Cart listing should succeed').toBe(200);
        const carts = await response.json();
        expect(Array.isArray(carts), 'Carts response should be an array').toBeTruthy();
        expect(carts.length, 'At least one cart should be returned').toBeGreaterThan(0);
    });

    test('GET - Cart by ID returns the requested cart @master @sanity @api', async ({ request }) => {
        const response = await request.get(buildUrl(Routes.GET_CART_BY_ID, { id: CART_ID }));
        expect(response.status(), 'Cart lookup should succeed').toBe(200);
        const cart = await response.json();
        expect(cart.id, 'Returned cart ID should match the request').toBe(CART_ID);
    });

    test('GET - Carts within a date range match the requested dates @master @regression @api', async ({ request }) => {
        const startDate = '2020-01-01';
        const endDate = '2030-01-01';
        const response = await request.get(buildUrl(Routes.GET_CARTS_BY_DATE_RANGE, {
            startdate: startDate,
            enddate: endDate,
        }));
        expect(response.status(), 'Cart date-range lookup should succeed').toBe(200);
        const carts = await response.json();
        expect(Array.isArray(carts), 'Date-filtered carts response should be an array').toBeTruthy();
        for (const cart of carts) {
            const cartDate = new Date(cart.date).getTime();
            expect(cartDate, 'Cart date should be on or after the requested start date').toBeGreaterThanOrEqual(new Date(startDate).getTime());
            expect(cartDate, 'Cart date should be on or before the requested end date').toBeLessThanOrEqual(new Date(endDate).getTime());
        }
    });

    test('GET - User cart only contains carts for that user @master @regression @api', async ({ request }) => {
        const response = await request.get(buildUrl(Routes.GET_USER_CART, { userId: USER_ID }));
        expect(response.status(), 'User cart lookup should succeed').toBe(200);
        const carts = await response.json();
        expect(Array.isArray(carts), 'User carts response should be an array').toBeTruthy();
        for (const cart of carts) {
            expect(cart.userId, 'Each cart should belong to the requested user').toBe(USER_ID);
        }
    });

    test('GET - Carts with limit returns the requested count @master @regression @api', async ({ request }) => {
        const limit = 5;
        const response = await request.get(buildUrl(Routes.GET_CARTS_WITH_LIMIT, { limit }));
        expect(response.status(), 'Limited cart lookup should succeed').toBe(200);
        const carts = await response.json();
        expect(Array.isArray(carts), 'Limited carts response should be an array').toBeTruthy();
        expect(carts.length, 'Cart count should match the requested limit').toBe(limit);
    });

    for (const direction of ['asc', 'desc'] as const) {
        test(`GET - Carts sorted ${direction} by ID @master @regression @api`, async ({ request }) => {
            const response = await request.get(buildUrl(Routes.GET_CARTS_SORTED, { order: direction }));
            expect(response.status(), `Cart ${direction} sort should succeed`).toBe(200);
            const carts = await response.json();
            expect(Array.isArray(carts), 'Sorted carts response should be an array').toBeTruthy();
            expectIdsSorted(carts.map((cart: { id: number }) => cart.id), direction);
        });
    }

    test('POST - Create cart returns the submitted cart fields @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateCartPayload(USER_ID);
        const response = await request.post(buildUrl(Routes.CREATE_CART), { data: payload });
        expect(response.status(), 'Cart creation should succeed').toBe(201);
        const created = await response.json();
        expect(created.id, 'Created cart should have a numeric ID').toEqual(expect.any(Number));
        expect(created.userId).toBe(payload.userId);
        expect(created.products).toEqual(payload.products);
    });

    test('PUT - Update cart reflects the changed product quantity @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
        payload.products[0].quantity += 1;
        const response = await request.put(buildUrl(Routes.UPDATE_CART, { id: CART_ID }), { data: payload });
        expect(response.status(), 'Cart update should succeed').toBe(200);
        const updated = await response.json();
        expect(updated.id, 'Updated cart ID should match the request').toBe(CART_ID);
        expect(updated.userId).toBe(payload.userId);
        expect(updated.products[0].quantity).toBe(payload.products[0].quantity);
    });

    test('DELETE - Delete cart succeeds @master @regression @api', async ({ request }) => {
        const response = await request.delete(buildUrl(Routes.DELETE_CART, { id: CART_ID }));
        expect(response.status(), 'Cart deletion should succeed').toBe(200);
        const deleted = await response.json();
        expect(deleted.id, 'Deleted cart response should identify the requested cart').toBe(CART_ID);
    });
});