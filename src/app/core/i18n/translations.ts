/**
 * Type-safe Translations (TypeScript-only, NO JSON!)
 * Alle UI-Texte sind bilingual (DE + EN)
 */
export const translations = {
  de: {
    // App
    'app.title': 'Gottfried Schultz',
    'app.subtitle': 'Automobilhandels SE',
    'app.skipLink': 'Zum Hauptinhalt springen',

    // Header - Accessibility Menu
    'header.accessibility.button': 'Barrierefreiheit',
    'header.accessibility.buttonLabel': 'Barrierefreiheit Einstellungen',
    'header.accessibility.fontSize': 'Schriftgröße',
    'header.accessibility.fontSize.small': 'Klein',
    'header.accessibility.fontSize.normal': 'Normal',
    'header.accessibility.fontSize.large': 'Groß',
    'header.accessibility.fontSize.xLarge': 'Sehr groß',
    'header.accessibility.highContrast': 'Hoher Kontrast',
    'header.accessibility.reducedMotion': 'Reduzierte Bewegung',

    // Header - Logo
    'header.logo.alt': 'Firmenlogo'
  },
  en: {
    // App
    'app.title': 'Gottfried Schultz',
    'app.subtitle': 'Automobilhandels SE',
    'app.skipLink': 'Skip to main content',

    // Header - Accessibility Menu
    'header.accessibility.button': 'Accessibility',
    'header.accessibility.buttonLabel': 'Accessibility Settings',
    'header.accessibility.fontSize': 'Font Size',
    'header.accessibility.fontSize.small': 'Small',
    'header.accessibility.fontSize.normal': 'Normal',
    'header.accessibility.fontSize.large': 'Large',
    'header.accessibility.fontSize.xLarge': 'Extra Large',
    'header.accessibility.highContrast': 'High Contrast',
    'header.accessibility.reducedMotion': 'Reduced Motion',

    // Header - Logo
    'header.logo.alt': 'Company Logo'
  }
} as const;

export type TranslationKey = keyof typeof translations.de;
export type Language = keyof typeof translations;
