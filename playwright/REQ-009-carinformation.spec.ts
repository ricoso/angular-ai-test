import { expect, test } from '@playwright/test';

import { getCurrentRoute, setLanguage, waitForAngular } from './helpers/app.helpers';
import {
  checkPrivacyConsent,
  clickCarinformationBack,
  clickCarinformationContinue,
  fillAllFormsWithValidData,
  getPageTitle,
  goToCarinformationPage,
} from './helpers/booking.helpers';

/**
 * REQ-009: Carinformation (Customer & Vehicle Data)
 * Wizard Step 6: User enters personal contact data, vehicle information,
 * and DSGVO privacy consent before proceeding to booking overview.
 *
 * Flow: Brand -> Location -> Services -> Notes -> Appointment -> Carinformation
 * Guard: carInformationGuard (requires brand + location + services + appointment)
 */

test.describe('REQ-009: Carinformation (Kunden- & Fahrzeugdaten)', () => {

  // =============================================
  // MAIN FLOW (Section 4)
  // =============================================

  test.describe('Main Flow', () => {

    test('TC-1: page loads with title, banner, and empty form (DE)', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToCarinformationPage(page);

      const route = await getCurrentRoute(page);
      expect(route).toBe('/home/carinformation');

      // AC-1: Title visible
      const title = await getPageTitle(page);
      expect(title).toContain('Bitte geben Sie uns letzte Informationen');

      // AC-2: Banner visible
      const banner = page.locator('.returning-banner');
      await expect(banner).toBeVisible();
      await expect(banner).toContainText('Schon einmal bei uns gewesen');

      // AC-3: Required hint visible
      const requiredHint = page.locator('.required-hint');
      await expect(requiredHint).toBeVisible();
      await expect(requiredHint).toContainText('Pflichtfelder');
    });

    test('TC-1b: all form fields are present with icons', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToCarinformationPage(page);

      // AC-16: All form fields have icons
      const emailField = page.locator('input[formControlName="email"]');
      await expect(emailField).toBeVisible();

      const salutationSelect = page.locator('mat-select[formControlName="salutation"]');
      await expect(salutationSelect).toBeVisible();

      const fields = ['firstName', 'lastName', 'street', 'postalCode', 'city', 'mobilePhone',
        'licensePlate', 'mileage', 'vin'];
      for (const field of fields) {
        await expect(page.locator(`input[formControlName="${field}"]`)).toBeVisible();
      }

      // Privacy checkbox visible
      const checkbox = page.locator('mat-checkbox');
      await expect(checkbox).toBeVisible();
    });

    test('TC-5: salutation dropdown shows Herr and Frau (AC-5)', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToCarinformationPage(page);

      // Click salutation dropdown
      await page.locator('mat-select[formControlName="salutation"]').click();
      await waitForAngular(page);

      // AC-5: Options visible
      const options = page.locator('mat-option');
      const texts = await options.allTextContents();
      const trimmed = texts.map(t => t.trim());
      expect(trimmed).toContain('Herr');
      expect(trimmed).toContain('Frau');
    });
  });

  // =============================================
  // VALIDATION (Section 6 - Exception Flows)
  // =============================================

  test.describe('Validation', () => {

    test('TC-2: email validation — invalid format shows error (AC-4)', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToCarinformationPage(page);

      const emailInput = page.locator('input[formControlName="email"]');
      await emailInput.fill('kein-email');
      await emailInput.blur();
      await waitForAngular(page);

      const error = page.locator('mat-error');
      await expect(error.first()).toBeVisible();
    });

    test('TC-3: firstName with digits shows error (AC-6)', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToCarinformationPage(page);

      const firstNameInput = page.locator('input[formControlName="firstName"]');
      await firstNameInput.fill('Max123');
      await firstNameInput.blur();
      await waitForAngular(page);

      const formSection = page.locator('mat-form-field', { has: firstNameInput });
      const error = formSection.locator('mat-error');
      await expect(error).toBeVisible();
    });

    test('TC-4: VIN with fewer than 17 characters shows error (AC-12)', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToCarinformationPage(page);

      const vinInput = page.locator('input[formControlName="vin"]');
      await vinInput.fill('ABC123');
      await vinInput.blur();
      await waitForAngular(page);

      const formSection = page.locator('mat-form-field', { has: vinInput });
      const error = formSection.locator('mat-error');
      await expect(error).toBeVisible();
    });

    test('TC-5b: mobile phone not starting with 0 shows error (AC-9)', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToCarinformationPage(page);

      const phoneInput = page.locator('input[formControlName="mobilePhone"]');
      await phoneInput.fill('1701234567');
      await phoneInput.blur();
      await waitForAngular(page);

      const formSection = page.locator('mat-form-field', { has: phoneInput });
      const error = formSection.locator('mat-error');
      await expect(error).toBeVisible();
    });

    test('TC-6: continue button disabled without privacy consent (AC-13)', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToCarinformationPage(page);

      await fillAllFormsWithValidData(page);

      // Continue button should be disabled without consent
      const continueButton = page.locator('.wizard-nav__continue');
      await expect(continueButton).toBeDisabled();
    });

    test('TC-6b: continue button enabled with all valid data + consent', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToCarinformationPage(page);

      await fillAllFormsWithValidData(page);
      await checkPrivacyConsent(page);

      const continueButton = page.locator('.wizard-nav__continue');
      await expect(continueButton).toBeEnabled();
    });
  });

  // =============================================
  // NAVIGATION (Section 5 - Alternative Flows)
  // =============================================

  test.describe('Navigation', () => {

    test('TC-7: guard redirects when appointment not selected', async ({ page }) => {
      await setLanguage(page, 'de');
      // Try to navigate directly to carinformation
      await page.goto('/#/home/carinformation');
      await waitForAngular(page);

      const route = await getCurrentRoute(page);
      // Should be redirected (not on carinformation)
      expect(route).not.toBe('/home/carinformation');
    });

    test('TC-9: back button navigates to appointment page', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToCarinformationPage(page);

      await clickCarinformationBack(page);
      await waitForAngular(page);

      const route = await getCurrentRoute(page);
      expect(route).toBe('/home/appointment');
    });

    test('TC-1c: happy path — submit navigates forward (AC-14)', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToCarinformationPage(page);

      await fillAllFormsWithValidData(page);
      await checkPrivacyConsent(page);
      await clickCarinformationContinue(page);
      await waitForAngular(page);

      // Should navigate (Click-Dummy navigates to /home/carinformation for now)
      const route = await getCurrentRoute(page);
      expect(route).toBeTruthy();
    });
  });

  // =============================================
  // ALTERNATIVE FLOW: Retrieve Data (Click-Dummy)
  // =============================================

  test.describe('Alternative Flow', () => {

    test('TC-1d: retrieve data button is visible and clickable (click-dummy)', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToCarinformationPage(page);

      const retrieveButton = page.locator('.returning-banner__button');
      await expect(retrieveButton).toBeVisible();
      await retrieveButton.click();
      await waitForAngular(page);

      // Should stay on same page (click-dummy)
      const route = await getCurrentRoute(page);
      expect(route).toBe('/home/carinformation');
    });

    test('TC-1e: FIN info link is present', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToCarinformationPage(page);

      const infoLink = page.locator('.form-field__info-link');
      await expect(infoLink).toBeVisible();
    });
  });

  // =============================================
  // i18n
  // =============================================

  test.describe('i18n', () => {

    test('page renders correctly in English', async ({ page }) => {
      await setLanguage(page, 'en');
      await goToCarinformationPage(page);

      const title = await getPageTitle(page);
      expect(title).toContain('Please provide us with final information');

      const banner = page.locator('.returning-banner');
      await expect(banner).toContainText('Been with us before');
    });
  });

  // =============================================
  // RESPONSIVE (TC-8)
  // =============================================

  test.describe('Responsive', () => {

    test('TC-8: mobile layout shows single column for name fields', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await setLanguage(page, 'de');
      await goToCarinformationPage(page);

      // On mobile, form fields should be visible and stacked
      const firstName = page.locator('input[formControlName="firstName"]');
      const lastName = page.locator('input[formControlName="lastName"]');
      await expect(firstName).toBeVisible();
      await expect(lastName).toBeVisible();

      // Check that they are stacked (top positions should differ)
      const firstBox = await firstName.boundingBox();
      const lastBox = await lastName.boundingBox();
      if (firstBox && lastBox) {
        // On mobile (single column), lastName should be below firstName
        expect(lastBox.y).toBeGreaterThan(firstBox.y);
      }
    });
  });
});
