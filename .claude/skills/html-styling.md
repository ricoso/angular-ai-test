# HTML & Styling (COMPACT)

**Wann:** Bei ALLEN Components mit HTML/CSS

---

## HTML Regeln

### Keine Inline Styles
```html
<!-- ❌ --> <div style="margin: 16px;">
<!-- ✅ --> <div class="m-4">
```

### Semantic HTML
```html
<header role="banner">
  <nav role="navigation" aria-label="Hauptnavigation">
    <ul><li><a routerLink="/home">{{ 'nav.home' | translate }}</a></li></ul>
  </nav>
</header>
<main role="main" id="main-content"><article><section>...</section></article></main>
<aside role="complementary">...</aside>
<footer role="contentinfo">...</footer>
```

---

## Accessibility (PFLICHT! WCAG 2.1 AA)

### Skip Link + ARIA
```html
<!-- Skip Link (PFLICHT!) -->
<a href="#main-content" class="skip-link">{{ 'a11y.skipToContent' | translate }}</a>

<!-- Icon-Buttons -->
<button [attr.aria-label]="'dialog.close' | translate"><mat-icon aria-hidden="true">close</mat-icon></button>

<!-- Live Regions -->
<div role="status" aria-live="polite" class="sr-only">{{ statusMessage() }}</div>
<div role="alert" aria-live="assertive" @if (error()) { {{ error() }} }</div>

<!-- Images -->
<img [src]="url" [alt]="name" loading="lazy" />        <!-- Content -->
<img src="decoration.svg" alt="" aria-hidden="true" /> <!-- Decorative -->
```

### Keyboard Navigation
```html
<!-- Custom interactive -->
<div tabindex="0" role="button" (keydown.enter)="onSelect()" (keydown.space)="onSelect()" (click)="onSelect()">Card</div>

<!-- Tabs -->
<div role="tablist">
  <button role="tab" [attr.aria-selected]="active" [tabindex]="active ? 0 : -1"
    (keydown.arrowleft)="prev()" (keydown.arrowright)="next()">Tab</button>
</div>
<div role="tabpanel" [attr.aria-labelledby]="tabId">Content</div>
```

### Forms
```html
<label for="email">{{ 'form.email' | translate }}<span aria-hidden="true">*</span></label>
<input id="email" formControlName="email" [attr.aria-required]="true"
  [attr.aria-invalid]="invalid" [attr.aria-describedby]="invalid ? 'email-error' : null" />
@if (invalid) { <div id="email-error" role="alert">{{ 'form.emailError' | translate }}</div> }

<fieldset><legend>{{ 'form.address' | translate }}</legend>...</fieldset>
```

### Font-Size Toggle (Accessibility Button)
```typescript
// font-size-toggle.component.ts
@Component({
  selector: 'app-font-size-toggle',
  template: `
    <div class="font-size-toggle" role="group" [attr.aria-label]="'a11y.fontSize' | translate">
      <button (click)="decrease()" [disabled]="currentSize() <= 0"
        [attr.aria-label]="'a11y.fontDecrease' | translate">A-</button>
      <span class="font-size-toggle__current" aria-live="polite">{{ sizes[currentSize()] }}</span>
      <button (click)="increase()" [disabled]="currentSize() >= sizes.length - 1"
        [attr.aria-label]="'a11y.fontIncrease' | translate">A+</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FontSizeToggleComponent {
  sizes = ['small', 'normal', 'large', 'x-large'];  // 14px, 16px, 18px, 20px
  currentSize = signal(1);  // Default: normal (16px)

  increase(): void {
    if (this.currentSize() < this.sizes.length - 1) {
      this.currentSize.update(s => s + 1);
      this.applySize();
    }
  }

  decrease(): void {
    if (this.currentSize() > 0) {
      this.currentSize.update(s => s - 1);
      this.applySize();
    }
  }

  private applySize(): void {
    document.documentElement.setAttribute('data-font-size', this.sizes[this.currentSize()]);
    localStorage.setItem('font-size', this.sizes[this.currentSize()]);
  }

  constructor() {
    // Restore from localStorage
    const saved = localStorage.getItem('font-size');
    if (saved) {
      const index = this.sizes.indexOf(saved);
      if (index >= 0) this.currentSize.set(index);
      this.applySize();
    }
  }
}
```

```scss
// _accessibility.scss - Font Size Support
:root {
  --font-size-base: 1em;  // 16px default
}

html[data-font-size="small"]   { --font-size-base: 0.875em; }  // 14px
html[data-font-size="normal"]  { --font-size-base: 1em; }      // 16px
html[data-font-size="large"]   { --font-size-base: 1.125em; }  // 18px
html[data-font-size="x-large"] { --font-size-base: 1.25em; }   // 20px

body { font-size: var(--font-size-base); }

.font-size-toggle {
  display: flex;
  align-items: center;
  gap: 0.5em;

  button {
    min-width: 2.75em;
    min-height: 2.75em;
    font-weight: 600;
  }
}
```

---

## SCSS Regeln

### Units: em/rem (PFLICHT!)
```scss
// ✅ em/rem    |  ❌ px
padding: 1em;   // 16px
gap: 0.5em;     // 8px
font: 0.875em;  // 14px

// Conversion: 4px=0.25em, 8px=0.5em, 12px=0.75em, 16px=1em, 24px=1.5em, 32px=2em
```

### BEM Nesting
```scss
.card {
  padding: 1em;
  &__header { margin-bottom: 1em; }
  &__body { padding: 1em; }
  &--featured { border: 0.125em solid var(--primary); }
  &:hover { box-shadow: 0 0.25em 0.5em rgba(0,0,0,0.1); }
}
```

### Placeholders
```scss
// _placeholders.scss
%card-base { background: var(--surface); border-radius: 0.5em; padding: 1em; }
%flex-center { display: flex; align-items: center; justify-content: center; }
%text-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

// Usage
.card { @extend %card-base; }
```

---

## Accessibility SCSS

### Kontrast & Farben (4.5:1 min)
```scss
:root {
  --text-color: #1a1a1a;      // 15:1 auf weiß
  --text-muted: #767676;      // 4.5:1 min!
  --error: #c62828;           // 6.5:1
}

a { text-decoration: underline; }  // Nicht nur Farbe!
```

### Focus Styles (PFLICHT!)
```scss
:focus-visible {
  outline: 0.1875em solid var(--focus-color, #005fcc);
  outline-offset: 0.125em;
}
// ❌ NIEMALS: outline: none;

.skip-link {
  position: absolute; top: -100%; left: 0; padding: 1em;
  background: var(--primary); color: #fff; z-index: 1000;
  &:focus { top: 0; }
}

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
```

### Reduced Motion (PFLICHT!)
```scss
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### High Contrast
```scss
@media (forced-colors: active) {
  button, input { border: 0.125em solid ButtonText; }
  :focus { outline: 0.1875em solid Highlight; }
}
```

---

## Responsive (PFLICHT! Mobile-First!)

### Breakpoints
```scss
$mobile: 30em;   // 480px
$tablet: 48em;   // 768px
$desktop: 64em;  // 1024px

@mixin tablet { @media (min-width: $tablet) { @content; } }
@mixin desktop { @media (min-width: $desktop) { @content; } }
```

### Mobile-First Pattern
```scss
.grid {
  grid-template-columns: 1fr;           // Mobile: 1 col
  @include tablet { grid-template-columns: repeat(2, 1fr); }   // Tablet: 2
  @include desktop { grid-template-columns: repeat(4, 1fr); }  // Desktop: 4
}
```

### Responsive Patterns
```scss
// Navigation: Hamburger Mobile, Horizontal Desktop
.nav__menu { display: none; &--open { display: flex; flex-direction: column; position: fixed; inset: 0; } }
.nav__hamburger { display: block; }
@include desktop {
  .nav__menu { display: flex; flex-direction: row; position: static; }
  .nav__hamburger { display: none; }
}

// Table: Cards Mobile, Table Desktop
.data-table__table { display: none; }
.data-table__cards { display: flex; flex-direction: column; }
@include desktop {
  .data-table__table { display: table; width: 100%; }
  .data-table__cards { display: none; }
}
```

### Touch-Friendly (min 2.75em = 44px)
```scss
.button, .link { min-height: 2.75em; min-width: 2.75em; padding: 0.75em 1em; }
.button-group { gap: 0.75em; }
```

### Visibility Utilities
```scss
.hide-mobile { @include mobile { display: none !important; } }
.hide-desktop { @include desktop { display: none !important; } }
.show-mobile-only { display: none; @include mobile { display: block; } }
.show-desktop-only { display: none; @include desktop { display: block; } }
```

---

## Utility Classes

### Spacing (0.25em increments)
```scss
// m-4 = 1em, p-8 = 2em, gap-2 = 0.5em
@for $i from 0 through 16 {
  .m-#{$i} { margin: #{$i * 0.25}em; }
  .mt-#{$i}, .mr-#{$i}, .mb-#{$i}, .ml-#{$i}, .mx-#{$i}, .my-#{$i} { ... }
  .p-#{$i}, .pt-#{$i}, .pr-#{$i}, .pb-#{$i}, .pl-#{$i}, .px-#{$i}, .py-#{$i} { ... }
  .gap-#{$i} { gap: #{$i * 0.25}em; }
}
```

### Flexbox
```scss
.flex { display: flex; }
.flex-column { flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.flex-1 { flex: 1 1 0%; }
```

### Grid
```scss
.grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
.col-span-2 { grid-column: span 2; }
```

### Display
```scss
.d-none { display: none; }
.d-flex { display: flex; }
.d-grid { display: grid; }
```

---

## Material Overrides

```scss
// _material-overrides.scss (zentral!)
.mat-mdc-button { border-radius: 0.5em; padding: 0.75em 1.5em; }
.mat-mdc-card { border-radius: 0.75em; padding: 1.5em; }
.mat-mdc-dialog-container { border-radius: 1em; padding: 2em; }
.mat-mdc-form-field { width: 100%; }
```

---

## File Structure

```
src/styles/
├── _variables.scss
├── _breakpoints.scss
├── _utilities.scss
├── _placeholders.scss
├── _accessibility.scss
├── _material-overrides.scss
└── styles.scss
```

---

## Checklist

### HTML
- [ ] Keine Inline Styles
- [ ] Semantic HTML + ARIA Landmarks
- [ ] Skip Link vorhanden
- [ ] Labels verknüpft (for/id)

### Accessibility (WCAG 2.1 AA)
- [ ] Font min 1em (16px), nie unter 0.875em
- [ ] Kontrast min 4.5:1
- [ ] Focus sichtbar (:focus-visible)
- [ ] Keyboard-Navigation (Tab, Enter, Space, Arrows)
- [ ] prefers-reduced-motion respektiert
- [ ] Font-Size Toggle verfügbar
- [ ] Screen Reader getestet

### Responsive (Mobile-First)
- [ ] Mobile Layout als Default
- [ ] min-width Media Queries
- [ ] Touch-Targets min 2.75em (44px)
- [ ] Nav: Hamburger/Mobile, Horizontal/Desktop
- [ ] Tables: Cards/Mobile, Table/Desktop
- [ ] Getestet: 375px, 768px, 1024px

### SCSS
- [ ] em/rem statt px
- [ ] BEM mit Nesting
- [ ] Placeholders mit @extend
- [ ] Material Overrides zentral
