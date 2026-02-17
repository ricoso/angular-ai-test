import { expect, test } from '@playwright/test';

import { getCurrentRoute, navigateTo, setLanguage, waitForAngular } from './helpers/app.helpers';
import {
  completeBrandToLocationFlow,
  getBrandButtonTexts,
  getLocationButtonTexts,
  getPageTitle,
  goToBrandSelection,
  selectBrand,
  selectLocation,
} from './helpers/booking.helpers';

/**
 * REQ-003: Standortwahl (Location Selection)
 * Wizard Step 2: User selects a location based on the previously chosen brand
 *
 * Test Cases from requirement.md Section 13:
 * - TC-1: Happy Path — Audi selected → 5 locations visible
 * - TC-2: Select location "München" → navigation to services
 * - TC-3: Guard — no brand selected → redirect to /home/brand
 * - TC-4: Brand change → different locations shown
 *
 * Acceptance Criteria:
 * - AC-1: User sees only locations for the selected brand
 * - AC-2: 3-5 locations displayed as buttons
 * - AC-3: Click saves location in BookingStore
 * - AC-4: Navigation to /home/services after selection
 * - AC-5: Heading shows "An welchem Standort dürfen wir Sie begrüßen?"
 * - AC-6: Shopping cart icon in header shows brand + location in dropdown
 */

test.describe('REQ-003: Location Selection', () => {

  // =============================================
  // MAIN FLOW (Section 4) — Happy Path
  // =============================================

  test.describe('Main Flow', () => {

    test('TC-1: should display 5 location buttons for Audi', async ({ page }) => {
      await selectBrand(page, 'Audi');

      const locations = await getLocationButtonTexts(page);
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

    test('TC-1c: should display subtitle on location page (DE)', async ({ page }) => {
      await setLanguage(page, 'de');
      await selectBrand(page, 'Audi');

      const subtitle = page.locator('.location-selection__subtitle');
      await expect(subtitle).toBeVisible();
      await expect(subtitle).toContainText('Bitte wählen Sie den gewünschten Standort aus');
    });

    test('TC-2: should navigate away from location page after selecting München', async ({ page }) => {
      await selectBrand(page, 'Audi');

      // Verify we are on the location page before selection
      const locationRoute = await getCurrentRoute(page);
      expect(locationRoute).toBe('/home/location');

      await selectLocation(page, 'München');

      // After selection, the component navigates to /home/services.
      // Since REQ-004 (services) is not yet implemented, Angular redirects.
      // We verify the navigation was triggered (route changed from /home/location).
      const route = await getCurrentRoute(page);
      expect(route).not.toBe('/home/location');
    });

    test('TC-2b: location buttons should have role group', async ({ page }) => {
      await selectBrand(page, 'Audi');

      const group = page.locator('[role="group"]');
      await expect(group).toBeVisible();
    });

    test('TC-2c: each location button should have aria-pressed attribute', async ({ page }) => {
      await selectBrand(page, 'Audi');

      const buttons = page.locator('.location-grid__button');
      const count = await buttons.count();
      expect(count).toBe(5);

      for (let i = 0; i < count; i++) {
        const ariaPressed = await buttons.nth(i).getAttribute('aria-pressed');
        expect(ariaPressed).toBe('false');
      }
    });

  });

  // =============================================
  // ALTERNATIVE FLOWS (Section 5)
  // =============================================

  test.describe('Alternative Flows', () => {

    test('TC-4: should show different locations when brand changes from Audi to MINI', async ({ page }) => {
      // First select Audi → 5 locations
      await selectBrand(page, 'Audi');
      let locations = await getLocationButtonTexts(page);
      expect(locations).toHaveLength(5);
      expect(locations).toContain('München');
      expect(locations).toContain('Düsseldorf');

      // Go back and select MINI → 3 locations
      await selectBrand(page, 'MINI');
      locations = await getLocationButtonTexts(page);
      expect(locations).toHaveLength(3);
      expect(locations).toContain('Garbsen');
      expect(locations).toContain('Hannover Südstadt');
      expect(locations).toContain('Steinhude');
    });

    test('TC-4b: should show correct location counts for all brands', async ({ page }) => {
      const expectedCounts: Record<string, number> = {
        'Audi': 5,
        'BMW': 5,
        'Mercedes-Benz': 5,
        'MINI': 3,
        'Volkswagen': 5,
      };

      for (const [brand, expectedCount] of Object.entries(expectedCounts)) {
        const locations = await completeBrandToLocationFlow(page, brand);
        expect(locations).toHaveLength(expectedCount);
      }
    });

    test('TC-4c: BMW locations should include Stuttgart and Köln', async ({ page }) => {
      await selectBrand(page, 'BMW');

      const locations = await getLocationButtonTexts(page);
      expect(locations).toEqual(
        expect.arrayContaining(['Stuttgart', 'Köln', 'München', 'Berlin', 'Hamburg'])
      );
    });

    test('TC-4d: Mercedes-Benz locations should include Stuttgart and Frankfurt', async ({ page }) => {
      await selectBrand(page, 'Mercedes-Benz');

      const locations = await getLocationButtonTexts(page);
      expect(locations).toEqual(
        expect.arrayContaining(['Stuttgart', 'München', 'Frankfurt', 'Düsseldorf', 'Berlin'])
      );
    });

    test('TC-4e: Volkswagen locations should include Wolfsburg and Hannover', async ({ page }) => {
      await selectBrand(page, 'Volkswagen');

      const locations = await getLocationButtonTexts(page);
      expect(locations).toEqual(
        expect.arrayContaining(['Wolfsburg', 'Hannover', 'Berlin', 'München', 'Hamburg'])
      );
    });

    test('back navigation: should navigate back to brand selection page', async ({ page }) => {
      await selectBrand(page, 'Audi');
      const locationRoute = await getCurrentRoute(page);
      expect(locationRoute).toBe('/home/location');

      await goToBrandSelection(page);
      const brandRoute = await getCurrentRoute(page);
      expect(brandRoute).toBe('/home/brand');

      // Brand buttons should still be visible
      const brands = await getBrandButtonTexts(page);
      expect(brands).toHaveLength(5);
    });

  });

  // =============================================
  // EXCEPTION FLOWS (Section 6) — Guard
  // =============================================

  test.describe('Exception Flows', () => {

    test('TC-3: should redirect to /home/brand when accessing /home/location without brand', async ({ page }) => {
      await navigateTo(page, '/home/location');

      const route = await getCurrentRoute(page);
      expect(route).toBe('/home/brand');
    });

    test('TC-3b: should redirect to /home/brand when accessing /home/location directly (fresh session)', async ({ page }) => {
      // Clear any previous state
      await page.goto('about:blank');
      await navigateTo(page, '/home/location');

      const route = await getCurrentRoute(page);
      expect(route).toBe('/home/brand');
    });

  });

  // =============================================
  // i18n — Language Support
  // =============================================

  test.describe('i18n', () => {

    test('should show EN title on location page', async ({ page }) => {
      await setLanguage(page, 'en');
      await selectBrand(page, 'Audi');

      const title = await getPageTitle(page);
      expect(title).toBe('At which location may we welcome you?');
    });

    test('should show DE title on location page', async ({ page }) => {
      await setLanguage(page, 'de');
      await selectBrand(page, 'Audi');

      const title = await getPageTitle(page);
      expect(title).toBe('An welchem Standort dürfen wir Sie begrüßen?');
    });

    test('location names should remain the same in both languages', async ({ page }) => {
      await setLanguage(page, 'de');
      await selectBrand(page, 'Audi');
      const locationsDE = await getLocationButtonTexts(page);

      await setLanguage(page, 'en');
      await selectBrand(page, 'Audi');
      const locationsEN = await getLocationButtonTexts(page);

      // Location names (city names) should be the same regardless of language
      expect(locationsDE.sort()).toEqual(locationsEN.sort());
    });

  });

  // =============================================
  // ACCESSIBILITY (WCAG 2.1 AA)
  // =============================================

  test.describe('Accessibility', () => {

    test('location grid should have role group with aria-label', async ({ page }) => {
      await selectBrand(page, 'Audi');

      const group = page.locator('.location-grid[role="group"]');
      await expect(group).toBeVisible();

      const ariaLabel = await group.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();
    });

    test('location buttons should be keyboard accessible', async ({ page }) => {
      await selectBrand(page, 'Audi');

      // Tab into the location area
      const buttons = page.locator('.location-grid__button');
      const count = await buttons.count();
      expect(count).toBeGreaterThanOrEqual(3);

      // First button should be focusable via Tab
      await buttons.first().focus();
      const focused = page.locator('.location-grid__button:focus');
      await expect(focused).toBeVisible();
    });

    test('location buttons should have minimum touch target size', async ({ page }) => {
      await selectBrand(page, 'Audi');

      const button = page.locator('.location-grid__button').first();
      const box = await button.boundingBox();
      expect(box).toBeTruthy();
      // Minimum touch target: 44px (2.75em at 16px)
      expect(box!.height).toBeGreaterThanOrEqual(44);
    });

  });

  // =============================================
  // RESPONSIVE — Layout Checks
  // =============================================

  test.describe('Responsive', () => {

    test('location page should be visible and functional', async ({ page }) => {
      await selectBrand(page, 'Audi');

      const section = page.locator('.location-selection');
      await expect(section).toBeVisible();

      const title = page.locator('.location-selection__title');
      await expect(title).toBeVisible();

      const buttons = page.locator('.location-grid__button');
      const count = await buttons.count();
      expect(count).toBe(5);
    });

    test('header should remain visible on location page', async ({ page }) => {
      await selectBrand(page, 'Audi');

      const header = page.locator('header[role="banner"]');
      await expect(header).toBeVisible();

      const companyName = page.locator('.header__company-name');
      await expect(companyName).toContainText('Gottfried Schultz');
    });

  });

});
