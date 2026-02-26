import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import type { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { i18nKeys, TranslatePipe } from '@core/i18n';
import { startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './vehicle-form.component.html',
  styleUrl: './vehicle-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VehicleFormComponent {
  public readonly form = input.required<FormGroup>();

  protected readonly booking = i18nKeys.booking;

  private readonly formEvents = toSignal(
    toObservable(this.form).pipe(
      switchMap(form => form.events.pipe(startWith(null)))
    ),
    { initialValue: null }
  );

  protected readonly errors = computed(() => {
    this.formEvents();
    const form = this.form();
    return {
      licensePlate: {
        required: this.checkError(form, 'licensePlate', 'required'),
        pattern: this.checkError(form, 'licensePlate', 'pattern'),
      },
      mileage: {
        required: this.checkError(form, 'mileage', 'required'),
        pattern: this.checkError(form, 'mileage', 'pattern'),
      },
      vin: {
        required: this.checkError(form, 'vin', 'required'),
        pattern: this.checkError(form, 'vin', 'pattern'),
      },
    };
  });

  private checkError(form: FormGroup, field: string, error: string): boolean {
    const control = form.get(field);
    return !!(control?.hasError(error) && control.touched);
  }
}
