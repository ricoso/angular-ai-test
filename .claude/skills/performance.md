# Performance Rules (ULTRA-COMPACT)

## MANDATORY

### 1. TrackBy (PFLICHT bei @for!)

```typescript
@for (item of items(); track item.id) { }  // ✅ Unique ID
@for (item of items(); track $index) { }   // ❌ NEVER!
```

### 2. OnPush (PFLICHT überall!)

```typescript
@Component({ changeDetection: ChangeDetectionStrategy.OnPush })
```

### 3. Computed statt Methods

```typescript
filtered = computed(() => items().filter(...))  // ✅ Cached
getFiltered() { return items().filter(...) }    // ❌ Re-runs!
```

### 4. Lazy Loading (PFLICHT!)

```typescript
{ path: 'users', loadChildren: () => import('./features/user/user.routes') }
```

### 5. Template Rules

**ALLOWED:** `{{ signal() }}`, `{{ property }}`, `{{ date | pipe }}`, `(event)="handler()"`
**FORBIDDEN:** `{{ method() }}`, `{{ a * b }}`, `{{ arr.filter() }}`

## Optional Optimizations

Image `loading="lazy"`, Virtual Scroll >100 items, Debounce inputs 300ms, `takeUntil(destroy$)`
