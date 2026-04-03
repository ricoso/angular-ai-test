# REQ-010: Buchungsübersicht

**Status:** Draft
**Priority:** High
**Type:** Functional
**Created:** 2026-03-09
**Author:** Claude Code
**Wizard-Schritt:** Letzter Schritt (nach carinformation REQ-009)

---

## 1. Overview

### 1.1 Purpose
Der Benutzer erhält eine strukturierte Übersicht aller im Buchungs-Wizard gemachten Eingaben, bevor er die Buchungsanfrage endgültig absendet. Die Seite ist der letzte Schritt im Buchungs-Wizard der Online-Terminvereinbarung bei der Autohaus GmbH und ermöglicht dem Nutzer, alle Angaben vor dem Absenden zu prüfen und bei Bedarf zurückzunavigieren.

### 1.2 Scope
**Included:**
- Seitenüberschrift „Übersicht" mit Untertext „Bitte prüfen Sie Ihre Angaben bevor Sie den Termin versenden."
- Kachel „Wunschtermin" — zeigt Datum und Uhrzeit des gewählten Termins
- Kachel „Gewählter Service" — listet alle gewählten Services mit Varianten
- Kachel „Persönliche Daten" — zeigt Kundendaten (Name, Straße, Ort, Telefon, E-Mail) und Fahrzeugdaten (Marke, Kennzeichen, Kilometerstand)
- Preisanzeige — zeigt Gesamtpreis inkl. Mehrwertsteuer (statisch / simuliert)
- Navigation: Zurück-Button (zur carinformation-Seite) + „Jetzt anfragen"-Button (Submit der Buchung)
- Guard: Prüft ob alle Wizard-Daten inkl. `customerInfo`, `vehicleInfo`, `privacyConsent` vorhanden sind

**Excluded:**
- Tatsächlicher API-Call zur Buchungsanlage (Click-Dummy — simulierter Submit)
- Buchungsabschluss-Seite (folgendes Requirement)
- Bearbeitungsnavigation zu einzelnen Wizard-Schritten (kein „Bearbeiten"-Button pro Kachel)
- Preisberechnung auf Basis realer Servicedaten (statischer Beispielpreis)

### 1.3 Related Requirements
- REQ-001: Header (Warenkorb-Icon zeigt gewählte Services)
- REQ-002: Markenauswahl (liefert `selectedBrand`)
- REQ-003: Standortwahl (liefert `selectedLocation`)
- REQ-004: Serviceauswahl (liefert `selectedServices`)
- REQ-006: Terminauswahl (liefert `selectedAppointment`)
- REQ-007: WizardStateSync (definiert `onBack()`-Verhalten)
- REQ-009: carinformation (direkter Vorgänger — liefert `customerInfo`, `vehicleInfo`, `privacyConsent`)

---

## 2. User Story

**Als** Kunde
**möchte ich** vor dem Absenden meiner Buchungsanfrage alle meine gemachten Angaben übersichtlich prüfen können
**damit** ich sichergehen kann, dass alle Daten korrekt sind, bevor der Termin angefragt wird.

**Acceptance Criteria:**
- [ ] AC-1: Seite zeigt Überschrift „Übersicht" und Untertext „Bitte prüfen Sie Ihre Angaben bevor Sie den Termin versenden."
- [ ] AC-2: Kachel „Wunschtermin" zeigt Datum und Uhrzeit des gewählten Termins aus dem BookingStore
- [ ] AC-3: Kachel „Gewählter Service" listet alle gewählten Services (inkl. Variante bei Räderwechsel)
- [ ] AC-4: Kachel „Persönliche Daten" zeigt Name, Straße, Ort, Telefon, E-Mail, Marke, Kennzeichen sowie Kilometerstand
- [ ] AC-5: Kachel "Hinweise & Optionen" zeigt Mobilitätsoption, Terminpräferenz, Rückruf und Nachricht aus der Hinweisseite (REQ-012)
- [ ] AC-6: Zurück-Button navigiert zur carinformation-Seite
- [ ] AC-7: „Jetzt anfragen"-Button sendet die simulierte Buchung ab und navigiert zum Buchungsabschluss
- [ ] AC-8: Guard verhindert Direktaufruf ohne vollständige Store-Daten — Redirect zu `/home`
- [ ] AC-9: Alle Kacheln sind auf Mobile (<48em) einspaltig gestapelt
- [ ] AC-10: Jede Kachel hat eine Überschrift und ist klar vom übrigen Inhalt abgegrenzt

---

## 3. Preconditions

### 3.1 System
- BookingStore verfügbar und mit allen Wizard-Daten befüllt
- Header-Component (REQ-001) aktiv

### 3.2 User
- Benutzer hat alle vorherigen Wizard-Schritte (REQ-002–REQ-009) durchlaufen
- Benutzer ruft `/home/booking-overview` auf

### 3.3 Data
- Statische Click-Dummy-Seite — kein API-Call beim Laden
- Kein Login erforderlich

### 3.4 Übergabe (Input aus vorherigen Wizard-Schritten)
| Feld | Typ | Quelle | Pflicht |
|------|-----|--------|---------|
| `BookingStore.selectedBrand` | `Brand` | REQ-002 | **Ja** — Guard prüft, redirect zu `/home` wenn leer |
| `BookingStore.selectedLocation` | `LocationDisplay` | REQ-003 | **Ja** — Guard prüft |
| `BookingStore.selectedServices` | `SelectedService[]` | REQ-004 | **Ja** — Guard prüft, mind. 1 Service |
| `BookingStore.selectedAppointment` | `AppointmentSlot` | REQ-006 | **Ja** — Guard prüft |
| `BookingStore.customerInfo` | `CustomerInfo` | REQ-009 | **Ja** — Guard prüft |
| `BookingStore.vehicleInfo` | `VehicleInfo` | REQ-009 | **Ja** — Guard prüft |
| `BookingStore.privacyConsent` | `boolean` | REQ-009 | **Ja** — Guard prüft (`=== true`) |

---

## 4. Main Flow

![Buchungsübersicht](./mockup.png)

**Step 1:** Seite wird geladen
- **System:** Guard prüft alle 7 Store-Felder (Brand, Location, Services, Appointment, CustomerInfo, VehicleInfo, PrivacyConsent)
- **System:** Bei fehlendem Feld — Redirect zu `/home`
- **System:** Zeigt Überschrift, Untertext und alle Kacheln mit Store-Daten befüllt

**Step 2:** Benutzer prüft Angaben
- **User:** Liest Kacheln und prüft Wunschtermin, Services, Persönliche Daten und Preis
- **System:** Alle Daten werden read-only aus dem BookingStore angezeigt — keine Eingabe möglich

**Step 3:** Benutzer klickt „Zurück"
- **User:** Klickt sekundären Zurück-Button links unten
- **System:** Navigiert zurück zu `/home/carinformation` (REQ-009)
- **System:** Store-Daten bleiben unverändert erhalten

**Step 4:** Benutzer klickt „Jetzt anfragen"
- **User:** Klickt primären Submit-Button rechts unten
- **System:** Simuliert Buchungsabschluss (Click-Dummy — kein HTTP-Request)
- **System:** Setzt `BookingStore.bookingSubmitted = true`
- **System:** Navigiert zur Buchungsabschluss-Seite (nächster Wizard-Schritt)

---

## 5. Alternative Flows

### 5.1 Zurück zur carinformation-Seite

**Trigger:** Benutzer klickt „Zurück"-Button

**Flow:**
1. System navigiert zu `/home/carinformation`
2. Store-Daten bleiben unverändert erhalten
3. Benutzer kann Angaben in carinformation korrigieren

### 5.2 Benutzer kehrt von Buchungsabschluss zurück (Browser-Zurück)

**Trigger:** Benutzer verwendet Browser-Zurück-Button nach Absenden

**Flow:**
1. Guard prüft Store — alle Felder noch vorhanden
2. Seite bleibt zugänglich (kein Redirect)
3. „Jetzt anfragen"-Button bleibt aktiv (Click-Dummy erlaubt erneutes Senden)

---

## 6. Exception Flows

### 6.1 Vorherige Wizard-Schritte nicht abgeschlossen

**Trigger:** Direktaufruf `/home/booking-overview` ohne vollständige Store-Daten

**Flow:**
1. `bookingOverviewGuard` prüft alle 7 Pflichtfelder im BookingStore
2. Bei fehlendem Wert: Redirect zu `/home` (Wizard-Anfang)
3. Benutzer muss Wizard von vorn durchlaufen

### 6.2 Store-Daten inkonsistent (z.B. nach App-Reload)

**Trigger:** Benutzer lädt die Seite neu (F5) — Store-Daten verloren

**Flow:**
1. Guard erkennt fehlende Store-Daten
2. Redirect zu `/home`
3. Benutzer muss Wizard neu starten

---

## 7. Postconditions

### 7.1 Erfolg (Submit)
Folgende Felder werden im BookingStore gesetzt:

| Store-Feld | Typ | Beschreibung |
|------------|-----|-------------|
| `BookingStore.bookingSubmitted` | `boolean` | `true` — Buchung wurde abgesendet |

System navigiert zur Buchungsabschluss-Seite.

### 7.2 Abbruch (Zurück)
- Keine Store-Änderung
- Navigation zu `/home/carinformation`
- Alle Eingaben bleiben im Store erhalten

### 7.3 Misserfolg (Guard)
- Keine Store-Änderung
- Redirect zu `/home`

---

## 8. Business Rules

- **BR-1:** Alle 7 Pflichtfelder im BookingStore müssen befüllt sein — `bookingOverviewGuard` erzwingt dies
- **BR-2:** `privacyConsent` muss `true` sein — ohne Einwilligung ist die Seite über den Guard nicht erreichbar
- **BR-3:** Die Übersichtsseite ist read-only — keine Bearbeitungsfunktion für einzelne Felder
- **BR-4:** Der Preis wird statisch angezeigt (Click-Dummy) — keine dynamische Berechnung aus Services
- **BR-5:** „Jetzt anfragen" ist IMMER aktiv (kein Disabled-State) — Daten wurden bereits in REQ-009 validiert
- **BR-6:** Wunschtermin wird im Format „DD.MM.YYYY, HH:mm Uhr" dargestellt
- **BR-7:** Mehrere gewählte Services werden als Aufzählung in der Kachel angezeigt (inkl. Variante)
- **BR-8:** Die Marke wird als Klartext (z.B. „Mercedes-Benz") angezeigt, nicht als technischer Key
- **BR-9:** `resetBooking()` darf NICHT durch das Absenden ausgelöst werden — erst nach Anzeige der Bestätigungsseite

---

## 9. Non-Functional Requirements

### Performance
- Seiten-Rendering < 200ms (alle Daten kommen aus dem Store — kein API-Call)
- Keine asynchronen Ladezustände erforderlich
- Lighthouse Performance > 90

### Security
- Kein `[innerHTML]` — nur Angular Template Escaping
- Keine sensiblen Daten in URL-Parametern
- Keine Übertragung von Daten an Dritte (Click-Dummy)
- Kein `eval`, kein direktes DOM-Manipulieren

### Usability
- Mobile-First: Kacheln auf Mobile (<48em) gestapelt (1 Spalte)
- Desktop (>=48em): Kacheln in 2x2-Grid
- WCAG 2.1 AA: Überschriften korrekt (`<h1>`, `<h2>`), `aria-label` auf Kacheln
- Touch-Targets: mind. 2.75em (44px) für Buttons
- Kontrast: 4.5:1
- Focus-Styles: `:focus-visible` sichtbar
- Browser Support: aktuelle 2 Versionen Chrome, Firefox, Safari, Edge

---

## 10. Data Model

```typescript
// Erweiterung BookingState in src/app/features/booking/stores/booking.store.ts:
// (CustomerInfo, VehicleInfo bereits in REQ-009 definiert — hier referenziert)

// Neues Feld für Buchungsabschluss-Status:
interface BookingState {
  // ...bestehende Felder aus REQ-009...

  // NEU in REQ-010:
  bookingSubmitted: boolean;
}

const INITIAL_STATE: BookingState = {
  // ...bestehende Initialwerte...
  bookingSubmitted: false,
};
```

```typescript
// src/app/features/booking/models/appointment.model.ts
// (NEU — wird von REQ-006/008 und REQ-010 genutzt)

/** Appointment slot as stored in BookingStore */
export interface AppointmentSlot {
  date: string;        // ISO date string, e.g. '2026-04-15'
  time: string;        // Time string, e.g. '10:00'
  displayDate: string; // Display format, e.g. '15.04.2026'
  displayTime: string; // Display format, e.g. '10:00 Uhr'
}
```

---

## 11. UI/UX

### Mockup
![Buchungsübersicht](./mockup.png)

### Seitenstruktur
1. **Header** (REQ-001) — Logo + Warenkorb + Accessibility
2. **Seitenüberschrift** — „Übersicht" (h1)
3. **Untertext** — „Bitte prüfen Sie Ihre Angaben bevor Sie den Termin versenden." (p)
4. **Kachel 1** — „Wunschtermin" (Datum + Uhrzeit)
5. **Kachel 2** — „Gewählter Service" (Service-Liste)
6. **Kachel 3** — „Persönliche Daten" (Kundendaten + Fahrzeugdaten)
7. **Preisanzeige** — Gesamtpreis inkl. MwSt.
8. **Navigationsleiste** — Zurück (sekundär, links) | Jetzt anfragen (primär, rechts)
9. **Footer**

### Kachel-Inhalte
| Kachel | Überschrift | Angezeigte Felder |
|--------|-------------|-------------------|
| 1 | Wunschtermin | `displayDate`, `displayTime` |
| 2 | Gewählter Service | Service-Titel(n) aus `selectedServices` (inkl. Variante) |
| 3 | Persönliche Daten | Vorname + Nachname, Straße, PLZ + Ort, Telefon, E-Mail, Marke, Kennzeichen, Kilometerstand |
| 4 | Hinweise & Optionen | Mobilitätsoption, Terminpräferenz, Rückruf, Nachricht (aus Hinweisseite REQ-012) |

### Material Components
- `MatCard` für jede Kachel
- `MatButton` (`mat-flat-button`) für beide Navigations-Buttons
- `MatIcon` mit `.icon-framed` für Kachel-Icons
- Keine Formulare — rein read-only Ansicht

### Layout (Desktop >= 48em)
- 2-Spalten-Grid: Kachel 1 (oben links), Kachel 2 (oben rechts), Kachel 3 (unten links), Hinweise & Optionen (unten rechts)
- Navigationsleiste: `display: flex; justify-content: space-between`

### Layout (Mobile < 48em)
- Alle Kacheln einspaltig gestapelt
- Navigations-Buttons nebeneinander (space-between)

---

## 12. API Specification

Click-Dummy — kein HTTP-Request. Buchungsabschluss wird simuliert.

```typescript
// Neue Store-Methode (withMethods in booking.store.ts):

submitBooking(): void
// Setzt bookingSubmitted = true
// Click-Dummy: kein API-Call, keine HTTP-Anfrage
// patchState(store, { bookingSubmitted: true })
```

**Zukünftiger POST-Endpunkt (Produktiv-Version):**
```http
POST /api/appointments
Content-Type: application/json

{
  "brand": "mercedes",
  "locationId": "stu",
  "services": [{ "serviceId": "huau", "variantId": null }],
  "appointmentDate": "2026-04-15T10:00:00",
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

**Success (201):**
```json
{ "confirmationNumber": "GS-2026-00042", "message": "Your appointment has been successfully booked." }
```

---

## 13. Test Cases

### TC-1: Happy Path — Vollständige Übersicht anzeigen
- **Given:** Alle Wizard-Schritte abgeschlossen, BookingStore mit allen Feldern befüllt
- **When:** Benutzer navigiert zu `/home/booking-overview`
- **Then:** Alle Kacheln zeigen die korrekten Store-Daten an

### TC-2: Wunschtermin-Kachel — Datum und Uhrzeit korrekt
- **Given:** `selectedAppointment = { displayDate: '15.04.2026', displayTime: '10:00 Uhr' }`
- **When:** Seite geladen
- **Then:** Kachel „Wunschtermin" zeigt „15.04.2026" und „10:00 Uhr"

### TC-3: Service-Kachel — mehrere Services
- **Given:** `selectedServices = [{ serviceId: 'huau' }, { serviceId: 'inspection' }]`
- **When:** Seite geladen
- **Then:** Kachel „Gewählter Service" listet „HU/AU" und „Inspektion" auf

### TC-4: Service-Kachel — Räderwechsel mit Variante
- **Given:** `selectedServices = [{ serviceId: 'tire-change', selectedVariantId: 'with-storage' }]`
- **When:** Seite geladen
- **Then:** Kachel zeigt „Räderwechsel mit Einlagerung"

### TC-5: Persönliche-Daten-Kachel — alle Felder
- **Given:** `customerInfo` und `vehicleInfo` vollständig im Store
- **When:** Seite geladen
- **Then:** Name, Straße, Ort, Telefon, E-Mail, Marke, Kennzeichen und Kilometerstand korrekt angezeigt

### TC-6: „Jetzt anfragen"-Button — Klick
- **Given:** Alle Store-Daten vorhanden, Seite geladen
- **When:** Benutzer klickt „Jetzt anfragen"
- **Then:** `BookingStore.bookingSubmitted = true`, Navigation zur Buchungsabschluss-Seite

### TC-7: „Zurück"-Button — Klick
- **Given:** Seite geladen
- **When:** Benutzer klickt „Zurück"
- **Then:** Navigation zu `/home/carinformation`, Store-Daten unverändert

### TC-8: Guard-Redirect — fehlende customerInfo
- **Given:** `BookingStore.customerInfo === null`, direkter Aufruf `/home/booking-overview`
- **When:** Route geladen
- **Then:** Redirect zu `/home`

### TC-9: Guard-Redirect — privacyConsent false
- **Given:** `BookingStore.privacyConsent === false`, direkter Aufruf
- **When:** Route geladen
- **Then:** Redirect zu `/home`

### TC-10: Responsive — Mobile Layout
- **Given:** Viewport < 48em
- **When:** Seite gerendert
- **Then:** Alle Kacheln einspaltig gestapelt, keine horizontale Überlappung

### TC-11: Markenname — Klartextanzeige
- **Given:** `selectedBrand = 'mercedes'`
- **When:** Seite geladen
- **Then:** Kachel zeigt „Mercedes-Benz", nicht den technischen Key „mercedes"

---

## 14. Implementation

### Folder-Struktur
```
src/app/features/booking/
├── models/
│   ├── customer.model.ts          # Bereits aus REQ-009: CustomerInfo, VehicleInfo, Salutation
│   └── appointment.model.ts       # NEU (oder aus REQ-006/008): AppointmentSlot
├── stores/
│   └── booking.store.ts           # ERWEITERN: bookingSubmitted + submitBooking()
└── components/
    └── booking-overview/
        ├── booking-overview-container.component.ts
        ├── booking-overview-container.component.html
        ├── booking-overview-container.component.scss
        └── components/
            ├── appointment-tile/
            │   ├── appointment-tile.component.ts
            │   ├── appointment-tile.component.html
            │   └── appointment-tile.component.scss
            ├── services-tile/
            │   ├── services-tile.component.ts
            │   ├── services-tile.component.html
            │   └── services-tile.component.scss
            ├── personal-data-tile/
            │   ├── personal-data-tile.component.ts
            │   ├── personal-data-tile.component.html
            │   └── personal-data-tile.component.scss
            └── price-tile/
                ├── price-tile.component.ts
                ├── price-tile.component.html
                └── price-tile.component.scss
```

### Guards
```
src/app/features/booking/guards/
└── booking-overview.guard.ts    # Functional CanActivateFn — prüft alle 7 Store-Felder
```

### Route (Ergänzung in booking.routes.ts)
```typescript
{
  path: 'booking-overview',
  loadComponent: () => import('./components/booking-overview/booking-overview-container.component')
    .then(m => m.BookingOverviewContainerComponent),
  canActivate: [bookingOverviewGuard]
}
```

### Effort
- Development: 5 Stunden
- Testing: 2 Stunden

---

## 15. Dependencies

**Requires:**
- REQ-001: Header (Accessibility, Navigation)
- REQ-002: Markenauswahl (`selectedBrand` im Store)
- REQ-003: Standortwahl (`selectedLocation` im Store)
- REQ-004: Serviceauswahl (`selectedServices` im Store)
- REQ-006: Terminauswahl (`selectedAppointment` im Store)
- REQ-007: WizardStateSync (`onBack()`-Verhalten)
- REQ-009: carinformation (`customerInfo`, `vehicleInfo`, `privacyConsent` im Store)

**Blocks:**
- REQ-011+: Buchungsabschluss (benötigt `bookingSubmitted === true` und alle Store-Daten)

---

## 16. Naming Glossary

### Container Methods
- `onSubmit()` — simulierten Submit ausführen, `submitBooking()` im Store aufrufen, zur Buchungsabschluss-Seite navigieren
- `onBack()` — zu `/home/carinformation` navigieren (Store-Daten bleiben erhalten)

### Presentational Inputs
- `appointment` — `input<AppointmentSlot>()` — für `AppointmentTileComponent`
- `services` — `input<SelectedService[]>()` — für `ServicesTileComponent`
- `serviceLabels` — `input<Record<string, string>>()` — aufgelöste Service-Bezeichnungen für `ServicesTileComponent`
- `customerInfo` — `input<CustomerInfo>()` — für `PersonalDataTileComponent`
- `vehicleInfo` — `input<VehicleInfo>()` — für `PersonalDataTileComponent`
- `brandName` — `input<string>()` — aufgelöster Markenname für `PersonalDataTileComponent`
- `locationName` — `input<string>()` — aufgelöster Standortname für `PersonalDataTileComponent`
- `totalPriceGross` — `input<string>()` — für `PriceTileComponent`

### Signal Store (Erweiterung BookingStore)
- `submitBooking()` — setzt `bookingSubmitted = true`
- `isBookingComplete` — `computed()` — alle Wizard-Felder vorhanden
- `hasBookingSubmitted` — `computed()` — `bookingSubmitted === true`

### Guard
- `bookingOverviewGuard` — Functional Guard (`CanActivateFn`) — prüft alle 7 Pflichtfelder

### Computed Signals im Container
- `resolvedBrandName` — `computed()` — leitet `selectedBrand` auf Klartext-Namen ab
- `resolvedLocationName` — `computed()` — leitet `selectedLocation.name` auf Anzeigename ab
- `resolvedServiceLabels` — `computed()` — mappt `selectedServices` auf menschenlesbare Bezeichnungen inkl. Varianten
- `staticTotalPrice` — `computed()` — gibt statischen Preis-String zurück (Click-Dummy)

---

## 17. i18n Keys

```typescript
// Ergänzung in src/app/core/i18n/translations.ts unter booking:

// DE:
bookingOverview: {
  title: 'Übersicht',
  subtitle: 'Bitte prüfen Sie Ihre Angaben bevor Sie den Termin versenden.',
  tiles: {
    appointment: {
      title: 'Wunschtermin',
      dateLabel: 'Datum',
      timeLabel: 'Uhrzeit',
    },
    services: {
      title: 'Gewählter Service',
    },
    personalData: {
      title: 'Persönliche Daten',
      nameLabel: 'Name',
      streetLabel: 'Straße',
      cityLabel: 'Ort',
      phoneLabel: 'Telefon',
      emailLabel: 'E-Mail',
      brandLabel: 'Marke',
      licensePlateLabel: 'Kennzeichen',
      mileageLabel: 'Kilometerstand',
      mileageUnit: 'km',
    },
    price: {
      title: 'Preis',
      vatIncluded: 'inkl. MwSt.',
      staticPrice: '€ 89,00',
    },
  },
  navigation: {
    back: 'Zurück',
    submit: 'Jetzt anfragen',
  },
},

// EN:
bookingOverview: {
  title: 'Overview',
  subtitle: 'Please review your details before submitting the appointment.',
  tiles: {
    appointment: {
      title: 'Desired Appointment',
      dateLabel: 'Date',
      timeLabel: 'Time',
    },
    services: {
      title: 'Selected Service',
    },
    personalData: {
      title: 'Personal Details',
      nameLabel: 'Name',
      streetLabel: 'Street',
      cityLabel: 'City',
      phoneLabel: 'Phone',
      emailLabel: 'Email',
      brandLabel: 'Brand',
      licensePlateLabel: 'License Plate',
      mileageLabel: 'Mileage',
      mileageUnit: 'km',
    },
    price: {
      title: 'Price',
      vatIncluded: 'incl. VAT',
      staticPrice: '€ 89.00',
    },
  },
  navigation: {
    back: 'Back',
    submit: 'Request Now',
  },
},
```
