import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { i18nKeys, TranslatePipe } from '@core/i18n';

@Component({
  selector: 'app-service-summary-bar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './service-summary-bar.component.html',
  styleUrl: './service-summary-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceSummaryBarComponent {
  public readonly selectedServiceCount = input.required<number>();
  public readonly hasServicesSelected = input.required<boolean>();

  public readonly continueClicked = output();
  public readonly backClicked = output();

  protected readonly booking = i18nKeys.booking;

  protected onContinue(): void {
    this.continueClicked.emit();
  }

  protected onBack(): void {
    this.backClicked.emit();
  }
}
