# Angular Architecture (ULTRA-COMPACT)

**VORHER LESEN:** code-language.md, performance.md

---

## Pattern: Container/Presentational

**Regel:** 1 Route = 1 Container + N Presentational Children

---

## Layer Responsibilities

### Container Component
- Route-level, @Component, OnPush
- Inject: Store, Business Service
- Methods: on[Action]() event handlers
- ngOnInit: Load initial data
- NO business logic, NO HTTP
- Pass data to children via Input
- Receive events via Output

### Presentational Component
- Child-level, @Component, OnPush
- Input: data from parent
- Output: events to parent
- NO Store, NO Services
- Pure display logic only

### API Service
- @Injectable({ providedIn: 'root' })
- Methods: getAll(), getById(), create(), update(), delete()
- HTTP calls ONLY, return Promise<T>
- NO business logic, NO validation
- Use HttpClient + firstValueFrom()

### Business Service
- @Injectable({ providedIn: 'root' })
- Inject: API Service
- Methods: validateAndCreate(), confirmDelete(), calculate*(), verify*()
- Validation, rules, orchestration
- NO HTTP calls, calls API Service

### Signal Store (NUR Feature Store Pattern!)

```typescript
export const XxxStore = signalStore(
  { providedIn: 'root' },
  withState({ items: [], loading: false, error: null }),
  withComputed(({ items }) => ({
    itemCount: computed(() => items().length)
  })),
  withMethods((store, api = inject(XxxApiService)) => ({
    async loadItems() {
      patchState(store, { loading: true });
      try {
        const items = await api.getAll();
        patchState(store, { items, error: null });
      } catch (err) {
        patchState(store, { error: err.message });
      } finally {
        patchState(store, { loading: false });
      }
    }
  })),
  withHooks({ onInit(store) { store.loadItems(); } })
);
```

- State: entities[], loading, error
- Computed: filtered, count, selected
- Methods: load(), add(), update(), remove()
- Inject API Service in withMethods
- Use patchState() for updates

### Router Resolver (Optional)
- Functional resolver, triggers Store directly
- Store has RxMethod for loading
- Resolver: inject Store, call rxMethod(), return Observable
- Container: Subscribe to Store signals/observables
- NO manual data passing, Store handles everything

---

## File Structure

```
feature/
├── containers/name-container/
│   ├── name-container.component.ts    # Container
│   ├── name-container.component.html  # Separate
│   ├── name-container.component.scss  # Separate
│   └── name-container.component.spec.ts
├── components/                        # Presentational
├── services/
│   ├── name-api.service.ts           # HTTP only
│   └── name-business.service.ts      # Logic
├── stores/
│   └── name.store.ts                 # State
├── resolvers/
│   └── name.resolver.ts              # Preload data
├── models/
│   └── name.model.ts                 # Interfaces
└── name.routes.ts                    # Lazy loading + resolver
```

---

## Rules

**MANDATORY:**
- OnPush everywhere
- Separate HTML + SCSS files
- NO Store in Presentational
- NO HTTP in Store
- NO business logic in Container
- Naming from glossary (code-language.md)
- TrackBy in all @for loops (performance.md)
