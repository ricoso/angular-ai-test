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
<div tabindex="0" role="button" (keydown.enter)="onSelect()" (keydown.space)="onSelect()" (click)="onSelect()">Card</div>

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
%card-base { background: var(--surface); border-radius: 0.5em; padding: 1em; }
%flex-center { display: flex; align-items: center; justify-content: center; }
%text-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

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
  @include tablet { grid-template-columns: repeat(2, 1fr); }
  @include desktop { grid-template-columns: repeat(4, 1fr); }
}
```

### Touch-Friendly (min 2.75em = 44px)
```scss
.button, .link { min-height: 2.75em; min-width: 2.75em; padding: 0.75em 1em; }
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
