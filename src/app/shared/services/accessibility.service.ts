import { Injectable } from '@angular/core';
import {
  BarrierefreiheitZustand,
  BarrierefreiheitSpeicherDaten,
  Schriftgroesse,
  BARRIEREFREIHEIT_STANDARDS,
  BARRIEREFREIHEIT_STORAGE_KEY,
  BARRIEREFREIHEIT_STORAGE_VERSION
} from '../models/accessibility.model';

/**
 * Service für Accessibility-Einstellungen
 * Kapselt LocalStorage-Zugriffe und DOM-Manipulationen
 */
@Injectable({ providedIn: 'root' })
export class BarrierefreiheitService {
  /**
   * Lädt Einstellungen aus LocalStorage
   * Falls nicht vorhanden, werden Defaults mit System-Präferenz zurückgegeben
   */
  getEinstellungen(): BarrierefreiheitZustand {
    try {
      const gespeichert = localStorage.getItem(BARRIEREFREIHEIT_STORAGE_KEY);
      if (gespeichert) {
        const daten: BarrierefreiheitSpeicherDaten = JSON.parse(gespeichert);
        return {
          schriftgroesse: this.validiereSchriftgroesse(daten.schriftgroesse),
          hoherKontrast: Boolean(daten.hoherKontrast),
          reduzierteBewegung: Boolean(daten.reduzierteBewegung)
        };
      }
    } catch {
      // LocalStorage nicht verfügbar oder Parsing-Fehler
    }

    // Defaults mit System-Präferenz für Reduced Motion
    return {
      ...BARRIEREFREIHEIT_STANDARDS,
      reduzierteBewegung: this.pruefeSystemReducedMotion()
    };
  }

  /**
   * Speichert Einstellungen im LocalStorage
   */
  speichereEinstellungen(zustand: BarrierefreiheitZustand): void {
    try {
      const daten: BarrierefreiheitSpeicherDaten = {
        ...zustand,
        version: BARRIEREFREIHEIT_STORAGE_VERSION
      };
      localStorage.setItem(BARRIEREFREIHEIT_STORAGE_KEY, JSON.stringify(daten));
    } catch {
      // LocalStorage nicht verfügbar (z.B. Private Mode)
      // Fehler wird ignoriert - Einstellungen gelten nur für Session
    }
  }

  /**
   * Wendet Accessibility-Einstellungen auf das HTML-Element an
   */
  aufDokumentAnwenden(zustand: BarrierefreiheitZustand): void {
    const html = document.documentElement;

    // Schriftgröße
    html.setAttribute('data-font-size', zustand.schriftgroesse);

    // Hoher Kontrast
    html.setAttribute('data-high-contrast', String(zustand.hoherKontrast));

    // Reduzierte Bewegung
    if (zustand.reduzierteBewegung) {
      html.classList.add('reduce-motion');
    } else {
      html.classList.remove('reduce-motion');
    }
  }

  /**
   * Prüft System-Präferenz für Reduced Motion
   */
  private pruefeSystemReducedMotion(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Validiert Schriftgröße und gibt Default zurück bei ungültigem Wert
   */
  private validiereSchriftgroesse(wert: unknown): Schriftgroesse {
    const gueltigeWerte: Schriftgroesse[] = ['small', 'normal', 'large', 'x-large'];
    if (typeof wert === 'string' && gueltigeWerte.includes(wert as Schriftgroesse)) {
      return wert as Schriftgroesse;
    }
    return 'normal';
  }
}
