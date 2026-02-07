# Check i18n Command

Prüft ob alle Texte korrekt übersetzt sind (DE + EN).

## Usage

```
<feature-name>
```

Beispiel: `user-notifications`

## Checks

### 1. Alle Texte haben i18n Keys
```html
<!-- ✅ GOOD -->
<h1>{{ 'user.title' | translate }}</h1>
<button>{{ 'common.save' | translate }}</button>

<!-- ❌ BAD -->
<h1>Benutzer</h1>
<button>Speichern</button>
```

### 2. Beide Sprachen vorhanden (DE + EN)
```typescript
// ✅ GOOD
translations = {
  de: { 'user.title': 'Benutzer' },
  en: { 'user.title': 'Users' }
}

// ❌ BAD - EN fehlt
translations = {
  de: { 'user.title': 'Benutzer' }
}
```

### 3. Keine hardcoded Texte in Templates
- Buttons, Labels, Titles, Placeholders
- Error Messages
- Tooltips

### 4. TypeScript Typings vorhanden
```typescript
// ✅ GOOD - Type-safe keys
type TranslationKeys = 'user.title' | 'user.list' | 'common.save';

// ❌ BAD - String ohne Type
translate('user.title')
```

## Output

```
🌐 Checking i18n for: user-notifications

✅ Translation Keys
   ✅ All texts use translate pipe
   ✅ No hardcoded strings found

⚠️ Missing Translations
   ❌ 'notification.empty' - EN missing
   ❌ 'notification.error' - DE missing

✅ TypeScript Typings
   ✅ All keys are type-safe

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Score: 90/100
❌ 2 missing translations
```
