# Check i18n Command

Prüft ob alle Texte korrekt übersetzt sind und das i18n-Pattern korrekt eingehalten wird.

## Usage

```
<feature-name>
```

Beispiel: `carinformation`

## Checks

### 1. Feature-Alias — kein `t = i18nKeys` (VERBOTEN)

```typescript
// ✅ GOOD — sprechender Feature-Alias
protected readonly carinformation = i18nKeys.booking.carinformation;
protected readonly header = i18nKeys.header;

// ❌ BAD — generischer t-Name, nicht erlaubt
protected readonly t = i18nKeys;
protected readonly t = i18nKeys.booking.carinformation;
```

### 2. Templates — i18nKeys-Alias, kein String-Literal

```html
<!-- ✅ GOOD -->
<h1>{{ carinformation.title | translate }}</h1>
<label>{{ carinformation.form.email.label | translate }}</label>
<mat-error>{{ carinformation.form.email.error.required | translate }}</mat-error>

<!-- ❌ BAD — String-Literal statt i18nKeys -->
<h1>{{ 'booking.carinformation.title' | translate }}</h1>

<!-- ❌ BAD — t ist kein sprechender Name -->
<h1>{{ t.booking.carinformation.title | translate }}</h1>

<!-- ❌ BAD — Hardcoded -->
<h1>Fahrzeugdaten</h1>
```

### 3. Alle Sprachen vorhanden (DE + EN + UK + FR + AR)

```typescript
// ✅ GOOD
export const translations = {
  de: { booking: { carinformation: { title: 'Fahrzeugdaten' } } },
  en: { booking: { carinformation: { title: 'Vehicle Data' } } },
  uk: { booking: { carinformation: { title: 'Дані автомобіля' } } },
  fr: { booking: { carinformation: { title: 'Données du véhicule' } } },
  ar: { booking: { carinformation: { title: 'بيانات السيارة' } } }
}

// ❌ BAD — Sprache fehlt
de: { booking: { carinformation: { title: 'Fahrzeugdaten' } } }
// en/uk/fr/ar fehlt
```

### 4. Nested Key-Struktur (kein flaches `validation.*`)

```typescript
// ✅ GOOD — field-spezifische nested Keys
form: {
  email: { label: '...', error: { required: '...', invalid: '...' } },
  firstName: { label: '...', error: { required: '...', lettersOnly: '...' } }
}

// ❌ BAD — flache Validation-Keys
validation: {
  required: '...',
  email: '...',
  lettersOnly: '...'
}
```

### 5. Keine hardcoded Texte in Templates
- Buttons, Labels, Titles, Placeholders
- Error Messages, Hints, aria-label

### 6. TranslatePipe in Component imports

```typescript
// ✅ GOOD
@Component({
  imports: [TranslatePipe]
})
```

## Output

```
🌐 Checking i18n for: carinformation

✅ Feature-Alias
   ✅ carinformation = i18nKeys.booking.carinformation (sprechend)
   ✅ Kein 't = i18nKeys' gefunden

✅ Templates
   ✅ Alle Texte via i18nKeys-Alias
   ✅ Keine hardcoded Strings
   ✅ Keine String-Literal Keys

✅ Sprachen
   ✅ DE vorhanden
   ✅ EN vorhanden
   ✅ UK vorhanden
   ✅ FR vorhanden
   ✅ AR vorhanden

✅ Key-Struktur
   ✅ Nested (form.email.error.required)
   ✅ Kein flaches validation.*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Score: 100/100
✅ Alle i18n-Checks bestanden
```
