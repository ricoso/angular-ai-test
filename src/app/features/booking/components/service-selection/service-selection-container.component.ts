import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';

import { i18nKeys, TranslatePipe } from '@core/i18n';

import type { ServiceType } from '../../models/service.model';
import { BookingStore } from '../../stores/booking.store';

import { ServiceCardComponent } from './service-card.component';
import { ServiceSummaryBarComponent } from './service-summary-bar.component';

@Component({
  selector: 'app-service-selection-container',
  standalone: true,
  imports: [TranslatePipe, ServiceCardComponent, ServiceSummaryBarComponent],
  templateUrl: './service-selection-container.component.html',
  styleUrl: './service-selection-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceSelectionContainerComponent {
  private readonly store = inject(BookingStore);
  private readonly router = inject(Router);

  protected readonly booking = i18nKeys.booking;
  protected readonly services = this.store.services;
  protected readonly selectedServices = this.store.selectedServices;
  protected readonly hasServicesSelected = this.store.hasServicesSelected;
  protected readonly selectedServiceCount = this.store.selectedServiceCount;

  protected readonly selectedServiceIds = computed(() =>
    this.store.selectedServices().map(s => s.serviceId)
  );

  protected readonly tireChangeVariantId = computed(() => {
    const tireChange = this.store.selectedServices().find(s => s.serviceId === 'tire-change');
    return tireChange?.selectedVariantId ?? null;
  });

  protected onServiceClick(serviceId: ServiceType): void {
    this.store.toggleService(serviceId);
  }

  protected onTireChangeConfirm(variantId: string): void {
    this.store.confirmTireChange(variantId);
  }

  protected onTireChangeDeselect(): void {
    this.store.deselectTireChange();
  }

  protected onContinue(): void {
    console.debug('[ServiceSelection] Continue clicked, services:', this.store.selectedServices());
    void this.router.navigate(['/home/services']);
  }

  protected onBack(): void {
    this.store.clearSelectedServices();
    void this.router.navigate(['/home/location']);
  }
}
