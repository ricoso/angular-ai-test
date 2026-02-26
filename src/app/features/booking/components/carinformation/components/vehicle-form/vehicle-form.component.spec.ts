import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import type { FormGroup} from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';

import { VehicleFormComponent } from './vehicle-form.component';

describe('VehicleFormComponent', () => {
  let component: VehicleFormComponent;
  let fixture: ComponentFixture<VehicleFormComponent>;
  let testForm: FormGroup;

  beforeEach(async () => {
    const fb = new FormBuilder();
    testForm = fb.group({
      licensePlate: ['', [Validators.required, Validators.pattern(/^[A-ZÄÖÜ]{1,3}-[A-Z]{1,2}[0-9]{1,4}$/)]],
      mileage: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      vin: ['', [Validators.required, Validators.pattern(/^[A-HJ-NPR-Z0-9]{17}$/)]]
    });

    await TestBed.configureTestingModule({
      imports: [VehicleFormComponent]
    })
      .overrideComponent(VehicleFormComponent, {
        set: { template: '<div class="mocked">Mocked Vehicle Form</div>' }
      })
      .compileComponents();

    fixture = TestBed.createComponent(VehicleFormComponent);
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
      expect(exposed.errors().licensePlate.required).toBe(false);
    });

    it('should return true for empty required touched field', () => {
      const exposed = component as unknown as { errors: () => Record<string, Record<string, boolean>> };
      testForm.get('licensePlate')?.markAsTouched();
      expect(exposed.errors().licensePlate.required).toBe(true);
    });
  });

  describe('Validation patterns', () => {
    it('should validate license plate format', () => {
      testForm.get('licensePlate')?.setValue('invalid');
      expect(testForm.get('licensePlate')?.hasError('pattern')).toBe(true);

      testForm.get('licensePlate')?.setValue('B-MS1234');
      expect(testForm.get('licensePlate')?.hasError('pattern')).toBe(false);
    });

    it('should validate mileage as digits only', () => {
      testForm.get('mileage')?.setValue('abc');
      expect(testForm.get('mileage')?.hasError('pattern')).toBe(true);

      testForm.get('mileage')?.setValue('50000');
      expect(testForm.get('mileage')?.hasError('pattern')).toBe(false);
    });

    it('should validate VIN as exactly 17 alphanumeric characters', () => {
      testForm.get('vin')?.setValue('ABC123');
      expect(testForm.get('vin')?.hasError('pattern')).toBe(true);

      testForm.get('vin')?.setValue('WBAPH5C55BA123456');
      expect(testForm.get('vin')?.hasError('pattern')).toBe(false);
    });

    it('should reject VIN with invalid characters (I, O, Q)', () => {
      testForm.get('vin')?.setValue('WBAPH5I55BA123456');
      expect(testForm.get('vin')?.hasError('pattern')).toBe(true);
    });

    it('should accept license plate with umlauts', () => {
      testForm.get('licensePlate')?.setValue('Ö-AB1234');
      expect(testForm.get('licensePlate')?.hasError('pattern')).toBe(false);
    });

    it('should validate multi-part license plates', () => {
      testForm.get('licensePlate')?.setValue('HH-AB1');
      expect(testForm.get('licensePlate')?.hasError('pattern')).toBe(false);

      testForm.get('licensePlate')?.setValue('HRO-A1');
      expect(testForm.get('licensePlate')?.hasError('pattern')).toBe(false);
    });
  });
});
