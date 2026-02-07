# Angular Performance Optimization Skill

WANN NUTZEN: Bei ALLEN Components & Listen!

---

## 1. TrackBy (PFLICHT bei @for!)

```typescript
// ✅ GOOD - Track by unique ID
@for (user of users(); track user.id) {
  <app-user-card [user]="user" />
}

// ❌ BAD - Track by index
@for (user of users(); track $index) {
  <app-user-card [user]="user" />
}
```

**Performance:** 100x Boost bei Updates!

---

## 2. OnPush Change Detection (PFLICHT!)

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush // IMMER!
})
```

**Warum:** 10x schnellere Change Detection

---

## 3. Computed statt Methoden

```typescript
// ✅ GOOD - Computed (cached)
activeUsers = computed(() => this.users().filter(u => u.active));

// ❌ BAD - Method (re-run every CD)
getActiveUsers() {
  return this.users().filter(u => u.active);
}
```

---

## 4. Lazy Loading (PFLICHT!)

```typescript
// ✅ Lazy
{
  path: 'users',
  loadChildren: () => import('./features/user/user.routes')
}

// ❌ Eager
import { UserContainerComponent } from '...';
{
  path: 'users',
  component: UserContainerComponent
}
```

---

## 5. Template Rules

### ✅ ERLAUBT
- `{{ userName() }}` - Signal
- `{{ user.name }}` - Property
- `{{ date | date }}` - Pipe
- `(click)="save()}"` - Event

### ❌ VERBOTEN
- `{{ getUsers() }}` - Methode
- `{{ price * qty }}` - Berechnung
- `{{ users.filter(...) }}` - Filter

**Grund:** Performance! Methoden laufen bei jedem CD Cycle!

---

## 6. Weitere Optimierungen

**Image Lazy Load:**
```html
<img [src]="avatar" loading="lazy" />
```

**Virtual Scrolling (>100 Items):**
```typescript
import { ScrollingModule } from '@angular/cdk/scrolling';

<cdk-virtual-scroll-viewport itemSize="50">
  @for (item of items(); track item.id) {
    <app-item [data]="item" />
  }
</cdk-virtual-scroll-viewport>
```

**Debounce Input:**
```typescript
searchControl.valueChanges
  .pipe(debounceTime(300), distinctUntilChanged())
  .subscribe(term => this.search(term));
```

---

## Checklist

- [ ] trackBy bei ALLEN @for Loops
- [ ] OnPush bei ALLEN Components
- [ ] Computed statt Methoden
- [ ] Lazy Loading für Features
- [ ] Keine Methoden im Template
- [ ] Image lazy loading
- [ ] Debounce User Input
