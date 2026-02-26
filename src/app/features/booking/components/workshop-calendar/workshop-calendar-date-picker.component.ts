import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { i18nKeys, TranslatePipe } from '@core/i18n';

@Component({
  selector: 'app-workshop-calendar-date-picker',
  standalone: true,
  imports: [
    TranslatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule
  ],
  templateUrl: './workshop-calendar-date-picker.component.html',
  styleUrl: './workshop-calendar-date-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkshopCalendarDatePickerComponent {
  public readonly selectedDate = input<string | null>(null);
  public readonly dateSelected = output<Date>();

  protected readonly booking = i18nKeys.booking;
  protected readonly today = new Date();

  protected onDateChange(date: Date | null): void {
    if (date) {
      this.dateSelected.emit(date);
    }
  }
}
