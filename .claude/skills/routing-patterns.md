# Routing Patterns (ULTRA-COMPACT)

---

## Lazy Loading (PFLICHT!)

```typescript
// app.routes.ts
{
  path: 'users',
  loadChildren: () => import('./features/user/user.routes')
}

// user.routes.ts
{
  path: '',
  component: UserContainerComponent,
  resolve: { data: userResolver }  // Triggers Store
}
```

---

## Router Resolver (with Store RxMethod)

**Pattern:** Resolver triggers Store → Store loads data → Component subscribes to Store

### Deutsches Requirement

**Store mit RxMethod:**
```typescript
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

export const BenutzerStore = signalStore(
  { providedIn: 'root' },
  
  withState<BenutzerState>({
    benutzer: [],
    istLaden: false,
    fehler: null
  }),
  
  withMethods((store, benutzerApi = inject(BenutzerApiService)) => ({
    // RxMethod für Resolver
    ladeBenutzer: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { istLaden: true, fehler: null })),
        switchMap(() => from(benutzerApi.holeAlle())),
        tap({
          next: (benutzer) => patchState(store, { benutzer, istLaden: false }),
          error: (fehler) => patchState(store, { fehler: fehler.message, istLaden: false })
        })
      )
    )
  }))
);
```

**Resolver:**
```typescript
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { BenutzerStore } from '../stores/benutzer.store';

export const benutzerResolver: ResolveFn<void> = () => {
  const store = inject(BenutzerStore);
  
  // Trigger Store RxMethod
  store.ladeBenutzer();
  
  // Return void (Store handles everything)
  return;
};
```

**Routes:**
```typescript
{
  path: '',
  component: BenutzerContainerComponent,
  resolve: { data: benutzerResolver }  // 'data' ist dummy key
}
```

**Container:**
```typescript
export class BenutzerContainerComponent {
  protected benutzerStore = inject(BenutzerStore);
  
  // Signals from Store (reactive!)
  benutzer = this.benutzerStore.benutzer;
  istLaden = this.benutzerStore.istLaden;
  
  // NO ngOnInit needed! Store is already loading via Resolver
}
```

---

### Englisches Requirement

**Store with RxMethod:**
```typescript
export const UserStore = signalStore(
  { providedIn: 'root' },
  
  withState({ users: [], isLoading: false, error: null }),
  
  withMethods((store, userApi = inject(UserApiService)) => ({
    loadUsers: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true, error: null })),
        switchMap(() => from(userApi.getAll())),
        tap({
          next: (users) => patchState(store, { users, isLoading: false }),
          error: (error) => patchState(store, { error: error.message, isLoading: false })
        })
      )
    )
  }))
);
```

**Resolver:**
```typescript
export const usersResolver: ResolveFn<void> = () => {
  const store = inject(UserStore);
  store.loadUsers();
  return;
};
```

**Container:**
```typescript
export class UserContainerComponent {
  protected userStore = inject(UserStore);
  
  users = this.userStore.users;
  isLoading = this.userStore.isLoading;
}
```

---

## Resolver with Params (Detail Route)

**Store:**
```typescript
withMethods((store, benutzerApi = inject(BenutzerApiService)) => ({
  ladeBenutzer: rxMethod<string>(  // Accepts ID
    pipe(
      tap(() => patchState(store, { istLaden: true })),
      switchMap((id) => from(benutzerApi.holeNachId(id))),
      tap({
        next: (benutzer) => patchState(store, { ausgewaehlterBenutzer: benutzer, istLaden: false }),
        error: (fehler) => patchState(store, { fehler: fehler.message, istLaden: false })
      })
    )
  )
}))
```

**Resolver:**
```typescript
export const benutzerDetailResolver: ResolveFn<void> = (route) => {
  const store = inject(BenutzerStore);
  const id = route.paramMap.get('id')!;
  
  store.ladeBenutzer(id);  // Pass ID to RxMethod
  return;
};
```

**Routes:**
```typescript
{
  path: ':id',
  component: BenutzerDetailContainerComponent,
  resolve: { data: benutzerDetailResolver }
}
```

---

## Guards (Functional)

```typescript
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  if (!auth.istAuthentifiziert()) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};

// Routes
{
  path: 'admin',
  canActivate: [authGuard],
  loadChildren: () => import('./features/admin/admin.routes')
}
```

---

## Navigation

```typescript
// Simple
router.navigate(['/benutzer']);

// With ID
router.navigate(['/benutzer', id]);

// With query params
router.navigate(['/benutzer'], { queryParams: { filter: 'aktiv' } });
```

---

## Checklist

**Store:**
- [ ] RxMethod für Resolver: `rxMethod<void>(pipe(...))`
- [ ] tap → patchState (loading, data, error)
- [ ] switchMap → API call
- [ ] from() für Promise → Observable

**Resolver:**
- [ ] Inject Store
- [ ] Call store.rxMethod()
- [ ] Return void (NO data passing!)
- [ ] ResolveFn<void>

**Container:**
- [ ] Inject Store
- [ ] Signals from Store (benutzer, istLaden)
- [ ] NO ngOnInit for loading!
- [ ] Store handles everything

**Routes:**
- [ ] resolve: { data: resolver }
- [ ] Lazy loading
- [ ] Guards (optional)
