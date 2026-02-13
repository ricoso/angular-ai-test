import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import type { Brand, BrandDisplay } from '../../models/brand.model';

@Component({
  selector: 'app-brand-buttons',
  standalone: true,
  templateUrl: './brand-buttons.component.html',
  styleUrl: './brand-buttons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandButtonsComponent {
  brands = input.required<BrandDisplay[]>();
  selectedBrand = input<Brand | null>(null);
  brandSelected = output<Brand>();

  protected onClick(brand: BrandDisplay): void {
    this.brandSelected.emit(brand.id);
  }
}
