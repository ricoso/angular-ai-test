# i18n Type-Safe Translations

## Projekt-Vorgabe
<!-- SETUP:VORGABE -->

ALLE konfigurierten Sprachen PFLICHT bei jedem Feature.

---

## Pattern: TypeScript-only (NO JSON!)

```typescript
// src/app/core/i18n/translations.ts
export const translations = {
  de: {
    app: { title: 'Meine App' },
    user: {
      form: { name: 'Name', email: 'E-Mail' },
      buttons: { save: 'Speichern', cancel: 'Abbrechen' },
      errors: { notFound: 'Benutzer nicht gefunden' }
    }
  },
  en: {
    app: { title: 'My App' },
    user: {
      form: { name: 'Name', email: 'Email' },
      buttons: { save: 'Save', cancel: 'Cancel' },
      errors: { notFound: 'User not found' }
    }
  }
  // weitere Sprachen je nach Setup (fr, es)
} as const;

export type Translations = DeepStringify<typeof translations.de>;
export type Language = keyof typeof translations;
```

---

## TranslateService

```typescript
@Injectable({ providedIn: 'root' })
export class TranslateService {
  private readonly aktuelleSprache = signal<Language>('de');
  private readonly aktuelleUebersetzungen = computed(() =>
    translations[this.aktuelleSprache()]
  );

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

## Usage

**Component:**
```typescript
protected readonly t = inject(TranslateService).t;
```

**Template (direkter Zugriff, KEIN `()`):**
```html
<h1>{{ t.app.title }}</h1>
<button>{{ t.user.buttons.save }}</button>
<img [alt]="t.header.logo.alt" />
```

**Logik:**
```typescript
const msg = this.t.user.errors.notFound;
```

---

## Key Naming

```
{feature}.{type}.{name}
```
`feature`: user, product, app, header
`type`: form, buttons, errors, success, labels

---

## DO / DON'T

| DO | DON'T |
|----|-------|
| `inject(TranslateService).t` | ~~`{{ 'key' \| translate }}`~~ |
| `t.path.to.key` | ~~`t().path`~~ |
| TypeScript translations | ~~JSON files~~ |
| camelCase Keys | ~~Hardcoded strings~~ |
