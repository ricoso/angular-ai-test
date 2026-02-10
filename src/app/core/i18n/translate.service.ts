import { Injectable, signal, computed } from '@angular/core';
import { translations, TranslationKey, Language } from './translations';

const LANGUAGE_STORAGE_KEY = 'app-language';

/**
 * Type-safe TranslateService
 * Verwendet Signals für reaktive Language-Switching
 */
@Injectable({ providedIn: 'root' })
export class TranslateService {
  private readonly aktuelleSprache = signal<Language>(this.ladeSpracheAusSpeicher());

  private readonly aktuelleUebersetzungen = computed(() =>
    translations[this.aktuelleSprache()]
  );

  /**
   * Gibt die Übersetzung für einen Key zurück
   */
  instant(key: TranslationKey): string {
    return this.aktuelleUebersetzungen()[key] || key;
  }

  /**
   * Gibt ein computed Signal für reaktive Templates zurück
   */
  get(key: TranslationKey): () => string {
    return computed(() => this.instant(key));
  }

  /**
   * Wechselt die Sprache
   */
  use(sprache: Language): void {
    this.aktuelleSprache.set(sprache);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, sprache);
    } catch {
      // LocalStorage nicht verfügbar
    }
  }

  /**
   * Gibt die aktuelle Sprache zurück
   */
  getAktuelleSprache(): Language {
    return this.aktuelleSprache();
  }

  /**
   * Gibt die aktuelle Sprache als Signal zurück
   */
  getSpracheSignal(): () => Language {
    return this.aktuelleSprache.asReadonly();
  }

  /**
   * Lädt die Sprache aus dem LocalStorage oder verwendet Default
   */
  private ladeSpracheAusSpeicher(): Language {
    try {
      const gespeichert = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (gespeichert === 'de' || gespeichert === 'en') {
        return gespeichert;
      }
    } catch {
      // LocalStorage nicht verfügbar
    }
    // Browser-Sprache als Fallback
    const browserSprache = navigator.language.toLowerCase();
    return browserSprache.startsWith('de') ? 'de' : 'en';
  }
}
