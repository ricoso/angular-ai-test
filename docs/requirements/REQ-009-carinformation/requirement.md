# REQ-009: carinformation

**Status:** Draft
**Priority:** High
**Type:** Functional
**Created:** 2026-02-25
**Author:** Claude Code
**Wizard-Schritt:** 6 von 8 (nach Terminauswahl, vor Buchungsübersicht)

---

## 1. Overview

### 1.1 Purpose
Der Benutzer gibt seine persönlichen Kontaktdaten sowie fahrzeugbezogene Informationen ein, bevor er zur Buchungsübersicht weitergeleitet wird. Die Seite bildet den finalen Dateneingabeschritt im Buchungs-Wizard der Online-Terminvereinbarung bei Gottfried Schultz.

### 1.2 Scope
**Included:**
- Banner „Schon einmal bei uns gewesen?" mit Button „Jetzt Daten abrufen!" (Click-Dummy)
- Formular Kundendaten: E-Mail, Anrede, Vorname, Nachname, Straße/Hausnr., PLZ, Wohnort, Mobilfunknummer
- Formular Fahrzeugdaten: Kfz-Kennzeichen, Kilometerstand, FIN
- DSGVO-Einwilligungs-Checkbox mit Link zur Datenschutzerklärung
- Formularvalidierung (Pflichtfelder, Format-Validierungen)
- Speichern der Kunden- und Fahrzeugdaten im BookingStore
- Navigation: Zurück (vorheriger Wizard-Schritt) | Zur Buchungsübersicht (weiter)

**Excluded:**
- Tatsächlicher Datenabruf für bestehende Kunden (Click-Dummy — Button vorhanden, keine API)
- Buchungsübersicht (→ REQ-010+)
- Datenschutzerklärung-Seite (externer Link)
- Authentifizierung / Login

### 1.3 Related Requirements
- REQ-001: Header (Warenkorb-Icon zeigt gewählte Services)
- REQ-004: Serviceauswahl (liefert `selectedServices`)
- REQ-005: Hinweisfenster (liefert optional `customerNote`)
- REQ-006: Terminauswahl (direkter Vorgänger — "Weiter"-Button navigiert zu `/home/carinformation`, liefert `selectedAppointment`)
- REQ-007: WizardStateSync (definiert `onBack()`-Verhalten)
- REQ-008: Werkstattkalender (alternativer Vorgänger — "Weiter"-Button navigiert ebenfalls zu `/home/carinformation`)

---

## 2. User Story

**Als** Kunde
**möchte ich** meine persönlichen Daten und Fahrzeuginformationen eingeben
**damit** der Werkstatttermin mit meinen korrekten Kontakt- und Fahrzeugdaten gebucht werden kann.

**Acceptance Criteria:**
- [ ] AC-1: Seite zeigt Überschrift „Bitte geben Sie uns letzte Informationen rund um Ihren Termin"
- [ ] AC-2: Banner „Schon einmal bei uns gewesen?" mit Button „Jetzt Daten abrufen!" wird angezeigt
- [ ] AC-3: Alle Pflichtfelder sind mit `*` markiert; Hinweis „Pflichtfelder sind mit * gekennzeichnet" erscheint
- [ ] AC-4: E-Mail-Feld validiert auf gültiges E-Mail-Format
- [ ] AC-5: Anrede-Dropdown zeigt „Herr" und „Frau"
- [ ] AC-6: Vorname und Nachname akzeptieren nur Buchstaben (inkl. Umlaute)
- [ ] AC-7: PLZ-Feld akzeptiert nur Ziffern
- [ ] AC-8: Wohnort-Feld akzeptiert nur Buchstaben (inkl. Umlaute, Leerzeichen, Bindestrich)
- [ ] AC-9: Mobilfunknummer akzeptiert nur Ziffern und muss mit `0` beginnen; Hinweistext erscheint unter dem Feld
- [ ] AC-10: Kfz-Kennzeichen akzeptiert Buchstaben und Ziffern im Format XX-XX1234
- [ ] AC-11: Kilometerstand akzeptiert nur Ziffern
- [ ] AC-12: FIN akzeptiert genau 17 alphanumerische Zeichen; Info-Link „Erklärung der FIN" rechts daneben
- [ ] AC-13: DSGVO-Checkbox ist Pflichtfeld — „Zur Buchungsübersicht"-Button ohne Häkchen deaktiviert/gesperrt
- [ ] AC-14: Klick auf „Zur Buchungsübersicht" validiert alle Felder und speichert Daten im BookingStore
- [ ] AC-15: Alle Felder zeigen inline Fehlermeldungen bei ungültiger Eingabe
- [ ] AC-16: Jedes Eingabefeld hat ein vorangestelltes Icon (E-Mail, Person, Location, Telefon, Auto) mit `.icon-framed`-Rahmen
- [ ] AC-17: Auf Mobile (<48em) sind mehrspaltige Zeilen einspaltig

---

## 3. Preconditions

### 3.1 System
- BookingStore verfügbar und mit Daten aus vorherigen Wizard-Schritten befüllt
- Header-Component (REQ-001) aktiv

### 3.2 User
- Benutzer kommt über "Weiter"-Button von REQ-006 (Terminauswahl) ODER REQ-008 (Werkstattkalender)
- Benutzer ruft `/home/carinformation` auf

### 3.3 Data
- Statisches Click-Dummy-Formular — kein API-Call beim Laden
- Kein Login erforderlich

### 3.4 Übergabe (Input vom vorherigen Wizard-Schritt)
| Feld | Typ | Quelle | Pflicht |
|------|-----|--------|---------|
| `BookingStore.selectedBrand` | `Brand` | REQ-002 | **Ja** — Guard prüft, redirect zu `/home` wenn leer |
| `BookingStore.selectedLocation` | `LocationDisplay` | REQ-003 | **Ja** — Guard prüft |
| `BookingStore.selectedServices` | `SelectedService[]` | REQ-004 | **Ja** — Guard prüft, mind. 1 Service |
| `BookingStore.selectedAppointment` | `AppointmentSlot` | REQ-006 | **Ja** — Guard prüft |

---

## 4. Main Flow

![Carinformation Formular](./mockup.png)

**Step 1:** Seite wird geladen
- **System:** Guard prüft — `selectedBrand`, `selectedLocation`, `selectedServices`, `selectedAppointment` im BookingStore
- **System:** Zeigt Seite mit Überschrift, Banner und leerem Formular
- **System:** Falls `customerInfo`/`vehicleInfo` bereits im Store vorhanden: Felder vorausfüllen

**Step 2:** Benutzer füllt Kundendaten aus
- **User:** Gibt E-Mail, Anrede, Vorname, Nachname, Straße/Hausnr., PLZ, Wohnort, Mobilfunknummer ein
- **System:** Validiert Felder bei `blur` (on-touch) — zeigt Fehlermeldungen inline

**Step 3:** Benutzer füllt Fahrzeugdaten aus
- **User:** Gibt Kfz-Kennzeichen, Kilometerstand und FIN ein
- **System:** Validiert Felder bei `blur`

**Step 4:** Benutzer akzeptiert DSGVO-Einwilligung
- **User:** Setzt Häkchen bei der Einwilligungs-Checkbox
- **System:** „Zur Buchungsübersicht"-Button wird aktiviert

**Step 5:** Benutzer klickt „Zur Buchungsübersicht"
- **User:** Klickt primären Button rechts unten
- **System:** Validiert alle Felder vollständig (markAll as touched)
- **System:** Bei Erfolg: speichert `customerInfo`, `vehicleInfo`, `privacyConsent` im BookingStore
- **System:** Navigiert zur Buchungsübersicht (nächster Wizard-Schritt)

---

## 5. Alternative Flows

### 5.1 Bestehender Kunde — Daten abrufen

**Trigger:** Benutzer klickt „Jetzt Daten abrufen!" im Banner

**Flow (Click-Dummy):**
1. Button-Klick wird registriert
2. Click-Dummy: keine Aktion (ggf. Konsole-Debug-Log)
3. Formular bleibt unverändert

### 5.2 Zurück zur vorherigen Seite

**Trigger:** Benutzer klickt „Zurück"-Button

**Flow:**
1. System setzt gemäß REQ-007 (WizardStateSync) `selectedAppointment` auf `null`
2. System navigiert kontextabhängig zurück:
   - Standardfall: `/home/appointment` (REQ-006 Terminauswahl)
   - Falls Benutzer über REQ-008 (Werkstattkalender) kam: `/home/workshop-calendar` (REQ-008)
3. Bereits eingegebene Formulardaten bleiben im Store (falls bereits Step 5 ausgeführt)

> **Hinweis:** Die Zurück-Navigation richtet sich nach dem Wizard-Pfad des Benutzers. REQ-007 (WizardStateSync) steuert die korrekte Rücknavigation.

### 5.3 Erklärung der FIN aufrufen

**Trigger:** Benutzer klickt auf Info-Link „Erklärung der FIN"

**Flow (Click-Dummy):**
1. Link `href="#"` — kein Modal, kein Redirect (Click-Dummy-Platzhalter)

---

## 6. Exception Flows

### 6.1 Vorherige Wizard-Schritte nicht abgeschlossen

**Trigger:** Direktaufruf `/home/carinformation` ohne vollständige Store-Daten

**Flow:**
1. `carInformationGuard` prüft `selectedBrand`, `selectedLocation`, `selectedServices`, `selectedAppointment`
2. Bei fehlendem Wert: Redirect zu `/home` (Wizard-Anfang)

### 6.2 Validierungsfehler bei Formular-Abgabe

**Trigger:** Benutzer klickt „Zur Buchungsübersicht" mit ungültigen Feldern

**Flow:**
1. System markiert alle Felder als `touched`
2. Inline-Fehlermeldungen erscheinen unter den fehlerhaften Feldern
3. Kein Navigationsvorgang — Benutzer korrigiert Fehler

### 6.3 DSGVO-Checkbox nicht angehakt

**Trigger:** Benutzer klickt „Zur Buchungsübersicht" ohne Checkbox

**Flow:**
1. Checkbox erhält `mat-error`-Fehlermeldung
2. Navigation wird blockiert

---

## 7. Postconditions

### 7.1 Erfolg
Folgende Felder werden im BookingStore gesetzt:

| Store-Feld | Typ | Beschreibung |
|------------|-----|-------------|
| `BookingStore.customerInfo` | `CustomerInfo` | E-Mail, Anrede, Vorname, Nachname, Straße, PLZ, Wohnort, Mobilnummer |
| `BookingStore.vehicleInfo` | `VehicleInfo` | Kennzeichen, Kilometerstand, FIN |
| `BookingStore.privacyConsent` | `boolean` | `true` |

System navigiert zur Buchungsübersicht.

### 7.2 Misserfolg
- Keine Store-Änderung
- Fehlermeldungen werden inline angezeigt
- Benutzer verbleibt auf der Seite

---

## 8. Business Rules

- **BR-1:** E-Mail muss gültiges Format enthalten (`Validators.email`)
- **BR-2:** Vorname/Nachname: nur Unicode-Buchstaben inkl. Umlaute/Akzente, Leerzeichen, Bindestriche (`^[a-zA-ZÀ-ÖØ-öø-ÿ\s\-]+$`)
- **BR-3:** PLZ: nur Ziffern (`^[0-9]+$`)
- **BR-4:** Wohnort: nur Buchstaben inkl. Umlaute, Leerzeichen, Bindestriche
- **BR-5:** Mobilfunknummer: nur Ziffern, muss mit `0` beginnen (`^0[0-9]+$`)
- **BR-6:** Straße und Hausnr.: Freitext (Buchstaben, Ziffern, Sonderzeichen erlaubt)
- **BR-7:** Kfz-Kennzeichen: `^[A-ZÄÖÜ]{1,3}-[A-Z]{1,2}[0-9]{1,4}$`
- **BR-8:** Kilometerstand: nur Ziffern (`^[0-9]+$`)
- **BR-9:** FIN: genau 17 alphanumerische Zeichen (`^[A-HJ-NPR-Z0-9]{17}$`)
- **BR-10:** DSGVO-Checkbox: Pflichtfeld — `Validators.requiredTrue`
- **BR-11:** Alle mit `*` markierten Felder: `Validators.required`

---

## 9. Non-Functional Requirements

### Performance
- Formular-Rendering < 200ms
- Validierungsfeedback synchron (kein API-Call)
- Lighthouse Performance > 90

### Security
- Kein `[innerHTML]` — nur Angular Template Escaping
- Keine sensiblen Daten in URL-Parametern
- DSGVO-Einwilligung explizit als `boolean` gespeichert
- Kein `eval`, kein direktes DOM-Manipulieren

### Usability
- Mobile-First: mehrspaltige Zeilen auf Mobile (<48em) einspaltig
- WCAG 2.1 AA: `<label for="">` + `id` auf allen Inputs, `aria-required="true"`, `aria-describedby` für Fehlermeldungen
- Touch-Targets: mind. 2.75em (44px)
- Kontrast: 4.5:1
- Focus-Styles: `:focus-visible` sichtbar
- Browser Support: aktuelle 2 Versionen Chrome, Firefox, Safari, Edge

---

## 10. Data Model

```typescript
// src/app/features/booking/models/customer.model.ts  (NEU)

/** Anrede / Salutation */
export type Salutation = 'mr' | 'ms';

/** Kundenkontaktdaten / Customer contact data */
export interface CustomerInfo {
  email: string;
  salutation: Salutation;
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  mobilePhone: string;
}

/** Fahrzeugdaten / Vehicle identification data */
export interface VehicleInfo {
  licensePlate: string;  // Kfz-Kennzeichen
  mileage: number;       // Kilometerstand
  vin: string;           // FIN — genau 17 Zeichen
}
```

```typescript
// Erweiterung BookingState in src/app/features/booking/stores/booking.store.ts:

interface BookingState {
  // ...bestehende Felder (brands, selectedBrand, locations, selectedLocation,
  //    services, selectedServices, isLoading, error) ...

  // NEU:
  customerInfo: CustomerInfo | null;
  vehicleInfo: VehicleInfo | null;
  privacyConsent: boolean;
}

const INITIAL_STATE: BookingState = {
  // ...bestehende Initialwerte...
  customerInfo: null,
  vehicleInfo: null,
  privacyConsent: false,
};
```

---

## 11. UI/UX

### Mockup
![Carinformation Formular](./mockup.png)

### Seitenstruktur
1. **Header** (REQ-001) — Logo + Warenkorb + Accessibility
2. **Banner** — „Schon einmal bei uns gewesen?" (volle Breite, Bild rechts als Placeholder, Button links)
3. **Formular-Abschnitt 1** (dunkler Container) — Kundendaten
4. **Formular-Abschnitt 2** (dunkler Container, Abstand) — Fahrzeugdaten
5. **DSGVO-Checkbox** — heller Bereich
6. **Pflichtfeld-Hinweis** — kleiner Text
7. **Navigation** — Zurück (sekundär, links) | Zur Buchungsübersicht (primär, rechts)
8. **Footer**

### Formularfelder
| Feld | Typ | Icon | Pflicht | Validierung | Placeholder |
|------|-----|------|---------|-------------|-------------|
| E-Mail Adresse | `input[type=email]` | `email` | Ja | E-Mail-Format | max@mustermann.de |
| Anrede | `mat-select` | `person` | Ja | Required | Bitte wählen |
| Vorname | `input[type=text]` | `person` | Ja | Nur Buchstaben | Max |
| Nachname | `input[type=text]` | `person` | Ja | Nur Buchstaben | Mustermann |
| Straße und Haus Nr. | `input[type=text]` | `location_on` | Ja | Freitext | Musterweg 1 |
| Postleitzahl | `input[type=text]` | `location_on` | Ja | Nur Ziffern | 30159 |
| Wohnort | `input[type=text]` | `location_on` | Ja | Nur Buchstaben | Berlin |
| Mobilfunknummer | `input[type=tel]` | `phone` | Ja | Ziffern, beginnt mit 0 | 017012345678 |
| Kfz. Kennzeichen | `input[type=text]` | `directions_car` | Ja | Buchstaben + Ziffern | XX-XX1234 |
| Kilometerstand | `input[type=text]` | `directions_car` | Ja | Nur Ziffern | 5000 |
| FIN | `input[type=text]` | `directions_car` | Ja | 17 alphanumerisch | WDB8XXXXXXA123456 |
| DSGVO Einwilligung | `mat-checkbox` | — | Ja | `requiredTrue` | — |

### Material Components
- `MatFormField` + `MatInput` für alle Textfelder
- `MatSelect` + `MatOption` für Anrede
- `MatCheckbox` für DSGVO
- `MatButton` (`mat-flat-button`) für alle Buttons
- `MatIcon` mit `.icon-framed` für alle Feld-Icons

### Mehrspaltiges Layout (Desktop/Tablet ≥ 48em)
| Zeile | Spalten |
|-------|---------|
| Anrede | Vorname | Nachname | 25% / 37.5% / 37.5% |
| Postleitzahl | Wohnort | 30% / 70% |
| Kfz-Kennzeichen | Kilometerstand | 50% / 50% |

**Mobile (<48em):** Alle Zeilen einspaltig

---

## 12. API Specification

Click-Dummy — kein HTTP-Request. Daten werden im BookingStore gespeichert.

```typescript
// Neue Store-Methoden (withMethods in booking.store.ts):

setCustomerInfo(info: CustomerInfo): void
// → patchState(store, { customerInfo: info })

setVehicleInfo(info: VehicleInfo): void
// → patchState(store, { vehicleInfo: info })

setPrivacyConsent(consent: boolean): void
// → patchState(store, { privacyConsent: consent })
```

**Zukünftiger POST-Endpunkt (Produktiv-Version):**
```http
POST /api/appointments
Content-Type: application/json

{
  "brand": "mercedes",
  "locationId": "loc-1",
  "services": [{ "serviceId": "huau" }],
  "appointmentDate": "2026-03-15T10:00:00",
  "customer": {
    "email": "max@mustermann.de",
    "salutation": "mr",
    "firstName": "Max",
    "lastName": "Mustermann",
    "street": "Musterweg 1",
    "postalCode": "30159",
    "city": "Berlin",
    "mobilePhone": "017012345678"
  },
  "vehicle": {
    "licensePlate": "B-MS1234",
    "mileage": 50000,
    "vin": "WDB8XXXXXXA123456"
  },
  "privacyConsent": true
}
```

---

## 13. Test Cases

### TC-1: Happy Path — Vollständiges Formular absenden
- **Given:** Alle Wizard-Vorstufen abgeschlossen, Store mit `selectedAppointment` befüllt
- **When:** Benutzer füllt alle Pflichtfelder korrekt aus, hakt DSGVO an, klickt „Zur Buchungsübersicht"
- **Then:** `BookingStore.customerInfo` und `vehicleInfo` gesetzt, Navigation zur Buchungsübersicht

### TC-2: E-Mail-Validierung — ungültiges Format
- **Given:** Formular geöffnet
- **When:** Benutzer gibt `kein-email` ein und verlässt Feld
- **Then:** Inline-Fehler „Bitte geben Sie eine gültige E-Mail-Adresse ein." erscheint

### TC-3: Vorname — Zahlen eingeben
- **Given:** Formular geöffnet
- **When:** Benutzer gibt `Max123` im Vorname-Feld ein
- **Then:** Inline-Fehler „Vorname darf nur Buchstaben enthalten."

### TC-4: FIN — weniger als 17 Zeichen
- **Given:** Formular geöffnet
- **When:** Benutzer gibt `ABC123` (6 Zeichen) in FIN-Feld ein und verlässt es
- **Then:** Inline-Fehler „Die FIN muss genau 17 Zeichen enthalten."

### TC-5: Mobilfunknummer — beginnt nicht mit 0
- **Given:** Formular geöffnet
- **When:** Benutzer gibt `1701234567` ein
- **Then:** Inline-Fehler „Die Mobilfunknummer muss mit 0 beginnen."

### TC-6: DSGVO-Checkbox nicht angehakt
- **Given:** Alle Felder korrekt ausgefüllt, Checkbox nicht angehakt
- **When:** Benutzer klickt „Zur Buchungsübersicht"
- **Then:** Checkbox wird fehlerhaft markiert, Navigation blockiert

### TC-7: Guard-Redirect ohne Appointment
- **Given:** `BookingStore.selectedAppointment === null`, direkter Aufruf `/home/carinformation`
- **When:** Route geladen
- **Then:** Redirect zu `/home`

### TC-8: Responsive — Mobile Layout
- **Given:** Viewport < 48em
- **When:** Seite gerendert
- **Then:** Anrede, Vorname, Nachname stehen untereinander (einspaltig)

### TC-9: Zurück-Button
- **Given:** Formular geöffnet
- **When:** Benutzer klickt „Zurück"
- **Then:** `selectedAppointment` auf `null` gesetzt (REQ-007), Navigation zu `/home/appointment`

### TC-10: Vorausfüllen bei Rückkehr
- **Given:** `BookingStore.customerInfo` bereits gesetzt (Benutzer war schon hier)
- **When:** Seite geladen
- **Then:** Formularfelder werden mit gespeicherten Werten vorausgefüllt

---

## 14. Implementation

### Folder-Struktur
```
src/app/features/booking/
├── models/
│   └── customer.model.ts                              # NEU: CustomerInfo, VehicleInfo, Salutation
├── stores/
│   └── booking.store.ts                               # ERWEITERN: customerInfo, vehicleInfo, privacyConsent
└── components/
    └── carinformation/
        ├── carinformation-container.component.ts      # Container (inject BookingStore, OnPush)
        ├── carinformation-container.component.html
        ├── carinformation-container.component.scss
        └── components/
            ├── customer-form/
            │   ├── customer-form.component.ts         # Presentational: Kundendaten
            │   ├── customer-form.component.html
            │   └── customer-form.component.scss
            └── vehicle-form/
                ├── vehicle-form.component.ts          # Presentational: Fahrzeugdaten
                ├── vehicle-form.component.html
                └── vehicle-form.component.scss
```

### Guards & Resolver
```
src/app/core/guards/
└── car-information.guard.ts    # Functional Guard — prüft alle 4 Store-Felder

src/app/features/booking/
└── resolvers/
    └── car-information.resolver.ts  # ResolveFn<void> — optional, da Click-Dummy
```

### Route
```typescript
// In app.routes.ts oder booking.routes.ts:
{
  path: 'carinformation',
  loadComponent: () => import('./features/booking/components/carinformation/carinformation-container.component')
    .then(m => m.CarinformationContainerComponent),
  canActivate: [carInformationGuard]
}
```

### Effort
- Development: 8 Stunden
- Testing: 3 Stunden

---

## 15. Dependencies

**Requires:**
- REQ-001: Header (Accessibility, Navigation)
- REQ-002: Markenauswahl (`selectedBrand` im Store)
- REQ-003: Standortwahl (`selectedLocation` im Store)
- REQ-004: Serviceauswahl (`selectedServices` im Store)
- REQ-006: Terminauswahl (`selectedAppointment` im Store, "Weiter"-Button navigiert hierher)
- REQ-007: WizardStateSync (`onBack()` setzt `selectedAppointment` auf `null`)
- REQ-008: Werkstattkalender ("Weiter"-Button navigiert hierher — alternativer Eingangspunkt)

**Blocks:**
- REQ-010+: Buchungsübersicht (benötigt `customerInfo`, `vehicleInfo`, `privacyConsent`)

---

## 16. Naming Glossary

### Container Methods
- `onSubmit()` — Formular validieren, Store befüllen, zur Buchungsübersicht navigieren
- `onBack()` — `selectedAppointment` nullen (REQ-007), zu `/home/appointment` navigieren
- `onRetrieveData()` — „Jetzt Daten abrufen!" (Click-Dummy, kein API-Call)

### Presentational Outputs
- `customerFormChange` — `OutputEmitterRef<CustomerInfo | null>` — laufende Formularwerte
- `vehicleFormChange` — `OutputEmitterRef<VehicleInfo | null>`
- `formValidityChange` — `OutputEmitterRef<boolean>` — Formular gültig ja/nein

### Signal Store (Erweiterung BookingStore)
- `setCustomerInfo(info: CustomerInfo)` — Kundendaten speichern
- `setVehicleInfo(info: VehicleInfo)` — Fahrzeugdaten speichern
- `setPrivacyConsent(consent: boolean)` — DSGVO-Einwilligung speichern

### Computed Signals (Erweiterung BookingStore)
- `hasCustomerInfo` — `boolean` — `customerInfo !== null`
- `hasVehicleInfo` — `boolean` — `vehicleInfo !== null`
- `isBookingComplete` — `boolean` — alle Wizard-Felder inkl. Einwilligung vorhanden

### Guard
- `carInformationGuard` — Functional Guard (`CanActivateFn`)

### Custom Validators
- `lettersOnlyValidator` — nur Buchstaben inkl. Umlaute
- `digitsOnlyValidator` — nur Ziffern
- `startsWithZeroValidator` — beginnt mit 0
- `vinValidator` — genau 17 alphanumerische Zeichen

---

## 17. i18n Keys

```typescript
// Ergänzung in src/app/core/i18n/translations.ts unter booking:

// DE:
carinformation: {
  title: 'Bitte geben Sie uns letzte Informationen rund um Ihren Termin',
  returningCustomer: {
    title: 'Schon einmal bei uns gewesen?',
    description: 'Dann rufen Sie Ihre Daten automatisch mit Eingabe Ihrer E-Mail-Adresse ab.',
    button: 'Jetzt Daten abrufen!'
  },
  form: {
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

// EN:
carinformation: {
  title: 'Please provide us with final information about your appointment',
  returningCustomer: {
    title: 'Been with us before?',
    description: 'Retrieve your data automatically by entering your email address.',
    button: 'Retrieve my data!'
  },
  form: {
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
}
```

---

## 18. Implementation Notes

**WICHTIG: Code muss BILINGUAL sein!**

- Kommentare DE + EN
- Error Messages über i18n Keys (kein Hardcoding)
- JSDoc bilingual
- Alle i18n-Keys müssen in `translations.ts` unter `booking.carinformation` registriert werden

**Formular-Pattern (Reactive Forms, kein ngModel):**
```typescript
// Container erstellt FormGroup, übergibt via input() an Presentational
// Presentational emittiert Änderungen via output()
// Container subscribet Store, zeigt gespeicherte Werte beim Re-Besuch
```

**Navigation von Vorgänger-Schritten:**
- Bei Implementierung von REQ-009 müssen die `onContinue()`-Methoden in REQ-006 (Terminauswahl) und REQ-008 (Werkstattkalender) auf `/home/carinformation` umgebogen werden
- REQ-006: `appointment-container.component.ts` → `onContinue()` navigiert zu `/home/carinformation`
- REQ-008: `workshop-calendar-container.component.ts` → `onContinue()` navigiert zu `/home/carinformation`

**Store-Erweiterung:**
- `BookingState` um `customerInfo`, `vehicleInfo`, `privacyConsent` erweitern
- `INITIAL_STATE` mit `null` / `false` initialisieren
- `resetBooking()` muss die neuen Felder ebenfalls zurücksetzen
