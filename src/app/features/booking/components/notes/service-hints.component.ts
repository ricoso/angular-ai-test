import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { i18nKeys, TranslatePipe } from '@core/i18n';

import type { SelectedService } from '../../models/service.model';

import { SERVICE_HINTS } from './notes-hints.constants';

@Component({
  selector: 'app-service-hints',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './service-hints.component.html',
  styleUrl: './service-hints.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceHintsComponent {
  public readonly selectedServices = input.required<SelectedService[]>();

  protected readonly booking = i18nKeys.booking;

  protected readonly visibleHints = computed(() => {
    const selectedIds = this.selectedServices().map(s => s.serviceId);
    return SERVICE_HINTS.filter(hint => selectedIds.includes(hint.serviceId));
  });
}
