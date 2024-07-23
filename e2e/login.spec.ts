import { test, expect } from '@playwright/test'

// See here how to get started:
// https://playwright.dev/docs/intro
test('should log in', async ({ page }) => {
  await page.goto('/')

  const usernameField = page.getByPlaceholder('Username')
  await usernameField.click()
  await usernameField.fill('Brian')
  await usernameField.press('Enter')
  await expect(page.getByText('Logged in as:')).toHaveText('Logged in as: brian')
})

test('should stay logged in', async ({ page }) => {
  await page.goto('/')

  const usernameField = page.getByPlaceholder('Username')
  await usernameField.click()
  await usernameField.fill('Brian')
  await usernameField.press('Enter')
  await expect(page.getByText('Logged in as:')).toHaveText('Logged in as: brian')

  await page.reload()
  await expect(page.getByText('Logged in as:')).toHaveText('Logged in as: brian')
})

test('should log out', async ({ page }) => {
  await page.goto('/')

  const usernameField = page.getByPlaceholder('Username')
  await usernameField.click()
  await usernameField.fill('Brian')
  await usernameField.press('Enter')
  await expect(page.getByText('Logged in as:')).toHaveText('Logged in as: brian')

  await page.getByRole('button', { name: 'Log out' }).click()

  await expect(page.getByText('Logged in as:')).toHaveCount(0)
})
