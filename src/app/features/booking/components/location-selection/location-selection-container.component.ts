import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { i18nKeys, TranslatePipe } from '@core/i18n';

import type { LocationDisplay } from '../../models/location.model';
import { BookingStore } from '../../stores/booking.store';

import { LocationButtonsComponent } from './location-buttons.component';

@Component({
  selector: 'app-location-selection-container',
  standalone: true,
  imports: [LocationButtonsComponent, TranslatePipe],
  templateUrl: './location-selection-container.component.html',
  styleUrl: './location-selection-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationSelectionContainerComponent {
  private readonly store = inject(BookingStore);
  private readonly router = inject(Router);

  protected readonly booking = i18nKeys.booking;
  protected readonly locations = this.store.filteredLocations;
  protected readonly selectedLocation = this.store.selectedLocation;

  protected onLocationSelect(location: LocationDisplay): void {
    this.store.setLocation(location);
    void this.router.navigate(['/home/services']);
  }
}
