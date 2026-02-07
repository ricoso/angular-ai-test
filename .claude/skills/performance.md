# Performance Rules (ULTRA-COMPACT)

---

## MANDATORY

### 1. TrackBy (PFLICHT bei @for!)

```typescript
@for (item of items(); track item.id) { }  // ✅ Unique ID
@for (item of items(); track $index) { }   // ❌ NEVER!
```

**Why:** 100x faster updates!

### 2. OnPush (PFLICHT überall!)

```typescript
@Component({ changeDetection: ChangeDetectionStrategy.OnPush })
```

**Why:** 10x faster change detection

### 3. Computed statt Methods

```typescript
filtered = computed(() => items().filter(...))  // ✅ Cached
getFiltered() { return items().filter(...) }    // ❌ Re-runs!
```

### 4. Lazy Loading (PFLICHT!)

```typescript
// Routes
{ path: 'users', loadChildren: () => import('./features/user/user.routes') }
```

### 5. Template Rules

**ALLOWED:**
- `{{ signal() }}` - Signal
- `{{ property }}` - Property
- `{{ date | pipe }}` - Pipe
- `(event)="handler()"` - Event

**FORBIDDEN:**
- `{{ method() }}` - Method call
- `{{ a * b }}` - Calculation
- `{{ arr.filter() }}` - Array operation

---

## Optional Optimizations

- Image: `<img loading="lazy" />`
- Virtual Scroll: For lists >100 items
- Debounce: Input events (300ms)
- Unsubscribe: takeUntil(destroy$)

---

## Checklist

- [ ] OnPush on ALL components
- [ ] trackBy on ALL @for loops
- [ ] Computed instead of methods
- [ ] Lazy loading for features
- [ ] NO method calls in templates
