# Feature Documentation: Appointment Selection

**Created:** 2026-02-23
**Requirement:** REQ-006-Terminauswahl
**Language:** EN
**Status:** Implemented

---

## Overview

The appointment selection is the fifth step in the booking wizard. The user selects their preferred day and time from four automatically generated appointment proposals. All appointments are in the future (starting from tomorrow), fall on weekdays (Monday through Saturday, no Sunday), and offer times between 07:00 and 18:00.

The feature follows the Container/Presentational pattern: The `AppointmentSelectionContainerComponent` manages data through the `BookingStore`, while the `AppointmentCardComponent` renders individual appointment cards as a pure presentational component.

---

## User Flow

### Step 1: Open Page

**Description:** After completing the notes page (`/home/notes`), the user reaches the appointment selection (`/home/appointment`). The page displays a heading ("Select your preferred day and time") along with four appointment cards. Each card shows a weekday circle (e.g., "Mi"), the date in DD.MM.YYYY format, and the time (e.g., "09:00 Uhr"). The continue button is initially disabled.

### Step 2: Select Appointment

**Description:** The user clicks on one of the four appointment cards. The selected card receives visual highlighting (colored accent border). Any previously selected card is automatically deselected (single-select). The continue button becomes enabled. Selection is also possible via keyboard (Tab + Enter/Space).

### Step 3: Continue to Next Step

**Description:** After selecting an appointment, the user clicks "Continue". The chosen appointment is saved in the BookingStore and navigation to the next wizard step occurs.

### Alternative: Back to Notes Page

**Description:** Using the "Back" button, the user navigates back to the notes page (`/home/notes`). All previous inputs (brand, location, services, notes) remain preserved in the store.

### Alternative: Workshop Calendar Link

**Description:** The link "Here you can see more available appointments in our workshop calendar" is underlined and clickable, but does not trigger any navigation in the click-dummy (`event.preventDefault()`).

---

## Responsive Views

### Desktop (1280x720)
![Desktop](./screenshots/e2e-responsive-desktop.png)

The four appointment cards are displayed side by side in a single row (4-column layout). The back and continue buttons are positioned at the bottom left and right respectively.

### Tablet (768x1024)
![Tablet](./screenshots/e2e-responsive-tablet.png)

The appointment cards are arranged in a 2x2 grid. All interactive elements remain fully visible and touch-friendly.

### Mobile (375x667)
![Mobile](./screenshots/e2e-responsive-mobile.png)

The appointment cards are stacked vertically in a single column. Buttons are full-width with a minimum touch target size of 2.75em.

---

## Accessibility

- **Keyboard Navigation:** All appointment cards are reachable via Tab and selectable via Enter or Space. The grid uses `role="radiogroup"`, individual cards use `role="radio"` with `aria-checked` attribute.
- **Screen Reader:** Each card has a descriptive `aria-label` in the format "Mo, 25.02.2026, 09:00 Uhr". The weekday circle is hidden with `aria-hidden="true"` since the information is already included in the card's `aria-label`. The grid has its own `aria-label` ("Appointment suggestions").
- **Color Contrast:** WCAG 2.1 AA compliant with at least 4.5:1 contrast ratio.
- **Focus Styles:** `:focus-visible` ring with `var(--color-primary)` outline on cards and buttons.

---

## Technical Details

| Property | Value |
|----------|-------|
| Route | `/#/home/appointment` |
| Container Component | `AppointmentSelectionContainerComponent` |
| Presentational Component | `AppointmentCardComponent` |
| Store | `BookingStore` (providedIn: 'root') |
| API Service | `AppointmentApiService` |
| Guard | `servicesSelectedGuard` |
| Resolver | `appointmentsResolver` |
| Change Detection | OnPush |
| i18n Keys | `booking.appointment.*` |
