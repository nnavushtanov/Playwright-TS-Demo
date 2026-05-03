import { test, expect, chromium } from '@playwright/test';

// Adblocker initialization
const adBlockPattern = /doubleclick\.net|googlesyndication\.com|googleadservices\.com|adsystem\.com|amazon-adsystem\.com|criteo\.com|outbrain\.com|taboola\.com|popads\.net/;

const email = 'playwright@testuserbg.com';
const password = 'testuserpassword';

test.beforeEach(async ({ page }) => {
  await page.route(adBlockPattern, route => route.abort());
});

test('Register user', async ({ page }) => {
  await page.goto('https://automationexercise.com/');

  //Assert that we are on the home page
  await expect(page).toHaveTitle('Automation Exercise');

  await page.getByRole('link', { name: ' Signup / Login' }).click();
  await page.getByRole('textbox', { name: 'Name' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill('Playwright testuser');
  await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(email);
  await page.getByRole('button', { name: 'Signup' }).click();
  await page.getByRole('radio', { name: 'Mr.' }).check();
  await page.getByRole('textbox', { name: 'Password *' }).click();
  await page.getByRole('textbox', { name: 'Password *' }).fill(password);
  await page.locator('#days').selectOption('10');
  await page.locator('#months').selectOption('10');
  await page.locator('#years').selectOption('2010');
  await page.getByRole('checkbox', { name: 'Sign up for our newsletter!' }).check();
  await page.getByRole('checkbox', { name: 'Receive special offers from' }).check();
  await page.getByRole('textbox', { name: 'First name *' }).fill('Playwright');
  await page.getByRole('textbox', { name: 'Last name *' }).fill('Testuser');
  await page.getByRole('textbox', { name: 'Address * (Street address, P.' }).fill('address 1');
  await page.getByLabel('Country *').selectOption('United States');
  await page.getByRole('textbox', { name: 'State *' }).fill('California');
  await page.getByRole('textbox', { name: 'City * Zipcode *' }).fill('Los Angeles');
  await page.locator('#zipcode').fill('1234');
  await page.getByRole('textbox', { name: 'Mobile Number *' }).fill('12345');
  await page.getByRole('button', { name: 'Create Account' }).click();
  
  // Assert that the account was created successfully
  await expect(page).toHaveTitle('Automation Exercise - Account Created');

  await expect(page.locator('h2[data-qa="account-created"]')).toBeVisible();
  await page.getByRole('link', { name: 'Continue' }).click();
});


test('Delete user', async ({ page }) => {
  loginUser(page, email, password);
  
  // // Assert that we are on the login page
  await expect(page).toHaveTitle('Automation Exercise - Signup / Login');

  await page.getByRole('link', { name: ' Delete Account' }).click();

  // Assert that the account was deleted successfully
  await expect(page.locator('h2[data-qa="account-deleted"]')).toBeVisible();
  await page.getByRole('link', { name: 'Continue' }).click();
});

function loginUser(page:any , email:string, password:string) {
  return page.goto('https://automationexercise.com/login')
    .then(() => page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(email))
    .then(() => page.getByRole('textbox', { name: 'Password' }).fill(password))
    .then(() => page.getByRole('button', { name: 'Login' }).click());
}
