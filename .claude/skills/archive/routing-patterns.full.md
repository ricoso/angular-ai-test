# SKILL: Routing Patterns (Angular 21)

## Wann nutzen
Routes, Navigation, Deep Links, Guards

## Core Principle: Container per Route

**Jede Route zeigt auf einen Container Component!**

```typescript
// user.routes.ts
export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserContainerComponent,  // ← Container!
    children: [
      {
        path: ':id',
        component: UserDetailContainerComponent  // ← Container!
      },
      {
        path: ':id/edit',
        component: UserEditContainerComponent  // ← Container!
      }
    ]
  }
];
```

## Route Structure

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  
  // Each lazy-loaded route points to a Container
  {
    path: 'users',
    loadChildren: () => import('./features/user/user.routes')
      .then(m => m.USER_ROUTES),
    canActivate: [authGuard]
  },
  
  {
    path: 'products',
    loadChildren: () => import('./features/product/product.routes')
      .then(m => m.PRODUCT_ROUTES),
    canActivate: [authGuard]
  },
  
  { path: '**', component: NotFoundComponent }
];
```

## Feature Routes with Containers

```typescript
// features/user/user.routes.ts
import { Routes } from '@angular/router';
import { UserContainerComponent } from './containers/user-container/user-container.component';
import { UserDetailContainerComponent } from './containers/user-detail-container/user-detail-container.component';
import { UserEditContainerComponent } from './containers/user-edit-container/user-edit-container.component';

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserContainerComponent,  // List View Container
    data: { title: 'user.list.title' }
  },
  {
    path: 'create',
    component: UserEditContainerComponent,  // Create Container
    data: { title: 'user.create.title', mode: 'create' }
  },
  {
    path: ':id',
    component: UserDetailContainerComponent,  // Detail View Container
    data: { title: 'user.detail.title' }
  },
  {
    path: ':id/edit',
    component: UserEditContainerComponent,  // Edit Container
    data: { title: 'user.edit.title', mode: 'edit' }
  }
];
```

## Container Component for Route

```typescript
// features/user/containers/user-container/user-container.component.ts
import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { UserStore } from '../../stores/user.store';
import { UserListComponent } from '../../components/user-list/user-list.component';
import { UserFilterComponent } from '../../components/user-filter/user-filter.component';

@Component({
  selector: 'app-user-container',
  standalone: true,
  imports: [UserListComponent, UserFilterComponent],
  templateUrl: './user-container.component.html',
  styleUrl: './user-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserContainerComponent implements OnInit {
  private userStore = inject(UserStore);
  
  users = this.userStore.filteredUsers;
  loading = this.userStore.loading;
  
  ngOnInit() {
    this.userStore.loadUsers();
  }
  
  onDelete(id: string) {
    this.userStore.deleteUser(id);
  }
}
```

## Route Parameters (with Signals)

```typescript
// features/user/containers/user-detail-container/user-detail-container.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { UserStore } from '../../stores/user.store';

@Component({
  selector: 'app-user-detail-container',
  standalone: true,
  templateUrl: './user-detail-container.component.html',
  styleUrl: './user-detail-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserDetailContainerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private userStore = inject(UserStore);
  
  // Route param as signal
  userId = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id') ?? '')
    ),
    { initialValue: '' }
  );
  
  user = this.userStore.selectedUser;
  
  ngOnInit() {
    // Load user based on route param
    const id = this.userId();
    if (id) {
      this.userStore.selectUser(id);
      this.userStore.loadUserDetails(id);
    }
  }
}
```

## Functional Guards

```typescript
// core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStore } from '@core/stores/auth.store';

export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  
  if (authStore.isAuthenticated()) {
    return true;
  }
  
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};

// core/guards/role.guard.ts
export const roleGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  
  const requiredRoles = route.data['roles'] as string[];
  const userRole = authStore.user()?.role;
  
  if (userRole && requiredRoles.includes(userRole)) {
    return true;
  }
  
  router.navigate(['/dashboard']);
  return false;
};
```

## Programmatic Navigation

```typescript
// In Container Component
export class UserContainerComponent {
  private router = inject(Router);
  
  onEdit(userId: string) {
    // Navigate to edit route
    this.router.navigate(['/users', userId, 'edit']);
  }
  
  onCreate() {
    // Navigate to create route
    this.router.navigate(['/users', 'create']);
  }
  
  onBack() {
    // Navigate back
    this.router.navigate(['/users']);
  }
}
```

## Deep Links

```typescript
// core/services/deep-link.service.ts
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class DeepLinkService {
  private router = inject(Router);
  
  init() {
    window.addEventListener('deeplink', (event: any) => {
      const url = new URL(event.url);
      // app://users/123 -> /users/123
      this.router.navigateByUrl(url.pathname);
    });
  }
}
```

## Lazy Loading Best Practices

```typescript
// ✅ GOOD - Lazy loaded with Container
{
  path: 'users',
  loadChildren: () => import('./features/user/user.routes')
    .then(m => m.USER_ROUTES)
}

// ❌ BAD - Eager loading
import { UserContainerComponent } from './features/user/containers/user-container.component';
{
  path: 'users',
  component: UserContainerComponent  // Loaded immediately!
}
```

## Route Data for Containers

```typescript
// Routes with data
{
  path: ':id/edit',
  component: UserEditContainerComponent,
  data: { 
    title: 'user.edit.title',
    mode: 'edit',
    breadcrumb: 'Edit User'
  }
}

// Access in Container
export class UserEditContainerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  
  mode = toSignal(
    this.route.data.pipe(
      map(data => data['mode'] as 'create' | 'edit')
    )
  );
  
  ngOnInit() {
    if (this.mode() === 'edit') {
      // Load existing user
    }
  }
}
```

## Best Practices

### ✅ DO
- One Container per Route
- Lazy Loading for all features
- Functional Guards
- Signal-based route params
- Deep Link support
- Route data for configuration

### ❌ DON'T
- Presentational components in routes
- Eager loading of features
- Class-based guards
- Direct DOM manipulation for navigation

## Route Structure Example

```
/users                  → UserContainerComponent
                          ├─ UserListComponent
                          └─ UserFilterComponent

/users/create           → UserEditContainerComponent (mode: create)
                          ├─ UserFormComponent
                          └─ UserPreviewComponent

/users/:id              → UserDetailContainerComponent
                          ├─ UserHeaderComponent
                          ├─ UserInfoComponent
                          └─ UserActivityComponent

/users/:id/edit         → UserEditContainerComponent (mode: edit)
                          ├─ UserFormComponent
                          └─ UserPreviewComponent
```

## Summary

✅ **Container per Route** - Always  
✅ **Lazy Loading** - All features  
✅ **Functional Guards** - Modern approach  
✅ **Signal params** - Type-safe  
✅ **Deep Links** - Mobile support
