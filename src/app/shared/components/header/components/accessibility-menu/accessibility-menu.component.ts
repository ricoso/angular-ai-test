import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { i18nKeys,TranslatePipe } from '@app/core/i18n';
import type { FontSize } from '@app/shared/models/accessibility.model';

/**
 * Presentational Component for Accessibility Menu
 * Shows font-size radio buttons and toggles for high contrast / reduced motion
 */
@Component({
  selector: 'app-accessibility-menu',
  standalone: true,
  imports: [
    MatRadioModule,
    MatSlideToggleModule,
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './accessibility-menu.component.html',
  styleUrl: './accessibility-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccessibilityMenuComponent {
  protected readonly a11y = i18nKeys.header.accessibility;

  // Inputs (Presentational: input/output only, NO Store!)
  readonly fontSize = input.required<FontSize>();
  readonly highContrast = input.required<boolean>();
  readonly reducedMotion = input.required<boolean>();

  // Outputs
  readonly fontSizeChanged = output<FontSize>();
  readonly highContrastChanged = output<boolean>();
  readonly reducedMotionChanged = output<boolean>();

  // Available font sizes
  protected readonly fontSizes: FontSize[] = ['small', 'normal', 'large', 'x-large'];

  protected onFontSizeChange(size: FontSize): void {
    this.fontSizeChanged.emit(size);
  }

  protected onHighContrastChange(value: boolean): void {
    this.highContrastChanged.emit(value);
  }

  protected onReducedMotionChange(value: boolean): void {
    this.reducedMotionChanged.emit(value);
  }
}
