# Check Stores Command

**Command:** `/check-stores <feature-name>`

**Description:** Validates Feature Store + Component Store patterns

**ARGUMENTS:**
- `feature-name`: Name of the feature to check (e.g., "shopping-cart", "product-list")

---

## What this command checks:

### Feature Store Rules:
1. ✅ Public interface defined
2. ✅ `providedIn: 'root'` (global)
3. ✅ Business data only (no UI state)
4. ✅ withState, withComputed, withMethods, withHooks
5. ✅ API Service injected in withMethods
6. ✅ onInit only for global initialization
7. ❌ NO UI state (tabs, filters, sort)

### Component Store Rules:
1. ✅ Provided in component's providers array (NOT root!)
2. ✅ UI state only (no business data)
3. ✅ Local to component
4. ❌ NO withHooks (not needed)
5. ❌ NO business logic

### Container Component Rules:
1. ✅ Injects Feature Store + Component Store
2. ✅ Computed combines both stores
3. ✅ Event handlers for business logic
4. ✅ Event handlers for UI state
5. ✅ OnPush Change Detection

---

## Usage:

```
/check-stores shopping-cart
```

---

## Implementation:

Check these files:
- Feature Store file (*.store.ts in store/ folder)
- Component Store file (*.store.ts in component folder)
- Container component
- Public interface definition
- providers array in component

Report:
- Missing public interface
- UI state in Feature Store
- Business data in Component Store
- Missing providers array
- Mixed concerns
