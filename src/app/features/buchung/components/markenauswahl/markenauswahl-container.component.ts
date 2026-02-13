import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { TranslatePipe, i18nKeys } from '@core/i18n';

import { Marke } from '../../models/marke.model';
import { BuchungStore } from '../../stores/buchung.store';
import { MarkenButtonsComponent } from './marken-buttons.component';

@Component({
  selector: 'app-markenauswahl-container',
  templateUrl: './markenauswahl-container.component.html',
  styleUrls: ['./markenauswahl-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslatePipe, MarkenButtonsComponent]
})
export class MarkenauswahlContainerComponent {
  private readonly store = inject(BuchungStore);
  private readonly router = inject(Router);

  protected readonly buchung = i18nKeys.buchung;
  protected readonly marken = this.store.marken;
  protected readonly gewaehlteMarke = this.store.gewaehlteMarke;

  protected beimMarkeWaehlen(marke: Marke): void {
    this.store.setzeMarke(marke);
    this.router.navigate(['/buchung/standort']);
  }
}
