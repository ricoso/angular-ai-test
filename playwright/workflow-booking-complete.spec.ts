import { expect, test } from '@playwright/test';

import { getCurrentRoute, navigateTo, setLanguage, waitForAngular } from './helpers/app.helpers';
import {
  clickAppointmentBack,
  clickLocationBack,
  clickNotesBack,
  clickNotesContinue,
  clickServiceBack,
  clickWorkshopCalendarBack,
  completeBrandToLocationFlow,
  enterNote,
  getAppointmentCardCount,
  getCalendarLink,
  getCharCounter,
  getBrandButtonTexts,
  getLocationButtonTexts,
  getPageTitle,
  getServiceCardTitles,
  getTimeDayHeadings,
  goToAppointmentPage,
  goToBrandSelection,
  goToNotesPage,
  goToServiceSelection,
  goToWorkshopCalendarPage,
  isAppointmentCardSelected,
  isTimeSlotSelected,
  openDatePickerAndSelectToday,
  selectAppointmentCard,
  selectBrand,
  selectLocation,
  selectService,
  selectTimeSlot,
} from './helpers/booking.helpers';

/**
 * COMPLETE BOOKING WORKFLOW
 *
 * End-to-End flow through all implemented wizard steps:
 *   REQ-001 (Header) -> REQ-002 (Brand Selection) -> REQ-003 (Location Selection)
 *   -> REQ-004 (Service Selection) -> REQ-005 (Notes) -> REQ-006 (Appointment Selection)
 *   -> REQ-008 (Workshop Calendar)
 *
 * Tests the full user journey including:
 * - Header always visible
 * - Brand selection -> Location selection -> Service selection -> Notes -> Appointment -> Workshop Calendar
 * - Language switching during the flow
 * - Alternative flows (back navigation, brand change)
 * - Guards and redirects
 */

test.describe('Complete Booking Workflow', () => {

  // =============================================
  // HAPPY PATH — Full Flow
  // =============================================

  test.describe('Happy Path', () => {

    test('complete flow: Start -> Brand -> Location -> Services -> Notes -> Appointment', async ({ page }) => {
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
      await expect(companyName).toContainText('Autohaus GmbH');

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

      // Step 11: REQ-005 — Click Continue on services page to go to notes
      const servicesContinueButton = page.locator('.summary-bar__continue-button');
      await expect(servicesContinueButton).toBeVisible();
      await expect(servicesContinueButton).toBeEnabled();
      await servicesContinueButton.click();
      await page.locator('.notes').waitFor({ state: 'visible', timeout: 10000 });
      await waitForAngular(page);

      const notesRoute = await getCurrentRoute(page);
      expect(notesRoute).toBe('/home/notes');

      const notesTitle = await getPageTitle(page);
      expect(notesTitle).toBe('Bitte geben Sie uns weitere Hinweise zu Ihrer Buchung');

      // Step 12: Verify notes form elements
      const textarea = page.locator('.notes-form__textarea');
      await expect(textarea).toBeVisible();

      const counter = await getCharCounter(page);
      expect(counter).toBe('0 / 1000');

      // Step 13: Verify hints section
      const hintsTitle = page.locator('.service-hints__title');
      await expect(hintsTitle).toBeVisible();

      // Step 14: Enter a note
      await enterNote(page, 'Bitte Öl prüfen.');
      const updatedCounter = await getCharCounter(page);
      // "Bitte Öl prüfen." = 16 characters
      expect(updatedCounter).toBe('16 / 1000');

      // Step 15: Click continue on notes -> navigate to appointment
      await clickNotesContinue(page);
      await page.locator('.appointment-selection').waitFor({ state: 'visible', timeout: 10000 });
      await waitForAngular(page);

      // Step 16: REQ-006 — Verify appointment page loaded
      const appointmentRoute = await getCurrentRoute(page);
      expect(appointmentRoute).toBe('/home/appointment');

      const appointmentTitle = await getPageTitle(page);
      expect(appointmentTitle).toBe('Wählen Sie den für Sie passenden Tag und Uhrzeit aus');

      // Step 17: Verify 4 appointment cards
      const appointmentCardCount = await getAppointmentCardCount(page);
      expect(appointmentCardCount).toBe(4);

      // Step 18: Select first appointment
      await selectAppointmentCard(page, 0);
      expect(await isAppointmentCardSelected(page, 0)).toBe(true);

      // Step 19: Header still visible on appointment page
      await expect(header).toBeVisible();
      await expect(companyName).toContainText('Autohaus GmbH');

      // Step 20: REQ-008 — Click calendar link to navigate to workshop calendar
      const calendarLink = getCalendarLink(page);
      await expect(calendarLink).toBeVisible();
      await calendarLink.click();
      await page.locator('.workshop-calendar').waitFor({ state: 'visible', timeout: 10000 });
      await waitForAngular(page);

      const workshopRoute = await getCurrentRoute(page);
      expect(workshopRoute).toBe('/home/workshop-calendar');

      const workshopTitle = await getPageTitle(page);
      expect(workshopTitle).toBe('Hier sehen Sie weitere freie Termine in unserem Werkstattkalender');

      // Step 21: Select date via datepicker
      await openDatePickerAndSelectToday(page);

      // Step 22: Verify 3 days with time slots
      const dayHeadings = await getTimeDayHeadings(page);
      expect(dayHeadings).toHaveLength(3);

      // Step 23: Select a time slot
      await selectTimeSlot(page, '09:00 Uhr');
      expect(await isTimeSlotSelected(page, '09:00 Uhr')).toBe(true);

      // Step 24: Header still visible on workshop calendar page
      await expect(header).toBeVisible();
      await expect(companyName).toContainText('Autohaus GmbH');
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

    test('flow: Notes -> Back to Services', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToNotesPage(page);

      const notesRoute = await getCurrentRoute(page);
      expect(notesRoute).toBe('/home/notes');

      // Click back button on notes page
      await clickNotesBack(page);

      const servicesRoute = await getCurrentRoute(page);
      expect(servicesRoute).toBe('/home/services');

      const servicesTitle = await getPageTitle(page);
      expect(servicesTitle).toBe('Welche Services möchten Sie buchen?');
    });

    test('flow: Appointment -> Back to Notes', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToAppointmentPage(page);

      const appointmentRoute = await getCurrentRoute(page);
      expect(appointmentRoute).toBe('/home/appointment');

      // Click back button on appointment page
      await clickAppointmentBack(page);

      const notesRoute = await getCurrentRoute(page);
      expect(notesRoute).toBe('/home/notes');

      const notesTitle = await getPageTitle(page);
      expect(notesTitle).toBe('Bitte geben Sie uns weitere Hinweise zu Ihrer Buchung');
    });

    test('flow: Workshop Calendar -> Back to Appointment', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToWorkshopCalendarPage(page);

      const workshopRoute = await getCurrentRoute(page);
      expect(workshopRoute).toBe('/home/workshop-calendar');

      // Click back button on workshop calendar page
      await clickWorkshopCalendarBack(page);

      const appointmentRoute = await getCurrentRoute(page);
      expect(appointmentRoute).toBe('/home/appointment');

      const appointmentTitle = await getPageTitle(page);
      expect(appointmentTitle).toBe('Wählen Sie den für Sie passenden Tag und Uhrzeit aus');
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

    test('direct access to /home/notes without prerequisites -> redirect', async ({ page }) => {
      await navigateTo(page, '/home/notes');
      await waitForAngular(page);

      const route = await getCurrentRoute(page);
      // Guard checks brand first -> /home/brand
      expect(route).not.toBe('/home/notes');
      expect(route).toMatch(/\/home\/(brand|location|services)/);
    });

    test('direct access to /home/appointment without prerequisites -> redirect', async ({ page }) => {
      await navigateTo(page, '/home/appointment');
      await waitForAngular(page);

      const route = await getCurrentRoute(page);
      // Guard checks brand first -> /home/brand
      expect(route).not.toBe('/home/appointment');
      expect(route).toMatch(/\/home\/(brand|location|services)/);
    });

    test('direct access to /home/workshop-calendar without prerequisites -> redirect', async ({ page }) => {
      await navigateTo(page, '/home/workshop-calendar');
      await waitForAngular(page);

      const route = await getCurrentRoute(page);
      // Guard checks services -> redirect
      expect(route).not.toBe('/home/workshop-calendar');
      expect(route).toMatch(/\/home\/(brand|location|services)/);
    });

  });

  // =============================================
  // i18n — Language through complete flow
  // =============================================

  test.describe('i18n — Language through flow', () => {

    test('EN: complete flow with English language including services, notes, appointment, and workshop calendar', async ({ page }) => {
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

      // Select a service and click Continue to navigate to notes
      await selectService(page, 'HU/AU');
      const enContinueButton = page.locator('.summary-bar__continue-button');
      await expect(enContinueButton).toBeVisible();
      await expect(enContinueButton).toBeEnabled();
      await enContinueButton.click();
      await page.locator('.notes').waitFor({ state: 'visible', timeout: 10000 });
      await waitForAngular(page);

      const notesTitle = await getPageTitle(page);
      expect(notesTitle).toBe('Please provide further notes for your booking');

      const backButton = page.locator('.notes__back-button');
      await expect(backButton).toContainText('Back');

      const continueButton = page.locator('.notes__continue-button');
      await expect(continueButton).toContainText('Continue');

      // Navigate through to appointment and workshop calendar
      await continueButton.click();
      await page.locator('.appointment-selection').waitFor({ state: 'visible', timeout: 10000 });
      await waitForAngular(page);

      const appointmentTitle = await getPageTitle(page);
      expect(appointmentTitle).toBe('Select your preferred day and time');

      // Click calendar link to go to workshop calendar
      const calendarLink = getCalendarLink(page);
      await calendarLink.click();
      await page.locator('.workshop-calendar').waitFor({ state: 'visible', timeout: 10000 });
      await waitForAngular(page);

      // REQ-008: English title
      const workshopTitle = await getPageTitle(page);
      expect(workshopTitle).toBe('Here you can see further available appointments in our workshop calendar');

      // English Back/Continue buttons
      const workshopBack = page.locator('.wizard-nav__back-button');
      await expect(workshopBack).toContainText('Back');

      const workshopContinue = page.locator('.wizard-nav__continue-button');
      await expect(workshopContinue).toContainText('Continue');
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

    test('header stays visible through brand -> location -> services -> notes -> appointment -> workshop calendar flow', async ({ page }) => {
      const header = page.locator('header[role="banner"]');
      const companyName = page.locator('.header__company-name');

      await navigateTo(page, '/home/brand');
      await expect(header).toBeVisible();
      await expect(companyName).toContainText('Autohaus GmbH');

      await selectBrand(page, 'Audi');
      await expect(header).toBeVisible();
      await expect(companyName).toContainText('Autohaus GmbH');

      await selectLocation(page, 'München');
      await waitForAngular(page);

      // Header visible on services page
      await expect(header).toBeVisible();
      await expect(companyName).toContainText('Autohaus GmbH');

      // Select a service and click Continue to go to notes
      await selectService(page, 'HU/AU');
      const headerContinueButton = page.locator('.summary-bar__continue-button');
      await expect(headerContinueButton).toBeVisible();
      await expect(headerContinueButton).toBeEnabled();
      await headerContinueButton.click();
      await page.locator('.notes').waitFor({ state: 'visible', timeout: 10000 });
      await waitForAngular(page);

      // Header visible on notes page
      await expect(header).toBeVisible();
      await expect(companyName).toContainText('Autohaus GmbH');

      // Click Continue on notes to go to appointment
      const notesContinueButton = page.locator('.notes__continue-button');
      await notesContinueButton.click();
      await page.locator('.appointment-selection').waitFor({ state: 'visible', timeout: 10000 });
      await waitForAngular(page);

      // Header visible on appointment page
      await expect(header).toBeVisible();
      await expect(companyName).toContainText('Autohaus GmbH');

      // Click calendar link to go to workshop calendar
      const calendarLink = getCalendarLink(page);
      await calendarLink.click();
      await page.locator('.workshop-calendar').waitFor({ state: 'visible', timeout: 10000 });
      await waitForAngular(page);

      // Header visible on workshop calendar page
      await expect(header).toBeVisible();
      await expect(companyName).toContainText('Autohaus GmbH');
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

    test('cart icon visible on all pages including services and notes', async ({ page }) => {
      const cartButton = page.locator('.cart-icon__button');

      await navigateTo(page, '/home/brand');
      await expect(cartButton).toBeVisible();

      await selectBrand(page, 'Audi');
      await expect(cartButton).toBeVisible();

      await selectLocation(page, 'München');
      await waitForAngular(page);
      await expect(cartButton).toBeVisible();

      // Select service and click Continue to navigate to notes
      await selectService(page, 'HU/AU');
      const cartContinueButton = page.locator('.summary-bar__continue-button');
      await expect(cartContinueButton).toBeVisible();
      await expect(cartContinueButton).toBeEnabled();
      await cartContinueButton.click();
      await page.locator('.notes').waitFor({ state: 'visible', timeout: 10000 });
      await waitForAngular(page);
      await expect(cartButton).toBeVisible();
    });

  });

  // =============================================
  // REQ-007: WIZARD STATE SYNC — Back Navigation with Store Reset
  // =============================================

  test.describe('REQ-007: Wizard State Sync — Back Navigation', () => {

    test('complete backward navigation: Appointment -> Notes -> Services -> Location -> Brand', async ({ page }) => {
      await setLanguage(page, 'de');

      // Walk the full wizard forward
      await goToAppointmentPage(page);
      await selectAppointmentCard(page, 0);

      // Now navigate all the way back
      // Step 1: Appointment -> Notes (clears selectedAppointment)
      await clickAppointmentBack(page);
      expect(await getCurrentRoute(page)).toBe('/home/notes');

      // Step 2: Notes -> Services (clears bookingNote)
      await clickNotesBack(page);
      expect(await getCurrentRoute(page)).toBe('/home/services');

      // Step 3: Services -> Location (clears selectedServices)
      await clickServiceBack(page);
      expect(await getCurrentRoute(page)).toBe('/home/location');

      // Step 4: Location -> Brand (clears selectedLocation)
      await clickLocationBack(page);
      expect(await getCurrentRoute(page)).toBe('/home/brand');

      // Verify brand page renders
      const title = await getPageTitle(page);
      expect(title).toBe('Welche Fahrzeugmarke fahren Sie?');
    });

    test('guard redirect after complete backward navigation: /home/appointment -> redirected', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToAppointmentPage(page);

      // Navigate all the way back
      await clickAppointmentBack(page);
      await clickNotesBack(page);
      await clickServiceBack(page);
      await clickLocationBack(page);
      expect(await getCurrentRoute(page)).toBe('/home/brand');

      // Direct access to /home/appointment should redirect
      await navigateTo(page, '/home/appointment');
      await waitForAngular(page);

      const route = await getCurrentRoute(page);
      expect(route).not.toBe('/home/appointment');
      expect(route).toMatch(/\/home\/(brand|location)/);
    });

    test('partial back then forward: appointment reset requires re-selection', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToAppointmentPage(page);

      // Select appointment
      await selectAppointmentCard(page, 0);
      expect(await isAppointmentCardSelected(page, 0)).toBe(true);

      // Back to notes (clears selectedAppointment)
      await clickAppointmentBack(page);
      expect(await getCurrentRoute(page)).toBe('/home/notes');

      // Forward from notes back to appointment
      await clickNotesContinue(page);
      await page.locator('.appointment-selection').waitFor({ state: 'visible', timeout: 10000 });
      await waitForAngular(page);

      // No appointment should be pre-selected
      const selectedCards = page.locator('.appointment-card--selected');
      expect(await selectedCards.count()).toBe(0);
    });

    test('cart badge resets when services are cleared via back navigation', async ({ page }) => {
      await setLanguage(page, 'de');
      await goToNotesPage(page, { serviceNames: ['HU/AU', 'Inspektion'] });

      const badge = page.locator('.cart-icon__button .mat-badge-content');
      await expect(badge).toHaveText('2');

      // Back from notes (clears bookingNote, badge stays 2)
      await clickNotesBack(page);
      await expect(badge).toHaveText('2');

      // Back from services (clears selectedServices, badge disappears)
      await clickServiceBack(page);
      await expect(badge).toBeHidden();
    });

    test('header stays visible during backward navigation including workshop calendar', async ({ page }) => {
      await setLanguage(page, 'de');
      const header = page.locator('header[role="banner"]');

      await goToWorkshopCalendarPage(page);
      await expect(header).toBeVisible();

      // Workshop Calendar -> Appointment
      await clickWorkshopCalendarBack(page);
      await expect(header).toBeVisible();

      await clickAppointmentBack(page);
      await expect(header).toBeVisible();

      await clickNotesBack(page);
      await expect(header).toBeVisible();

      await clickServiceBack(page);
      await expect(header).toBeVisible();

      await clickLocationBack(page);
      await expect(header).toBeVisible();
    });

  });

});
