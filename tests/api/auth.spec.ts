import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { buildUrl, USER_ID } from './apiTestHelpers';

dotenv.config();

test.describe('FakeStore Authentication API Tests', () => {
    test('POST - Successful login returns a non-empty token @master @sanity @api', async ({ request }) => {
        const userResponse = await request.get(buildUrl(Routes.GET_USER_BY_ID, { id: USER_ID }));
        expect(userResponse.status(), 'A known FakeStore user should be available').toBe(200);
        const user = await userResponse.json();

        const response = await request.post(buildUrl(Routes.AUTH_LOGIN), {
            data: { username: user.username, password: user.password },
        });
        expect(response.status(), 'Valid credentials should be accepted').toBe(201);

        const body = await response.json();
        expect(typeof body.token, 'The login response should contain a token string').toBe('string');
        expect(body.token.length, 'The token should not be empty').toBeGreaterThan(0);
    });

    test('POST - Invalid login returns the expected error @master @regression @api', async ({ request }) => {
        const response = await request.post(buildUrl(Routes.AUTH_LOGIN), {
            data: RandomDataUtil.generateInvalidLoginPayload(),
        });
        expect(response.status(), 'Invalid credentials should be rejected').toBe(401);
        expect(await response.text(), 'The API should explain why authentication failed').toBe('username or password is incorrect');
    });
});