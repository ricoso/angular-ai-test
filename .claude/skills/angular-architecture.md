# Angular Architecture (COMPACT)

## Projekt-Vorgabe
- Typ: Click-Dummy (kein Backend, kein SSR)
- API Services: Mock-Daten / lokale JSON
- Auth: Keine (oder simuliert)

**VORHER LESEN:** code-language.md, performance.md

---

## Pattern: Container/Presentational

**Regel:** 1 Route = 1 Container + N Presentational Children

---

## Layer Responsibilities

| Layer | Inject | Aufgabe |
|-------|--------|---------|
| **Container** | Store, Business Service | Event Handler, Combine Stores |
| **Presentational** | - | input/output, Display only |
| **API Service** | HttpClient | HTTP calls, return Promise<T> |
| **Business Service** | API Service | Validation, Logik |
| **Feature Store** | API Service | Global Business Data |
| **Component Store** | - | Local UI State |

---

## Feature Store (Global Business Data)

```typescript
// user.store.ts
export const UserStore = signalStore(
  { providedIn: 'root' },  // Global Singleton

  withState<UserState>({ users: [], isLoading: false, error: null }),

  withComputed(({ users }) => ({
    hasUsers: computed(() => users().length > 0),
    userCount: computed(() => users().length)
  })),

  withMethods((store, userApi = inject(UserApiService)) => ({
    async loadUsers(): Promise<void> {
      patchState(store, { isLoading: true });
      try {
        const users = await userApi.getAll();
        patchState(store, { users, isLoading: false });
      } catch (error) {
        patchState(store, { error: 'Failed to load', isLoading: false });
      }
    },
    async addUser(user: User): Promise<void> {
      await userApi.create(user);
      patchState(store, { users: [...store.users(), user] });
    }
  }))
);
```

**Wann Feature Store:**
- Business Data (Users, Products, Orders)
- API Data
- Shared across routes
- Auth state

---

## Component Store (Local UI State)

```typescript
// product-list-ui.store.ts
export const ProductListUiStore = signalStore(
  // NO providedIn - local to component!

  withState({
    selectedTab: 'all' as 'all' | 'featured',
    sortBy: 'name' as 'name' | 'price',
    viewMode: 'grid' as 'grid' | 'list',
    currentPage: 1
  }),

  withMethods((store) => ({
    selectTab(tab: 'all' | 'featured'): void {
      patchState(store, { selectedTab: tab, currentPage: 1 });
    },
    setSortBy(sortBy: 'name' | 'price'): void {
      patchState(store, { sortBy });
    },
    setPage(page: number): void {
      patchState(store, { currentPage: page });
    }
  }))
  // NO withHooks needed
);
```

**Wann Component Store:**
- UI State (tabs, filters, sort, view mode)
- Component-specific state
- Destroyed with component

---

## Container: Feature + Component Store

```typescript
@Component({
  providers: [ProductListUiStore],  // Local!
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListContainerComponent {
  // Feature Store (global)
  protected productStore = inject(ProductStore);

  // Component Store (local)
  protected uiStore = inject(ProductListUiStore);

  // Combine stores
  filteredProducts = computed(() => {
    let result = this.productStore.products();
    const tab = this.uiStore.selectedTab();
    return tab === 'featured' ? result.filter(p => p.featured) : result;
  });

  // Event handlers
  onTabChange(tab: 'all' | 'featured'): void {
    this.uiStore.selectTab(tab);
  }

  // NO ngOnInit for data loading - Resolver does this!
}
```

---

## Router Resolver (Data Loading)

```typescript
// user.resolver.ts
export const usersResolver: ResolveFn<void> = () => {
  const store = inject(UserStore);
  store.loadUsers();
  return;  // Return void!
};

// user.routes.ts
{ path: '', component: UserContainerComponent, resolve: { _: usersResolver } }
```

---

## Store onInit - NUR für globale Daten!

```typescript
// OK: Global Config
export const ConfigStore = signalStore(
  { providedIn: 'root' },
  withHooks({ onInit(store) { store.loadConfig(); } })  // OK
);

// FALSCH: Feature Data
export const UserStore = signalStore(
  withHooks({ onInit(store) { store.loadUsers(); } })  // FALSCH!
);
```

**onInit erlaubt für:**
- App-Config
- Auth Session
- Feature Flags

**onInit VERBOTEN für:**
- Users, Products, Orders (→ Resolver!)

---

## File Structure

```
feature/
├── containers/name-container/
│   ├── name-container.component.ts
│   └── name-container.component.html
├── components/
│   └── name-list/
│       ├── name-list.component.ts
│       └── name-list.store.ts      # Component Store
├── services/
│   ├── name-api.service.ts         # HTTP only
│   └── name-business.service.ts    # Logic
├── stores/
│   └── name.store.ts               # Feature Store
├── resolvers/
│   └── name.resolver.ts
└── name.routes.ts
```

---

## Rules

| Rule | Feature Store | Component Store |
|------|---------------|-----------------|
| providedIn | 'root' | Component providers |
| Scope | Global | Local |
| Data | Business | UI State |
| withHooks | Only global data | Never |
| Lifecycle | App lifetime | Component lifetime |

**MANDATORY:**
- OnPush everywhere
- Separate HTML + SCSS files
- `inject()` NUR als Class Property (Anfang der Klasse), NIEMALS in Methoden
- NO Store in Presentational
- NO HTTP in Store
- NO business logic in Container
- TrackBy in @for loops

---

## Unit Test Pattern (Mocked Template)

**Regel:** UI wird via Playwright E2E getestet. Unit Tests prüfen NUR Logik (Inputs, Outputs, Event Handler, Computed).

**Template mocken** mit `overrideComponent` → eliminiert Angular Material / Child Component Abhängigkeiten:

```typescript
// ✅ RICHTIG — Mocked Template, Logic-only Tests
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

// UI rendering is verified via E2E (Playwright) — unit tests focus on logic only
describe('MyContainerComponent', () => {
  let component: MyContainerComponent;
  let fixture: ComponentFixture<MyContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyContainerComponent],
      providers: [
        // Stores, mocked Services, provideRouter([]) etc.
      ]
    })
      .overrideComponent(MyContainerComponent, {
        set: { template: '<div class="mocked">Mocked Component</div>' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(MyContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
```

### Protected Member Access

`protected` methods/properties via typed cast:

```typescript
// Interface für exposed protected members
interface ExposedComponent {
  onSave: (data: MyData) => void;
  isValid: () => boolean;
}

const exposed = component as unknown as ExposedComponent;
exposed.onSave(testData);
expect(exposed.isValid()).toBe(true);
```

### Input/Output Testing

```typescript
// Inputs via setInput (NOT direct assignment)
fixture.componentRef.setInput('selectedItem', 'abc');
fixture.detectChanges();
expect(component.selectedItem()).toBe('abc');

// Outputs via subscribe + exposed handler
const spy = jest.fn();
component.itemSelected.subscribe(spy);
const exposed = component as unknown as { onClick: (item: Item) => void };
exposed.onClick(testItem);
expect(spy).toHaveBeenCalledWith(testItem.id);
```

### Warum Mocked Template?

| Problem | Lösung |
|---------|--------|
| Angular Material Module Resolution in Jest | `overrideComponent` → Template wird ersetzt, keine Material-Imports nötig |
| Child Component Abhängigkeiten | Mocked Template → keine Children instantiiert |
| `provideAnimationsAsync` nicht auflösbar | Kein Template = keine Animations nötig |
| Schnellere Tests | Kein DOM Rendering, nur Logik |

### Jest Config (PFLICHT!)

`tsconfig.spec.json` braucht Path-Mappings für Subpath Exports:

```json
"paths": {
  "@angular/material/*": ["node_modules/@angular/material/types/*"],
  "@ngrx/signals/rxjs-interop": ["node_modules/@ngrx/signals/types/ngrx-signals-rxjs-interop.d.ts"]
}
```

`jest.config.ts` braucht passende `moduleNameMapper`:

```json
"moduleNameMapper": {
  "^@angular/material/(.+)$": "<rootDir>/node_modules/@angular/material/fesm2022/$1.mjs"
}
```
