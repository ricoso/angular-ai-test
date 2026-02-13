import { Injectable } from '@angular/core';

import { MarkeAnzeige, VERFUEGBARE_MARKEN } from '../models/marke.model';

@Injectable({ providedIn: 'root' })
export class BuchungApiService {

  async holeMarken(): Promise<MarkeAnzeige[]> {
    console.log('[BuchungApiService] holeMarken() → statische Daten');
    return VERFUEGBARE_MARKEN;
  }
}
