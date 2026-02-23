# Check Architecture Command (Gruppiert)

Führt alle Architektur-bezogenen Checks für ein Feature aus.

## Usage

```
<feature-name>
```

Example: `user-management`

## Enthaltene Checks

Dieser Command führt 3 Architektur-Checks aus:

### 1. check-architecture
- Container/Presentational Pattern
- Service Layers (API + Business)
- Template Performance
- File Structure
- Naming Conventions

### 2. check-stores
- NgRx Signal Store Pattern
- withState, withComputed, withMethods, withHooks
- Public Interface
- Feature vs Component Store Trennung

### 3. check-routing
- Lazy Loading
- Route Resolvers mit RxMethod
- Functional Guards (CanActivateFn)
- Route Params mit input()

## Output Format

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📐 ARCHITECTURE CHECK: user-management
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ CHECK-ARCHITECTURE
   ✅ Container/Presentational Pattern
      ✅ user-container: OnPush, Store injection
      ✅ user-list: No Store, Input/Output only

   ✅ Service Layers
      ✅ user-api.service: HTTP only
      ✅ user-business.service: Uses API service

   ⚠️ Template Performance
      ❌ user-list.html:12 - Missing track in @for

   📊 Score: 90/100

2️⃣ CHECK-STORES
   ✅ Feature Store Pattern
      ✅ withState: items, loading, error
      ✅ withComputed: filteredItems, hasItems
      ✅ withMethods: loadItems, addItem
      ✅ withHooks: onInit für globale Daten

   ✅ Public Interface definiert
   ✅ providedIn: 'root'

   📊 Score: 100/100

3️⃣ CHECK-ROUTING
   ✅ Lazy Loading für Feature
   ✅ Route Resolver mit RxMethod
   ✅ Functional Guard (authGuard)
   ⚠️ Route Params
      ❌ user-detail: Nutzt ActivatedRoute statt input()

   📊 Score: 85/100

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 ARCHITEKTUR GESAMT: 92/100

⚠️ 2 Issues gefunden:
   1. user-list.html:12 - Add track to @for loop
   2. user-detail: Use input() for route params

✅ Architektur grundsätzlich korrekt
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Wann verwenden?

- ✅ Nach Erstellung neuer Features
- ✅ Nach Refactoring von Components
- ✅ Bei Store-Änderungen
- ✅ Bei Routing-Änderungen
- ✅ Schnelle Architektur-Validierung (statt /check-all)

## Siehe auch

- `/check-all <feature>` - Alle Checks
- `/check-quality <feature>` - ESLint, TypeScript, Performance, Styling
- `/check-architecture <feature>` - Nur Architecture (einzeln)
- `/check-stores <feature>` - Nur Stores (einzeln)
- `/check-routing <feature>` - Nur Routing (einzeln)
