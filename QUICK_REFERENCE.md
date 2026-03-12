# Angular Project Quick Reference

## File Locations

### Core i18n
- **Translations (ALL LANGUAGES):** `/src/app/core/i18n/translations.ts` (845 lines)
- **i18n Exports:** `/src/app/core/i18n/index.ts`
- **Usage:** `import { i18nKeys, TranslatePipe } from '@core/i18n';`

### Styles & Design System
- **CSS Variables:** `/src/styles/_variables.scss` (115 lines)
- **Single source of truth:** Colors, typography, spacing, accessibility settings
- **Responsive mixins:** `@use 'breakpoints' as *;`

### Features - Booking Module
```
src/app/features/booking/
├── components/
│   ├── carinformation-container/         ← CONTAINER PATTERN
│   │   ├── carinformation-container.component.ts
│   │   ├── carinformation-container.component.html
│   │   ├── carinformation-container.component.scss
│   │   └── components/
│   │       ├── customer-form/
│   │       └── vehicle-form/
│   ├── service-selection/
│   │   ├── service-card.component.ts     ← PRESENTATIONAL PATTERN
│   │   ├── service-card.component.html
│   │   └── service-card.component.scss
│   └── [other containers]
├── guards/
│   └── car-information.guard.ts          ← GUARD PATTERN
├── stores/
│   └── booking.store.ts                  ← STORE PATTERN
└── models/
    └── [*.model.ts types]
```

---

## Key Patterns & Usage

### 1. TRANSLATIONS
```typescript
// In component class
protected readonly carinformation = i18nKeys.booking.carinformation;

// In template
{{ carinformation.title | translate }}
{{ carinformation.form.email.label | translate }}

// In TypeScript
translateService.instant(i18nKeys.booking.carinformation.form.email.label)
```

### 2. CONTAINER COMPONENT
```typescript
// Key decorators/patterns
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class FeatureContainerComponent {
  // Private services
  private readonly store = inject(BookingStore);
  private readonly router = inject(Router);
  
  // Protected properties for template access
  protected readonly form = this.fb.group({ ... });
  
  // Methods
  protected onSubmit(): void { }
}
```

### 3. PRESENTATIONAL COMPONENT (Service Card)
```typescript
// Using input() and output()
public readonly service = input.required<ServiceDisplay>();
public readonly isSelected = input<boolean>(false);
public readonly serviceClicked = output<ServiceType>();

// Computed state
protected readonly hasTireChangeVariants = computed(() => 
  this.service().variants.length > 0
);

// Signal-based state
protected readonly selectedRadioVariant = signal<string | null>(null);
```

### 4. GUARD PATTERN
```typescript
export const carInformationGuard: CanActivateFn = () => {
  const store = inject(BookingStore);
  const router = inject(Router);
  
  if (!store.hasBrandSelected()) {
    return router.createUrlTree(['/home/brand']);
  }
  return true;
};
```

### 5. STORE PATTERN (@ngrx/signals)
```typescript
// Access state (these are signals)
store.selectedBrand()          // Brand | null
store.hasBrandSelected()       // boolean (computed)
store.selectedServices()       // SelectedService[]

// Call methods
store.setBrand(brand);
store.loadBrands();            // async with error handling
store.toggleService('huau');
store.setCustomerInfo(customerInfo);

// Store exports all methods + state + computed properties
```

---

## Design System (CSS Variables)

### Colors
```scss
--color-primary: #667eea;              // Main brand color
--color-text-primary: #1a1a1a;         // WCAG AA: 15:1 contrast
--color-text-secondary: #595959;       // WCAG AA: 7:1 contrast
--color-background-page: #f8f9fa;      // Light background
--color-focus-ring: #005fcc;           // Keyboard focus outline
--color-error: #c62828;
--color-success: #2e7d32;
--color-warning: #e65100;
--color-info: #1565c0;
```

### Spacing (em-based, responsive)
```scss
--spacing-xs: 0.25em;    // 4px
--spacing-sm: 0.5em;     // 8px
--spacing-md: 1em;       // 16px
--spacing-lg: 1.5em;     // 24px
--spacing-xl: 2em;       // 32px
```

### Typography
```scss
--font-size-xs: 0.875em;     // 14px minimum (WCAG)
--font-size-base: 1em;       // 16px
--font-size-lg: 1.25em;      // 20px
--font-size-2xl: 2em;        // 32px
--line-height-normal: 1.5;   // Body text (WCAG minimum)
```

### Accessibility
```scss
--touch-target-min: 2.75em;  // 44px (WCAG minimum for touch)
--radius-md: 0.5em;          // Buttons, inputs
--radius-lg: 0.75em;         // Cards
```

### Responsive Font Size
```scss
html[data-font-size="small"]   { --font-size-base: 0.875em; }
html[data-font-size="normal"]  { --font-size-base: 1em; }
html[data-font-size="large"]   { --font-size-base: 1.125em; }
html[data-font-size="x-large"] { --font-size-base: 1.25em; }
```

### High Contrast Mode
```scss
html[data-high-contrast="true"] {
  --color-text-primary: #000000;
  --color-background-page: #ffffff;
  --color-border: #000000;
}
```

---

## SCSS Patterns

### BEM Naming
```scss
.carinformation {
  &__title { }           // carinformation__title
  &__form { }            // carinformation__form
  &--selected { }        // carinformation--selected
  
  &__back-button {
    &:focus-visible { }
  }
}
```

### Responsive Mixin
```scss
@use 'breakpoints' as *;

.selector {
  // Mobile first (default)
  @include tablet {
    // Tablet and up
  }
}
```

### Accessibility & Motion
```scss
@media (prefers-reduced-motion: reduce) {
  transition: none;
}

&:focus-visible {
  outline: 0.125em solid var(--color-focus-ring);
  outline-offset: 0.125em;
}
```

---

## Languages Supported

| Code | Language | Native |
|------|----------|--------|
| de   | German   | Deutsch |
| en   | English  | English |
| uk   | Ukrainian| Українська |
| fr   | French   | Français |
| ar   | Arabic   | العربية |

### Translation Keys Structure
```
translations.de
├── app.title, subtitle, skipLink
├── header.accessibility, logo, cart
└── booking
    ├── brand, location, services, appointment
    ├── workshopCalendar, notes
    └── carinformation (with full form structure)
```

---

## Booking Form Fields

### Customer Information
- Email (required, must be valid)
- Salutation (Mr/Ms, required)
- First Name (required, letters only)
- Last Name (required, letters only)
- Street & House Number (required)
- Postal Code (required, 5 digits)
- City (required, letters only)
- Mobile Phone (required, format: 017012345678)

### Vehicle Information
- License Plate (required, format: B-MS1234)
- Mileage (required, numeric)
- VIN/FIN (optional, exactly 17 chars, alphanumeric)

### Privacy & Consent
- Privacy Policy checkbox (required)

---

## Import Patterns

### From Core i18n
```typescript
import { i18nKeys, TranslatePipe, TranslateService } from '@core/i18n';
import type { Language, LanguageOption, TranslationKey } from '@core/i18n';
```

### From Features
```typescript
import { BookingStore } from '../stores/booking.store';
import type { CustomerInfo, VehicleInfo } from '../models/customer.model';
import { carInformationGuard } from '../guards/car-information.guard';
```

### Angular
```typescript
import { ChangeDetectionStrategy, Component, input, output, computed, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
```

### Material & RxJS
```typescript
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatIconModule } from '@angular/material/...';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
```

---

## Common Tasks

### Use Translation in Component
```typescript
protected readonly carinformation = i18nKeys.booking.carinformation;
// Template: {{ carinformation.title | translate }}
```

### Create a Form
```typescript
protected readonly myForm = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  name: ['', [Validators.required, Validators.pattern(/^[a-z\s-]+$/i)]]
});
```

### Access Store State
```typescript
store.selectedBrand();         // Get current brand
store.setBrand(brand);         // Set brand
store.loadBrands();            // Async load
```

### Emit Event from Presentational Component
```typescript
public readonly clicked = output<string>();

protected onAction(): void {
  this.clicked.emit('value');
}
```

### Navigate Between Routes
```typescript
void this.router.navigate(['/home/brand']);
```

### Use CSS Variables
```scss
color: var(--color-text-primary);
padding: var(--spacing-md);
border-radius: var(--radius-lg);
min-height: var(--touch-target-min);
```

---

## Full Project Analysis

See `/PROJECT_ANALYSIS.md` for:
- Complete translations.ts breakdown (all 845 lines with all languages)
- Full _variables.scss with all CSS custom properties
- Complete container component example with .ts, .html, .scss
- Complete presentational component example (service-card)
- Complete guard implementation
- Complete store pattern with all methods
- Full i18n exports and type definitions

---

## Key Stats

- **Languages:** 5 (DE, EN, UK, FR, AR)
- **Translation Keys:** 100+ hierarchical keys
- **CSS Variables:** 30+ custom properties
- **Components:** 10+ with clear separation of concerns
- **Guard Functions:** Functional pattern (CanActivateFn)
- **Store Methods:** 20+ for state management
- **Accessibility:** WCAG AA compliant throughout
