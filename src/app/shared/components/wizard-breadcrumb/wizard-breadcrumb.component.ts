import { ChangeDetectionStrategy, Component, computed, inject, input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { TranslatePipe } from '@core/i18n';

import { BookingStore } from '../../../features/booking/stores/booking.store';

import type { WizardStep, WizardStepStatus } from './wizard-breadcrumb.model';

@Component({
  selector: 'app-wizard-breadcrumb',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './wizard-breadcrumb.component.html',
  styleUrl: './wizard-breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class WizardBreadcrumbComponent {
  private readonly store = inject(BookingStore);
  private readonly router = inject(Router);

  public readonly steps = input.required<WizardStep[]>();
  public readonly activeIndex = input.required<number>();

  protected readonly stepsWithStatus = computed(() => {
    const active = this.activeIndex();
    return this.steps().map((step, i) => {
      let status: WizardStepStatus;
      if (i < active) {
        status = 'done';
      } else if (i === active) {
        status = 'active';
      } else {
        status = 'future';
      }
      return { ...step, status, isLast: i === this.steps().length - 1 };
    });
  });

  protected onStepClick(event: Event, targetIndex: number): void {
    event.preventDefault();
    const step = this.stepsWithStatus()[targetIndex];
    if (step.status !== 'done') { return; }

    this.store.resetFromStep(targetIndex);
    void this.router.navigate([step.route]);
  }
}
