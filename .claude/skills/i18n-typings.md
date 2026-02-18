# i18n Type-Safe Translations

## Projekt-Vorgabe
- UI-Sprachen: DE, EN
- Default: DE
- ALLE Sprachen PFLICHT bei jedem Feature

---

## Pattern: TypeScript-only (NO JSON!) - i18nKeys + TranslatePipe

```typescript
// src/app/core/i18n/translations.ts
export const translations = {
  de: {
    app: { title: 'Meine App', subtitle: 'Untertitel' },
    user: {
      form: { name: 'Name', email: 'E-Mail' },
      buttons: { save: 'Speichern', cancel: 'Abbrechen' },
      errors: { notFound: 'Benutzer nicht gefunden' }
    }
  },
  en: {
    app: { title: 'My App', subtitle: 'Subtitle' },
    user: {
      form: { name: 'Name', email: 'Email' },
      buttons: { save: 'Save', cancel: 'Cancel' },
      errors: { notFound: 'User not found' }
    }
  }
} as const;

export type TranslationKey = NestedKeyOf<typeof translations.de>;
export type Language = keyof typeof translations;

/** Object-oriented key access: i18nKeys.header.warenkorb.button → 'header.warenkorb.button' */
export const i18nKeys = createKeyTree(translations.de);
```

### i18nKeys (KeyTree)

```typescript
i18nKeys.app.title           // → 'app.title' (TranslationKey)
i18nKeys.user.form.name      // → 'user.form.name'
```

---

## TranslateService

```typescript
@Injectable({ providedIn: 'root' })
export class TranslateService {
  private readonly currentLanguage = signal<Language>(this.loadLanguageFromStorage());
  private readonly currentTranslations = computed(() => translations[this.currentLanguage()]);

  instant(key: TranslationKey): string { ... }
  get(key: TranslationKey): () => string { ... }  // Computed signal for reactive templates
  use(language: Language): void { ... }
  getCurrentLanguage(): Language { ... }
  getLanguageSignal(): () => Language { ... }
}
```

---

## TranslatePipe

```typescript
@Pipe({ name: 'translate', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  transform(key: TranslationKey): string {
    return this.translateService.instant(key);
  }
}
```

---

## Usage in Templates (i18nKeys + Pipe)

```typescript
@Component({
  imports: [TranslatePipe]
})
export class MyComponent {
  protected readonly user = i18nKeys.user;
  protected readonly app = i18nKeys.app;
}
```

```html
<h1>{{ app.title | translate }}</h1>
<label>{{ user.form.name | translate }}</label>
<button>{{ user.buttons.save | translate }}</button>
<img [alt]="header.logo.alt | translate" />
```

### In Component-Logik (translateService.instant)

```typescript
export class MyComponent {
  private readonly translateService = inject(TranslateService);
  private readonly user = i18nKeys.user;

  protected showMessage(): void {
    const msg = this.translateService.instant(this.user.errors.notFound);
    this.notification.show(msg);
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

**Exports:** `translations`, `i18nKeys`, `TranslationKey`, `Language`, `TranslateService`, `TranslatePipe` — alle aus `@core/i18n` (index.ts)

---

## Best Practices

### DO
- `i18nKeys.feature.key` für Type-safe Key-Zugriff
- `TranslatePipe` in Template imports
- `{{ key | translate }}` in Templates
- `translateService.instant(key)` in Logik
- Alle UI-Texte via i18n (DE + EN)
- i18nKeys-Teilbaum als Component Property: `protected readonly header = i18nKeys.header;`

### DON'T
- ~~Hardcoded strings in Templates~~
- ~~JSON translation files~~
- ~~String-Literal Keys: `{{ 'user.form.name' | translate }}`~~ (nutze `i18nKeys`)

---

## Sprachumschaltung (E2E / Docs)

localStorage Key `app-language` (`'de'` | `'en'`), Service: `TranslateService.use(language)`
Playwright: `localStorage.setItem('app-language', '<sprache>')` → Page reload → Screenshot
