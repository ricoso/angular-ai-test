/**
 * Type-safe Translations (TypeScript-only, NO JSON!)
 * All UI texts are bilingual (DE + EN)
 *
 * Format: Nested objects for better type safety
 * Template: {{ header.cart.button | translate }} (via i18nKeys + TranslatePipe)
 * TypeScript: translateService.instant(i18nKeys.header.cart.button)
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
      cart: {
        button: 'Warenkorb',
        title: 'Warenkorb',
        empty: 'Ihr Warenkorb ist leer',
        placeholder: 'Inhalt wird bald verfügbar',
        summary: 'Sie haben {count} Service(s) ausgewählt',
        brandLabel: 'Marke',
        locationLabel: 'Standort',
        servicesLabel: 'Services',
        badge: {
          ariaLabel: 'Artikel im Warenkorb'
        }
      }
    },

    booking: {
      brand: {
        title: 'Welche Fahrzeugmarke fahren Sie?',
        subtitle: 'Bitte wählen Sie die gewünschte Marke aus.'
      },
      location: {
        title: 'An welchem Standort dürfen wir Sie begrüßen?',
        subtitle: 'Bitte wählen Sie den gewünschten Standort aus.',
        ariaGroupLabel: 'Standorte',
        backButton: 'Zurück'
      },
      services: {
        title: 'Welche Services möchten Sie buchen?',
        subtitle: 'Wählen Sie die gewünschten Services aus.',
        ariaGroupLabel: 'Verfügbare Services',
        continueButton: 'Weiter',
        backButton: 'Zurück',
        huau: {
          title: 'HU/AU',
          description: 'Jetzt Ihren Termin für eine gesetzliche HU/AU vereinbaren!'
        },
        inspection: {
          title: 'Inspektion',
          description: 'Lassen Sie Ihre fällige Inspektion hier durchführen! Buchen Sie jetzt einen Termin.'
        },
        tireChange: {
          title: 'Räderwechsel',
          description: 'Kommen Sie zu uns für Ihren Räderwechsel – inkl. optionaler Einlagerung!',
          withoutStorage: 'Räderwechsel ohne Einlagerung',
          withStorage: 'Räderwechsel mit Einlagerung',
          confirmButton: 'Bestätigen',
          deselectButton: 'Abwählen'
        }
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
      cart: {
        button: 'Shopping Cart',
        title: 'Shopping Cart',
        empty: 'Your cart is empty',
        placeholder: 'Content coming soon',
        summary: 'You have selected {count} service(s)',
        brandLabel: 'Brand',
        locationLabel: 'Location',
        servicesLabel: 'Services',
        badge: {
          ariaLabel: 'items in cart'
        }
      }
    },

    booking: {
      brand: {
        title: 'What vehicle brand do you drive?',
        subtitle: 'Please select your desired brand.'
      },
      location: {
        title: 'At which location may we welcome you?',
        subtitle: 'Please select your desired location.',
        ariaGroupLabel: 'Locations',
        backButton: 'Back'
      },
      services: {
        title: 'Which services would you like to book?',
        subtitle: 'Select the desired services.',
        ariaGroupLabel: 'Available services',
        continueButton: 'Continue',
        backButton: 'Back',
        huau: {
          title: 'HU/AU',
          description: 'Book your appointment for a mandatory HU/AU inspection now!'
        },
        inspection: {
          title: 'Inspection',
          description: 'Have your due inspection carried out here! Book an appointment now.'
        },
        tireChange: {
          title: 'Tire Change',
          description: 'Come to us for your tire change – including optional storage!',
          withoutStorage: 'Tire change without storage',
          withStorage: 'Tire change with storage',
          confirmButton: 'Confirm',
          deselectButton: 'Deselect'
        }
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
