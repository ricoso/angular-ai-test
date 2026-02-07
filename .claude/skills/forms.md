# Reactive Forms Skill

WANN NUTZEN: Bei ALLEN Form-Implementierungen (Login, Registration, User Edit, etc.)

---

## Reactive Forms Pattern

### Container Component (hat FormGroup)

```typescript
export class UserEditContainerComponent {
  private fb = inject(FormBuilder);
  
  form = signal<FormGroup>(this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    age: [null, [Validators.required, Validators.min(18)]]
  }));
  
  ngOnInit() {
    // Value Changes
    this.form().valueChanges
      .pipe(debounceTime(300))
      .subscribe(values => {
        // Auto-save, validation
      });
  }
  
  async onSubmit() {
    if (this.form().invalid) {
      this.form().markAllAsTouched();
      return;
    }
    
    await this.userBusiness.create(this.form().value);
  }
}
```

### Presentational Component (zeigt FormGroup)

```typescript
export class UserFormComponent {
  form = input.required<FormGroup>();
  submit = output<void>();
  
  hasError(field: string): boolean {
    const control = this.form().get(field);
    return !!(control && control.invalid && control.touched);
  }
  
  getErrorMessage(field: string): string {
    const control = this.form().get(field);
    if (!control?.errors || !control.touched) return '';
    
    if (control.errors['required']) return 'Required';
    if (control.errors['email']) return 'Invalid email';
    if (control.errors['minlength']) 
      return `Min ${control.errors['minlength'].requiredLength} chars`;
    
    return 'Invalid';
  }
}
```

**Template:**
```html
<form [formGroup]="form()" (ngSubmit)="submit.emit()">
  <input formControlName="email" [class.error]="hasError('email')" />
  @if (hasError('email')) {
    <span class="error">{{ getErrorMessage('email') }}</span>
  }
  <button type="submit" [disabled]="form().invalid">Save</button>
</form>
```

---

## Custom Validators

```typescript
export class CustomValidators {
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      
      const valid = /[0-9]/.test(value) && /[A-Z]/.test(value) && 
                    /[a-z]/.test(value) && value.length >= 8;
      
      return valid ? null : { weakPassword: true };
    };
  }
  
  static matchFields(field1: string, field2: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value1 = control.get(field1)?.value;
      const value2 = control.get(field2)?.value;
      return value1 === value2 ? null : { fieldsMismatch: true };
    };
  }
}

// Usage
this.form = this.fb.group({
  password: ['', [Validators.required, CustomValidators.strongPassword()]],
  confirmPassword: ['']
}, {
  validators: CustomValidators.matchFields('password', 'confirmPassword')
});
```

---

## Form Subscriptions

```typescript
export class FormContainerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  ngOnInit() {
    // Value changes with debounce
    this.form().valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(values => {
        localStorage.setItem('draft', JSON.stringify(values));
      });
    
    // Conditional validation
    this.form().get('country')!.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(country => {
        const zipField = this.form().get('zipCode');
        
        if (country === 'DE') {
          zipField?.setValidators([Validators.pattern(/^\d{5}$/)]);
        }
        
        zipField?.updateValueAndValidity();
      });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## Best Practices

### ✅ DO
- Reactive Forms (not Template-driven)
- Form in Container, display in Presentational
- FormGroup as Signal
- Subscribe to valueChanges in Container
- Unsubscribe in ngOnDestroy
- Custom Validators in separate file

### ❌ DON'T
- Template-driven forms
- Form logic in Presentational
- Forget to unsubscribe
- Skip validation testing
