# Feature Documentation: Booking Overview

**Created:** 2026-03-09
**Requirement:** REQ-010-Buchungsübersicht
**Language:** EN
**Status:** Implemented

---

## Overview

The Booking Overview is the final step in the booking wizard of the online appointment scheduling system. The user is presented with a structured, read-only summary of all inputs made throughout the wizard before submitting the booking request. The page displays four tiles — Desired Appointment, Selected Service, Personal Details, and Price — in a clear 2×2 grid layout (desktop) or single-column stack (mobile). The user can review their details and either navigate back or submit the booking.

### User Story

**As a** customer,
**I want to** review all my details in a clear overview before submitting my booking request,
**so that** I can ensure all data is correct before the appointment is requested.

---

## User Flow

### Step 1: Page Load — Guard Verification

**Description:** When navigating to `/home/booking-overview`, the `bookingOverviewGuard` automatically verifies all 7 required fields in the BookingStore (brand, location, services, appointment, customer info, vehicle info, privacy consent). The page is only displayed when all fields are completely populated. If any data is missing, an automatic redirect to `/home` occurs.

After successful verification, the page displays:
- **Page title:** "Overview"
- **Subtitle:** "Please review your details before submitting the appointment."
- **4 tiles** populated with all store data
- **Navigation bar** with "Back" and "Request Now" buttons

### Step 2: User Reviews Their Details

**Description:** The user reads the four tiles and reviews the desired appointment, selected services, personal details, and total price. All data is displayed read-only from the BookingStore — no input or editing is possible.

| Tile | Displayed Information |
|------|----------------------|
| **Desired Appointment** | Date (e.g., "15.04.2026") and time (e.g., "10:00 Uhr") |
| **Selected Service** | All selected services with variants (e.g., "Tire Change — with Storage") |
| **Personal Details** | Name, street, postal code + city, phone, email, brand, license plate, mileage |
| **Price** | Total price incl. VAT (static click-dummy value: € 89.00) |

### Step 3: User Clicks "Back"

**Description:** The secondary "Back" button (left side of the navigation bar) navigates back to the car information page (`/home/carinformation`). All store data remains unchanged, allowing the user to correct their details and return to the overview afterwards.

### Step 4: User Clicks "Request Now"

**Description:** The primary "Request Now" button (right side of the navigation bar) triggers the simulated booking submission. The system sets `BookingStore.bookingSubmitted = true` and navigates to the booking confirmation page. Since this is a click-dummy, no HTTP request is made.

---

## Responsive Views

### Desktop (≥ 48em / 768px)

The four tiles are displayed in a **2×2 grid**:
- Top left: Desired Appointment
- Top right: Selected Service
- Bottom left: Personal Details
- Bottom right: Price

The navigation bar shows the Back button on the left and the Request Now button on the right (`justify-content: space-between`).

![Desktop View](./screenshots/e2e-responsive-desktop.png)

### Tablet (≥ 48em / 768px)

The layout matches the desktop view with a 2-column grid. The tiles adapt to the available width.

![Tablet View](./screenshots/e2e-responsive-tablet.png)

### Mobile (< 48em / 768px)

All tiles are displayed in a **single-column stack**. The order is preserved: Desired Appointment → Selected Service → Personal Details → Price. The navigation buttons remain side by side.

![Mobile View](./screenshots/e2e-responsive-mobile.png)

---

## Accessibility

- **Keyboard Navigation:** All interactive elements (Back button, Request Now button) are reachable via Tab. Logical tab order follows the visual layout.
- **Screen Reader:** Page heading as `<h1>`, tile titles as `<h2>`. Each tile is marked up as an `<article>` with `aria-labelledby`. The grid has `role="region"` with `aria-label="booking summary"`. The navigation bar has `aria-label="page navigation"`.
- **Color Contrast:** WCAG 2.1 AA compliant — contrast ratio ≥ 4.5:1 for all text.
- **Focus Styles:** Visible `:focus-visible` outlines on all buttons with `outline: 0.1875em solid var(--color-focus-ring)`.
- **Touch Targets:** All buttons have a minimum height of `var(--touch-target-min)` (2.75em / 44px).
- **Aria Labels:** Both navigation buttons have `[attr.aria-label]` with translated text. Icons are marked with `aria-hidden="true"`.

---

## Technical Details

| Property | Value |
|----------|-------|
| Route | `/#/home/booking-overview` |
| Container Component | `BookingOverviewContainerComponent` |
| Store | `BookingStore` (NgRx Signal Store, `providedIn: 'root'`) |
| Guard | `bookingOverviewGuard` (Functional `CanActivateFn`) |
| Change Detection | `OnPush` |
| Lazy Loading | Yes — `loadComponent()` in `booking.routes.ts` |

### Architecture

The feature follows the **Container/Presentational pattern**:

```
BookingOverviewContainerComponent (Container)
├── AppointmentTileComponent      (Presentational — input: appointment)
├── ServicesTileComponent         (Presentational — input: services, serviceLabels, locationName)
├── PersonalDataTileComponent     (Presentational — input: customerInfo, vehicleInfo, brandName)
└── PriceTileComponent            (Presentational — input: totalPriceGross)
```

**Container Component** (`booking-overview-container.component.ts`):
- Injects `BookingStore`, `Router`, and `TranslateService`
- Provides 4 computed signals: `resolvedBrandName`, `resolvedLocationName`, `resolvedServiceLabels`, `staticTotalPrice`
- Contains two methods: `onSubmit()` (submit booking) and `onBack()` (navigate back)

**Presentational Components** (4 tiles):
- Receive data exclusively via `input()` signals
- No `inject()` — no internal logic
- `ChangeDetection.OnPush` throughout

### Data Flow

```
BookingStore (global state)
    ↓ inject()
BookingOverviewContainerComponent
    ↓ computed() signals
    ├── appointment → AppointmentTileComponent
    ├── services + resolvedServiceLabels + resolvedLocationName → ServicesTileComponent
    ├── customerInfo + vehicleInfo + resolvedBrandName → PersonalDataTileComponent
    └── staticTotalPrice → PriceTileComponent
```

### Guard Logic

The `bookingOverviewGuard` verifies all 7 required fields:

| Field | Type | Source |
|-------|------|--------|
| `selectedBrand` | `Brand` | REQ-002 |
| `selectedLocation` | `LocationDisplay` | REQ-003 |
| `selectedServices` | `SelectedService[]` (≥ 1) | REQ-004 |
| `selectedAppointment` | `AppointmentSlot` | REQ-006 |
| `customerInfo` | `CustomerInfo` | REQ-009 |
| `vehicleInfo` | `VehicleInfo` | REQ-009 |
| `privacyConsent` | `boolean` (`=== true`) | REQ-009 |

If any field is missing: redirect to `/home` via `router.createUrlTree(['/home'])`.

### Material Components

- `MatCard`-like layout for each tile (custom `.summary-card` with surface background)
- `MatButton` (`mat-flat-button`) for both navigation buttons
- `MatIcon` with `.icon-framed` for tile header icons (event, build, person, euro)

### File Structure

```
src/app/features/booking/
├── guards/
│   └── booking-overview.guard.ts
├── stores/
│   └── booking.store.ts                    # bookingSubmitted, submitBooking(), isBookingComplete
├── components/
│   └── booking-overview/
│       ├── booking-overview-container.component.ts
│       ├── booking-overview-container.component.html
│       ├── booking-overview-container.component.scss
│       └── components/
│           ├── appointment-tile/
│           │   ├── appointment-tile.component.ts
│           │   ├── appointment-tile.component.html
│           │   └── appointment-tile.component.scss
│           ├── services-tile/
│           │   ├── services-tile.component.ts
│           │   ├── services-tile.component.html
│           │   └── services-tile.component.scss
│           ├── personal-data-tile/
│           │   ├── personal-data-tile.component.ts
│           │   ├── personal-data-tile.component.html
│           │   └── personal-data-tile.component.scss
│           └── price-tile/
│               ├── price-tile.component.ts
│               ├── price-tile.component.html
│               └── price-tile.component.scss
└── booking.routes.ts
```
