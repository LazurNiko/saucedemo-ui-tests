import { test, expect } from "@playwright/test";
const { LoginPage } = require('../pageobjects/loginPage');

let loginPage;

test.beforeEach(async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.goto();
  await expect(page).toHaveURL('https://www.saucedemo.com/');
});

test('Should contain logo and login form with with username, password fields and submit button', async ({ page }) => {
  loginPage.loginLogo();
  loginPage.loginImg();
  loginPage.loginBtn();
  loginPage.usernameAndPasswordFields();
  await expect(loginPage.usernameList).toHaveText(
    `Accepted usernames are:standard_userlocked_out_userproblem_userperformance_glitch_user`);
  await expect(loginPage.passwordList).toHaveText('Password for all users:secret_sauce');
  await page.screenshot({ path: 'loginPage.png' });
});

test('Should able to login with accepted credentials', async({ page }) => {
  loginPage.login('standard_user', 'secret_sauce');
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  page.waitForLoadState();
  await page.screenshot({ path: 'inventoryPage.png' });
});

test('Should not be able to login with not existing username & existing password- page shows error message', async({ page }) => {
  loginPage.login('new_user', 'secret_sauce');
  await expect(loginPage.error).toHaveText('Epic sadface: Username and password do not match any user in this service');
  console.log(await page.locator('.error-message-container.error').textContent());
  await expect(loginPage.error).toHaveCSS('background-color', 'rgb(226, 35, 26)');
  await page.screenshot({ path: 'notValidUsername.png', fullPage: true });
});

test('Should not be able to login with not existing password & existing username - page shows error message', async({ page }) => {
  loginPage.login('standard_user', 'password');
  await expect(loginPage.error).toHaveText('Epic sadface: Username and password do not match any user in this service')
  await expect(loginPage.error).toHaveCSS('background-color', 'rgb(226, 35, 26)');
  await page.screenshot({ path: 'notValidPassword.png', fullPage: true });
});

test('Should not be able to login with blank password field & existing username - page shows error message', async({ page }) => {
  loginPage.loginWithBlankPasswordField('standard_user');
  await expect(loginPage.error).toHaveText('Epic sadface: Password is required')
  await expect(loginPage.error).toHaveCSS('background-color', 'rgb(226, 35, 26)');
  await page.locator('.error-message-container.error').screenshot({ path: 'errorBlankPassword.png' });
});

test('Should not be able to login with blank username field & existing password- page shows error message', async({ page }) => {
  loginPage.loginWithBlankUsernameField('secret_sauce');
  await expect(loginPage.error).toHaveText('Epic sadface: Username is required');
  await expect(loginPage.error).toHaveCSS('background-color', 'rgb(226, 35, 26)');
  await page.locator('.error-message-container.error').screenshot({ path: 'errorBlankUsername.png' });
});
