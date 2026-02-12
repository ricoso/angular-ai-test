# i18n Type-Safe Translations Skill

**Wann:** Bei mehrsprachigen Features

**Regel:** UI IMMER bilingual (DE + EN), unabhängig von Code-Sprache!

---

## Pattern: TypeScript-only (NO JSON!) - Verschachtelt (Nested)

```typescript
// src/app/core/i18n/translations.ts
export const translations = {
  de: {
    app: {
      title: 'Meine App',
      subtitle: 'Untertitel'
    },
    user: {
      form: {
        name: 'Name',
        email: 'E-Mail'
      },
      buttons: {
        save: 'Speichern',
        cancel: 'Abbrechen'
      },
      errors: {
        notFound: 'Benutzer nicht gefunden'
      }
    }
  },
  en: {
    app: {
      title: 'My App',
      subtitle: 'Subtitle'
    },
    user: {
      form: {
        name: 'Name',
        email: 'Email'
      },
      buttons: {
        save: 'Save',
        cancel: 'Cancel'
      },
      errors: {
        notFound: 'User not found'
      }
    }
  }
} as const;

// Hilfstypes für verschachtelte Keys
type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
          : `${K}`
        : never;
    }[keyof T]
  : never;

export type TranslationKey = NestedKeyOf<typeof translations.de>;
export type Language = keyof typeof translations;
```

---

## TranslateService (mit Nested Key Support)

```typescript
// src/app/core/i18n/translate.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { translations, TranslationKey, Language } from './translations';

/**
 * Hilfsfunktion zum Auflösen von verschachtelten Keys
 * 'user.form.name' → translations.de.user.form.name
 */
function getNestedValue(obj: unknown, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return typeof current === 'string' ? current : undefined;
}

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private currentLang = signal<Language>('de');

  private currentTranslations = computed(() =>
    translations[this.currentLang()]
  );

  // Type-safe instant translation mit Nested Key Support
  instant(key: TranslationKey): string {
    const value = getNestedValue(this.currentTranslations(), key);
    return value ?? key;
  }

  // Computed Signal für reaktive Templates
  get(key: TranslationKey) {
    return computed(() => this.instant(key));
  }

  // Switch language
  use(lang: Language) {
    this.currentLang.set(lang);
    localStorage.setItem('lang', lang);
  }

  // Get current language
  getCurrentLang(): Language {
    return this.currentLang();
  }
}
```

---

## TranslatePipe

```typescript
// src/app/core/i18n/translate.pipe.ts
import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from './translate.service';
import { TranslationKey } from './translations';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Re-evaluate on language change
})
export class TranslatePipe implements PipeTransform {
  private translate = inject(TranslateService);

  transform(key: TranslationKey): string {
    return this.translate.instant(key);
  }
}
```

---

## Usage

### In Templates

```html
<h1>{{ 'app.title' | translate }}</h1>
<label>{{ 'user.form.name' | translate }}</label>
<button>{{ 'user.buttons.save' | translate }}</button>
```

### In Components

```typescript
import { TranslateService } from '@core/i18n/translate.service';

export class MyComponent {
  private translate = inject(TranslateService);

  showMessage() {
    const msg = this.translate.instant('user.errors.notFound');
    this.notification.show(msg);
  }
}
```

### Language Switcher

```typescript
export class LanguageSwitcherComponent {
  private translate = inject(TranslateService);

  currentLang = computed(() => this.translate.getCurrentLang());

  switchLanguage(lang: 'de' | 'en') {
    this.translate.use(lang);
  }
}
```

```html
<button (click)="switchLanguage('de')"
        [class.active]="currentLang() === 'de'">
  DE
</button>
<button (click)="switchLanguage('en')"
        [class.active]="currentLang() === 'en'">
  EN
</button>
```

---

## Key Naming Convention

```
{feature}.{type}.{name}

feature: user, product, app, header, buchung
type: form, buttons, errors, success, labels
name: specific identifier
```

**Nested Structure:**
```typescript
// Gut: Verschachtelt und konsistent
buchung: {
  marke: {
    titel: '...',
    untertitel: '...'
  },
  services: {
    huAu: {
      label: '...',
      beschreibung: '...'
    }
  },
  buttons: {
    weiter: '...',
    zurueck: '...'
  },
  fehler: {
    pflichtfeld: '...',
    emailUngueltig: '...'
  }
}
```

**Zugriff in Templates:**
```html
{{ 'buchung.marke.titel' | translate }}
{{ 'buchung.services.huAu.label' | translate }}
{{ 'buchung.buttons.weiter' | translate }}
{{ 'buchung.fehler.pflichtfeld' | translate }}
```

---

## Best Practices

### DO
- Type-safe keys (TranslationKey)
- All UI text via i18n (both DE + EN)
- Consistent naming convention
- **Beide Sprachen im gleichen verschachtelten Format**
- Pipe in templates
- instant() in components
- camelCase für Keys (huAu, nicht hu-au)

### DON'T
- Hardcoded strings in templates
- JSON translation files
- Missing translations in one language
- Inconsistent key naming
- **Flat keys in einer Sprache, nested in der anderen**
- Bindestriche in Keys (hu-au → huAu)
