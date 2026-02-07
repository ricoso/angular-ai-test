# Angular 21 Projekt - Claude Code Anweisungen

## Projekt-Info

- **Framework**: Angular 21 Standalone Components
- **State**: NgRx Signal Store (**NUR Feature Store Pattern!**)
- **UI**: Angular Material 21
- **Testing**: Jest 30
- **i18n**: ngx-translate (TypeScript Typings)

> Für Quick Start, CLI Commands und Project Structure → siehe **README.md**

---

## 🔴 ARCHITEKTUR-REGELN

> **Details:** `.claude/skills/angular-architecture.md` (IMMER lesen!)

- **Container/Presentational**: 1 Route = 1 Container + Children
- **Store**: NUR Feature Store Pattern (withState, withComputed, withMethods, withHooks)
- **Services**: API Service (HTTP) + Business Service (Logic)
- **Performance**: OnPush, trackBy, Computed statt Template-Methoden

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

## Skills (VOR Implementation lesen!)

Alle Skills in `.claude/skills/`:

| Skill | Wann lesen? |
|-------|-------------|
| **angular-architecture.md** | IMMER bei Components/Services |
| **code-language.md** | Bei DE/EN Naming im Code |
| **forms.md** | Bei Formularen |
| **performance.md** | Bei Performance-kritischem Code |
| **eslint.md** | Bei Linting-Fehlern |
| **typescript-config.md** | Bei Type-Problemen |
| **i18n-typings.md** | IMMER bei HTML Templates |
| **routing-patterns.md** | Bei Routes/Navigation |

---

## Workflow: Spec-Driven Development

**Trigger:** `Implementiere REQ-042-UserNotifications`

```
1. Branch erstellen → git checkout -b feat/REQ-042-UserNotifications
2. Lese SPEC → docs/requirements/REQ-042-UserNotifications/
3. Lese Skills:
   - angular-architecture.md (IMMER!)
   - i18n-typings.md (bei HTML Templates)
   - forms.md (bei Formularen)
   - routing-patterns.md (bei Routes)
   - performance.md (bei Listen/Loops)
4. Nutze MCP → "Zeig mir feature-store Pattern"
5. Implementiere → Feature Store + Container + Children
6. Schreibe Tests → Jest Unit Tests für Store, Services, Components
7. Teste → npm run test:coverage (Ziel: >80%)
8. Prüfe:
   - /check-architecture user-notifications (IMMER)
   - /check-i18n user-notifications (bei HTML)
   - /check-performance user-notifications (bei Listen/Loops)
   - /check-code-language user-notifications (IMMER)
   - /check-forms user-notifications (bei Formularen)
   - /check-routing user-notifications (bei Routes)
   - /check-typescript user-notifications (bei Types)
   - /check-eslint user-notifications (IMMER)
   - npm run lint:fix
   - npm run type-check
9. Update SPEC → Implementation Notes
10. Commit → git commit -m "feat(REQ-042): ..."
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

> Vollständige Liste → siehe **README.md** und **.claudeskills**

```bash
npm start              # Dev Server
npm test               # Jest Watch
npm run test:coverage  # Coverage Report
npm run lint:fix       # ESLint Auto-fix
```

---

## Project Structure

```
src/app/
├── core/                      # Singletons (Guards, Interceptors)
│   ├── guards/
│   └── interceptors/
├── shared/                    # Wiederverwendbare Components
│   ├── components/
│   ├── directives/
│   └── pipes/
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
