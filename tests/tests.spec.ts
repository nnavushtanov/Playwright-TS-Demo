import { test, expect, chromium } from '@playwright/test';

// Adblocker initialization
const adBlockPattern = /doubleclick\.net|googlesyndication\.com|googleadservices\.com|adsystem\.com|amazon-adsystem\.com|criteo\.com|outbrain\.com|taboola\.com|popads\.net/;

const name = 'Playwright testuser'
const email = 'playwright@testuserbg.com';
const password = 'testuserpassword';

const name1 = 'Playwright immortal'
const email1 = 'immortal@testuserbg.com';
const password1 = 'testuserpassword';

test.beforeEach(async ({ page }) => {
  await page.route(adBlockPattern, route => route.abort());
});

test('Register user', async ({ page }) => {
  await page.goto('https://automationexercise.com/');

  //Assert that we are on the home page
  await expect(page).toHaveTitle('Automation Exercise');

  await page.getByRole('link', { name: ' Signup / Login' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill(name);
  await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(email);
  await page.getByRole('button', { name: 'Signup' }).click();
  await page.getByRole('radio', { name: 'Mr.' }).check();
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

test('Login with registered user', async ({ page }) => {
  await page.goto('https://automationexercise.com/');
  await page.getByRole('link', { name: ' Signup / Login' }).click();
  await page.getByRole('textbox', { name: 'Name' }).fill(name);
  await page.locator('form').filter({ hasText: 'Signup' }).getByPlaceholder('Email Address').fill(email);
  await page.getByRole('button', { name: 'Signup' }).click();

  // Assert that the user already exists and message is visible
  await expect(page.getByText('Email Address already exist!')).toBeVisible();
  await expect(page.getByText('Email Address already exist!')).toHaveText('Email Address already exist!');
  
});

test('Buy products from different categories and check their quantity and total price', async ({ page }) => {
  await page.goto('https://automationexercise.com/');
  loginUser(page, email1, password1);
  await page.locator('img[src="/get_product_picture/1"]').hover();
  await page.getByText('Add to cart').nth(1).click();
  await page.getByRole('button', { name: 'Continue Shopping' }).click();
  await page.locator('img[src="/get_product_picture/2"]').hover();
  await page.getByText('Add to cart').nth(3).click();
  await page.getByRole('button', { name: 'Continue Shopping' }).click();
  await page.locator('img[src="/get_product_picture/3"]').hover();
  await page.getByText('Add to cart').nth(5).click();
  await page.getByRole('button', { name: 'Continue Shopping' }).click();
  await page.getByRole('link', { name: ' Kids' }).click();
  await page.getByRole('link', { name: 'Dress' }).click();
  await page.locator('img[src="/get_product_picture/16"]').hover();
  await page.getByRole('link', { name: ' Add to cart' }).nth(1).click();
  await page.getByRole('button', { name: 'Continue Shopping' }).click();
  await page.getByRole('heading', { name: ' Kids' }).click();
  await page.getByRole('link', { name: ' Kids' }).click();
  await page.getByRole('link', { name: 'Tops & Shirts' }).click();
  await page.locator('img[src="/get_product_picture/11"]').hover();
  await page.getByRole('link', { name: ' Add to cart' }).nth(1).click();
  await page.getByRole('link', { name: 'View Cart' }).click();

  const quantity = await page.locator('table tbody tr td:nth-child(4)').allTextContents();

    //  Assert that the quantity of each product is correct
      for (let i = 0; i < quantity.length; i++) {
        await expect(quantity[i].trim()).toBe('1');
      }
  
  await page.getByText('Proceed To Checkout').click();

  const productPrice = await page.locator('table tbody tr td:nth-child(5)').allTextContents();
  let sumOfProducts:number = 0;
  let total = await page.locator('p[class="cart_total_price"]').last().textContent();

  await page.waitForLoadState('networkidle');
  for (let i = 0; i < productPrice.length; i++) {
    const price = parseInt(productPrice[i].trim().replace('Rs. ', ''));
    sumOfProducts += price;
  }
  const totalPrice = parseInt(total?.trim().replace('Rs. ', '') || '0  ');

  // Assert that the total price is correct
  expect(sumOfProducts).toBe(totalPrice);

  await page.getByRole('link', { name: 'Place Order' }).click();

  enterCardDetails(page);

  // Assert that the order was placed successfully
  await expect(page.getByText('Congratulations! Your order has been confirmed!')).toBeVisible();
  await expect(page.getByText('Congratulations! Your order has been confirmed!')).toHaveText('Congratulations! Your order has been confirmed!');
});

test('Buy product', async ({ page }) => {
  await loginUser(page, email1, password1);
  await page.getByRole('link', { name: ' Products' }).click();
  await page.getByRole('link', { name: ' View Product' }).first().click();
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: ' Add to cart' }).click();
  await page.waitForLoadState('networkidle');
  await page.getByRole('link', { name: 'View Cart' }).click();
  await page.getByText('Proceed To Checkout').click();
  await page.getByRole('link', { name: 'Place Order' }).click();
  await enterCardDetails(page);
  
  // Assert that the order was placed successfully
  await expect(page.getByText('Congratulations! Your order has been confirmed!')).toBeVisible();
  await expect(page.getByText('Congratulations! Your order has been confirmed!')).toHaveText('Congratulations! Your order has been confirmed!');
  
  await page.getByRole('link', { name: 'Continue' }).click();
});

test('Delete user', async ({ page }) => {
  await loginUser(page, email, password);
  await page.getByRole('link', { name: ' Delete Account' }).click();

  // Assert that we are on the account deleted page
  await expect(page.locator('h2[data-qa="account-deleted"]')).toBeVisible();
  await page.getByRole('link', { name: 'Continue' }).click();

  await loginUser(page, email, password);

  // Assert that the user is deleted succesfully
  await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
  await expect(page.getByText('Your email or password is incorrect!')).toHaveText('Your email or password is incorrect!');
});

function loginUser(page:any , email:string, password:string) {
  return page.goto('https://automationexercise.com/login')
    .then(() => page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address').fill(email))
    .then(() => page.getByRole('textbox', { name: 'Password' }).fill(password))
    .then(() => page.getByRole('button', { name: 'Login' }).click());
}

function enterCardDetails(page:any) {
  return page.locator('input[name="name_on_card"]').fill('Playwright User')
    .then(() => page.locator('input[name="card_number"]').fill('1234123412341234'))
    .then(() => page.getByRole('textbox', { name: 'ex.' }).fill('234'))
    .then(() => page.getByRole('textbox', { name: 'MM' }).fill('12'))
    .then(() => page.getByRole('textbox', { name: 'YYYY' }).fill('2012'))
    .then(() => page.getByRole('button', { name: 'Pay and Confirm Order' }).click());
}
