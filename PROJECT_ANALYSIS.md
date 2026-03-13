# Angular Project Structure & Patterns Analysis

## 1. TRANSLATIONS.TS - FULL STRUCTURE (ALL LANGUAGES)

**File:** `/workspaces/angular-ai-test/src/app/core/i18n/translations.ts`

### All Languages Supported: 
- **de** (German)
- **en** (English)
- **uk** (Ukrainian)
- **fr** (French)
- **ar** (Arabic)

### Structure:
- **Root keys:** `app`, `header`, `booking`
- All translations are nested objects for type-safe access
- Usage in templates: `{{ i18nKeys.header.cart.button | translate }}`
- Usage in TypeScript: `translateService.instant(i18nKeys.header.cart.button)`

### DE (German) Booking Section - Full Keys:

```
booking.brand.title / subtitle
booking.location.title / subtitle / ariaGroupLabel / backButton
booking.services:
  - title / subtitle / ariaGroupLabel / continueButton / backButton
  - huau: title / description
  - inspection: title / description
  - tireChange: 
    * title / description
    * withoutStorage / withStorage
    * confirmButton / deselectButton
booking.appointment:
  - title / calendarLink / backButton / continueButton
  - ariaGroupLabel / navAriaLabel
booking.workshopCalendar:
  - title / description / desiredDateLabel / datePlaceholder
  - hintBefore / hintAfter
  - dateInputAriaLabel / slotsAriaLabel
  - backButton / continueButton / navAriaLabel
booking.notes:
  - pageTitle / sectionTitle / textareaPlaceholder
  - charCountAriaLabel / hintsTitle
  - backButton / continueButton
  - hints: huau / inspection / tireChange
booking.carinformation:
  - title
  - returningCustomer: title / description / button
  - form:
    * customerTitle / vehicleTitle
    * email: label / placeholder / error: required / invalid
    * salutation: label / placeholder / mr / ms / error
    * firstName / lastName / street / postalCode / city / mobilePhone
    * licensePlate / mileage / vin
    * privacy: consent / privacyLink / error
    * requiredHint
  - navigation: back / continue
```

### EN (English) Booking Section - Sample (similar structure):
```
booking.brand: "What vehicle brand do you drive?" / "Please select your desired brand."
booking.services.huau: "HU/AU" / "Book your appointment for a mandatory HU/AU inspection now!"
booking.appointment: "Select your preferred day and time"
booking.carinformation.form.email: "Email Address" / "max@example.com"
... (all fields fully translated)
```

### Language Display Configuration:
```typescript
AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
  { code: 'uk', label: 'Українська' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' }
]
```

### Type Safety Helper:
```typescript
export type TranslationKey = NestedKeyOf<typeof translations.de>;
export type Language = keyof typeof translations;
export const i18nKeys = createKeyTree(translations.de);
// Enables: i18nKeys.booking.carinformation.form.email → 'booking.carinformation.form.email'
```

---

## 2. _VARIABLES.SCSS - FULL CONTENT

**File:** `/workspaces/angular-ai-test/src/styles/_variables.scss`

**CSS Custom Properties (SINGLE SOURCE OF TRUTH for Design System)**

### Brand Colors
```scss
--color-primary: #667eea;           // Main buttons, links, active states
--color-primary-hover: #5a67d8;     // Primary hover
--color-secondary: #764ba2;         // Secondary actions
--color-accent: #ed8936;            // Highlights, badges, notifications
```

### Text Colors (WCAG AA Contrast Verified)
```scss
--color-text-primary: #1a1a1a;      // 15:1 contrast on white
--color-text-secondary: #595959;    // 7:1 contrast on white
--color-text-muted: #767676;        // 4.5:1 minimum
--color-text-on-primary: #ffffff;
--color-text-on-dark: #ffffff;
```

### Background Colors
```scss
--color-background-page: #f8f9fa;   // Page background (light!)
--color-background-surface: #ffffff; // Cards, dialogs, modals
--color-background-hover: #f5f5f5;  // Hover state
```

### Border & Divider
```scss
--color-border: #e0e0e0;
--color-divider: #eeeeee;
```

### Semantic Colors (Status & Feedback)
```scss
--color-error: #c62828;             // Errors, validation
--color-success: #2e7d32;           // Success, confirmation
--color-warning: #e65100;           // Warnings, caution
--color-info: #1565c0;              // Info, hints
```

### Focus (Accessibility)
```scss
--color-focus-ring: #005fcc;        // Focus outline for keyboard navigation
```

### Shadows
```scss
--shadow-small: 0 0.0625em 0.125em rgba(0, 0, 0, 0.1);
--shadow-medium: 0 0.25em 0.5em rgba(0, 0, 0, 0.1);
--shadow-large: 0 0.5em 1em rgba(0, 0, 0, 0.15);
```

### Typography (em-based for responsive)
```scss
--font-size-base: 1em;              // 16px basis
--font-size-xs: 0.875em;            // 14px (minimum for WCAG)
--font-size-sm: 1em;                // 16px
--font-size-md: 1.125em;            // 18px
--font-size-lg: 1.25em;             // 20px
--font-size-xl: 1.5em;              // 24px
--font-size-2xl: 2em;               // 32px

--line-height-tight: 1.25;          // Headlines
--line-height-normal: 1.5;          // Body text (WCAG minimum)
--line-height-relaxed: 1.75;        // Long text
```

### Spacing (em-based for responsive)
```scss
--spacing-xs: 0.25em;               // 4px
--spacing-sm: 0.5em;                // 8px
--spacing-md: 1em;                  // 16px
--spacing-lg: 1.5em;                // 24px
--spacing-xl: 2em;                  // 32px
```

### Border Radius
```scss
--radius-sm: 0.25em;                // Small elements
--radius-md: 0.5em;                 // Buttons, inputs
--radius-lg: 0.75em;                // Cards
--radius-xl: 1em;                   // Large cards, modals
--radius-full: 50%;                 // Round elements (avatars, icons)
```

### Touch Targets (Accessibility)
```scss
--touch-target-min: 2.75em;         // 44px - WCAG minimum for touch
```

### Accessibility: Font-Size Toggle
```scss
html[data-font-size="small"]   { --font-size-base: 0.875em; }   // 14px
html[data-font-size="normal"]  { --font-size-base: 1em; }       // 16px (default)
html[data-font-size="large"]   { --font-size-base: 1.125em; }   // 18px
html[data-font-size="x-large"] { --font-size-base: 1.25em; }    // 20px
```

### Accessibility: High Contrast Mode
```scss
html[data-high-contrast="true"] {
  --color-text-primary: #000000;
  --color-text-secondary: #000000;
  --color-background-page: #ffffff;
  --color-border: #000000;
}
```

---

## 3. I18N INDEX.TS - EXPORTS

**File:** `/workspaces/angular-ai-test/src/app/core/i18n/index.ts`

```typescript
export { TranslatePipe } from './translate.pipe';
export { TranslateService } from './translate.service';
export type { Language, LanguageOption, TranslationKey } from './translations';
export { AVAILABLE_LANGUAGES, i18nKeys, translations } from './translations';
```

**Exports Summary:**
- **TranslatePipe**: Used in templates for translation
- **TranslateService**: Used in TypeScript for getting translations
- **Types**: Language, LanguageOption, TranslationKey
- **Constants**: AVAILABLE_LANGUAGES, i18nKeys, translations

---

## 4. CONTAINER COMPONENT PATTERN - CarInformationContainer

**File Pattern:** `/workspaces/angular-ai-test/src/app/features/booking/components/carinformation/`

### TypeScript Component (carinformation-container.component.ts)

```typescript
@Component({
  selector: 'app-carinformation-container',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    TranslatePipe,
    CustomerFormComponent,
    VehicleFormComponent
  ],
  templateUrl: './carinformation-container.component.html',
  styleUrl: './carinformation-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarinformationContainerComponent {
  private readonly store = inject(BookingStore);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly carinformation = i18nKeys.booking.carinformation;

  protected readonly customerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    salutation: ['mr' as 'mr' | 'ms', [Validators.required]],
    firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s-]+$/)]],
    lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s-]+$/)]],
    street: ['', [Validators.required]],
    postalCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    city: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s-]+$/)]],
    mobilePhone: ['', [Validators.required, Validators.pattern(/^0[0-9]+$/)]]
  });

  protected readonly vehicleForm = this.fb.group({
    licensePlate: ['', [Validators.required, Validators.pattern(/^[A-ZÄÖÜ]{1,3}-[A-Z]{1,2}\s?\d{1,4}$/i)]],
    mileage: [null as number | null, [Validators.required, Validators.min(0)]],
    vin: ['', [Validators.minLength(17), Validators.maxLength(17), Validators.pattern(/^[A-HJ-NPR-Z0-9]{17}$/i)]]
  });

  protected readonly privacyControl = new FormControl(false, [Validators.requiredTrue]);
  private readonly privacyTouched = signal(false);
  protected readonly privacyError = computed(() =>
    this.privacyTouched() && this.privacyControl.invalid
  );

  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.customerForm.markAllAsTouched();
    this.vehicleForm.markAllAsTouched();
    this.privacyControl.markAsTouched();
    this.privacyTouched.set(true);

    if (this.customerForm.invalid || this.vehicleForm.invalid || this.privacyControl.invalid) {
      return;
    }

    const customerValue = this.customerForm.value;
    const vehicleValue = this.vehicleForm.value;

    const customerInfo: CustomerInfo = {
      email: customerValue.email ?? '',
      salutation: customerValue.salutation ?? 'mr',
      firstName: customerValue.firstName ?? '',
      lastName: customerValue.lastName ?? '',
      street: customerValue.street ?? '',
      postalCode: customerValue.postalCode ?? '',
      city: customerValue.city ?? '',
      mobilePhone: customerValue.mobilePhone ?? ''
    };

    const vehicleInfo: VehicleInfo = {
      licensePlate: vehicleValue.licensePlate ?? '',
      mileage: vehicleValue.mileage ?? 0,
      vin: vehicleValue.vin ?? ''
    };

    this.store.setCustomerInfo(customerInfo);
    this.store.setVehicleInfo(vehicleInfo);
    this.store.setPrivacyConsent(true);

    void this.router.navigate(['/home/carinformation']);
  }

  protected onBack(): void {
    this.store.clearCarInformation();
    void this.router.navigate(['/home/appointment']);
  }

  protected onReturningCustomer(): void {
    // TODO: REQ-010+ — retrieve existing customer data
    console.debug('[CarinformationContainer] Returning customer button clicked');
  }

  protected onVinLinkClick(event: Event): void {
    event.preventDefault();
    console.debug('[CarinformationContainer] VIN explanation link clicked');
  }
}
```

**KEY PATTERNS:**
- Uses `ChangeDetectionStrategy.OnPush` for performance
- All properties are `protected` (not public) for template access
- Uses `inject()` for dependency injection (Angular 14+)
- FormBuilder for reactive forms with validators
- Stores state in `BookingStore`
- Navigates using `Router`
- Uses `computed()` and `signal()` for reactive state

### HTML Template (carinformation-container.component.html)

```html
<section class="carinformation">
  <h1 class="carinformation__title">{{ carinformation.title | translate }}</h1>

  <div class="carinformation__returning-banner">
    <div class="carinformation__returning-content">
      <div class="carinformation__returning-text">
        <strong class="carinformation__returning-title">
          {{ carinformation.returningCustomer.title | translate }}
        </strong>
        <p class="carinformation__returning-description">
          {{ carinformation.returningCustomer.description | translate }}
        </p>
      </div>
    </div>
    <button
      mat-flat-button
      class="carinformation__returning-button"
      type="button"
      (click)="onReturningCustomer()"
    >
      {{ carinformation.returningCustomer.button | translate }}
    </button>
  </div>

  <form class="carinformation__form" (submit)="onSubmit($event)" novalidate>
    <app-customer-form [form]="customerForm" />
    <app-vehicle-form [form]="vehicleForm" />

    <div class="carinformation__privacy">
      <mat-checkbox
        [formControl]="privacyControl"
        class="carinformation__privacy-checkbox"
      >
        {{ carinformation.form.privacy.consent | translate }}
      </mat-checkbox>
      @if (privacyError()) {
        <p class="carinformation__privacy-error" role="alert">
          {{ carinformation.form.privacy.error.required | translate }}
        </p>
      }
    </div>

    <p class="carinformation__required-hint">{{ carinformation.form.requiredHint | translate }}</p>

    <nav class="carinformation__actions" [attr.aria-label]="carinformation.navigation.back | translate">
      <button
        mat-flat-button
        class="carinformation__back-button"
        type="button"
        [attr.aria-label]="carinformation.navigation.back | translate"
        (click)="onBack()"
      >
        {{ carinformation.navigation.back | translate }}
      </button>
      <button
        mat-flat-button
        color="primary"
        class="carinformation__continue-button"
        type="submit"
        [attr.aria-label]="carinformation.navigation.continue | translate"
      >
        {{ carinformation.navigation.continue | translate }}
      </button>
    </nav>
  </form>
</section>
```

### SCSS (carinformation-container.component.scss)

Uses:
- **BEM naming convention:** `.carinformation`, `.carinformation__title`, `.carinformation--modifier`
- **CSS custom properties:** `var(--spacing-xl)`, `var(--font-size-2xl)`, `var(--color-text-primary)`
- **Responsive mixins:** `@include tablet { ... }`
- **Accessibility focus:** `&:focus-visible { outline: 0.125em solid var(--color-focus-ring); }`
- **Touch targets:** `min-height: var(--touch-target-min);` (44px minimum)
- **Flexbox layout:** `display: flex; flex-direction: column; gap: var(--spacing-xl);`

---

## 5. GUARD PATTERN - car-information.guard.ts

**File:** `/workspaces/angular-ai-test/src/app/features/booking/guards/car-information.guard.ts`

```typescript
import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

import { BookingStore } from '../stores/booking.store';

export const carInformationGuard: CanActivateFn = () => {
  const store = inject(BookingStore);
  const router = inject(Router);

  console.debug(
    '[Guard] carInformationGuard — brand:',
    store.selectedBrand(),
    'hasLocation:',
    store.hasLocationSelected(),
    'hasServices:',
    store.hasServicesSelected(),
    'hasAppointment:',
    store.hasAppointmentSelected()
  );

  if (!store.hasBrandSelected()) {
    return router.createUrlTree(['/home/brand']);
  }

  if (!store.hasLocationSelected()) {
    return router.createUrlTree(['/home/location']);
  }

  if (!store.hasServicesSelected()) {
    return router.createUrlTree(['/home/services']);
  }

  if (!store.hasAppointmentSelected()) {
    return router.createUrlTree(['/home/appointment']);
  }

  return true;
};
```

**KEY PATTERNS:**
- Uses **functional guard** pattern (not class-based)
- `CanActivateFn` type for type safety
- Uses `inject()` for dependencies
- Returns `router.createUrlTree()` for redirects
- Returns `true` to allow navigation
- Guards are exported as constants, not classes

---

## 6. PRESENTATIONAL COMPONENT PATTERN - ServiceCard

**File:** `/workspaces/angular-ai-test/src/app/features/booking/components/service-selection/`

### TypeScript Component (service-card.component.ts)

```typescript
@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatRadioModule, TranslatePipe],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceCardComponent {
  // Inputs (read-only)
  public readonly service = input.required<ServiceDisplay>();
  public readonly isSelected = input<boolean>(false);
  public readonly tireChangeVariantId = input<string | null>(null);

  // Outputs (events)
  public readonly serviceClicked = output<ServiceType>();
  public readonly tireChangeConfirmed = output<string>();
  public readonly tireChangeDeselected = output();

  protected readonly tireChange = i18nKeys.booking.services.tireChange;
  protected readonly selectedRadioVariant = signal<string | null>(null);

  protected readonly hasTireChangeVariants = computed(() => this.service().variants.length > 0);

  protected readonly isTireChangeSelected = computed(() =>
    this.isSelected() && this.hasTireChangeVariants()
  );

  protected readonly confirmedVariantId = computed(() => this.tireChangeVariantId());

  protected readonly hasVariantChanged = computed(() => {
    const confirmed = this.confirmedVariantId();
    const selected = this.selectedRadioVariant();
    if (!confirmed || !selected) return false;
    return confirmed !== selected;
  });

  protected readonly showConfirmButton = computed(() => {
    if (!this.hasTireChangeVariants()) return false;
    if (!this.isSelected()) return true;
    return this.hasVariantChanged();
  });

  protected readonly showDeselectButton = computed(() =>
    this.isTireChangeSelected() && !this.hasVariantChanged()
  );

  protected onCardClick(): void {
    if (this.hasTireChangeVariants()) return;
    this.serviceClicked.emit(this.service().id);
  }

  protected onRadioChange(variantId: string): void {
    this.selectedRadioVariant.set(variantId);
  }

  protected onConfirm(): void {
    const variantId = this.selectedRadioVariant();
    if (variantId) {
      this.tireChangeConfirmed.emit(variantId);
    }
  }

  protected onDeselect(): void {
    this.tireChangeDeselected.emit();
    this.selectedRadioVariant.set(null);
  }
}
```

### HTML Template (service-card.component.html)

```html
<mat-card
  class="service-card"
  [class.service-card--selected]="isSelected()"
  [class.service-card--clickable]="!hasTireChangeVariants()"
  [attr.role]="hasTireChangeVariants() ? 'region' : 'button'"
  [attr.aria-pressed]="hasTireChangeVariants() ? null : isSelected()"
  [attr.tabindex]="hasTireChangeVariants() ? null : 0"
  (click)="onCardClick()"
  (keydown.enter)="onCardClick()"
  (keydown.space)="onCardClick()">

  @if (isSelected()) {
    <mat-icon class="service-card__check" aria-hidden="true">check_circle</mat-icon>
  }

  <mat-card-content class="service-card__content">
    <span class="icon-framed service-card__icon">
      <mat-icon aria-hidden="true">{{ service().icon }}</mat-icon>
    </span>
    <h2 class="service-card__title">{{ service().titleKey | translate }}</h2>
    <p class="service-card__description">{{ service().descriptionKey | translate }}</p>

    @if (hasTireChangeVariants()) {
      <div class="service-card__variants">
        @for (variant of service().variants; track variant.id) {
          <label class="service-card__radio-label">
            <input
              type="radio"
              name="tire-change-variant"
              [value]="variant.id"
              [checked]="selectedRadioVariant() === variant.id || confirmedVariantId() === variant.id"
              (change)="onRadioChange(variant.id)"
              class="service-card__radio-input"
            />
            <span class="service-card__radio-text">{{ variant.labelKey | translate }}</span>
          </label>
        }

        <div class="service-card__actions">
          @if (showConfirmButton()) {
            <button
              mat-raised-button
              color="primary"
              class="service-card__confirm-button"
              [disabled]="!selectedRadioVariant()"
              (click)="onConfirm(); $event.stopPropagation()">
              {{ tireChange.confirmButton | translate }}
            </button>
          }
          @if (showDeselectButton()) {
            <button
              mat-flat-button
              class="service-card__deselect-button"
              (click)="onDeselect(); $event.stopPropagation()">
              {{ tireChange.deselectButton | translate }}
            </button>
          }
        </div>
      </div>
    }
  </mat-card-content>
</mat-card>
```

### SCSS (service-card.component.scss)

```scss
@use 'breakpoints' as *;

.service-card {
  position: relative;
  background-color: var(--color-background-surface);
  border: 0.125em solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: border-color 0.2s, box-shadow 0.2s;
  text-align: center;
  padding: var(--spacing-lg);

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  &--clickable {
    cursor: pointer;

    &:hover {
      border-color: var(--color-primary);
      box-shadow: var(--shadow-medium);
    }

    &:focus-visible {
      outline: 0.1875em solid var(--color-focus-ring);
      outline-offset: 0.125em;
    }
  }

  &--selected {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-medium);
  }

  &__check {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    color: var(--color-primary);
    font-size: var(--font-size-xl);
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    padding: 0;
  }

  &__icon {
    font-size: var(--font-size-2xl);
    color: var(--color-primary);
  }

  &__title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
  }

  &__description {
    font-size: var(--font-size-sm);
    line-height: var(--line-height-normal);
    color: var(--color-text-secondary);
    margin: 0;
  }

  &__variants {
    width: 100%;
    margin-top: var(--spacing-md);
    text-align: left;
  }

  &__radio-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    min-height: var(--touch-target-min);  // 44px - WCAG!
    cursor: pointer;
    padding: var(--spacing-xs) 0;
  }

  &__radio-input {
    accent-color: var(--color-primary);
    width: 1.25em;
    height: 1.25em;
    cursor: pointer;
  }

  &__radio-text {
    font-size: var(--font-size-sm);
    color: var(--color-text-primary);
  }

  &__actions {
    display: flex;
    justify-content: center;
    margin-top: var(--spacing-md);
  }

  &__confirm-button,
  &__deselect-button {
    min-height: var(--touch-target-min);
    min-width: 10em;
  }
}
```

**KEY PATTERNS - PRESENTATIONAL COMPONENT:**
- Uses **Angular 17+ `input()`** and **`output()`** instead of @Input/@Output
- Uses **`ChangeDetectionStrategy.OnPush`** for performance
- **Computed properties** for derived state
- **Signal-based** state management
- **Event handlers** emitting via `output()`
- **Accessibility:** `role`, `aria-pressed`, `aria-hidden`, focus management
- **Keyboard support:** `(keydown.enter)`, `(keydown.space)`
- **BEM naming** in SCSS
- **CSS custom properties** throughout

---

## 7. BOOKING.STORE.TS - EXPORTS & PATTERNS

**File:** `/workspaces/angular-ai-test/src/app/features/booking/stores/booking.store.ts`

### Store Exports (Functions & Methods)

```typescript
export const BookingStore = signalStore(
  { providedIn: 'root' },
  
  // STATE
  withState<BookingState>(INITIAL_STATE),
  
  // COMPUTED PROPERTIES (read-only)
  withComputed(({ ... }) => ({
    hasBrandSelected: computed(() => selectedBrand() !== null),
    brandCount: computed(() => brands().length),
    hasLocationSelected: computed(() => selectedLocation() !== null),
    selectedServiceCount: computed(() => selectedServices().length),
    hasServicesSelected: computed(() => selectedServices().length > 0),
    hasBookingNote: computed(() => bookingNote() !== null && bookingNote() !== ''),
    hasAppointmentSelected: computed(() => selectedAppointment() !== null),
    hasWorkshopSlotSelected: computed(() => {
      const appointment = selectedAppointment();
      const calendarDate = workshopCalendarDate();
      return appointment !== null && calendarDate !== null;
    })
  })),
  
  // METHODS
  withMethods((store, api...) => ({
    // LOAD/API METHODS (async)
    loadBrands: rxMethod<void>(...),
    loadLocations: rxMethod<void>(...),
    loadServices: rxMethod<void>(...),
    loadAppointments: rxMethod<void>(...),
    loadWorkshopCalendarDays: rxMethod<string>(...),
    
    // SET METHODS (sync)
    setBrand(brand: Brand): void,
    setLocation(location: LocationDisplay): void,
    toggleService(serviceId: ServiceType): void,
    confirmTireChange(variantId: string): void,
    deselectTireChange(): void,
    setBookingNote(note: string | null): void,
    selectAppointment(appointment: AppointmentSlot): void,
    setWorkshopCalendarDate(date: string): void,
    setCustomerInfo(info: CustomerInfo): void,
    setVehicleInfo(info: VehicleInfo): void,
    setPrivacyConsent(consent: boolean): void,
    
    // CLEAR METHODS (sync)
    clearWorkshopCalendar(): void,
    clearSelectedLocation(): void,
    clearBookingNote(): void,
    clearSelectedAppointment(): void,
    clearSelectedServices(): void,
    clearCarInformation(): void
  }))
);
```

### State Structure

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

### Usage Pattern

```typescript
// In a component
private readonly store = inject(BookingStore);

// Access state (via signals)
store.selectedBrand()           // Brand | null
store.hasBrandSelected()        // boolean (computed)
store.selectedServices()        // SelectedService[]

// Call methods
this.store.setBrand(brand);
this.store.loadBrands();        // rxMethod - async
this.store.toggleService('huau');
this.store.setCustomerInfo(customerInfo);
```

### Key Store Patterns

1. **`signalStore()` from @ngrx/signals** - Modern, functional approach
2. **`withState()`** - Initial state
3. **`withComputed()`** - Derived state (read-only signals)
4. **`withMethods()`** - Actions & API calls
5. **`rxMethod()`** - For async operations with error handling
6. **`patchState()`** - Updates state
7. **Logging** - `console.debug()` in every method
8. **Error handling** - `catchError()` → `EMPTY` pattern

---

## SUMMARY OF PATTERNS

### Architecture
- **Standalone components** (not NgModules)
- **Signal-based reactivity** (Angular 17+)
- **Functional guards** (CanActivateFn)
- **@ngrx/signals** for state management

### Imports Pattern
```typescript
import { inject } from '@angular/core';
import { i18nKeys, TranslatePipe } from '@core/i18n';
import { BookingStore } from '../../stores/booking.store';
```

### Component Structure
- **Protected properties** for template access
- **Input/Output** via `input()` and `output()`
- **OnPush change detection**
- **Computed properties** for derived state
- **Signal-based** component state

### Styling
- **CSS custom properties** (`var(--*)`)
- **BEM naming convention**
- **Responsive mixins** (`@include tablet { }`)
- **Accessibility focus** (`:focus-visible`)
- **Touch targets** (44px minimum)
- **Reduced motion** support

### Accessibility
- **WCAG AA contrast** on all colors
- **Focus visible** outlines
- **ARIA labels & roles** where needed
- **Keyboard support** (Enter, Space, Tab)
- **Font size scaling** (`data-font-size` attribute)
- **High contrast mode** (`data-high-contrast` attribute)

### Type Safety
- **Full TypeScript types**
- **Nested i18n keys** with type inference
- **FormBuilder** with strong typing
- **Signal types** inferred from usage

