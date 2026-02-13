import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import type { Marke,MarkeAnzeige } from '../../models/marke.model';

@Component({
  selector: 'app-marken-buttons',
  standalone: true,
  templateUrl: './marken-buttons.component.html',
  styleUrl: './marken-buttons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkenButtonsComponent {
  marken = input.required<MarkeAnzeige[]>();
  gewaehlteMarke = input<Marke | null>(null);
  markeGewaehlt = output<Marke>();

  protected beimKlick(marke: MarkeAnzeige): void {
    this.markeGewaehlt.emit(marke.id);
  }
}
