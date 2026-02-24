import { computed,Injectable, signal } from '@angular/core';

import type { Language,TranslationKey} from './translations';
import { translations } from './translations';

const LANGUAGE_STORAGE_KEY = 'app-language';
const RTL_LANGUAGES: ReadonlySet<string> = new Set(['ar']);

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
    this.applyDirection(language);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // LocalStorage not available
    }
  }

  /**
   * Returns whether the current language is RTL
   */
  public isRtl(): boolean {
    return RTL_LANGUAGES.has(this.currentLanguage());
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
   * Sets document direction based on language (LTR/RTL)
   */
  private applyDirection(language: Language): void {
    const dir = RTL_LANGUAGES.has(language) ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
  }

  /**
   * Loads language from LocalStorage or uses default
   */
  private loadLanguageFromStorage(): Language {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === 'de' || stored === 'en' || stored === 'uk' || stored === 'fr' || stored === 'ar') {
        return stored;
      }
    } catch {
      // LocalStorage not available
    }
    // Browser language as fallback
    const browserLanguage = navigator.language.toLowerCase();
    if (browserLanguage.startsWith('de')) return 'de';
    if (browserLanguage.startsWith('uk') || browserLanguage.startsWith('ua')) return 'uk';
    if (browserLanguage.startsWith('fr')) return 'fr';
    if (browserLanguage.startsWith('ar')) return 'ar';
    return 'en';
  }
}
