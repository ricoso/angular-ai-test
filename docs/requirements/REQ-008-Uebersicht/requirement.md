# REQ-008: Uebersicht

**Status:** Draft
**Priority:** High
**Type:** Functional
**Created:** 2026-02-13
**Author:** Claude Code
**Wizard-Schritt:** 8 von 8

---

## 1. Overview

### 1.1 Purpose
Letzte Seite des Wizard — zeigt eine Zusammenfassung aller Buchungsdaten. Der Benutzer prüft seine Angaben und kann die Anfrage absenden.

### 1.2 Scope
**Included:**
- Zusammenfassung: Termin, Services, Kundendaten, Fahrzeugdaten, Preis
- "Jetzt anfragen"-Button zum Absenden
- Bestätigungsmeldung nach Absenden

**Excluded:**
- Bearbeitung einzelner Felder (→ Zurück-Navigation zu jeweiligem Schritt)

### 1.3 Related Requirements
- REQ-001: Header (Warenkorb zeigt kompletten Buchungsstand)
- REQ-007-Bemerkungen (vorheriger Schritt)
- Alle REQ-002 bis REQ-007 (Daten aus allen Schritten)

---

## 2. User Story

**Als** Kunde
**möchte ich** eine Übersicht aller meiner Buchungsdaten sehen
**damit** ich alles prüfen und die Anfrage absenden kann.

**Acceptance Criteria:**
- [ ] AC-1: Wunschtermin (Datum + Uhrzeit) wird angezeigt
- [ ] AC-2: Gewählte Services mit Standort und Preis werden angezeigt
- [ ] AC-3: Kundendaten (Name, Adresse, Telefon, E-Mail) werden angezeigt
- [ ] AC-4: Fahrzeugdaten (Marke, Kennzeichen, Kilometerstand) werden angezeigt
- [ ] AC-5: Gesamtpreis inkl. MwSt wird angezeigt
- [ ] AC-6: "Jetzt anfragen" sendet Buchung (Click-Dummy: console.log)
- [ ] AC-7: Bestätigungsmeldung nach Absenden

---

## 3. Preconditions

### 3.1 System
- BuchungStore verfügbar mit komplettem State

### 3.2 User
- Benutzer hat `/buchung/uebersicht` aufgerufen

### 3.3 Data
- Alle Wizard-Schritte abgeschlossen, Daten liegen im BuchungStore.
- Store-Methode `erstelleBuchung()` liefert ein console.log mit dem kompletten DTO und gibt statische Bestätigung zurück (Click-Dummy).

### 3.4 Übergabe (Input von REQ-007-Bemerkungen)
| Feld | Typ | Quelle | Pflicht |
|------|-----|--------|---------|
| `BuchungStore.gewaehlteMarke` | `Marke` | REQ-002 | **Ja** |
| `BuchungStore.gewaehlterStandort` | `Standort` | REQ-003 | **Ja** |
| `BuchungStore.gewaehlteServices` | `GewaehlterService[]` | REQ-004 | **Ja** (min 1) |
| `BuchungStore.gewaehlterTermin` | `Termin` | REQ-005 | **Ja** |
| `BuchungStore.kundendaten` | `Kundendaten` | REQ-006 | **Ja** (validiert) |
| `BuchungStore.bemerkungen` | `string` | REQ-007 | Nein (optional) |
| — | — | — | Guard prüft `buchungKomplett`, redirect wenn nicht alle Schritte erledigt |

---

## 4. Main Flow

![Übersicht](./mockup.png)

**Step 1:** Seite wird geladen
- **System:** Zeigt "Übersicht" + "Bitte prüfen Sie Ihre Angaben"
- **System:** Rendert alle Buchungsdaten aus BuchungStore

**Step 2:** Benutzer prüft Daten
- **System:** Zeigt Wunschtermin, Services, Kundendaten, Fahrzeugdaten, Preis

**Step 3:** Benutzer klickt "Jetzt anfragen"
- **System:** Click-Dummy: `console.log(buchungDTO)`
- **System:** Zeigt Bestätigungsmeldung
- **System:** Optional: Leert Store, navigiert zur Startseite

**Angezeigte Daten:**

| Bereich | Felder |
|---------|--------|
| Wunschtermin | Datum + Uhrzeit |
| Gewählter Service | Service-Liste + Standort + Preis |
| Ihre Daten | Name, Adresse, Telefon, E-Mail |
| Fahrzeugdaten | Marke, Kennzeichen, Kilometerstand |
| Gesamtpreis | Summe inkl. MwSt |

---

## 5. Alternative Flows

### 5.1 Zurück zu Bemerkungen

**Trigger:** Benutzer klickt Zurück-Pfeil

**Flow:**
1. Navigation zu `/buchung/bemerkungen`
2. Alle Daten bleiben erhalten

### 5.2 Daten ändern

**Trigger:** Benutzer möchte Angabe korrigieren

**Flow:**
1. Benutzer navigiert über Zurück-Pfeile zum gewünschten Schritt
2. Ändert Daten
3. Navigiert wieder vorwärts zur Übersicht

---

## 6. Exception Flows

### 6.1 Buchung nicht komplett

**Trigger:** Direktaufruf ohne alle Schritte

**Flow:**
1. Guard prüft `buchungKomplett`
2. Redirect zum ersten unvollständigen Schritt

---

## 7. Postconditions

### 7.1 Success
- Buchung "gesendet" (console.log im Click-Dummy)
- Bestätigungsmeldung angezeigt
- Store wird geleert
- Optional: Navigation zur Startseite

### 7.2 Failure
- Daten bleiben im Store
- Benutzer kann erneut versuchen

---

## 8. Business Rules

- **BR-1:** Alle Felder sind read-only (keine Bearbeitung auf Übersicht)
- **BR-2:** Gesamtpreis = Summe aller Service-Preise + Optionen-Aufpreise
- **BR-3:** Click-Dummy: `console.log` statt echtem API-Call
- **BR-4:** Nach Absenden: Store leeren + Bestätigung

---

## 9. Non-Functional Requirements

### Performance
- Seitenaufbau < 300ms (alle Daten lokal im Store)

### Usability
- Übersichtliche Darstellung in Sektionen
- Mobile-First: Sektionen stacken vertikal

---

## 10. Data Model

```typescript
interface BuchungErstellenDTO {
  markeId: string;
  standortId: string;
  serviceIds: string[];
  optionIds?: string[];
  terminId: string;
  kundendaten: Omit<Kundendaten, 'datenschutzAkzeptiert'>;
  bemerkungen?: string;
}

interface BuchungBestaetigung {
  id: string;
  status: 'angefragt';
  bestaetigung: string;
}
```

---

## 11. UI/UX

### Mockup
![Übersicht](./mockup.png)

### Layout
- Sektionen: Wunschtermin, Services, Kundendaten, Fahrzeugdaten
- Desktop: 2-Spalten-Layout für Daten
- Mobile: 1 Spalte
- "Jetzt anfragen"-Button prominent unten

---

## 12. API Specification

```http
POST /api/buchungen
Content-Type: application/json

{
  "markeId": "audi",
  "standortId": "muc",
  "serviceIds": ["hu-au", "inspektion"],
  "terminId": "t1",
  "kundendaten": { ... },
  "bemerkungen": "Bitte Rückruf"
}
```

**Response (201):**
```json
{
  "id": "buchung-123",
  "status": "angefragt",
  "bestaetigung": "Ihre Anfrage wurde erfolgreich übermittelt."
}
```

> Click-Dummy: console.log, kein echter API-Call.

---

## 13. Test Cases

### TC-1: Happy Path — Absenden
- **Given:** Alle Daten komplett
- **When:** Klick "Jetzt anfragen"
- **Then:** console.log mit DTO, Bestätigungsmeldung

### TC-2: Alle Daten angezeigt
- **Given:** Marke Audi, Standort München, HU/AU + Inspektion, Termin Fr 13.02 07:30
- **Then:** Alle Daten korrekt in Übersicht sichtbar

### TC-3: Gesamtpreis berechnet
- **Given:** HU/AU (120€) + Inspektion (299€)
- **Then:** Gesamtpreis = 419€

### TC-4: Guard — nicht komplett
- **Given:** Keine Kundendaten im Store
- **When:** Direktaufruf `/buchung/uebersicht`
- **Then:** Redirect zu `/buchung/kundendaten`

---

## 14. Implementation

### Components
- [ ] `UebersichtContainerComponent` — Container, inject(BuchungStore)
- [ ] `BuchungZusammenfassungComponent` — Presentational, zeigt alle Daten

### Route
```typescript
{
  path: 'uebersicht',
  component: UebersichtContainerComponent,
  canActivate: [buchungKomplettGuard]
}
```

### Folder
```
src/app/features/buchung/components/uebersicht/
├── uebersicht-container.component.ts
├── uebersicht-container.component.html
├── uebersicht-container.component.scss
├── buchung-zusammenfassung.component.ts
├── buchung-zusammenfassung.component.html
└── buchung-zusammenfassung.component.scss
```

---

## 15. Dependencies

**Requires:**
- REQ-002 bis REQ-007 (alle vorherigen Schritte müssen Daten liefern)

**Blocks:**
- (keine — letzter Schritt)

---

## 16. Naming Glossary

### Container Methods
| Methode | Beschreibung |
|---------|--------------|
| `beimAnfrageSenden()` | "Jetzt anfragen" geklickt → DTO erstellen + senden |

### Signal Store Methods
| Methode | Beschreibung |
|---------|--------------|
| `resetBuchung()` | Wizard komplett zurücksetzen |

### Computed Signals
| Signal | Beschreibung |
|--------|--------------|
| `gesamtpreis` | Summe aller Services + Optionen |
| `buchungKomplett` | Boolean: alle Schritte erledigt |

---

## 17. i18n Keys

```typescript
// DE
buchung: {
  uebersicht: {
    titel: 'Übersicht',
    untertitel: 'Bitte prüfen Sie Ihre Angaben bevor Sie den Termin versenden.',
    wunschtermin: 'Wunschtermin', datum: 'Datum', uhrzeit: 'Uhrzeit',
    gewahlterService: 'Gewählter Service',
    leistungen: 'Folgende Leistungen werden in {{standort}} für Sie angefragt:',
    preis: '{{preis}} €', inklMwst: 'inkl. Mehrwertsteuer',
    ihreDaten: 'Ihre Daten',
    name: 'Name', strasse: 'Straße', ort: 'Ort', telefon: 'Telefon', email: 'Email',
    marke: 'Marke', kennzeichen: 'Kennzeichen', kilometerstand: 'Kilometerstand'
  },
  buttons: { anfragen: 'Jetzt anfragen' },
  bestaetigung: {
    titel: 'Vielen Dank für Ihre Anfrage!',
    text: 'Ihre Anfrage wurde erfolgreich übermittelt. Wir melden uns in Kürze.'
  }
}

// EN (analog)
```

---

## 18. Approval

| Role | Name | Date |
|------|------|------|
| Product Owner | | |
| Tech Lead | | |
