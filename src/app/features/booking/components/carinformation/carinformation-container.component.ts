import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import type { FormGroup } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { i18nKeys, TranslatePipe } from '@core/i18n';
import { merge, startWith, switchMap } from 'rxjs';

import type { CustomerInfo, Salutation, VehicleInfo } from '../../models/customer.model';
import { BookingStore } from '../../stores/booking.store';

import { CustomerFormComponent } from './components/customer-form/customer-form.component';
import { VehicleFormComponent } from './components/vehicle-form/vehicle-form.component';

@Component({
  selector: 'app-carinformation-container',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    CustomerFormComponent,
    VehicleFormComponent
  ],
  templateUrl: './carinformation-container.component.html',
  styleUrl: './carinformation-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarinformationContainerComponent {
  private readonly store = inject(BookingStore);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly booking = i18nKeys.booking;

  protected readonly customerForm = signal<FormGroup>(this.createCustomerForm());
  protected readonly vehicleForm = signal<FormGroup>(this.createVehicleForm());
  protected readonly privacyConsent = signal<boolean>(this.store.privacyConsent());

  private readonly formEvents = toSignal(
    merge(
      toObservable(this.customerForm).pipe(switchMap(f => f.events)),
      toObservable(this.vehicleForm).pipe(switchMap(f => f.events))
    ).pipe(startWith(null)),
    { initialValue: null }
  );

  protected readonly isFormValid = computed(() => {
    this.formEvents();
    return this.customerForm().valid && this.vehicleForm().valid && this.privacyConsent();
  });

  constructor() {
    this.prefillForms();
  }

  protected onSubmit(): void {
    const customerFormGroup = this.customerForm();
    const vehicleFormGroup = this.vehicleForm();

    customerFormGroup.markAllAsTouched();
    vehicleFormGroup.markAllAsTouched();

    if (customerFormGroup.invalid || vehicleFormGroup.invalid || !this.privacyConsent()) {
      return;
    }

    const customerInfo: CustomerInfo = {
      email: customerFormGroup.get('email')?.value as string,
      salutation: customerFormGroup.get('salutation')?.value as Salutation,
      firstName: customerFormGroup.get('firstName')?.value as string,
      lastName: customerFormGroup.get('lastName')?.value as string,
      street: customerFormGroup.get('street')?.value as string,
      postalCode: customerFormGroup.get('postalCode')?.value as string,
      city: customerFormGroup.get('city')?.value as string,
      mobilePhone: customerFormGroup.get('mobilePhone')?.value as string
    };

    const vehicleInfo: VehicleInfo = {
      licensePlate: vehicleFormGroup.get('licensePlate')?.value as string,
      mileage: Number(vehicleFormGroup.get('mileage')?.value),
      vin: vehicleFormGroup.get('vin')?.value as string
    };

    this.store.setCustomerInfo(customerInfo);
    this.store.setVehicleInfo(vehicleInfo);
    this.store.setPrivacyConsent(true);

    console.debug('[CarinformationContainer] Form submitted, navigating to booking overview');
    void this.router.navigate(['/home/carinformation']);
  }

  protected onBack(): void {
    this.store.clearSelectedAppointment();
    void this.router.navigate(['/home/appointment']);
  }

  protected onRetrieveData(): void {
    console.debug('[CarinformationContainer] Retrieve data clicked (Click-Dummy — no action)');
  }

  protected onPrivacyConsentChange(checked: boolean): void {
    this.privacyConsent.set(checked);
  }

  private createCustomerForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      salutation: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s-]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s-]+$/)]],
      street: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      city: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s-]+$/)]],
      mobilePhone: ['', [Validators.required, Validators.pattern(/^0[0-9]+$/)]]
    });
  }

  private createVehicleForm(): FormGroup {
    return this.fb.group({
      licensePlate: ['', [Validators.required, Validators.pattern(/^[A-ZÄÖÜ]{1,3}-[A-Z]{1,2}[0-9]{1,4}$/)]],
      mileage: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      vin: ['', [Validators.required, Validators.pattern(/^[A-HJ-NPR-Z0-9]{17}$/)]]
    });
  }

  private prefillForms(): void {
    const existingCustomer = this.store.customerInfo();
    if (existingCustomer) {
      this.customerForm().patchValue(existingCustomer);
    }

    const existingVehicle = this.store.vehicleInfo();
    if (existingVehicle) {
      this.vehicleForm().patchValue({
        licensePlate: existingVehicle.licensePlate,
        mileage: String(existingVehicle.mileage),
        vin: existingVehicle.vin
      });
    }
  }
}
