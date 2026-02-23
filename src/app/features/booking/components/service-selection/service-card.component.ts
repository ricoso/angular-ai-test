import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

import { i18nKeys, TranslatePipe } from '@core/i18n';

import type { ServiceDisplay, ServiceType } from '../../models/service.model';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatRadioModule, TranslatePipe],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceCardComponent {
  public readonly service = input.required<ServiceDisplay>();
  public readonly isSelected = input<boolean>(false);
  public readonly tireChangeVariantId = input<string | null>(null);

  public readonly serviceClicked = output<ServiceType>();
  public readonly tireChangeConfirmed = output<string>();
  public readonly tireChangeDeselected = output();

  protected readonly tireChange = i18nKeys.booking.services.tireChange;
  protected readonly selectedRadioVariant = signal<string | null>(null);

  protected readonly hasTireChangeVariants = computed(() => this.service().variants.length > 0);

  protected readonly isTireChangeSelected = computed(() =>
    this.isSelected() && this.hasTireChangeVariants()
  );

  protected readonly confirmedVariantId = computed(() => this.tireChangeVariantId());

  protected readonly hasVariantChanged = computed(() => {
    const confirmed = this.confirmedVariantId();
    const selected = this.selectedRadioVariant();
    if (!confirmed || !selected) return false;
    return confirmed !== selected;
  });

  protected readonly showConfirmButton = computed(() => {
    if (!this.hasTireChangeVariants()) return false;
    if (!this.isSelected()) return true;
    return this.hasVariantChanged();
  });

  protected readonly showDeselectButton = computed(() =>
    this.isTireChangeSelected() && !this.hasVariantChanged()
  );

  protected onCardClick(): void {
    if (this.hasTireChangeVariants()) return;
    this.serviceClicked.emit(this.service().id);
  }

  protected onRadioChange(variantId: string): void {
    this.selectedRadioVariant.set(variantId);
  }

  protected onConfirm(): void {
    const variantId = this.selectedRadioVariant();
    if (variantId) {
      this.tireChangeConfirmed.emit(variantId);
    }
  }

  protected onDeselect(): void {
    this.tireChangeDeselected.emit();
    this.selectedRadioVariant.set(null);
  }
}
