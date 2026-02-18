import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

import { i18nKeys, TranslatePipe, TranslateService } from '@app/core/i18n';
import { AVAILABLE_SERVICES } from '@app/features/booking/models/service.model';
import { BookingStore } from '@app/features/booking/stores/booking.store';
import type { FontSize } from '@app/shared/models/accessibility.model';
import { AccessibilityStore } from '@app/shared/stores/accessibility.store';
import { CartStore } from '@app/shared/stores/cart.store';

import { AccessibilityMenuComponent } from './components/accessibility-menu/accessibility-menu.component';
import { CartIconComponent } from './components/cart-icon/cart-icon.component';

/**
 * Container Component for the Application Header
 * Connects AccessibilityStore, CartStore, and BookingStore
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatChipsModule,
    TranslatePipe,
    AccessibilityMenuComponent,
    CartIconComponent
  ],
  templateUrl: './header-container.component.html',
  styleUrl: './header-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderContainerComponent {
  protected readonly accessibilityStore = inject(AccessibilityStore);
  protected readonly cartStore = inject(CartStore);
  protected readonly bookingStore = inject(BookingStore);
  private readonly translateService = inject(TranslateService);

  protected readonly app = i18nKeys.app;
  protected readonly header = i18nKeys.header;

  protected readonly selectedBrandName = computed(() => {
    const brand = this.bookingStore.selectedBrand();
    return brand ? brand.charAt(0).toUpperCase() + brand.slice(1) : null;
  });

  protected readonly selectedLocationName = computed(() => {
    const location = this.bookingStore.selectedLocation();
    return location ? location.name : null;
  });

  protected readonly cartServiceChips = computed(() => {
    const selected = this.bookingStore.selectedServices();
    return selected.map(s => {
      const serviceData = AVAILABLE_SERVICES.find(svc => svc.id === s.serviceId);
      const title = serviceData ? this.translateService.instant(serviceData.titleKey) : s.serviceId;
      const icon = serviceData?.icon ?? 'build';
      let variantLabel: string | null = null;
      if (s.selectedVariantId && serviceData) {
        const variant = serviceData.variants.find(v => v.id === s.selectedVariantId);
        if (variant) {
          variantLabel = this.translateService.instant(variant.labelKey);
        }
      }
      return { title, icon, variantLabel };
    });
  });

  protected readonly cartSummaryText = computed(() => {
    const count = this.bookingStore.selectedServiceCount();
    const template = this.translateService.instant(this.header.cart.summary);
    return template.replace('{count}', `${count}`);
  });

  protected onFontSizeChange(fontSize: FontSize): void {
    this.accessibilityStore.setFontSize(fontSize);
  }

  protected onHighContrastChange(value: boolean): void {
    this.accessibilityStore.setHighContrast(value);
  }

  protected onReducedMotionChange(value: boolean): void {
    this.accessibilityStore.setReducedMotion(value);
  }

  protected onCartOpen(): void {
    // Cart menu opens via matMenuTriggerFor
  }
}
