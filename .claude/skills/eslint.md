# ESLint Skill

**Wann:** Bei Linting-Fehlern, vor Commits, bei neuen Features

---

## Quick Commands

```bash
npm run lint               # Check all
npm run lint:fix           # Auto-fix
npx eslint src/path.ts     # Specific file
```

---

## Config: `eslint.config.js` (Flat Config)

Flat Config mit `typescript-eslint`, `angular-eslint`, `eslint-plugin-import`, `simple-import-sort`.

### Config-Sections (Reihenfolge!)

| Section | Files | Zweck |
|---------|-------|-------|
| Global Ignores | `dist/`, `*.config.ts`, `*.config.js` | Nicht gelintet |
| TypeScript | `**/*.ts` | Hauptregeln |
| Templates | `**/*.html` | Angular Template Rules |
| Spec/Test | `**/*.spec.ts`, `setup-jest.ts` | Relaxte Regeln |
| Store | `**/*.store.ts` | NgRx-spezifisch |
| Resolver/Guard | `**/*.resolver.ts`, `**/*.guard.ts` | Kein explicit-member-accessibility |
| Model/Interface | `**/models/**/*.ts` | Kein return type nötig |
| Playwright | `playwright/**/*.ts` | E2E-Tests, stark relaxt |

---

## Bekannte Patterns & Ausnahmen

### 1. Signal-Reads in Templates (Warning, nicht Error)

```html
<!-- ⚠️ WARNING (akzeptiert): Signal-Reads sind syntaktisch Funktionsaufrufe -->
[brands]="store.brands()"
{{ cartStore.badgeText() }}
```

`no-call-expression` ist auf `warn` gesetzt weil Angular Signals `signal()` Syntax nutzen.

### 2. NgRx Store Naming (PascalCase erlaubt)

```typescript
// ✅ GOOD — exported const mit PascalCase erlaubt
export const BookingStore = signalStore({ ... });
export const CartStore = signalStore({ ... });

// ✅ GOOD — camelCase und UPPER_CASE auch weiterhin erlaubt
export const appConfig = { ... };
export const INITIAL_STATE = { ... };
```

Config: `selector: 'variable', modifiers: ['const', 'exported'], format: ['camelCase', 'PascalCase', 'UPPER_CASE']`

### 3. rxMethod\<void\> in Stores

```typescript
// ✅ GOOD — no-invalid-void-type ist für *.store.ts deaktiviert
loadBrands: rxMethod<void>(pipe(...))
```

`@typescript-eslint/no-invalid-void-type` erkennt void in Funktions-Type-Argumenten nicht als gültig (TypeScript-ESLint Limitation).

### 4. Template Literal mit Zahlen

```typescript
// ✅ GOOD — allowNumber: true
const text = `${count} items`;
const badge = `${MAX_BADGE_COUNT}+`;
```

### 5. Deprecated APIs (nur Warning)

```typescript
// ⚠️ WARNING (akzeptiert): Angular API-Migration schrittweise
provideAnimations()           // → Angular 20.2+: animate.enter/leave
BrowserDynamicTestingModule   // → BrowserTestingModule
```

---

## Pflicht-Regeln bei neuem Code

### Accessibility Modifiers (PFLICHT!)

```typescript
// ✅ GOOD
export class MyComponent {
  public readonly brands = input.required<BrandDisplay[]>();
  public readonly brandSelected = output<Brand>();
  protected readonly store = inject(BookingStore);
  private readonly router = inject(Router);

  protected onClick(): void { ... }
  public transform(key: string): string { ... }
}
```

### Floating Promises

```typescript
// ✅ GOOD — void operator für Fire-and-Forget
void this.router.navigate(['/home']);

// ❌ BAD — unbehandeltes Promise
this.router.navigate(['/home']);
```

### Console Logging

```typescript
// ✅ GOOD — erlaubte Methoden
console.debug('[Store] loaded');
console.warn('Fallback used');
console.error('Failed');

// ❌ BAD — console.log nicht erlaubt
console.log('debug info');
```

### Error Typing in Catch

```typescript
// ✅ GOOD
.catch((err: unknown) => { console.error(err); });
error: (err: unknown) => {
  const message = err instanceof Error ? err.message : 'Unknown error';
}

// ❌ BAD
.catch((err) => { ... });  // implizit any
error: (error) => { error.message }  // unsafe member access
```

### A11y in Templates

```html
<!-- ✅ GOOD — click + keydown + focusable -->
<div role="group" tabindex="-1"
  (click)="$event.stopPropagation()"
  (keydown)="$event.stopPropagation()">

<!-- ❌ BAD — nur click, nicht keyboard-accessible -->
<div (click)="$event.stopPropagation()">
```

### Async/Await Konsistenz

```typescript
// ✅ GOOD — kein async wenn kein await nötig
getBrands(): Promise<BrandDisplay[]> {
  return Promise.resolve(AVAILABLE_BRANDS);
}

// ❌ BAD — async ohne await (require-await)
async getBrands(): Promise<BrandDisplay[]> {
  return AVAILABLE_BRANDS;
}
```

### Nullish Coalescing

```typescript
// ✅ GOOD
const value = stored ?? '{}';

// ❌ BAD
const value = stored || '{}';
```

---

## Pre-Commit

```bash
npm run lint:fix && npm run type-check
```

---

## Troubleshooting

```bash
# Cache löschen
rm -rf .angular/cache

# Effective Config für eine Datei prüfen
npx eslint --print-config src/app/path/file.ts | jq '.rules["rule-name"]'

# Nur Errors anzeigen (Warnings ignorieren)
npx eslint . --quiet
```
