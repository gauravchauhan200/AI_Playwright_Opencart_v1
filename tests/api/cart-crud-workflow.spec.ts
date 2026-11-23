import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { buildUrl, USER_ID } from './apiTestHelpers';

dotenv.config();

test.describe('FakeStore Cart CRUD Workflow', () => {
    test('WORKFLOW - Create, update, and delete cart @master @regression @end-to-end @api', async ({ request }) => {
        const cart = RandomDataUtil.generateCartPayload(USER_ID);
        const createResponse = await request.post(buildUrl(Routes.CREATE_CART), { data: cart });
        expect(createResponse.status(), 'Workflow cart creation should succeed').toBe(201);
        const created = await createResponse.json();
        const cartId = created.id as number;
        expect(cartId, 'Workflow should capture the created cart ID').toEqual(expect.any(Number));
        expect(created.userId).toBe(cart.userId);
        expect(created.products).toEqual(cart.products);

        const updatedPayload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
        updatedPayload.products = cart.products.map((item) => ({
            productId: item.productId,
            quantity: item.quantity + 1,
        }));
        const updateResponse = await request.put(buildUrl(Routes.UPDATE_CART, { id: cartId }), { data: updatedPayload });
        expect(updateResponse.status(), 'Workflow cart update should succeed').toBe(200);
        const updated = await updateResponse.json();
        expect(updated.id).toBe(cartId);
        expect(updated.products[0].quantity).toBe(updatedPayload.products[0].quantity);

        const deleteResponse = await request.delete(buildUrl(Routes.DELETE_CART, { id: cartId }));
        expect(deleteResponse.status(), 'Workflow cart deletion should succeed').toBe(200);
    });
});