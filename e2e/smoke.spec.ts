import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/COMAM/i);
});

test('health endpoint responds', async ({ request }) => {
  const response = await request.get('/api/health');
  expect(response.ok() || response.status() === 503).toBeTruthy();
  const body = await response.json();
  expect(body.service).toBe('comam-web');
});
