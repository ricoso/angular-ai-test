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
