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

### 3. Computed statt Methods (ÜBERALL — auch Forms!)

```typescript
filtered = computed(() => items().filter(...))  // ✅ Cached
getFiltered() { return items().filter(...) }    // ❌ Re-runs!
```

**Auch bei Forms:** `hasError()` / `getErrorMessage()` als Methode ist VERBOTEN!
```typescript
// ❌ VERBOTEN: Methode im Template
protected hasError(field: string, error: string): boolean { ... }

// ✅ PFLICHT: Computed Signal mit form.events
protected readonly errors = computed(() => {
  this.formEvents(); // toSignal(form.events)
  return { email: { required: this.checkError(form, 'email', 'required') } };
});
```

### 4. Lazy Loading (PFLICHT!)

```typescript
{ path: 'users', loadChildren: () => import('./features/user/user.routes') }
```

### 5. Template Rules

**ALLOWED:** `{{ signal() }}`, `{{ computed() }}`, `{{ property }}`, `{{ date | pipe }}`, `(event)="handler()"`
**FORBIDDEN:** `{{ method() }}`, `{{ a * b }}`, `{{ arr.filter() }}`, `hasError()`, `getErrorMessage()`

> **NUR computed() und signal() dürfen im Template gelesen werden!**
> Event Handler (`(click)="onSave()"`) sind die EINZIGE erlaubte Methoden-Nutzung im Template.

## Optional Optimizations

Image `loading="lazy"`, Virtual Scroll >100 items, Debounce inputs 300ms, `takeUntil(destroy$)`
