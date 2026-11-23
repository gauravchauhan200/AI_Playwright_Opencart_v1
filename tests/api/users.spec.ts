import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { buildUrl, expectIdsSorted, USER_ID } from './apiTestHelpers';

dotenv.config();

test.describe('FakeStore Users API Tests', () => {
    test('GET - All users returns a non-empty list @master @sanity @api', async ({ request }) => {
        const response = await request.get(buildUrl(Routes.GET_ALL_USERS));
        expect(response.status(), 'User listing should succeed').toBe(200);
        const users = await response.json();
        expect(Array.isArray(users), 'Users response should be an array').toBeTruthy();
        expect(users.length, 'At least one user should be returned').toBeGreaterThan(0);
        for (const user of users) {
            expect(user.id, 'Each user should have a numeric ID').toEqual(expect.any(Number));
        }
    });

    test('GET - User by ID returns the requested user @master @sanity @api', async ({ request }) => {
        const response = await request.get(buildUrl(Routes.GET_USER_BY_ID, { id: USER_ID }));
        expect(response.status(), 'User lookup should succeed').toBe(200);
        const user = await response.json();
        expect(user.id, 'Returned user ID should match the request').toBe(USER_ID);
    });

    test('GET - Users with limit returns the requested count @master @regression @api', async ({ request }) => {
        const limit = 5;
        const response = await request.get(buildUrl(Routes.GET_USERS_WITH_LIMIT, { limit }));
        expect(response.status(), 'Limited user lookup should succeed').toBe(200);
        const users = await response.json();
        expect(Array.isArray(users), 'Limited users response should be an array').toBeTruthy();
        expect(users.length, 'User count should match the requested limit').toBe(limit);
    });

    for (const direction of ['asc', 'desc'] as const) {
        test(`GET - Users sorted ${direction} by ID @master @regression @api`, async ({ request }) => {
            const response = await request.get(buildUrl(Routes.GET_USERS_SORTED, { order: direction }));
            expect(response.status(), `User ${direction} sort should succeed`).toBe(200);
            const users = await response.json();
            expect(Array.isArray(users), 'Sorted users response should be an array').toBeTruthy();
            expectIdsSorted(users.map((user: { id: number }) => user.id), direction);
        });
    }

    test('POST - Create user returns an ID @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateUserPayload();
        const response = await request.post(buildUrl(Routes.CREATE_USER), { data: payload });
        expect(response.status(), 'User creation should succeed').toBe(201);
        const created = await response.json();
        expect(created.id, 'Created user should have a numeric ID').toEqual(expect.any(Number));
    });

    test('PUT - Update user returns the submitted user fields @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateUserUpdatePayload();
        const response = await request.put(buildUrl(Routes.UPDATE_USER, { id: USER_ID }), { data: payload });
        expect(response.status(), 'User update should succeed').toBe(200);
        const updated = await response.json();
        expect(updated.username).toBe(payload.username);
        expect(updated.email).toBe(payload.email);
        expect(updated.name.firstname).toBe(payload.name.firstname);
        expect(updated.name.lastname).toBe(payload.name.lastname);
    });

    test('DELETE - Delete user succeeds @master @regression @api', async ({ request }) => {
        const response = await request.delete(buildUrl(Routes.DELETE_USER, { id: USER_ID }));
        expect(response.status(), 'User deletion should succeed').toBe(200);
        const deleted = await response.json();
        expect(deleted.id, 'Deleted user response should identify the requested user').toBe(USER_ID);
    });
});