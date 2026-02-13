# Routing Patterns (COMPACT)

## Projekt-Vorgabe
<!-- SETUP:VORGABE -->

---

## App Routes Pattern

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/containers/home-container/home-container.component')
      .then(m => m.HomeContainerComponent)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
```

**Struktur:**
- `AppComponent` = Layout (Header + `<router-outlet>`)
- `''` → Redirect zu `home` (Startpunkt)
- `home` → Lazy-loaded Home Feature
- `**` → Wildcard Redirect zu `home`

---

## GitHub Pages (HashLocation)

Für Static Hosting ohne Server-Side Routing:

```typescript
// app.config.ts
import { provideRouter, withHashLocation } from '@angular/router';

providers: [
  provideRouter(routes, withHashLocation())
]
```

**URLs:**
| Route | URL |
|-------|-----|
| Home (Start) | `https://user.github.io/repo/#/home` |
| Users | `https://user.github.io/repo/#/users` |

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

**Pattern:** Resolver → Store → Component subscribes

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
          error: (error) => patchState(store, { error: error.message, isLoading: false })
        })
      )
    )
  }))
);
```

### Resolver

```typescript
export const usersResolver: ResolveFn<void> = () => {
  const store = inject(UserStore);
  store.loadUsers();
  return;  // Return void!
};
```

### Container

```typescript
export class UserContainerComponent {
  protected userStore = inject(UserStore);

  users = this.userStore.users;
  isLoading = this.userStore.isLoading;

  // NO ngOnInit for loading!
}
```

---

## Resolver with Params

```typescript
// Store
loadUser: rxMethod<string>(
  pipe(
    tap(() => patchState(store, { isLoading: true })),
    switchMap((id) => from(userApi.getById(id))),
    tap({ next: (user) => patchState(store, { selectedUser: user, isLoading: false }) })
  )
)

// Resolver
export const userDetailResolver: ResolveFn<void> = (route) => {
  const store = inject(UserStore);
  const id = route.paramMap.get('id')!;
  store.loadUser(id);
  return;
};

// Routes
{ path: ':id', component: UserDetailComponent, resolve: { _: userDetailResolver } }
```

---

## Guards (Functional)

```typescript
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
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
router.navigate(['/users']);
router.navigate(['/users', id]);
router.navigate(['/users'], { queryParams: { filter: 'active' } });
```

---

## Checklist

**Store:**
- [ ] `rxMethod<void>(pipe(...))` for Resolver
- [ ] `tap → patchState` (loading, data, error)
- [ ] `from()` for Promise → Observable

**Resolver:**
- [ ] `ResolveFn<void>`
- [ ] Call `store.rxMethod()`
- [ ] Return void

**Container:**
- [ ] Signals from Store
- [ ] NO ngOnInit for loading

**Routes:**
- [ ] `resolve: { _: resolver }`
- [ ] Lazy loading
- [ ] Guards (optional)
