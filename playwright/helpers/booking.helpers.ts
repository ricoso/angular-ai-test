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

// =============================================
// LOCATION SELECTION HELPERS (REQ-003 / REQ-007)
// =============================================

/** Click the Back button on the location selection page */
export async function clickLocationBack(page: Page): Promise<void> {
  const backButton = page.locator('.location-selection__back-button');
  await expect(backButton).toBeVisible();
  await backButton.click();
  await waitForAngular(page);
}

// =============================================
// SERVICE SELECTION BACK HELPER (REQ-004 / REQ-007)
// =============================================

/** Click the Back button on the service selection page (summary bar) */
export async function clickServiceBack(page: Page): Promise<void> {
  const backButton = page.locator('.summary-bar__back-button');
  await expect(backButton).toBeVisible();
  await backButton.click();
  await waitForAngular(page);
}

// =============================================
// NOTES PAGE HELPERS (REQ-005)
// =============================================

/**
 * Navigate to the notes page via brand -> location -> service selection -> notes.
 * Selects HU/AU as a default service to satisfy the guard.
 * Additional services can be selected via the serviceNames parameter.
 */
export async function goToNotesPage(
  page: Page,
  options?: {
    brandName?: string;
    locationName?: string;
    serviceNames?: string[];
  }
): Promise<void> {
  const brandName = options?.brandName ?? 'Audi';
  const locationName = options?.locationName ?? 'München';
  const serviceNames = options?.serviceNames ?? ['HU/AU'];

  await goToServiceSelection(page, brandName, locationName);

  // Select each requested service
  for (const serviceName of serviceNames) {
    await selectService(page, serviceName);
  }

  // Click the Continue button on the services page to navigate to /home/notes
  const continueButton = page.locator('.summary-bar__continue-button');
  await expect(continueButton).toBeVisible();
  await expect(continueButton).toBeEnabled();
  await continueButton.click();
  // Wait for notes form to appear
  await page.locator('.notes').waitFor({ state: 'visible', timeout: 10000 });
  await waitForAngular(page);
}

/** Type text into the notes textarea */
export async function enterNote(page: Page, text: string): Promise<void> {
  const textarea = page.locator('.notes-form__textarea');
  await expect(textarea).toBeVisible();
  await textarea.fill(text);
  await waitForAngular(page);
}

/** Get the character counter text (e.g. "5 / 1000") */
export async function getCharCounter(page: Page): Promise<string> {
  const counter = page.locator('.notes-form__counter');
  return (await counter.textContent() ?? '').trim();
}

/** Get visible service hint texts */
export async function getVisibleHintTexts(page: Page): Promise<string[]> {
  const hints = page.locator('.service-hints__text');
  return hints.allTextContents().then(texts => texts.map(t => t.trim()));
}

/** Click the Continue button on the notes page */
export async function clickNotesContinue(page: Page): Promise<void> {
  const continueButton = page.locator('.notes__continue-button');
  await expect(continueButton).toBeVisible();
  await continueButton.click();
  await waitForAngular(page);
}

/** Click the Back button on the notes page */
export async function clickNotesBack(page: Page): Promise<void> {
  const backButton = page.locator('.notes__back-button');
  await expect(backButton).toBeVisible();
  await backButton.click();
  await waitForAngular(page);
}

// =============================================
// APPOINTMENT SELECTION HELPERS (REQ-006)
// =============================================

/**
 * Navigate to the appointment page via brand -> location -> services -> notes -> appointment.
 * Walks through the full wizard flow to satisfy all guards.
 */
export async function goToAppointmentPage(
  page: Page,
  options?: {
    brandName?: string;
    locationName?: string;
    serviceNames?: string[];
  }
): Promise<void> {
  await goToNotesPage(page, options);

  // Click Continue on notes page to navigate to /home/appointment
  await clickNotesContinue(page);
  // Wait for appointment selection section to appear
  await page.locator('.appointment-selection').waitFor({ state: 'visible', timeout: 10000 });
  await waitForAngular(page);
}

/** Get appointment card count */
export async function getAppointmentCardCount(page: Page): Promise<number> {
  const cards = page.locator('.appointment-card');
  return cards.count();
}

/** Get all appointment card day abbreviation texts (e.g. ['Mo', 'Di', 'Mi', 'Do']) */
export async function getAppointmentDayAbbreviations(page: Page): Promise<string[]> {
  const days = page.locator('.appointment-card__day');
  return days.allTextContents().then(texts => texts.map(t => t.trim()));
}

/** Get all appointment card date texts (e.g. ['25.02.2026', '26.02.2026']) */
export async function getAppointmentDates(page: Page): Promise<string[]> {
  const dates = page.locator('.appointment-card__date');
  return dates.allTextContents().then(texts => texts.map(t => t.trim()));
}

/** Get all appointment card time texts (e.g. ['09:00 Uhr', '10:30 Uhr']) */
export async function getAppointmentTimes(page: Page): Promise<string[]> {
  const times = page.locator('.appointment-card__time');
  return times.allTextContents().then(texts => texts.map(t => t.trim()));
}

/** Select an appointment card by index (0-based) */
export async function selectAppointmentCard(page: Page, index: number): Promise<void> {
  const card = page.locator('.appointment-card').nth(index);
  await expect(card).toBeVisible();
  await card.click();
  await waitForAngular(page);
}

/** Check if an appointment card at the given index is selected */
export async function isAppointmentCardSelected(page: Page, index: number): Promise<boolean> {
  const card = page.locator('.appointment-card').nth(index);
  const classList = await card.getAttribute('class');
  return classList?.includes('appointment-card--selected') ?? false;
}

/** Click the Continue button on the appointment page */
export async function clickAppointmentContinue(page: Page): Promise<void> {
  const continueButton = page.locator('.appointment-selection__continue-button');
  await expect(continueButton).toBeVisible();
  await continueButton.click();
  await waitForAngular(page);
}

/** Click the Back button on the appointment page */
export async function clickAppointmentBack(page: Page): Promise<void> {
  const backButton = page.locator('.appointment-selection__back-button');
  await expect(backButton).toBeVisible();
  await backButton.click();
  await waitForAngular(page);
}

/** Get the calendar link element on the appointment page */
export function getCalendarLink(page: Page) {
  return page.locator('.appointment-selection__calendar-link');
}
