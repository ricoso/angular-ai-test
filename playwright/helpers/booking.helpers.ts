import { expect, type Page } from '@playwright/test';

import { navigateTo, waitForAngular } from './app.helpers';

/**
 * Booking wizard helpers
 * Reusable actions for the booking flow (brand -> location -> services)
 */

/** Navigate to the brand selection page */
export async function goToBrandSelection(page: Page): Promise<void> {
  await navigateTo(page, '/home/brand');
}

/** Navigate to the location selection page (requires brand to be selected) */
export async function goToLocationSelection(page: Page): Promise<void> {
  await navigateTo(page, '/home/location');
}

/** Select a brand by clicking on the brand button */
export async function selectBrand(page: Page, brandName: string): Promise<void> {
  await goToBrandSelection(page);
  const button = page.locator('button', { hasText: brandName });
  await expect(button).toBeVisible();
  await button.click();
  await waitForAngular(page);
}

/** Select a location by clicking on the location button */
export async function selectLocation(page: Page, locationName: string): Promise<void> {
  const button = page.locator('button', { hasText: locationName });
  await expect(button).toBeVisible();
  await button.click();
  await waitForAngular(page);
}

/** Get all visible brand button texts */
export async function getBrandButtonTexts(page: Page): Promise<string[]> {
  const buttons = page.locator('.brand-grid__button, [class*="brand"] button');
  return buttons.allTextContents().then(texts => texts.map(t => t.trim()));
}

/** Get all visible location button texts */
export async function getLocationButtonTexts(page: Page): Promise<string[]> {
  const buttons = page.locator('.location-grid__button');
  return buttons.allTextContents().then(texts => texts.map(t => t.trim()));
}

/** Get the page title heading text */
export async function getPageTitle(page: Page): Promise<string> {
  const heading = page.locator('h1').first();
  return (await heading.textContent() ?? '').trim();
}

/**
 * Complete flow: Brand -> Location
 * Selects a brand, waits for location page, and returns location button texts.
 */
export async function completeBrandToLocationFlow(
  page: Page,
  brandName: string
): Promise<string[]> {
  await selectBrand(page, brandName);
  await waitForAngular(page);
  return getLocationButtonTexts(page);
}

// =============================================
// SERVICE SELECTION HELPERS (REQ-004)
// =============================================

/**
 * Navigate to the service selection page via brand + location selection.
 * This is necessary because the guard requires both brand and location selected.
 * Waits for each step to render before proceeding.
 */
export async function goToServiceSelection(
  page: Page,
  brandName = 'Audi',
  locationName = 'München'
): Promise<void> {
  await selectBrand(page, brandName);
  // Wait for location page to render with buttons
  await page.locator('.location-grid__button').first().waitFor({ state: 'visible', timeout: 10000 });
  await selectLocation(page, locationName);
  // Wait for service cards to appear (confirms we reached the services page)
  await page.locator('.service-card').first().waitFor({ state: 'visible', timeout: 10000 });
  await waitForAngular(page);
}

/** Click on a service card by its visible title text */
export async function selectService(page: Page, serviceName: string): Promise<void> {
  const card = page.locator('.service-card', { hasText: serviceName });
  await expect(card).toBeVisible();
  await card.click();
  await waitForAngular(page);
}

/** Get visible service card title texts */
export async function getServiceCardTitles(page: Page): Promise<string[]> {
  const titles = page.locator('.service-card__title');
  return titles.allTextContents().then(texts => texts.map(t => t.trim()));
}

/**
 * Confirm tire change with a specific variant.
 * Selects the radio button for the variant, then clicks the confirm button.
 */
export async function confirmTireChange(
  page: Page,
  variant: 'with-storage' | 'without-storage'
): Promise<void> {
  const tireCard = page.locator('.service-card', { hasText: 'Räderwechsel' }).or(
    page.locator('.service-card', { hasText: 'Tire Change' })
  );
  await expect(tireCard.first()).toBeVisible();

  // Select the radio input by value
  const radio = tireCard.first().locator(`.service-card__radio-input[value="${variant}"]`);
  await radio.click();
  await waitForAngular(page);

  // Click confirm button
  const confirmButton = tireCard.first().locator('.service-card__confirm-button');
  await expect(confirmButton).toBeVisible();
  await confirmButton.click();
  await waitForAngular(page);
}

/** Click the deselect button on the tire change card */
export async function deselectTireChange(page: Page): Promise<void> {
  const tireCard = page.locator('.service-card', { hasText: 'Räderwechsel' }).or(
    page.locator('.service-card', { hasText: 'Tire Change' })
  );
  const deselectButton = tireCard.first().locator('.service-card__deselect-button');
  await expect(deselectButton).toBeVisible();
  await deselectButton.click();
  await waitForAngular(page);
}

/**
 * Complete flow: Brand -> Location -> Services
 * Navigates through brand and location, landing on the services page.
 */
export async function completeBrandToServiceFlow(
  page: Page,
  brandName = 'Audi',
  locationName = 'München'
): Promise<void> {
  await selectBrand(page, brandName);
  await selectLocation(page, locationName);
  await waitForAngular(page);
}
