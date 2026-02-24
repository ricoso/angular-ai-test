/**
 * Type-safe Translations (TypeScript-only, NO JSON!)
 * All UI texts are multilingual (DE + EN + UK + FR)
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
        reducedMotion: 'Reduzierte Bewegung',
        language: {
          label: 'Sprache'
        }
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
        reducedMotion: 'Reduced Motion',
        language: {
          label: 'Language'
        }
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
  },

  uk: {
    app: {
      title: 'Autohaus GmbH',
      subtitle: 'Fahrzeugauswahl',
      skipLink: 'Перейти до основного вмісту'
    },

    header: {
      accessibility: {
        button: 'Доступність',
        buttonLabel: 'Налаштування доступності',
        fontSize: {
          label: 'Розмір шрифту',
          small: 'Малий',
          normal: 'Звичайний',
          large: 'Великий',
          xLarge: 'Дуже великий'
        },
        highContrast: 'Високий контраст',
        reducedMotion: 'Зменшена анімація',
        language: {
          label: 'Мова'
        }
      },
      logo: {
        alt: 'Логотип компанії'
      },
      cart: {
        button: 'Кошик',
        title: 'Кошик',
        empty: 'Ваш кошик порожній',
        placeholder: 'Вміст незабаром буде доступний',
        summary: 'Ви обрали {count} послуг(у)',
        brandLabel: 'Марка',
        locationLabel: 'Місцезнаходження',
        servicesLabel: 'Послуги',
        appointmentLabel: 'Запис',
        badge: {
          ariaLabel: 'товарів у кошику'
        }
      }
    },

    booking: {
      brand: {
        title: 'Яку марку автомобіля ви водите?',
        subtitle: 'Будь ласка, оберіть бажану марку.'
      },
      location: {
        title: 'В якому місці ми можемо вас привітати?',
        subtitle: 'Будь ласка, оберіть бажане місцезнаходження.',
        ariaGroupLabel: 'Місцезнаходження',
        backButton: 'Назад'
      },
      services: {
        title: 'Які послуги ви хочете замовити?',
        subtitle: 'Оберіть бажані послуги.',
        ariaGroupLabel: 'Доступні послуги',
        continueButton: 'Далі',
        backButton: 'Назад',
        huau: {
          title: 'ТО/ТА',
          description: 'Запишіться зараз на обов\'язковий технічний огляд!'
        },
        inspection: {
          title: 'Інспекція',
          description: 'Проведіть заплановану інспекцію тут! Запишіться зараз.'
        },
        tireChange: {
          title: 'Заміна коліс',
          description: 'Завітайте до нас для заміни коліс – включно з опціональним зберіганням!',
          withoutStorage: 'Заміна коліс без зберігання',
          withStorage: 'Заміна коліс зі зберіганням',
          confirmButton: 'Підтвердити',
          deselectButton: 'Скасувати вибір'
        }
      },
      appointment: {
        title: 'Оберіть зручний для вас день та час',
        calendarLink: 'Тут ви можете побачити більше вільних записів у нашому календарі майстерні',
        backButton: 'Назад',
        continueButton: 'Далі',
        ariaGroupLabel: 'Пропозиції записів',
        navAriaLabel: 'Навігація по сторінках'
      },
      notes: {
        pageTitle: 'Будь ласка, надайте додаткові примітки до вашого запису',
        sectionTitle: 'Чи хочете ви повідомити нам щось ще про ваш запис?',
        textareaPlaceholder: 'Будь ласка, введіть ваше повідомлення тут (примітки, бронювання додаткових послуг тощо)',
        charCountAriaLabel: '{current} з {max} символів використано',
        hintsTitle: 'Важливі примітки щодо обраних послуг',
        backButton: 'Назад',
        continueButton: 'Далі',
        hints: {
          huau: 'Зверніть увагу: Для ТО/ТА вам знадобляться всі документи на автомобіль. Переконайтеся, що ваш автомобіль справний та безпечний для руху.',
          inspection: 'Зверніть увагу: Візьміть з собою сервісну книжку. При масштабних роботах може бути надано підмінний автомобіль — запитуйте заздалегідь.',
          tireChange: 'Зверніть увагу: Для зберігання шин просимо заздалегідь повідомити про кількість та розмір шин. Зберігання є платним.'
        }
      }
    }
  },

  fr: {
    app: {
      title: 'Autohaus GmbH',
      subtitle: 'Fahrzeugauswahl',
      skipLink: 'Aller au contenu principal'
    },

    header: {
      accessibility: {
        button: 'Accessibilité',
        buttonLabel: 'Paramètres d\'accessibilité',
        fontSize: {
          label: 'Taille de police',
          small: 'Petite',
          normal: 'Normale',
          large: 'Grande',
          xLarge: 'Très grande'
        },
        highContrast: 'Contraste élevé',
        reducedMotion: 'Animation réduite',
        language: {
          label: 'Langue'
        }
      },
      logo: {
        alt: 'Logo de l\'entreprise'
      },
      cart: {
        button: 'Panier',
        title: 'Panier',
        empty: 'Votre panier est vide',
        placeholder: 'Contenu bientôt disponible',
        summary: 'Vous avez sélectionné {count} service(s)',
        brandLabel: 'Marque',
        locationLabel: 'Emplacement',
        servicesLabel: 'Services',
        appointmentLabel: 'Rendez-vous',
        badge: {
          ariaLabel: 'articles dans le panier'
        }
      }
    },

    booking: {
      brand: {
        title: 'Quelle marque de véhicule conduisez-vous ?',
        subtitle: 'Veuillez sélectionner la marque souhaitée.'
      },
      location: {
        title: 'À quel emplacement pouvons-nous vous accueillir ?',
        subtitle: 'Veuillez sélectionner l\'emplacement souhaité.',
        ariaGroupLabel: 'Emplacements',
        backButton: 'Retour'
      },
      services: {
        title: 'Quels services souhaitez-vous réserver ?',
        subtitle: 'Sélectionnez les services souhaités.',
        ariaGroupLabel: 'Services disponibles',
        continueButton: 'Continuer',
        backButton: 'Retour',
        huau: {
          title: 'CT/CTA',
          description: 'Prenez rendez-vous maintenant pour un contrôle technique obligatoire !'
        },
        inspection: {
          title: 'Inspection',
          description: 'Faites réaliser votre inspection ici ! Prenez rendez-vous maintenant.'
        },
        tireChange: {
          title: 'Changement de pneus',
          description: 'Venez chez nous pour votre changement de pneus – stockage optionnel inclus !',
          withoutStorage: 'Changement de pneus sans stockage',
          withStorage: 'Changement de pneus avec stockage',
          confirmButton: 'Confirmer',
          deselectButton: 'Désélectionner'
        }
      },
      appointment: {
        title: 'Sélectionnez le jour et l\'heure qui vous conviennent',
        calendarLink: 'Consultez ici d\'autres créneaux disponibles dans notre calendrier d\'atelier',
        backButton: 'Retour',
        continueButton: 'Continuer',
        ariaGroupLabel: 'Propositions de rendez-vous',
        navAriaLabel: 'Navigation par page'
      },
      notes: {
        pageTitle: 'Veuillez fournir des remarques supplémentaires pour votre réservation',
        sectionTitle: 'Souhaitez-vous nous communiquer autre chose concernant votre réservation ?',
        textareaPlaceholder: 'Veuillez saisir votre message ici (remarques, réservation de services supplémentaires, etc.)',
        charCountAriaLabel: '{current} sur {max} caractères utilisés',
        hintsTitle: 'Remarques importantes concernant vos services sélectionnés',
        backButton: 'Retour',
        continueButton: 'Continuer',
        hints: {
          huau: 'Veuillez noter : Pour le CT/CTA, vous aurez besoin de tous les documents du véhicule. Assurez-vous que votre véhicule est en état de rouler et sûr.',
          inspection: 'Veuillez noter : Apportez votre carnet d\'entretien. Pour des travaux importants, un véhicule de remplacement peut être fourni — veuillez vous renseigner à l\'avance.',
          tireChange: 'Veuillez noter : Pour le stockage des pneus, veuillez nous informer à l\'avance du nombre et de la taille des pneus. Le stockage est payant.'
        }
      }
    }
  },

  ar: {
    app: {
      title: 'Autohaus GmbH',
      subtitle: 'Fahrzeugauswahl',
      skipLink: 'انتقل إلى المحتوى الرئيسي'
    },

    header: {
      accessibility: {
        button: 'إمكانية الوصول',
        buttonLabel: 'إعدادات إمكانية الوصول',
        fontSize: {
          label: 'حجم الخط',
          small: 'صغير',
          normal: 'عادي',
          large: 'كبير',
          xLarge: 'كبير جداً'
        },
        highContrast: 'تباين عالٍ',
        reducedMotion: 'تقليل الحركة',
        language: {
          label: 'اللغة'
        }
      },
      logo: {
        alt: 'شعار الشركة'
      },
      cart: {
        button: 'سلة التسوق',
        title: 'سلة التسوق',
        empty: 'سلة التسوق فارغة',
        placeholder: 'المحتوى سيكون متاحاً قريباً',
        summary: 'لقد اخترت {count} خدمة/خدمات',
        brandLabel: 'العلامة التجارية',
        locationLabel: 'الموقع',
        servicesLabel: 'الخدمات',
        appointmentLabel: 'الموعد',
        badge: {
          ariaLabel: 'عناصر في سلة التسوق'
        }
      }
    },

    booking: {
      brand: {
        title: 'ما هي ماركة سيارتك؟',
        subtitle: 'يرجى اختيار العلامة التجارية المطلوبة.'
      },
      location: {
        title: 'في أي موقع يمكننا استقبالك؟',
        subtitle: 'يرجى اختيار الموقع المطلوب.',
        ariaGroupLabel: 'المواقع',
        backButton: 'رجوع'
      },
      services: {
        title: 'ما هي الخدمات التي ترغب في حجزها؟',
        subtitle: 'اختر الخدمات المطلوبة.',
        ariaGroupLabel: 'الخدمات المتاحة',
        continueButton: 'متابعة',
        backButton: 'رجوع',
        huau: {
          title: 'الفحص الفني',
          description: 'احجز موعدك الآن للفحص الفني الإلزامي!'
        },
        inspection: {
          title: 'التفتيش',
          description: 'قم بإجراء التفتيش المستحق هنا! احجز موعداً الآن.'
        },
        tireChange: {
          title: 'تغيير الإطارات',
          description: 'تعال إلينا لتغيير الإطارات – مع إمكانية التخزين الاختياري!',
          withoutStorage: 'تغيير الإطارات بدون تخزين',
          withStorage: 'تغيير الإطارات مع تخزين',
          confirmButton: 'تأكيد',
          deselectButton: 'إلغاء الاختيار'
        }
      },
      appointment: {
        title: 'اختر اليوم والوقت المناسبين لك',
        calendarLink: 'هنا يمكنك رؤية المزيد من المواعيد المتاحة في تقويم الورشة',
        backButton: 'رجوع',
        continueButton: 'متابعة',
        ariaGroupLabel: 'اقتراحات المواعيد',
        navAriaLabel: 'التنقل بين الصفحات'
      },
      notes: {
        pageTitle: 'يرجى تقديم ملاحظات إضافية لحجزك',
        sectionTitle: 'هل تود إخبارنا بشيء آخر بخصوص حجزك؟',
        textareaPlaceholder: 'يرجى إدخال رسالتك هنا (ملاحظات، حجز خدمات إضافية، إلخ)',
        charCountAriaLabel: '{current} من {max} حرف مستخدم',
        hintsTitle: 'ملاحظات مهمة حول الخدمات المختارة',
        backButton: 'رجوع',
        continueButton: 'متابعة',
        hints: {
          huau: 'يرجى ملاحظة: للفحص الفني ستحتاج إلى جميع وثائق السيارة. تأكد من أن سيارتك صالحة للقيادة وآمنة.',
          inspection: 'يرجى ملاحظة: أحضر دفتر الصيانة. للأعمال الكبيرة، يمكن توفير سيارة بديلة — يرجى الاستفسار مسبقاً.',
          tireChange: 'يرجى ملاحظة: لتخزين الإطارات، يرجى إبلاغنا مسبقاً بعدد وحجم الإطارات. التخزين مقابل رسوم.'
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
 * Language display configuration
 * Each language shown in its native name with flag emoji
 */
export interface LanguageOption {
  code: Language;
  label: string;
}

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
  { code: 'uk', label: 'Українська' },
  { code: 'fr', label: 'Français' },
  { code: 'ar', label: 'العربية' }
];

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
