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
      workshopCalendar: {
        title: 'Hier sehen Sie weitere freie Termine in unserem Werkstattkalender',
        description: 'Wählen Sie Ihren Wunschtermin. Wir zeigen Ihnen alle freien Termine ab diesem Tag an.',
        desiredDateLabel: 'Ihr Wunschtermin:',
        datePlaceholder: 'Wunschtermin wählen',
        hintBefore: 'Wählen Sie im Kalender einen gewünschten Termin aus und wir zeigen Ihnen die nächsten verfügbaren Termine',
        hintAfter: 'Wir haben folgende ab dem von Ihnen ausgewählten Datum verfügbaren Termine für Sie gefunden. Klicken Sie auf eine Uhrzeit, um den Termin auszuwählen.',
        dateInputAriaLabel: 'Wunschtermin eingeben im Format TT.MM.JJJJ',
        slotsAriaLabel: 'Verfügbare Uhrzeiten',
        backButton: 'Zurück',
        continueButton: 'Weiter',
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
      },
      carinformation: {
        title: 'Bitte geben Sie uns letzte Informationen rund um Ihren Termin',
        returningCustomer: {
          title: 'Schon einmal bei uns gewesen?',
          description: 'Dann rufen Sie Ihre Daten automatisch mit Eingabe Ihrer E-Mail-Adresse ab.',
          button: 'Jetzt Daten abrufen!'
        },
        form: {
          customerTitle: 'Ihre Daten',
          vehicleTitle: 'Fahrzeugdaten',
          email: { label: 'E-Mail Adresse', placeholder: 'max@mustermann.de',
            error: { required: 'Bitte geben Sie Ihre E-Mail-Adresse ein.', invalid: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' } },
          salutation: { label: 'Anrede', placeholder: 'Bitte wählen', mr: 'Herr', ms: 'Frau',
            error: { required: 'Bitte wählen Sie eine Anrede.' } },
          firstName: { label: 'Vorname', placeholder: 'Max',
            error: { required: 'Bitte geben Sie Ihren Vornamen ein.', lettersOnly: 'Vorname darf nur Buchstaben enthalten.' } },
          lastName: { label: 'Nachname', placeholder: 'Mustermann',
            error: { required: 'Bitte geben Sie Ihren Nachnamen ein.', lettersOnly: 'Nachname darf nur Buchstaben enthalten.' } },
          street: { label: 'Straße und Haus Nr.', placeholder: 'Musterweg 1',
            error: { required: 'Bitte geben Sie Ihre Straße und Hausnummer ein.' } },
          postalCode: { label: 'Postleitzahl', placeholder: '30159',
            error: { required: 'Bitte geben Sie Ihre Postleitzahl ein.', digitsOnly: 'Postleitzahl darf nur Zahlen enthalten.' } },
          city: { label: 'Wohnort', placeholder: 'Berlin',
            error: { required: 'Bitte geben Sie Ihren Wohnort ein.', lettersOnly: 'Wohnort darf nur Buchstaben enthalten.' } },
          mobilePhone: { label: 'Mobilfunknummer', placeholder: '017012345678',
            hint: 'Bitte geben Sie Ihre Mobilfunknummer ohne Sonderzeichen als Zahl im Format 017012345678 ein.',
            error: { required: 'Bitte geben Sie Ihre Mobilfunknummer ein.', digitsOnly: 'Mobilfunknummer darf nur Zahlen enthalten.', startsWithZero: 'Die Mobilfunknummer muss mit 0 beginnen.' } },
          licensePlate: { label: 'Kfz. Kennzeichen', placeholder: 'XX-XX1234',
            error: { required: 'Bitte geben Sie Ihr Kfz-Kennzeichen ein.', invalidFormat: 'Bitte geben Sie ein gültiges Kennzeichen ein (z.B. B-MS1234).' } },
          mileage: { label: 'Kilometerstand', placeholder: '5000',
            error: { required: 'Bitte geben Sie den Kilometerstand ein.', digitsOnly: 'Kilometerstand darf nur Zahlen enthalten.' } },
          vin: { label: 'FIN', placeholder: 'WDB8XXXXXXA123456', infoLink: 'Erklärung der FIN',
            error: { required: 'Bitte geben Sie die Fahrzeugidentifikationsnummer ein.', invalidLength: 'Die FIN muss genau 17 Zeichen enthalten.', invalidFormat: 'Die FIN darf nur Buchstaben und Zahlen enthalten.' } },
          privacy: { consent: 'Ich willige in die Verarbeitung meiner personenbezogenen Daten zum Zwecke der Online-Terminvereinbarung ein. Näheres finden Sie in unserer',
            privacyLink: 'Datenschutzerklärung',
            error: { required: 'Bitte bestätigen Sie die Datenschutzerklärung.' } },
          requiredHint: 'Pflichtfelder sind mit * gekennzeichnet'
        },
        navigation: { back: 'Zurück', continue: 'Zur Buchungsübersicht' }
      },
      bookingOverview: {
        title: 'Übersicht',
        subtitle: 'Bitte prüfen Sie Ihre Angaben bevor Sie den Termin versenden.',
        tiles: {
          appointment: {
            title: 'Wunschtermin',
            dateLabel: 'Datum',
            timeLabel: 'Uhrzeit'
          },
          services: {
            title: 'Gewählter Service',
            intro: 'Folgende Leistungen werden in',
            introSuffix: 'für Sie angefragt:'
          },
          personalData: {
            title: 'Ihre Daten',
            nameLabel: 'Name',
            streetLabel: 'Straße',
            cityLabel: 'Ort',
            phoneLabel: 'Telefon',
            emailLabel: 'E-Mail',
            brandLabel: 'Marke',
            licensePlateLabel: 'Kennzeichen',
            mileageLabel: 'Kilometerstand',
            mileageUnit: 'km'
          },
          price: {
            title: 'Preis',
            vatIncluded: 'inkl. Mehrwertsteuer',
            staticPrice: '129,00 €'
          }
        },
        navigation: {
          back: 'Zurück',
          submit: 'Jetzt anfragen'
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
      workshopCalendar: {
        title: 'Here you can see further available appointments in our workshop calendar',
        description: 'Select your desired date. We will show you all available appointments from that day onwards.',
        desiredDateLabel: 'Your desired date:',
        datePlaceholder: 'Select desired date',
        hintBefore: 'Select a desired date in the calendar and we will show you the next available appointments',
        hintAfter: 'We found the following available appointments from your selected date. Click on a time to select the appointment.',
        dateInputAriaLabel: 'Enter desired date in format DD.MM.YYYY',
        slotsAriaLabel: 'Available times',
        backButton: 'Back',
        continueButton: 'Continue',
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
      },
      carinformation: {
        title: 'Please provide us with final information about your appointment',
        returningCustomer: {
          title: 'Been with us before?',
          description: 'Retrieve your data automatically by entering your email address.',
          button: 'Retrieve my data!'
        },
        form: {
          customerTitle: 'Your Details',
          vehicleTitle: 'Vehicle Data',
          email: { label: 'Email Address', placeholder: 'max@example.com',
            error: { required: 'Please enter your email address.', invalid: 'Please enter a valid email address.' } },
          salutation: { label: 'Salutation', placeholder: 'Please select', mr: 'Mr.', ms: 'Ms.',
            error: { required: 'Please select a salutation.' } },
          firstName: { label: 'First Name', placeholder: 'John',
            error: { required: 'Please enter your first name.', lettersOnly: 'First name may only contain letters.' } },
          lastName: { label: 'Last Name', placeholder: 'Doe',
            error: { required: 'Please enter your last name.', lettersOnly: 'Last name may only contain letters.' } },
          street: { label: 'Street and House Number', placeholder: '1 Example Street',
            error: { required: 'Please enter your street and house number.' } },
          postalCode: { label: 'Postal Code', placeholder: '30159',
            error: { required: 'Please enter your postal code.', digitsOnly: 'Postal code may only contain digits.' } },
          city: { label: 'City', placeholder: 'Berlin',
            error: { required: 'Please enter your city.', lettersOnly: 'City may only contain letters.' } },
          mobilePhone: { label: 'Mobile Phone Number', placeholder: '017012345678',
            hint: 'Please enter your mobile number without special characters in the format 017012345678.',
            error: { required: 'Please enter your mobile phone number.', digitsOnly: 'Mobile number may only contain digits.', startsWithZero: 'Mobile number must start with 0.' } },
          licensePlate: { label: 'License Plate', placeholder: 'XX-XX1234',
            error: { required: 'Please enter your license plate.', invalidFormat: 'Please enter a valid license plate (e.g. B-MS1234).' } },
          mileage: { label: 'Mileage', placeholder: '5000',
            error: { required: 'Please enter the current mileage.', digitsOnly: 'Mileage may only contain digits.' } },
          vin: { label: 'VIN', placeholder: 'WDB8XXXXXXA123456', infoLink: 'Explanation of VIN',
            error: { required: 'Please enter the vehicle identification number.', invalidLength: 'The VIN must be exactly 17 characters.', invalidFormat: 'The VIN may only contain letters and digits.' } },
          privacy: { consent: 'I consent to the processing of my personal data for the purpose of online appointment booking. More information can be found in our',
            privacyLink: 'Privacy Policy',
            error: { required: 'Please accept the privacy policy.' } },
          requiredHint: 'Required fields are marked with *'
        },
        navigation: { back: 'Back', continue: 'To Booking Overview' }
      },
      bookingOverview: {
        title: 'Overview',
        subtitle: 'Please review your details before submitting the appointment.',
        tiles: {
          appointment: {
            title: 'Desired Appointment',
            dateLabel: 'Date',
            timeLabel: 'Time'
          },
          services: {
            title: 'Selected Service',
            intro: 'The following services will be requested at',
            introSuffix: 'for you:'
          },
          personalData: {
            title: 'Your Details',
            nameLabel: 'Name',
            streetLabel: 'Street',
            cityLabel: 'City',
            phoneLabel: 'Phone',
            emailLabel: 'Email',
            brandLabel: 'Brand',
            licensePlateLabel: 'License Plate',
            mileageLabel: 'Mileage',
            mileageUnit: 'km'
          },
          price: {
            title: 'Price',
            vatIncluded: 'incl. VAT',
            staticPrice: '€ 129.00'
          }
        },
        navigation: {
          back: 'Back',
          submit: 'Request Now'
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
      workshopCalendar: {
        title: 'Тут ви можете побачити додаткові вільні записи у нашому календарі майстерні',
        description: 'Оберіть бажану дату. Ми покажемо вам усі доступні записи починаючи з цього дня.',
        desiredDateLabel: 'Ваша бажана дата:',
        datePlaceholder: 'Оберіть бажану дату',
        hintBefore: 'Оберіть бажану дату в календарі, і ми покажемо вам найближчі доступні записи',
        hintAfter: 'Ми знайшли наступні доступні записи від обраної вами дати. Натисніть на час, щоб обрати запис.',
        dateInputAriaLabel: 'Введіть бажану дату у форматі ДД.ММ.РРРР',
        slotsAriaLabel: 'Доступні часи',
        backButton: 'Назад',
        continueButton: 'Далі',
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
      },
      carinformation: {
        title: 'Будь ласка, надайте нам останню інформацію про ваш запис',
        returningCustomer: {
          title: 'Вже бували у нас?',
          description: 'Отримайте свої дані автоматично, ввівши свою електронну адресу.',
          button: 'Отримати мої дані!'
        },
        form: {
          customerTitle: 'Ваші дані',
          vehicleTitle: 'Дані автомобіля',
          email: { label: 'Електронна адреса', placeholder: 'ivan@example.com',
            error: { required: 'Будь ласка, введіть свою електронну адресу.', invalid: 'Будь ласка, введіть дійсну електронну адресу.' } },
          salutation: { label: 'Звертання', placeholder: 'Будь ласка, оберіть', mr: 'Пан', ms: 'Пані',
            error: { required: 'Будь ласка, оберіть звертання.' } },
          firstName: { label: 'Ім\'я', placeholder: 'Іван',
            error: { required: 'Будь ласка, введіть своє ім\'я.', lettersOnly: 'Ім\'я може містити лише літери.' } },
          lastName: { label: 'Прізвище', placeholder: 'Іваненко',
            error: { required: 'Будь ласка, введіть своє прізвище.', lettersOnly: 'Прізвище може містити лише літери.' } },
          street: { label: 'Вулиця та номер будинку', placeholder: 'вул. Прикладна, 1',
            error: { required: 'Будь ласка, введіть вулицю та номер будинку.' } },
          postalCode: { label: 'Поштовий індекс', placeholder: '30159',
            error: { required: 'Будь ласка, введіть поштовий індекс.', digitsOnly: 'Поштовий індекс може містити лише цифри.' } },
          city: { label: 'Місто', placeholder: 'Берлін',
            error: { required: 'Будь ласка, введіть місто.', lettersOnly: 'Місто може містити лише літери.' } },
          mobilePhone: { label: 'Мобільний телефон', placeholder: '017012345678',
            hint: 'Будь ласка, введіть номер без спеціальних символів у форматі 017012345678.',
            error: { required: 'Будь ласка, введіть номер мобільного телефону.', digitsOnly: 'Номер може містити лише цифри.', startsWithZero: 'Номер мобільного телефону має починатися з 0.' } },
          licensePlate: { label: 'Номерний знак', placeholder: 'XX-XX1234',
            error: { required: 'Будь ласка, введіть номерний знак.', invalidFormat: 'Будь ласка, введіть дійсний номерний знак (напр. B-MS1234).' } },
          mileage: { label: 'Пробіг', placeholder: '5000',
            error: { required: 'Будь ласка, введіть пробіг.', digitsOnly: 'Пробіг може містити лише цифри.' } },
          vin: { label: 'VIN', placeholder: 'WDB8XXXXXXA123456', infoLink: 'Пояснення VIN',
            error: { required: 'Будь ласка, введіть ідентифікаційний номер автомобіля.', invalidLength: 'VIN має складатися рівно з 17 символів.', invalidFormat: 'VIN може містити лише літери та цифри.' } },
          privacy: { consent: 'Я погоджуюся на обробку моїх персональних даних з метою онлайн-запису на технічне обслуговування. Детальніше в нашій',
            privacyLink: 'Політиці конфіденційності',
            error: { required: 'Будь ласка, підтвердьте політику конфіденційності.' } },
          requiredHint: 'Обов\'язкові поля позначені *'
        },
        navigation: { back: 'Назад', continue: 'До підсумку бронювання' }
      },
      bookingOverview: {
        title: 'Огляд',
        subtitle: 'Будь ласка, перевірте свої дані перед відправленням запису.',
        tiles: {
          appointment: {
            title: 'Бажаний термін',
            dateLabel: 'Дата',
            timeLabel: 'Час'
          },
          services: {
            title: 'Обраний сервіс',
            intro: 'Наступні послуги будуть запитані в',
            introSuffix: 'для вас:'
          },
          personalData: {
            title: 'Ваші дані',
            nameLabel: "Ім'я",
            streetLabel: 'Вулиця',
            cityLabel: 'Місто',
            phoneLabel: 'Телефон',
            emailLabel: 'Електронна пошта',
            brandLabel: 'Марка',
            licensePlateLabel: 'Номерний знак',
            mileageLabel: 'Пробіг',
            mileageUnit: 'км'
          },
          price: {
            title: 'Ціна',
            vatIncluded: 'вкл. ПДВ',
            staticPrice: '€ 129,00'
          }
        },
        navigation: {
          back: 'Назад',
          submit: 'Запросити зараз'
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
      workshopCalendar: {
        title: 'Consultez ici les créneaux disponibles dans notre calendrier d\'atelier',
        description: 'Sélectionnez votre date souhaitée. Nous vous montrerons tous les rendez-vous disponibles à partir de ce jour.',
        desiredDateLabel: 'Votre date souhaitée :',
        datePlaceholder: 'Sélectionner une date',
        hintBefore: 'Sélectionnez une date dans le calendrier et nous vous montrerons les prochains rendez-vous disponibles',
        hintAfter: 'Nous avons trouvé les rendez-vous disponibles suivants à partir de votre date sélectionnée. Cliquez sur un horaire pour sélectionner le rendez-vous.',
        dateInputAriaLabel: 'Entrez la date souhaitée au format JJ.MM.AAAA',
        slotsAriaLabel: 'Horaires disponibles',
        backButton: 'Retour',
        continueButton: 'Continuer',
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
      },
      carinformation: {
        title: 'Veuillez nous fournir les dernières informations sur votre rendez-vous',
        returningCustomer: {
          title: 'Déjà venu chez nous ?',
          description: 'Récupérez vos données automatiquement en saisissant votre adresse e-mail.',
          button: 'Récupérer mes données !'
        },
        form: {
          customerTitle: 'Vos coordonnées',
          vehicleTitle: 'Données du véhicule',
          email: { label: 'Adresse e-mail', placeholder: 'max@exemple.fr',
            error: { required: 'Veuillez saisir votre adresse e-mail.', invalid: 'Veuillez saisir une adresse e-mail valide.' } },
          salutation: { label: 'Civilité', placeholder: 'Veuillez sélectionner', mr: 'M.', ms: 'Mme',
            error: { required: 'Veuillez sélectionner une civilité.' } },
          firstName: { label: 'Prénom', placeholder: 'Jean',
            error: { required: 'Veuillez saisir votre prénom.', lettersOnly: 'Le prénom ne peut contenir que des lettres.' } },
          lastName: { label: 'Nom de famille', placeholder: 'Dupont',
            error: { required: 'Veuillez saisir votre nom de famille.', lettersOnly: 'Le nom ne peut contenir que des lettres.' } },
          street: { label: 'Rue et numéro', placeholder: 'Rue Exemple 1',
            error: { required: 'Veuillez saisir votre rue et numéro.' } },
          postalCode: { label: 'Code postal', placeholder: '75001',
            error: { required: 'Veuillez saisir votre code postal.', digitsOnly: 'Le code postal ne peut contenir que des chiffres.' } },
          city: { label: 'Ville', placeholder: 'Paris',
            error: { required: 'Veuillez saisir votre ville.', lettersOnly: 'La ville ne peut contenir que des lettres.' } },
          mobilePhone: { label: 'Téléphone mobile', placeholder: '017012345678',
            hint: 'Veuillez saisir votre numéro sans caractères spéciaux au format 017012345678.',
            error: { required: 'Veuillez saisir votre numéro de téléphone mobile.', digitsOnly: 'Le numéro ne peut contenir que des chiffres.', startsWithZero: 'Le numéro de mobile doit commencer par 0.' } },
          licensePlate: { label: 'Plaque d\'immatriculation', placeholder: 'XX-XX1234',
            error: { required: 'Veuillez saisir votre plaque d\'immatriculation.', invalidFormat: 'Veuillez saisir une plaque valide (ex. B-MS1234).' } },
          mileage: { label: 'Kilométrage', placeholder: '5000',
            error: { required: 'Veuillez saisir le kilométrage.', digitsOnly: 'Le kilométrage ne peut contenir que des chiffres.' } },
          vin: { label: 'NIV', placeholder: 'WDB8XXXXXXA123456', infoLink: 'Explication du NIV',
            error: { required: 'Veuillez saisir le numéro d\'identification du véhicule.', invalidLength: 'Le NIV doit comporter exactement 17 caractères.', invalidFormat: 'Le NIV ne peut contenir que des lettres et des chiffres.' } },
          privacy: { consent: 'Je consens au traitement de mes données personnelles aux fins de la prise de rendez-vous en ligne. Pour en savoir plus, consultez notre',
            privacyLink: 'Politique de confidentialité',
            error: { required: 'Veuillez accepter la politique de confidentialité.' } },
          requiredHint: 'Les champs obligatoires sont marqués d\'un *'
        },
        navigation: { back: 'Retour', continue: 'Vers le récapitulatif' }
      },
      bookingOverview: {
        title: 'Récapitulatif',
        subtitle: 'Veuillez vérifier vos informations avant d\'envoyer le rendez-vous.',
        tiles: {
          appointment: {
            title: 'Rendez-vous souhaité',
            dateLabel: 'Date',
            timeLabel: 'Heure'
          },
          services: {
            title: 'Service sélectionné',
            intro: 'Les prestations suivantes seront demandées à',
            introSuffix: 'pour vous :'
          },
          personalData: {
            title: 'Vos données',
            nameLabel: 'Nom',
            streetLabel: 'Rue',
            cityLabel: 'Ville',
            phoneLabel: 'Téléphone',
            emailLabel: 'E-mail',
            brandLabel: 'Marque',
            licensePlateLabel: 'Plaque d\'immatriculation',
            mileageLabel: 'Kilométrage',
            mileageUnit: 'km'
          },
          price: {
            title: 'Prix',
            vatIncluded: 'TTC',
            staticPrice: '129,00 €'
          }
        },
        navigation: {
          back: 'Retour',
          submit: 'Demander maintenant'
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
      workshopCalendar: {
        title: 'هنا يمكنك رؤية المزيد من المواعيد المتاحة في تقويم الورشة',
        description: 'اختر التاريخ المطلوب. سنعرض لك جميع المواعيد المتاحة بدءاً من هذا اليوم.',
        desiredDateLabel: 'التاريخ المطلوب:',
        datePlaceholder: 'اختر التاريخ المطلوب',
        hintBefore: 'اختر تاريخاً في التقويم وسنعرض لك المواعيد المتاحة القادمة',
        hintAfter: 'وجدنا المواعيد المتاحة التالية بدءاً من التاريخ الذي اخترته. انقر على وقت لاختيار الموعد.',
        dateInputAriaLabel: 'أدخل التاريخ المطلوب بالتنسيق يي.شش.سسسس',
        slotsAriaLabel: 'الأوقات المتاحة',
        backButton: 'رجوع',
        continueButton: 'متابعة',
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
      },
      carinformation: {
        title: 'يرجى تزويدنا بالمعلومات الأخيرة حول موعدك',
        returningCustomer: {
          title: 'سبق أن زرتنا؟',
          description: 'استرجع بياناتك تلقائياً بإدخال عنوان بريدك الإلكتروني.',
          button: 'استرداد بياناتي!'
        },
        form: {
          customerTitle: 'بياناتك',
          vehicleTitle: 'بيانات السيارة',
          email: { label: 'عنوان البريد الإلكتروني', placeholder: 'ahmed@example.com',
            error: { required: 'يرجى إدخال عنوان بريدك الإلكتروني.', invalid: 'يرجى إدخال عنوان بريد إلكتروني صحيح.' } },
          salutation: { label: 'التحية', placeholder: 'يرجى الاختيار', mr: 'السيد', ms: 'السيدة',
            error: { required: 'يرجى اختيار التحية.' } },
          firstName: { label: 'الاسم الأول', placeholder: 'أحمد',
            error: { required: 'يرجى إدخال اسمك الأول.', lettersOnly: 'الاسم الأول يجب أن يحتوي على أحرف فقط.' } },
          lastName: { label: 'اسم العائلة', placeholder: 'محمد',
            error: { required: 'يرجى إدخال اسم عائلتك.', lettersOnly: 'اسم العائلة يجب أن يحتوي على أحرف فقط.' } },
          street: { label: 'الشارع ورقم المبنى', placeholder: 'شارع النموذج 1',
            error: { required: 'يرجى إدخال الشارع ورقم المبنى.' } },
          postalCode: { label: 'الرمز البريدي', placeholder: '30159',
            error: { required: 'يرجى إدخال الرمز البريدي.', digitsOnly: 'الرمز البريدي يجب أن يحتوي على أرقام فقط.' } },
          city: { label: 'المدينة', placeholder: 'برلين',
            error: { required: 'يرجى إدخال المدينة.', lettersOnly: 'المدينة يجب أن تحتوي على أحرف فقط.' } },
          mobilePhone: { label: 'رقم الهاتف المحمول', placeholder: '017012345678',
            hint: 'يرجى إدخال الرقم بدون أحرف خاصة بصيغة 017012345678.',
            error: { required: 'يرجى إدخال رقم هاتفك المحمول.', digitsOnly: 'الرقم يجب أن يحتوي على أرقام فقط.', startsWithZero: 'يجب أن يبدأ رقم الهاتف المحمول بـ 0.' } },
          licensePlate: { label: 'لوحة الترخيص', placeholder: 'XX-XX1234',
            error: { required: 'يرجى إدخال لوحة الترخيص.', invalidFormat: 'يرجى إدخال لوحة ترخيص صحيحة (مثال: B-MS1234).' } },
          mileage: { label: 'عداد المسافات', placeholder: '5000',
            error: { required: 'يرجى إدخال قراءة عداد المسافات.', digitsOnly: 'عداد المسافات يجب أن يحتوي على أرقام فقط.' } },
          vin: { label: 'VIN', placeholder: 'WDB8XXXXXXA123456', infoLink: 'شرح رقم VIN',
            error: { required: 'يرجى إدخال رقم تعريف السيارة.', invalidLength: 'يجب أن يتكون رقم VIN من 17 حرفاً بالضبط.', invalidFormat: 'رقم VIN يجب أن يحتوي على أحرف وأرقام فقط.' } },
          privacy: { consent: 'أوافق على معالجة بياناتي الشخصية لغرض حجز موعد عبر الإنترنت. لمزيد من المعلومات راجع',
            privacyLink: 'سياسة الخصوصية',
            error: { required: 'يرجى قبول سياسة الخصوصية.' } },
          requiredHint: 'الحقول المطلوبة محددة بـ *'
        },
        navigation: { back: 'رجوع', continue: 'إلى ملخص الحجز' }
      },
      bookingOverview: {
        title: 'ملخص',
        subtitle: 'يرجى مراجعة بياناتك قبل إرسال الموعد.',
        tiles: {
          appointment: {
            title: 'الموعد المطلوب',
            dateLabel: 'التاريخ',
            timeLabel: 'الوقت'
          },
          services: {
            title: 'الخدمة المختارة',
            intro: 'سيتم طلب الخدمات التالية في',
            introSuffix: 'لك:'
          },
          personalData: {
            title: 'بياناتك',
            nameLabel: 'الاسم',
            streetLabel: 'الشارع',
            cityLabel: 'المدينة',
            phoneLabel: 'الهاتف',
            emailLabel: 'البريد الإلكتروني',
            brandLabel: 'العلامة التجارية',
            licensePlateLabel: 'لوحة الترخيص',
            mileageLabel: 'عدد الكيلومترات',
            mileageUnit: 'كم'
          },
          price: {
            title: 'السعر',
            vatIncluded: 'شامل ضريبة القيمة المضافة',
            staticPrice: '€ 129,00'
          }
        },
        navigation: {
          back: 'رجوع',
          submit: 'اطلب الآن'
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
