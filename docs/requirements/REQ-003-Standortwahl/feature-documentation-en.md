# Feature Documentation: Location Selection

**Created:** 2026-02-17
**Requirement:** REQ-003-Standortwahl
**Language:** EN
**Status:** Implemented

---

## Overview

Location Selection is the second step in the booking wizard. Based on the previously selected vehicle brand (REQ-002), the user is presented with the available locations (dealerships) as buttons. Locations are brand-dependent and filtered using static data (click dummy). After selecting a location, the application automatically navigates to the service selection (REQ-004).

---

## User Guide

### Step 1: View locations
![Location Selection EN](./screenshots/doc-location-selection-en.png)

**Description:** After the page loads, the user sees a heading ("At which location may we welcome you?") and a subtitle ("Please select your desired location."). Below, the brand-specific locations are displayed as buttons.

- Desktop: up to 5 buttons side by side in one row
- Tablet: 3 buttons per row
- Mobile: 1 button per row (vertically stacked)

The number of displayed locations varies depending on the brand (3-5 locations).

### Step 2: Select a location

**Description:** The user clicks one of the location buttons. The selected location is saved to the BookingStore and the user is automatically redirected to the service selection (`/home/services`).

### Alternative: Change location

**Description:** If the user navigates back to location selection from a later step, the previously selected location is visually highlighted (active button state with primary background color). Selecting a different location resets the selected services (BR-3).

### Alternative: Back to brand selection

**Description:** If the user navigates back to brand selection and chooses a different brand, the location selection will display the locations for the new brand on the next visit.

---

## Responsive Views

### Desktop (1280x720)
![Desktop](./screenshots/e2e-responsive-desktop.png)

- Up to 5 location buttons in a single row (CSS Grid: `repeat(5, 1fr)`)
- Centered heading and subtitle
- Maximum width: 70em

### Tablet (768x1024)
![Tablet](./screenshots/e2e-responsive-tablet.png)

- 3 buttons per row (CSS Grid: `repeat(3, 1fr)`)
- Consistent spacing and font sizes matching desktop

### Mobile (375x667)
![Mobile](./screenshots/e2e-responsive-mobile.png)

- 1 button per row (CSS Grid: `1fr`)
- Full width for each button
- Touch-friendly: minimum height `var(--touch-target-min)` (2.75em / 44px)

---

## Accessibility

- **Keyboard navigation:** All buttons are reachable via Tab and can be activated with Enter/Space
- **Screen reader:** Button group has `role="group"` with `aria-label="Locations"` (EN) / `aria-label="Standorte"` (DE). Active location is communicated via `aria-pressed="true"`
- **Color contrast:** WCAG 2.1 AA compliant (CSS variables from the design system)
- **Focus styles:** Visible focus ring with `:focus-visible` (3px outline, `var(--color-focus-ring)`)
- **Reduced motion:** Transitions are disabled when `prefers-reduced-motion: reduce` is active

---

## Technical Details

| Property | Value |
|----------|-------|
| Route | `/#/home/location` |
| Container Component | `LocationSelectionContainerComponent` |
| Presentational Component | `LocationButtonsComponent` |
| Store | `BookingStore` |
| API Service | `BookingApiService` |
| Resolver | `locationsResolver` |
| Guard | `brandSelectedGuard` |
| Data Source | Static (Click-Dummy) |

### Architecture

Location selection follows the Container/Presentational pattern:

- **Container** (`LocationSelectionContainerComponent`): Injects the `BookingStore`, reads `filteredLocations` and `selectedLocation` as signals, handles navigation after location selection.
- **Presentational** (`LocationButtonsComponent`): Receives locations via `input()`, emits selection via `output()`. No store dependency.

### Data Flow

1. User navigates to `/home/location`
2. `brandSelectedGuard` checks if a brand is selected in the store (redirects to `/home/brand` if not)
3. `locationsResolver` is triggered and calls `store.loadLocations()`
4. Store loads locations via `BookingApiService.getLocations(brand)` (static data, filtered by brand)
5. Container component displays title/subtitle (i18n) and passes `locations()` and `selectedLocation()` to `LocationButtonsComponent`
6. User clicks button -> `locationSelected` event -> `store.setLocation()` -> navigation to `/home/services`

### Data Model

```typescript
// Location Display Model (returned by API service)
interface LocationDisplay {
  id: string;
  name: string;
}

// Internal Location Data Model (for filtering)
interface LocationData {
  id: string;
  name: string;
  city: string;
  brands: Brand[];
}
```

### Locations per Brand

| Brand | Locations |
|-------|-----------|
| Audi | Munich, Hamburg, Berlin, Frankfurt, Dusseldorf |
| BMW | Stuttgart, Cologne, Munich, Berlin, Hamburg |
| Mercedes-Benz | Stuttgart, Munich, Frankfurt, Dusseldorf, Berlin |
| MINI | Garbsen, Hannover Sudstadt, Steinhude |
| Volkswagen | Wolfsburg, Hannover, Berlin, Munich, Hamburg |

### Store Integration (BookingStore)

| Element | Type | Description |
|---------|------|-------------|
| `locations` | State | Array of all loaded locations |
| `selectedLocation` | State | Currently selected location (`LocationDisplay \| null`) |
| `filteredLocations` | Computed | Loaded locations (already brand-filtered) |
| `hasLocationSelected` | Computed | Boolean whether a location is selected |
| `loadLocations()` | rxMethod | Loads locations via API (filtered by `selectedBrand`) |
| `setLocation(location)` | Method | Sets the selected location in state |

### Guard: brandSelectedGuard

Functional `CanActivateFn` guard. Checks `store.hasBrandSelected()`. On `false`, redirects to `/home/brand`. Ensures step 2 cannot be accessed without completing step 1.

### Resolver: locationsResolver

Functional `ResolveFn<void>` resolver. Calls `store.loadLocations()` before the route is activated. Locations are loaded based on the `selectedBrand` stored in the BookingStore.

---

## i18n Keys

| Key Path | DE | EN |
|----------|----|----|
| `booking.location.title` | An welchem Standort duerfen wir Sie begruessen? | At which location may we welcome you? |
| `booking.location.subtitle` | Bitte waehlen Sie den gewuenschten Standort aus. | Please select your desired location. |
| `booking.location.ariaGroupLabel` | Standorte | Locations |

**Template access:**
```html
{{ booking.location.title | translate }}
{{ booking.location.subtitle | translate }}
```

**TypeScript access:**
```typescript
protected readonly booking = i18nKeys.booking;
```

---

## Dependencies

### Requires

| Requirement | Description |
|-------------|-------------|
| REQ-001 (Header) | Cart icon shows brand + location after selection |
| REQ-002 (Brand Selection) | Provides `selectedBrand` in the BookingStore |

### Blocks

| Requirement | Description |
|-------------|-------------|
| REQ-004 (Service Selection) | Requires `selectedLocation` in the BookingStore |

---

## File Structure

```
src/app/features/booking/
├── components/
│   └── location-selection/
│       ├── location-selection-container.component.ts
│       ├── location-selection-container.component.html
│       ├── location-selection-container.component.scss
│       ├── location-buttons.component.ts
│       ├── location-buttons.component.html
│       └── location-buttons.component.scss
├── guards/
│   └── brand-selected.guard.ts
├── models/
│   └── location.model.ts
├── resolvers/
│   └── locations.resolver.ts
├── services/
│   └── booking-api.service.ts
├── stores/
│   └── booking.store.ts
└── booking.routes.ts
```
