# i18n Type-Safe Translations Skill

**Wann:** Bei mehrsprachigen Features

**Regel:** UI IMMER bilingual (DE + EN), unabhängig von Code-Sprache!

---

## Pattern: TypeScript-only (NO JSON!)

```typescript
// src/app/core/i18n/translations.ts
export const translations = {
  de: {
    'app.title': 'Meine App',
    'user.form.name': 'Name',
    'user.form.email': 'E-Mail',
    'user.buttons.save': 'Speichern',
    'user.errors.notFound': 'Benutzer nicht gefunden'
  },
  en: {
    'app.title': 'My App',
    'user.form.name': 'Name',
    'user.form.email': 'Email',
    'user.buttons.save': 'Save',
    'user.errors.notFound': 'User not found'
  }
};

export type TranslationKey = keyof typeof translations.de;
export type Language = keyof typeof translations;
```

---

## TranslateService

```typescript
// src/app/core/i18n/translate.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { translations, TranslationKey, Language } from './translations';

@Injectable({ providedIn: 'root' })
export class TranslateService {
  private currentLang = signal<Language>('de');
  
  // Get current translations
  private currentTranslations = computed(() => 
    translations[this.currentLang()]
  );
  
  // Type-safe instant translation
  instant(key: TranslationKey): string {
    return this.currentTranslations()[key] || key;
  }
  
  // Observable translation (for templates)
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

feature: user, product, app
type: form, buttons, errors, success, labels
name: specific identifier
```

**Examples:**
```typescript
'user.form.firstName'
'user.buttons.save'
'user.errors.notFound'
'product.labels.price'
```

---

## Best Practices

### ✅ DO
- Type-safe keys (TranslationKey)
- All UI text via i18n (both DE + EN)
- Consistent naming convention
- Pipe in templates
- instant() in components

### ❌ DON'T
- Hardcoded strings in templates
- JSON translation files
- Missing translations in one language
- Inconsistent key naming
