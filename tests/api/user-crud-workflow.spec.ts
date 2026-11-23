import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { buildUrl } from './apiTestHelpers';

dotenv.config();

test.describe('FakeStore User CRUD Workflow', () => {
    test('WORKFLOW - Create, update, and delete user @master @regression @end-to-end @api', async ({ request }) => {
        const user = RandomDataUtil.generateUserPayload();
        const createResponse = await request.post(buildUrl(Routes.CREATE_USER), { data: user });
        expect(createResponse.status(), 'Workflow user creation should succeed').toBe(201);
        const created = await createResponse.json();
        const userId = created.id as number;
        expect(userId, 'Workflow should capture the created user ID').toEqual(expect.any(Number));

        const updatedPayload = RandomDataUtil.generateUserUpdatePayload();
        const updateResponse = await request.put(buildUrl(Routes.UPDATE_USER, { id: userId }), { data: updatedPayload });
        expect(updateResponse.status(), 'Workflow user update should succeed').toBe(200);
        const updated = await updateResponse.json();
        expect(updated.username).toBe(updatedPayload.username);
        expect(updated.email).toBe(updatedPayload.email);

        const deleteResponse = await request.delete(buildUrl(Routes.DELETE_USER, { id: userId }));
        expect(deleteResponse.status(), 'Workflow user deletion should succeed').toBe(200);
    });
});