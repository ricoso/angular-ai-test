import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { i18nKeys, TranslatePipe } from '@core/i18n';

import type { Brand } from '../../models/brand.model';
import { BookingStore } from '../../stores/booking.store';

import { BrandButtonsComponent } from './brand-buttons.component';

@Component({
  selector: 'app-brand-selection-container',
  standalone: true,
  imports: [BrandButtonsComponent, MatButtonModule, MatIconModule, TranslatePipe],
  templateUrl: './brand-selection-container.component.html',
  styleUrl: './brand-selection-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandSelectionContainerComponent {
  private readonly store = inject(BookingStore);
  private readonly router = inject(Router);

  protected readonly booking = i18nKeys.booking;
  protected readonly brands = this.store.brands;
  protected readonly selectedBrand = this.store.selectedBrand;

  protected onBrandSelect(brand: Brand): void {
    this.store.setBrand(brand);
    void this.router.navigate(['/home/location']);
  }

  protected onBack(): void {
    void this.router.navigate(['/']);
  }
}
