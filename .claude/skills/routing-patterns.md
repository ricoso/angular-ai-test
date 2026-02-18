# Routing Patterns (COMPACT)

## Projekt-Vorgabe
- Deployment: Click-Dummy (GitHub Pages)
- HashLocation: AKTIV (`withHashLocation()`)

---

## App Routes Pattern

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./features/home/containers/home-container/home-container.component')
      .then(m => m.HomeContainerComponent)
  },
  { path: '**', redirectTo: 'home' }
];
```

**Struktur:** `AppComponent` = Layout (Header + `<router-outlet>`), `''` → home, `**` → home

---

## GitHub Pages (HashLocation)

```typescript
// app.config.ts
providers: [
  provideRouter(routes, withHashLocation())
]
```

---

## Lazy Loading (PFLICHT!)

```typescript
// app.routes.ts
{ path: 'users', loadChildren: () => import('./features/user/user.routes') }

// user.routes.ts
{ path: '', component: UserContainerComponent, resolve: { _: usersResolver } }
```

---

## Resolver Pattern

**Pattern:** Resolver → Store.rxMethod → Component subscribes Store

### Store with RxMethod

```typescript
import { rxMethod } from '@ngrx/signals/rxjs-interop';

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
          error: (err: unknown) => patchState(store, { error: err instanceof Error ? err.message : 'Unknown error', isLoading: false })
        })
      )
    ),
    // With params variant:
    loadUser: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((id) => from(userApi.getById(id))),
        tap({ next: (user) => patchState(store, { selectedUser: user, isLoading: false }) })
      )
    )
  }))
);
```

### Resolvers

```typescript
// Without params
export const usersResolver: ResolveFn<void> = () => {
  inject(UserStore).loadUsers();
  return;
};

// With params
export const userDetailResolver: ResolveFn<void> = (route) => {
  inject(UserStore).loadUser(route.paramMap.get('id')!);
  return;
};
```

### Routes

```typescript
{ path: '', component: UserContainerComponent, resolve: { _: usersResolver } }
{ path: ':id', component: UserDetailComponent, resolve: { _: userDetailResolver } }
```

### Container

```typescript
export class UserContainerComponent {
  protected userStore = inject(UserStore);
  protected readonly users = this.userStore.users;
  protected readonly isLoading = this.userStore.isLoading;
  // NO ngOnInit for loading!
}
```

---

## Guards (Functional)

```typescript
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    void router.navigate(['/login']);
    return false;
  }
  return true;
};

// Routes
{ path: 'admin', canActivate: [authGuard], loadChildren: () => import('./admin/admin.routes') }
```

---

## Navigation

```typescript
void router.navigate(['/users']);
void router.navigate(['/users', id]);
void router.navigate(['/users'], { queryParams: { filter: 'active' } });
```

---

## Checklist

**Store:** `rxMethod<void>(pipe(...))`, `tap → patchState` (loading, data, error), `from()` for Promise → Observable
**Resolver:** `ResolveFn<void>`, call `store.rxMethod()`, return void
**Container:** Signals from Store, NO ngOnInit for loading
**Routes:** `resolve: { _: resolver }`, Lazy loading, Guards (optional)
