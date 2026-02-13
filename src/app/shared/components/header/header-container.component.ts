import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe, i18nKeys } from '@app/core/i18n';
import { AccessibilityStore } from '@app/shared/stores/accessibility.store';
import { CartStore } from '@app/shared/stores/cart.store';
import { FontSize } from '@app/shared/models/accessibility.model';
import { AccessibilityMenuComponent } from './components/accessibility-menu/accessibility-menu.component';
import { CartIconComponent } from './components/cart-icon/cart-icon.component';

/**
 * Container Component for the Application Header
 * Connects AccessibilityStore and CartStore
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
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

  protected readonly app = i18nKeys.app;
  protected readonly header = i18nKeys.header;

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
    // Placeholder — will be extended later
  }
}
