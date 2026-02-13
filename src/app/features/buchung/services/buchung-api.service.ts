import { Injectable } from '@angular/core';

import type { MarkeAnzeige} from '../models/marke.model';
import { VERFUEGBARE_MARKEN } from '../models/marke.model';

/**
 * API Service for booking data
 * Click-Dummy: Returns static data, no real backend
 */
@Injectable({ providedIn: 'root' })
export class BuchungApiService {
  async holeMarken(): Promise<MarkeAnzeige[]> {
    console.log('[BuchungApiService] holeMarken() called');
    return VERFUEGBARE_MARKEN;
  }
}
