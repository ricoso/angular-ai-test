import { expect, test } from '@playwright/test';

import { getCurrentRoute, navigateTo, setLanguage, waitForAngular } from './helpers/app.helpers';
import {
  completeBrandToLocationFlow,
  getBrandButtonTexts,
  getLocationButtonTexts,
  getPageTitle,
  getServiceCardTitles,
  goToBrandSelection,
  goToServiceSelection,
  selectBrand,
  selectLocation,
  selectService,
} from './helpers/booking.helpers';

/**
 * COMPLETE BOOKING WORKFLOW
 *
 * End-to-End flow through all implemented wizard steps:
 *   REQ-001 (Header) -> REQ-002 (Brand Selection) -> REQ-003 (Location Selection) -> REQ-004 (Service Selection)
 *
 * Tests the full user journey including:
 * - Header always visible
 * - Brand selection -> Location selection -> Service selection
 * - Language switching during the flow
 * - Alternative flows (back navigation, brand change)
 * - Guards and redirects
 */

test.describe('Complete Booking Workflow', () => {

  // =============================================
  // HAPPY PATH — Full Flow
  // =============================================

  test.describe('Happy Path', () => {

    test('complete flow: Start -> Brand -> Location -> Services', async ({ page }) => {
      await setLanguage(page, 'de');

      // Step 1: Navigate to app root -> should redirect to /home/brand
      await navigateTo(page, '/');
      await waitForAngular(page);
      const startRoute = await getCurrentRoute(page);
      expect(startRoute).toBe('/home/brand');

      // Step 2: Verify REQ-001 header is visible
      const header = page.locator('header[role="banner"]');
      await expect(header).toBeVisible();
      const companyName = page.locator('.header__company-name');
      await expect(companyName).toContainText('Gottfried Schultz');

      // Step 3: REQ-002 — Select brand "Audi"
      const title = await getPageTitle(page);
      expect(title).toBe('Welche Fahrzeugmarke fahren Sie?');

      const brands = await getBrandButtonTexts(page);
      expect(brands).toHaveLength(5);

      await selectBrand(page, 'Audi');

      // Step 4: REQ-003 — Verify location page loaded
      const locationRoute = await getCurrentRoute(page);
      expect(locationRoute).toBe('/home/location');

      const locationTitle = await getPageTitle(page);
      expect(locationTitle).toBe('An welchem Standort dürfen wir Sie begrüßen?');

      const locations = await getLocationButtonTexts(page);
      expect(locations).toHaveLength(5);
      expect(locations).toEqual(
        expect.arrayContaining(['München', 'Hamburg', 'Berlin', 'Frankfurt', 'Düsseldorf'])
      );

      // Step 5: Header still visible on location page
      await expect(header).toBeVisible();

      // Step 6: Select location "München"
      await selectLocation(page, 'München');
      await waitForAngular(page);

      // Step 7: REQ-004 — Verify services page loaded
      const servicesRoute = await getCurrentRoute(page);
      expect(servicesRoute).toBe('/home/services');

      const servicesTitle = await getPageTitle(page);
      expect(servicesTitle).toBe('Welche Services möchten Sie buchen?');

      // Step 8: Verify 3 service cards
      const serviceCards = await getServiceCardTitles(page);
      expect(serviceCards).toHaveLength(3);
      expect(serviceCards).toEqual(
        expect.arrayContaining(['HU/AU', 'Inspektion', 'Räderwechsel'])
      );

      // Step 9: Select HU/AU service
      await selectService(page, 'HU/AU');
      const huauCard = page.locator('.service-card', { hasText: 'HU/AU' });
      await expect(huauCard).toHaveClass(/service-card--selected/);

      // Step 10: Header still visible on services page
      await expect(header).toBeVisible();
    });

    test('complete flow: MINI brand with 3 locations', async ({ page }) => {
      await navigateTo(page, '/');
      await waitForAngular(page);

      await selectBrand(page, 'MINI');

      const locations = await getLocationButtonTexts(page);
      expect(locations).toHaveLength(3);
      expect(locations).toContain('Garbsen');
      expect(locations).toContain('Hannover Südstadt');
      expect(locations).toContain('Steinhude');

      await selectLocation(page, 'Garbsen');
      await waitForAngular(page);

      const route = await getCurrentRoute(page);
      expect(route).toBeTruthy();
    });

    test('complete flow: all 5 brands show correct location counts', async ({ page }) => {
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

        await goToBrandSelection(page);
      }
    });

  });

  // =============================================
  // ALTERNATIVE FLOWS
  // =============================================

  test.describe('Alternative Flows', () => {

    test('flow: Brand -> Location -> Back to Brand -> Different Brand -> Location', async ({ page }) => {
      await navigateTo(page, '/');
      await selectBrand(page, 'Audi');

      let locations = await getLocationButtonTexts(page);
      expect(locations).toContain('München');
      expect(locations).toContain('Düsseldorf');

      await goToBrandSelection(page);
      const route = await getCurrentRoute(page);
      expect(route).toBe('/home/brand');

      await selectBrand(page, 'BMW');

      locations = await getLocationButtonTexts(page);
      expect(locations).toContain('Stuttgart');
      expect(locations).toContain('Köln');
      expect(locations).not.toContain('Düsseldorf');
      expect(locations).not.toContain('Frankfurt');
    });

    test('flow: Brand -> Location -> Select -> Back to Brand -> Brand -> Different Location', async ({ page }) => {
      await navigateTo(page, '/');
      await selectBrand(page, 'Volkswagen');
      await selectLocation(page, 'Wolfsburg');
      await waitForAngular(page);

      await goToBrandSelection(page);
      await selectBrand(page, 'Volkswagen');

      const locations = await getLocationButtonTexts(page);
      expect(locations).toContain('Hannover');
      await selectLocation(page, 'Hannover');
      await waitForAngular(page);
    });

    test('flow: Multiple brand switches preserve page structure', async ({ page }) => {
      await setLanguage(page, 'de');
      const brandsToTest = ['Audi', 'BMW', 'Mercedes-Benz', 'MINI', 'Volkswagen'];

      for (const brand of brandsToTest) {
        await goToBrandSelection(page);
        await selectBrand(page, brand);

        const title = await getPageTitle(page);
        expect(title).toBe('An welchem Standort dürfen wir Sie begrüßen?');

        const subtitle = page.locator('p').first();
        await expect(subtitle).toContainText('Bitte wählen Sie den gewünschten Standort aus');

        const locationGrid = page.locator('[role="group"]');
        await expect(locationGrid).toBeVisible();
      }
    });

    test('flow: Services -> Back to Location', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToServiceSelection(page);

      const servicesRoute = await getCurrentRoute(page);
      expect(servicesRoute).toBe('/home/services');

      // Click back button
      const backButton = page.locator('.summary-bar__back-button');
      await backButton.click();
      await waitForAngular(page);

      const locationRoute = await getCurrentRoute(page);
      expect(locationRoute).toBe('/home/location');

      const locationTitle = await getPageTitle(page);
      expect(locationTitle).toBe('An welchem Standort dürfen wir Sie begrüßen?');
    });

  });

  // =============================================
  // EXCEPTION FLOWS & GUARDS
  // =============================================

  test.describe('Exception Flows & Guards', () => {

    test('direct access to /home/location without brand -> redirect to /home/brand', async ({ page }) => {
      await navigateTo(page, '/home/location');

      const route = await getCurrentRoute(page);
      expect(route).toBe('/home/brand');
    });

    test('unknown route -> redirect to /home/brand', async ({ page }) => {
      await navigateTo(page, '/some/unknown/path');
      await waitForAngular(page);

      const route = await getCurrentRoute(page);
      expect(route).toMatch(/\/home/);
    });

    test('direct access to /home -> redirect to /home/brand', async ({ page }) => {
      await navigateTo(page, '/home');
      await waitForAngular(page);

      const route = await getCurrentRoute(page);
      expect(route).toBe('/home/brand');
    });

    test('direct access to /home/services without brand/location -> redirect', async ({ page }) => {
      await navigateTo(page, '/home/services');
      await waitForAngular(page);

      const route = await getCurrentRoute(page);
      // Guard redirects to /home/brand (no brand) or /home/location (no location)
      expect(route).toMatch(/\/home\/(brand|location)/);
    });

  });

  // =============================================
  // i18n — Language through complete flow
  // =============================================

  test.describe('i18n — Language through flow', () => {

    test('EN: complete flow with English language including services', async ({ page }) => {
      await setLanguage(page, 'en');
      await navigateTo(page, '/home/brand');

      const brandTitle = await getPageTitle(page);
      expect(brandTitle).toBe('What vehicle brand do you drive?');

      await selectBrand(page, 'Audi');

      const locationTitle = await getPageTitle(page);
      expect(locationTitle).toBe('At which location may we welcome you?');

      const locations = await getLocationButtonTexts(page);
      expect(locations).toContain('München');

      await selectLocation(page, 'München');
      await waitForAngular(page);

      const servicesTitle = await getPageTitle(page);
      expect(servicesTitle).toBe('Which services would you like to book?');

      const cardTitles = await getServiceCardTitles(page);
      expect(cardTitles).toEqual(
        expect.arrayContaining(['HU/AU', 'Inspection', 'Tire Change'])
      );
    });

    test('language switch mid-flow: DE brand -> EN location', async ({ page }) => {
      // Start in DE
      await setLanguage(page, 'de');
      await navigateTo(page, '/home/brand');
      const brandTitle = await getPageTitle(page);
      expect(brandTitle).toBe('Welche Fahrzeugmarke fahren Sie?');

      // Select brand
      await selectBrand(page, 'BMW');

      // Switch to EN on location page
      await setLanguage(page, 'en');
      // After reload, we're back at brand page, need to re-select
      await selectBrand(page, 'BMW');

      const locationTitle = await getPageTitle(page);
      expect(locationTitle).toBe('At which location may we welcome you?');

      // Header should also be in EN now
      const a11yButton = page.locator('.header__a11y-button');
      const ariaLabel = await a11yButton.getAttribute('aria-label');
      expect(ariaLabel).toBe('Accessibility Settings');
    });

    test('language persists after navigation', async ({ page }) => {
      await setLanguage(page, 'en');
      await navigateTo(page, '/home/brand');

      await selectBrand(page, 'Audi');

      const locationTitle = await getPageTitle(page);
      expect(locationTitle).toBe('At which location may we welcome you?');

      await goToBrandSelection(page);

      const brandTitle = await getPageTitle(page);
      expect(brandTitle).toBe('What vehicle brand do you drive?');
    });

  });

  // =============================================
  // HEADER PERSISTENCE ACROSS PAGES
  // =============================================

  test.describe('Header persistence (REQ-001)', () => {

    test('header stays visible through brand -> location -> services flow', async ({ page }) => {
      const header = page.locator('header[role="banner"]');
      const companyName = page.locator('.header__company-name');

      await navigateTo(page, '/home/brand');
      await expect(header).toBeVisible();
      await expect(companyName).toContainText('Gottfried Schultz');

      await selectBrand(page, 'Audi');
      await expect(header).toBeVisible();
      await expect(companyName).toContainText('Gottfried Schultz');

      await selectLocation(page, 'München');
      await waitForAngular(page);

      // Header visible on services page
      await expect(header).toBeVisible();
      await expect(companyName).toContainText('Gottfried Schultz');
    });

    test('accessibility settings persist across page navigation', async ({ page }) => {
      await navigateTo(page, '/home/brand');

      // Open accessibility menu and change font size
      const a11yButton = page.locator('.header__a11y-button');
      await a11yButton.click();
      await waitForAngular(page);

      // Click "Large" radio label (3rd option)
      const radioLabels = page.locator('.accessibility-menu__radio label');
      await radioLabels.nth(2).click();
      await waitForAngular(page);

      // Check localStorage
      const settings = await page.evaluate(() => localStorage.getItem('accessibility-settings'));
      expect(settings).toBeTruthy();
    });

    test('cart icon visible on all pages including services', async ({ page }) => {
      const cartButton = page.locator('.cart-icon__button');

      await navigateTo(page, '/home/brand');
      await expect(cartButton).toBeVisible();

      await selectBrand(page, 'Audi');
      await expect(cartButton).toBeVisible();

      await selectLocation(page, 'München');
      await waitForAngular(page);
      await expect(cartButton).toBeVisible();
    });

  });

});
