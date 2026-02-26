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

// =============================================
// WORKSHOP CALENDAR HELPERS (REQ-008)
// =============================================

/**
 * Navigate to the workshop calendar page via the full wizard flow:
 * Brand -> Location -> Services -> Notes -> Appointment -> Calendar Link Click.
 * Walks through all steps to satisfy guards.
 */
export async function goToWorkshopCalendarPage(
  page: Page,
  options?: {
    brandName?: string;
    locationName?: string;
    serviceNames?: string[];
  }
): Promise<void> {
  await goToAppointmentPage(page, options);

  // Click the calendar link on the appointment page to navigate to /home/workshop-calendar
  const calendarLink = getCalendarLink(page);
  await expect(calendarLink).toBeVisible();
  await calendarLink.click();
  // Wait for workshop calendar section to appear
  await page.locator('.workshop-calendar').waitFor({ state: 'visible', timeout: 10000 });
  await waitForAngular(page);
}

/** Open the MatDatepicker on the workshop calendar page and select today's date */
export async function openDatePickerAndSelectToday(page: Page): Promise<void> {
  // Click the datepicker toggle button to open the calendar
  const toggle = page.locator('mat-datepicker-toggle button');
  await expect(toggle).toBeVisible();
  await toggle.click();
  await waitForAngular(page);

  // Click the today button in the datepicker calendar (it has class .mat-calendar-body-today)
  const todayCell = page.locator('.mat-calendar-body-today');
  await expect(todayCell).toBeVisible();
  await todayCell.click();
  await waitForAngular(page);
}

/** Open the MatDatepicker and select a specific day (1-31) in the currently visible month */
export async function openDatePickerAndSelectDay(page: Page, dayNumber: number): Promise<void> {
  // Click the datepicker toggle button to open the calendar
  const toggle = page.locator('mat-datepicker-toggle button');
  await expect(toggle).toBeVisible();
  await toggle.click();
  await waitForAngular(page);

  // Click the day cell with the given day number
  const dayCell = page.locator(`.mat-calendar-body-cell`).filter({ hasText: new RegExp(`^\\s*${dayNumber}\\s*$`) });
  // There could be multiple matches (prev/next month), click the first enabled one
  const enabledCells = dayCell.locator(':not(.mat-calendar-body-disabled)');
  const count = await enabledCells.count();
  if (count > 0) {
    await enabledCells.first().click();
  } else {
    await dayCell.first().click();
  }
  await waitForAngular(page);
}

/** Get all time-day headings (e.g. ['Mo, 02.03.2026', 'Di, 03.03.2026', 'Mi, 04.03.2026']) */
export async function getTimeDayHeadings(page: Page): Promise<string[]> {
  const headings = page.locator('.time-day__heading');
  return headings.allTextContents().then(texts => texts.map(t => t.trim()));
}

/** Get all time slot button texts from all days */
export async function getAllTimeSlotTexts(page: Page): Promise<string[]> {
  const slots = page.locator('.time-slot-btn');
  return slots.allTextContents().then(texts => texts.map(t => t.trim()));
}

/** Get time slot button texts for a specific day (0-indexed) */
export async function getTimeSlotsForDay(page: Page, dayIndex: number): Promise<string[]> {
  const dayComponent = page.locator('app-workshop-calendar-day').nth(dayIndex);
  const slots = dayComponent.locator('.time-slot-btn');
  return slots.allTextContents().then(texts => texts.map(t => t.trim()));
}

/** Click a time slot button by its text (e.g. '09:00 Uhr'). Clicks the first match if multiple days have the same slot. */
export async function selectTimeSlot(page: Page, slotText: string): Promise<void> {
  const slot = page.locator('.time-slot-btn', { hasText: slotText }).first();
  await expect(slot).toBeVisible();
  await slot.click();
  await waitForAngular(page);
}

/** Click a time slot button in a specific day (0-indexed) by its text */
export async function selectTimeSlotInDay(page: Page, dayIndex: number, slotText: string): Promise<void> {
  const dayComponent = page.locator('app-workshop-calendar-day').nth(dayIndex);
  const slot = dayComponent.locator('.time-slot-btn', { hasText: slotText });
  await expect(slot).toBeVisible();
  await slot.click();
  await waitForAngular(page);
}

/** Check if a time slot is selected by its text (checks first match) */
export async function isTimeSlotSelected(page: Page, slotText: string): Promise<boolean> {
  const slot = page.locator('.time-slot-btn', { hasText: slotText }).first();
  const classList = await slot.getAttribute('class');
  return classList?.includes('time-slot-btn--selected') ?? false;
}

/** Check if a time slot in a specific day (0-indexed) is selected */
export async function isTimeSlotSelectedInDay(page: Page, dayIndex: number, slotText: string): Promise<boolean> {
  const dayComponent = page.locator('app-workshop-calendar-day').nth(dayIndex);
  const slot = dayComponent.locator('.time-slot-btn', { hasText: slotText });
  const classList = await slot.getAttribute('class');
  return classList?.includes('time-slot-btn--selected') ?? false;
}

/** Click the Back button on the workshop calendar page */
export async function clickWorkshopCalendarBack(page: Page): Promise<void> {
  const backButton = page.locator('.wizard-nav__back-button');
  await expect(backButton).toBeVisible();
  await backButton.click();
  await waitForAngular(page);
}

/** Click the Continue button on the workshop calendar page */
export async function clickWorkshopCalendarContinue(page: Page): Promise<void> {
  const continueButton = page.locator('.wizard-nav__continue-button');
  await expect(continueButton).toBeVisible();
  await continueButton.click();
  await waitForAngular(page);
}

/** Get the hint text shown on the right panel before date selection */
export async function getWorkshopCalendarHintText(page: Page): Promise<string> {
  const hint = page.locator('.right-panel__hint');
  return (await hint.textContent() ?? '').trim();
}

/** Get the intro text shown on the right panel after date selection */
export async function getWorkshopCalendarIntroText(page: Page): Promise<string> {
  const intro = page.locator('.slots__intro');
  return (await intro.textContent() ?? '').trim();
}

// =============================================
// CARINFORMATION HELPERS (REQ-009)
// =============================================

/**
 * Navigate to the carinformation page via the full wizard flow:
 * Brand -> Location -> Services -> Notes -> Appointment -> select appointment -> Continue.
 * Walks through all steps to satisfy all guards.
 */
export async function goToCarinformationPage(
  page: Page,
  options?: {
    brandName?: string;
    locationName?: string;
    serviceNames?: string[];
  }
): Promise<void> {
  await goToAppointmentPage(page, options);

  // Select the first appointment card
  await selectAppointmentCard(page, 0);

  // Click Continue on appointment page to navigate to /home/carinformation
  await clickAppointmentContinue(page);
  // Wait for carinformation container to appear
  await page.locator('.carinformation').waitFor({ state: 'visible', timeout: 10000 });
  await waitForAngular(page);
}

/** Fill the customer form fields */
export async function fillCustomerForm(
  page: Page,
  data: {
    email?: string;
    salutation?: 'mr' | 'ms';
    firstName?: string;
    lastName?: string;
    street?: string;
    postalCode?: string;
    city?: string;
    mobilePhone?: string;
  }
): Promise<void> {
  if (data.email) {
    await page.locator('input[formControlName="email"]').fill(data.email);
  }
  if (data.salutation) {
    await page.locator('mat-select[formControlName="salutation"]').click();
    await waitForAngular(page);
    const optionValue = data.salutation === 'mr' ? 'Herr' : 'Frau';
    await page.locator('mat-option', { hasText: optionValue }).first().click();
    await waitForAngular(page);
  }
  if (data.firstName) {
    await page.locator('input[formControlName="firstName"]').fill(data.firstName);
  }
  if (data.lastName) {
    await page.locator('input[formControlName="lastName"]').fill(data.lastName);
  }
  if (data.street) {
    await page.locator('input[formControlName="street"]').fill(data.street);
  }
  if (data.postalCode) {
    await page.locator('input[formControlName="postalCode"]').fill(data.postalCode);
  }
  if (data.city) {
    await page.locator('input[formControlName="city"]').fill(data.city);
  }
  if (data.mobilePhone) {
    await page.locator('input[formControlName="mobilePhone"]').fill(data.mobilePhone);
  }
  await waitForAngular(page);
}

/** Fill the vehicle form fields */
export async function fillVehicleForm(
  page: Page,
  data: {
    licensePlate?: string;
    mileage?: string;
    vin?: string;
  }
): Promise<void> {
  if (data.licensePlate) {
    await page.locator('input[formControlName="licensePlate"]').fill(data.licensePlate);
  }
  if (data.mileage) {
    await page.locator('input[formControlName="mileage"]').fill(data.mileage);
  }
  if (data.vin) {
    await page.locator('input[formControlName="vin"]').fill(data.vin);
  }
  await waitForAngular(page);
}

/** Check the privacy consent checkbox */
export async function checkPrivacyConsent(page: Page): Promise<void> {
  const checkbox = page.locator('mat-checkbox').first();
  await checkbox.click();
  await waitForAngular(page);
}

/** Click the Continue button on the carinformation page */
export async function clickCarinformationContinue(page: Page): Promise<void> {
  const continueButton = page.locator('.wizard-nav__continue');
  await expect(continueButton).toBeVisible();
  await continueButton.click();
  await waitForAngular(page);
}

/** Click the Back button on the carinformation page */
export async function clickCarinformationBack(page: Page): Promise<void> {
  const backButton = page.locator('.wizard-nav__back');
  await expect(backButton).toBeVisible();
  await backButton.click();
  await waitForAngular(page);
}

/** Fill all form fields with valid test data */
export async function fillAllFormsWithValidData(page: Page): Promise<void> {
  await fillCustomerForm(page, {
    email: 'max@mustermann.de',
    salutation: 'mr',
    firstName: 'Max',
    lastName: 'Mustermann',
    street: 'Musterweg 1',
    postalCode: '30159',
    city: 'Hannover',
    mobilePhone: '017012345678',
  });
  await fillVehicleForm(page, {
    licensePlate: 'B-MS1234',
    mileage: '50000',
    vin: 'WBAPH5C55BA123456',
  });
}
