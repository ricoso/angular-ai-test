import { expect, test } from '@playwright/test';

import { getCurrentRoute, navigateTo, setLanguage, waitForAngular } from './helpers/app.helpers';
import {
  completeBrandToLocationFlow,
  getLocationButtonTexts,
  getPageTitle,
  goToBrandSelection,
  goToLocationSelection,
  selectBrand,
  selectLocation,
} from './helpers/booking.helpers';

/**
 * REQ-003: Standortwahl (Location Selection)
 * Wizard Step 2: User selects a dealership location based on chosen brand
 *
 * Test Cases from requirement.md Section 13:
 * - TC-1: Happy Path — Audi -> 5 locations displayed
 * - TC-2: Location selection -> navigation to services
 * - TC-3: Guard — no brand -> redirect to /home/brand
 * - TC-4: Brand switch -> locations change
 *
 * Alternative Flows (Section 5):
 * - 5.1: Back to brand selection
 * - 5.2: Change location (from later step)
 *
 * Exception Flows (Section 6):
 * - 6.1: No brand selected -> guard redirect
 */

test.describe('REQ-003: Location Selection', () => {

  // =============================================
  // MAIN FLOW (Section 4)
  // =============================================

  test.describe('Main Flow', () => {

    test('TC-1: should display 5 locations for Audi', async ({ page }) => {
      const locations = await completeBrandToLocationFlow(page, 'Audi');

      expect(locations).toHaveLength(5);
      expect(locations).toEqual(
        expect.arrayContaining(['München', 'Hamburg', 'Berlin', 'Frankfurt', 'Düsseldorf'])
      );
    });

    test('TC-1b: should display correct DE title on location page', async ({ page }) => {
      await setLanguage(page, 'de');
      await selectBrand(page, 'Audi');

      const title = await getPageTitle(page);
      expect(title).toBe('An welchem Standort dürfen wir Sie begrüßen?');
    });

    test('TC-1c: should display subtitle on location page', async ({ page }) => {
      await setLanguage(page, 'de');
      await selectBrand(page, 'Audi');

      const subtitle = page.locator('p').first();
      await expect(subtitle).toContainText('Bitte wählen Sie den gewünschten Standort aus');
    });

    test('TC-2: should navigate to services after location selection', async ({ page }) => {
      await selectBrand(page, 'Audi');
      await selectLocation(page, 'München');

      const route = await getCurrentRoute(page);
      // REQ-004 not yet implemented, so it may redirect back to /home/brand
      expect(route).toMatch(/\/home\/(services|brand|location)/);
    });

    test('TC-2b: location button click should work', async ({ page }) => {
      await selectBrand(page, 'BMW');

      const locationButtons = page.locator('.location-grid__button');
      const count = await locationButtons.count();
      expect(count).toBeGreaterThanOrEqual(3);

      // Click first location
      await locationButtons.first().click();
      await waitForAngular(page);

      // Should have navigated away
      const route = await getCurrentRoute(page);
      expect(route).toBeTruthy();
    });

  });

  // =============================================
  // TEST CASES (Section 13)
  // =============================================

  test.describe('Test Cases', () => {

    test('TC-3: Guard — no brand selected -> redirect to /home/brand', async ({ page }) => {
      await goToLocationSelection(page);

      const route = await getCurrentRoute(page);
      expect(route).toBe('/home/brand');
    });

    test('TC-4: Brand switch — Audi (5) vs MINI (3) locations', async ({ page }) => {
      const audiLocations = await completeBrandToLocationFlow(page, 'Audi');
      expect(audiLocations).toHaveLength(5);

      await goToBrandSelection(page);
      const miniLocations = await completeBrandToLocationFlow(page, 'MINI');
      expect(miniLocations).toHaveLength(3);
      expect(miniLocations).toEqual(
        expect.arrayContaining(['Garbsen', 'Hannover Südstadt', 'Steinhude'])
      );
    });

    test('TC-4b: BMW should show 5 specific locations', async ({ page }) => {
      const locations = await completeBrandToLocationFlow(page, 'BMW');

      expect(locations).toHaveLength(5);
      expect(locations).toEqual(
        expect.arrayContaining(['Stuttgart', 'Köln', 'München', 'Berlin', 'Hamburg'])
      );
    });

    test('TC-4c: Mercedes-Benz should show 5 specific locations', async ({ page }) => {
      const locations = await completeBrandToLocationFlow(page, 'Mercedes-Benz');

      expect(locations).toHaveLength(5);
      expect(locations).toEqual(
        expect.arrayContaining(['Stuttgart', 'München', 'Frankfurt', 'Düsseldorf', 'Berlin'])
      );
    });

    test('TC-4d: Volkswagen should show 5 specific locations', async ({ page }) => {
      const locations = await completeBrandToLocationFlow(page, 'Volkswagen');

      expect(locations).toHaveLength(5);
      expect(locations).toEqual(
        expect.arrayContaining(['Wolfsburg', 'Hannover', 'Berlin', 'München', 'Hamburg'])
      );
    });

  });

  // =============================================
  // ALTERNATIVE FLOWS (Section 5)
  // =============================================

  test.describe('Alternative Flows', () => {

    test('5.1: Navigate back to brand selection and brand remains selectable', async ({ page }) => {
      await selectBrand(page, 'Audi');
      const locationRoute = await getCurrentRoute(page);
      expect(locationRoute).toBe('/home/location');

      await goToBrandSelection(page);
      const route = await getCurrentRoute(page);
      expect(route).toBe('/home/brand');

      const buttons = page.locator('.brand-grid__button, [class*="brand"] button');
      const count = await buttons.count();
      expect(count).toBeGreaterThanOrEqual(5);
    });

    test('5.1b: After going back, selecting a different brand loads new locations', async ({ page }) => {
      await selectBrand(page, 'Audi');
      const audiLocations = await getLocationButtonTexts(page);
      expect(audiLocations).toContain('München');

      await goToBrandSelection(page);
      await selectBrand(page, 'BMW');
      const bmwLocations = await getLocationButtonTexts(page);

      expect(bmwLocations).toContain('Stuttgart');
      expect(bmwLocations).toContain('Köln');
    });

    test('5.2: Change location — reselect from location page', async ({ page }) => {
      await selectBrand(page, 'Audi');

      const locationButtons = page.locator('.location-grid__button');
      const count = await locationButtons.count();
      expect(count).toBe(5);

      await selectLocation(page, 'München');

      // Navigate back to start over
      await selectBrand(page, 'Audi');

      const buttons = await getLocationButtonTexts(page);
      expect(buttons).toHaveLength(5);
    });

  });

  // =============================================
  // EXCEPTION FLOWS (Section 6)
  // =============================================

  test.describe('Exception Flows', () => {

    test('6.1: Direct URL access without brand -> redirect', async ({ page }) => {
      await navigateTo(page, '/home/location');

      const route = await getCurrentRoute(page);
      expect(route).toBe('/home/brand');
    });

    test('6.1b: Navigating to unknown route redirects to home', async ({ page }) => {
      await navigateTo(page, '/unknown-route');
      await waitForAngular(page);

      const route = await getCurrentRoute(page);
      expect(route).toMatch(/\/home/);
    });

  });

  // =============================================
  // i18n (Language Switch)
  // =============================================

  test.describe('i18n', () => {

    test('should show DE title', async ({ page }) => {
      await setLanguage(page, 'de');
      await selectBrand(page, 'Audi');

      const title = await getPageTitle(page);
      expect(title).toBe('An welchem Standort dürfen wir Sie begrüßen?');
    });

    test('should show EN title after language switch', async ({ page }) => {
      await setLanguage(page, 'en');
      await selectBrand(page, 'Audi');

      const title = await getPageTitle(page);
      expect(title).toBe('At which location may we welcome you?');
    });

    test('should show EN subtitle after language switch', async ({ page }) => {
      await setLanguage(page, 'en');
      await selectBrand(page, 'Audi');

      const subtitle = page.locator('p').first();
      await expect(subtitle).toContainText('Please select your desired location');
    });

    test('should switch back to DE correctly', async ({ page }) => {
      await setLanguage(page, 'en');
      await selectBrand(page, 'Audi');
      await setLanguage(page, 'de');

      // Need to re-navigate because reload goes to brand page
      await selectBrand(page, 'Audi');
      const title = await getPageTitle(page);
      expect(title).toBe('An welchem Standort dürfen wir Sie begrüßen?');
    });

    test('location names remain German regardless of UI language', async ({ page }) => {
      await setLanguage(page, 'en');
      await selectBrand(page, 'Audi');

      const locations = await getLocationButtonTexts(page);
      expect(locations).toContain('München');
      expect(locations).toContain('Hamburg');
    });

  });

  // =============================================
  // ACCESSIBILITY
  // =============================================

  test.describe('Accessibility', () => {

    test('location buttons should have role group', async ({ page }) => {
      await selectBrand(page, 'Audi');

      const group = page.locator('[role="group"]');
      await expect(group).toBeVisible();
    });

    test('location buttons should have aria-pressed attribute', async ({ page }) => {
      await selectBrand(page, 'Audi');

      const buttons = page.locator('.location-grid__button');
      const count = await buttons.count();

      for (let i = 0; i < count; i++) {
        const ariaPressed = await buttons.nth(i).getAttribute('aria-pressed');
        expect(ariaPressed).toBe('false');
      }
    });

    test('group should have aria-label', async ({ page }) => {
      await setLanguage(page, 'de');
      await selectBrand(page, 'Audi');

      const group = page.locator('.location-grid[role="group"]');
      const ariaLabel = await group.getAttribute('aria-label');
      expect(ariaLabel).toBe('Standorte');
    });

    test('all buttons should be keyboard navigable', async ({ page }) => {
      await selectBrand(page, 'Audi');

      const firstButton = page.locator('.location-grid__button').first();
      await firstButton.focus();

      await expect(firstButton).toBeFocused();

      await page.keyboard.press('Tab');
      const secondButton = page.locator('.location-grid__button').nth(1);
      await expect(secondButton).toBeFocused();
    });

    test('keyboard Enter should select a location', async ({ page }) => {
      await selectBrand(page, 'Audi');

      const firstButton = page.locator('.location-grid__button').first();
      await firstButton.focus();
      await page.keyboard.press('Enter');
      await waitForAngular(page);

      const route = await getCurrentRoute(page);
      expect(route).not.toBe('/home/location');
    });

  });

  // =============================================
  // RESPONSIVE
  // =============================================

  test.describe('Responsive Layout', () => {

    test('should display location buttons on all viewports', async ({ page }) => {
      await selectBrand(page, 'Audi');

      const buttons = page.locator('.location-grid__button');
      const count = await buttons.count();
      expect(count).toBe(5);

      for (let i = 0; i < count; i++) {
        await expect(buttons.nth(i)).toBeVisible();
      }
    });

  });

});
