# Check Forms Command

Prüft ob Formulare den Best Practices entsprechen.

## Usage

```
<feature-name>
```

Beispiel: `user-notifications`

## Checks

### 1. Reactive Forms (NICHT Template-Driven)
```typescript
// ✅ GOOD - Reactive Forms
form = new FormGroup({
  name: new FormControl('', Validators.required)
});

// ❌ BAD - Template-Driven
<input [(ngModel)]="name">
```

### 2. Typed Forms
```typescript
// ✅ GOOD - Typed
form = new FormGroup<UserForm>({
  name: new FormControl<string>('', { nonNullable: true })
});

// ❌ BAD - Untyped
form = new FormGroup({
  name: new FormControl('')
});
```

### 3. Validators im Component (nicht Template)
```typescript
// ✅ GOOD
name: new FormControl('', [
  Validators.required,
  Validators.minLength(2)
])

// ❌ BAD - Validation im Template
<input required minlength="2">
```

### 4. Custom Validators in separater Datei
```
feature/
├── validators/
│   └── user.validators.ts   ✅
```

### 5. Error Messages mit i18n
```html
<!-- ✅ GOOD -->
@if (form.controls.name.errors?.['required']) {
  <mat-error>{{ 'validation.required' | translate }}</mat-error>
}

<!-- ❌ BAD -->
<mat-error>Pflichtfeld</mat-error>
```

### 6. Form Submission im Container
```typescript
// ✅ GOOD - Container handled submit
onSubmit() {
  if (this.form.valid) {
    this.store.save(this.form.getRawValue());
  }
}

// ❌ BAD - Presentational handled submit
```

## Output

```
📝 Checking forms for: user-notifications

✅ Reactive Forms
   ✅ All forms use FormGroup/FormControl
   ✅ No ngModel found

✅ Typed Forms
   ✅ All FormControls are typed

⚠️ Validators
   ❌ user-form.component.ts:12
      Validation in template, move to component

✅ Error Messages
   ✅ All errors use translate pipe

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Score: 95/100
❌ 1 issue found
```
