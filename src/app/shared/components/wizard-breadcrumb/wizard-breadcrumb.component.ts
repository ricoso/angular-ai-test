import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { TranslatePipe } from '@core/i18n';

import type { WizardStep, WizardStepStatus } from './wizard-breadcrumb.model';

@Component({
  selector: 'app-wizard-breadcrumb',
  standalone: true,
  imports: [MatIconModule, RouterLink, TranslatePipe],
  templateUrl: './wizard-breadcrumb.component.html',
  styleUrl: './wizard-breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class WizardBreadcrumbComponent {
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
}
