# Reactive Forms Skill

WANN NUTZEN: Bei ALLEN Form-Implementierungen (Login, Registration, User Edit, etc.)

---

## Reactive Forms Pattern

### Container Component (hat FormGroup)

```typescript
export class UserEditContainerComponent {
  private fb = inject(FormBuilder);

  protected readonly form = signal<FormGroup>(this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    age: [null, [Validators.required, Validators.min(18)]]
  }));

  protected async onSubmit(): Promise<void> {
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
  public readonly form = input.required<FormGroup>();
  public readonly submit = output<void>();

  protected hasError(field: string): boolean {
    const control = this.form().get(field);
    return !!(control && control.invalid && control.touched);
  }

  protected getErrorMessage(field: string): string {
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
```
