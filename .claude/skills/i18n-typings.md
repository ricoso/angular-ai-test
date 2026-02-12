# i18n Type-Safe Translations Skill

**Wann:** Bei mehrsprachigen Features

**Regel:** UI IMMER bilingual (DE + EN), unabhängig von Code-Sprache!

---

## Pattern: TypeScript-only (NO JSON!) - Objektorientiert

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
} as const;

export type Translations = DeepStringify<typeof translations.de>;
export type Language = keyof typeof translations;
```

---

## TranslateService

```typescript
// src/app/core/i18n/translate.service.ts
@Injectable({ providedIn: 'root' })
export class TranslateService {
  private readonly aktuelleSprache = signal<Language>('de');

  private readonly aktuelleUebersetzungen = computed(() =>
    translations[this.aktuelleSprache()]
  );

  /**
   * Reaktives Translations-Objekt für Templates
   * Proxy ermöglicht direkten Zugriff: t.app.title
   */
  readonly t: Translations = new Proxy({} as Translations, {
    get: (_, prop: string) =>
      (this.aktuelleUebersetzungen() as Record<string, unknown>)[prop]
  });

  use(sprache: Language): void {
    this.aktuelleSprache.set(sprache);
    localStorage.setItem('app-language', sprache);
  }
}
```

---

## Usage in Components

### Component Setup

```typescript
import { Component, inject } from '@angular/core';
import { TranslateService } from '@core/i18n';

@Component({
  selector: 'app-my-component',
  templateUrl: './my.component.html'
})
export class MyComponent {
  // Direkt vom Service - fertig!
  protected readonly t = inject(TranslateService).t;
}
```

### In Templates (Direkter Zugriff - KEIN `()` nötig!)

```html
<!-- Direkter Objekt-Zugriff - Type-safe! -->
<h1>{{ t.app.title }}</h1>
<label>{{ t.user.form.name }}</label>
<button>{{ t.user.buttons.save }}</button>

<!-- In Attributen -->
<img [alt]="t.header.logo.alt" />
<button [attr.aria-label]="t.header.accessibility.buttonLabel">
```

### In Component-Logik

```typescript
export class MyComponent {
  protected readonly t = inject(TranslateService).t;

  showMessage(): void {
    const msg = this.t.user.errors.notFound;
    this.notification.show(msg);
  }
}
```

### Language Switcher

```typescript
export class LanguageSwitcherComponent {
  private readonly translateService = inject(TranslateService);

  protected wechsleSprache(sprache: 'de' | 'en'): void {
    this.translateService.use(sprache);
  }
}
```

---

## Key Naming Convention

```
{feature}.{type}.{name}

feature: user, product, app, header, buchung
type: form, buttons, errors, success, labels
name: specific identifier
```

**Zugriff in Templates:**
```html
{{ t.buchung.marke.titel }}
{{ t.buchung.services.huAu.label }}
{{ t.buchung.buttons.weiter }}
```

---

## Migration

### Alt (Pipe)
```html
{{ 'user.form.name' | translate }}
```

### Neu (Objekt)
```html
{{ t.user.form.name }}
```

### Component Migration
```typescript
// Alt
import { TranslatePipe } from '@core/i18n';
@Component({ imports: [TranslatePipe] })

// Neu - Kein Import nötig!
protected readonly t = inject(TranslateService).t;
```

---

## Best Practices

### DO
- `inject(TranslateService).t` in Components
- Direkter Zugriff: `t.path.to.key`
- Type-safe durch TypeScript + Proxy
- Alle UI-Texte via i18n (DE + EN)
- camelCase für Keys

### DON'T
- ~~Pipe: `{{ 'key' | translate }}`~~
- ~~Signal-Aufruf: `t().path`~~
- Hardcoded strings
- JSON translation files
