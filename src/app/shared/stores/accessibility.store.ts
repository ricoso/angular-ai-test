import { inject } from '@angular/core';
import { signalStore, withState, withMethods, withHooks, patchState } from '@ngrx/signals';
import {
  BarrierefreiheitZustand,
  Schriftgroesse,
  BARRIEREFREIHEIT_STANDARDS
} from '../models/accessibility.model';
import { BarrierefreiheitService } from '../services/accessibility.service';

/**
 * Globaler Store für Accessibility-Einstellungen
 * Verwendet withHooks für onInit, da Accessibility globale App-Config ist
 */
export const BarrierefreiheitStore = signalStore(
  { providedIn: 'root' },

  withState<BarrierefreiheitZustand>(BARRIEREFREIHEIT_STANDARDS),

  withMethods((store, service = inject(BarrierefreiheitService)) => ({
    /**
     * Lädt Einstellungen aus LocalStorage und wendet sie an
     */
    ladeAusSpeicher(): void {
      const einstellungen = service.getEinstellungen();
      patchState(store, einstellungen);
      service.aufDokumentAnwenden(einstellungen);
    },

    /**
     * Setzt die Schriftgröße
     */
    setzeSchriftgroesse(schriftgroesse: Schriftgroesse): void {
      patchState(store, { schriftgroesse });
      const zustand = this.aktuellerZustand();
      service.speichereEinstellungen(zustand);
      service.aufDokumentAnwenden(zustand);
    },

    /**
     * Setzt High Contrast Mode
     */
    setzeHohenKontrast(hoherKontrast: boolean): void {
      patchState(store, { hoherKontrast });
      const zustand = this.aktuellerZustand();
      service.speichereEinstellungen(zustand);
      service.aufDokumentAnwenden(zustand);
    },

    /**
     * Setzt Reduced Motion
     */
    setzeReduzierteBewegung(reduzierteBewegung: boolean): void {
      patchState(store, { reduzierteBewegung });
      const zustand = this.aktuellerZustand();
      service.speichereEinstellungen(zustand);
      service.aufDokumentAnwenden(zustand);
    },

    /**
     * Gibt den aktuellen Zustand als Objekt zurück
     */
    aktuellerZustand(): BarrierefreiheitZustand {
      return {
        schriftgroesse: store.schriftgroesse(),
        hoherKontrast: store.hoherKontrast(),
        reduzierteBewegung: store.reduzierteBewegung()
      };
    }
  })),

  withHooks({
    // onInit ist hier erlaubt, da Accessibility globale App-Config ist
    onInit(store) {
      store.ladeAusSpeicher();
    }
  })
);
