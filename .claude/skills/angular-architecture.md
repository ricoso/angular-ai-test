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
// user.store.ts
export const UserStore = signalStore(
  { providedIn: 'root' },
  withState({
    users: [] as User[],
    loading: false,
    error: null as string | null
  }),
  withComputed(({ users }) => ({
    userCount: computed(() => users().length),
    hasUsers: computed(() => users().length > 0)
  })),
  withMethods((store, api = inject(UserApiService)) => ({
    async loadUsers() {
      patchState(store, { loading: true });
      try {
        const users = await api.getAll();
        patchState(store, { users, error: null });
      } catch (err) {
        patchState(store, { error: err.message });
      } finally {
        patchState(store, { loading: false });
      }
    },
    async addUser(user: User) {
      await api.create(user);
      patchState(store, { users: [...store.users(), user] });
    }
  }))
  // ⚠️ KEIN withHooks onInit für Feature-Daten!
);
```

- State: entities[], loading, error
- Computed: filtered, count, selected
- Methods: load(), add(), update(), remove()
- Inject API Service in withMethods
- Use patchState() for updates
- ⚠️ **KEIN `onInit`** für Feature-Daten → Route Resolver!

### Router Resolver (STANDARD für Feature-Daten!)

```typescript
// user.resolver.ts
export const usersResolver: ResolveFn<void> = () => {
  const store = inject(UserStore);
  store.loadUsers();
  return;
};

// user.routes.ts
export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserContainerComponent,
    resolve: { _: usersResolver }  // Resolver triggert Store
  }
];
```

### Store `onInit` - NUR für globale Daten!

```typescript
// ✅ OK: App-Config Store (global, einmalig)
export const ConfigStore = signalStore(
  { providedIn: 'root' },
  withState({ theme: 'light', language: 'de' }),
  withMethods((store, api = inject(ConfigApiService)) => ({
    async loadConfig() { /* ... */ }
  })),
  withHooks({
    onInit(store) { store.loadConfig(); }  // ✅ OK für globale Config
  })
);

// ❌ FALSCH: Feature Store mit onInit
export const UserStore = signalStore(
  withHooks({
    onInit(store) { store.loadUsers(); }  // ❌ NICHT für Feature-Daten!
  })
);
```

**Wann `onInit` im Store?**
- ✅ App-Konfiguration (einmalig beim Start)
- ✅ Auth/User Session (global)
- ✅ Feature Flags
- ❌ NICHT für Feature-Daten (Users, Products, Orders)

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
