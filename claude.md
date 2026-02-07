# Angular 21 Projekt - Claude Code Setup

## Projekt-Info
- **Framework**: Angular 21 Standalone Components
- **State**: NgRx Signal Store  
- **i18n**: ngx-translate mit TypeScript Typings (DEV.TO Approach)
- **TypeScript**: 5.7+ Strict Mode
- **UI**: Angular Material 22
- **Testing**: Jest

**Architecture:** Container/Presentational Pattern - Jede Route = 1 Container + Children

## MCP Server

MCP Server werden automatisch von Claude Code geladen.

**Vor der Arbeit ausführen:**
```bash
npm run mcp:setup  # MCP Server installieren (einmalig)
```

**Verfügbare Server:**

### 1. ngrx-signalstore (`mcp/ngrx-signalstore/`)
**Tools:**
- `get_pattern(pattern)` - basic-store, feature-store, entity-store
- `search_patterns(query)` - Patterns suchen
- `get_best_practice(topic)` - state-design, performance, testing
- `list_all_patterns()` - Alle anzeigen

**Beispiel:** "Zeig mir das feature-store Pattern"

### 2. angular-material (`mcp/angular-material/`)
**Tools:**
- `get_component(component)` - button, dialog, table, form-field
- `list_components()` - Alle Components

**Beispiel:** "Wie verwende ich Material Dialog?"

### 3. angular-cli (Offiziell) ⭐
**Tools:**
- `get_best_practices` - Aktuelle Angular Coding Standards
- `search_documentation` - Durchsucht angular.dev in Echtzeit
- Workspace-Analyse Tools

**Beispiel:** "Zeig mir Angular Best Practices für Components"
**Quelle:** https://angular.dev/ai/mcp

## Skills (VOR jeder Implementation lesen!)

Skills in `.claude/skills/`:

### 1. **angular-architecture.md** ⭐ CORE
Lesen bei: JEDER Component/Service Erstellung
- Container/Presentational Pattern
- Service Layers (API, Business)
- Signal Store Pattern
- OnPush Change Detection
- File Structure

### 2. **forms.md** ⭐
Lesen bei: Form-Implementierungen
- Reactive Forms Pattern
- Custom Validators
- Form Subscriptions

### 3. **performance.md** ⭐
Lesen bei: Performance-kritisch
- TrackBy (PFLICHT!)
- Computed statt Methoden
- Lazy Loading
- Template Rules

### 4. **eslint.md** ⭐
Lesen bei: Linting Fehlern, Code Quality
- ESLint Konfiguration
- Wichtige Rules
- Auto-fix Commands
- Häufige Fehler & Fixes
- Best Practices

### 5. **typescript-config.md**
Lesen bei: Types/Interfaces, Config
- tsconfig Strict Mode Setup
- Interface vs Type
- Utility Types, Generics
- Path Mapping

### 3. **i18n-typings.md**
Lesen bei: i18n Features
- TypeScript-only Approach (KEIN JSON!)
- Type-safe Translation Keys
- API-loaded Translations
- Based on: https://dev.to/angular/angular-ngx-translate-typings-2d5c

### 4. **routing-patterns.md**
Lesen bei: Routes, Navigation
- **Container per Route Pattern**
- Route Structure
- Functional Guards
- Signal-based Route Params
- Deep Links

## Claude Code Commands

**See `.claudeskills` file for all available commands!**

### Quick Commands

```bash
# Create Feature
/create-feature product

# Create Component
/create-component product product-card

# Implement Requirement
/implement-spec 42

# Check Architecture
/check-architecture product

# Fix Performance
/fix-performance product
```

### Available in `.claude/commands/`
- `create-feature.md` - Full feature generator
- `create-component.md` - Component generator
- `implement-spec.md` - Complete implementation workflow
- `check-architecture.md` - Architecture validation
- `fix-performance.md` - Performance auto-fixes

### Complete List
See `.claudeskills` for 20+ commands including:
- Code generation
- Testing helpers
- Refactoring tools
- Documentation generators
- Migration helpers

---

## Spec-Driven Development Workflow

```
User: "Implementiere SPEC-XXX"
  ↓
1. Lese SPEC (docs/requirements/REQ-XXX-FeatureName/)
   - requirement.md (🇩🇪 Deutsch - Standard)
   - requirement.en.md (🇬🇧 Englisch - Parallel)
   - mockup.png (falls vorhanden - UI Design anschauen!)
   - wireframe.pdf (falls vorhanden)
  ↓
2. Lese Skills:
   - angular-architecture.md (IMMER!)
     * Container/Presentational Pattern
     * Reactive Forms
     * Template Performance (KEINE Methoden-Aufrufe!)
     * TrackBy, OnPush, Lazy Loading
     * Naming Glossary (Method Names!)
   - typescript-config.md (bei Types)
   - i18n-typings.md (bei i18n)
   - routing-patterns.md (bei Routes)
  ↓
3. Nutze MCP:
   - ngrx-signalstore für State Patterns
   - angular-material für UI Components
   - angular-cli (offiziell) für Best Practices & Docs
  ↓
4. Implementiere nach Guidelines:
   - Container Component für Route erstellen
   - Presentational Child Components
   - API Service für HTTP calls
   - Business Service für Logic
   - Signal Store für State
   - Reactive Forms mit Validierung
   - TrackBy bei allen @for Loops!
   - OnPush Change Detection überall!
  ↓
5. Tests schreiben (Jest):
   - Container Component Tests
   - Presentational Component Tests
   - Service Tests (API + Business)
   - Store Tests
  ↓
6. Test Coverage prüfen:
   - npm run test:coverage
   - Ziel: > 80% Coverage
  ↓
7. SPEC updaten (BEIDE Versionen!):
   - requirement.md (Deutsch)
   - requirement.en.md (Englisch)
   - Implementation Notes (Section 17)
   - Test Results
   - Coverage Report
```

## Requirements Ordnerstruktur

```
docs/requirements/
├── README.md                        # Workflow & Best Practices
├── REQUIREMENTS.md                  # Zentrale Liste (FR_NB_FeatureName)
├── REQ-TEMPLATE.md                  # Template zum Kopieren
│
└── REQ-001-UserLogin/              # ⭐ Ein Ordner pro Requirement
    ├── requirement.md              # 🇩🇪 Deutsche Version (Standard)
    ├── requirement.en.md           # 🇬🇧 Englische Version (Parallel)
    ├── mockup-desktop.png          # UI Mockup Desktop (optional)
    ├── mockup-mobile.png           # UI Mockup Mobile (optional)
    ├── wireframe.pdf               # Wireframe (optional)
    └── flow-diagram.png            # Flow Diagramm (optional)
```

## Neues Requirement erstellen

```bash
# 1. Ordner erstellen
mkdir docs/requirements/REQ-042-UserNotifications

# 2. Template kopieren
cp docs/requirements/REQ-TEMPLATE.md docs/requirements/REQ-042-UserNotifications/requirement.md
cp docs/requirements/REQ-TEMPLATE.md docs/requirements/REQ-042-UserNotifications/requirement.en.md

# 3. Beide Versionen ausfüllen (PARALLEL!)
code docs/requirements/REQ-042-UserNotifications/requirement.md
code docs/requirements/REQ-042-UserNotifications/requirement.en.md

# 4. Mockup hinzufügen (falls vorhanden)
cp ~/mockup.png docs/requirements/REQ-042-UserNotifications/

# 5. In REQUIREMENTS.md eintragen
# FR_042_UserNotifications | User Notifications | 📝 Draft | Medium | ... | Team I
```

## WICHTIG: Deutsch/Englisch Sync

- ✅ **Deutsche Version** (requirement.md) ist STANDARD
- ✅ **Englische Version** (requirement.en.md) PARALLEL pflegen
- ✅ Bei Updates: BEIDE Versionen aktualisieren!
- ✅ Naming Glossary nutzen für Method-Namen (Section 20)

## Development Commands

```bash
# Dev
npm start              # Dev Server

# Build
npm run build          # Production Build

# Tests (Jest)
npm test               # Watch mode
npm run test:ci        # CI (single run)
npm run test:coverage  # Mit Coverage

# Code Quality
npm run lint           # ESLint
npm run lint:fix       # Auto-fix
npm run type-check     # TypeScript
npm run format         # Prettier

# MCP Server
npm run mcp:setup      # Setup MCP servers (einmalig nach clone)
npm run mcp:check      # Status aller MCP Server prüfen
```

## Testing Workflow (Jest)

### Container Component Test
```typescript
describe('UserContainerComponent', () => {
  it('should load users on init', () => {
    component.ngOnInit();
    expect(userStore.loadUsers).toHaveBeenCalled();
  });
});
```

### Presentational Component Test
```typescript
describe('UserListComponent', () => {
  it('should emit delete event', () => {
    component.onDelete('123');
    expect(emittedId).toBe('123');
  });
});
```

### API Service Test
```typescript
describe('UserApiService', () => {
  it('should get all users', async () => {
    const result = await service.getAll();
    expect(result).toEqual(mockUsers);
  });
});
```

### Business Service Test
```typescript
describe('UserBusinessService', () => {
  it('should validate unique email', async () => {
    await expect(service.validateAndCreate(data))
      .rejects.toThrow('Email already exists');
  });
});
```

### Signal Store Test
```typescript
describe('UserStore', () => {
  it('should load users', async () => {
    await store.loadUsers();
    expect(store.users()).toEqual(mockUsers);
  });
});
```

### Coverage Ziele
- Statements: > 80%
- Branches: > 75%
- Functions: > 75%
- Lines: > 80%

## Architecture Principles

✅ **Container/Presentational**: Jede Route = 1 Container + Children  
✅ **API Services**: HTTP calls only  
✅ **Business Services**: Logic, validation, rules  
✅ **Signal Store**: State only (uses Services)  
✅ **OnPush**: ALL components  
✅ **Separate Files**: HTML + SCSS always  
✅ **Jest**: Unit tests with > 80% coverage  

## Naming Conventions

- Components: `user-container.component.ts`
- Presentational: `user-list.component.ts`
- API Services: `user-api.service.ts`
- Business Services: `user-business.service.ts`
- Stores: `user.store.ts`
- Guards: `auth.guard.ts`
- Specs: `SPEC-001-feature-name.md`

## Git Commits
```
feat(SPEC-XXX): Add user container and children
fix(SPEC-XXX): Fix validation in business service
test(SPEC-XXX): Add 85% test coverage
docs(SPEC-XXX): Update implementation notes
```

## Troubleshooting

### MCP nicht verfügbar
```bash
npm run mcp:install
```

### Tests fehlschlagen
```bash
npm run test:ci
# Check coverage
npm run test:coverage
```

### Build Errors
```bash
npm ci
rm -rf .angular/cache node_modules
npm install
```

## Architecture Flow

```
Route
  ↓
Container Component
  ├─→ Signal Store ←→ API Service
  ├─→ Business Service
  └─→ Presentational Children
       ├─→ Child A
       ├─→ Child B
       └─→ Child C
```

## Example Structure

```
/users                     → UserContainerComponent
                             ├─ UserListComponent
                             ├─ UserFilterComponent
                             └─ UserStore
                                  └─ UserApiService
                                  └─ UserBusinessService
```
