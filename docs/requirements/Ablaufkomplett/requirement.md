# REQ-002: Ablaufkomplett - Service-Buchungsablauf

**Status:** 📝 Draft
**Priority:** High
**Type:** Functional
**Created:** 2026-02-12
**Author:** Claude Code

---

## 1. Overview

### 1.1 Purpose
Kompletter Service-Buchungsablauf für Werkstatttermine. Der Benutzer durchläuft einen Wizard mit 8 Schritten: Markenauswahl → Standortwahl → Serviceauswahl (mit Optionen in Kachel) → Terminwahl → Kalender (optional) → Kundendaten → Bemerkungen → Übersicht/Absenden.

**Wichtig:** Das Warenkorb-Icon befindet sich im **Header (REQ-001)** und ist auf **allen Seiten** sichtbar. Es bildet den kompletten BuchungStore ab und zeigt progressiv: Marke → Autohaus → Services → Termin. Was noch nicht gewählt ist, wird nicht angezeigt.

**Neu:** Datenschutz-Seite unter `/datenschutz` mit Lorem-Ipsum-Inhalt, verlinkt aus dem Footer und dem Kundendaten-Formular.

### 1.2 Scope
**Included:**
- Wizard-basierter Buchungsablauf
- Marken- und Standortauswahl
- Service-Auswahl mit Optionen (in expandierbarer Kachel, KEIN Modal)
- **Warenkorb-Icon im Header (REQ-001)** auf allen Seiten, bildet BuchungStore ab (Marke, Autohaus, Services, Termin)
- **Datenschutz-Seite** (`/datenschutz`) mit Lorem-Ipsum-Inhalt
- Terminauswahl (Schnellauswahl + Kalender) mit **dynamischer Berechnung** des nächsten Arbeitstags
- Kundendaten-Formular
- Bemerkungen/Anmerkungen
- Buchungsübersicht und Absenden

**Excluded:**
- Bezahlung (kein Payment-Gateway)
- Benutzerregistrierung/Login
- Backend-Integration (Click-Dummy mit statischen Daten)

### 1.3 Related Requirements
- REQ-001: Header (wird auf allen Seiten verwendet)

---

## 2. User Story

**Als** Kunde
**möchte ich** einen Service-Termin für mein Fahrzeug buchen
**damit** ich meine Inspektion, HU/AU oder Räderwechsel bequem online planen kann.

**Acceptance Criteria:**
- [ ] AC-1: Benutzer kann Fahrzeugmarke auswählen (Audi, BMW, Mercedes-Benz, MINI, Volkswagen)
- [ ] AC-2: Benutzer kann Standort auswählen (3-5 Standorte pro Marke)
- [ ] AC-3: Benutzer kann Services auswählen (HU/AU, Inspektion, Räderwechsel)
- [ ] AC-4: Benutzer kann Service-Optionen konfigurieren (z.B. Einlagerung)
- [ ] AC-5: Benutzer sieht Warenkorb mit ausgewählten Services
- [ ] AC-6: Benutzer kann Schnelltermin oder Kalendertermin wählen
- [ ] AC-7: Benutzer kann Kundendaten eingeben (validiert)
- [ ] AC-8: Benutzer kann Bemerkungen hinzufügen
- [ ] AC-9: Benutzer sieht Zusammenfassung vor Absenden
- [ ] AC-10: Benutzer kann Anfrage absenden

---

## 3. Preconditions

### 3.1 System
- Angular App läuft
- Routing konfiguriert
- Header-Component verfügbar (REQ-001)

### 3.2 User
- Keine Authentifizierung erforderlich
- JavaScript aktiviert
- Moderner Browser (Chrome, Firefox, Safari, Edge)

### 3.3 Data
- Marken sind konfiguriert (statisch)
- Standorte pro Marke sind konfiguriert (statisch)
- Services sind konfiguriert (statisch)
- Termine sind verfügbar (statisch generiert)

---

## 4. Main Flow

### Ablaufdiagramm

```
┌─────────────────────────┐
│ 1. Markenauswahl        │
│    /buchung/marke       │
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ 2. Standortwahl         │
│    /buchung/standort    │
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ 3. Serviceauswahl       │  ← Kachel expandiert bei Klick
│    /buchung/services    │    (Optionen direkt in Kachel)
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│ 4. Terminauswahl        │────►│ 5. Kalender             │
│    /buchung/termin      │     │    (individuelle Wahl)  │
└───────────┬─────────────┘     └───────────┬─────────────┘
            │◄──────────────────────────────┘
            ▼
┌─────────────────────────┐
│ 6. Kundendaten          │
│    /buchung/kundendaten │
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ 7. Bemerkungen          │
│    /buchung/bemerkungen │
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ 8. Übersicht            │
│    /buchung/uebersicht  │
│    → "Jetzt anfragen"   │
└─────────────────────────┘

WARENKORB-ICON (im Header, REQ-001, auf ALLEN Seiten):
┌──────────────────────────────────────────────┐
│ 🛒 [3]  ← Badge mit Anzahl gewählter Items   │
│                                              │
│ Klick öffnet Dropdown (bildet BuchungStore   │
│ ab — zeigt NUR was bereits gewählt wurde):   │
│ ┌──────────────────────────────────────────┐ │
│ │ 🚗 Marke:     Audi                      │ │
│ │ 📍 Autohaus:  München                   │ │
│ │ 🔧 Services:                            │ │
│ │    ✓ HU/AU                          [X] │ │
│ │    ✓ Inspektion                     [X] │ │
│ │    ✓ Räderwechsel (mit Einlagerung) [X] │ │
│ │ 📅 Termin:    Fr 13.02.2026, 07:30      │ │
│ └──────────────────────────────────────────┘ │
│                                              │
│ Progressiv: Nur gewählte Schritte sichtbar.  │
│ Wenn nur Marke gewählt → nur Marke anzeigen. │
│ Services können über [X] entfernt werden.    │
│ Letzter Service entfernt → Redirect zu       │
│ /buchung/services                            │
└──────────────────────────────────────────────┘
```

---

**Schritt 1: Markenauswahl**
- **Route:** `/buchung/marke`
- **User:** Sieht Überschrift "Welche Fahrzeugmarke fahren Sie?" und 5 Marken-Buttons
- **System:** Zeigt Audi, BMW, Mercedes-Benz, MINI, Volkswagen als große Buttons
- **Expected:** Nach Klick wird Marke im Store gespeichert, Weiterleitung zu Schritt 2

![Markenauswahl](./Markenscreen.png)

---

**Schritt 2: Standortwahl**
- **Route:** `/buchung/standort`
- **User:** Sieht "An welchem Standort dürfen wir Sie begrüßen?" und Standort-Buttons
- **System:** Zeigt 3-5 Standorte basierend auf gewählter Marke
- **Expected:** Nach Klick wird Standort gespeichert, Weiterleitung zu Schritt 3

![Standortwahl](./VerfügbareAutohäuser.png)

**Standorte pro Marke:**

| Marke | Standorte |
|-------|-----------|
| Audi | München, Hamburg, Berlin, Frankfurt, Düsseldorf |
| BMW | Stuttgart, Köln, München, Berlin, Hamburg |
| Mercedes-Benz | Stuttgart, München, Frankfurt, Düsseldorf, Berlin |
| MINI | Garbsen, Hannover Südstadt, Steinhude |
| Volkswagen | Wolfsburg, Hannover, Berlin, München, Hamburg |

---

**Schritt 3: Serviceauswahl + Warenkorb**
- **Route:** `/buchung/services`
- **User:** Sieht "Welche Services möchten Sie buchen?" und Service-Cards
- **System:** Zeigt HU/AU, Inspektion, Räderwechsel mit Icons und Beschreibungen
- **Interaktion:**
  1. Klick auf Service-Kachel → Kachel **expandiert** und zeigt Optionen (falls vorhanden)
  2. Bei Services MIT Optionen: Checkboxen werden in der expandierten Kachel sichtbar
  3. Bei Services OHNE Optionen: Service wird direkt zum Warenkorb hinzugefügt
  4. **KEIN Modal!** Alles in der Kachel
- **Warenkorb-Icon (Header):** Zeigt ab jetzt Marke + Autohaus + gewählte Services im Dropdown

![Serviceauswahl](./Services.png)

**Verfügbare Services:**

| Service | Icon | Beschreibung | Hat Optionen |
|---------|------|--------------|--------------|
| HU/AU | 🕐 (Tacho) | Jetzt Ihren Termin für eine gesetzliche HU/AU vereinbaren! | Nein |
| Inspektion | 🔧 | Lassen Sie Ihre fällige Inspektion hier durchführen! Buchen Sie jetzt einen Termin. | Nein |
| Räderwechsel | ⚙️ (Felge) | Kommen Sie zu uns für Ihren Räderwechsel - inkl. optionaler Einlagerung! | Ja (in Kachel) |

**Service-Optionen (in expandierter Kachel, KEIN Modal):**

![Service-Optionen](./ServiceOptionen.png)

Wenn Räderwechsel angeklickt wird, expandiert die Kachel und zeigt:
- [ ] Räderwechsel ohne Einlagerung
- [ ] Räderwechsel mit Einlagerung

Nach Auswahl einer Option → Service wird zum Warenkorb hinzugefügt.

---

**Warenkorb-Icon (im Header, REQ-001, auf ALLEN Seiten)**

![Warenkorb](./Einkaufswagenklick.png)

- **Position:** Im Header (REQ-001), auf ALLEN Seiten sichtbar (nicht erst ab Schritt 3)
- **Badge:** Zeigt Anzahl der gewählten Items (Marke + Autohaus + Services + Termin)
- **Klick:** Öffnet Dropdown mit progressiver Anzeige des BuchungStore
- **Progressiv:** Zeigt NUR was bereits gewählt wurde:
  - Nach Schritt 1: nur Marke
  - Nach Schritt 2: Marke + Autohaus
  - Nach Schritt 3: Marke + Autohaus + Services (mit [X] zum Entfernen)
  - Nach Schritt 4: Marke + Autohaus + Services + Termin
- **Abwählen:** Services können über [X] im Dropdown entfernt werden
- **Aktualisierung:** Badge und Dropdown aktualisieren sich sofort bei Änderungen
- **Leer-Zustand:** Wenn noch nichts gewählt, zeigt "Noch keine Auswahl getroffen"

---

**Schritt 4: Terminauswahl (Schnellauswahl)**
- **Route:** `/buchung/termin`
- **User:** Sieht "Wählen Sie den für Sie passenden Tag und Uhrzeit aus"
- **System:** Zeigt 4 Schnelltermin-Vorschläge **dynamisch berechnet**
- **Dynamische Berechnung:**
  - Nächster Arbeitstag ab heute (Mo-Fr)
  - Falls heute Freitag nach 18:00 → nächster Montag
  - Falls heute Samstag/Sonntag → nächster Montag
  - 2 Uhrzeiten pro Tag: 07:30 (Früh) und 18:00 (Spät)
  - 2 Tage angezeigt = 4 Termine
- **Expected:** Klick auf Termin speichert Auswahl, oder Klick auf "Werkstattkalender" öffnet Kalender
- **Warenkorb-Icon (Header):** Zeigt Marke + Autohaus + Services; nach Terminwahl auch Termin

![Terminauswahl](./NächsmöglicheTermine.png)

**Beispiel dynamische Termine (heute = Donnerstag 12.02.2026):**
| # | Wochentag | Datum | Uhrzeit |
|---|-----------|-------|---------|
| 1 | Fr | 13.02.2026 | 07:30 |
| 2 | Fr | 13.02.2026 | 18:00 |
| 3 | Mo | 16.02.2026 | 07:30 |
| 4 | Mo | 16.02.2026 | 18:00 |

---

**Schritt 5: Kalenderauswahl (Optional)**
- **Teil von:** Terminauswahl
- **User:** Sieht Kalender mit Datumsauswahl und verfügbare Uhrzeiten
- **System:** Zeigt Datepicker + Grid mit verfügbaren Uhrzeiten für 3 Arbeitstage
- **Dynamische Berechnung:** Kalender zeigt nur Arbeitstage (Mo-Fr), Wochenenden ausgegraut
- **Expected:** Nach Auswahl von Datum und Uhrzeit weiter zu Kundendaten
- **Warenkorb-Icon (Header):** Zeigt kompletten Buchungsstand inkl. gewähltem Termin

![Kalender](./individuelleTermin.png)
![Uhrzeiten](./individuell_termin2.png)

**Verfügbare Uhrzeiten (Beispiel):**
- 07:30, 09:00, 09:10, 09:20, 09:30, 09:40, 09:50, 10:00
- 14:00, 16:00, 16:30, 17:00, 17:30, 18:00

---

**Schritt 6: Kundendaten**
- **Route:** `/buchung/kundendaten`
- **User:** Sieht Formular "Bitte geben Sie uns die letzten Informationen zu Ihrem Fahrzeug"
- **System:** Zeigt Eingabefelder für alle Kundendaten
- **Expected:** Nach Validierung und "Weiter" zu Bemerkungen
- **Warenkorb-Icon (Header):** Zeigt kompletten Buchungsstand; Services können im Dropdown entfernt werden

![Kundendaten](./kundendateneingeben.png)

**Formularfelder:**

| Feld | Type | Required | Validation |
|------|------|----------|------------|
| E-Mail Adresse | email | Ja | Gültige E-Mail |
| Anrede | select | Ja | Herr/Frau/Divers |
| Vorname | text | Ja | Min 2 Zeichen |
| Nachname | text | Ja | Min 2 Zeichen |
| Straße und Haus Nr. | text | Ja | Min 5 Zeichen |
| Postleitzahl | text | Ja | 5 Ziffern |
| Wohnort | text | Ja | Min 2 Zeichen |
| Mobilfunknummer | tel | Ja | Format: 01... |
| KFZ Kennzeichen | text | Ja | Deutsches Format |
| Kilometerstand | number | Ja | > 0 |
| FIN | text | Nein | 17 Zeichen (optional) |

**Features:**
- "Jetzt Daten abrufen" Button (E-Mail → automatische Datenbefüllung, Click-Dummy: leer lassen)
- "Erklärung der FIN" Info-Button
- Datenschutz-Checkbox (Pflicht)

---

**Schritt 7: Bemerkungen**
- **Route:** `/buchung/bemerkungen`
- **User:** Sieht "Bitte geben Sie uns weitere Hinweise zu Ihrer Buchung"
- **System:** Zeigt Textarea für Anmerkungen + Hinweise zu gewählten Services
- **Expected:** Nach "Weiter" zur Übersicht
- **Warenkorb-Icon (Header):** Zeigt kompletten Buchungsstand; Services können im Dropdown entfernt werden

![Bemerkungen](./bemerkungennachkundendaten.png)

**Hinweise pro Service:**
- **HU/AU:** "Hier kann Ihr besonderer Hinweis zur gewählten Leistung stehen. Bsp. HU/AU nur möglich Montags, Mittwochs und Freitags."
- **Inspektion:** "Hier kann Ihr besonderer Hinweis zur gewählten Leistung stehen. Bsp. 'Immer Fahrzeugschein mitbringen'."

---

**Schritt 8: Übersicht & Absenden**
- **Route:** `/buchung/uebersicht`
- **User:** Sieht Zusammenfassung aller Eingaben
- **System:** Zeigt Wunschtermin, gewählte Services, Kundendaten, Fahrzeugdaten, Preis
- **Expected:** Klick auf "Jetzt anfragen" sendet Buchung (Click-Dummy: nur console.log)

![Übersicht](./zusammenfassunganfragesende.png)

**Angezeigte Daten:**
- **Wunschtermin:** Datum + Uhrzeit
- **Gewählter Service:** Liste der Services + Standort + Preis
- **Ihre Daten:** Name, Adresse, Telefon, E-Mail
- **Fahrzeugdaten:** Marke, Kennzeichen, Kilometerstand

---

## 5. Alternative Flows

### 5.1 Zurück-Navigation

**Trigger:** Benutzer klickt auf Zurück-Pfeil

**Flow:**
1. System speichert aktuelle Eingaben im Store
2. System navigiert zum vorherigen Schritt
3. Vorherige Eingaben bleiben erhalten
4. Benutzer kann Änderungen vornehmen

### 5.2 Kalender statt Schnellauswahl

**Trigger:** Benutzer klickt auf "Werkstattkalender" Link

**Flow:**
1. System zeigt Kalender-View
2. Benutzer wählt Datum im Datepicker (nur Arbeitstage wählbar)
3. System zeigt verfügbare Uhrzeiten für 3 Arbeitstage (dynamisch berechnet)
4. Benutzer wählt Uhrzeit
5. Weiter mit Schritt 6 (Kundendaten)

### 5.3 Service ohne Optionen

**Trigger:** Benutzer klickt auf Service ohne Optionen (HU/AU, Inspektion)

**Flow:**
1. Service wird direkt zum Warenkorb hinzugefügt (keine Expansion)
2. Service-Card zeigt Häkchen
3. Warenkorb-Icon erscheint/Badge wird aktualisiert

### 5.4 Service mit Optionen

**Trigger:** Benutzer klickt auf Service mit Optionen (Räderwechsel)

**Flow:**
1. Kachel expandiert und zeigt Checkbox-Optionen
2. Benutzer wählt eine Option
3. Service mit Option wird zum Warenkorb hinzugefügt
4. Kachel kann wieder eingeklappt werden

### 5.5 Service über Warenkorb-Dropdown entfernen

**Trigger:** Benutzer klickt auf Warenkorb-Icon im Header (auf beliebiger Seite)

**Flow:**
1. Dropdown öffnet sich mit progressiver Anzeige des BuchungStore (Marke, Autohaus, Services, Termin)
2. Services haben [X]-Buttons zum Entfernen
3. Benutzer klickt [X] bei einem Service
4. Service wird entfernt, Dropdown und Badge aktualisieren sich
5. **Bei 0 Services: Benutzer wird automatisch zur Service-Auswahl (`/buchung/services`) weitergeleitet**
6. Marke, Autohaus und Termin werden nur angezeigt (nicht entfernbar über Dropdown)

### 5.6 Abbruch der Buchung

**Trigger:** Benutzer klickt auf X (Schließen) Button

**Flow:**
1. System zeigt Bestätigungsdialog "Buchung wirklich abbrechen?"
2. Bei "Ja": Zurück zur Startseite, Store wird geleert
3. Bei "Nein": Dialog schließt, Benutzer bleibt auf aktueller Seite

---

## 6. Exception Flows

### 6.1 Validierungsfehler Kundendaten

**Trigger:** Benutzer klickt "Weiter" mit ungültigen Daten

**Flow:**
1. System markiert fehlerhafte Felder rot
2. System zeigt Fehlermeldungen unter den Feldern
3. Focus springt zum ersten fehlerhaften Feld
4. Benutzer korrigiert Eingaben
5. Bei gültigen Daten: Weiter zu Schritt 9

### 6.2 Keine Services ausgewählt

**Trigger:** Benutzer klickt "Weiter" ohne Service-Auswahl

**Flow:**
1. "Weiter" Button ist deaktiviert
2. System zeigt Hinweis "Bitte wählen Sie mindestens einen Service"

### 6.3 Kein Termin verfügbar

**Trigger:** Alle Termine sind ausgebucht (hypothetisch)

**Flow:**
1. System zeigt Meldung "Leider sind keine Termine verfügbar"
2. System bietet Alternative: "Bitte kontaktieren Sie uns telefonisch"
3. Telefonnummer wird angezeigt

---

## 7. Postconditions

### 7.1 Success
- Buchungsanfrage wurde "gesendet" (console.log im Click-Dummy)
- Benutzer sieht Bestätigungsmeldung
- Store wird geleert
- Optional: Weiterleitung zur Startseite

### 7.2 Failure
- Keine Daten verloren (im Store gespeichert)
- Benutzer kann erneut versuchen
- Fehler wird geloggt

---

## 8. Business Rules

- **BR-1:** Mindestens 1 Service muss ausgewählt werden
- **BR-2:** Alle Pflichtfelder müssen ausgefüllt sein
- **BR-3:** Datenschutz-Checkbox muss aktiviert sein
- **BR-4:** Termin muss in der Zukunft liegen
- **BR-5:** Standorte werden basierend auf Marke gefiltert
- **BR-6:** Nur Arbeitstage (Mo-Fr) für Termine verfügbar
- **BR-7:** Räderwechsel erfordert Option-Auswahl (mit/ohne Einlagerung) - in expandierter Kachel
- **BR-8:** Schnelltermine werden **dynamisch berechnet** ab nächstem Arbeitstag
- **BR-9:** Warenkorb-Icon ist im Header (REQ-001) auf ALLEN Seiten sichtbar und bildet den BuchungStore progressiv ab
- **BR-10:** Services können jederzeit über Warenkorb-Dropdown entfernt werden; Marke/Autohaus/Termin werden nur angezeigt, nicht entfernbar
- **BR-11:** Wird der letzte Service aus dem Warenkorb entfernt, wird der Benutzer automatisch zur Service-Auswahl (`/buchung/services`) weitergeleitet

---

## 9. Non-Functional Requirements

### Performance
- Seitenwechsel < 300ms
- Modal öffnet < 100ms
- Formular-Validierung instant

### Security
- Keine echten Kundendaten speichern (Click-Dummy)
- HTTPS in Production
- Input Sanitization

### Usability
- Mobile-First Design
- WCAG 2.1 AA Konformität
- Touch-friendly (min 44px Buttons)
- Keyboard-Navigation möglich

### Browser Support
- Chrome (latest 2)
- Firefox (latest 2)
- Safari (latest 2)
- Edge (latest 2)

---

## 10. Data Model

```typescript
// === Enums / Union Types ===

type Marke = 'audi' | 'bmw' | 'mercedes' | 'mini' | 'volkswagen';

type ServiceTyp = 'hu-au' | 'inspektion' | 'raederwechsel';

type Anrede = 'herr' | 'frau' | 'divers';

type RaederwechselOption = 'ohne-einlagerung' | 'mit-einlagerung';

// === Interfaces ===

interface Standort {
  id: string;
  name: string;
  stadt: string;
  marken: Marke[];
}

interface Service {
  id: string;
  typ: ServiceTyp;
  name: string;
  beschreibung: string;
  icon: string;
  hatOptionen: boolean;
  preis: number;
}

interface ServiceOption {
  id: string;
  serviceId: string;
  name: string;
  beschreibung: string;
  aufpreis: number;
}

interface GewaehlterService {
  service: Service;
  option?: ServiceOption;
}

interface Termin {
  id: string;
  datum: Date;
  uhrzeit: string; // "07:30", "09:00", etc.
  verfuegbar: boolean;
}

interface SchnellTermin {
  id: string;
  datum: Date;
  uhrzeit: string;
  wochentag: string; // "Fr", "Mo", etc.
}

interface Kundendaten {
  email: string;
  anrede: Anrede;
  vorname: string;
  nachname: string;
  strasse: string;
  postleitzahl: string;
  wohnort: string;
  mobilnummer: string;
  kfzKennzeichen: string;
  kilometerstand: number;
  fin?: string;
  datenschutzAkzeptiert: boolean;
}

interface Buchung {
  id: string;
  marke: Marke;
  standort: Standort;
  services: GewaehlterService[];
  termin: Termin;
  kundendaten: Kundendaten;
  bemerkungen: string;
  gesamtpreis: number;
  erstelltAm: Date;
}

// === DTOs ===

interface BuchungErstellenDTO {
  markeId: string;
  standortId: string;
  serviceIds: string[];
  optionIds?: string[];
  terminId: string;
  kundendaten: Omit<Kundendaten, 'datenschutzAkzeptiert'>;
  bemerkungen?: string;
}

// === Store State ===

interface BuchungState {
  // Wizard State
  aktuellerSchritt: number;

  // Ausgewählte Daten
  gewaehlteMarke: Marke | null;
  gewaehlterStandort: Standort | null;
  gewaehlteServices: GewaehlterService[];
  gewaehlterTermin: Termin | null;
  kundendaten: Partial<Kundendaten>;
  bemerkungen: string;

  // UI State
  istLaden: boolean;
  fehler: string | null;

  // Verfügbare Daten (aus API/statisch)
  verfuegbareStandorte: Standort[];
  verfuegbareServices: Service[];
  verfuegbareTermine: Termin[];
  schnellTermine: SchnellTermin[];
}
```

---

## 11. UI/UX

### Mockups

| Schritt | Screenshot |
|---------|------------|
| 1. Markenauswahl | ![Markenscreen](./Markenscreen.png) |
| 2. Standortwahl | ![Standorte](./VerfügbareAutohäuser.png) |
| 3. Serviceauswahl | ![Services](./Services.png) |
| 4. Service-Optionen | ![Optionen](./ServiceOptionen.png) |
| 5. Warenkorb | ![Warenkorb](./Einkaufswagenklick.png) |
| 6. Terminwahl | ![Termine](./NächsmöglicheTermine.png) |
| 7a. Kalender | ![Kalender](./individuelleTermin.png) |
| 7b. Uhrzeiten | ![Uhrzeiten](./individuell_termin2.png) |
| 8. Kundendaten | ![Kundendaten](./kundendateneingeben.png) |
| 9. Bemerkungen | ![Bemerkungen](./bemerkungennachkundendaten.png) |
| 10. Übersicht | ![Übersicht](./zusammenfassunganfragesende.png) |

### Design-Hinweise

**WICHTIG:** Die Screenshots zeigen ein dunkles Theme. Die Implementierung verwendet das **helle Theme** aus `src/styles/_variables.scss`!

- Background: `$background-primary` (#f8f9fa)
- Cards: weiß mit leichtem Schatten
- Primary Color: `$primary-color`
- Text: `$text-primary`

### Navigation
- Zurück-Pfeil oben links
- X (Schließen) oben rechts
- Progress Indicator (optional): Zeigt aktuellen Schritt

### Responsive Design
- Desktop: Cards nebeneinander (Grid)
- Tablet: 2 Spalten
- Mobile: 1 Spalte, Buttons full-width

---

## 12. API Specification

> **Hinweis:** Click-Dummy - alle Endpoints liefern statische Daten + console.log

### GET /api/marken

```http
GET /api/marken
```

**Response (200):**
```json
[
  { "id": "audi", "name": "Audi" },
  { "id": "bmw", "name": "BMW" },
  { "id": "mercedes", "name": "Mercedes-Benz" },
  { "id": "mini", "name": "MINI" },
  { "id": "volkswagen", "name": "Volkswagen" }
]
```

### GET /api/standorte/:markeId

```http
GET /api/standorte/audi
```

**Response (200):**
```json
[
  { "id": "muc", "name": "München", "stadt": "München" },
  { "id": "ham", "name": "Hamburg", "stadt": "Hamburg" },
  { "id": "ber", "name": "Berlin", "stadt": "Berlin" }
]
```

### GET /api/services

```http
GET /api/services
```

**Response (200):**
```json
[
  {
    "id": "hu-au",
    "typ": "hu-au",
    "name": "HU/AU",
    "beschreibung": "Jetzt Ihren Termin für eine gesetzliche HU/AU vereinbaren!",
    "icon": "tacho",
    "hatOptionen": false,
    "preis": 120.00
  },
  {
    "id": "inspektion",
    "typ": "inspektion",
    "name": "Inspektion",
    "beschreibung": "Lassen Sie Ihre fällige Inspektion hier durchführen!",
    "icon": "werkzeug",
    "hatOptionen": false,
    "preis": 299.00
  },
  {
    "id": "raederwechsel",
    "typ": "raederwechsel",
    "name": "Räderwechsel",
    "beschreibung": "Kommen Sie zu uns für Ihren Räderwechsel - inkl. optionaler Einlagerung!",
    "icon": "felge",
    "hatOptionen": true,
    "preis": 39.00
  }
]
```

### GET /api/services/:serviceId/optionen

```http
GET /api/services/raederwechsel/optionen
```

**Response (200):**
```json
[
  {
    "id": "ohne-einlagerung",
    "serviceId": "raederwechsel",
    "name": "Räderwechsel ohne Einlagerung",
    "beschreibung": "Nur Wechsel der Räder",
    "aufpreis": 0
  },
  {
    "id": "mit-einlagerung",
    "serviceId": "raederwechsel",
    "name": "Räderwechsel mit Einlagerung",
    "beschreibung": "Wechsel + Einlagerung der Räder",
    "aufpreis": 50.00
  }
]
```

### GET /api/termine/schnell/:standortId

```http
GET /api/termine/schnell/muc
```

**Response (200):**
```json
[
  { "id": "t1", "datum": "2026-02-13", "uhrzeit": "07:30", "wochentag": "Fr" },
  { "id": "t2", "datum": "2026-02-13", "uhrzeit": "18:00", "wochentag": "Fr" },
  { "id": "t3", "datum": "2026-02-16", "uhrzeit": "07:30", "wochentag": "Mo" },
  { "id": "t4", "datum": "2026-02-16", "uhrzeit": "18:00", "wochentag": "Mo" }
]
```

### GET /api/termine/kalender/:standortId/:datum

```http
GET /api/termine/kalender/muc/2026-02-14
```

**Response (200):**
```json
{
  "tage": [
    {
      "datum": "2026-02-16",
      "wochentag": "Mo",
      "uhrzeiten": ["07:30", "09:00", "09:10", "09:20", "09:30", "14:00", "16:00", "17:30", "18:00"]
    },
    {
      "datum": "2026-02-17",
      "wochentag": "Di",
      "uhrzeiten": ["07:30", "09:00", "09:10", "09:20", "09:30", "14:00", "16:00", "17:30", "18:00"]
    },
    {
      "datum": "2026-02-18",
      "wochentag": "Mi",
      "uhrzeiten": ["07:30", "09:00", "09:10", "09:20", "09:30", "14:00", "16:00", "17:30", "18:00"]
    }
  ]
}
```

### POST /api/buchungen

```http
POST /api/buchungen
Content-Type: application/json

{
  "markeId": "audi",
  "standortId": "muc",
  "serviceIds": ["hu-au", "inspektion"],
  "optionIds": [],
  "terminId": "t1",
  "kundendaten": {
    "email": "max@example.de",
    "anrede": "herr",
    "vorname": "Max",
    "nachname": "Mustermann",
    "strasse": "Musterstraße 1",
    "postleitzahl": "80331",
    "wohnort": "München",
    "mobilnummer": "01701234567",
    "kfzKennzeichen": "M-AB 1234",
    "kilometerstand": 50000
  },
  "bemerkungen": "Bitte Rückruf vor Termin"
}
```

**Response (201):**
```json
{
  "id": "buchung-123",
  "status": "angefragt",
  "bestaetigung": "Ihre Anfrage wurde erfolgreich übermittelt. Wir melden uns in Kürze."
}
```

---

## 13. Test Cases

### TC-1: Happy Path - Komplette Buchung

- **Given:** Benutzer ist auf Startseite
- **When:**
  1. Wählt Marke "Audi"
  2. Wählt Standort "München"
  3. Wählt Services "HU/AU" und "Inspektion"
  4. Wählt Schnelltermin "Fr 13.02.2026 07:30"
  5. Füllt alle Kundendaten aus
  6. Akzeptiert Datenschutz
  7. Klickt "Jetzt anfragen"
- **Then:** Buchung wird gesendet, Bestätigung angezeigt

### TC-2: Räderwechsel mit Option (Kachel expandiert)

- **Given:** Benutzer ist auf Service-Auswahl
- **When:** Klickt auf "Räderwechsel"-Kachel
- **Then:** Kachel expandiert und zeigt Optionen "mit/ohne Einlagerung" als Checkboxen
- **When:** Wählt "mit Einlagerung"
- **Then:** Service mit Option im Warenkorb, Warenkorb-Icon zeigt Badge "1"

### TC-3: Kalender-Terminauswahl

- **Given:** Benutzer ist auf Terminauswahl
- **When:** Klickt "Werkstattkalender"
- **Then:** Kalender wird angezeigt
- **When:** Wählt Datum "14.02.2026"
- **Then:** Verfügbare Uhrzeiten werden angezeigt
- **When:** Wählt "09:00 Uhr"
- **Then:** Termin wird gespeichert

### TC-4: Validierungsfehler

- **Given:** Benutzer ist auf Kundendaten
- **When:** Lässt Pflichtfelder leer und klickt "Weiter"
- **Then:** Fehlermeldungen werden angezeigt, Navigation blockiert

### TC-5: Zurück-Navigation

- **Given:** Benutzer ist auf Schritt 4 (Terminauswahl)
- **When:** Klickt Zurück-Pfeil
- **Then:** Navigation zu Schritt 3 (Services), Auswahl bleibt erhalten, Warenkorb-Badge unverändert

### TC-6: Service über Warenkorb-Dropdown entfernen

- **Given:** Benutzer hat 2 Services im Warenkorb, ist auf Schritt 6 (Kundendaten)
- **When:** Klickt auf Warenkorb-Icon im Header, dann auf [X] bei einem Service
- **Then:** Service wird entfernt, Badge aktualisiert sich auf "1", Benutzer bleibt auf aktueller Seite

### TC-6b: Letzten Service entfernen → Redirect

- **Given:** Benutzer hat 1 Service im Warenkorb, ist auf Schritt 6 (Kundendaten)
- **When:** Klickt auf Warenkorb-Icon im Header, dann auf [X] beim letzten Service
- **Then:** Service wird entfernt, Benutzer wird automatisch zu `/buchung/services` weitergeleitet

### TC-7: Marke wechseln

- **Given:** Benutzer hat Marke "Audi" gewählt und ist bei Standort
- **When:** Navigiert zurück und wählt "BMW"
- **Then:** Standort-Liste wird aktualisiert (BMW-Standorte)

### TC-8: Keyboard-Navigation

- **Given:** Benutzer ist auf Markenauswahl
- **When:** Navigiert mit Tab und Enter
- **Then:** Alle Buttons sind fokussierbar und aktivierbar

### TC-9: Warenkorb-Icon zeigt BuchungStore progressiv

- **Given:** Benutzer hat Marke "Audi", Standort "München" und 2 Services gewählt
- **When:** Navigiert zu Schritt 6 (Kundendaten)
- **Then:** Warenkorb-Icon im Header zeigt Badge
- **When:** Klickt auf Warenkorb-Icon
- **Then:** Dropdown zeigt: Marke "Audi", Autohaus "München", beide Services mit [X], Termin

### TC-10: Dynamische Termine (Wochenende)

- **Given:** Heute ist Samstag 14.02.2026
- **When:** Benutzer öffnet Terminauswahl
- **Then:** Erste Schnelltermine sind für Montag 16.02.2026 (07:30, 18:00)

### TC-11: Service-Kachel expandiert

- **Given:** Benutzer ist auf Service-Auswahl
- **When:** Klickt auf HU/AU (ohne Optionen)
- **Then:** Kein Expand, Service direkt im Warenkorb
- **When:** Klickt auf Räderwechsel (mit Optionen)
- **Then:** Kachel expandiert, zeigt Checkboxen für Optionen

---

## 14. Implementation

### Components

**Container Components:**
- [ ] `BuchungWizardContainerComponent` - Wizard-Steuerung, Route-Outlet
- [ ] `MarkenauswahlContainerComponent` - Schritt 1
- [ ] `StandortauswahlContainerComponent` - Schritt 2
- [ ] `ServiceauswahlContainerComponent` - Schritt 3 (inkl. Optionen in Kachel)
- [ ] `TerminauswahlContainerComponent` - Schritt 4-5
- [ ] `KundendatenContainerComponent` - Schritt 6
- [ ] `BemerkungenContainerComponent` - Schritt 7
- [ ] `UebersichtContainerComponent` - Schritt 8

**Presentational Components:**
- [ ] `MarkenButtonsComponent` - Marken-Grid
- [ ] `StandortButtonsComponent` - Standort-Grid
- [ ] `ServiceCardComponent` - Einzelne Service-Card (expandierbar mit Optionen)
- [ ] `ServiceCardsComponent` - Service-Grid
- ~~`WarenkorbIconComponent`~~ → **Im Header (REQ-001)**, zeigt BuchungStore progressiv
- ~~`WarenkorbDropdownComponent`~~ → **Im Header (REQ-001)**, Dropdown mit Marke/Autohaus/Services/Termin
- [ ] `SchnellTermineComponent` - Termin-Schnellauswahl (dynamisch)
- [ ] `KalenderComponent` - Datepicker (nur Arbeitstage)
- [ ] `UhrzeitenGridComponent` - Uhrzeiten-Buttons
- [ ] `KundendatenFormularComponent` - Reaktives Formular
- [ ] `BemerkungenFormularComponent` - Textarea
- [ ] `BuchungZusammenfassungComponent` - Übersicht

**ENTFERNT:**
- ~~`ServiceOptionenDialogComponent`~~ - KEIN Modal, Optionen sind in der Kachel

### Stores

- [ ] `BuchungStore` - Haupt-Store für Wizard-State
  - State: `gewaehlteMarke`, `gewaehlterStandort`, `gewaehlteServices`, etc.
  - Methods: `waehleMarke()`, `waehleStandort()`, `fuegeServiceHinzu()`, etc.
  - Computed: `gesamtpreis`, `kannWeiter`, `istFormularGueltig`

- [ ] `ServiceStore` - Verfügbare Services (providedIn: 'root')
  - State: `services`, `optionen`, `istLaden`
  - Methods: `ladeServices()`, `ladeOptionen()`

- [ ] `TerminStore` - Verfügbare Termine (providedIn: 'root')
  - State: `schnellTermine`, `kalenderTermine`, `istLaden`
  - Methods: `ladeSchnellTermine()`, `ladeKalenderTermine()`

### Services

- [ ] `BuchungApiService` - API-Calls (Promise-basiert)
  - `getMarken(): Promise<Marke[]>`
  - `getStandorte(markeId): Promise<Standort[]>`
  - `getServices(): Promise<Service[]>`
  - `getOptionen(serviceId): Promise<ServiceOption[]>`
  - `getSchnellTermine(standortId): Promise<SchnellTermin[]>`
  - `getKalenderTermine(standortId, datum): Promise<KalenderTag[]>`
  - `erstelleBuchung(dto): Promise<BuchungBestaetigung>`

- [ ] `BuchungBusinessService` - Validierung, Logik
  - `berechneGesamtpreis(services): number`
  - `validiereKundendaten(daten): ValidationResult`
  - `formatiereTermin(termin): string`

### Routes

```typescript
const buchungRoutes: Routes = [
  {
    path: 'buchung',
    component: BuchungWizardContainerComponent,
    children: [
      { path: '', redirectTo: 'marke', pathMatch: 'full' },
      {
        path: 'marke',
        component: MarkenauswahlContainerComponent,
        resolve: { data: markenResolver }
      },
      {
        path: 'standort',
        component: StandortauswahlContainerComponent,
        resolve: { data: standorteResolver },
        canActivate: [markeGewaehltGuard]
      },
      {
        path: 'services',
        component: ServiceauswahlContainerComponent,
        resolve: { data: servicesResolver },
        canActivate: [standortGewaehltGuard]
      },
      {
        path: 'termin',
        component: TerminauswahlContainerComponent,
        resolve: { data: termineResolver },
        canActivate: [servicesGewaehltGuard]
      },
      {
        path: 'kundendaten',
        component: KundendatenContainerComponent,
        canActivate: [terminGewaehltGuard]
      },
      {
        path: 'bemerkungen',
        component: BemerkungenContainerComponent,
        canActivate: [kundendatenGueltigGuard]
      },
      {
        path: 'uebersicht',
        component: UebersichtContainerComponent,
        canActivate: [buchungKomplettGuard]
      }
    ]
  }
];

// Datenschutz-Route (eigenständig, nicht im Wizard)
const datenschutzRoute: Route = {
  path: 'datenschutz',
  loadComponent: () => import('./features/datenschutz/datenschutz-container.component')
    .then(m => m.DatenschutzContainerComponent)
};
```

### Datenschutz-Seite

- **Route:** `/datenschutz`
- **Inhalt:** Lorem-Ipsum-Datenschutzerklärung (Click-Dummy)
- **Erreichbar über:**
  - Footer-Link "Datenschutz"
  - Link im Kundendaten-Formular (Datenschutz-Checkbox)
- **Components:**
  - `DatenschutzContainerComponent` - Container mit Seiteninhalt
  - `DatenschutzInhaltComponent` - Presentational mit Lorem-Ipsum-Text

### Folder Structure

```
src/app/features/buchung/
├── buchung.routes.ts
├── buchung-wizard-container.component.ts
├── buchung-wizard-container.component.html
├── buchung-wizard-container.component.scss
│
├── components/
│   ├── markenauswahl/
│   │   ├── markenauswahl-container.component.ts
│   │   ├── markenauswahl-container.component.html
│   │   └── marken-buttons.component.ts
│   │
│   ├── standortauswahl/
│   │   ├── standortauswahl-container.component.ts
│   │   ├── standortauswahl-container.component.html
│   │   └── standort-buttons.component.ts
│   │
│   ├── serviceauswahl/
│   │   ├── serviceauswahl-container.component.ts
│   │   ├── serviceauswahl-container.component.html
│   │   ├── service-card.component.ts          # Expandierbar mit Optionen
│   │   └── service-cards.component.ts
│   │
│   │   # Warenkorb → im Header (REQ-001), NICHT in buchung!
│   │
│   ├── terminauswahl/
│   │   ├── terminauswahl-container.component.ts
│   │   ├── terminauswahl-container.component.html
│   │   ├── schnell-termine.component.ts
│   │   ├── kalender.component.ts
│   │   └── uhrzeiten-grid.component.ts
│   │
│   ├── kundendaten/
│   │   ├── kundendaten-container.component.ts
│   │   ├── kundendaten-container.component.html
│   │   └── kundendaten-formular.component.ts
│   │
│   ├── bemerkungen/
│   │   ├── bemerkungen-container.component.ts
│   │   ├── bemerkungen-container.component.html
│   │   └── bemerkungen-formular.component.ts
│   │
│   └── uebersicht/
│       ├── uebersicht-container.component.ts
│       ├── uebersicht-container.component.html
│       └── buchung-zusammenfassung.component.ts
│
├── services/
│   ├── buchung-api.service.ts
│   └── buchung-business.service.ts
│
├── store/
│   ├── buchung.store.ts
│   ├── service.store.ts
│   └── termin.store.ts
│
├── models/
│   ├── marke.model.ts
│   ├── standort.model.ts
│   ├── service.model.ts
│   ├── termin.model.ts
│   ├── kundendaten.model.ts
│   └── buchung.model.ts
│
├── guards/
│   ├── marke-gewaehlt.guard.ts
│   ├── standort-gewaehlt.guard.ts
│   ├── services-gewaehlt.guard.ts
│   ├── termin-gewaehlt.guard.ts
│   ├── kundendaten-gueltig.guard.ts
│   └── buchung-komplett.guard.ts
│
├── resolvers/
│   ├── marken.resolver.ts
│   ├── standorte.resolver.ts
│   ├── services.resolver.ts
│   └── termine.resolver.ts
│
└── validators/
    └── kundendaten.validators.ts

src/app/features/datenschutz/
├── datenschutz-container.component.ts
├── datenschutz-container.component.html
├── datenschutz-container.component.scss
└── components/
    ├── datenschutz-inhalt.component.ts
    ├── datenschutz-inhalt.component.html
    └── datenschutz-inhalt.component.scss
```

---

## 15. Dependencies

**Requires:**
- REQ-001: Header (für einheitliche Navigation)

**Blocks:**
- (keine)

---

## 16. Naming Glossary

### Container Methods (Event Handler)
| Methode | Beschreibung |
|---------|--------------|
| `beimMarkeWaehlen(marke)` | Marke ausgewählt |
| `beimStandortWaehlen(standort)` | Standort ausgewählt |
| `beimServiceWaehlen(service)` | Service-Kachel angeklickt (expandiert) |
| `beimOptionWaehlen(service, option)` | Option in Kachel gewählt |
| `beimServiceEntfernen(serviceId)` | Service aus Warenkorb entfernt (über Icon) |
| `beimWarenkorbOeffnen()` | Warenkorb-Icon geklickt |
| `beimWarenkorbSchliessen()` | Warenkorb-Dropdown geschlossen |
| `beimTerminWaehlen(termin)` | Termin ausgewählt |
| `beimKalenderOeffnen()` | Kalender-Link geklickt |
| `beimDatumWaehlen(datum)` | Datum im Kalender gewählt |
| `beimUhrzeitWaehlen(uhrzeit)` | Uhrzeit gewählt |
| `beimWeiter()` | Weiter-Button geklickt |
| `beimZurueck()` | Zurück-Button geklickt |
| `beimAbbrechen()` | Abbrechen geklickt |
| `beimAnfrageSenden()` | "Jetzt anfragen" geklickt |

### API Service Methods
| Methode | Beschreibung |
|---------|--------------|
| `holeMarken()` | GET alle Marken |
| `holeStandorte(markeId)` | GET Standorte für Marke |
| `holeServices()` | GET alle Services |
| `holeOptionen(serviceId)` | GET Optionen für Service |
| `holeSchnellTermine(standortId)` | GET Schnelltermine |
| `holeKalenderTermine(standortId, datum)` | GET Kalendertermine |
| `erstelleBuchung(dto)` | POST neue Buchung |

### Signal Store Methods
| Methode | Beschreibung |
|---------|--------------|
| `ladeMarken()` | Marken laden |
| `ladeStandorte()` | Standorte laden |
| `ladeServices()` | Services laden |
| `ladeTermine()` | Termine laden |
| `setzeMarke(marke)` | Marke setzen |
| `setzeStandort(standort)` | Standort setzen |
| `fuegeServiceHinzu(service, option?)` | Service hinzufügen |
| `entferneService(serviceId)` | Service entfernen |
| `setzeTermin(termin)` | Termin setzen |
| `setzeKundendaten(daten)` | Kundendaten setzen |
| `setzeBemerkungen(text)` | Bemerkungen setzen |
| `resetBuchung()` | Wizard zurücksetzen |

### Computed Signals
| Signal | Beschreibung |
|--------|--------------|
| `gesamtpreis` | Summe aller Services |
| `anzahlServices` | Anzahl gewählter Services (für Badge) |
| `hatServices` | Boolean: mindestens 1 Service |
| `kannWeiter` | Boolean: aktueller Schritt komplett |
| `istFormularGueltig` | Boolean: Kundendaten valide |
| `buchungKomplett` | Boolean: alle Schritte erledigt |
| `gefilterteStandorte` | Standorte für gewählte Marke |
| `warenkorbAnzeigeItems` | Progressiv: nur gewählte Schritte (Marke, Autohaus, Services, Termin) |
| `naechsterArbeitstag` | Dynamisch berechneter nächster Arbeitstag |
| `schnellTermineDynamisch` | 4 Termine ab nächstem Arbeitstag |

### Variables / State
| Variable | Beschreibung |
|----------|--------------|
| `marken` | Liste aller Marken |
| `standorte` | Liste aller Standorte |
| `services` | Liste aller Services |
| `optionen` | Service-Optionen |
| `schnellTermine` | Schnelltermin-Vorschläge |
| `kalenderTermine` | Kalender-Termine |
| `gewaehlteMarke` | Aktuell gewählte Marke |
| `gewaehlterStandort` | Aktuell gewählter Standort |
| `gewaehlteServices` | Warenkorb |
| `gewaehlterTermin` | Ausgewählter Termin |
| `kundendaten` | Kundendaten-Objekt |
| `bemerkungen` | Bemerkungen-Text |
| `istLaden` | Loading-State |
| `fehler` | Fehlermeldung |
| `aktuellerSchritt` | Wizard-Schritt (1-10) |

---

## 17. i18n Keys (Verschachteltes Format)

> **Hinweis:** Siehe `.claude/skills/i18n-typings.md` für das Pattern. Beide Sprachen im gleichen verschachtelten Format!

### DE (Deutsch)

```typescript
export const buchungTranslations = {
  de: {
    buchung: {
      // Schritt 1: Markenauswahl
      marke: {
        titel: 'Welche Fahrzeugmarke fahren Sie?',
        untertitel: 'Bitte wählen Sie die gewünschte Marke aus.'
      },

      // Schritt 2: Standortwahl
      standort: {
        titel: 'An welchem Standort dürfen wir Sie begrüßen?',
        untertitel: 'Bitte wählen Sie den gewünschten Standort aus.'
      },

      // Schritt 3: Serviceauswahl
      services: {
        titel: 'Welche Services möchten Sie buchen?',
        huAu: {
          label: 'HU/AU',
          beschreibung: 'Jetzt Ihren Termin für eine gesetzliche HU/AU vereinbaren!'
        },
        inspektion: {
          label: 'Inspektion',
          beschreibung: 'Lassen Sie Ihre fällige Inspektion hier durchführen! Buchen Sie jetzt einen Termin.'
        },
        raederwechsel: {
          label: 'Räderwechsel',
          beschreibung: 'Kommen Sie zu uns für Ihren Räderwechsel - inkl. optionaler Einlagerung!'
        }
      },

      // Service-Optionen (in expandierter Kachel)
      optionen: {
        titel: 'Service-Optionen',
        ohneEinlagerung: 'Räderwechsel ohne Einlagerung',
        mitEinlagerung: 'Räderwechsel mit Einlagerung',
        bestaetigen: 'Bestätigen'
      },

      // Warenkorb-Icon (im Header, REQ-001, auf allen Seiten)
      warenkorb: {
        titel: 'Ihre Buchung',
        leer: 'Noch keine Auswahl getroffen',
        markeLabel: 'Marke',
        autohausLabel: 'Autohaus',
        servicesLabel: 'Services',
        terminLabel: 'Termin',
        entfernen: 'Service entfernen',
        badgeLabel: '{{anzahl}} Auswahl im Warenkorb'
      },

      // Schritt 4: Terminauswahl
      termin: {
        titel: 'Wählen Sie den für Sie passenden Tag und Uhrzeit aus',
        kalenderLink: 'Hier sehen Sie weitere freie Termine in unserem Werkstattkalender'
      },

      // Schritt 5: Kalender
      kalender: {
        titel: 'Hier sehen Sie weitere freie Termine in unserem Werkstattkalender',
        wunschtermin: 'Ihr Wunschtermin:',
        wunschterminHilfe: 'Wählen Sie Ihren Wunschtermin. Wir zeigen Ihnen alle freien Termine ab diesem Tag an.',
        verfuegbar: 'Wählen Sie links im Kalender einen gewünschten Tag aus und wir zeigen Ihnen die ab diesem Zeitpunkt nächsten freien Termine an.'
      },

      // Schritt 6: Kundendaten
      kundendaten: {
        titel: 'Bitte geben Sie uns die letzten Informationen zu Ihrem Fahrzeug',
        bestandskunde: 'Schon einmal bei uns gewesen?',
        bestandskundeHilfe: 'Dann rufen Sie Ihre Daten automatisch mit Eingabe Ihrer E-Mail-Adresse ab.',
        datenAbrufen: 'Jetzt Daten abrufen!',
        email: 'E-Mail Adresse',
        anrede: {
          label: 'Anrede',
          herr: 'Herr',
          frau: 'Frau',
          divers: 'Divers'
        },
        vorname: 'Vorname',
        nachname: 'Nachname',
        strasse: 'Straße und Haus Nr.',
        plz: 'Postleitzahl',
        ort: 'Wohnort',
        telefon: {
          label: 'Mobilfunknummer',
          hilfe: 'Bitte geben Sie Ihre Mobilfunknummer ohne Sonderzeichen als Zahl im Format 01701234567 ein.'
        },
        kennzeichen: 'KFZ Kennzeichen',
        kilometerstand: 'Kilometerstand',
        fin: {
          label: 'FIN',
          erklaerung: 'Erklärung der FIN',
          optional: 'Für dieses Feld ist keine Angabe erforderlich.'
        },
        datenschutz: 'Ich willige in die Verarbeitung meiner personenbezogenen Daten zum Zwecke der Online-Terminvereinbarung ein. Näheres finden Sie in unserer Datenschutzerklärung.',
        pflichtfelder: 'Pflichtfelder sind mit * gekennzeichnet'
      },

      // Schritt 7: Bemerkungen
      bemerkungen: {
        titel: 'Bitte geben Sie uns weitere Hinweise zu Ihrer Buchung',
        frage: 'Möchten Sie uns noch etwas zu Ihrer Buchung mitteilen?',
        label: 'Anmerkungen',
        placeholder: 'Bitte tragen Sie hier Ihre Nachricht an uns ein (Hinweise, Buchung weiterer Leistungen etc.)',
        hinweiseTitel: 'Wichtige Hinweise zu Ihren ausgewählten Services',
        hinweis: {
          huAu: 'HU/AU: Hier kann Ihr besonderer Hinweis zur gewählten Leistung stehen. Bsp. HU/AU nur möglich Montags, Mittwochs und Freitags.',
          inspektion: 'Inspektion: Hier kann Ihr besonderer Hinweis zur gewählten Leistung stehen. Bsp. "Immer Fahrzeugschein mitbringen".'
        }
      },

      // Schritt 8: Übersicht
      uebersicht: {
        titel: 'Übersicht',
        untertitel: 'Bitte prüfen Sie Ihre Angaben bevor Sie den Termin versenden.',
        wunschtermin: 'Wunschtermin',
        datum: 'Datum',
        uhrzeit: 'Uhrzeit',
        gewahlterService: 'Gewählter Service',
        leistungen: 'Folgende Leistungen werden in {{standort}} für Sie angefragt:',
        preis: '{{preis}} €',
        inklMwst: 'inkl. Mehrwertsteuer',
        ihreDaten: 'Ihre Daten',
        name: 'Name',
        strasse: 'Straße',
        ort: 'Ort',
        telefon: 'Telefon',
        email: 'Email',
        marke: 'Marke',
        kennzeichen: 'Kennzeichen',
        kilometerstand: 'Kilometerstand'
      },

      // Buttons
      buttons: {
        weiter: 'weiter',
        zurueck: 'zurück',
        abbrechen: 'Abbrechen',
        anfragen: 'Jetzt anfragen',
        zurBuchungsuebersicht: 'Zur Buchungsübersicht'
      },

      // Fehler
      fehler: {
        pflichtfeld: 'Dieses Feld ist erforderlich',
        emailUngueltig: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
        plzUngueltig: 'Bitte geben Sie eine gültige Postleitzahl ein (5 Ziffern)',
        telefonUngueltig: 'Bitte geben Sie eine gültige Mobilfunknummer ein',
        kennzeichenUngueltig: 'Bitte geben Sie ein gültiges KFZ-Kennzeichen ein',
        kilometerstandUngueltig: 'Bitte geben Sie einen gültigen Kilometerstand ein',
        datenschutzErforderlich: 'Bitte akzeptieren Sie die Datenschutzerklärung',
        serviceErforderlich: 'Bitte wählen Sie mindestens einen Service'
      },

      // Bestätigung
      bestaetigung: {
        titel: 'Vielen Dank für Ihre Anfrage!',
        text: 'Ihre Anfrage wurde erfolgreich übermittelt. Wir melden uns in Kürze bei Ihnen.'
      }
    },

    // Datenschutz-Seite
    datenschutz: {
      titel: 'Datenschutzerklärung',
      untertitel: 'Informationen zum Datenschutz',
      zurueck: 'Zurück',
      inhalt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
    }
  },

  en: {
    buchung: {
      // Step 1: Brand selection
      marke: {
        titel: 'What vehicle brand do you drive?',
        untertitel: 'Please select your desired brand.'
      },

      // Step 2: Location selection
      standort: {
        titel: 'At which location may we welcome you?',
        untertitel: 'Please select your desired location.'
      },

      // Step 3: Service selection
      services: {
        titel: 'Which services would you like to book?',
        huAu: {
          label: 'MOT/Emissions Test',
          beschreibung: 'Schedule your appointment for a mandatory MOT/emissions test now!'
        },
        inspektion: {
          label: 'Inspection',
          beschreibung: 'Have your due inspection performed here! Book an appointment now.'
        },
        raederwechsel: {
          label: 'Tire Change',
          beschreibung: 'Come to us for your tire change - including optional tire storage!'
        }
      },

      // Service options (in expandable tile)
      optionen: {
        titel: 'Service Options',
        ohneEinlagerung: 'Tire change without storage',
        mitEinlagerung: 'Tire change with storage',
        bestaetigen: 'Confirm'
      },

      // Cart Icon (in Header, REQ-001, on all pages)
      warenkorb: {
        titel: 'Your Booking',
        leer: 'No selection made yet',
        markeLabel: 'Brand',
        autohausLabel: 'Dealership',
        servicesLabel: 'Services',
        terminLabel: 'Appointment',
        entfernen: 'Remove service',
        badgeLabel: '{{anzahl}} items in cart'
      },

      // Step 4: Appointment selection
      termin: {
        titel: 'Select the day and time that suits you',
        kalenderLink: 'See more available appointments in our workshop calendar'
      },

      // Step 5: Calendar
      kalender: {
        titel: 'See more available appointments in our workshop calendar',
        wunschtermin: 'Your preferred date:',
        wunschterminHilfe: 'Select your preferred date. We will show you all available appointments from this day.',
        verfuegbar: 'Select a date in the calendar on the left and we will show you the next available appointments from that time.'
      },

      // Step 6: Customer data
      kundendaten: {
        titel: 'Please provide us with the final information about your vehicle',
        bestandskunde: 'Been with us before?',
        bestandskundeHilfe: 'Then retrieve your data automatically by entering your email address.',
        datenAbrufen: 'Retrieve data now!',
        email: 'Email Address',
        anrede: {
          label: 'Title',
          herr: 'Mr.',
          frau: 'Mrs.',
          divers: 'Other'
        },
        vorname: 'First Name',
        nachname: 'Last Name',
        strasse: 'Street and House No.',
        plz: 'Postal Code',
        ort: 'City',
        telefon: {
          label: 'Mobile Number',
          hilfe: 'Please enter your mobile number without special characters as a number in the format 01701234567.'
        },
        kennzeichen: 'License Plate',
        kilometerstand: 'Mileage',
        fin: {
          label: 'VIN',
          erklaerung: 'VIN explanation',
          optional: 'This field is optional.'
        },
        datenschutz: 'I consent to the processing of my personal data for the purpose of online appointment booking. For more details, please see our privacy policy.',
        pflichtfelder: 'Required fields are marked with *'
      },

      // Step 7: Notes
      bemerkungen: {
        titel: 'Please provide us with additional information about your booking',
        frage: 'Would you like to tell us anything else about your booking?',
        label: 'Notes',
        placeholder: 'Please enter your message here (hints, additional services, etc.)',
        hinweiseTitel: 'Important notes about your selected services',
        hinweis: {
          huAu: 'MOT/Emissions: Your special note about the selected service can go here. E.g., MOT only available Mondays, Wednesdays, and Fridays.',
          inspektion: 'Inspection: Your special note about the selected service can go here. E.g., "Always bring vehicle registration".'
        }
      },

      // Step 8: Summary
      uebersicht: {
        titel: 'Summary',
        untertitel: 'Please review your information before submitting the appointment.',
        wunschtermin: 'Preferred Appointment',
        datum: 'Date',
        uhrzeit: 'Time',
        gewahlterService: 'Selected Service',
        leistungen: 'The following services will be requested for you in {{standort}}:',
        preis: '{{preis}} €',
        inklMwst: 'including VAT',
        ihreDaten: 'Your Data',
        name: 'Name',
        strasse: 'Street',
        ort: 'City',
        telefon: 'Phone',
        email: 'Email',
        marke: 'Brand',
        kennzeichen: 'License Plate',
        kilometerstand: 'Mileage'
      },

      // Buttons
      buttons: {
        weiter: 'next',
        zurueck: 'back',
        abbrechen: 'Cancel',
        anfragen: 'Request now',
        zurBuchungsuebersicht: 'To booking overview'
      },

      // Errors
      fehler: {
        pflichtfeld: 'This field is required',
        emailUngueltig: 'Please enter a valid email address',
        plzUngueltig: 'Please enter a valid postal code (5 digits)',
        telefonUngueltig: 'Please enter a valid mobile number',
        kennzeichenUngueltig: 'Please enter a valid license plate',
        kilometerstandUngueltig: 'Please enter a valid mileage',
        datenschutzErforderlich: 'Please accept the privacy policy',
        serviceErforderlich: 'Please select at least one service'
      },

      // Confirmation
      bestaetigung: {
        titel: 'Thank you for your request!',
        text: 'Your request has been successfully submitted. We will contact you shortly.'
      }
    },

    // Privacy page
    datenschutz: {
      titel: 'Privacy Policy',
      untertitel: 'Privacy Information',
      zurueck: 'Back',
      inhalt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
    }
  }
} as const;
```

**Zugriff in Templates (i18nKeys + TranslatePipe):**
```html
<!-- i18nKeys liefert den Key-String, Pipe löst auf -->
{{ buchung.marke.titel | translate }}
{{ buchung.services.huAu.label | translate }}
{{ buchung.kundendaten.anrede.label | translate }}
{{ buchung.buttons.weiter | translate }}
{{ buchung.fehler.pflichtfeld | translate }}
{{ datenschutz.titel | translate }}
```

```typescript
// Component Setup
protected readonly buchung = i18nKeys.buchung;
protected readonly datenschutz = i18nKeys.datenschutz;
```

---

## 18. Approval

| Role | Name | Date |
|------|------|------|
| Product Owner | | |
| Tech Lead | | |

---

## 19. Implementation Notes

**WICHTIG: i18n in BEIDEN Sprachen (DE + EN)!**

- Alle UI-Texte via `i18nKeys` + `TranslatePipe`
- Beide Sprachen (DE + EN) PFLICHT
- Siehe `.claude/skills/i18n-typings.md` für Pattern

**Click-Dummy Hinweise:**
- Alle API-Calls liefern statische Daten
- console.log bei jedem "API-Call" für Debugging
- Kein echtes Backend erforderlich
- Buchung wird nicht gespeichert (nur console.log)

**Design-Hinweise:**
- Screenshots zeigen dunkles Theme → Implementierung mit hellem Theme!
- Alle Farben aus `src/styles/_variables.scss` verwenden
- Keine hardcoded Farben!
