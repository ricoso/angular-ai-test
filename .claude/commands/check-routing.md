# Check Routing Command

Prüft ob Routing den Best Practices entspricht.

## Usage

```
<feature-name>
```

Beispiel: `user-notifications`

## Checks

### 1. Lazy Loading
```typescript
// ✅ GOOD - Lazy loaded
{
  path: 'users',
  loadChildren: () => import('./features/user/user.routes')
    .then(m => m.USER_ROUTES)
}

// ❌ BAD - Eager loaded
{
  path: 'users',
  component: UserContainerComponent
}
```

### 2. Feature Routes in separater Datei
```
feature/
├── user.routes.ts   ✅ Eigene Route-Datei
```

### 3. Container Component pro Route
```typescript
// ✅ GOOD
export const USER_ROUTES: Routes = [
  { path: '', component: UserContainerComponent }
];

// ❌ BAD - Presentational als Route
export const USER_ROUTES: Routes = [
  { path: '', component: UserListComponent }
];
```

### 4. Guards als Functions
```typescript
// ✅ GOOD - Functional Guard
export const authGuard: CanActivateFn = () => {
  return inject(AuthService).isAuthenticated();
};

// ❌ BAD - Class Guard (deprecated)
@Injectable()
export class AuthGuard implements CanActivate {}
```

### 5. Resolver Pattern (optional)
```typescript
// ✅ GOOD - Resolver triggert Store
export const usersResolver: ResolveFn<void> = () => {
  inject(UserStore).loadUsers();
  return;
};
```

### 6. Route Params mit Signals
```typescript
// ✅ GOOD - Signal-based
id = input.required<string>(); // via withComponentInputBinding()

// ❌ BAD - ActivatedRoute
this.route.params.subscribe(p => this.id = p['id']);
```

## Output

```
🛤️ Checking routing for: user-notifications

✅ Lazy Loading
   ✅ Feature is lazy loaded

✅ Route Structure
   ✅ Routes in separate file
   ✅ Container as route component

⚠️ Guards
   ❌ auth.guard.ts
      Class-based guard, convert to functional

✅ Route Params
   ✅ Using input() for route params

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Score: 90/100
❌ 1 issue found
```
