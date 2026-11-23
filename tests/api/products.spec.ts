import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { buildUrl, expectIdsSorted, PRODUCT_ID } from './apiTestHelpers';

dotenv.config();

test.describe('FakeStore Products API Tests', () => {
    test('GET - All products have the required fields @master @sanity @api', async ({ request }) => {
        const response = await request.get(buildUrl(Routes.GET_ALL_PRODUCTS));
        expect(response.status(), 'Product listing should succeed').toBe(200);
        const products = await response.json();
        expect(Array.isArray(products), 'Products response should be an array').toBeTruthy();
        expect(products.length, 'At least one product should be returned').toBeGreaterThan(0);

        for (const product of products) {
            expect(product.id, 'Each product should have a numeric ID').toEqual(expect.any(Number));
            expect(product.title, 'Each product should have a title').toEqual(expect.any(String));
            expect(product.price, 'Each product should have a numeric price').toEqual(expect.any(Number));
            expect(product.category, 'Each product should have a category').toEqual(expect.any(String));
            expect(product.image, 'Each product should have an image URL').toEqual(expect.any(String));
        }
    });

    test('GET - Product by ID returns the requested product @master @sanity @api', async ({ request }) => {
        const response = await request.get(buildUrl(Routes.GET_PRODUCT_BY_ID, { id: PRODUCT_ID }));
        expect(response.status(), 'Product lookup should succeed').toBe(200);
        const product = await response.json();
        expect(product.id, 'Returned product ID should match the request').toBe(PRODUCT_ID);
        expect(product.title).toEqual(expect.any(String));
        expect(product.price).toEqual(expect.any(Number));
        expect(product.category).toEqual(expect.any(String));
        expect(product.image).toEqual(expect.any(String));
    });

    test('GET - Products with limit returns the requested count @master @regression @api', async ({ request }) => {
        const limit = 5;
        const response = await request.get(buildUrl(Routes.GET_PRODUCTS_WITH_LIMIT, { limit }));
        expect(response.status(), 'Limited product lookup should succeed').toBe(200);
        const products = await response.json();
        expect(Array.isArray(products), 'Limited products response should be an array').toBeTruthy();
        expect(products.length, 'Product count should match the requested limit').toBe(limit);
    });

    for (const direction of ['asc', 'desc'] as const) {
        test(`GET - Products sorted ${direction} by ID @master @regression @api`, async ({ request }) => {
            const response = await request.get(buildUrl(Routes.GET_PRODUCTS_SORTED, { order: direction }));
            expect(response.status(), `Product ${direction} sort should succeed`).toBe(200);
            const products = await response.json();
            expect(Array.isArray(products), 'Sorted products response should be an array').toBeTruthy();
            expectIdsSorted(products.map((product: { id: number }) => product.id), direction);
        });
    }

    test('GET - All product categories returns a non-empty list @master @sanity @api', async ({ request }) => {
        const response = await request.get(buildUrl(Routes.GET_ALL_CATEGORIES));
        expect(response.status(), 'Category lookup should succeed').toBe(200);
        const categories = await response.json();
        expect(Array.isArray(categories), 'Categories response should be an array').toBeTruthy();
        expect(categories.length, 'At least one category should be returned').toBeGreaterThan(0);
    });

    test('GET - Products by category only returns matching products @master @regression @api', async ({ request }) => {
        const category = 'electronics';
        const response = await request.get(buildUrl(Routes.GET_PRODUCTS_BY_CATEGORY, { category }));
        expect(response.status(), 'Category product lookup should succeed').toBe(200);
        const products = await response.json();
        expect(Array.isArray(products), 'Category products response should be an array').toBeTruthy();
        expect(products.length, 'The selected category should contain products').toBeGreaterThan(0);
        for (const product of products) {
            expect(product.category, 'Every result should belong to the requested category').toBe(category);
        }
    });

    test('POST - Create product returns its ID and submitted fields @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateProductPayload();
        const response = await request.post(buildUrl(Routes.CREATE_PRODUCT), { data: payload });
        expect(response.status(), 'Product creation should succeed').toBe(201);
        const created = await response.json();
        expect(created.id, 'Created product should have a numeric ID').toEqual(expect.any(Number));
        expect(created.title).toBe(payload.title);
        expect(created.price).toBe(payload.price);
        expect(created.category).toBe(payload.category);
        expect(created.image).toBe(payload.image);
    });

    test('PUT - Update product returns the requested values @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateUpdatedProductPayload();
        const response = await request.put(buildUrl(Routes.UPDATE_PRODUCT, { id: PRODUCT_ID }), { data: payload });
        expect(response.status(), 'Product update should succeed').toBe(200);
        const updated = await response.json();
        expect(updated.id, 'Updated product ID should match the request').toBe(PRODUCT_ID);
        expect(updated.title).toBe(payload.title);
        expect(updated.price).toBe(payload.price);
        expect(updated.category).toBe(payload.category);
    });

    test('DELETE - Delete product succeeds @master @regression @api', async ({ request }) => {
        const response = await request.delete(buildUrl(Routes.DELETE_PRODUCT, { id: PRODUCT_ID }));
        expect(response.status(), 'Product deletion should succeed').toBe(200);
        const deleted = await response.json();
        expect(deleted.id, 'Deleted product response should identify the requested product').toBe(PRODUCT_ID);
    });
});