import { Injectable, signal, computed } from '@angular/core';
import { translations, TranslationKey, Language } from './translations';

const LANGUAGE_STORAGE_KEY = 'app-language';

/**
 * Hilfsfunktion zum Auflösen von verschachtelten Keys
 * 'header.accessibility.fontSize.label' → translations.de.header.accessibility.fontSize.label
 */
function getNestedValue(obj: unknown, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = (current as Record<string, unknown>)[key];
    } else {
      return undefined;
    }
  }

  return typeof current === 'string' ? current : undefined;
}

/**
 * Type-safe TranslateService
 * Verwendet Signals für reaktive Language-Switching
 * Unterstützt verschachtelte Keys: 'header.accessibility.fontSize.label'
 */
@Injectable({ providedIn: 'root' })
export class TranslateService {
  private readonly aktuelleSprache = signal<Language>(this.ladeSpracheAusSpeicher());

  private readonly aktuelleUebersetzungen = computed(() =>
    translations[this.aktuelleSprache()]
  );

  /**
   * Gibt die Übersetzung für einen Key zurück
   * Unterstützt verschachtelte Keys: 'header.accessibility.fontSize.label'
   */
  instant(key: TranslationKey): string {
    const value = getNestedValue(this.aktuelleUebersetzungen(), key);
    return value ?? key;
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
