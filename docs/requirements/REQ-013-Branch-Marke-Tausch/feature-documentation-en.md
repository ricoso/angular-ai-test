# Feature Documentation: Branch-Brand-Swap

**Created:** 2026-04-02
**Requirement:** REQ-013-Branch-Marke-Tausch
**Language:** EN
**Status:** Implemented

---

## Overview

The **Branch-Brand-Swap** feature reverses the order of the first two wizard steps in the booking process. Previously, the customer selected a vehicle brand first, then a location. **New:** The location (branch/dealership) is selected as the first step — afterwards, only the brands available at that location are displayed.

Additionally, a **Wizard Breadcrumb** (7-step stepper) is introduced on all wizard pages to visually represent progress. The location cards display **brand SVG logos** alongside name and address for quick orientation. An **info banner** above the breadcrumb shows the active location with name and address.

**New wizard flow:**
Location → Brand → Service → Notes → Appointment → Vehicle → Summary

---

## User Guide

### Step 1: Location Selection (Wizard Entry Point)
![Location Selection](screenshots/01-location-selection.png)

**Description:** The user sees all available workshop locations as cards. Each card displays:
- **Workshop name** (e.g., "Volkswagen Zentrum Essen")
- **Address** (street, zip code, city)
- **Brand logos** as small SVG icons — for quick visual orientation

The locations are sourced from `branch-config.json` and include over 60 branches across various locations (Essen, Mülheim, Düsseldorf, Wuppertal, etc.).

**Note:** There is no back button since location selection is the wizard entry point. The layout adapts responsively: 3 columns on desktop, 2 on tablet, 1 on mobile.

### Step 2: Brand Selection (Filtered by Location)
![Brand Selection](screenshots/02-brand-selection.png)

**Description:** After selecting a location, only the brands available at that location are displayed. Brands are shown as large cards with SVG logos.

**Multiple brands at a location:**
![Multiple Brands](screenshots/03-brands-multi.png)

Locations like "Volkswagen Zentrum Essen" offer multiple brands (VW, VW Commercial Vehicles, SEAT, CUPRA). All available brands are displayed as separate cards.

**Single brand at a location:**
![Single Brand](screenshots/04-brands-single.png)

Some locations (e.g., "ŠKODA Zentrum Essen") offer only a single brand. In this case, only one card is displayed.

**Navigation:**
- A **back button** navigates back to location selection (`/home/location`)
- When 0 brands are available, the message "No brands are currently available for this location." is displayed
- An **info banner** shows the selected location (name + address) above the breadcrumb

### Wizard Breadcrumb (7 Steps)
![Breadcrumb](screenshots/05-breadcrumb-brand.png)

**Description:** A horizontal stepper is displayed on all wizard pages, visualizing the current progress:

| Step | Label | Icon | Route |
|------|-------|------|-------|
| 1 | Location | `location_on` | `/home/location` |
| 2 | Brand | `directions_car` | `/home/brand` |
| 3 | Service | `build` | `/home/services` |
| 4 | Notes | `info` | `/home/notes` |
| 5 | Appointment | `calendar_today` | `/home/appointment` |
| 6 | Vehicle | `person` | `/home/carinformation` |
| 7 | Summary | `check_circle` | `/home/summary` |

**Status display:**
- ✅ **Completed:** Green checkmark, label is clickable (navigates back to that step)
- 🔵 **Current:** Highlighted in primary color, bold text
- ⬜ **Future:** Greyed out, not clickable

**Responsive:** On mobile, only icons are shown; from tablet width, labels are displayed as well.

### Info Banner (Location Display)

**Description:** Above the wizard breadcrumb, an info banner shows the active location:
- **Icon:** `location_on`
- **Content:** Workshop name + full address (from `branch-config.json`)
- **Layout:** Compact — one line on desktop, two lines on mobile
- **Background:** `var(--color-background-info)`

### Step 3: Service Selection (After the New Flow)
![Services After Flow](screenshots/06-services-after-flow.png)

**Description:** After location and brand selection, the user reaches the service selection page. The guard checks that both a location and a brand have been selected. The service page displays available services for the chosen brand at the selected location.

---

## Location Cards (Branch Cards)

Each location card contains:

| Element | Description |
|---------|------------|
| **Name** | Workshop name from `branch-config.json` (e.g., "Audi Zentrum Essen") |
| **Address** | Street, zip code, and city — displayed smaller below the name |
| **Brand logos** | SVG logos of brands available at the location (`height: 1.5em`), arranged side by side |

The logos serve as a **visual orientation aid** — the customer can see at a glance which brands are serviced at the location.

---

## Brand Cards

Each brand card shows:

| Element | Description |
|---------|------------|
| **SVG Logo** | Large brand logo from `assets/brands/` (`height: 4–5em`) |
| **Brand name** | Text below the logo (e.g., "Audi", "ŠKODA") |

**Available brand logos:** Audi, Volkswagen, VW Commercial Vehicles, SEAT, CUPRA, ŠKODA, Hyundai, Porsche, Bentley, Bugatti, Rimac

**Logo sizes throughout the UI:**
- `.brand-logo--sm` (1.25em) — Header/shopping cart
- `.brand-logo--md` (2em) — Booking summary
- `.brand-logo--lg` (4–5em) — Brand selection

---

## Back Navigation & State Reset

| From | Back to | What gets reset |
|------|---------|----------------|
| Brand selection | Location selection | `selectedBrand` is set to null |
| Service selection | Brand selection | `selectedServices` is cleared |
| Location change (from step 3+) | Location selection | `selectedBrand`, `selectedServices`, and all subsequent fields |

When **changing the location**, all subsequent selections are reset because available brands are location-dependent.

---

## Responsive Views

### Desktop (≥ 64em)
- Location cards: 3-column grid
- Breadcrumb: Icons + labels
- Info banner: Single line

### Tablet (≥ 48em)
- Location cards: 2-column grid
- Breadcrumb: Icons + labels

### Mobile (< 48em)
- Location cards: 1 column, full width
- Breadcrumb: Icons only
- Info banner: Two lines

---

## Accessibility

- **Keyboard navigation:** All cards and buttons are reachable via Tab key
- **Screen reader:** `role="navigation"` + `aria-label="Booking progress"` on the breadcrumb, `aria-current="step"` on the active step
- **Color contrast:** WCAG 2.1 AA compliant (contrast ratio ≥ 4.5:1)
- **Focus styles:** `:focus-visible` on all interactive elements
- **Touch targets:** Minimum 2.75em (44px) for all clickable elements

---

## Technical Details

| Property | Value |
|----------|-------|
| Route (Location) | `/#/home/location` |
| Route (Brand) | `/#/home/brand` |
| Container Component (Location) | `LocationSelectionContainerComponent` |
| Container Component (Brand) | `BrandSelectionContainerComponent` |
| Store | `BookingStore` |
| API Service | `BookingApiService` |
| Config file | `assets/branch-config.json` |
| Guard (Brand) | `locationSelectedGuard` |
| Guard (Service) | `brandSelectedGuard` |
| Resolver (Locations) | `locationsResolver` — loads all locations |
| Resolver (Brands) | `brandsResolver` — loads brands by location |
