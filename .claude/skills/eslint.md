# ESLint Skill

**Wann:** Bei Linting-Fehlern, vor Commits

---

## Quick Commands

```bash
npm run lint               # Check all
npm run lint:fix           # Auto-fix
ng lint --files=path.ts    # Specific file
```

---

## Wichtige Rules

### 1. Component/Directive Selectors

```typescript
// ✅ GOOD
@Component({ selector: 'app-user-card' })  // Prefix: app-, kebab-case

// ❌ BAD
@Component({ selector: 'userCard' })       // No prefix
```

### 2. OnPush (Pflicht!)

```typescript
// ✅ GOOD
@Component({ changeDetection: ChangeDetectionStrategy.OnPush })

// ❌ BAD (Default)
@Component({ })
```

### 3. Unused Imports

```typescript
// ❌ BAD
import { OnDestroy } from '@angular/core';  // Not used

// ✅ GOOD - Auto-fix
npm run lint:fix
```

### 4. Explicit Return Types

```typescript
// ✅ GOOD
getName(): string {
  return this.user.name;
}

// ⚠️ WARNING
getName() {  // No return type
  return this.user.name;
}
```

### 5. No Any Type

```typescript
// ✅ GOOD
users: User[] = [];
data: unknown;

// ❌ BAD
users: any = [];
```

---

## Häufige Fehler

### "Component selector must have prefix"
```typescript
// Fix: Add app- prefix
@Component({ selector: 'app-user-card' })
```

### "OnDestroy not implemented"
```typescript
// Fix: Implement method
ngOnDestroy() { }
```

### "Unused variable"
```typescript
// Fix 1: Use it
console.log(unusedVar);

// Fix 2: Remove it

// Fix 3: Underscore (intentionally unused)
const _unusedVar = 'test';
```

---

## Custom Rules (Optional)

```json
// .eslintrc.json
{
  "rules": {
    "@angular-eslint/prefer-on-push-component-change-detection": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
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

# Schrittweise fixen
npm run lint:fix
```
