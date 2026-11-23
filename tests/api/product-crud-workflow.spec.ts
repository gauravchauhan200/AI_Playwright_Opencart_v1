import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { buildUrl } from './apiTestHelpers';

dotenv.config();

test.describe('FakeStore Product CRUD Workflow', () => {
    test('WORKFLOW - Create, update, and delete product @master @regression @end-to-end @api', async ({ request }) => {
        const product = RandomDataUtil.generateProductPayload();
        const createResponse = await request.post(buildUrl(Routes.CREATE_PRODUCT), { data: product });
        expect(createResponse.status(), 'Workflow product creation should succeed').toBe(201);
        const created = await createResponse.json();
        const productId = created.id as number;
        expect(productId, 'Workflow should capture the created product ID').toEqual(expect.any(Number));

        const updatedPayload = RandomDataUtil.generateUpdatedProductPayload();
        const updateResponse = await request.put(buildUrl(Routes.UPDATE_PRODUCT, { id: productId }), { data: updatedPayload });
        expect(updateResponse.status(), 'Workflow product update should succeed').toBe(200);
        const updated = await updateResponse.json();
        expect(updated.id).toBe(productId);
        expect(updated.title).toBe(updatedPayload.title);
        expect(updated.price).toBe(updatedPayload.price);

        const deleteResponse = await request.delete(buildUrl(Routes.DELETE_PRODUCT, { id: productId }));
        expect(deleteResponse.status(), 'Workflow product deletion should succeed').toBe(200);
    });
});