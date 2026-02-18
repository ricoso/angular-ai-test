import { computed,Injectable, signal } from '@angular/core';

import type { Language,TranslationKey} from './translations';
import { translations } from './translations';

const LANGUAGE_STORAGE_KEY = 'app-language';

/**
 * Type-safe TranslateService
 * Uses signals for reactive language switching
 */
@Injectable({ providedIn: 'root' })
export class TranslateService {
  private readonly currentLanguage = signal<Language>(this.loadLanguageFromStorage());

  private readonly currentTranslations = computed(() =>
    translations[this.currentLanguage()]
  );

  /**
   * Returns the translation for a nested dot-separated key
   * e.g. instant('header.warenkorb.titel')
   */
  public instant(key: TranslationKey): string {
    const parts = key.split('.');
    let value: unknown = this.currentTranslations();
    for (const part of parts) {
      if (value && typeof value === 'object') {
        value = (value as Record<string, unknown>)[part];
      } else {
        return key;
      }
    }
    return typeof value === 'string' ? value : key;
  }

  /**
   * Returns a computed signal for reactive templates
   */
  public get(key: TranslationKey): () => string {
    return computed(() => this.instant(key));
  }

  /**
   * Switches the language
   */
  public use(language: Language): void {
    this.currentLanguage.set(language);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // LocalStorage not available
    }
  }

  /**
   * Returns the current language
   */
  public getCurrentLanguage(): Language {
    return this.currentLanguage();
  }

  /**
   * Returns the current language as a signal
   */
  public getLanguageSignal(): () => Language {
    return this.currentLanguage.asReadonly();
  }

  /**
   * Loads language from LocalStorage or uses default
   */
  private loadLanguageFromStorage(): Language {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === 'de' || stored === 'en') {
        return stored;
      }
    } catch {
      // LocalStorage not available
    }
    // Browser language as fallback
    const browserLanguage = navigator.language.toLowerCase();
    return browserLanguage.startsWith('de') ? 'de' : 'en';
  }
}
