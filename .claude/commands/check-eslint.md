# Check ESLint Command

Prüft ESLint Rules und Code Quality.

## Usage

```
<feature-name>
```

Beispiel: `user-notifications`

## Checks

### 1. ESLint Errors
```bash
npm run lint
```

### 2. Angular ESLint Rules
- `@angular-eslint/component-selector` - Prefix prüfen
- `@angular-eslint/directive-selector` - Prefix prüfen
- `@angular-eslint/no-empty-lifecycle-method`
- `@angular-eslint/prefer-on-push-component-change-detection`

### 3. TypeScript ESLint Rules
- `@typescript-eslint/no-explicit-any`
- `@typescript-eslint/explicit-function-return-type`
- `@typescript-eslint/no-unused-vars`

### 4. Import Order
```typescript
// ✅ GOOD - Sorted imports
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserService } from './services/user.service';
import { User } from './models/user.model';

// ❌ BAD - Unsorted
import { User } from './models/user.model';
import { Component } from '@angular/core';
```

### 5. Naming Conventions
```typescript
// ✅ GOOD
const userName: string;           // camelCase
class UserService { }             // PascalCase
const MAX_ITEMS = 100;            // UPPER_SNAKE_CASE

// ❌ BAD
const user_name: string;          // snake_case
const maxItems = 100;             // constant as camelCase
```

## Output

```
🔍 Checking ESLint for: user-notifications

✅ ESLint Errors
   ✅ No errors found

⚠️ Angular ESLint
   ❌ notification-list.component.ts
      Missing OnPush change detection

⚠️ Import Order
   ❌ notification.service.ts
      Imports not sorted

✅ Naming Conventions
   ✅ All names follow conventions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Score: 90/100
❌ 2 issues found

💡 Run npm run lint:fix to auto-fix
```
