# Feature-Dokumentation: Kundendaten & Fahrzeuginformationen (REQ-009)

**Erstellt:** 2026-03-05
**Requirement:** REQ-009-carinformation
**Sprache:** DE
**Status:** Implementiert

---

## Übersicht

Das Feature "Kundendaten & Fahrzeuginformationen" ist der 6. Schritt (von 8) im Buchungs-Wizard der Online-Terminvereinbarung bei Gottfried Schultz. Der Nutzer erfasst hier seine persönlichen Kontaktdaten sowie fahrzeugbezogene Informationen, bevor er zur Buchungsübersicht weitergeleitet wird.

Die Seite besteht aus einem Banner für wiederkehrende Kunden ("Schon einmal bei uns gewesen?"), zwei Formular-Abschnitten (Kundendaten und Fahrzeugdaten), einer DSGVO-Einwilligungs-Checkbox und den Navigations-Buttons Zurück und Zur Buchungsübersicht.

---

## Benutzerführung

### Schritt 1: Seite laden

**Beschreibung:** Der Nutzer gelangt von Schritt 5 (Terminauswahl, REQ-006 oder Werkstattkalender REQ-008) hierher. Der Guard `carInformationGuard` prüft, ob alle erforderlichen Store-Felder (Brand, Standort, Services, Termin) gesetzt sind. Fehlt eines dieser Felder, erfolgt eine automatische Weiterleitung an den entsprechenden Wizard-Schritt. Bei vollständigen Vorbedingungen wird die Seite mit dem leerem Formular angezeigt — oder mit vorausgefüllten Werten, falls der Nutzer die Seite bereits besucht hatte.

### Schritt 2: Kundendaten ausfüllen

**Beschreibung:** Der Nutzer füllt die Pflichtfelder des Abschnitts "Kundendaten" aus: E-Mail-Adresse, Anrede (Dropdown: Herr / Frau), Vorname, Nachname, Straße und Hausnummer, Postleitzahl, Wohnort sowie Mobilfunknummer. Fehlermeldungen erscheinen inline direkt unter dem jeweiligen Feld, sobald das Feld verlassen wird (on-blur-Validierung).

### Schritt 3: Fahrzeugdaten ausfüllen

**Beschreibung:** Der Nutzer gibt Kfz-Kennzeichen, Kilometerstand und FIN (Fahrzeugidentifikationsnummer) ein. Neben dem FIN-Feld befindet sich ein Info-Link "Erklärung der FIN" (Click-Dummy-Platzhalter). Alle Fahrzeugfelder sind Pflichtfelder mit Format-Validierung.

### Schritt 4: DSGVO-Einwilligung akzeptieren

**Beschreibung:** Der Nutzer setzt das Häkchen bei der DSGVO-Einwilligungs-Checkbox. Der Text enthält einen Link zur Datenschutzerklärung. Erst mit gesetztem Häkchen ist die Formularabgabe möglich — ohne Häkchen erscheint eine Fehlermeldung.

### Schritt 5: Formular abschicken

**Beschreibung:** Der Nutzer klickt den primären Button "Zur Buchungsübersicht". Das System validiert alle Felder vollständig (markAllAsTouched). Bei Erfolg werden `customerInfo`, `vehicleInfo` und `privacyConsent` im BookingStore gespeichert und zur Buchungsübersicht navigiert. Bei Validierungsfehlern verbleibt der Nutzer auf der Seite; alle fehlerhaften Felder werden mit Inline-Fehlermeldungen markiert.

---

## Responsive Ansichten

### Desktop (1280x720)
![Desktop](./screenshots/e2e-responsive-desktop.png)

Auf dem Desktop werden mehrspaltige Zeilen verwendet: Anrede / Vorname / Nachname (25% / 37,5% / 37,5%), Postleitzahl / Wohnort (30% / 70%) sowie Kfz-Kennzeichen / Kilometerstand (50% / 50%). Der Banner nimmt die volle Breite ein.

### Tablet (768x1024)
![Tablet](./screenshots/e2e-responsive-tablet.png)

Auf dem Tablet (>= 48em) bleibt das mehrspaltige Layout erhalten. Abstände und Schriftgrößen werden leicht angepasst.

### Mobile (375x667)
![Mobile](./screenshots/e2e-responsive-mobile.png)

Auf Mobile (< 48em) sind alle Zeilen einspaltig. Anrede, Vorname und Nachname stehen untereinander. Touch-Targets haben eine Mindestgröße von 2,75em (44px).

---

## Barrierefreiheit

- **Tastaturnavigation:** Alle Formularfelder sind per Tab erreichbar. Die Reihenfolge folgt dem visuellen Formularfluss (E-Mail -> Anrede -> Vorname -> ... -> FIN -> Checkbox -> Zurück -> Weiter).
- **Screen Reader:** Alle Inputs haben `<label for="">` und `id`-Attribute. Pflichtfelder sind mit `aria-required="true"` ausgezeichnet. Fehlermeldungen sind über `aria-describedby` mit den Feldern verknüpft. Die DSGVO-Fehlermeldung hat `role="alert"` fur sofortige Ankündigung.
- **Farbkontrast:** WCAG 2.1 AA konform (Kontrastverhältnis min. 4.5:1).
- **Focus-Styles:** Sichtbare `:focus-visible`-Styles an allen interaktiven Elementen.
- **Icons:** Alle Icons haben `aria-hidden="true"` und `.icon-framed`-Rahmen.

---

## Validierungsregeln

| Feld | Validierung | Fehlermeldung |
|------|-------------|---------------|
| E-Mail Adresse | Pflichtfeld, gültiges E-Mail-Format | "Bitte geben Sie eine gültige E-Mail-Adresse ein." |
| Anrede | Pflichtfeld (Auswahl: Herr / Frau) | "Bitte wählen Sie eine Anrede." |
| Vorname | Pflichtfeld, nur Unicode-Buchstaben inkl. Umlaute, Leerzeichen, Bindestriche | "Vorname darf nur Buchstaben enthalten." |
| Nachname | Pflichtfeld, nur Unicode-Buchstaben inkl. Umlaute, Leerzeichen, Bindestriche | "Nachname darf nur Buchstaben enthalten." |
| Straße und Haus Nr. | Pflichtfeld, Freitext | "Bitte geben Sie Ihre Straße und Hausnummer ein." |
| Postleitzahl | Pflichtfeld, genau 5 Ziffern (`^\d{5}$`) | "Postleitzahl darf nur Zahlen enthalten." |
| Wohnort | Pflichtfeld, nur Buchstaben inkl. Umlaute, Leerzeichen, Bindestriche | "Wohnort darf nur Buchstaben enthalten." |
| Mobilfunknummer | Pflichtfeld, Ziffern, muss mit `0` beginnen (`^0[0-9]+$`) | "Die Mobilfunknummer muss mit 0 beginnen." |
| Kfz-Kennzeichen | Pflichtfeld, Format `^[A-ZÄÖÜ]{1,3}-[A-Z]{1,2}\d{1,4}$` | "Bitte geben Sie ein gültiges Kennzeichen ein (z.B. B-MS1234)." |
| Kilometerstand | Pflichtfeld, nur Ziffern, min. 0 | "Kilometerstand darf nur Zahlen enthalten." |
| FIN | Optional, genau 17 alphanumerische Zeichen (`^[A-HJ-NPR-Z0-9]{17}$`) | "Die FIN muss genau 17 Zeichen enthalten." |
| DSGVO Einwilligung | Pflichtfeld (`requiredTrue`) | "Bitte bestätigen Sie die Datenschutzerklärung." |

---

## Guard-Verhalten

Der `carInformationGuard` (Functional Guard, `CanActivateFn`) schützt die Route `/#/home/carinformation`. Er prüft die folgenden Store-Felder sequenziell:

| Prüfung | Bei Fehlen: Redirect zu |
|---------|-------------------------|
| `hasBrandSelected()` | `/#/home/brand` |
| `hasLocationSelected()` | `/#/home/location` |
| `hasServicesSelected()` | `/#/home/services` |
| `hasAppointmentSelected()` | `/#/home/appointment` |

Ein Direktaufruf der Route ohne vollständig abgeschlossene Vorgänger-Schritte ist damit nicht möglich. Der Guard leitet den Nutzer automatisch an den ersten fehlenden Schritt weiter.

---

## Alternative Flows

### Zurück-Navigation

Klick auf den "Zurück"-Button setzt `selectedAppointment` im BookingStore auf `null` (gemäß REQ-007 WizardStateSync) und navigiert zu `/home/appointment`. Falls der Nutzer über den Werkstattkalender (REQ-008) gekommen ist, wird entsprechend zu `/home/workshop-calendar` navigiert.

### Banner — Bestehender Kunde (Click-Dummy)

Der Banner "Schon einmal bei uns gewesen?" zeigt einen Button "Jetzt Daten abrufen!". Ein Klick registriert das Ereignis (Debug-Log), hat aber keine weitere Wirkung — der automatische Datenabruf ist als Click-Dummy-Platzhalter implementiert (zukünftige Produktiv-Funktion).

### Info-Link FIN (Click-Dummy)

Der Link "Erklärung der FIN" neben dem FIN-Eingabefeld ist ein Click-Dummy-Platzhalter (`href="#"`). Bei Klick wird nur ein Debug-Log ausgegeben.

---

## Technische Details

| Eigenschaft | Wert |
|-------------|------|
| Route | `/#/home/carinformation` |
| Container Component | `CarinformationContainerComponent` |
| Customer Form Component | `CustomerFormComponent` |
| Vehicle Form Component | `VehicleFormComponent` |
| Guard | `carInformationGuard` (Functional Guard) |
| Store | `BookingStore` (NgRx Signal Store) |
| State-Erweiterung | `customerInfo: CustomerInfo \| null`, `vehicleInfo: VehicleInfo \| null`, `privacyConsent: boolean` |
| Change Detection | `OnPush` (alle Komponenten) |
| Form-Handling | Angular Reactive Forms (kein ngModel) |
| i18n Keys | `booking.carinformation.*` |

### Store-Methoden (Erweiterung BookingStore)

```typescript
setCustomerInfo(info: CustomerInfo): void
setVehicleInfo(info: VehicleInfo): void
setPrivacyConsent(consent: boolean): void
clearCarInformation(): void
```

### Datenmodell

```typescript
// src/app/features/booking/models/customer.model.ts

export type Salutation = 'mr' | 'ms';

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

export interface VehicleInfo {
  licensePlate: string;
  mileage: number;
  vin: string;
}
```
