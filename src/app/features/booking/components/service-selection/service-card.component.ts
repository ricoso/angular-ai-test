import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import { i18nKeys, TranslatePipe } from '@core/i18n';

import type { ServiceDisplay, ServiceType } from '../../models/service.model';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatCheckboxModule, TranslatePipe],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceCardComponent {
  public readonly service = input.required<ServiceDisplay>();
  public readonly isSelected = input<boolean>(false);
  public readonly selectedOptionIds = input<string[]>([]);

  public readonly serviceClicked = output<ServiceType>();
  public readonly serviceConfirmed = output<{ serviceId: ServiceType; optionIds: string[] }>();
  public readonly serviceDeselected = output<ServiceType>();

  protected readonly services = i18nKeys.booking.services;
  protected readonly isExpanded = signal<boolean>(false);
  protected readonly selectedCheckboxOptions = signal<Set<string>>(new Set());

  protected readonly hasOptions = computed(() => this.service().options.length > 0);

  protected readonly hasOptionsChanged = computed(() => {
    const confirmed = this.selectedOptionIds();
    const selected = this.selectedCheckboxOptions();
    if (confirmed.length === 0 || selected.size === 0) return false;
    if (confirmed.length !== selected.size) return true;
    return !confirmed.every((id) => selected.has(id));
  });

  protected readonly showConfirmButton = computed(() => {
    if (!this.hasOptions()) return false;
    if (!this.isExpanded()) return false;
    if (!this.isSelected()) return true;
    return this.hasOptionsChanged();
  });

  protected readonly showDeselectButton = computed(() =>
    this.isSelected() && this.hasOptions() && this.isExpanded() && !this.hasOptionsChanged()
  );

  constructor() {
    effect(() => {
      const optionIds = this.selectedOptionIds();
      if (optionIds.length > 0) {
        this.selectedCheckboxOptions.set(new Set(optionIds));
      }
    });
  }

  protected onCardClick(): void {
    if (this.hasOptions()) {
      this.isExpanded.set(!this.isExpanded());
      return;
    }
    this.serviceClicked.emit(this.service().id);
  }

  protected onCheckboxChange(optionId: string, checked: boolean): void {
    const current = new Set(this.selectedCheckboxOptions());
    if (checked) {
      current.add(optionId);
    } else {
      current.delete(optionId);
    }
    this.selectedCheckboxOptions.set(current);
  }

  protected onConfirm(): void {
    const optionIds = Array.from(this.selectedCheckboxOptions());
    if (optionIds.length > 0) {
      this.serviceConfirmed.emit({ serviceId: this.service().id, optionIds });
    }
  }

  protected onDeselect(): void {
    this.serviceDeselected.emit(this.service().id);
    this.selectedCheckboxOptions.set(new Set());
    this.isExpanded.set(false);
  }
}
