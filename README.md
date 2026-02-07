# Angular 21 Project Template

Enterprise Angular 21 template with Container/Presentational pattern, Signal Store, Jest testing, and comprehensive requirements system.

---

## Features

✅ **Architecture:** Container/Presentational, API/Business Services, Signal Store  
✅ **Performance:** OnPush, trackBy, lazy loading, computed signals  
✅ **Testing:** Jest (>80% coverage)  
✅ **Code Quality:** ESLint, TypeScript strict  
✅ **i18n:** Type-safe bilingual translations (DE + EN)  
✅ **Requirements:** Spec-driven development with mockup support  
✅ **Automation:** CLI scripts for feature/component/requirement generation  
✅ **MCP:** 3 servers (SignalStore, Material, CLI)  

---

## Quick Start

```bash
# Install
npm install
npm run mcp:install

# Development
npm start                  # http://localhost:4200

# Tests
npm test                   # Watch
npm run test:ci            # CI
npm run test:coverage      # Coverage

# Build
npm run build
```

---

## CLI Commands

See [COMMANDS.md](COMMANDS.md) for complete reference.

### Create Feature

```bash
./scripts/create-feature.sh product
```

Creates: Container, Services (API + Business), Store, Models, **Resolver**, Routes

### Create Component

```bash
./scripts/create-component.sh product product-card
```

Creates: Presentational component with OnPush

### Create Requirement

```bash
./scripts/create-requirement.sh "UserNotifications" 42
```

Creates: requirement.md in REQ-042-UserNotifications/

---

## Architecture

### Container/Presentational Pattern

```
Route → Resolver (triggers Store) → Store (RxMethod loads data) → Container (subscribes to Store)
          ├─ Presentational Children (Input/Output)
          ├─ API Service (HTTP only)
          ├─ Business Service (Logic + Validation)
          └─ Signal Store (State + RxMethod)
```

**Rules:**
- Container per route (OnPush)
- Presentational children (Input/Output only, NO Store access)
- API Service: HTTP only, NO business logic
- Business Service: Validation, rules, orchestration
- Signal Store: State + RxMethod for loading
- **Resolver: Triggers Store RxMethod, NO data passing** ⭐
- **Container: Subscribes to Store signals, NO manual data reading** ⭐

---

## Code Language Rules

**UI:** ALWAYS bilingual (i18n keys for DE + EN)  
**Code:** Language follows requirement language  
**Naming:** From glossary (see REQ-TEMPLATE Section 16)

### Example: German Requirement

```typescript
// Store mit RxMethod
export const BenutzerStore = signalStore(
  withMethods((store, benutzerApi = inject(BenutzerApiService)) => ({
    ladeBenutzer: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { istLaden: true })),
        switchMap(() => from(benutzerApi.holeAlle())),
        tap(benutzer => patchState(store, { benutzer, istLaden: false }))
      )
    )
  }))
);

// Resolver triggert Store
export const benutzerResolver: ResolveFn<void> = () => {
  inject(BenutzerStore).ladeBenutzer();
  return;
};

// Container subscribed auf Store
export class BenutzerContainerComponent {
  protected benutzerStore = inject(BenutzerStore);
  benutzer = this.benutzerStore.benutzer;  // Signal!
}
```

### Example: English Requirement

```typescript
// Store with RxMethod
export const UserStore = signalStore(
  withMethods((store, userApi = inject(UserApiService)) => ({
    loadUsers: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => from(userApi.getAll())),
        tap(users => patchState(store, { users, isLoading: false }))
      )
    )
  }))
);

// Resolver triggers Store
export const usersResolver: ResolveFn<void> = () => {
  inject(UserStore).loadUsers();
  return;
};

// Container subscribes to Store
export class UserContainerComponent {
  protected userStore = inject(UserStore);
  users = this.userStore.users;  // Signal!
}
```

---

## Project Structure

```
angular-21-template/
├── .claude/
│   ├── skills/              # 8 Skills (architecture, code-language, forms, ...)
│   ├── commands/            # 8 Claude Commands
│   └── mcp-config.json      # 3 MCP servers
├── docs/requirements/
│   ├── REQUIREMENTS.md      # Central list (FR_NB_FeatureName)
│   ├── REQ-TEMPLATE.md      # Template
│   └── REQ-XXX-Name/
│       ├── requirement.md   # Main doc (German or English)
│       └── mockup.png       # Optional
├── scripts/                 # create-feature, create-component, create-requirement
├── src/app/
│   ├── features/            # Feature modules
│   ├── core/                # Singletons (services, guards)
│   └── shared/              # Reusable components
├── COMMANDS.md              # CLI reference
├── claude.md                # Workflow guide
└── META-PROMPT.md           # Abstract template for other projects
```

---

## Workflow

See [claude.md](claude.md) for detailed workflow.

**Spec-Driven Development:**

1. Read requirement (docs/requirements/REQ-XXX/)
2. Check requirement language
3. Read skills (architecture, code-language, ...)
4. Generate structure (`./scripts/create-feature.sh`)
5. Implement (follow naming glossary)
6. Add i18n keys (both languages)
7. Test (>80% coverage)
8. Update requirement

---

## Skills (.claude/skills/)

8 skills for consistent development:

1. **angular-architecture.md** - Container/Presentational pattern
2. **code-language.md** - Language & naming rules
3. **eslint.md** - Linting & code quality
4. **forms.md** - Reactive forms patterns
5. **performance.md** - Optimization (trackBy, OnPush, ...)
6. **i18n-typings.md** - Type-safe i18n
7. **routing-patterns.md** - Routing & lazy loading
8. **typescript-config.md** - TypeScript configuration

---

## Testing

```bash
npm test                   # Watch mode
npm run test:ci            # CI mode
npm run test:coverage      # Coverage report
```

**Coverage Requirements:** >80% statements, >75% branches/functions

---

## Performance

**Mandatory:**
- OnPush change detection everywhere
- trackBy on all @for loops with objects
- Lazy loading for all features
- Computed signals instead of template methods
- Debounce user input (300ms)

See `.claude/skills/performance.md` for details.

---

## Requirements System

**Central List:** `docs/requirements/REQUIREMENTS.md`  
**Template:** `docs/requirements/REQ-TEMPLATE.md`  
**Format:** `REQ-{Number}-{FeatureName}/requirement.md`

**Example:**
```
REQ-001-UserLogin/
├── requirement.md         # Main doc (German or English)
└── mockup.png             # Optional UI mockup
```

---

## Meta-Prompt

`META-PROMPT.md` contains abstract template for replicating this structure in other tech stacks (Spring Boot, Python, React, etc.)

---

## Version

- **Angular:** 21.0.0
- **NgRx Signals:** Latest
- **Jest:** Latest
- **Template Version:** 1.8

---

## License

MIT
