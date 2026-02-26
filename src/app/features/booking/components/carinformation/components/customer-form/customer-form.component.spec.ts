import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import type { FormGroup} from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';

import { CustomerFormComponent } from './customer-form.component';

describe('CustomerFormComponent', () => {
  let component: CustomerFormComponent;
  let fixture: ComponentFixture<CustomerFormComponent>;
  let testForm: FormGroup;

  beforeEach(async () => {
    const fb = new FormBuilder();
    testForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      salutation: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s-]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s-]+$/)]],
      street: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      city: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s-]+$/)]],
      mobilePhone: ['', [Validators.required, Validators.pattern(/^0[0-9]+$/)]]
    });

    await TestBed.configureTestingModule({
      imports: [CustomerFormComponent]
    })
      .overrideComponent(CustomerFormComponent, {
        set: { template: '<div class="mocked">Mocked Customer Form</div>' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(CustomerFormComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('form', testForm);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('errors computed', () => {
    it('should return false when field is untouched', () => {
      const exposed = component as unknown as { errors: () => Record<string, Record<string, boolean>> };
      expect(exposed.errors().email.required).toBe(false);
    });

    it('should return true when required field is touched and empty', () => {
      const exposed = component as unknown as { errors: () => Record<string, Record<string, boolean>> };
      testForm.get('email')?.markAsTouched();
      expect(exposed.errors().email.required).toBe(true);
    });

    it('should return true for invalid email format', () => {
      const exposed = component as unknown as { errors: () => Record<string, Record<string, boolean>> };
      testForm.get('email')?.setValue('invalid');
      testForm.get('email')?.markAsTouched();
      expect(exposed.errors().email.email).toBe(true);
    });

    it('should return false for valid email format', () => {
      const exposed = component as unknown as { errors: () => Record<string, Record<string, boolean>> };
      testForm.get('email')?.setValue('test@example.com');
      testForm.get('email')?.markAsTouched();
      expect(exposed.errors().email.email).toBe(false);
    });
  });

  describe('Validation patterns', () => {
    it('should validate postalCode as digits only', () => {
      testForm.get('postalCode')?.setValue('abc');
      expect(testForm.get('postalCode')?.hasError('pattern')).toBe(true);

      testForm.get('postalCode')?.setValue('30159');
      expect(testForm.get('postalCode')?.hasError('pattern')).toBe(false);
    });

    it('should validate mobilePhone starts with 0', () => {
      testForm.get('mobilePhone')?.setValue('1701234567');
      expect(testForm.get('mobilePhone')?.hasError('pattern')).toBe(true);

      testForm.get('mobilePhone')?.setValue('017012345678');
      expect(testForm.get('mobilePhone')?.hasError('pattern')).toBe(false);
    });

    it('should validate city as letters only', () => {
      testForm.get('city')?.setValue('Berlin123');
      expect(testForm.get('city')?.hasError('pattern')).toBe(true);

      testForm.get('city')?.setValue('Berlin');
      expect(testForm.get('city')?.hasError('pattern')).toBe(false);
    });

    it('should accept umlauts in names', () => {
      testForm.get('firstName')?.setValue('Günther');
      expect(testForm.get('firstName')?.hasError('pattern')).toBe(false);

      testForm.get('lastName')?.setValue('Müller-Schön');
      expect(testForm.get('lastName')?.hasError('pattern')).toBe(false);
    });
  });
});
