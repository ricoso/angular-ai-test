import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Marke, MarkeAnzeige } from '../../models/marke.model';

@Component({
  selector: 'app-marken-buttons',
  templateUrl: './marken-buttons.component.html',
  styleUrls: ['./marken-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MarkenButtonsComponent {
  readonly marken = input.required<MarkeAnzeige[]>();
  readonly gewaehlteMarke = input<Marke | null>(null);
  readonly markeGewaehlt = output<Marke>();

  protected beimKlick(marke: MarkeAnzeige): void {
    this.markeGewaehlt.emit(marke.id);
  }
}
