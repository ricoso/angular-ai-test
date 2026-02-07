# Routing Patterns (ULTRA-COMPACT)

---

## Lazy Loading (PFLICHT!)

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./features/user/user.routes')
      .then(m => m.USER_ROUTES)
  }
];

// user.routes.ts
export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserContainerComponent,
    resolve: { users: usersResolver }  // Optional: Preload data
  }
];
```

---

## Router Resolver

**Wann:** Data BEFORE route activation (prevent empty screen)

**Pattern:** Functional Resolver

### Deutsches Requirement

```typescript
// user.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { BenutzerApiService } from './services/benutzer-api.service';
import { Benutzer } from './models/benutzer.model';

export const benutzerResolver: ResolveFn<Benutzer[]> = async () => {
  const api = inject(BenutzerApiService);
  return api.holeAlle();
};

// Routes
{
  path: '',
  component: BenutzerContainerComponent,
  resolve: { benutzer: benutzerResolver }
}

// Container Component
export class BenutzerContainerComponent {
  private route = inject(ActivatedRoute);
  
  ngOnInit() {
    // Data already loaded!
    const benutzer = this.route.snapshot.data['benutzer'];
    this.benutzerStore.setzeBenutzer(benutzer);
  }
}
```

### Englisches Requirement

```typescript
// user.resolver.ts
export const usersResolver: ResolveFn<User[]> = async () => {
  const api = inject(UserApiService);
  return api.getAll();
};

// Routes
{
  path: '',
  component: UserContainerComponent,
  resolve: { users: usersResolver }
}

// Container Component
ngOnInit() {
  const users = this.route.snapshot.data['users'];
  this.userStore.setUsers(users);
}
```

---

## Resolver with Params

```typescript
// Detail Route mit ID
export const benutzerDetailResolver: ResolveFn<Benutzer> = async (route) => {
  const api = inject(BenutzerApiService);
  const id = route.paramMap.get('id')!;
  return api.holeNachId(id);
};

// Routes
{
  path: ':id',
  component: BenutzerDetailContainerComponent,
  resolve: { benutzer: benutzerDetailResolver }
}
```

---

## Resolver Error Handling

```typescript
export const benutzerResolver: ResolveFn<Benutzer[]> = async () => {
  const api = inject(BenutzerApiService);
  const router = inject(Router);
  
  try {
    return await api.holeAlle();
  } catch (error) {
    // Redirect on error
    router.navigate(['/fehler']);
    return [];
  }
};
```

---

## Guards (Functional)

```typescript
// Auth Guard
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

## Route Params (Signal-based)

```typescript
// Container Component
export class BenutzerDetailContainerComponent {
  private route = inject(ActivatedRoute);
  
  // Signal from route params
  benutzerId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id')!)
    )
  );
  
  // Computed from route data
  benutzer = computed(() => {
    const id = this.benutzerId();
    return this.benutzerStore.benutzer()
      .find(b => b.id === id);
  });
}
```

---

## Query Params

```typescript
// Read query params
queryParams = toSignal(
  this.route.queryParamMap.pipe(
    map(params => ({
      filter: params.get('filter') || '',
      sortBy: params.get('sortBy') || 'name'
    }))
  )
);

// Navigate with query params
router.navigate(['/benutzer'], {
  queryParams: { filter: 'aktiv', sortBy: 'name' }
});
```

---

## Navigation

```typescript
// Simple navigation
router.navigate(['/benutzer']);

// With ID
router.navigate(['/benutzer', id]);

// With query params
router.navigate(['/benutzer'], {
  queryParams: { filter: 'aktiv' }
});

// Relative navigation
router.navigate(['../'], { relativeTo: route });
```

---

## Checklist

**Resolver:**
- [ ] Functional resolver (ResolveFn)
- [ ] Inject API Service
- [ ] Return Promise<T>
- [ ] Error handling
- [ ] Route config: resolve: { key: resolver }
- [ ] Read in component: route.snapshot.data['key']

**Routes:**
- [ ] Lazy loading everywhere
- [ ] Resolver für Initial-Daten
- [ ] Guards für Auth
- [ ] Signal-based params
