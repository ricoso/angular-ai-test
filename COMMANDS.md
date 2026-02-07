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

### Create Feature

```bash
./scripts/create-feature.sh product
# Or: npm run feature:create product
```

Creates: Container, Services (API + Business), **Store (with RxMethod)**, **Resolver (triggers Store)**, Routes

**Pattern:** Resolver → Store RxMethod → Container subscribes

### Create Component

```bash
./scripts/create-component.sh product product-card
# Or: npm run component:create product product-card
```

Creates: Presentational component with OnPush

### Create Requirement

```bash
./scripts/create-requirement.sh "UserNotifications" 42
# Or: npm run requirement:create "UserNotifications" 42
```

Creates: requirement.md in REQ-042-UserNotifications/

---

## Testing

```bash
npm test                   # Watch mode
npm run test:ci            # CI mode
npm run test:coverage      # With coverage

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
npm run format             # Prettier
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
# Component (if not using scripts)
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
./scripts/create-requirement.sh "ProductManagement" 10

# 2. Create feature
./scripts/create-feature.sh product

# 3. Create components
./scripts/create-component.sh product product-list
./scripts/create-component.sh product product-card

# 4. Add route to app.routes.ts
# { path: 'products', loadChildren: () => import('./features/product/product.routes') }

# 5. Implement
# - services/product-api.service.ts (HTTP)
# - services/product-business.service.ts (Logic)
# - stores/product.store.ts (State)
# - containers/product-container/* (UI)

# 6. Test
npm run test:coverage

# 7. Update requirement.md
```

### Before Commit

```bash
npm run lint:fix
npm run format
npm run type-check
npm run test:ci
npm run build
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
npm run help               # Show this file
```

---

## Cheat Sheet

```bash
# Feature
./scripts/create-feature.sh <n>

# Component
./scripts/create-component.sh <feature> <n>

# Requirement
./scripts/create-requirement.sh "<n>" <num>

# Test
npm test

# Quality
npm run lint:fix && npm run test:ci

# Build
npm run build
```
