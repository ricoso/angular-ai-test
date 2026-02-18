# Feature Documentation: Service Selection

**Created:** 2026-02-18
**Requirement:** REQ-004-Serviceauswahl
**Language:** EN
**Status:** Implemented

---

## Overview

The service selection is **step 3 in the booking wizard** (Brand -> Location -> **Services** -> ...). The user selects one or more services for their vehicle from three available options: HU/AU (vehicle inspection), Inspection, and Tire Change. The selection is made through interactive service cards in a responsive grid layout. For tire changes, additional sub-variants (with/without storage) are available, selected via radio buttons directly on the card. A summary bar with Back and Continue buttons enables navigation within the wizard.

---

## User Guide

### Step 1: Page Load

**Description:** When navigating to the route `/#/home/services`, a guard checks whether a brand and a location are present in the BookingStore. If so, the three service cards (HU/AU, Inspection, Tire Change) are displayed in a grid layout. Above the cards, the heading "Which services would you like to book?" is shown. Each card displays a title, a centered icon with frame, and a description text. Below the cards, a row contains the "back" button (left) and the "continue" button (right).

### Step 2: Select a Service (e.g. HU/AU)

**Description:** The user clicks on a service card, e.g. "HU/AU". The card is marked as selected: A checkmark icon appears in the top-right corner of the card and the card receives a colored border. In the header cart, the selected service is displayed as a chip with icon and a count badge appears.

### Step 3: Select Another Service (Multi-Select)

**Description:** The user can click additional service cards, e.g. "Inspection". Multiple services can be selected simultaneously (multi-select). Each selected card shows a checkmark and a border. The header cart automatically updates the count and displays all selected services as chips. Clicking an already selected card again deselects the service.

### Step 4: Select Tire Change with Variant

**Description:** The tire change card differs from the other cards: It additionally contains two radio buttons ("Tire change without storage" and "Tire change with storage") as well as a "Confirm" button directly on the card. The user first selects a variant via radio button and then clicks "Confirm". The card is then marked as selected and the button text changes to "Deselect". The service can be deselected again via the "Deselect" button.

### Step 5: Click Continue

**Description:** After at least one service has been selected, the user clicks the "continue" button below the service cards (right side of the button row). The system saves the selected services with their variants in the BookingStore and navigates to the next wizard step. If no service is selected, the "continue" button remains disabled. Via the "back" button (left), the user can return to the location selection.

---

## Responsive Views

### Desktop (1280x720)
![Desktop](./screenshots/e2e-responsive-desktop.png)

All three service cards are displayed side by side in a single row. The summary bar shows the chips inline next to the cart icon.

### Tablet (768x1024)
![Tablet](./screenshots/e2e-responsive-tablet.png)

The service cards are arranged in a 2-column grid. The third card moves to its own row.

### Mobile (375x667)
![Mobile](./screenshots/e2e-responsive-mobile.png)

The service cards stack vertically (1 column). The summary bar extends across the full width.

---

## Accessibility

- **Keyboard Navigation:** Service cards are reachable via the Tab key and can be selected/deselected with Enter or Space. The radio buttons on the tire change card are reachable via Tab and navigable with arrow keys.
- **Screen Reader:** The service cards use `role="group"` and `aria-pressed` to indicate selection status. Each card has an `aria-label` with the service name. Radio buttons are grouped in a `mat-radio-group` with an appropriate label.
- **Color Contrast:** WCAG 2.1 AA compliant with a minimum contrast ratio of 4.5:1 for text and interactive elements.
- **Focus Styles:** Visible focus indicators (`:focus-visible`) on all interactive elements. Touch targets have a minimum size of 2.75em (44px).

---

## Technical Details

| Property | Value |
|----------|-------|
| Route | `/#/home/services` |
| Container Component | `ServiceSelectionContainerComponent` |
| Store | `BookingStore` |
| API Service | `BookingApiService` |
| Guard | `locationSelectedGuard` |
| Resolver | `servicesResolver` |
| Presentational Components | `ServiceCardComponent`, `ServiceSummaryBarComponent` |
