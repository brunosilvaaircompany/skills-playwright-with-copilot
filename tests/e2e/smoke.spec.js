import { test, expect } from '@playwright/test';

test('loads the memory game board', async ({ page }) => {
  await page.goto('/?seed=42');

  await expect(page.getByRole('heading', { name: 'Jogo da Memória' })).toBeVisible();
  await expect(page.getByTestId('board')).toBeVisible();
  await expect(page.getByTestId('card')).toHaveCount(8);
  await expect(page.getByTestId('moves')).toHaveText('0');
  await expect(page.getByTestId('timer')).toHaveText('0');
  await expect(page.getByRole('button', { name: 'Reiniciar' })).toBeVisible();
});

test('shows victory after finding all pairs', async ({ page }) => {
  await page.goto('/?seed=42');

  const cards = page.getByTestId('card');
  const values = await cards.evaluateAll((elements) => [
    ...new Set(elements.map((element) => element.dataset.value)),
  ]);

  for (const value of values) {
    const pair = page.locator(`[data-testid="card"][data-value="${value}"]`);
    await pair.nth(0).click();
    await pair.nth(1).click();
    await expect(pair.nth(0)).toHaveAttribute('data-state', 'matched');
    await expect(pair.nth(1)).toHaveAttribute('data-state', 'matched');
  }

  await expect(page.getByTestId('win-message')).toBeVisible();
});
