# Feature-Dokumentation: Kunden- & Fahrzeugdaten (Carinformation)

**Erstellt:** 2026-02-26
**Requirement:** REQ-009-carinformation
**Sprache:** DE
**Status:** Implementiert

---

## Übersicht

Der Benutzer gibt im sechsten Wizard-Schritt seine persönlichen Kontaktdaten (E-Mail, Anrede, Name, Adresse, Mobilfunknummer) sowie fahrzeugbezogene Informationen (Kfz-Kennzeichen, Kilometerstand, FIN) ein. Zusätzlich muss eine DSGVO-Einwilligung erteilt werden, bevor der Benutzer zur Buchungsübersicht weitergeleitet wird.

---

## Benutzerführung

### Schritt 1: Seite wird geladen

![Desktop-Ansicht](./screenshots/e2e-responsive-desktop.png)

**Beschreibung:** Nach Abschluss der Terminauswahl (Wizard-Schritt 5) wird die Seite „Kunden- & Fahrzeugdaten" geladen. Der Guard prüft, ob alle vorherigen Wizard-Schritte (Marke, Standort, Services, Termin) abgeschlossen sind. Die Seite zeigt:
- Überschrift „Bitte geben Sie uns letzte Informationen rund um Ihren Termin"
- Banner „Schon einmal bei uns gewesen?" mit Button „Jetzt Daten abrufen!" (Click-Dummy)
- Hinweis „Pflichtfelder sind mit * gekennzeichnet"
- Leeres Formular (oder vorausgefüllte Felder bei Rückkehr)

### Schritt 2: Kundendaten ausfüllen

**Beschreibung:** Der Benutzer füllt die Kundendaten aus:
- **E-Mail Adresse** — Pflichtfeld, E-Mail-Format validiert
- **Anrede** — Dropdown mit „Herr" und „Frau"
- **Vorname** — nur Buchstaben (inkl. Umlaute)
- **Nachname** — nur Buchstaben (inkl. Umlaute)
- **Straße und Haus Nr.** — Freitext
- **Postleitzahl** — nur Ziffern
- **Wohnort** — nur Buchstaben (inkl. Umlaute)
- **Mobilfunknummer** — nur Ziffern, muss mit 0 beginnen

Jedes Feld hat ein Icon mit `.icon-framed`-Rahmen. Validierung erfolgt bei `blur` (on-touch) mit Inline-Fehlermeldungen.

### Schritt 3: Fahrzeugdaten ausfüllen

**Beschreibung:** Der Benutzer füllt die Fahrzeugdaten aus:
- **Kfz-Kennzeichen** — Format XX-XX1234
- **Kilometerstand** — nur Ziffern
- **FIN** — genau 17 alphanumerische Zeichen, mit Info-Link „Erklärung der FIN"

### Schritt 4: DSGVO-Einwilligung

**Beschreibung:** Der Benutzer setzt das Häkchen bei der DSGVO-Einwilligungs-Checkbox. Erst danach wird der Button „Zur Buchungsübersicht" aktiviert.

### Schritt 5: Formular absenden

**Beschreibung:** Der Benutzer klickt „Zur Buchungsübersicht". Das System:
1. Validiert alle Felder vollständig (markAllAsTouched)
2. Speichert `customerInfo`, `vehicleInfo` und `privacyConsent` im BookingStore
3. Navigiert zur Buchungsübersicht (nächster Wizard-Schritt)

---

## Alternative Abläufe

### Bestehender Kunde — Daten abrufen
Der Banner bietet einen Button „Jetzt Daten abrufen!". Im Click-Dummy hat dieser Button keine Funktion (Platzhalter für zukünftige API-Anbindung).

### Zurück-Navigation
Der „Zurück"-Button setzt `selectedAppointment` auf `null` (gemäß REQ-007 WizardStateSync) und navigiert zurück zur Terminauswahl (`/home/appointment`).

### FIN-Erklärung
Der Info-Link „Erklärung der FIN" neben dem FIN-Feld ist ein Click-Dummy-Platzhalter.

---

## Responsive Ansichten

### Desktop (1280x720)
![Desktop](./screenshots/e2e-responsive-desktop.png)

Mehrspaltige Layouts:
- Anrede (25%) | Vorname (37.5%) | Nachname (37.5%)
- PLZ (30%) | Wohnort (70%)
- Kfz-Kennzeichen (50%) | Kilometerstand (50%)

### Tablet (768x1024)
![Tablet](./screenshots/e2e-responsive-tablet.png)

Gleiche mehrspaltige Layouts wie Desktop.

### Mobile (375x667)
![Mobile](./screenshots/e2e-responsive-mobile.png)

Alle Formularfelder einspaltig untereinander (AC-17).

---

## Barrierefreiheit

- **Tastaturnavigation:** Alle Felder sind per Tab erreichbar, Formular kann vollständig per Tastatur bedient werden
- **Screen Reader:** Alle Felder haben `<label>` mit `for`/`id`-Verknüpfung, `aria-required="true"` bei Pflichtfeldern
- **Farbkontrast:** WCAG 2.1 AA konform (4.5:1 Kontrast)
- **Focus-Styles:** `:focus-visible` sichtbar auf allen interaktiven Elementen
- **Touch-Targets:** Mindestens 2.75em (44px) für mobile Geräte

---

## Technische Details

| Eigenschaft | Wert |
|-------------|------|
| Route | `/#/home/carinformation` |
| Container Component | `CarinformationContainerComponent` |
| Presentational Components | `CustomerFormComponent`, `VehicleFormComponent` |
| Store | `BookingStore` (erweitert um customerInfo, vehicleInfo, privacyConsent) |
| Guard | `carInformationGuard` (prüft 4 Voraussetzungen) |
| Validierung | Reactive Forms mit Validators (required, email, pattern) |
