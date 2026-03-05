import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { i18nKeys, TranslatePipe } from '@core/i18n';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    TranslatePipe
  ],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerFormComponent {
  public readonly form = input.required<FormGroup>();

  protected readonly t = i18nKeys;

  protected readonly emailErrors = computed(() => {
    const ctrl = this.form().get('email');
    if (!ctrl || !ctrl.touched || ctrl.valid) { return null; }
    if (ctrl.hasError('required')) { return this.t.booking.carinformation.validation.required; }
    if (ctrl.hasError('email')) { return this.t.booking.carinformation.validation.email; }
    return null;
  });

  protected readonly firstNameErrors = computed(() => {
    const ctrl = this.form().get('firstName');
    if (!ctrl || !ctrl.touched || ctrl.valid) { return null; }
    if (ctrl.hasError('required')) { return this.t.booking.carinformation.validation.required; }
    if (ctrl.hasError('pattern')) { return this.t.booking.carinformation.validation.lettersOnly; }
    return null;
  });

  protected readonly lastNameErrors = computed(() => {
    const ctrl = this.form().get('lastName');
    if (!ctrl || !ctrl.touched || ctrl.valid) { return null; }
    if (ctrl.hasError('required')) { return this.t.booking.carinformation.validation.required; }
    if (ctrl.hasError('pattern')) { return this.t.booking.carinformation.validation.lettersOnly; }
    return null;
  });

  protected readonly streetErrors = computed(() => {
    const ctrl = this.form().get('street');
    if (!ctrl || !ctrl.touched || ctrl.valid) { return null; }
    return this.t.booking.carinformation.validation.required;
  });

  protected readonly postalCodeErrors = computed(() => {
    const ctrl = this.form().get('postalCode');
    if (!ctrl || !ctrl.touched || ctrl.valid) { return null; }
    if (ctrl.hasError('required')) { return this.t.booking.carinformation.validation.required; }
    return this.t.booking.carinformation.validation.postalCode;
  });

  protected readonly cityErrors = computed(() => {
    const ctrl = this.form().get('city');
    if (!ctrl || !ctrl.touched || ctrl.valid) { return null; }
    if (ctrl.hasError('required')) { return this.t.booking.carinformation.validation.required; }
    if (ctrl.hasError('pattern')) { return this.t.booking.carinformation.validation.lettersOnly; }
    return null;
  });

  protected readonly mobilePhoneErrors = computed(() => {
    const ctrl = this.form().get('mobilePhone');
    if (!ctrl || !ctrl.touched || ctrl.valid) { return null; }
    if (ctrl.hasError('required')) { return this.t.booking.carinformation.validation.required; }
    if (ctrl.hasError('pattern')) { return this.t.booking.carinformation.validation.startsWithZero; }
    return null;
  });
}
