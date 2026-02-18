import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { i18nKeys, TranslatePipe } from '@core/i18n';

import type { LocationDisplay } from '../../models/location.model';

@Component({
  selector: 'app-location-buttons',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './location-buttons.component.html',
  styleUrl: './location-buttons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationButtonsComponent {
  public readonly locations = input.required<LocationDisplay[]>();
  public readonly selectedLocation = input<LocationDisplay | null>(null);
  public readonly locationSelected = output<LocationDisplay>();

  protected readonly booking = i18nKeys.booking;

  protected onClick(location: LocationDisplay): void {
    this.locationSelected.emit(location);
  }
}
