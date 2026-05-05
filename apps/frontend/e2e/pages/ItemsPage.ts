import { Page, Locator, expect } from '@playwright/test';

export class ItemsPage {
  readonly page: Page;
  readonly addItemButton: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly createButton: Locator;
  readonly itemCard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addItemButton = page.getByRole('button', { name: 'Add Item' });
    this.nameInput = page.getByPlaceholder('Item Name');
    this.descriptionInput = page.getByPlaceholder('Description (optional)');
    this.createButton = page.getByRole('button', { name: 'Create Item' });
    this.itemCard = page.getByTestId('item-card');
  }

  async goto() {
    await this.page.goto('/');
    // Wait for initial load
    await expect(this.page.getByRole('heading', { name: 'Your Items' }).first()).toBeVisible();
  }

  async createItem(name: string, description: string) {
    await this.addItemButton.click();
    await this.nameInput.fill(name);
    await this.descriptionInput.fill(description);
    await this.createButton.click();
  }

  async updateItem(oldName: string, newName: string) {
    const card = this.itemCard.filter({ hasText: oldName }).first();
    await card.getByRole('button', { name: 'Edit item' }).click();
    
    // Switch to the edit view within the card
    const editCard = this.itemCard.filter({ has: this.page.getByLabel('Edit item name') }).first();
    await editCard.getByLabel('Edit item name').fill(newName);
    await editCard.getByRole('button', { name: 'Save changes' }).click();
  }

  async deleteItem(name: string) {
    const card = this.itemCard.filter({ hasText: name }).first();
    
    // Handle the confirmation dialog
    this.page.on('dialog', dialog => dialog.accept());
    await card.getByRole('button', { name: 'Delete item' }).click();
  }

  async expectItemVisible(name: string, description?: string) {
    const card = this.itemCard.filter({ hasText: name }).first();
    await expect(card).toBeVisible();
    if (description) {
      await expect(card.getByText(description)).toBeVisible();
    }
  }

  async expectItemNotVisible(name: string) {
    await expect(this.page.getByText(name)).not.toBeVisible();
  }
}
