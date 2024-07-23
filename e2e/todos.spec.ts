import { test as base, expect, Locator, Page } from '@playwright/test';

class TodoPage {
  readonly randomUsername = crypto.randomUUID();

  readonly usernameField: Locator;
  readonly todoItems: Locator;
  readonly todoField: Locator;
  readonly editField: Locator;

  constructor(readonly page: Page) {
    this.usernameField = page.getByPlaceholder('Username');
    this.todoItems = page.locator('article');
    this.todoField = page.getByPlaceholder('Add todo');
    this.editField = page.getByPlaceholder('Edit todo');
  }

  async open() {
    await this.page.goto('/');
  }

  async loginAs(name: string) {
    await this.usernameField.click();
    await this.usernameField.fill(name);
    await this.usernameField.press('Enter');
  }

  async loginAsNewUser() {
    await this.loginAs(this.randomUsername);
  }

  async addTodo(label: string) {
    await this.todoField.fill(label);
    await this.todoField.press('Enter');
  }

  async removeAll() {
    while ((await this.todoItems.count()) > 0) {
      const count = await this.todoItems.count();
      await this.todoItems.first().getByRole('button', { name: 'Delete todo' }).click();
      await expect(this.todoItems).toHaveCount(count - 1);
    }
  }
}

const test = base.extend<{ todoPage: TodoPage }>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.open();
    await todoPage.loginAsNewUser();
    await use(todoPage);
    await todoPage.removeAll();
  },
});

test('should add a todo', async ({ todoPage }) => {
  await todoPage.addTodo('Task 123');

  await expect(todoPage.todoItems.last()).toContainText('Task 123');
});

test('should add two todos', async ({ todoPage }) => {
  await test.step('Add todos', async () => {
    await todoPage.addTodo('Task 123');
    await todoPage.addTodo('Another task');
  });

  await expect(todoPage.todoItems).toContainText(['Task 123', 'Another task']);
});

test('should edit a todo', async ({ todoPage }) => {
  await test.step('Add todos', async () => {
    await todoPage.addTodo('Task 123');
    await todoPage.addTodo('Another task');
    await todoPage.addTodo('Final task');
  });

  const secondTodo = todoPage.todoItems.nth(1);
  await expect(secondTodo).not.toContainText('edited');
  expect(todoPage.editField).not.toBeVisible();

  await secondTodo.getByRole('button', { name: 'Edit todo' }).click();
  expect(todoPage.editField).toBeVisible();

  await todoPage.editField.fill('New description');
  await todoPage.editField.press('Enter');

  await expect(secondTodo).toContainText('edited');
  expect(todoPage.editField).not.toBeVisible();
});

test('should complete a todo', async ({ todoPage }) => {
  await test.step('Add todos', async () => {
    await todoPage.addTodo('Task 123');
    await todoPage.addTodo('Another task');
    await todoPage.addTodo('Final task');
  });

  const thirdTodo = todoPage.todoItems.last();
  await expect(thirdTodo).not.toContainText('completed');

  await thirdTodo.getByRole('button', { name: 'Mark as complete' }).click();

  await expect(thirdTodo).toContainText('completed');

  await thirdTodo.getByRole('button', { name: 'Mark as incomplete' }).click();

  await expect(thirdTodo).not.toContainText('completed');
});

test('should show the correct time', async ({ page, todoPage }) => {
  await page.clock.install();

  await todoPage.addTodo('Test 123');
  await expect(todoPage.todoItems.first()).toContainText('created just now');

  await page.clock.fastForward('00:45');
  await expect.soft(todoPage.todoItems.first()).toContainText('created less than a minute ago');

  await page.clock.fastForward('00:30');
  await expect.soft(todoPage.todoItems.first()).toContainText('created 1 minute ago');

  await page.clock.fastForward('30:00');
  await expect.soft(todoPage.todoItems.first()).toContainText('created 31 minutes ago');

  await page.clock.fastForward('02:00:00');
  await expect.soft(todoPage.todoItems.first()).toContainText('created 2 hours ago');
});
