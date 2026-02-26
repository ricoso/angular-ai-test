# Feature Documentation: Workshop Calendar

**Created:** 2026-02-26
**Requirement:** REQ-008-Werkstattkalender
**Language:** EN
**Status:** Implemented

---

## Overview

The Workshop Calendar allows the user to select an individual desired date for their workshop visit. Unlike the standard appointment selection (REQ-006), the workshop calendar provides a free date selection via a calendar (DatePicker). After selecting a date, the next 3 workdays (Monday to Saturday, no Sunday) are displayed with 11 hourly time slots each (07:00 to 17:00). The user can select a single time slot and then navigate to the next step in the booking process.

The page is accessible via the link "Here you can see further available appointments in our workshop calendar" on the appointment selection page (REQ-006).

---

## User Guide

### Step 1: Page loads

![Desktop View](./screenshots/e2e-responsive-desktop.png)

**Description:** When the page loads, the user sees a two-column layout. On the left side, there is a card with the heading "Here you can see further available appointments in our workshop calendar", a description text "Select your desired date. We will show you all available appointments from that day onwards.", the label "Your desired date:" and an empty input field with the placeholder "Select desired date" along with a calendar icon. On the right side, the hint text "Select a desired date in the calendar and we will show you the next available appointments" is displayed. No time slots are visible yet.

### Step 2: User clicks on the input field

**Description:** When the user clicks on the "Select desired date" input field, a Material DatePicker opens. The current date is set as the minimum date, so past days cannot be selected. Alternatively, the user can manually enter a date in the format DD.MM.YYYY.

### Step 3: User selects a date

**Description:** After selecting a date in the DatePicker or entering it manually, the following happens:
- The selected date appears in the input field.
- The text on the right side changes to: "We found the following available appointments from your selected date. Click on a time to select the appointment."
- The system calculates the next 3 workdays (Mon-Sat, no Sunday) from the selected date.
- For each workday, 11 hourly time slots from 07:00 to 17:00 are displayed.
- Each day block has a heading in the format "Mon, 02.03.2026".

### Step 4: User selects a time

**Description:** The user clicks on one of the displayed time slots (e.g. "09:00 Uhr"). The selected slot is visually highlighted (colored border and background). Only one slot can be selected at a time (single-select, also across days). After selection, the "Continue" button becomes enabled. The selected appointment is saved in the BookingStore as `selectedAppointment`.

### Step 5: User clicks "Continue"

**Description:** The enabled "Continue" button navigates to the next wizard step. The "Back" button returns to the appointment selection page (`/home/appointment`). As long as no time slot is selected, the "Continue" button remains disabled.

---

## Responsive Views

### Desktop (1280x720)
![Desktop](./screenshots/e2e-responsive-desktop.png)

The desktop layout shows a two-column view: the card with DatePicker on the left, the time slots on the right. The time slot grid is displayed in 4 columns.

### Tablet (768x1024)
![Tablet](./screenshots/e2e-responsive-tablet.png)

In the tablet layout, the two-column view is maintained. The left card has a width of approximately 18em. The time slots are also displayed in 4 columns.

### Mobile (375x667)
![Mobile](./screenshots/e2e-responsive-mobile.png)

In the mobile layout, both sections are stacked vertically in a single column. The time slots are displayed in a 2-column grid to ensure comfortable touch operation.

---

## Accessibility

- **Keyboard Navigation:** All time slots are reachable via the Tab key and can be selected with Enter or Space. The DatePicker is fully keyboard accessible.
- **Screen Reader:** The right panel with time slots has `aria-live="polite"`, so content changes (switching from hint text to time slots) are announced to the screen reader. Each day block has an `aria-label` with the available times.
- **Color Contrast:** WCAG 2.1 AA compliant with a minimum contrast ratio of 4.5:1.
- **Focus Styles:** All interactive elements show a clearly visible focus ring on `:focus-visible`.
- **Touch Targets:** All time slot buttons have a minimum size of 2.75em for comfortable touch interaction.

---

## Technical Details

| Property | Value |
|----------|-------|
| Route | `/#/home/workshop-calendar` |
| Container Component | `WorkshopCalendarContainerComponent` |
| Presentational Components | `WorkshopCalendarDatePickerComponent`, `WorkshopCalendarDayComponent` |
| Store | `BookingStore` (extended with `workshopCalendarDate`, `workshopCalendarDays`) |
| API Service | `WorkshopCalendarApiService` |
| Guard | `servicesSelectedGuard` |
| Models | `WorkshopTimeSlot`, `WorkshopCalendarDay`, `WorkshopCalendarViewState` |
