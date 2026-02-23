# Check Performance Command

Prüft Performance Best Practices.

## Usage

```
<feature-name>
```

Beispiel: `user-notifications`

## Checks

### 1. OnPush Change Detection
```typescript
// ✅ GOOD
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// ❌ BAD - Default (missing)
@Component({})
```

### 2. TrackBy in @for Loops
```html
<!-- ✅ GOOD - track by unique ID -->
@for (user of users(); track user.id) {}

<!-- ❌ BAD - track by index -->
@for (user of users(); track $index) {}

<!-- ❌ BAD - no track -->
@for (user of users()) {}
```

### 3. Keine Methoden im Template
```html
<!-- ✅ GOOD - Computed Signal -->
<div>{{ activeUsers().length }}</div>

<!-- ❌ BAD - Method call -->
<div>{{ getActiveUsers().length }}</div>
<div>{{ users.filter(u => u.active).length }}</div>
```

### 4. Computed statt Getter
```typescript
// ✅ GOOD - Computed (cached)
activeUsers = computed(() => this.users().filter(u => u.active));

// ❌ BAD - Getter (recalculates every time)
get activeUsers() { return this.users().filter(u => u.active); }
```

### 5. Lazy Loading für Features
```typescript
// ✅ GOOD
loadChildren: () => import('./feature/feature.routes')

// ❌ BAD
component: FeatureComponent
```

### 6. Debounce bei User Input
```typescript
// ✅ GOOD
searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged()
)

// ❌ BAD - No debounce
searchControl.valueChanges.subscribe(...)
```

### 7. Virtual Scrolling für große Listen (>100 items)
```html
<!-- ✅ GOOD -->
<cdk-virtual-scroll-viewport>
  @for (item of items(); track item.id) {}
</cdk-virtual-scroll-viewport>
```

## Output

```
⚡ Checking performance for: user-notifications

✅ OnPush Change Detection
   ✅ All components use OnPush

⚠️ TrackBy
   ❌ notification-list.component.html:8
      track $index → track notification.id

⚠️ Template Methods
   ❌ notification-container.component.html:12
      getUnreadCount() → use computed signal

✅ Computed Signals
   ✅ No getters found

✅ Lazy Loading
   ✅ Feature is lazy loaded

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Score: 80/100
❌ 2 issues found

💡 Run /fix-performance user-notifications to auto-fix
```
