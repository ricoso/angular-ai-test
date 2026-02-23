# Feature Documentation: Appointment Selection

**Created:** 2026-02-23
**Requirement:** REQ-006-Terminauswahl
**Language:** EN
**Status:** Implemented

---

## Overview

The appointment selection is the fifth step in the booking wizard. The user selects their preferred day and time from four automatically generated appointment proposals. All appointments are in the future (starting from tomorrow), fall on weekdays (Monday through Saturday, no Sunday), and offer times between 07:00 and 18:00. The currently selected appointment is additionally displayed in the shopping cart (header cart dropdown) as a chip with date and time (AC-14).

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

### Cart Integration (AC-14)

**Description:** As soon as an appointment is selected, it appears in the header's cart dropdown as a chip with date and time (e.g., "25.02.2026 - 09:00 Uhr"). When switching appointments, the chip is automatically updated and always displays the currently selected appointment. The display appears below the selected services in the cart dropdown.

---

## Acceptance Criteria

| AC | Description | Status |
|----|-------------|--------|
| AC-1 | Page shows heading "Select your preferred day and time" | Implemented |
| AC-2 | Four appointment proposal cards are displayed | Implemented |
| AC-3 | Each card shows: weekday abbreviation (in circle), date (DD.MM.YYYY), and time (HH:MM Uhr) | Implemented |
| AC-4 | All appointments are in the future (starting from tomorrow) | Implemented |
| AC-5 | No appointment falls on a Sunday | Implemented |
| AC-6 | Times are between 07:00 and 18:00 | Implemented |
| AC-7 | Clicking a card selects the appointment (single-select) | Implemented |
| AC-8 | Selected card shows visual highlighting | Implemented |
| AC-9 | Calendar link is underlined and clickable (no navigation) | Implemented |
| AC-10 | Back button navigates to `/home/notes` | Implemented |
| AC-11 | Continue button saves appointment in BookingStore and navigates forward | Implemented |
| AC-12 | Continue button is disabled without appointment selection | Implemented |
| AC-13 | From `/home/notes`, continue navigates to `/home/appointment` | Implemented |
| AC-14 | Selected appointment is displayed in the cart (header cart dropdown) as a chip | Implemented |

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

---

## i18n Keys

| Key | DE | EN |
|-----|----|----|
| `booking.appointment.title` | Wählen Sie den für Sie passenden Tag und Uhrzeit aus | Select your preferred day and time |
| `booking.appointment.calendarLink` | Hier sehen Sie weitere freie Termine in unserem Werkstattkalender | Here you can see more available appointments in our workshop calendar |
| `booking.appointment.backButton` | Zurück | Back |
| `booking.appointment.continueButton` | Weiter | Continue |
| `booking.appointment.ariaGroupLabel` | Terminvorschläge | Appointment suggestions |
| `booking.appointment.card.ariaLabel` | {{dayAbbr}}, {{date}}, {{time}} | {{dayAbbr}}, {{date}}, {{time}} |
| `header.cart.appointmentLabel` | Termin | Appointment |

---

## Component Architecture

```
AppointmentSelectionContainerComponent (Container)
  ├── inject(BookingStore)
  ├── OnPush Change Detection
  ├── Methods: onAppointmentSelect(), onContinue(), onBack(), onCalendarLinkClick()
  └── Template:
      └── AppointmentCardComponent (Presentational) x4
          ├── input(appointment: AppointmentSlot)
          ├── input(isSelected: boolean)
          └── output(appointmentSelected: EventEmitter)
```

**Store Extension:**
- `appointments: AppointmentSlot[]` -- Available appointment proposals
- `selectedAppointment: AppointmentSlot | null` -- Currently selected appointment
- `hasAppointmentSelected: boolean` -- Computed signal
- `loadAppointments()` -- rxMethod for loading
- `selectAppointment(appointment)` -- Set appointment
- `clearSelectedAppointment()` -- Clear selection
