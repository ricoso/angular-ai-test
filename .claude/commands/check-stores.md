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
6. ⚠️ **KEIN onInit für Feature-Daten!** → Route Resolver verwenden!
7. ✅ onInit NUR für: App-Config, Auth Session, Feature Flags (globale Daten)
8. ❌ NO UI state (tabs, filters, sort)

### ⚠️ KRITISCH: onInit vs Resolver

**❌ FALSCH - onInit im Store für Feature-Daten:**
```typescript
// ❌ NIEMALS so!
export const ProductStore = signalStore(
  withHooks({
    onInit(store) {
      store.loadProducts(); // ❌ Feature-Daten in onInit!
    }
  })
);
```

**✅ RICHTIG - Route Resolver für Feature-Daten:**
```typescript
// ✅ Resolver triggert Store
export const productResolver: ResolveFn<void> = () => {
  const store = inject(ProductStore);
  store.loadProducts();
  return of(void 0);
};

// ✅ Store ohne onInit für Feature-Daten
export const ProductStore = signalStore(
  withState<ProductState>({ products: [], loading: false, error: null }),
  withMethods((store, api = inject(ProductApiService)) => ({
    loadProducts: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(() => from(api.getAll())),
        tap(products => patchState(store, { products, loading: false }))
      )
    )
  }))
);
```

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
