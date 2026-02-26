import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import type { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { i18nKeys, TranslatePipe } from '@core/i18n';
import { startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './customer-form.component.html',
  styleUrl: './customer-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerFormComponent {
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
      email: {
        required: this.checkError(form, 'email', 'required'),
        email: this.checkError(form, 'email', 'email'),
      },
      salutation: {
        required: this.checkError(form, 'salutation', 'required'),
      },
      firstName: {
        required: this.checkError(form, 'firstName', 'required'),
        pattern: this.checkError(form, 'firstName', 'pattern'),
      },
      lastName: {
        required: this.checkError(form, 'lastName', 'required'),
        pattern: this.checkError(form, 'lastName', 'pattern'),
      },
      street: {
        required: this.checkError(form, 'street', 'required'),
      },
      postalCode: {
        required: this.checkError(form, 'postalCode', 'required'),
        pattern: this.checkError(form, 'postalCode', 'pattern'),
      },
      city: {
        required: this.checkError(form, 'city', 'required'),
        pattern: this.checkError(form, 'city', 'pattern'),
      },
      mobilePhone: {
        required: this.checkError(form, 'mobilePhone', 'required'),
        pattern: this.checkError(form, 'mobilePhone', 'pattern'),
      },
    };
  });

  private checkError(form: FormGroup, field: string, error: string): boolean {
    const control = form.get(field);
    return !!(control?.hasError(error) && control.touched);
  }
}
