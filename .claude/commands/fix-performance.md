# Fix Performance Command

Automatically fixes common performance issues in a feature.

## Usage

```
<feature-name>
```

Example: `product`

## Auto-Fixes Applied

### 1. Add TrackBy to @for Loops

**Before:**
```html
@for (user of users(); track $index) {
  <app-user-card [user]="user" />
}
```

**After:**
```html
@for (user of users(); track user.id) {
  <app-user-card [user]="user" />
}
```

**Detection:**
- Finds all `@for` loops
- Identifies items being iterated
- Determines unique key (id, uuid, etc.)
- Replaces `$index` or generic `track` with unique key

### 2. Convert to OnPush Change Detection

**Before:**
```typescript
@Component({
  selector: 'app-product-list',
  // No changeDetection specified (Default)
})
```

**After:**
```typescript
@Component({
  selector: 'app-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

**Impact:** 10x faster change detection

### 3. Convert Methods to Computed Signals

**Before:**
```typescript
export class ProductListComponent {
  products = signal<Product[]>([]);
  
  // ❌ Called on EVERY change detection
  getActiveProducts() {
    return this.products().filter(p => p.active);
  }
}
```

```html
<div>Active: {{ getActiveProducts().length }}</div>
```

**After:**
```typescript
export class ProductListComponent {
  products = signal<Product[]>([]);
  
  // ✅ Cached, only recalculates when products change
  activeProducts = computed(() => 
    this.products().filter(p => p.active)
  );
}
```

```html
<div>Active: {{ activeProducts().length }}</div>
```

**Detection:**
- Scans component for methods used in templates
- Identifies pure functions (no side effects)
- Converts to computed signals
- Updates template references

### 3b. Convert Form Error Methods to Computed Signals

**Before:**
```typescript
export class UserFormComponent {
  public readonly form = input.required<FormGroup>();

  // ❌ Called on EVERY change detection cycle
  protected hasError(field: string, error: string): boolean {
    const control = this.form().get(field);
    return !!(control?.hasError(error) && control.touched);
  }
}
```

```html
@if (hasError('email', 'required')) {
  <mat-error>Required</mat-error>
}
```

**After:**
```typescript
export class UserFormComponent {
  public readonly form = input.required<FormGroup>();

  // ✅ Reactive: tracks form.events
  private readonly formEvents = toSignal(
    toObservable(this.form).pipe(
      switchMap(form => form.events.pipe(startWith(null)))
    ),
    { initialValue: null }
  );

  // ✅ Cached computed signal — only recalculates on form events
  protected readonly errors = computed(() => {
    this.formEvents();
    const form = this.form();
    return {
      email: {
        required: this.checkError(form, 'email', 'required'),
        email: this.checkError(form, 'email', 'email'),
      },
    };
  });

  private checkError(form: FormGroup, field: string, error: string): boolean {
    const control = form.get(field);
    return !!(control?.hasError(error) && control.touched);
  }
}
```

```html
@if (errors().email.required) {
  <mat-error>Required</mat-error>
}
```

**Detection:**
- Finds `hasError()`, `getErrorMessage()`, `isInvalid()` methods used in templates
- Converts to `errors` computed signal with `form.events` tracking
- Maps all field/error combinations from template usage
- Updates all template references from `hasError('field', 'error')` to `errors().field.error`

### 4. Add Debounce to Form Inputs

**Before:**
```typescript
ngOnInit() {
  this.searchControl.valueChanges.subscribe(term => {
    this.search(term); // ❌ Called on every keystroke!
  });
}
```

**After:**
```typescript
ngOnInit() {
  this.searchControl.valueChanges
    .pipe(
      debounceTime(300),        // ✅ Wait 300ms
      distinctUntilChanged()    // ✅ Only if changed
    )
    .subscribe(term => {
      this.search(term);
    });
}
```

**Impact:** Reduces API calls by ~90%

### 5. Add Lazy Loading to Routes

**Before:**
```typescript
// app.routes.ts
import { ProductContainerComponent } from './features/product/containers/product-container';

{
  path: 'products',
  component: ProductContainerComponent  // ❌ Eager load
}
```

**After:**
```typescript
// app.routes.ts
{
  path: 'products',
  loadChildren: () => import('./features/product/product.routes')
    .then(m => m.PRODUCT_ROUTES)  // ✅ Lazy load
}
```

**Impact:** Faster initial load time

### 6. Add Virtual Scrolling (if > 100 items)

**Before:**
```html
@for (product of products(); track product.id) {
  <app-product-card [product]="product" />
}
```

**After (if products.length > 100):**
```html
<cdk-virtual-scroll-viewport itemSize="50">
  @for (product of products(); track product.id) {
    <app-product-card [product]="product" />
  }
</cdk-virtual-scroll-viewport>
```

```typescript
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  imports: [ScrollingModule]
})
```

**Impact:** Renders only visible items

### 7. Add Image Lazy Loading

**Before:**
```html
<img [src]="product.image" alt="Product" />
```

**After:**
```html
<img [src]="product.image" alt="Product" loading="lazy" />
```

**Impact:** Faster page load, less bandwidth

## Output Example

```
⚡ Fixing performance issues in: product

🔧 Auto-Fixes Applied:

✅ TrackBy (3 fixes)
   - product-list.component.html:12
     Changed: track $index → track product.id
   
   - product-list.component.html:28
     Changed: track i → track product.id
   
   - product-grid.component.html:5
     Changed: track product → track product.id

✅ OnPush (2 fixes)
   - product-list.component.ts
     Added: ChangeDetectionStrategy.OnPush
   
   - product-card.component.ts
     Added: ChangeDetectionStrategy.OnPush

✅ Computed Signals (1 fix)
   - product-list.component.ts:45
     Converted: getActiveProducts() → activeProducts computed
   - Updated template references (2 places)

✅ Debounce (1 fix)
   - product-list.component.ts:23
     Added debounceTime(300) to search input

✅ Virtual Scrolling (1 fix)
   - product-list.component.html
     Added <cdk-virtual-scroll-viewport>
     (List has 500 items)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ 8 performance fixes applied

📊 Expected Performance Gain:
   - Change Detection: 90% faster
   - API Calls: 90% fewer
   - Initial Render: 50% faster
   - Scroll Performance: 95% smoother

⚠️  Manual Review Needed:
   - Verify computed signal logic
   - Test debounce timing (adjust if needed)
   - Check virtual scrolling item size

🧪 Next Steps:
   npm run test:coverage
   npm start  # Manual testing
```

## Safety Features

**Backup Created:**
- All modified files backed up to `.backups/`
- Rollback available: `/rollback-performance product`

**Dry Run Mode:**
```
/fix-performance product --dry-run
```

Shows what would be fixed without making changes.

## Limitations

**Cannot Auto-Fix:**
- Complex business logic in templates
- Incorrect service layer separation
- Memory leaks from subscriptions (use /check-subscriptions)

**Manual Intervention Required:**
- Review computed signal conversions
- Adjust debounce timing based on UX needs
- Configure virtual scroll item size

## Best Practices

**When to Run:**
- ✅ After completing feature
- ✅ Before performance testing
- ✅ When users report slowness
- ✅ During optimization sprints

**Workflow:**
```bash
1. /check-architecture product   # Identify issues
2. /fix-performance product      # Auto-fix
3. npm test                      # Verify tests pass
4. npm start                     # Manual testing
5. /check-architecture product   # Verify fixes
```

## Performance Checklist

After running this command, verify:
- [ ] All @for loops use unique ID tracking
- [ ] All components use OnPush
- [ ] No method calls in templates
- [ ] Forms have debounce
- [ ] Routes are lazy loaded
- [ ] Large lists use virtual scrolling
- [ ] Images lazy load
- [ ] Tests still pass
- [ ] App works correctly
