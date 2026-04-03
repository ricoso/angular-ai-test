import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { i18nKeys, TranslatePipe } from '@core/i18n';

import type { BranchConfig } from '../../models/branch-config.model';
import { BRAND_LOGO_MAP } from '../../models/branch-config.model';

export interface EnrichedBranch extends BranchConfig {
  formattedAddress: string;
  brandLogos: { name: string; path: string }[];
}

@Component({
  selector: 'app-location-cards',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './location-cards.component.html',
  styleUrl: './location-cards.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationCardsComponent {
  public readonly branches = input.required<BranchConfig[]>();
  public readonly selectedBranch = input<BranchConfig | null>(null);
  public readonly branchSelected = output<BranchConfig>();

  protected readonly booking = i18nKeys.booking;

  protected readonly enrichedBranches = computed<EnrichedBranch[]>(() =>
    this.branches().map(branch => ({
      ...branch,
      formattedAddress: `${branch.address.street}, ${branch.address.zip} ${branch.address.city}`,
      brandLogos: branch.brands
        .map(name => ({ name, path: BRAND_LOGO_MAP[name] ? `assets/brands/${BRAND_LOGO_MAP[name]}` : '' }))
        .filter(b => b.path !== '')
    }))
  );

  protected onSelect(branch: BranchConfig): void {
    this.branchSelected.emit(branch);
  }
}
