# Check Quality Command (Gruppiert)

Führt alle Code-Qualität Checks für ein Feature aus.

## Usage

```
<feature-name>
```

Example: `user-management`

## Enthaltene Checks

Dieser Command führt 4 Quality-Checks aus:

### 1. check-eslint
- Import Order (Angular → Third Party → Local)
- Component Selectors (kebab-case mit Prefix)
- Naming Conventions (camelCase, PascalCase)
- Unused Imports/Variables
- OnPush Change Detection

### 2. check-typescript
- Kein `any` Type
- Interfaces für Models
- DTOs für API
- Explicit Return Types
- Utility Types (Partial, Pick, Omit)
- Type Guards

### 3. check-performance
- OnPush Change Detection
- @for mit track (nicht $index)
- computed() statt Template-Methoden
- Lazy Loading
- Virtual Scroll für große Listen
- Debounce bei Inputs

### 4. check-styling
- SCSS (em/rem statt px)
- BEM Naming
- Accessibility (WCAG 2.1 AA)
- Responsive Design (Mobile-First)
- Keine Inline Styles

## Output Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 QUALITY CHECK: user-management
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ CHECK-ESLINT
   ✅ Import Order korrekt
   ✅ Component Selectors: app-user-*
   ✅ Naming Conventions befolgt
   ⚠️ Unused Imports
      ❌ user.store.ts:3 - Unused import 'tap'

   📊 Score: 95/100

2️⃣ CHECK-TYPESCRIPT
   ✅ Keine `any` Types
   ✅ Interfaces in models/
   ✅ DTOs für API Requests/Responses
   ⚠️ Explicit Return Types
      ❌ user-business.service.ts:45 - Missing return type

   📊 Score: 90/100

3️⃣ CHECK-PERFORMANCE
   ✅ OnPush bei allen Components
   ✅ @for mit track item.id
   ✅ computed() für derived state
   ✅ Lazy Loading aktiviert
   ⚠️ Virtual Scroll
      ⚠️ user-list: >100 Items möglich, kein Virtual Scroll

   📊 Score: 85/100

4️⃣ CHECK-STYLING
   ✅ SCSS mit em/rem
   ✅ BEM Naming
   ✅ Focus-Styles vorhanden
   ✅ Mobile-First Layout
   ⚠️ Accessibility
      ❌ user-form.html:8 - Missing aria-label on icon button

   📊 Score: 90/100

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 QUALITY GESAMT: 90/100

⚠️ 4 Issues gefunden:
   1. user.store.ts:3 - Remove unused import 'tap'
   2. user-business.service.ts:45 - Add return type
   3. user-list: Consider Virtual Scroll for large lists
   4. user-form.html:8 - Add aria-label

✅ Code-Qualität gut
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Auto-Fix Möglichkeiten

Einige Issues können automatisch behoben werden:

```bash
npm run lint:fix          # ESLint Auto-Fix
/fix-performance <feature> # Performance Issues
```

## Wann verwenden?

- ✅ Nach Code-Änderungen
- ✅ Vor Code Review
- ✅ Bei Style/Performance-Optimierung
- ✅ Schnelle Qualitäts-Validierung (statt /check-all)

## Siehe auch

- `/check-all <feature>` - Alle Checks
- `/check-arch <feature>` - Architecture, Stores, Routing
- `/check-eslint <feature>` - Nur ESLint (einzeln)
- `/check-typescript <feature>` - Nur TypeScript (einzeln)
- `/check-performance <feature>` - Nur Performance (einzeln)
- `/check-styling <feature>` - Nur Styling (einzeln)
