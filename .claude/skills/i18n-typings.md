# i18n Type-Safe Translations

## Projekt-Vorgabe
- UI-Sprachen: DE, EN, UK, FR, AR
- Default: DE
- ALLE Sprachen PFLICHT bei jedem Feature

---

## Pattern: TypeScript-only (NO JSON!) - i18nKeys + TranslatePipe

```typescript
// src/app/core/i18n/translations.ts
export const translations = {
  de: {
    app: { title: 'Meine App' },
    booking: {
      carinformation: {
        title: 'Fahrzeugdaten',
        form: {
          email: { label: 'E-Mail', placeholder: 'max@muster.de',
            error: { required: 'Pflichtfeld.', invalid: 'Ungültige E-Mail.' } },
          firstName: { label: 'Vorname', placeholder: 'Max',
            error: { required: 'Pflichtfeld.', lettersOnly: 'Nur Buchstaben.' } }
        },
        navigation: { back: 'Zurück', continue: 'Weiter' }
      }
    }
  },
  en: { /* ... same structure ... */ }
} as const;

export type TranslationKey = NestedKeyOf<typeof translations.de>;
export type Language = keyof typeof translations;

/** Object-oriented key access: i18nKeys.booking.carinformation.form.email.label → 'booking.carinformation.form.email.label' */
export const i18nKeys = createKeyTree(translations.de);
```

### i18nKeys (KeyTree)

```typescript
i18nKeys.app.title                                      // → 'app.title'
i18nKeys.booking.carinformation.form.email.label        // → 'booking.carinformation.form.email.label'
i18nKeys.booking.carinformation.form.email.error.required // → 'booking.carinformation.form.email.error.required'
```

---

## Usage in Components — Feature-Scoped Alias (PFLICHT!)

**VERBOTEN:** `protected readonly t = i18nKeys;` — zu generisch, kein sprechender Name!

**PFLICHT:** Alias auf das Feature-Subtree zeigen lassen:

```typescript
// ✅ Container: auf Feature-Ebene scoppen
export class CarinformationContainerComponent {
  protected readonly carinformation = i18nKeys.booking.carinformation;
}

// ✅ Presentational: selber Scope wenn Component nur ein Feature kennt
export class CustomerFormComponent {
  protected readonly carinformation = i18nKeys.booking.carinformation;
}

// ✅ Shared Component: auf passende Ebene
export class HeaderComponent {
  protected readonly header = i18nKeys.header;
  protected readonly app = i18nKeys.app;
}
```

**Naming-Regel:** Alias = Feature-Name (camelCase), zeigt auf `i18nKeys.<path>`:
- `carinformation = i18nKeys.booking.carinformation`
- `brand = i18nKeys.booking.brand`
- `header = i18nKeys.header`

---

## Templates

```html
<!-- ✅ GOOD — sprechende Variable, kurze Pfade -->
<h1>{{ carinformation.title | translate }}</h1>
<label>{{ carinformation.form.email.label | translate }}</label>
<mat-error>{{ carinformation.form.email.error.required | translate }}</mat-error>
<button>{{ carinformation.navigation.continue | translate }}</button>

<!-- ❌ BAD — t ist nicht sprechend -->
<h1>{{ t.booking.carinformation.title | translate }}</h1>

<!-- ❌ BAD — Hardcoded String, kein i18nKeys -->
<h1>{{ 'booking.carinformation.title' | translate }}</h1>
```

### In Component-Logik (computed signal)

```typescript
export class CustomerFormComponent {
  protected readonly carinformation = i18nKeys.booking.carinformation;

  protected readonly emailErrors = computed(() => {
    const ctrl = this.form().get('email');
    if (!ctrl?.touched || ctrl.valid) { return null; }
    if (ctrl.hasError('required')) { return this.carinformation.form.email.error.required; }
    if (ctrl.hasError('email'))    { return this.carinformation.form.email.error.invalid; }
    return null;
  });
}
```

---

## Key Naming (Nested Structure)

```
{feature}.{type}.{field}.{subtype}.{name}

Beispiel: booking.carinformation.form.email.error.required
          booking.carinformation.form.firstName.error.lettersOnly
          booking.carinformation.navigation.back

Ebenen:
  feature    → carinformation, brand, services, ...
  type       → form, navigation, returningCustomer, ...
  field      → email, firstName, licensePlate, ...
  subtype    → error, hint, ...
  name       → required, invalid, lettersOnly, ...
```

**Exports:** `translations`, `i18nKeys`, `TranslationKey`, `Language`, `TranslateService`, `TranslatePipe` — alle aus `@core/i18n` (index.ts)

---

## Best Practices

### DO
- Feature-Alias: `protected readonly carinformation = i18nKeys.booking.carinformation;`
- `TranslatePipe` in Template imports
- `{{ carinformation.form.email.label | translate }}` in Templates
- `translateService.instant(key)` in Logik (nicht im Template)
- Alle UI-Texte via i18n (DE + EN + UK + FR + AR)
- Nested Keys: `form.email.error.required` statt flach `validation.emailRequired`

### DON'T
- ~~`protected readonly t = i18nKeys;`~~ — generisch, nicht erlaubt
- ~~Hardcoded strings in Templates~~
- ~~JSON translation files~~
- ~~String-Literal Keys: `{{ 'booking.carinformation.title' | translate }}`~~ (nutze `i18nKeys`)
- ~~Flache Key-Struktur: `validation.required`~~ — nutze field-spezifische nested Keys

---

## Sprachumschaltung (E2E / Docs)

localStorage Key `app-language` (`'de'` | `'en'`), Service: `TranslateService.use(language)`
Playwright: `localStorage.setItem('app-language', '<sprache>')` → Page reload → Screenshot
