# Angular 21 Projekt - Claude Code Anweisungen

## Projekt-Info

- **Framework**: Angular 21 Standalone Components
- **State**: NgRx Signal Store (**NUR Feature Store Pattern!**)
- **UI**: Angular Material 21
- **Testing**: Jest 30
- **i18n**: ngx-translate (TypeScript Typings)

---

## 🔴 ARCHITEKTUR-REGELN

### Container/Presentational Pattern
- 1 Route = 1 Container Component + Presentational Children
- Container: `inject(Store)`, OnPush, Event Handler (`onXxx()`)
- Presentational: `input()`, `output()` only, KEIN Store, KEINE Services

### Feature Store Pattern (PFLICHT!)
- IMMER: `withState`, `withComputed`, `withMethods`, `withHooks`
- State: `items[]`, `loading`, `error`
- Computed: `filteredItems`, `itemCount`, `hasItems`
- Methods: `loadItems()`, `addItem()`, `updateItem()`, `removeItem()`
- ⚠️ **KEIN `onInit` im Store** für Feature-Daten → Route Resolver verwenden!
- ✅ `onInit` NUR für: App-Config, Auth Session, Feature Flags (globale Daten)
- ✅ **Public Interface** für Feature Stores definieren (Type Safety)
- ✅ `providedIn: 'root'` für Feature Stores (global)
> **Beispiele:** `.claude/skills/angular-architecture.md`

### Component Store Pattern (für UI State)
- ✅ Separater Store für UI-State (tabs, modals, filters, sort)
- ✅ Provided in `providers` Array des Components (NICHT root!)
- ✅ Automatisch destroyed mit Component
- ✅ KEIN `withHooks` (nur lokaler State)
- ✅ Container kombiniert Feature Store (Business) + Component Store (UI)
- ❌ KEINE Business-Daten im Component Store
- ❌ KEIN UI-State im Feature Store
> **Beispiele:** `.claude/skills/angular-architecture.md`

### Service Layers
- **API Service** (`xxx-api.service.ts`): NUR HTTP calls, return `Promise<T>`
- **Business Service** (`xxx-business.service.ts`): Validation, Logik, nutzt API Service
- **Store**: State only, nutzt API Service in `withMethods`

### Performance (PFLICHT!)
- ✅ `ChangeDetectionStrategy.OnPush` bei ALLEN Components
- ✅ `@for` mit `track item.id` (NICHT `$index`)
- ✅ `computed()` statt Methoden im Template
- ✅ Lazy Loading für alle Features
- ✅ Image lazy loading: `<img loading="lazy" />`
- ✅ Virtual Scroll für Listen >100 Items
- ✅ Debounce bei Input Events (300ms)
- ✅ `takeUntil(destroy$)` für Unsubscribe
- ❌ KEINE Methoden-Aufrufe im Template (`{{ method() }}`)
- ❌ KEINE Berechnungen im Template (`{{ a * b }}`)
- ❌ KEINE Array-Operationen im Template (`{{ arr.filter() }}`)

### TypeScript
- ❌ KEIN `any` - immer Interfaces/Types (nutze `unknown` wenn nötig)
- ✅ Interfaces für Models in `models/` Ordner (extensible objects)
- ✅ Types für Unions/Utilities (`type Status = 'active' | 'inactive'`)
- ✅ DTOs für API Requests/Responses
- ✅ Explicit Return Types bei Methoden
- ✅ Utility Types nutzen: `Partial<T>`, `Required<T>`, `Pick<T>`, `Omit<T>`, `Record<K,V>`
- ✅ Type Guards für Runtime-Checks (`obj is User`)
- ✅ Union Types statt Enums
- ✅ PascalCase für Interfaces/Types, camelCase für Variablen

---

## 🌐 i18n REGELN

- ✅ ALLE Texte in Templates mit `{{ 'key' | translate }}`
- ✅ IMMER beide Sprachen: DE + EN (unabhängig von Code-Sprache!)
- ✅ Type-safe Keys: `TranslationKey` Type verwenden
- ✅ Key-Naming: `{feature}.{type}.{name}` (z.B. `user.form.name`, `user.buttons.save`)
- ✅ TypeScript-only (KEINE JSON files!)
- ✅ `translate.instant(key)` in Components, Pipe in Templates
- ❌ KEINE hardcoded Strings in Templates
> **Beispiele:** `.claude/skills/i18n-typings.md`

---

## 📝 FORMS REGELN

- ✅ Reactive Forms (`FormGroup`, `FormControl`)
- ✅ Typed Forms mit Generics
- ✅ FormGroup als Signal in Container
- ✅ FormGroup via `input()` an Presentational weitergeben
- ✅ Validators im Component, NICHT im Template
- ✅ Custom Validators in `validators/` Ordner (separate file)
- ✅ `valueChanges` mit `debounceTime(300)` für Auto-Save
- ✅ `takeUntil(destroy$)` für Unsubscribe
- ✅ `form.markAllAsTouched()` bei Submit-Fehler
- ✅ Error Handling in Presentational Component
- ❌ KEIN `ngModel` (Template-Driven)
- ❌ KEINE Form-Logik in Presentational Components
> **Beispiele:** `.claude/skills/forms.md`

---

## 🛤️ ROUTING REGELN

- ✅ Lazy Loading für alle Features (`loadChildren`)
- ✅ Route Resolver mit RxMethod für Data Loading
- ✅ Resolver triggert Store → Store lädt Daten → Component abonniert Store
- ✅ `ResolveFn<void>` (return void, KEINE Daten zurückgeben!)
- ✅ Functional Guards (`CanActivateFn`)
- ✅ Route Params mit `input()` (nicht ActivatedRoute)
- ✅ Container Component als Route Target
- ✅ Store mit `rxMethod<void>(pipe(...))` für Resolver
- ✅ `from()` für Promise → Observable conversion
- ✅ `tap` → `patchState` für loading/data/error
- ❌ KEINE Class-based Guards
- ❌ KEIN ActivatedRoute injection (nutze `input()`)
- ❌ KEINE Daten-Rückgabe aus Resolver
> **Beispiele:** `.claude/skills/routing-patterns.md`

---

## 🌍 CODE LANGUAGE REGELN

- Code-Sprache = Requirement-Sprache
- UI IMMER bilingual (i18n DE + EN)
- **Deutsche REQ:**
  - Methods: `beimAbsenden()`, `ladeBenutzer()`, `erstelle()`, `loesche()`
  - Variables: `benutzer[]`, `istLaden`, `gefilterteBenutzer`
  - Types: `Benutzer`, `BenutzerErstellenDTO`
  - Computed: `gefilterteBenutzer`, `istLaden`, `hatBenutzer`
- **Englische REQ:**
  - Methods: `onSubmit()`, `loadUsers()`, `create()`, `delete()`
  - Variables: `users[]`, `isLoading`, `filteredUsers`
  - Types: `User`, `CreateUserDTO`
  - Computed: `filteredUsers`, `isLoading`, `hasUsers`
- Glossar nutzen aus REQ-TEMPLATE Section 16
> **Glossar:** `.claude/skills/code-language.md`

---

## 🔧 ESLINT REGELN

- ✅ `npm run lint:fix` vor Commit
- ✅ Imports sortiert (Angular → Third Party → Local)
- ✅ Component Selectors mit Prefix: `app-user-card` (kebab-case)
- ✅ OnPush Change Detection (PFLICHT!)
- ✅ Explicit Return Types bei Methoden
- ✅ KEIN `any` Type
- ✅ Unused Imports entfernen
- ✅ camelCase für Variablen, PascalCase für Klassen
- ✅ UPPER_SNAKE_CASE für Konstanten
- ✅ Underscore-Prefix für intentionally unused: `_unusedVar`
> **Details:** `.claude/skills/eslint.md`

---

## 🎨 HTML & STYLING REGELN

### HTML
- ❌ KEINE Inline Styles (`style=""`) - IMMER CSS Classes verwenden!
- ✅ Semantic HTML (header, nav, main, article, section, footer)
- ✅ Skip Link: `<a href="#main-content" class="skip-link">`
- ✅ ARIA labels für Icon-Buttons
- ✅ ARIA live regions für dynamische Updates (`role="status"`, `aria-live="polite"`)
- ✅ Alt text für Images mit `loading="lazy"` (leer für dekorative)
- ✅ Labels mit Inputs verknüpft (`for`/`id`)

### Accessibility (PFLICHT! WCAG 2.1 AA)
- ✅ **Schriftgröße**: Min 1em (16px), nie unter 0.875em (14px)
- ✅ **Line-height**: Min 1.5 für Fließtext
- ✅ **Farbkontrast**: Min 4.5:1 (Text auf Hintergrund)
- ✅ **Focus-Styles**: Sichtbar mit `:focus-visible`, NIEMALS `outline: none`!
- ✅ **Keyboard-Navigation**: Tab, Enter, Space, Arrow Keys
- ✅ **Reduced Motion**: `@media (prefers-reduced-motion: reduce)` respektieren
- ✅ **High Contrast**: `@media (forced-colors: active)` unterstützen
- ✅ **Screen Reader**: `.sr-only` Klasse für visuell versteckten Text
- ❌ KEINE Animationen ohne `prefers-reduced-motion` Check
- ❌ KEINE Focus-Styles entfernen

### SCSS (PFLICHT!)
- ✅ **IMMER `src/styles/_variables.scss`** für Farben, Abstände, etc.
- ✅ **em/rem statt px** für Responsive Design (1em = 16px)
- ✅ **BEM mit Nesting** (`&__element`, `&--modifier`)
- ✅ **@extend** für Wiederverwendung (Placeholders in `_placeholders.scss`)
- ✅ **Spacing Utilities**: `m-4` (1em), `p-8` (2em), `gap-2` (0.5em) → siehe `src/styles/_utilities.scss`
- ✅ **CSS Flexbox + Grid** (KEIN Angular Flex Layout!)
- ✅ **Material Overrides** in `_material-overrides.scss` (zentral!)
- ✅ **Breakpoints in em**: `48em` (768px), `64em` (1024px)
- ❌ KEINE Pixel-Werte (außer border: 0.0625em statt 1px)
- ❌ KEINE hardcoded Farben - IMMER CSS Variables!
> **Design System:** `src/styles/_variables.scss`, `.claude/skills/ui-design-system.md`

### Layout Utilities
- ✅ Flexbox: `.flex`, `.items-center`, `.justify-between`, `.gap-4`
- ✅ Grid: `.grid`, `.grid-cols-4`, `.gap-4`, `.col-span-2`
- ✅ Spacing: `.m-4`, `.p-8`, `.mt-2`, `.px-6`, `.py-4`
- ✅ Display: `.d-flex`, `.d-grid`, `.d-none`

### Responsive Design (PFLICHT!)
- ✅ **Mobile-First**: Mobile Layout als Default, dann `@media (min-width)` für Tablet/Desktop
- ✅ **Touch-friendly**: Min 2.75em (44px) für Buttons/Links
- ✅ **Navigation**: Hamburger Menu auf Mobile
- ✅ **Forms**: Full-width Inputs auf Mobile
- ✅ **Tables**: Card-View auf Mobile, Table auf Desktop
- ✅ **Grid**: 1 Spalte (Mobile) → 2 Spalten (Tablet) → 4 Spalten (Desktop)
- ❌ KEIN `max-width` in Media Queries (nur `min-width`!)
- ❌ KEIN Desktop-First Design
> **Beispiele:** `.claude/skills/html-styling.md`

---

## MCP Server

```bash
npm run mcp:setup  # Einmalig nach Clone
```

| Server | Tools | Beispiel |
|--------|-------|----------|
| **ngrx-signalstore** | `get_pattern`, `get_best_practice` | "Zeig mir das feature-store Pattern" |
| **angular-material** | `get_component`, `list_components` | "Wie verwende ich Material Dialog?" |
| **angular-cli** | `search_documentation` | "Angular Best Practices" |

---

## 🚀 Workflow Commands

### Neues Requirement erstellen

| Trigger | Beispiel |
|---------|----------|
| `/create-requirement` | `/create-requirement REQ-003-UserProfile` |
| `Erstelle Requirement` | `Erstelle Requirement REQ-003-UserProfile` |
| `Create requirement` | `Create requirement REQ-003-UserProfile` |

→ Branch `req/...`, Ordner, Template, Screenshot-Analyse, PR

### Requirement prüfen

| Trigger | Beispiel |
|---------|----------|
| `/check-requirement` | `/check-requirement REQ-001-Header` |
| `Prüfe Requirement` | `Prüfe Requirement REQ-001-Header` |
| `Check requirement` | `Check requirement REQ-001-Header` |

→ Prüft Vollständigkeit, Design System, i18n

### Requirement implementieren

| Trigger | Beispiel |
|---------|----------|
| `/implement-requirement` | `/implement-requirement REQ-001-Header` |
| `Implementiere` | `Implementiere REQ-001-Header` |
| `Implement` | `Implement REQ-001-Header` |

→ Liest Spec, erstellt Code, Tests, Commit

> **Details:** `.claude/commands/create-requirement.md`, `.claude/commands/check-requirement.md`, `.claude/commands/implement-requirement.md`

---

## Workflow: Spec-Driven Development

**Erstellen:** `/create-requirement REQ-XXX-Name`
**Prüfen:** `/check-requirement REQ-XXX-Name`
**Implementieren:** `/implement-requirement REQ-XXX-Name`

```
1. /create-requirement REQ-042-UserNotifications
   → Branch: req/REQ-042-UserNotifications
   → Ordner + Template erstellt
   → Screenshot analysiert (falls vorhanden)

2. /check-requirement REQ-042-UserNotifications
   → Prüft Pflicht-Sections
   → Prüft Design System (keine hardcoded Farben)
   → Prüft i18n Keys (DE + EN)
   → PR erstellt

3. /implement-requirement REQ-042-UserNotifications
   → Branch: feat/REQ-042-UserNotifications
   → Liest Spec aus docs/requirements/
   → Implementiert: Store + Container + Children
   → Tests + Lint + Type-Check
   → Commit
```

### Prüf-Commands

**Requirement prüfen:**
```
/check-requirement <REQ-ID>     # Nach /create-requirement
```

**Code prüfen (nach /implement-requirement):**
```
/check-architecture <feature>   # IMMER
/check-i18n <feature>           # bei HTML
/check-code-language <feature>  # IMMER
/check-eslint <feature>         # IMMER
/check-forms <feature>          # bei Formularen
/check-routing <feature>        # bei Routes
/check-stores <feature>         # bei Stores
/check-styling <feature>        # bei SCSS
```

---

## Naming Conventions

```
user-container.component.ts    # Container
user-list.component.ts         # Presentational
user-api.service.ts            # API Service
user-business.service.ts       # Business Service
user.store.ts                  # Feature Store
```

---

## Git Commits

```
feat(REQ-XXX): Add user feature store and container
fix(REQ-XXX): Fix validation in business service
test(REQ-XXX): Add 85% coverage
```

---

## Commands

```bash
npm start              # Dev Server
npm test               # Jest Watch
npm run test:coverage  # Coverage Report
npm run lint:fix       # ESLint Auto-fix
npm run type-check     # TypeScript Check
```

---

## Project Structure

```
src/app/
├── core/                      # Singletons (Guards, Interceptors)
├── shared/                    # Wiederverwendbare Components
├── features/                  # Feature Module
│   └── user/
│       ├── user-container.component.ts
│       ├── user-container.component.html
│       ├── components/
│       │   ├── user-list.component.ts
│       │   └── user-form.component.ts
│       ├── services/
│       │   ├── user-api.service.ts
│       │   └── user-business.service.ts
│       ├── store/
│       │   └── user.store.ts
│       └── models/
│           └── user.model.ts
└── app.routes.ts
```
