import { expect, test } from '@playwright/test';

import { getCurrentRoute, navigateTo, setLanguage, waitForAngular } from './helpers/app.helpers';
import { getBrandButtonTexts, getPageTitle, goToBrandSelection } from './helpers/booking.helpers';

/**
 * REQ-002: Markenauswahl (Brand Selection)
 * Wizard Step 1: User selects a vehicle brand
 *
 * Test Cases from requirement.md Section 13:
 * - TC-1: Happy Path — 5 brands displayed
 * - TC-2: Brand selection → navigation to location
 */

test.describe('REQ-002: Brand Selection', () => {

  // --- Main Flow (Section 4) ---

  test.describe('Main Flow', () => {

    test('TC-1: should display 5 brand buttons', async ({ page }) => {
      await goToBrandSelection(page);

      const brands = await getBrandButtonTexts(page);
      expect(brands).toHaveLength(5);
      expect(brands).toEqual(
        expect.arrayContaining(['Audi', 'BMW', 'Mercedes-Benz', 'MINI', 'Volkswagen'])
      );
    });

    test('TC-2: should navigate to location page after brand selection', async ({ page }) => {
      await goToBrandSelection(page);

      const audiButton = page.locator('button', { hasText: 'Audi' });
      await audiButton.click();
      await waitForAngular(page);

      const route = await getCurrentRoute(page);
      expect(route).toBe('/home/location');
    });

    test('should show correct DE title', async ({ page }) => {
      await goToBrandSelection(page);
      await setLanguage(page, 'de');

      const title = await getPageTitle(page);
      expect(title).toBe('Welche Fahrzeugmarke fahren Sie?');
    });

  });

  // --- i18n (Language Switch) ---

  test.describe('i18n', () => {

    test('should show EN title after language switch', async ({ page }) => {
      await goToBrandSelection(page);
      await setLanguage(page, 'en');

      const title = await getPageTitle(page);
      expect(title).toBe('What vehicle brand do you drive?');
    });

    test('should show DE title after switching back', async ({ page }) => {
      await goToBrandSelection(page);
      await setLanguage(page, 'en');
      await setLanguage(page, 'de');

      const title = await getPageTitle(page);
      expect(title).toBe('Welche Fahrzeugmarke fahren Sie?');
    });

  });

  // --- Accessibility ---

  test.describe('Accessibility', () => {

    test('should have accessible brand buttons with role group', async ({ page }) => {
      await goToBrandSelection(page);

      const group = page.locator('[role="group"]');
      await expect(group).toBeVisible();
    });

    test('all brand buttons should be keyboard accessible', async ({ page }) => {
      await goToBrandSelection(page);

      // Tab through all brand buttons
      const buttons = page.locator('.brand-grid__button, [class*="brand"] button');
      const count = await buttons.count();
      expect(count).toBeGreaterThanOrEqual(5);

      // First button should be focusable
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      await expect(focused).toBeVisible();
    });

  });

  // --- Default Route ---

  test('should redirect to brand page from root', async ({ page }) => {
    await navigateTo(page, '/home');
    await waitForAngular(page);

    const route = await getCurrentRoute(page);
    expect(route).toBe('/home/brand');
  });

});
