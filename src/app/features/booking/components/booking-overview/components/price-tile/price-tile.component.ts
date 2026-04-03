import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { i18nKeys, TranslatePipe } from '@core/i18n';

@Component({
  selector: 'app-price-tile',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './price-tile.component.html',
  styleUrl: './price-tile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceTileComponent {
  public readonly totalPriceGross = input.required<string>();

  protected readonly bookingOverview = i18nKeys.booking.bookingOverview;
}
