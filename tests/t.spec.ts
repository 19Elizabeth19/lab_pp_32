import { test, expect, FrameLocator } from '@playwright/test';
import { BrowserContext, Page } from '@playwright/test';

let context: BrowserContext;
let page: Page;


test.describe('Тесты', () => {
  test.beforeEach('Установление сессии под админом', async ({ browser }) => {
    if (context) {
        page = await context.newPage();  
        await page.goto('http://localhost:3000'); 
        return; 
    }

    context = await browser.newContext();
    page = await context.newPage();
    await context.clearCookies();

    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/Create T3 App/);
    await page.getByRole('link', { name: 'Si' }).click();
    const newTodo = page.getByPlaceholder('');
    await newTodo.fill('ern@example.com');
    await page.getByRole('button', { name: 'Si' }).click();
    
    await page.goto('http://localhost:1080');
    await page.getByRole('cell', { name: '<ern@example.com>' }).nth(0).click();
    const iframeLocator = page.frameLocator('iframe[src*="messages/"]');
    const signInLinkLocator = iframeLocator.locator('a:has-text("Sign in")');
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      signInLinkLocator.click({ modifiers: [process.platform === 'darwin' ? 'Meta' : 'Control'] }),
    ]);
    await newPage.waitForLoadState();
    await page.close();
    page = newPage;
  });


  test('Группы', async ({ }) => { 
    await expect(page.getByRole('heading', { name: 'ADMIN' })).toBeVisible();
    await page.getByRole('link', { name: 'Группы' }).click();
    await expect(page.getByRole('heading', { name: 'Group page' })).toBeVisible();

    await page.getByRole('group').locator('svg').click();
    await page.locator('input[name="name"]').fill('Группа 23');
    await page.getByRole('button', { name: 'Добавить' }).click();
    // await page.waitForTimeout(8000);
    // await page.getByText('2').click();
    // await page.waitForTimeout(8000);
    await page.getByRole('cell', { name: '22з' }).getByPlaceholder('Имя группы').click()
    await page.getByRole('cell', { name: '22з' }).getByPlaceholder('Имя группы').fill('Группа 1111');
    
    console.log("Тест 'Группы' выполнен");
  });

  test('Пользователи', async ({ }) => { 
    //await expect(page.getByRole('heading', { name: 'ADMIN' })).toBeVisible();
    await page.getByRole('link', { name: 'Пользователи' }).click();
    await expect(page.getByRole('heading', { name: 'User page' })).toBeVisible();
    await page.waitForTimeout(2000);
    // await page.waitForTimeout(8000);
    await page.getByText('2').click();
    await page.waitForTimeout(5000);
    await page.getByText('1').click();
    await page.waitForTimeout(5000);
    await page.getByRole('row', { name: 'Iva Kto xxx@xxx.com' }).getByRole('link').click();
    await page.waitForTimeout(2000);
    await page.locator('input[name="surname"]').click();
    await page.locator('input[name="surname"]').fill('FF');
    //await page.waitForTimeout(8000);
    //await page.locator('input[name="surname"]').fill('a');
    await page.waitForTimeout(2000);
    await page.getByRole('combobox').click();
    await page.getByRole('button', { name: 'Обновить' }).click();
    //await page.waitForTimeout(10000);
    //await expect(page.getByRole('heading', { name: 'User page' })).toBeVisible();

    console.log("Пользователи тест выполнен");
  });

  test('Задачи', async ({ }) => { 
    await page.getByRole('link', { name: 'Задачи' }).click();
    await page.getByText('2').click();
    await page.waitForTimeout(5000);
    //await page.getByText('1').click();
    //await page.waitForTimeout(5000);

    // await page.getByRole('group').locator('path').click();
    // await page.getByRole('textbox').fill('Лекция 14');
    // await page.getByRole('button', { name: 'Добавить' }).click();
    // await page.waitForTimeout(5000);
    // await page.getByRole('row', { name: 'Лекция' }).getByRole('link').click();

    console.log("Задачи тест выполнен");
  });
});