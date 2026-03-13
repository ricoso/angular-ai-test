# ANGULAR BOOKING FEATURE - COMPREHENSIVE STATE REPORT

## 1. DIRECTORY STRUCTURE

```
src/app/features/booking/
├── booking.routes.ts                          # Main routing configuration
├── components/
│   ├── appointment-selection/
│   │   ├── appointment-selection-container.component.ts
│   │   ├── appointment-selection-container.component.html
│   │   ├── appointment-selection-container.component.scss
│   │   ├── appointment-card.component.ts
│   │   ├── appointment-card.component.html
│   │   ├── appointment-card.component.scss
│   │   └── *.spec.ts files
│   ├── brand-selection/
│   │   ├── brand-selection-container.component.ts/html/scss
│   │   ├── brand-buttons.component.ts/html/scss
│   │   └── *.spec.ts files
│   ├── carinformation/
│   │   ├── carinformation-container.component.ts/html/scss
│   │   ├── components/
│   │   │   ├── customer-form/
│   │   │   │   └── customer-form.component.ts/html/scss
│   │   │   └── vehicle-form/
│   │   │       └── vehicle-form.component.ts/html/scss
│   │   └── *.spec.ts files
│   ├── location-selection/
│   │   ├── location-selection-container.component.ts/html/scss
│   │   ├── location-buttons.component.ts/html/scss
│   │   └── *.spec.ts files
│   ├── notes/
│   │   ├── notes-container.component.ts/html/scss
│   │   ├── notes-form.component.ts/html/scss
│   │   ├── service-hints.component.ts/html/scss
│   │   ├── notes-hints.constants.ts
│   │   └── *.spec.ts files
│   ├── service-selection/
│   │   ├── service-selection-container.component.ts/html/scss
│   │   ├── service-card.component.ts/html/scss
│   │   ├── service-summary-bar.component.ts/html/scss
│   │   └── *.spec.ts files
│   └── workshop-calendar/
│       ├── workshop-calendar-container.component.ts/html/scss
│       ├── workshop-calendar-date-picker.component.ts/html/scss
│       ├── workshop-calendar-day.component.ts/html/scss
│       └── *.spec.ts files
├── guards/
│   ├── brand-selected.guard.ts                # Checks hasBrandSelected()
│   ├── location-selected.guard.ts             # Checks hasBrandSelected() && hasLocationSelected()
│   ├── services-selected.guard.ts             # Checks all prior steps + hasServicesSelected()
│   ├── car-information.guard.ts               # Checks all steps + hasAppointmentSelected()
│   └── *.spec.ts files
├── models/
│   ├── appointment.model.ts                   # AppointmentSlot, DayAbbreviation types
│   ├── brand.model.ts                         # Brand, BrandDisplay interfaces
│   ├── customer.model.ts                      # CustomerInfo, VehicleInfo interfaces
│   ├── location.model.ts                      # LocationDisplay, LOCATIONS_BY_BRAND
│   ├── service.model.ts                       # ServiceType, ServiceDisplay, SelectedService, ServiceVariant
│   ├── workshop-calendar.model.ts             # WorkshopCalendarDay, WorkshopTimeSlot
│   └── *.spec.ts files
├── resolvers/
│   ├── appointments.resolver.ts               # Calls store.loadAppointments()
│   ├── brands.resolver.ts                     # Calls store.loadBrands()
│   ├── locations.resolver.ts                  # Calls store.loadLocations()
│   ├── services.resolver.ts                   # Calls store.loadServices()
│   └── *.spec.ts files
├── services/
│   ├── appointment-api.service.ts             # getAppointments() - static data
│   ├── booking-api.service.ts                 # getBrands(), getLocations(), getServices()
│   ├── workshop-calendar-api.service.ts       # getWorkshopCalendarDays(fromDate)
│   └── *.spec.ts files
├── stores/
│   ├── booking.store.ts                       # FULL STORE - see section 2 below
│   └── booking.store.spec.ts
└── validators/                                # Empty directory (ready for validators)
```

---

## 2. BOOKING STORE - COMPLETE ANALYSIS

**File:** `src/app/features/booking/stores/booking.store.ts` (263 lines)

### STATE INTERFACE (Lines 18-35)
```typescript
interface BookingState {
  brands: BrandDisplay[];
  selectedBrand: Brand | null;
  locations: LocationDisplay[];
  selectedLocation: LocationDisplay | null;
  services: ServiceDisplay[];
  selectedServices: SelectedService[];
  bookingNote: string | null;
  appointments: AppointmentSlot[];
  selectedAppointment: AppointmentSlot | null;
  workshopCalendarDate: string | null;
  workshopCalendarDays: WorkshopCalendarDay[];
  customerInfo: CustomerInfo | null;
  vehicleInfo: VehicleInfo | null;
  privacyConsent: boolean;
  isLoading: boolean;
  error: string | null;
}
```

### INITIAL STATE (Lines 37-54)
All arrays/lists start empty `[]`, all nullables are `null`, `privacyConsent: false`, loading/error false/null.

### COMPUTED SIGNALS (Lines 61-75) - 13 SIGNALS
```typescript
✓ hasBrandSelected:       () => selectedBrand() !== null
✓ brandCount:             () => brands().length
✓ filteredLocations:      () => locations()
✓ locationCount:          () => locations().length
✓ hasLocationSelected:    () => selectedLocation() !== null
✓ selectedServiceCount:   () => selectedServices().length
✓ hasServicesSelected:    () => selectedServices().length > 0
✓ hasBookingNote:         () => bookingNote() !== null && bookingNote() !== ''
✓ hasAppointmentSelected: () => selectedAppointment() !== null
✓ hasWorkshopSlotSelected: () => appointment !== null && calendarDate !== null
```

### METHODS (20+ METHODS) - Lines 78-262

**LOAD METHODS (RxMethod - use store getters, pipe, switchMap):**
1. `loadBrands()` - Calls BookingApiService.getBrands()
2. `loadLocations()` - Calls BookingApiService.getLocations(brand) — checks if brand exists first
3. `loadServices()` - Calls BookingApiService.getServices()
4. `loadAppointments()` - Calls AppointmentApiService.getAppointments()
5. `loadWorkshopCalendarDays(fromDate)` - Calls WorkshopCalendarApiService.getWorkshopCalendarDays(fromDate)

**SET METHODS (update single/multiple fields):**
6. `setBrand(brand)` - Sets selectedBrand
7. `setLocation(location)` - Sets selectedLocation
8. `setBookingNote(note)` - Sets bookingNote (null-safe)
9. `selectAppointment(appointment)` - Sets selectedAppointment
10. `setWorkshopCalendarDate(date)` - Sets workshopCalendarDate, resets selectedAppointment to null
11. `setCustomerInfo(info)` - Sets customerInfo (from carinformation form)
12. `setVehicleInfo(info)` - Sets vehicleInfo (from carinformation form)
13. `setPrivacyConsent(consent)` - Sets privacyConsent boolean

**TOGGLE/CONFIRM METHODS (for services with variants):**
14. `toggleService(serviceId)` - Adds or removes service from selectedServices
15. `confirmTireChange(variantId)` - Sets tire-change with selectedVariantId
16. `deselectTireChange()` - Removes tire-change from selectedServices

**CLEAR METHODS (reset individual fields):**
17. `clearSelectedLocation()`
18. `clearBookingNote()`
19. `clearSelectedAppointment()`
20. `clearSelectedServices()`
21. `clearWorkshopCalendar()` - Clears workshopCalendarDate, workshopCalendarDays, selectedAppointment
22. `clearCarInformation()` - Clears customerInfo, vehicleInfo, privacyConsent

### ERROR HANDLING
- All rxMethods use `catchError()` to catch errors
- On error: `error: message` is set, `isLoading: false`
- On error: returns `EMPTY` (RxJS operator)
- Loading state set via `patchState({ isLoading: true, error: null })` at start

### DEPENDENCIES INJECTED
```typescript
api = inject(BookingApiService)
appointmentApi = inject(AppointmentApiService)
workshopCalendarApi = inject(WorkshopCalendarApiService)
```

---

## 3. ALL MODELS

**File:** `src/app/features/booking/models/` (7 model files)

### 3.1 APPOINTMENT MODEL (`appointment.model.ts` - 18 lines)
```typescript
type DayAbbreviation = 'Mo' | 'Di' | 'Mi' | 'Do' | 'Fr' | 'Sa';  // German weekdays

interface AppointmentSlot {
  id: string;                        // unique id, e.g. '2026-02-25-09-00'
  date: string;                      // ISO format 'YYYY-MM-DD'
  displayDate: string;               // formatted 'DD.MM.YYYY'
  dayAbbreviation: DayAbbreviation;  // 'Mo', 'Di', etc.
  time: string;                      // '09:00'
  displayTime: string;               // '09:00 Uhr'
}
```
✓ **USED IN:** REQ-006 (appointment selection), REQ-008 (workshop calendar)

### 3.2 BRAND MODEL (`brand.model.ts` - 26 lines)
```typescript
type Brand = 'audi' | 'bmw' | 'mercedes' | 'mini' | 'volkswagen';  // BR-1: Exactly 5

interface BrandDisplay {
  id: Brand;
  name: string;  // Display name, e.g. 'Mercedes-Benz'
}

const AVAILABLE_BRANDS: BrandDisplay[] = [  // Static data
  { id: 'audi', name: 'Audi' },
  { id: 'bmw', name: 'BMW' },
  { id: 'mercedes', name: 'Mercedes-Benz' },
  { id: 'mini', name: 'MINI' },
  { id: 'volkswagen', name: 'Volkswagen' }
];
```

### 3.3 CUSTOMER MODEL (`customer.model.ts` - 18 lines)
```typescript
type Salutation = 'mr' | 'ms';

interface CustomerInfo {
  email: string;
  salutation: Salutation;
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  mobilePhone: string;
}

interface VehicleInfo {
  licensePlate: string;
  mileage: number;
  vin: string;
}
```
✓ **USED IN:** REQ-009 (carinformation forms), REQ-010 (booking overview)

### 3.4 LOCATION MODEL (`location.model.ts` - 50 lines)
```typescript
interface LocationDisplay {
  id: string;        // e.g. 'muc'
  name: string;      // e.g. 'München'
  city: string;      // same as name
}

const LOCATIONS_BY_BRAND: Record<Brand, LocationDisplay[]> = {
  audi: [ /* 5 locations */ ],
  bmw: [ /* 5 locations */ ],
  mercedes: [ /* 5 locations */ ],
  mini: [ /* 3 locations */ ],
  volkswagen: [ /* 5 locations */ ]
};
```
✓ **STATIC DATA:** Click-Dummy locations per brand

### 3.5 SERVICE MODEL (`service.model.ts` - 64 lines)
```typescript
type ServiceType = 'huau' | 'inspection' | 'tire-change';

interface ServiceVariant {
  id: string;
  labelKey: TranslationKey;  // e.g. 'booking.services.tireChange.withStorage'
}

interface ServiceDisplay {
  id: ServiceType;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  icon: string;              // Material icon name, e.g. 'verified'
  variants: ServiceVariant[];
}

interface SelectedService {
  serviceId: ServiceType;
  selectedVariantId: string | null;  // For tire-change; null for others
}

const AVAILABLE_SERVICES: ServiceDisplay[] = [
  {
    id: 'huau',
    titleKey: 'booking.services.huau.title',
    descriptionKey: 'booking.services.huau.description',
    icon: 'verified',
    variants: []
  },
  {
    id: 'inspection',
    titleKey: 'booking.services.inspection.title',
    descriptionKey: 'booking.services.inspection.description',
    icon: 'build',
    variants: []
  },
  {
    id: 'tire-change',
    titleKey: 'booking.services.tireChange.title',
    descriptionKey: 'booking.services.tireChange.description',
    icon: 'tire_repair',
    variants: [
      { id: 'without-storage', labelKey: 'booking.services.tireChange.withoutStorage' },
      { id: 'with-storage', labelKey: 'booking.services.tireChange.withStorage' }
    ]
  }
];
```

### 3.6 WORKSHOP CALENDAR MODEL (`workshop-calendar.model.ts` - 23 lines)
```typescript
interface WorkshopTimeSlot {
  id: string;
  time: string;       // '09:00'
  displayTime: string; // '09:00 Uhr'
}

interface WorkshopCalendarDay {
  date: string;
  displayDate: string;
  dayAbbreviation: DayAbbreviation;
  displayHeading: string;
  slots: WorkshopTimeSlot[];
}
```
✓ **USED IN:** REQ-008 (workshop calendar)

---

## 4. ROUTING CONFIGURATION

**File:** `src/app/features/booking/booking.routes.ts` (63 lines)

### CURRENT ROUTES
```typescript
{
  path: '',                    // Redirect from /home to /home/brand
  redirectTo: 'brand',
  pathMatch: 'full'
}

// Route 1: Brand Selection (REQ-002)
{
  path: 'brand',
  loadComponent: () => BrandSelectionContainerComponent,
  resolve: { _: brandsResolver }
}

// Route 2: Location Selection (REQ-003)
{
  path: 'location',
  loadComponent: () => LocationSelectionContainerComponent,
  canActivate: [brandSelectedGuard],
  resolve: { _: locationsResolver }
}

// Route 3: Service Selection (REQ-004)
{
  path: 'services',
  loadComponent: () => ServiceSelectionContainerComponent,
  canActivate: [locationSelectedGuard],
  resolve: { _: servicesResolver }
}

// Route 4: Notes (REQ-005)
{
  path: 'notes',
  loadComponent: () => NotesContainerComponent,
  canActivate: [servicesSelectedGuard]
}

// Route 5: Appointment Selection (REQ-006)
{
  path: 'appointment',
  loadComponent: () => AppointmentSelectionContainerComponent,
  canActivate: [servicesSelectedGuard],
  resolve: { _: appointmentsResolver }
}

// Route 6: Workshop Calendar (REQ-008)
{
  path: 'workshop-calendar',
  loadComponent: () => WorkshopCalendarContainerComponent,
  canActivate: [servicesSelectedGuard]
}

// Route 7: Car Information (REQ-009)
{
  path: 'carinformation',
  loadComponent: () => CarinformationContainerComponent,
  canActivate: [carInformationGuard]
}

// MISSING Route 8: Booking Overview (REQ-010) — NOT IMPLEMENTED YET
```

### GUARDS DEFINED
1. **brandSelectedGuard** - Checks `store.hasBrandSelected()`
2. **locationSelectedGuard** - Checks brand + location selected
3. **servicesSelectedGuard** - Checks brand + location + services selected
4. **carInformationGuard** - Checks brand + location + services + appointment selected
5. **MISSING:** bookingOverviewGuard - Should check ALL fields

### RESOLVERS DEFINED
1. **brandsResolver** - Calls `store.loadBrands()`
2. **locationsResolver** - Calls `store.loadLocations()`
3. **servicesResolver** - Calls `store.loadServices()`
4. **appointmentsResolver** - Calls `store.loadAppointments()`

---

## 5. EXISTING GUARDS - DETAILED

**Location:** `src/app/features/booking/guards/`

### 5.1 BRAND-SELECTED GUARD (16 lines)
```typescript
export const brandSelectedGuard: CanActivateFn = () => {
  const store = inject(BookingStore);
  const router = inject(Router);
  
  if (store.hasBrandSelected()) {
    return true;
  }
  return router.createUrlTree(['/home/brand']);
};
```

### 5.2 LOCATION-SELECTED GUARD (22 lines)
```typescript
export const locationSelectedGuard: CanActivateFn = () => {
  const store = inject(BookingStore);
  const router = inject(Router);
  
  console.debug('[Guard] locationSelectedGuard — brand:', store.selectedBrand(), ...);
  
  if (!store.hasBrandSelected()) {
    return router.createUrlTree(['/home/brand']);
  }
  if (store.hasLocationSelected()) {
    return true;
  }
  return router.createUrlTree(['/home/location']);
};
```

### 5.3 SERVICES-SELECTED GUARD (33 lines)
```typescript
export const servicesSelectedGuard: CanActivateFn = () => {
  // Checks: brand && location && services
  // Redirects to earliest missing step
};
```

### 5.4 CAR-INFORMATION GUARD (40 lines)
```typescript
export const carInformationGuard: CanActivateFn = () => {
  // Checks: brand && location && services && appointment
  // Redirects to earliest missing step
};
```

---

## 6. APP ROUTES INTEGRATION

**File:** `src/app/app.routes.ts` (18 lines)

```typescript
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./features/booking/booking.routes')
      .then(m => m.bookingRoutes)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
```

✓ **Integration Pattern:** Lazy-loaded feature routing under `/home/*` path

---

## 7. TRANSLATIONS - BOOKING SECTION ONLY

**File:** `src/app/core/i18n/translations.ts` (845 lines total)

### STRUCTURE (Lines 53-162 in DE, 208-317 in EN)
```typescript
booking: {
  brand: {
    title: 'Welche Fahrzeugmarke fahren Sie?',
    subtitle: 'Bitte wählen Sie die gewünschte Marke aus.'
  },
  location: {
    title: 'An welchem Standort dürfen wir Sie begrüßen?',
    subtitle: 'Bitte wählen Sie den gewünschten Standort aus.',
    ariaGroupLabel: 'Standorte',
    backButton: 'Zurück'
  },
  services: {
    title: 'Welche Services möchten Sie buchen?',
    subtitle: 'Wählen Sie die gewünschten Services aus.',
    ariaGroupLabel: 'Verfügbare Services',
    continueButton: 'Weiter',
    backButton: 'Zurück',
    huau: { title: '...', description: '...' },
    inspection: { title: '...', description: '...' },
    tireChange: {
      title: '...',
      description: '...',
      withoutStorage: '...',
      withStorage: '...',
      confirmButton: 'Bestätigen',
      deselectButton: 'Abwählen'
    }
  },
  appointment: {
    title: 'Wählen Sie den für Sie passenden Tag und Uhrzeit aus',
    calendarLink: 'Hier sehen Sie weitere freie Termine in unserem Werkstattkalender',
    backButton: 'Zurück',
    continueButton: 'Weiter',
    ariaGroupLabel: 'Terminvorschläge',
    navAriaLabel: 'Seitennavigation'
  },
  workshopCalendar: {
    title: 'Hier sehen Sie weitere freie Termine in unserem Werkstattkalender',
    description: 'Wählen Sie Ihren Wunschtermin. Wir zeigen Ihnen alle freien Termine ab diesem Tag an.',
    desiredDateLabel: 'Ihr Wunschtermin:',
    datePlaceholder: 'Wunschtermin wählen',
    hintBefore: '...',
    hintAfter: '...',
    dateInputAriaLabel: 'Wunschtermin eingeben im Format TT.MM.JJJJ',
    slotsAriaLabel: 'Verfügbare Uhrzeiten',
    backButton: 'Zurück',
    continueButton: 'Weiter',
    navAriaLabel: 'Seitennavigation'
  },
  notes: {
    pageTitle: 'Bitte geben Sie uns weitere Hinweise zu Ihrer Buchung',
    sectionTitle: 'Möchten Sie uns noch etwas zu Ihrer Buchung mitteilen?',
    textareaPlaceholder: '...',
    charCountAriaLabel: '{current} von {max} Zeichen verwendet',
    hintsTitle: 'Wichtige Hinweise zu Ihren ausgewählten Services',
    backButton: 'Zurück',
    continueButton: 'Weiter',
    hints: {
      huau: '...',
      inspection: '...',
      tireChange: '...'
    }
  },
  carinformation: {
    title: 'Bitte geben Sie uns letzte Informationen rund um Ihren Termin',
    returningCustomer: { title: '...', description: '...', button: '...' },
    form: {
      customerTitle: 'Ihre Daten',
      vehicleTitle: 'Fahrzeugdaten',
      email: { label: '...', placeholder: '...', error: { required: '...', invalid: '...' } },
      salutation: { label: '...', placeholder: '...', mr: 'Herr', ms: 'Frau', error: { required: '...' } },
      firstName: { label: '...', placeholder: 'Max', error: { required: '...', lettersOnly: '...' } },
      lastName: { label: '...', placeholder: 'Mustermann', error: { required: '...', lettersOnly: '...' } },
      street: { label: '...', placeholder: 'Musterweg 1', error: { required: '...' } },
      postalCode: { label: '...', placeholder: '30159', error: { required: '...', digitsOnly: '...' } },
      city: { label: '...', placeholder: 'Berlin', error: { required: '...', lettersOnly: '...' } },
      mobilePhone: { label: '...', placeholder: '017012345678', hint: '...', error: { required: '...', digitsOnly: '...', startsWithZero: '...' } },
      licensePlate: { label: 'Kfz. Kennzeichen', placeholder: 'XX-XX1234', error: { required: '...', invalidFormat: '...' } },
      mileage: { label: 'Kilometerstand', placeholder: '5000', error: { required: '...', digitsOnly: '...' } },
      vin: { label: 'FIN', placeholder: 'WDB8XXXXXXA123456', infoLink: 'Erklärung der FIN', error: { required: '...', invalidLength: '...', invalidFormat: '...' } },
      privacy: { consent: 'Ich willige in die Verarbeitung...', privacyLink: 'Datenschutzerklärung', error: { required: '...' } },
      requiredHint: 'Pflichtfelder sind mit * gekennzeichnet'
    },
    navigation: { back: 'Zurück', continue: 'Zur Buchungsübersicht' }
  }
}
```

✓ **SUPPORTED LANGUAGES:** German (de), English (en), Ukrainian (uk), French (fr), Arabic (ar)

---

## 8. SCSS VARIABLES - KEY SYSTEM

**File:** `src/styles/_variables.scss` (115 lines)

### COLOR SYSTEM
```scss
// Brand Colors
--color-primary: #667eea;
--color-primary-hover: #5a67d8;
--color-secondary: #764ba2;
--color-accent: #ed8936;

// Text Colors
--color-text-primary: #1a1a1a;      // 15:1 WCAG contrast on white
--color-text-secondary: #595959;    // 7:1 WCAG contrast
--color-text-muted: #767676;        // 4.5:1 WCAG minimum
--color-text-on-primary: #ffffff;

// Background Colors
--color-background-page: #f8f9fa;
--color-background-surface: #ffffff;
--color-background-hover: #f5f5f5;

// Semantic Colors
--color-error: #c62828;
--color-success: #2e7d32;
--color-warning: #e65100;
--color-info: #1565c0;

// Focus (Accessibility)
--color-focus-ring: #005fcc;
```

### TYPOGRAPHY
```scss
--font-size-xs: 0.875em;   // 14px
--font-size-sm: 1em;       // 16px
--font-size-md: 1.125em;   // 18px
--font-size-lg: 1.25em;    // 20px
--font-size-xl: 1.5em;     // 24px
--font-size-2xl: 2em;      // 32px

--line-height-tight: 1.25;   // Headlines
--line-height-normal: 1.5;   // Body text (WCAG minimum)
--line-height-relaxed: 1.75;
```

### SPACING (em-based, responsive)
```scss
--spacing-xs: 0.25em;  // 4px
--spacing-sm: 0.5em;   // 8px
--spacing-md: 1em;     // 16px
--spacing-lg: 1.5em;   // 24px
--spacing-xl: 2em;     // 32px
```

### BORDER RADIUS
```scss
--radius-sm: 0.25em;    // Small elements
--radius-md: 0.5em;     // Buttons, inputs
--radius-lg: 0.75em;    // Cards
--radius-xl: 1em;       // Large cards, modals
--radius-full: 50%;     // Circles (avatar, icons)
```

### SHADOWS
```scss
--shadow-small: 0 0.0625em 0.125em rgba(0, 0, 0, 0.1);
--shadow-medium: 0 0.25em 0.5em rgba(0, 0, 0, 0.1);
--shadow-large: 0 0.5em 1em rgba(0, 0, 0, 0.15);
```

### ACCESSIBILITY
```scss
--touch-target-min: 2.75em;  // 44px WCAG minimum for touch

// Font-size toggle support
html[data-font-size="small"]   { --font-size-base: 0.875em; }  // 14px
html[data-font-size="normal"]  { --font-size-base: 1em; }      // 16px (Default)
html[data-font-size="large"]   { --font-size-base: 1.125em; }  // 18px
html[data-font-size="x-large"] { --font-size-base: 1.25em; }   // 20px

// High Contrast Mode
html[data-high-contrast="true"] {
  --color-text-primary: #000000;
  --color-text-secondary: #000000;
  --color-background-page: #ffffff;
  --color-border: #000000;
}
```

---

## 9. EXISTING CARD/TILE PATTERNS

### 9.1 SERVICE-CARD COMPONENT
**Location:** `src/app/features/booking/components/service-selection/`

**TS File (76 lines):**
- Uses `MatCardModule`, `MatIconModule`, `MatButtonModule`, `MatRadioModule`
- Input: `service: ServiceDisplay` (required), `isSelected: boolean`, `tireChangeVariantId: string | null`
- Output: `serviceClicked`, `tireChangeConfirmed`, `tireChangeDeselected`
- Computed signals for variant logic
- Methods: `onCardClick()`, `onRadioChange()`, `onConfirm()`, `onDeselect()`

**HTML Template (63 lines):**
- `<mat-card>` with CSS classes for state
- Icon section with `.icon-framed` class
- Title (h2) and description (p)
- Conditional radio buttons for tire-change variants
- Action buttons (confirm/deselect)

**SCSS (109 lines):**
- BEM naming convention: `.service-card`, `.service-card__content`, `.service-card__icon`, etc.
- State modifiers: `--selected`, `--clickable`
- Flexbox layout (column)
- Transitions (reduced motion support)
- Touch target sizing
- Responsive grid via parent container

### 9.2 APPOINTMENT-CARD COMPONENT
**Location:** `src/app/features/booking/components/appointment-selection/`

**TS File (28 lines):**
- Minimal presentational component
- Input: `appointment: AppointmentSlot` (required), `isSelected: boolean`
- Output: `appointmentSelected`
- Method: `onSelect()`, `onKeydown(event)`

**HTML Template (18 lines):**
- Simple div with role="radio"
- `.appointment-card__day` — circular day abbreviation container
- `.appointment-card__info` — date and time sections
- Accessibility: aria-checked, aria-label, tabindex="0"

**SCSS (88 lines):**
- `.appointment-card` — flex row layout (horizontal on mobile, vertical on desktop via @media)
- `.appointment-card__day` — 3.5em circular container with primary color
- State: `--selected` modifier with shadow and scale transform
- Transitions with reduced-motion support
- Responsive: `@media (min-width: 64em)` switches to vertical layout

### 9.3 DESIGN PATTERNS OBSERVED

**Pattern 1: BEM Naming**
- Block: `.appointment-card`, `.service-card`
- Element: `__day`, `__info`, `__title`, `__description`, `__icon`, `__actions`
- Modifier: `--selected`, `--clickable`, `--active`

**Pattern 2: State Management**
- Inputs for data (`appointment`, `service`, `isSelected`)
- Outputs for events (`appointmentSelected`, `serviceClicked`, etc.)
- Computed signals for derived state
- OnPush change detection

**Pattern 3: Accessibility**
- ARIA attributes: `role="radio"`, `aria-checked`, `aria-label`, `aria-pressed`
- `tabindex="0"` for keyboard navigation
- Focus styling: `:focus-visible` ring with `var(--color-focus-ring)`
- Icon-framed: decorative icons with `aria-hidden="true"`

**Pattern 4: Responsive Design**
- Flexbox with media queries
- Touch-friendly: `min-height: var(--touch-target-min)` (44px)
- Mobile-first, then breakpoints at `48em` and `64em`
- Em-based spacing using CSS variables

**Pattern 5: Transitions & Motion**
- Smooth transitions on all interactive elements (border, shadow, color)
- `@media (prefers-reduced-motion: reduce)` support
- No animations, only transitions

---

## 10. APPOINTMENT-SLOT CONFIRMATION

### ✓ AppointmentSlot MODEL EXISTS
**File:** `src/app/features/booking/models/appointment.model.ts` (18 lines)

```typescript
type DayAbbreviation = 'Mo' | 'Di' | 'Mi' | 'Do' | 'Fr' | 'Sa';

interface AppointmentSlot {
  id: string;
  date: string;
  displayDate: string;
  dayAbbreviation: DayAbbreviation;
  time: string;
  displayTime: string;
}
```

✓ **Already used in:**
- BookingStore state (`appointments: AppointmentSlot[]`, `selectedAppointment: AppointmentSlot | null`)
- AppointmentSelectionContainerComponent
- AppointmentCardComponent
- AppointmentApiService
- AppointmentsResolver

✓ **Origin:** Not explicitly from REQ-006/008, but defined specifically for appointment handling in both requirements

---

## 11. REQUIREMENT STATUS - WIZARD SEQUENCE

| Step | Requirement | Route | Status | Guard | Resolver |
|------|-------------|-------|--------|-------|----------|
| 1 | REQ-002: Markenauswahl | `/home/brand` | ✓ Implemented | — | brandsResolver |
| 2 | REQ-003: Standortwahl | `/home/location` | ✓ Implemented | brandSelectedGuard | locationsResolver |
| 3 | REQ-004: Serviceauswahl | `/home/services` | ✓ Implemented | locationSelectedGuard | servicesResolver |
| 4 | REQ-005: Hinweisfenster | `/home/notes` | ✓ Implemented | servicesSelectedGuard | — |
| 5 | REQ-006: Terminauswahl | `/home/appointment` | ✓ Implemented | servicesSelectedGuard | appointmentsResolver |
| 6 | REQ-008: Werkstattkalender | `/home/workshop-calendar` | ✓ Implemented | servicesSelectedGuard | — |
| 7 | REQ-009: Fahrzeugdaten | `/home/carinformation` | ✓ Implemented | carInformationGuard | — |
| **8** | **REQ-010: Buchungsübersicht** | **`/home/booking-overview`** | **⚠ NOT IMPLEMENTED** | **NEEDS: bookingOverviewGuard** | **— (no API)** |

---

## 12. MISSING FOR REQ-010 (BOOKING OVERVIEW)

### REQUIRED COMPONENTS
1. **booking-overview-container.component.ts/html/scss** — Main container for overview tiles
2. **booking-tile.component.ts/html/scss** — Reusable tile component for displaying booking sections

### REQUIRED GUARD
- **bookingOverviewGuard** — Checks all 7 mandatory fields:
  - `selectedBrand` (not null)
  - `selectedLocation` (not null)
  - `selectedServices` (length > 0)
  - `selectedAppointment` (not null)
  - `customerInfo` (not null)
  - `vehicleInfo` (not null)
  - `privacyConsent` (=== true)

### REQUIRED ROUTE ADDITION
```typescript
{
  path: 'booking-overview',
  loadComponent: () => import('./components/booking-overview/booking-overview-container.component')
    .then(m => m.BookingOverviewContainerComponent),
  canActivate: [bookingOverviewGuard]
}
```

### REQUIRED STORE METHODS (already may exist)
- `resetBooking()` — Clear all store fields after booking submitted (for next booking cycle)
- Possibly: `bookingSubmitted: boolean` signal in state

### REQUIRED TRANSLATIONS (i18n keys needed)
- `booking.overview.title` — "Übersicht"
- `booking.overview.subtitle` — "Bitte prüfen Sie Ihre Angaben bevor Sie den Termin versenden."
- `booking.overview.tiles.*` — Tile headings (Wunschtermin, Gewählter Service, Persönliche Daten, Preis)
- `booking.overview.navigation.*` — Button labels (Zurück, Jetzt anfragen)

---

## 13. KEY TAKEAWAYS FOR IMPLEMENTATION

### Architecture Patterns
1. ✓ **Container/Presentational:** All components follow this pattern
2. ✓ **Signals-based store:** @ngrx/signals with rxMethod for async
3. ✓ **Route guards:** Typed CanActivateFn with computed checks
4. ✓ **Lazy loading:** Components loaded via `loadComponent()`
5. ✓ **Resolvers:** Data loaded before route activation

### Code Style
- BEM SCSS naming throughout
- OnPush change detection everywhere
- Bilingual comments (DE + EN)
- Material Design components (`mat-card`, `mat-button`, `mat-icon`)
- i18n keys for all user-visible text
- Accessibility-first (ARIA, keyboard nav, focus rings)

### Design System
- All colors from `_variables.scss` (NEVER hardcoded)
- Spacing uses em-based variables
- Touch targets always >= 2.75em (44px)
- Responsive via @media breakpoints at 48em and 64em
- Light theme (light backgrounds, dark text)

### Testing Pattern
- All components have `.spec.ts` files
- Jest configuration in `jest.config.ts`
- Tests mock services and store

---

## APPENDIX: Quick File Reference

| Type | File | Lines |
|------|------|-------|
| Store | `stores/booking.store.ts` | 263 |
| Models | `models/appointment.model.ts` | 18 |
| Models | `models/brand.model.ts` | 26 |
| Models | `models/customer.model.ts` | 18 |
| Models | `models/location.model.ts` | 50 |
| Models | `models/service.model.ts` | 64 |
| Models | `models/workshop-calendar.model.ts` | 23 |
| Guards | `guards/brand-selected.guard.ts` | 16 |
| Guards | `guards/location-selected.guard.ts` | 22 |
| Guards | `guards/services-selected.guard.ts` | 33 |
| Guards | `guards/car-information.guard.ts` | 40 |
| Routes | `booking.routes.ts` | 63 |
| App | `app.routes.ts` | 18 |
| i18n | `core/i18n/translations.ts` | 844 (booking: lines 53-317) |
| CSS | `styles/_variables.scss` | 115 |
| Component | `components/service-selection/service-card.component.ts` | 76 |
| Component | `components/appointment-selection/appointment-card.component.ts` | 28 |

