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
      title: 'Autohaus GmbH',
      subtitle: 'Fahrzeugauswahl',
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
        appointmentLabel: 'Termin',
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
      },
      appointment: {
        title: 'Wählen Sie den für Sie passenden Tag und Uhrzeit aus',
        calendarLink: 'Hier sehen Sie weitere freie Termine in unserem Werkstattkalender',
        backButton: 'Zurück',
        continueButton: 'Weiter',
        ariaGroupLabel: 'Terminvorschläge',
        navAriaLabel: 'Seitennavigation'
      },
      notes: {
        pageTitle: 'Bitte geben Sie uns weitere Hinweise zu Ihrer Buchung',
        sectionTitle: 'Möchten Sie uns noch etwas zu Ihrer Buchung mitteilen?',
        textareaPlaceholder: 'Bitte tragen Sie hier Ihre Nachricht an uns ein (Hinweise, Buchung weiterer Leistungen, etc.)',
        charCountAriaLabel: '{current} von {max} Zeichen verwendet',
        hintsTitle: 'Wichtige Hinweise zu Ihren ausgewählten Services',
        backButton: 'Zurück',
        continueButton: 'Weiter',
        hints: {
          huau: 'Bitte beachten Sie: Für die HU/AU benötigen Sie alle Fahrzeugpapiere. Stellen Sie sicher, dass Ihr Fahrzeug fahrtüchtig und verkehrssicher ist.',
          inspection: 'Bitte beachten Sie: Bringen Sie Ihr Serviceheft mit. Bei umfangreichen Arbeiten kann ein Ersatzfahrzeug bereitgestellt werden — bitte im Voraus anfragen.',
          tireChange: 'Bitte beachten Sie: Für die Einlagerung Ihrer Reifen bitten wir um Vorabinformation über Reifenanzahl und -größe. Die Einlagerung ist kostenpflichtig.'
        }
      }
    }
  },

  en: {
    app: {
      title: 'Autohaus GmbH',
      subtitle: 'Fahrzeugauswahl',
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
        appointmentLabel: 'Appointment',
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
      },
      appointment: {
        title: 'Select your preferred day and time',
        calendarLink: 'Here you can see more available appointments in our workshop calendar',
        backButton: 'Back',
        continueButton: 'Continue',
        ariaGroupLabel: 'Appointment suggestions',
        navAriaLabel: 'Page navigation'
      },
      notes: {
        pageTitle: 'Please provide further notes for your booking',
        sectionTitle: 'Would you like to tell us anything else about your booking?',
        textareaPlaceholder: 'Please enter your message here (notes, booking of additional services, etc.)',
        charCountAriaLabel: '{current} of {max} characters used',
        hintsTitle: 'Important notes about your selected services',
        backButton: 'Back',
        continueButton: 'Continue',
        hints: {
          huau: 'Please note: For the HU/AU you will need all vehicle documents. Make sure your vehicle is roadworthy and safe to drive.',
          inspection: 'Please note: Please bring your service booklet. For extensive work, a replacement vehicle may be provided — please enquire in advance.',
          tireChange: 'Please note: For tire storage, please inform us in advance about the number and size of tires. Storage is subject to a fee.'
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
