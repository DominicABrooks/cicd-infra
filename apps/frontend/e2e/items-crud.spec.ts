import { test } from '@playwright/test';
import { mockSupabaseAuth } from './auth-helper';
import { ItemsPage } from './pages/ItemsPage';

/**
 * FULL-STACK E2E TEST (Refactored to Page Object Model)
 * 
 * Verifies the full CRUD flow using the real backend and database.
 */
test.describe('Full-Stack Items Flow', () => {
  let itemsPage: ItemsPage;
  const uniqueItemName = `Flow-Item-${Date.now()}`;
  const updatedItemName = `${uniqueItemName}-Updated`;

  test.beforeEach(async ({ page }) => {
    // 1. Setup mocks and capture errors
    await mockSupabaseAuth(page);
    page.on('console', msg => {
      if (msg.type() === 'error') console.log(`BROWSER ERROR: ${msg.text()}`);
    });

    // 2. Initialize Page Object
    itemsPage = new ItemsPage(page);
    await itemsPage.goto();
  });

  test('user should be able to manage items from creation to deletion', async () => {
    // CREATE FLOW
    await itemsPage.createItem(uniqueItemName, 'Page Object Model Test');
    await itemsPage.expectItemVisible(uniqueItemName, 'Page Object Model Test');

    // UPDATE FLOW
    await itemsPage.updateItem(uniqueItemName, updatedItemName);
    await itemsPage.expectItemVisible(updatedItemName);

    // DELETE FLOW
    await itemsPage.deleteItem(updatedItemName);
    await itemsPage.expectItemNotVisible(updatedItemName);
  });
});
