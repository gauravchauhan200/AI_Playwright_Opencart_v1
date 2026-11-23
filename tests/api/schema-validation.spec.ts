import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import dotenv from 'dotenv';
import { join } from 'path';
import { Routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';
import { buildUrl, CART_ID, PRODUCT_ID, USER_ID } from './apiTestHelpers';

dotenv.config();

const ajv = new Ajv();

test.describe('FakeStore API Schema Validation', () => {
    test('GET - Product response matches its JSON schema @master @regression @api', async ({ request }) => {
        const response = await request.get(buildUrl(Routes.GET_PRODUCT_BY_ID, { id: PRODUCT_ID }));
        expect(response.status(), 'Product lookup for schema validation should succeed').toBe(200);
        const product = await response.json();
        const schema = DataProvider.readJson(join(__dirname, '../../api/schemas/product_api_schema.json'));
        const validate = ajv.compile(schema);
        expect(validate(product), `Product schema validation failed: ${ajv.errorsText(validate.errors)}`).toBeTruthy();
    });

    test('GET - User response matches its JSON schema @master @regression @api', async ({ request }) => {
        const response = await request.get(buildUrl(Routes.GET_USER_BY_ID, { id: USER_ID }));
        expect(response.status(), 'User lookup for schema validation should succeed').toBe(200);
        const user = await response.json();
        const schema = DataProvider.readJson(join(__dirname, '../../api/schemas/user_api_schema.json'));
        const validate = ajv.compile(schema);
        expect(validate(user), `User schema validation failed: ${ajv.errorsText(validate.errors)}`).toBeTruthy();
    });

    test('GET - Cart response matches its JSON schema @master @regression @api', async ({ request }) => {
        const response = await request.get(buildUrl(Routes.GET_CART_BY_ID, { id: CART_ID }));
        expect(response.status(), 'Cart lookup for schema validation should succeed').toBe(200);
        const cart = await response.json();
        const schema = DataProvider.readJson(join(__dirname, '../../api/schemas/cart_api_schema.json'));
        const validate = ajv.compile(schema);
        expect(validate(cart), `Cart schema validation failed: ${ajv.errorsText(validate.errors)}`).toBeTruthy();
    });
});