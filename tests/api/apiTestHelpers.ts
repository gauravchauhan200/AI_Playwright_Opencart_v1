import { expect } from '@playwright/test';
import { Routes } from '../../api/endpoints/routes';

export const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
export const PRODUCT_ID = 1;
export const USER_ID = 1;
export const CART_ID = 1;

export function buildUrl(route: string, values: Record<string, string | number> = {}): string {
    const path = Object.entries(values).reduce(
        (currentRoute, [key, value]) => currentRoute.replace(`{${key}}`, encodeURIComponent(String(value))),
        route,
    );

    return `${BASE_URL}${path}`;
}

export function expectIdsSorted(ids: number[], direction: 'asc' | 'desc'): void {
    const multiplier = direction === 'asc' ? 1 : -1;
    const sortedIds = [...ids].sort((left, right) => multiplier * (left - right));
    expect(ids, `IDs should be in ${direction === 'asc' ? 'ascending' : 'descending'} order`).toEqual(sortedIds);
}