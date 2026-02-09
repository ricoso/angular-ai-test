# Angular Architecture (ULTRA-COMPACT)

**VORHER LESEN:** code-language.md, performance.md

---

## Pattern: Container/Presentational

**Regel:** 1 Route = 1 Container + N Presentational Children

---

## Layer Responsibilities

### Container Component
- Route-level, @Component, OnPush
- Inject: Feature Store, Component Store (optional), Business Service
- Methods: on[Action]() event handlers
- ngOnInit: NO data loading (Route Resolver does this!)
- NO business logic, NO HTTP
- Pass data to children via Input
- Receive events via Output
- Combine Feature Store + Component Store with computed()

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

---

## Feature Store Pattern (Business Data)

**Verwendung:** Business Data (Users, Products, Cart, Orders)

**Regeln:**
- `providedIn: 'root'` (global singleton)
- Public Interface definieren (Type Safety)
- Business Data ONLY (keine UI State!)
- withState, withComputed, withMethods, withHooks
- API Service in withMethods injizieren
- onInit NUR für globale Daten (Config, Auth, Feature Flags)

### Feature Store mit Public Interface

```typescript
// shopping-cart.store.ts
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { computed, inject } from '@angular/core';

// ✅ Public Interface (Type Safety)
export interface ShoppingCartStoreInterface {
  // State Signals (read-only)
  readonly items: Signal<CartItem[]>;
  readonly totalPrice: Signal<number>;
  readonly isLoading: Signal<boolean>;
  readonly error: Signal<string | null>;

  // Computed Signals
  readonly hasItems: Signal<boolean>;
  readonly itemCount: Signal<number>;
  readonly formattedTotal: Signal<string>;

  // Methods (public API)
  addItem(item: CartItem): void;
  removeItem(itemId: string): void;
  updateQuantity(itemId: string, quantity: number): void;
  clearCart(): void;
}

// ✅ Feature Store Implementation
export const ShoppingCartStore = signalStore(
  { providedIn: 'root' },  // ✅ Global Singleton

  withState<CartState>({
    items: [],
    totalPrice: 0,
    isLoading: false,
    error: null
  }),

  withComputed(({ items, totalPrice }) => ({
    hasItems: computed(() => items().length > 0),
    itemCount: computed(() => items().reduce((sum, item) => sum + item.quantity, 0)),
    formattedTotal: computed(() =>
      new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
      }).format(totalPrice())
    )
  })),

  withMethods((store, cartApi = inject(ShoppingCartApiService)) => ({
    async addItem(item: CartItem): Promise<void> {
      patchState(store, { isLoading: true });

      try {
        await cartApi.addItem(item);
        const currentItems = store.items();
        const existingItem = currentItems.find(i => i.id === item.id);

        let newItems: CartItem[];
        if (existingItem) {
          newItems = currentItems.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          );
        } else {
          newItems = [...currentItems, item];
        }

        const totalPrice = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
        patchState(store, { items: newItems, totalPrice, isLoading: false });
      } catch (error) {
        patchState(store, {
          error: error instanceof Error ? error.message : 'Failed to add item',
          isLoading: false
        });
      }
    },

    async removeItem(itemId: string): Promise<void> {
      patchState(store, { isLoading: true });

      try {
        await cartApi.removeItem(itemId);
        const newItems = store.items().filter(i => i.id !== itemId);
        const totalPrice = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

        patchState(store, { items: newItems, totalPrice, isLoading: false });
      } catch (error) {
        patchState(store, {
          error: error instanceof Error ? error.message : 'Failed to remove item',
          isLoading: false
        });
      }
    },

    async updateQuantity(itemId: string, quantity: number): Promise<void> {
      if (quantity <= 0) {
        await this.removeItem(itemId);
        return;
      }

      patchState(store, { isLoading: true });

      try {
        await cartApi.updateQuantity(itemId, quantity);
        const newItems = store.items().map(i =>
          i.id === itemId ? { ...i, quantity } : i
        );
        const totalPrice = newItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

        patchState(store, { items: newItems, totalPrice, isLoading: false });
      } catch (error) {
        patchState(store, {
          error: error instanceof Error ? error.message : 'Failed to update',
          isLoading: false
        });
      }
    },

    async clearCart(): Promise<void> {
      patchState(store, { isLoading: true });

      try {
        await cartApi.clearCart();
        patchState(store, { items: [], totalPrice: 0, isLoading: false });
      } catch (error) {
        patchState(store, {
          error: error instanceof Error ? error.message : 'Failed to clear',
          isLoading: false
        });
      }
    }
  }))
);

// ✅ Type assertion: Ensure Store implements Interface
export type ShoppingCartStoreType = InstanceType<typeof ShoppingCartStore> & ShoppingCartStoreInterface;
```

---

## Component Store Pattern (UI State)

**Verwendung:** Lokaler UI-State (tabs, modals, filters, sort, view mode)

**Regeln:**
- Provided in Component's `providers` Array (NICHT root!)
- UI State ONLY (keine Business Daten!)
- Automatisch destroyed mit Component
- KEIN withHooks (nicht benötigt)
- Isolierter State

### Component Store für UI State

```typescript
// product-list-ui.store.ts
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';

interface ProductListUiState {
  selectedTab: 'all' | 'featured' | 'sale';
  sortBy: 'name' | 'price' | 'rating';
  sortDirection: 'asc' | 'desc';
  searchQuery: string;
  viewMode: 'grid' | 'list';
  currentPage: number;
  itemsPerPage: number;
  isFilterPanelOpen: boolean;
  selectedCategories: string[];
  priceRange: { min: number; max: number };
}

// ✅ Component Store (local)
export const ProductListUiStore = signalStore(
  // ⚠️ NO providedIn - provided in component!

  withState<ProductListUiState>({
    selectedTab: 'all',
    sortBy: 'name',
    sortDirection: 'asc',
    searchQuery: '',
    viewMode: 'grid',
    currentPage: 1,
    itemsPerPage: 12,
    isFilterPanelOpen: false,
    selectedCategories: [],
    priceRange: { min: 0, max: 1000 }
  }),

  withComputed(({ selectedCategories, searchQuery, priceRange }) => ({
    hasActiveFilters: computed(() =>
      selectedCategories().length > 0 ||
      searchQuery().length > 0 ||
      priceRange().min > 0 ||
      priceRange().max < 1000
    ),
    isSearching: computed(() => searchQuery().length > 0)
  })),

  withMethods((store) => ({
    // Tab selection
    selectTab(tab: 'all' | 'featured' | 'sale'): void {
      patchState(store, { selectedTab: tab, currentPage: 1 });
    },

    // Sort
    setSortBy(sortBy: 'name' | 'price' | 'rating'): void {
      patchState(store, { sortBy, currentPage: 1 });
    },

    toggleSortDirection(): void {
      const current = store.sortDirection();
      patchState(store, {
        sortDirection: current === 'asc' ? 'desc' : 'asc',
        currentPage: 1
      });
    },

    // Search
    setSearchQuery(query: string): void {
      patchState(store, { searchQuery: query, currentPage: 1 });
    },

    clearSearch(): void {
      patchState(store, { searchQuery: '', currentPage: 1 });
    },

    // View mode
    setViewMode(mode: 'grid' | 'list'): void {
      patchState(store, { viewMode: mode });
    },

    // Pagination
    setPage(page: number): void {
      patchState(store, { currentPage: page });
    },

    nextPage(): void {
      patchState(store, { currentPage: store.currentPage() + 1 });
    },

    previousPage(): void {
      const current = store.currentPage();
      if (current > 1) {
        patchState(store, { currentPage: current - 1 });
      }
    },

    // Filter panel
    toggleFilterPanel(): void {
      patchState(store, {
        isFilterPanelOpen: !store.isFilterPanelOpen()
      });
    },

    // Filters
    setCategories(categories: string[]): void {
      patchState(store, { selectedCategories: categories, currentPage: 1 });
    },

    setPriceRange(min: number, max: number): void {
      patchState(store, { priceRange: { min, max }, currentPage: 1 });
    },

    clearFilters(): void {
      patchState(store, {
        selectedCategories: [],
        priceRange: { min: 0, max: 1000 },
        searchQuery: '',
        currentPage: 1
      });
    },

    reset(): void {
      patchState(store, {
        selectedTab: 'all',
        sortBy: 'name',
        sortDirection: 'asc',
        searchQuery: '',
        viewMode: 'grid',
        currentPage: 1,
        isFilterPanelOpen: false,
        selectedCategories: [],
        priceRange: { min: 0, max: 1000 }
      });
    }
  }))
  // ⚠️ NO withHooks - not needed for Component Store
);
```

---

## Container: Feature Store + Component Store

```typescript
// product-list-container.component.ts
@Component({
  selector: 'app-product-list-container',
  templateUrl: './product-list-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [ProductListUiStore],  // ✅ Provide Component Store locally!
  imports: [ProductListComponent, CommonModule]
})
export class ProductListContainerComponent {
  // ✅ Feature Store (global business data)
  protected productStore = inject(ProductStore);

  // ✅ Component Store (local UI state)
  protected uiStore = inject(ProductListUiStore);

  // Business data from Feature Store
  products = this.productStore.products;
  isLoading = this.productStore.isLoading;
  error = this.productStore.error;

  // UI state from Component Store
  selectedTab = this.uiStore.selectedTab;
  sortBy = this.uiStore.sortBy;
  sortDirection = this.uiStore.sortDirection;
  searchQuery = this.uiStore.searchQuery;
  viewMode = this.uiStore.viewMode;
  currentPage = this.uiStore.currentPage;

  // ✅ Computed: Combine Feature Store + Component Store
  filteredProducts = computed(() => {
    let result = this.products();

    // Filter by tab
    const tab = this.selectedTab();
    if (tab === 'featured') {
      result = result.filter(p => p.featured);
    } else if (tab === 'sale') {
      result = result.filter(p => p.onSale);
    }

    // Filter by search
    const search = this.searchQuery();
    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by categories
    const categories = this.uiStore.selectedCategories();
    if (categories.length > 0) {
      result = result.filter(p => categories.includes(p.category));
    }

    // Filter by price range
    const { min, max } = this.uiStore.priceRange();
    result = result.filter(p => p.price >= min && p.price <= max);

    // Sort
    const sortBy = this.sortBy();
    const direction = this.sortDirection();
    result.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        comparison = a.price - b.price;
      } else if (sortBy === 'rating') {
        comparison = a.rating - b.rating;
      }

      return direction === 'asc' ? comparison : -comparison;
    });

    return result;
  });

  // Pagination
  paginatedProducts = computed(() => {
    const allProducts = this.filteredProducts();
    const page = this.currentPage();
    const perPage = this.uiStore.itemsPerPage();
    const startIndex = (page - 1) * perPage;

    return allProducts.slice(startIndex, startIndex + perPage);
  });

  totalPages = computed(() => {
    const total = this.filteredProducts().length;
    const perPage = this.uiStore.itemsPerPage();
    return Math.ceil(total / perPage);
  });

  // Event handlers: UI state
  onTabChange(tab: 'all' | 'featured' | 'sale'): void {
    this.uiStore.selectTab(tab);
  }

  onSortChange(sortBy: 'name' | 'price' | 'rating'): void {
    this.uiStore.setSortBy(sortBy);
  }

  onToggleSortDirection(): void {
    this.uiStore.toggleSortDirection();
  }

  onSearch(query: string): void {
    this.uiStore.setSearchQuery(query);
  }

  onViewModeChange(mode: 'grid' | 'list'): void {
    this.uiStore.setViewMode(mode);
  }

  onPageChange(page: number): void {
    this.uiStore.setPage(page);
  }

  onClearFilters(): void {
    this.uiStore.clearFilters();
  }

  // Event handlers: Business logic
  onAddToCart(product: Product): void {
    const cartStore = inject(ShoppingCartStore);
    cartStore.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  // NO ngOnInit for data loading - Route Resolver does this!
}
```

---

## Router Resolver (STANDARD für Feature-Daten!)

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

---

## Store `onInit` - NUR für globale Daten!

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

## Store Pattern: Wann welchen Store?

### Feature Store (Global)
**Use for:**
- ✅ Business data (Users, Products, Cart, Orders)
- ✅ Data from API
- ✅ State shared across routes
- ✅ Authentication state
- ✅ Global notifications

**Characteristics:**
- `providedIn: 'root'` (singleton)
- Survives route changes
- Public interface for type safety
- withHooks onInit for global initialization only

### Component Store (Local)
**Use for:**
- ✅ UI state (tabs, modals, filters, sort)
- ✅ Component-specific state
- ✅ Local loading/error states
- ✅ Temporary selections
- ✅ View mode, pagination

**Characteristics:**
- Provided in component's providers array
- Destroyed when component is destroyed
- Not shared with other components
- NO withHooks needed
- Isolated state

---

## File Structure

```
feature/
├── containers/name-container/
│   ├── name-container.component.ts    # Container
│   ├── name-container.component.html
│   ├── name-container.component.scss
│   └── name-container.component.spec.ts
├── components/                        # Presentational
│   ├── name-list/
│   │   ├── name-list.component.ts
│   │   ├── name-list.component.html
│   │   ├── name-list.component.scss
│   │   ├── name-list.store.ts        # ✅ Component Store (UI State)
│   │   └── name-list.component.spec.ts
├── services/
│   ├── name-api.service.ts           # HTTP only
│   └── name-business.service.ts      # Logic
├── stores/
│   └── name.store.ts                 # ✅ Feature Store (Business Data)
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
- NO Store in Presentational (except Component Store in Container)
- NO HTTP in Store
- NO business logic in Container
- Feature Store: Public Interface, providedIn root
- Component Store: Local providers, UI state only
- Naming from glossary (code-language.md)
- TrackBy in all @for loops (performance.md)
