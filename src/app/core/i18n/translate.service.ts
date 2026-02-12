import { Injectable, signal, computed } from '@angular/core';
import { translations, Language, Translations } from './translations';

const LANGUAGE_STORAGE_KEY = 'app-language';

/**
 * Type-safe TranslateService
 * Verwendet Signals für reaktive Language-Switching
 *
 * Usage in Components:
 *   protected readonly t = inject(TranslateService).t;
 *
 * Template:
 *   {{ t.app.title }}
 *   {{ t.header.accessibility.fontSize.small }}
 */
@Injectable({ providedIn: 'root' })
export class TranslateService {
  private readonly aktuelleSprache = signal<Language>(this.ladeSpracheAusSpeicher());

  private readonly aktuelleUebersetzungen = computed(() =>
    translations[this.aktuelleSprache()]
  );

  /**
   * Reaktives Translations-Objekt für Templates
   * Proxy ermöglicht direkten Zugriff: t.app.title (ohne Klammern)
   */
  readonly t: Translations = new Proxy({} as Translations, {
    get: (_, prop: string) => (this.aktuelleUebersetzungen() as Record<string, unknown>)[prop]
  });

  /**
   * Direkte Übersetzung für Pipe (Legacy)
   */
  instant(key: string): string {
    return this.getNestedValue(this.aktuelleUebersetzungen(), key) ?? key;
  }

  private getNestedValue(obj: unknown, path: string): string | undefined {
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
    const browserSprache = navigator.language.toLowerCase();
    return browserSprache.startsWith('de') ? 'de' : 'en';
  }
}
