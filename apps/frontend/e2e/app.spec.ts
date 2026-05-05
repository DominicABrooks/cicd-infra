import { test, expect } from '@playwright/test';
import { mockSupabaseAuth } from './auth-helper';

test.describe('Authentication Flow', () => {
  test('renders login screen by default', async ({ page }) => {
    await page.goto('/');
    
    // Check for the premium welcome text
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    await expect(page.getByText('Enter your credentials to continue')).toBeVisible();
  });

  test('can toggle to sign up screen', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Don\'t have an account? Sign Up');
    
    await expect(page.getByRole('heading', { name: 'Create an account' })).toBeVisible();
  });
});

test.describe('Items Management (Authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the auth session before going to the page
    await mockSupabaseAuth(page);
    
    // Mock the items API call
    await page.route('**/api/items', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            name: 'E2E Test Item',
            description: 'Created by Playwright',
            user_id: 'mock-user-id',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ]),
      });
    });

    await page.goto('/');
    // Wait for the loading spinner to disappear if it exists
    const loader = page.locator('.animate-spin');
    await expect(loader).not.toBeVisible();
  });

  test('displays items list when authenticated', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Your Items' }).first()).toBeVisible();
    await expect(page.getByText('E2E Test Item').first()).toBeVisible();
  });

  test('can open the add item form', async ({ page }) => {
    await page.click('text=Add Item');
    await expect(page.getByPlaceholder('Item Name')).toBeVisible();
    await expect(page.getByPlaceholder('Description (optional)')).toBeVisible();
  });
});