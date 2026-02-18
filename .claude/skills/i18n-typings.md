# i18n Type-Safe Translations

## Projekt-Vorgabe
- UI-Sprachen: DE, EN
- Default: DE
- ALLE Sprachen PFLICHT bei jedem Feature

ALLE konfigurierten Sprachen PFLICHT bei jedem Feature.

---

## Pattern: TypeScript-only (NO JSON!) - i18nKeys + TranslatePipe

```typescript
// src/app/core/i18n/translations.ts
export const translations = {
  de: {
    app: {
      title: 'Meine App',
      subtitle: 'Untertitel'
    },
    user: {
      form: { name: 'Name', email: 'E-Mail' },
      buttons: { save: 'Speichern', cancel: 'Abbrechen' },
      errors: { notFound: 'Benutzer nicht gefunden' }
    }
  },
  en: {
    app: {
      title: 'My App',
      subtitle: 'Subtitle'
    },
    user: {
      form: { name: 'Name', email: 'Email' },
      buttons: { save: 'Save', cancel: 'Cancel' },
      errors: { notFound: 'User not found' }
    }
  }
  // weitere Sprachen je nach Setup (fr, es)
} as const;

export type TranslationKey = NestedKeyOf<typeof translations.de>;
export type Language = keyof typeof translations;

/** Object-oriented key access: i18nKeys.header.warenkorb.button → 'header.warenkorb.button' */
export const i18nKeys = createKeyTree(translations.de);
```

### i18nKeys (KeyTree)

Spiegelt die Translations-Struktur, aber Blätter sind dot-separated Key-Pfade:

```typescript
i18nKeys.app.title           // → 'app.title' (TranslationKey)
i18nKeys.header.warenkorb.button  // → 'header.warenkorb.button'
i18nKeys.user.form.name      // → 'user.form.name'
```

---

## TranslateService

```typescript
// src/app/core/i18n/translate.service.ts
@Injectable({ providedIn: 'root' })
export class TranslateService {
  private readonly currentLanguage = signal<Language>(this.loadLanguageFromStorage());

  private readonly currentTranslations = computed(() =>
    translations[this.currentLanguage()]
  );

  /** Resolves a dot-separated key to the translated string */
  instant(key: TranslationKey): string { ... }

  /** Returns a computed signal for reactive templates */
  get(key: TranslationKey): () => string { ... }

  /** Switches the language */
  use(language: Language): void { ... }

  /** Returns the current language */
  getCurrentLanguage(): Language { ... }

  /** Returns the current language as a signal */
  getLanguageSignal(): () => Language { ... }
}
```

---

## TranslatePipe

```typescript
// src/app/core/i18n/translate.pipe.ts
@Pipe({ name: 'translate', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  transform(key: TranslationKey): string {
    return this.translateService.instant(key);
  }
}
```

---

## Usage in Components

### Component Setup

```typescript
import { Component } from '@angular/core';
import { TranslatePipe, i18nKeys } from '@core/i18n';

@Component({
  selector: 'app-my-component',
  templateUrl: './my.component.html',
  imports: [TranslatePipe]  // TranslatePipe importieren!
})
export class MyComponent {
  // i18nKeys-Teilbaum als Property (Type-safe!)
  protected readonly user = i18nKeys.user;
  protected readonly app = i18nKeys.app;
}
```

### In Templates (i18nKeys + Pipe)

```html
<!-- i18nKeys liefert den Key-String, Pipe löst auf -->
<h1>{{ app.title | translate }}</h1>
<label>{{ user.form.name | translate }}</label>
<button>{{ user.buttons.save | translate }}</button>

<!-- In Attributen -->
<img [alt]="header.logo.alt | translate" />
<button [attr.aria-label]="header.accessibility.buttonLabel | translate">
```

### In Component-Logik (translateService.instant)

```typescript
import { TranslateService, i18nKeys } from '@core/i18n';

export class MyComponent {
  private readonly translateService = inject(TranslateService);
  private readonly user = i18nKeys.user;

  protected showMessage(): void {
    const msg = this.translateService.instant(this.user.errors.notFound);
    this.notification.show(msg);
  }
}
```

### Computed Signal (reaktiv)

```typescript
export class MyComponent {
  private readonly translateService = inject(TranslateService);

  // Reactive — updates on language switch
  protected readonly label = this.translateService.get(i18nKeys.user.form.name);
}
```

```html
<label>{{ label() }}</label>
```

### Language Switcher

```typescript
export class LanguageSwitcherComponent {
  private readonly translateService = inject(TranslateService);
  protected readonly currentLang = this.translateService.getLanguageSignal();

  protected switchLanguage(lang: 'de' | 'en'): void {
    this.translateService.use(lang);
  }
}
```

---

## Key Naming

```
{feature}.{type}.{name}

feature: user, product, app, header, buchung
type: form, buttons, errors, success, labels
name: specific identifier
```

**Zugriff in Templates:**
```html
{{ buchung.marke.titel | translate }}
{{ buchung.services.huAu.label | translate }}
{{ buchung.buttons.weiter | translate }}
```

---

## Exports (index.ts)

```typescript
export { translations, i18nKeys, TranslationKey, Language } from './translations';
export { TranslateService } from './translate.service';
export { TranslatePipe } from './translate.pipe';
```

---

## Best Practices

### DO
- `i18nKeys.feature.key` für Type-safe Key-Zugriff
- `TranslatePipe` in Template imports
- `{{ key | translate }}` in Templates
- `translateService.instant(key)` in Logik
- `translateService.get(key)` für reaktive Signals
- Alle UI-Texte via i18n (DE + EN)
- camelCase für Keys
- i18nKeys-Teilbaum als Component Property: `protected readonly header = i18nKeys.header;`

### DON'T
- ~~Hardcoded strings in Templates~~
- ~~JSON translation files~~
- ~~Signal-Aufruf: `t().path`~~
- ~~String-Literal Keys: `{{ 'user.form.name' | translate }}`~~ (nutze `i18nKeys`)

---

## Sprachumschaltung (für E2E & Documentation Agents)

Die aktuelle Sprache wird in **localStorage** gespeichert:
- **Key:** `app-language`
- **Werte:** `'de'` | `'en'`
- **Service:** `TranslateService.use(language)` (src/app/core/i18n/translate.service.ts)

**Playwright MCP Sprachumschaltung:**
```
1. localStorage.setItem('app-language', '<sprache>') via browser_evaluate
2. Page reload → App lädt mit neuer Sprache
3. Screenshot erstellen
```

**Reihenfolge für Doku-Screenshots:**
1. Sprache auf DE setzen → Screenshots erstellen
2. Sprache auf EN setzen → Screenshots erstellen
