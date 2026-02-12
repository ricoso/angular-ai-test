/**
 * Type-safe Translations (TypeScript-only, NO JSON!)
 * Alle UI-Texte sind bilingual (DE + EN)
 *
 * Format: Verschachtelte Objekte (nested) für bessere Typsicherheit
 * Zugriff: translate.instant('app.title') oder translate.instant('header.accessibility.fontSize')
 */
export const translations = {
  de: {
    app: {
      title: 'Gottfried Schultz',
      subtitle: 'Automobilhandels SE',
      skipLink: 'Zum Hauptinhalt springen'
    },

    header: {
      accessibility: {
        button: 'Barrierefreiheit',
        buttonLabel: 'Barrierefreiheit Einstellungen',
        fontSize: {
          label: 'Schriftgröße',
          small: 'Klein',
          normal: 'Normal',
          large: 'Groß',
          xLarge: 'Sehr groß'
        },
        highContrast: 'Hoher Kontrast',
        reducedMotion: 'Reduzierte Bewegung'
      },
      logo: {
        alt: 'Firmenlogo'
      }
    }
  },

  en: {
    app: {
      title: 'Gottfried Schultz',
      subtitle: 'Automobilhandels SE',
      skipLink: 'Skip to main content'
    },

    header: {
      accessibility: {
        button: 'Accessibility',
        buttonLabel: 'Accessibility Settings',
        fontSize: {
          label: 'Font Size',
          small: 'Small',
          normal: 'Normal',
          large: 'Large',
          xLarge: 'Extra Large'
        },
        highContrast: 'High Contrast',
        reducedMotion: 'Reduced Motion'
      },
      logo: {
        alt: 'Company Logo'
      }
    }
  }
} as const;

// Hilfstypes für verschachtelte Keys
type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
          : `${K}`
        : never;
    }[keyof T]
  : never;

export type TranslationKey = NestedKeyOf<typeof translations.de>;
export type Language = keyof typeof translations;

/**
 * Konvertiert alle String-Literals in der Struktur zu `string`
 * Ermöglicht reaktiven Language-Switch ohne Type-Konflikte
 */
type DeepStringify<T> = T extends string
  ? string
  : T extends object
    ? { [K in keyof T]: DeepStringify<T[K]> }
    : T;

/** Type für das Translations-Objekt (für objektorientieren Template-Zugriff) */
export type Translations = DeepStringify<typeof translations.de>;
