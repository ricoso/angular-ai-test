import { ChangeDetectionStrategy, Component, computed, inject,input, output } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { i18nKeys,TranslateService } from '@app/core/i18n';
import { MAX_BADGE_COUNT } from '@app/shared/models/cart.model';

/**
 * Presentational Component for Cart Icon with Badge
 * Shows shopping_cart icon with item count badge
 */
@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatBadgeModule
  ],
  templateUrl: './cart-icon.component.html',
  styleUrl: './cart-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartIconComponent {
  private readonly translateService = inject(TranslateService);
  private readonly cart = i18nKeys.header.cart;

  // Inputs (Presentational: input/output only, NO Store!)
  public readonly itemCount = input.required<number>();
  public readonly badgeText = input.required<string>();

  // Outputs
  public readonly cartClicked = output();

  // Computed
  protected readonly badgeVisible = computed(() => this.itemCount() > 0);

  protected readonly ariaLabel = computed(() => {
    const count = this.itemCount();
    const buttonLabel = this.translateService.instant(this.cart.button);
    if (count === 0) {
      return buttonLabel;
    }
    const displayCount = count > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : `${count}`;
    const badgeAriaLabel = this.translateService.instant(this.cart.badge.ariaLabel);
    return `${buttonLabel}, ${displayCount} ${badgeAriaLabel}`;
  });

  protected onClick(): void {
    this.cartClicked.emit();
  }
}
