# REQ-006: Kundendaten

**Status:** Draft
**Priority:** High
**Type:** Functional
**Created:** 2026-02-13
**Author:** Claude Code
**Wizard-Schritt:** 6 von 8

---

## 1. Overview

### 1.1 Purpose
Der Benutzer gibt seine persönlichen Daten und Fahrzeugdaten ein. Das Formular ist reaktiv (Reactive Forms) mit Validierung. Enthält Link zur Datenschutz-Seite (REQ-009).

### 1.2 Scope
**Included:**
- Reactive Form mit 11 Feldern (Email, Anrede, Name, Adresse, Telefon, Kennzeichen, etc.)
- Client-Side Validierung aller Pflichtfelder
- Datenschutz-Checkbox mit Link zu REQ-009
- "Jetzt Daten abrufen"-Button (Click-Dummy: leer)

**Excluded:**
- Terminauswahl (→ REQ-005)
- Bemerkungen (→ REQ-007)
- Datenschutz-Seite (→ REQ-009)

### 1.3 Related Requirements
- REQ-001: Header (Warenkorb zeigt kompletten Buchungsstand)
- REQ-005-Terminauswahl (vorheriger Schritt)
- REQ-007-Bemerkungen (nächster Schritt)
- REQ-009-Datenschutz (Link in Datenschutz-Checkbox)

---

## 2. User Story

**Als** Kunde
**möchte ich** meine Kontaktdaten und Fahrzeugdaten eingeben
**damit** die Werkstatt mich kontaktieren und meinen Termin vorbereiten kann.

**Acceptance Criteria:**
- [ ] AC-1: Alle 11 Formularfelder werden angezeigt
- [ ] AC-2: Pflichtfelder sind mit * gekennzeichnet
- [ ] AC-3: Validierung bei "Weiter" (fehlerhafte Felder werden rot markiert)
- [ ] AC-4: Datenschutz-Checkbox ist Pflicht
- [ ] AC-5: Datenschutz-Link öffnet `/datenschutz` (REQ-009)
- [ ] AC-6: Focus springt zum ersten fehlerhaften Feld
- [ ] AC-7: Warenkorb-Icon zeigt kompletten Stand; Services können entfernt werden

---

## 3. Preconditions

### 3.1 System
- BuchungStore verfügbar
- Reactive Forms importiert

### 3.2 User
- Benutzer hat `/buchung/kundendaten` aufgerufen

### 3.3 Data
- Keine externen Daten benötigt (Formulareingabe)

### 3.4 Übergabe (Input von REQ-005-Terminauswahl)
| Feld | Typ | Quelle | Pflicht |
|------|-----|--------|---------|
| `BuchungStore.gewaehlteMarke` | `Marke` | REQ-002 | **Ja** |
| `BuchungStore.gewaehlterStandort` | `Standort` | REQ-003 | **Ja** |
| `BuchungStore.gewaehlteServices` | `GewaehlterService[]` | REQ-004 | **Ja** (min 1) |
| `BuchungStore.gewaehlterTermin` | `Termin` | REQ-005 | **Ja** — Guard prüft, redirect zu `/buchung/termin` wenn leer |

---

## 4. Main Flow

![Kundendaten](./mockup.png)

**Step 1:** Seite wird geladen
- **System:** Zeigt "Bitte geben Sie uns die letzten Informationen zu Ihrem Fahrzeug"
- **System:** Zeigt Bestandskunden-Bereich + Formular
- **System:** Zeigt Hinweis "Pflichtfelder sind mit * gekennzeichnet"

**Step 2:** Benutzer füllt Formular aus
- **User:** Gibt alle Pflichtfelder ein
- **User:** Aktiviert Datenschutz-Checkbox
- **System:** Echtzeit-Validierung bei Blur

**Step 3:** Benutzer klickt "Weiter"
- **System:** Validiert alle Felder
- **System:** Bei Erfolg: Speichert `kundendaten` im BuchungStore
- **System:** Navigiert zu `/buchung/bemerkungen` (REQ-007)

---

## 5. Alternative Flows

### 5.1 Validierungsfehler

**Trigger:** Benutzer klickt "Weiter" mit ungültigen Daten

**Flow:**
1. System markiert fehlerhafte Felder rot
2. Fehlermeldungen unter den Feldern
3. Focus springt zum ersten fehlerhaften Feld
4. `form.markAllAsTouched()` wird aufgerufen

### 5.2 Datenschutz-Link

**Trigger:** Benutzer klickt auf Datenschutz-Link in der Checkbox

**Flow:**
1. Navigation zu `/datenschutz` (REQ-009) in neuem Tab oder als Overlay
2. Formular-Eingaben bleiben im Store erhalten

### 5.3 Bestandskunde — Daten abrufen

**Trigger:** Benutzer klickt "Jetzt Daten abrufen"

**Flow:**
1. Click-Dummy: Nichts passiert (Placeholder)
2. Production: E-Mail-basierte Datenabfrage

---

## 6. Exception Flows

### 6.1 Kein Termin gewählt

**Trigger:** Direktaufruf ohne Termin

**Flow:**
1. Guard prüft `BuchungStore.gewaehlterTermin`
2. Redirect zu `/buchung/termin`

### 6.2 Letzter Service über Warenkorb entfernt

**Trigger:** Benutzer entfernt letzten Service im Header-Warenkorb

**Flow:**
1. Redirect zu `/buchung/services` (REQ-004, BR-5)

---

## 7. Postconditions

### 7.1 Success — Übergabe an REQ-007
| Feld | Typ | Wert | Beschreibung |
|------|-----|------|--------------|
| `BuchungStore.gewaehlteMarke` | `Marke` | | Von REQ-002 |
| `BuchungStore.gewaehlterStandort` | `Standort` | | Von REQ-003 |
| `BuchungStore.gewaehlteServices` | `GewaehlterService[]` | | Von REQ-004 |
| `BuchungStore.gewaehlterTermin` | `Termin` | | Von REQ-005 |
| `BuchungStore.kundendaten` | `Kundendaten` | Validiert | **Neu eingegeben** |

### 7.2 Failure
- Validierungsfehler werden angezeigt, Navigation blockiert

---

## 8. Business Rules

- **BR-1:** Alle Pflichtfelder müssen ausgefüllt sein
- **BR-2:** Datenschutz-Checkbox muss aktiviert sein
- **BR-3:** E-Mail muss gültig sein
- **BR-4:** PLZ muss 5 Ziffern haben
- **BR-5:** Mobilfunknummer im Format 01... (nur Ziffern)
- **BR-6:** KFZ-Kennzeichen im deutschen Format
- **BR-7:** Kilometerstand > 0
- **BR-8:** FIN optional, wenn angegeben: 17 Zeichen

---

## 9. Non-Functional Requirements

### Performance
- Validierung instant (< 50ms)

### Usability
- Mobile-First: Full-width Inputs
- Tab-Reihenfolge logisch
- WCAG 2.1 AA: Labels mit Inputs verknüpft

### Security
- Click-Dummy: Keine echten Daten speichern
- Input Sanitization

---

## 10. Data Model

```typescript
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

type Anrede = 'herr' | 'frau' | 'divers';
```

### Formularfelder

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

---

## 11. UI/UX

### Mockup
![Kundendaten](./mockup.png)

### Layout
- Bestandskunden-Bereich oben (E-Mail + "Daten abrufen")
- Formular in 2 Spalten (Desktop), 1 Spalte (Mobile)
- Datenschutz-Checkbox + Link unten
- "Weiter"-Button unten rechts

### Features
- "Erklärung der FIN" Info-Button (Tooltip/Overlay)
- Fehlermarkierung: rote Border + Fehlermeldung unter Feld

---

## 12. API Specification

Kein API-Call — reine Formulareingabe. Daten werden im BuchungStore gespeichert.

---

## 13. Test Cases

### TC-1: Happy Path
- **Given:** Alle Felder korrekt ausgefüllt, Datenschutz akzeptiert
- **When:** Klick "Weiter"
- **Then:** Navigation zu Bemerkungen

### TC-2: Pflichtfeld leer
- **Given:** Vorname ist leer
- **When:** Klick "Weiter"
- **Then:** Feld rot markiert, Fehlermeldung "Dieses Feld ist erforderlich"

### TC-3: Ungültige E-Mail
- **Given:** E-Mail = "test"
- **When:** Klick "Weiter"
- **Then:** "Bitte geben Sie eine gültige E-Mail-Adresse ein"

### TC-4: PLZ ungültig
- **Given:** PLZ = "123"
- **When:** Klick "Weiter"
- **Then:** "Bitte geben Sie eine gültige Postleitzahl ein (5 Ziffern)"

### TC-5: Datenschutz nicht akzeptiert
- **Given:** Alles korrekt, Datenschutz-Checkbox nicht aktiviert
- **When:** Klick "Weiter"
- **Then:** "Bitte akzeptieren Sie die Datenschutzerklärung"

### TC-6: Guard — kein Termin
- **Given:** Kein Termin im Store
- **When:** Direktaufruf `/buchung/kundendaten`
- **Then:** Redirect zu `/buchung/termin`

---

## 14. Implementation

### Components
- [ ] `KundendatenContainerComponent` — Container, FormGroup, inject(BuchungStore)
- [ ] `KundendatenFormularComponent` — Presentational, `input(formGroup)`, zeigt Felder + Fehler

### Route
```typescript
{
  path: 'kundendaten',
  component: KundendatenContainerComponent,
  canActivate: [terminGewaehltGuard]
}
```

### Folder
```
src/app/features/buchung/components/kundendaten/
├── kundendaten-container.component.ts
├── kundendaten-container.component.html
├── kundendaten-container.component.scss
├── kundendaten-formular.component.ts
├── kundendaten-formular.component.html
└── kundendaten-formular.component.scss

src/app/features/buchung/validators/
└── kundendaten.validators.ts
```

---

## 15. Dependencies

**Requires:**
- REQ-001: Header (Warenkorb-Icon)
- REQ-005-Terminauswahl (liefert `gewaehlterTermin`)
- REQ-009-Datenschutz (Link in Checkbox)

**Blocks:**
- REQ-007-Bemerkungen (benötigt valide `kundendaten`)

---

## 16. Naming Glossary

### Container Methods
| Methode | Beschreibung |
|---------|--------------|
| `beimWeiter()` | Formular validieren + speichern + navigieren |

### Signal Store Methods
| Methode | Beschreibung |
|---------|--------------|
| `setzeKundendaten(daten)` | Kundendaten im Store setzen |

### Computed Signals
| Signal | Beschreibung |
|--------|--------------|
| `istFormularGueltig` | Boolean: alle Pflichtfelder valide + Datenschutz akzeptiert |

---

## 17. i18n Keys

```typescript
// DE
buchung: {
  kundendaten: {
    titel: 'Bitte geben Sie uns die letzten Informationen zu Ihrem Fahrzeug',
    bestandskunde: 'Schon einmal bei uns gewesen?',
    datenAbrufen: 'Jetzt Daten abrufen!',
    email: 'E-Mail Adresse',
    anrede: { label: 'Anrede', herr: 'Herr', frau: 'Frau', divers: 'Divers' },
    vorname: 'Vorname', nachname: 'Nachname',
    strasse: 'Straße und Haus Nr.', plz: 'Postleitzahl', ort: 'Wohnort',
    telefon: { label: 'Mobilfunknummer', hilfe: '...' },
    kennzeichen: 'KFZ Kennzeichen', kilometerstand: 'Kilometerstand',
    fin: { label: 'FIN', erklaerung: 'Erklärung der FIN', optional: '...' },
    datenschutz: 'Ich willige in die Verarbeitung ... Datenschutzerklärung.',
    pflichtfelder: 'Pflichtfelder sind mit * gekennzeichnet'
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
