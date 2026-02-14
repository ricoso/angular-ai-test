# CLI Commands Reference

---

## Setup

```bash
npm install
npm run mcp:install
npm start                  # http://localhost:4200
```

---

## Feature Development

### Create Requirement

```
/create-requirement REQ-042-UserNotifications
```

Creates: `docs/requirements/REQ-042-UserNotifications/requirement.md`

### Implement Requirement

```
/implement-requirement REQ-042-UserNotifications
```

Implements: Store, Container, Components, Tests, i18n

### Quality Check

```
/check-all <feature-name>
```

Runs 13 checks, generates `qualitaets.md`

---

## Testing

```bash
npm test                   # Watch mode
npm run test:ci            # CI mode
npm run test:coverage      # With coverage

# E2E Tests (Playwright)
npm run e2e                # All viewports
npm run e2e:ui             # With UI

# Test specific file
npm test -- user.component.spec.ts
```

**Coverage Thresholds:** >80% statements, >75% branches/functions

---

## Code Quality

```bash
npm run lint               # Check
npm run lint:fix           # Auto-fix
npm run type-check         # TypeScript
```

---

## Build

```bash
npm run build              # Development
npm run build -- --configuration=production
npm run watch              # Watch mode
```

---

## Angular CLI

```bash
# Component
ng g c features/user/containers/user-container --change-detection=OnPush

# Service
ng g s features/user/services/user-api

# Guard
ng g guard core/guards/auth --functional

# Pipe
ng g pipe shared/pipes/capitalize
```

---

## MCP Servers

```bash
npm run mcp:install
```

Locations: `mcp/ngrx-signalstore`, `mcp/angular-material`, `mcp/angular-cli`

---

## Workflows

### New Feature from Scratch

```bash
# 1. Create requirement
/create-requirement REQ-010-ProductManagement

# 2. Implement requirement (creates everything)
/implement-requirement REQ-010-ProductManagement

# 3. Quality check
/check-all product-management

# 4. Commit + PR
```

### Before Commit

```bash
npm run lint:fix
npm run type-check
npm run test:coverage
npm run e2e
```

---

## Debugging

```bash
# Clean install
rm -rf node_modules .angular dist
npm install

# Clear cache
rm -rf .angular/cache

# Port in use
killall node
npm start
```

---

## Deployment

```bash
npm run build -- --configuration=production
# Copy dist/ to hosting
```

---

## Help

```bash
ng help                    # Angular CLI
npm run                    # Show scripts
```

---

## Cheat Sheet

```bash
# Requirement erstellen
/create-requirement REQ-XXX-Name

# Implementieren
/implement-requirement REQ-XXX-Name

# Qualität prüfen
/check-all <feature-name>

# Test
npm test

# Quality
npm run lint:fix && npm run test:ci

# E2E
npm run e2e

# Build
npm run build
```
