# REQ-007: Bemerkungen

**Status:** Draft
**Priority:** Medium
**Type:** Functional
**Created:** 2026-02-13
**Author:** Claude Code
**Wizard-Schritt:** 7 von 8

---

## 1. Overview

### 1.1 Purpose
Der Benutzer kann optionale Bemerkungen/Anmerkungen zur Buchung eingeben. Zusätzlich werden automatisch Hinweise zu den gewählten Services angezeigt.

### 1.2 Scope
**Included:**
- Textarea für Bemerkungen (optional)
- Automatische Hinweise pro gewähltem Service
- Speichern im BuchungStore

**Excluded:**
- Kundendaten (→ REQ-006)
- Übersicht (→ REQ-008)

### 1.3 Related Requirements
- REQ-001: Header (Warenkorb zeigt kompletten Buchungsstand)
- REQ-006-Kundendaten (vorheriger Schritt)
- REQ-008-Uebersicht (nächster Schritt)

---

## 2. User Story

**Als** Kunde
**möchte ich** der Werkstatt besondere Hinweise mitgeben
**damit** sie sich besser auf meinen Termin vorbereiten kann.

**Acceptance Criteria:**
- [ ] AC-1: Textarea für Freitext-Bemerkungen
- [ ] AC-2: Hinweise zu gewählten Services werden automatisch angezeigt
- [ ] AC-3: "Weiter" navigiert zu Übersicht (auch ohne Bemerkungen)
- [ ] AC-4: Warenkorb-Icon im Header zeigt kompletten Stand

---

## 3. Preconditions

### 3.1 System
- BuchungStore verfügbar

### 3.2 User
- Benutzer hat `/home/bemerkungen` aufgerufen

### 3.3 Data
- Hinweise pro Service sind statisch konfiguriert.
- Store-Methode `setzeBemerkungen()` liefert ein console.log und speichert statisch im Store (Click-Dummy).

### 3.4 Übergabe (Input von REQ-006-Kundendaten)
| Feld | Typ | Quelle | Pflicht |
|------|-----|--------|---------|
| `BuchungStore.gewaehlteMarke` | `Marke` | REQ-002 | **Ja** |
| `BuchungStore.gewaehlterStandort` | `Standort` | REQ-003 | **Ja** |
| `BuchungStore.gewaehlteServices` | `GewaehlterService[]` | REQ-004 | **Ja** (min 1) |
| `BuchungStore.gewaehlterTermin` | `Termin` | REQ-005 | **Ja** |
| `BuchungStore.kundendaten` | `Kundendaten` | REQ-006 | **Ja** (validiert) — Guard prüft, redirect zu `/home/kundendaten` wenn ungültig |

---

## 4. Main Flow

![Bemerkungen](./mockup.png)

**Step 1:** Seite wird geladen
- **System:** Zeigt "Bitte geben Sie uns weitere Hinweise zu Ihrer Buchung"
- **System:** Zeigt Textarea mit Placeholder
- **System:** Zeigt Hinweise zu gewählten Services (automatisch)

**Step 2:** Benutzer gibt optionale Bemerkungen ein
- **User:** Tippt Text in Textarea (optional)

**Step 3:** Benutzer klickt "Weiter"
- **System:** Speichert `bemerkungen` im BuchungStore (auch leer)
- **System:** Navigiert zu `/home/uebersicht` (REQ-008)

---

## 5. Alternative Flows

### 5.1 Keine Bemerkungen

**Trigger:** Benutzer klickt "Weiter" ohne Text einzugeben

**Flow:**
1. System speichert leeren String
2. Navigation zur Übersicht (kein Fehler)

### 5.2 Zurück zu Kundendaten

**Trigger:** Benutzer klickt Zurück-Pfeil

**Flow:**
1. Bemerkungen bleiben im Store erhalten
2. Navigation zu `/home/kundendaten`

---

## 6. Exception Flows

### 6.1 Kundendaten ungültig

**Trigger:** Direktaufruf ohne valide Kundendaten

**Flow:**
1. Guard prüft `BuchungStore.kundendaten`
2. Redirect zu `/home/kundendaten`

---

## 7. Postconditions

### 7.1 Success — Übergabe an REQ-008
| Feld | Typ | Wert | Beschreibung |
|------|-----|------|--------------|
| `BuchungStore.gewaehlteMarke` | `Marke` | | Von REQ-002 |
| `BuchungStore.gewaehlterStandort` | `Standort` | | Von REQ-003 |
| `BuchungStore.gewaehlteServices` | `GewaehlterService[]` | | Von REQ-004 |
| `BuchungStore.gewaehlterTermin` | `Termin` | | Von REQ-005 |
| `BuchungStore.kundendaten` | `Kundendaten` | | Von REQ-006 |
| `BuchungStore.bemerkungen` | `string` | Optional, kann leer sein | **Neu eingegeben** |

### 7.2 Failure
- Keine — Bemerkungen sind optional

---

## 8. Business Rules

- **BR-1:** Bemerkungen sind optional (leerer String erlaubt)
- **BR-2:** Service-Hinweise werden automatisch aus statischen Daten generiert

---

## 9. Non-Functional Requirements

### Usability
- Mobile-First: Full-width Textarea
- WCAG 2.1 AA: Label mit Textarea verknüpft

---

## 10. Data Model

Kein eigenes Modell — `bemerkungen: string` im BuchungStore.

**Service-Hinweise (statisch):**

| Service | Hinweis |
|---------|---------|
| HU/AU | HU/AU nur möglich Montags, Mittwochs und Freitags. |
| Inspektion | Immer Fahrzeugschein mitbringen. |

---

## 11. UI/UX

### Mockup
![Bemerkungen](./mockup.png)

### Layout
- Frage: "Möchten Sie uns noch etwas zu Ihrer Buchung mitteilen?"
- Textarea mit Placeholder
- Darunter: Service-Hinweise als Info-Boxen
- "Weiter"-Button unten rechts

---

## 12. API Specification

Kein API-Call — reine Formulareingabe.

---

## 13. Test Cases

### TC-1: Mit Bemerkungen
- **Given:** Benutzer auf Bemerkungen-Seite
- **When:** Tippt "Bitte Rückruf" + klickt "Weiter"
- **Then:** `BuchungStore.bemerkungen === 'Bitte Rückruf'`, Navigation zu Übersicht

### TC-2: Ohne Bemerkungen
- **Given:** Textarea ist leer
- **When:** Klickt "Weiter"
- **Then:** Navigation zu Übersicht (kein Fehler)

### TC-3: Service-Hinweise angezeigt
- **Given:** HU/AU + Inspektion gewählt
- **Then:** Beide Hinweise werden angezeigt

### TC-4: Guard — keine Kundendaten
- **Given:** Keine validen Kundendaten
- **When:** Direktaufruf `/home/bemerkungen`
- **Then:** Redirect zu `/home/kundendaten`

---

## 14. Implementation

### Components
- [ ] `BemerkungenContainerComponent` — Container, inject(BuchungStore)
- [ ] `BemerkungenFormularComponent` — Presentational, Textarea + Hinweise

### Route
```typescript
{
  path: 'bemerkungen',
  component: BemerkungenContainerComponent,
  canActivate: [kundendatenGueltigGuard]
}
```

### Folder
```
src/app/features/home/components/bemerkungen/
├── bemerkungen-container.component.ts
├── bemerkungen-container.component.html
├── bemerkungen-container.component.scss
├── bemerkungen-formular.component.ts
├── bemerkungen-formular.component.html
└── bemerkungen-formular.component.scss
```

---

## 15. Dependencies

**Requires:**
- REQ-006-Kundendaten (liefert valide `kundendaten`)

**Blocks:**
- REQ-008-Uebersicht

---

## 16. Naming Glossary

### Container Methods
| Methode | Beschreibung |
|---------|--------------|
| `beimWeiter()` | Bemerkungen speichern + navigieren |

### Signal Store Methods
| Methode | Beschreibung |
|---------|--------------|
| `setzeBemerkungen(text)` | Bemerkungen im Store setzen |

---

## 17. i18n Keys

```typescript
// DE
buchung: {
  bemerkungen: {
    titel: 'Bitte geben Sie uns weitere Hinweise zu Ihrer Buchung',
    frage: 'Möchten Sie uns noch etwas zu Ihrer Buchung mitteilen?',
    label: 'Anmerkungen',
    placeholder: 'Bitte tragen Sie hier Ihre Nachricht an uns ein...',
    hinweiseTitel: 'Wichtige Hinweise zu Ihren ausgewählten Services',
    hinweis: {
      huAu: 'HU/AU: HU/AU nur möglich Montags, Mittwochs und Freitags.',
      inspektion: 'Inspektion: Immer Fahrzeugschein mitbringen.'
    }
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
