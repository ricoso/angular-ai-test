import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { i18nKeys,TranslatePipe } from '@core/i18n';

import type { Marke } from '../../models/marke.model';
import { BuchungStore } from '../../stores/buchung.store';

import { MarkenButtonsComponent } from './marken-buttons.component';

@Component({
  selector: 'app-markenauswahl-container',
  standalone: true,
  imports: [MarkenButtonsComponent, TranslatePipe],
  templateUrl: './markenauswahl-container.component.html',
  styleUrl: './markenauswahl-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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
