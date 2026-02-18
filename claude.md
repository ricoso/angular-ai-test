# Angular 21 Projekt - Claude Code Anweisungen

## Projekt-Info

- **Framework**: Angular 21 Standalone Components
- **State**: NgRx Signal Store (Feature Store Pattern)
- **UI**: Angular Material 21
- **Testing**: Jest 30 (Unit) + Playwright (E2E lokal)
- **i18n**: ngx-translate (TypeScript Typings, Proxy-basiert)
- **Code-Sprache**: Englisch (FIXIERT)
- **UI-Sprachen**: DE, EN
- **Doc-Sprachen**: DE, EN
- **Deployment**: Click-Dummy (GitHub Pages, HashLocation)

---

## VERBOTEN / PFLICHT Kurzreferenz

| VERBOTEN | STATTDESSEN |
|----------|-------------|
| Inline `template`/`styles` | Separate `.html` + `.scss` Dateien |
| `onInit` im Store für Feature-Daten | Route Resolver + `rxMethod` |
| `ngOnInit` für Data Loading | Route Resolver |
| `@for` mit `track $index` | `track item.id` |
| `{{ method() }}` im Template | `computed()` Signal |
| `any` Type | Interface oder `unknown` |
| `ngModel` | Reactive Forms |
| Hardcoded Farben/px | CSS Variables aus `_variables.scss`, em/rem |
| Dunkler Hintergrund bei Overlays | `var(--color-background-surface)` (weiß) |
| `[innerHTML]` ohne Sanitizer | Angular Template Escaping |
| Hardcoded Strings in Templates | i18n Keys (`{{ t.feature.key }}`) |
| Coverage-Thresholds ändern | Coverage-Config ist TABU — nie anfassen! |

---

## Architektur (Kurzform)

- **Container/Presentational**: 1 Route = 1 Container (`inject(Store)`, OnPush) + Presentational Children (`input()`/`output()` only)
- **Feature Store**: `withState`, `withComputed`, `withMethods` — `providedIn: 'root'` — KEIN `onInit` für Feature-Daten
- **Component Store**: UI-State (tabs, filters) — provided im Component `providers` Array
- **Services**: API (`Promise<T>`) + Business (Logik) — Store nutzt API in `withMethods`
- **Routing**: Lazy Loading, `ResolveFn<void>`, Functional Guards, `input()` für Route Params
- **Data Loading**: Resolver → Store.rxMethod → Component subscribes Store

> Details: `.claude/skills/angular-architecture.md`, `.claude/skills/routing-patterns.md`

---

## Styling (Kurzform)

- **SCSS**: `_variables.scss` für alles, BEM Nesting, em/rem, Mobile-First
- **Material Overrides**: `_material-overrides.scss` (zentral)
- **Overlays**: Modals, Dropdowns, Menus IMMER `var(--color-background-surface)` (weiß)
- **A11y**: WCAG 2.1 AA, Focus-Styles (`:focus-visible`), Touch 2.75em, Kontrast 4.5:1
- **Responsive**: Mobile < 48em, Tablet >= 48em, Desktop >= 64em
- **Icons**: IMMER mit `.icon-framed` Rahmen

> Details: `.claude/skills/ui-design-system.md`, `.claude/skills/html-styling.md`

---

## i18n / Forms / Security (Kurzform)

- **i18n**: Type-safe Keys via Proxy (`{{ t.feature.key }}`), TypeScript-only, DE + EN
- **Forms**: Reactive Forms, Typed, Validators im Component, KEIN ngModel
- **Security**: Kein eval/innerHTML, JWT in HttpOnly Cookies, Route Guards, `.env` für Secrets

> Details: `.claude/skills/i18n-typings.md`, `.claude/skills/forms.md`, `.claude/skills/security.md`

---

## Code Quality

- ESLint: Imports sortiert, OnPush, kein `any`, `npm run lint:fix` vor Commit
- TypeScript: Explicit Return Types, Interfaces in `models/`, Union Types statt Enums
- Performance: OnPush, `track item.id`, `computed()`, Lazy Loading

> Details: `.claude/skills/eslint.md`

---

## Workflow (STRIKT EINHALTEN!)

**Jeder Step ist PFLICHT. Kein Step darf übersprungen werden.**

### /implement-requirement — Pflicht-Ablauf:

| Step | Gate | Beschreibung |
|------|------|--------------|
| 0 | PR-Status sync | `gh pr list` → Status in REQUIREMENTS.md |
| 1 | Branch | `git checkout -b feat/REQ-XXX` |
| 1.5 | Status | REQUIREMENTS.md → "In Progress" |
| 2 | REQ lesen | requirement.md → Feature-Name, Sections 10/11/14/16 |
| **3** | **5 Skills lesen** | **ALLE: code-language, architecture, i18n, routing, forms** |
| 4 | Implementieren | Models → Store → Services → Container → Components → i18n → Routes |
| 5 | Styling | `_variables.scss`, Mobile-First, WCAG 2.1 AA |
| 6 | Tests | Jest >80% Coverage |
| **7** | **Tech-Check (⚡ 3 PARALLEL AGENTS)** | **`lint:fix` ✅ + `type-check` ✅ + `test:coverage` ✅ — 3 parallele Task-Agents!** |
| **8** | **Quality Gate** | **`/check-all` Score >= 90 + qualitaets.md generiert** |
| 9 | Commit | `feat(REQ-XXX): implement <Feature>` |
| 10 | Status | REQUIREMENTS.md → "In Review" |

> **STOP bei Step 7 FAIL!** Erst fixen, dann weiter.
> **STOP bei Step 8 Score < 90!** Erst fixen, Step 7+8 wiederholen.
> Details: `.claude/commands/implement-requirement.md`

### Weitere Commands

```
/create-requirement REQ-XXX-Name     → Branch, Template, PR
/check-requirement REQ-XXX-Name      → Prüft Vollständigkeit
/check-all <feature>                 → 13 Checks, qualitaets.md
```

**Checks:** `/check-architecture`, `/check-stores`, `/check-routing`, `/check-security`, `/check-eslint`, `/check-typescript`, `/check-performance`, `/check-styling`, `/check-i18n`, `/check-forms`, `/check-code-language`, `/check-e2e`, `/check-documentation`

**Gruppiert:** `/check-arch`, `/check-quality`

---

## Commands

```bash
npm start              # Dev Server
npm test               # Jest Watch
npm run test:coverage  # Coverage Report
npm run lint:fix       # ESLint Auto-fix
npm run type-check     # TypeScript Check
npm run e2e            # Playwright E2E (3 Viewports)
```

---

## Naming & Commits

```
user-container.component.ts/.html/.scss  # Container (3 Dateien!)
user-list.component.ts                   # Presentational
user-api.service.ts                      # API Service
user.store.ts                            # Feature Store
```

```
feat(REQ-XXX): Add user feature
fix(REQ-XXX): Fix validation
test(REQ-XXX): Add 85% coverage
```

---

## Project Structure

```
src/app/
├── core/           # Guards, Interceptors
├── shared/         # Reusable Components
├── features/       # Feature Modules
│   └── <feature>/
│       ├── <feature>-container.component.ts/.html/.scss
│       ├── components/    # Presentational
│       ├── services/      # API + Business
│       ├── store/         # NgRx Signal Store
│       └── models/        # Interfaces
└── app.routes.ts

docs/requirements/
├── REQUIREMENTS.md
├── REQ-XXX-Name/
│   ├── requirement.md
│   ├── qualitaets.md          # /check-all Report
│   ├── feature-documentation-de.md
│   ├── feature-documentation-en.md
│   └── screenshots/
```
