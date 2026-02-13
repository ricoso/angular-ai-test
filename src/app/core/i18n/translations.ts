/**
 * Type-safe Translations (TypeScript-only, NO JSON!)
 * All UI texts are bilingual (DE + EN)
 *
 * Format: Nested objects for better type safety
 * Template: {{ header.warenkorb.button | translate }} (via i18nKeys + TranslatePipe)
 * TypeScript: translateService.instant(i18nKeys.header.warenkorb.button)
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
      },
      warenkorb: {
        button: 'Warenkorb',
        titel: 'Warenkorb',
        leer: 'Ihr Warenkorb ist leer',
        platzhalter: 'Inhalt wird bald verfügbar',
        badge: {
          ariaLabel: 'Artikel im Warenkorb'
        }
      }
    },

    booking: {
      brand: {
        title: 'Welche Fahrzeugmarke fahren Sie?',
        subtitle: 'Bitte wählen Sie die gewünschte Marke aus.'
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
      },
      warenkorb: {
        button: 'Shopping Cart',
        titel: 'Shopping Cart',
        leer: 'Your cart is empty',
        platzhalter: 'Content coming soon',
        badge: {
          ariaLabel: 'items in cart'
        }
      }
    },

    booking: {
      brand: {
        title: 'What vehicle brand do you drive?',
        subtitle: 'Please select your desired brand.'
      }
    }
  }
} as const;

// Helper types for nested keys
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
 * Key tree: Mirrors the translation structure, but leaf values are dot-separated key paths
 * Enables object-oriented access: i18nKeys.header.warenkorb.button → 'header.warenkorb.button'
 */
type KeyTree<T, P extends string = ''> = {
  readonly [K in keyof T]: T[K] extends Record<string, unknown>
    ? KeyTree<T[K], P extends '' ? K & string : `${P}.${K & string}`>
    : P extends '' ? K & string : `${P}.${K & string}`;
};

function createKeyTree<T extends Record<string, unknown>>(
  obj: T, prefix = ''
): KeyTree<T> {
  const result = {} as Record<string, unknown>;
  for (const key of Object.keys(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[key] = createKeyTree(value as Record<string, unknown>, path);
    } else {
      result[key] = path;
    }
  }
  return result as KeyTree<T>;
}

/** Object-oriented key access: i18nKeys.header.warenkorb.button → 'header.warenkorb.button' */
export const i18nKeys = createKeyTree(translations.de);
