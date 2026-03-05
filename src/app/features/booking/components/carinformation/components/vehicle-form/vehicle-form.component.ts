import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { i18nKeys, TranslatePipe } from '@core/i18n';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    TranslatePipe
  ],
  templateUrl: './vehicle-form.component.html',
  styleUrl: './vehicle-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleFormComponent {
  public readonly form = input.required<FormGroup>();

  protected readonly t = i18nKeys;

  protected readonly licensePlateErrors = computed(() => {
    const ctrl = this.form().get('licensePlate');
    if (!ctrl || !ctrl.touched || ctrl.valid) { return null; }
    if (ctrl.hasError('required')) { return this.t.booking.carinformation.validation.required; }
    return this.t.booking.carinformation.validation.licensePlate;
  });

  protected readonly mileageErrors = computed(() => {
    const ctrl = this.form().get('mileage');
    if (!ctrl || !ctrl.touched || ctrl.valid) { return null; }
    if (ctrl.hasError('required')) { return this.t.booking.carinformation.validation.required; }
    return this.t.booking.carinformation.validation.mileage;
  });

  protected readonly vinErrors = computed(() => {
    const ctrl = this.form().get('vin');
    if (!ctrl || !ctrl.touched || ctrl.valid) { return null; }
    return this.t.booking.carinformation.validation.vin;
  });

  protected onVinLinkClick(event: Event): void {
    event.preventDefault();
    console.debug('[VehicleForm] VIN explanation link clicked');
  }
}
