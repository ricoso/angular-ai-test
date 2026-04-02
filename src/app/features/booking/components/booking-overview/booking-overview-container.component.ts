import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { i18nKeys, TranslatePipe, TranslateService } from '@core/i18n';

import { AVAILABLE_BRANDS } from '../../models/brand.model';
import { AVAILABLE_SERVICES } from '../../models/service.model';
import { BookingStore } from '../../stores/booking.store';

import { AppointmentTileComponent } from './components/appointment-tile/appointment-tile.component';
import { PersonalDataTileComponent } from './components/personal-data-tile/personal-data-tile.component';
import { PriceTileComponent } from './components/price-tile/price-tile.component';
import { ServicesTileComponent } from './components/services-tile/services-tile.component';

@Component({
  selector: 'app-booking-overview-container',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
    AppointmentTileComponent,
    ServicesTileComponent,
    PersonalDataTileComponent,
    PriceTileComponent
  ],
  templateUrl: './booking-overview-container.component.html',
  styleUrl: './booking-overview-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookingOverviewContainerComponent {
  private readonly store = inject(BookingStore);
  private readonly router = inject(Router);
  private readonly translateService = inject(TranslateService);

  protected readonly bookingOverview = i18nKeys.booking.bookingOverview;

  protected readonly appointment = this.store.selectedAppointment;
  protected readonly services = this.store.selectedServices;
  protected readonly customerInfo = this.store.customerInfo;
  protected readonly vehicleInfo = this.store.vehicleInfo;

  protected readonly resolvedBrandName = computed(() => {
    const brand = this.store.selectedBrand();
    if (!brand) { return ''; }
    const found = AVAILABLE_BRANDS.find(b => b.id === brand);
    return found?.name ?? brand;
  });

  protected readonly resolvedLocationName = computed(() => {
    const location = this.store.selectedLocation();
    return location?.name ?? '';
  });

  protected readonly resolvedServiceLabels = computed(() => {
    const selected = this.store.selectedServices();
    const labels: Record<string, string> = {};

    for (const service of selected) {
      const serviceDisplay = AVAILABLE_SERVICES.find(s => s.id === service.serviceId);
      if (!serviceDisplay) { continue; }

      let label = this.translateService.instant(serviceDisplay.titleKey);

      if (service.selectedOptionIds.length > 0) {
        const optionLabels = service.selectedOptionIds
          .map(optionId => {
            const option = serviceDisplay.options.find(o => o.id === optionId);
            return option ? this.translateService.instant(option.labelKey) : '';
          })
          .filter(Boolean);
        if (optionLabels.length > 0) {
          label += ' — ' + optionLabels.join(', ');
        }
      }

      labels[service.serviceId] = label;
    }

    return labels;
  });

  protected readonly staticTotalPrice = computed(() =>
    this.translateService.instant(i18nKeys.booking.bookingOverview.tiles.price.staticPrice)
  );

  protected onSubmit(): void {
    this.store.submitBooking();
    console.debug('[BookingOverviewContainer] Booking submitted, navigating to confirmation');
    void this.router.navigate(['/home/booking-overview']);
  }

  protected onBack(): void {
    void this.router.navigate(['/home/carinformation']);
  }
}
