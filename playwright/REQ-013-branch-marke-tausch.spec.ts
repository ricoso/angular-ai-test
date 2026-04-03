import { expect, test } from '@playwright/test';

import { getCurrentRoute, navigateTo, saveScreenshot, setLanguage, waitForAngular } from './helpers/app.helpers';

/**
 * REQ-013: Branch-Marke-Tausch (Location-Brand Swap)
 *
 * Tests the new wizard order: Location (Step 1) → Brand (Step 2) → Services → ...
 * Previously: Brand → Location → Services
 *
 * Test Cases from requirement.md Section 13:
 * - TC-1:  Wizard entry is location selection (AC-1, AC-11)
 * - TC-2:  Select branch and navigate to brands (AC-2, AC-3)
 * - TC-3:  Brands filtered by branch — multi-brand branch (AC-4)
 * - TC-4:  Brands filtered by branch — single brand (AC-4)
 * - TC-5:  Back button on brand selection (AC-5)
 * - TC-6:  No back button on location selection (AC-6)
 * - TC-7:  Guard — /home/brand without branch (AC-8, 6.3)
 * - TC-8:  Guard — /home/services without brand (AC-9, 6.4)
 * - TC-9:  Store order — branch then brand (AC-7)
 * - TC-10: Branch change resets brand (AC-10)
 * - TC-11: Wizard breadcrumb visible
 * - TC-12: Info banner on brand page
 * - TC-13: Continue button disabled without selection
 */

// =============================================
// HELPERS for REQ-013 (card-based radio selection)
// =============================================

async function goToLocationPage(page: import('@playwright/test').Page): Promise<void> {
  await navigateTo(page, '/home/location');
  await page.locator('.location-selection').waitFor({ state: 'visible', timeout: 15000 });
  // Wait for branch cards to load (async fetch from branch-config.json)
  await page.locator('.location-card').first().waitFor({ state: 'visible', timeout: 15000 });
  await waitForAngular(page);
}

async function selectBranchByName(page: import('@playwright/test').Page, branchName: string): Promise<void> {
  const card = page.locator('.location-card').filter({
    has: page.locator('.location-card__name', { hasText: branchName })
  });
  await expect(card).toBeVisible({ timeout: 10000 });
  await card.click();
  await waitForAngular(page);
}

async function clickLocationContinue(page: import('@playwright/test').Page): Promise<void> {
  const btn = page.locator('.location-selection__continue-button');
  await expect(btn).toBeVisible();
  await expect(btn).toBeEnabled();
  await btn.click();
  await waitForAngular(page);
}

async function selectBranchAndContinue(page: import('@playwright/test').Page, branchName: string): Promise<void> {
  await selectBranchByName(page, branchName);
  await clickLocationContinue(page);
  await page.locator('.brand-selection').waitFor({ state: 'visible', timeout: 10000 });
  await waitForAngular(page);
}

async function getBranchCardNames(page: import('@playwright/test').Page): Promise<string[]> {
  const names = page.locator('.location-card__name');
  return names.allTextContents().then(texts => texts.map(t => t.trim()));
}

async function getBrandCardNames(page: import('@playwright/test').Page): Promise<string[]> {
  const names = page.locator('.brand-card__name');
  return names.allTextContents().then(texts => texts.map(t => t.trim()));
}

async function selectBrandByName(page: import('@playwright/test').Page, brandName: string): Promise<void> {
  const card = page.locator('.brand-card').filter({
    has: page.locator('.brand-card__name', { hasText: new RegExp(`^${brandName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`) })
  });
  await expect(card).toBeVisible({ timeout: 10000 });
  await card.click();
  await waitForAngular(page);
}

async function clickBrandContinue(page: import('@playwright/test').Page): Promise<void> {
  const btn = page.locator('.brand-selection__continue-button');
  await expect(btn).toBeVisible();
  await expect(btn).toBeEnabled();
  await btn.click();
  await waitForAngular(page);
}

async function clickBrandBack(page: import('@playwright/test').Page): Promise<void> {
  const btn = page.locator('.brand-selection__back-button');
  await expect(btn).toBeVisible();
  await btn.click();
  await waitForAngular(page);
}

// =============================================
// TESTS
// =============================================

test.describe('REQ-013: Branch-Marke-Tausch', () => {

  // =============================================
  // MAIN FLOW (Section 4)
  // =============================================

  test.describe('Main Flow — Location first, then Brand', () => {

    test('TC-1: Wizard entry redirects to /home/location with ALL branches visible', async ({ page }) => {
      await setLanguage(page, 'de');
      await navigateTo(page, '/');
      await waitForAngular(page);

      const route = await getCurrentRoute(page);
      expect(route).toBe('/home/location');

      // Wait for branch cards to load (async fetch from branch-config.json)
      await page.locator('.location-card').first().waitFor({ state: 'visible', timeout: 15000 });

      const cards = page.locator('.location-card');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);

      await saveScreenshot(page, 'REQ-013-Branch-Marke-Tausch', '01-location-selection');
    });

    test('TC-2: Selecting a branch and clicking Continue navigates to /home/brand', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToLocationPage(page);

      // Select the first visible branch
      const firstCard = page.locator('.location-card').first();
      await expect(firstCard).toBeVisible();
      const branchName = (await firstCard.locator('.location-card__name').textContent() ?? '').trim();
      await firstCard.click();
      await waitForAngular(page);

      // Continue button should be enabled
      await clickLocationContinue(page);

      const route = await getCurrentRoute(page);
      expect(route).toBe('/home/brand');

      // Branch name should be visible in info banner
      const infoBanner = page.locator('.brand-selection__info-text');
      await expect(infoBanner).toBeVisible();
      await expect(infoBanner).toContainText(branchName);

      await saveScreenshot(page, 'REQ-013-Branch-Marke-Tausch', '02-brand-selection');
    });

    test('TC-3: Brands filtered by branch — multi-brand branch shows correct brands', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToLocationPage(page);

      // Select "Volkswagen Zentrum Essen" (has VW, VW Nutzfahrzeuge, SEAT, CUPRA)
      await selectBranchAndContinue(page, 'Volkswagen Zentrum Essen');

      const brandNames = await getBrandCardNames(page);
      expect(brandNames.length).toBe(4);
      expect(brandNames).toEqual(expect.arrayContaining(['VW', 'VW Nutzfahrzeuge', 'SEAT', 'CUPRA']));

      await saveScreenshot(page, 'REQ-013-Branch-Marke-Tausch', '03-brands-multi');
    });

    test('TC-4: Brands filtered by branch — single brand branch shows only 1 brand', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToLocationPage(page);

      // Select "ŠKODA Zentrum Essen" (has only ŠKODA)
      await selectBranchAndContinue(page, 'ŠKODA Zentrum Essen');

      const brandNames = await getBrandCardNames(page);
      expect(brandNames.length).toBe(1);
      expect(brandNames[0]).toContain('ŠKODA');

      await saveScreenshot(page, 'REQ-013-Branch-Marke-Tausch', '04-brands-single');
    });

    test('TC-9: Store order — branch selected first, then brand', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToLocationPage(page);

      // Step 1: Select branch
      await selectBranchAndContinue(page, 'Audi Zentrum Essen');

      // Step 2: Verify brand page shows filtered brands
      const brandNames = await getBrandCardNames(page);
      expect(brandNames).toEqual(expect.arrayContaining(['Audi']));

      // Select brand and continue
      await selectBrandByName(page, 'Audi');
      await clickBrandContinue(page);

      // Should navigate to /home/services
      const route = await getCurrentRoute(page);
      expect(route).toBe('/home/services');
    });
  });

  // =============================================
  // BACK NAVIGATION (Section 5)
  // =============================================

  test.describe('Back Navigation', () => {

    test('TC-5: Back button on brand page navigates to /home/location', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToLocationPage(page);
      await selectBranchAndContinue(page, 'Volkswagen Zentrum Essen');

      // Click back button
      await clickBrandBack(page);

      const route = await getCurrentRoute(page);
      expect(route).toBe('/home/location');

      // Location page should be visible again
      await expect(page.locator('.location-selection')).toBeVisible();
    });

    test('TC-6: No back button on location selection (it is the entry step)', async ({ page }) => {
      await goToLocationPage(page);

      // There should be no dedicated back button on the location selection
      const backButton = page.locator('.location-selection__back-button');
      await expect(backButton).toHaveCount(0);

      // The nav should only have the continue button
      const nav = page.locator('.location-selection__nav');
      await expect(nav).toBeVisible();
    });

    test('TC-10: Changing branch resets brand selection', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToLocationPage(page);

      // Select first branch and go to brands
      await selectBranchAndContinue(page, 'Volkswagen Zentrum Essen');
      const brands1 = await getBrandCardNames(page);
      expect(brands1.length).toBeGreaterThan(0);

      // Select a brand (SEAT to avoid VW/VW Nutzfahrzeuge ambiguity)
      await selectBrandByName(page, 'SEAT');

      // Go back to location
      await clickBrandBack(page);

      // Select a DIFFERENT branch
      await selectBranchAndContinue(page, 'Audi Zentrum Essen');

      // Brands should be different (Audi branch has only Audi)
      const brands2 = await getBrandCardNames(page);
      expect(brands2).toEqual(expect.arrayContaining(['Audi']));
      // Previous brand should NOT be auto-selected (no continue possible)
      const continueBtn = page.locator('.brand-selection__continue-button');
      await expect(continueBtn).toBeDisabled();
    });
  });

  // =============================================
  // GUARDS (Section 6)
  // =============================================

  test.describe('Guards and Redirects', () => {

    test('TC-7: Direct access to /home/brand without branch redirects to /home/location', async ({ page }) => {
      // Navigate directly to brand page without selecting a branch
      await navigateTo(page, '/home/brand');
      await waitForAngular(page);

      const route = await getCurrentRoute(page);
      expect(route).toBe('/home/location');
    });

    test('TC-8: Direct access to /home/services without brand redirects to /home/brand', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToLocationPage(page);

      // Select branch only (no brand)
      await selectBranchAndContinue(page, 'Volkswagen Zentrum Essen');

      // Now try to go directly to services (brand selected state exists but no brand picked)
      await navigateTo(page, '/home/services');
      await waitForAngular(page);

      const route = await getCurrentRoute(page);
      // Should redirect to /home/brand since no brand was selected
      expect(route).toBe('/home/brand');
    });
  });

  // =============================================
  // WIZARD BREADCRUMB (Section 11)
  // =============================================

  test.describe('Wizard Breadcrumb', () => {

    test('TC-11a: Breadcrumb visible on location page with Step 1 active', async ({ page }) => {
      await goToLocationPage(page);

      const wizard = page.locator('.wizard');
      await expect(wizard).toBeVisible();

      // First step should be active
      const activeStep = page.locator('.wizard__step--active');
      await expect(activeStep).toHaveCount(1);

      // Active step should be the first step
      const steps = page.locator('.wizard__step');
      const firstStepClasses = await steps.first().getAttribute('class');
      expect(firstStepClasses).toContain('wizard__step--active');
    });

    test('TC-11b: Breadcrumb shows Step 1 done and Step 2 active on brand page', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToLocationPage(page);
      await selectBranchAndContinue(page, 'Volkswagen Zentrum Essen');

      const wizard = page.locator('.wizard');
      await expect(wizard).toBeVisible();

      // First step should be done
      const doneSteps = page.locator('.wizard__step--done');
      const doneCount = await doneSteps.count();
      expect(doneCount).toBeGreaterThanOrEqual(1);

      // Second step should be active
      const steps = page.locator('.wizard__step');
      const secondStepClasses = await steps.nth(1).getAttribute('class');
      expect(secondStepClasses).toContain('wizard__step--active');

      await saveScreenshot(page, 'REQ-013-Branch-Marke-Tausch', '05-breadcrumb-brand');
    });
  });

  // =============================================
  // INFO BANNER (Section 11)
  // =============================================

  test.describe('Info Banner', () => {

    test('TC-12: Info banner shows selected branch name and address on brand page', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToLocationPage(page);
      await selectBranchAndContinue(page, 'Volkswagen Zentrum Essen');

      const infoBanner = page.locator('.brand-selection__info-banner');
      await expect(infoBanner).toBeVisible();

      const infoText = page.locator('.brand-selection__info-text');
      await expect(infoText).toContainText('Volkswagen Zentrum Essen');

      // Should also show address
      const text = (await infoText.textContent() ?? '').trim();
      expect(text.length).toBeGreaterThan(20);

      // Info icon should be visible
      const icon = page.locator('.brand-selection__info-icon');
      await expect(icon).toBeVisible();
    });

    test('TC-12b: Info banner not visible when no branch selected', async ({ page }) => {
      // This checks guard scenario — navigating to /home/brand without branch
      // should redirect to location, so banner never appears on its own
      await navigateTo(page, '/home/brand');
      await waitForAngular(page);

      // Should be redirected to location page
      const route = await getCurrentRoute(page);
      expect(route).toBe('/home/location');
    });
  });

  // =============================================
  // CONTINUE BUTTON STATE
  // =============================================

  test.describe('Continue Button State', () => {

    test('TC-13a: Continue button disabled on location page without selection', async ({ page }) => {
      await goToLocationPage(page);

      const continueBtn = page.locator('.location-selection__continue-button');
      await expect(continueBtn).toBeVisible();
      // Button should be disabled when no branch is selected
      await expect(continueBtn).toBeDisabled();
    });

    test('TC-13b: Continue button enabled after branch selection', async ({ page }) => {
      await goToLocationPage(page);
      await selectBranchByName(page, 'Volkswagen Zentrum Essen');

      const continueBtn = page.locator('.location-selection__continue-button');
      await expect(continueBtn).toBeEnabled();
    });

    test('TC-13c: Continue button disabled on brand page without brand selection', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToLocationPage(page);
      await selectBranchAndContinue(page, 'Volkswagen Zentrum Essen');

      const continueBtn = page.locator('.brand-selection__continue-button');
      await expect(continueBtn).toBeVisible();
      await expect(continueBtn).toBeDisabled();
    });

    test('TC-13d: Continue button enabled after brand selection', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToLocationPage(page);
      await selectBranchAndContinue(page, 'Volkswagen Zentrum Essen');

      // Select SEAT (unambiguous name unlike VW/VW Nutzfahrzeuge)
      await selectBrandByName(page, 'SEAT');

      const continueBtn = page.locator('.brand-selection__continue-button');
      await expect(continueBtn).toBeEnabled();
    });
  });

  // =============================================
  // LOCATION CARD DETAILS
  // =============================================

  test.describe('Location Card Details', () => {

    test('Location cards show branch name, address and brand logos', async ({ page }) => {
      await goToLocationPage(page);

      const firstCard = page.locator('.location-card').first();
      await expect(firstCard).toBeVisible();

      // Should show branch name
      const name = firstCard.locator('.location-card__name');
      await expect(name).toBeVisible();
      const nameText = (await name.textContent() ?? '').trim();
      expect(nameText.length).toBeGreaterThan(0);

      // Should show address
      const address = firstCard.locator('.location-card__address');
      await expect(address).toBeVisible();

      // Should show brand logos
      const logos = firstCard.locator('.location-card__brand-logo');
      const logoCount = await logos.count();
      expect(logoCount).toBeGreaterThan(0);
    });

    test('Location cards show selected state via radio check', async ({ page }) => {
      await goToLocationPage(page);

      // Click first card label
      const firstCard = page.locator('.location-card').first();
      await firstCard.click();
      await waitForAngular(page);

      // The corresponding radio should be checked
      const firstRadio = page.locator('.location-grid__radio').first();
      await expect(firstRadio).toBeChecked({ timeout: 5000 });
    });
  });

  // =============================================
  // FULL FLOW — Location → Brand → Services
  // =============================================

  test.describe('Full Flow Integration', () => {

    test('Complete flow: Location → Brand → Services page reached', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToLocationPage(page);

      // Step 1: Select a branch with Audi
      await selectBranchAndContinue(page, 'Audi Zentrum Essen');

      // Step 2: Select Audi brand
      await selectBrandByName(page, 'Audi');
      await clickBrandContinue(page);

      // Step 3: Should be on services page
      const route = await getCurrentRoute(page);
      expect(route).toBe('/home/services');

      // Services page should be visible
      const serviceCards = page.locator('.service-card');
      const count = await serviceCards.count();
      expect(count).toBeGreaterThan(0);

      await saveScreenshot(page, 'REQ-013-Branch-Marke-Tausch', '06-services-after-flow');
    });
  });
});
