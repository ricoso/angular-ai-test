# REQ-004: Serviceauswahl

**Status:** Draft
**Priority:** High
**Type:** Functional
**Created:** 2026-02-13
**Author:** Claude Code
**Wizard-Schritt:** 3 von 8

---

## 1. Overview

### 1.1 Purpose
Der Benutzer wählt einen oder mehrere Werkstatt-Services aus. Services werden als Kacheln dargestellt. Manche Services (z.B. Räderwechsel) haben Optionen, die direkt in der expandierten Kachel angezeigt werden (KEIN Modal).

### 1.2 Scope
**Included:**
- Anzeige von 3 Services als Cards (HU/AU, Inspektion, Räderwechsel)
- Expandierbare Kacheln für Services mit Optionen
- Hinzufügen/Entfernen von Services zum BuchungStore
- Warenkorb-Icon im Header zeigt progressiv Marke + Autohaus + Services

**Excluded:**
- Terminauswahl (→ REQ-005)
- Warenkorb-Dropdown-Logik (→ REQ-001 Header)

### 1.3 Related Requirements
- REQ-001: Header (Warenkorb zeigt Marke + Autohaus + Services)
- REQ-003-Standortwahl (vorheriger Schritt)
- REQ-005-Terminauswahl (nächster Schritt)

---

## 2. User Story

**Als** Kunde
**möchte ich** Services für mein Fahrzeug auswählen
**damit** ich den passenden Werkstatttermin buchen kann.

**Acceptance Criteria:**
- [ ] AC-1: 3 Service-Cards werden angezeigt (HU/AU, Inspektion, Räderwechsel)
- [ ] AC-2: Klick auf Service ohne Optionen → direkt zum Warenkorb
- [ ] AC-3: Klick auf Service mit Optionen → Kachel expandiert, zeigt Checkboxen
- [ ] AC-4: KEIN Modal für Optionen
- [ ] AC-5: Mindestens 1 Service muss gewählt sein für "Weiter"
- [ ] AC-6: Warenkorb-Icon im Header zeigt Marke + Autohaus + gewählte Services
- [ ] AC-7: Services können über Warenkorb-Dropdown im Header entfernt werden
- [ ] AC-8: Letzter Service entfernt → Redirect zurück zu dieser Seite

---

## 3. Preconditions

### 3.1 System
- BuchungStore verfügbar
- Header-Component (REQ-001) aktiv

### 3.2 User
- Benutzer hat `/buchung/services` aufgerufen

### 3.3 Data
- Services sind statisch konfiguriert (3 Stück) und über den Resolver eingebaut.
- Store-Methode liefert ein console.log und einen statischen Wert zurück (Click-Dummy).
- Service-Optionen (Räderwechsel) ebenfalls statisch.

### 3.4 Übergabe (Input von REQ-003-Standortwahl)
| Feld | Typ | Quelle | Pflicht |
|------|-----|--------|---------|
| `BuchungStore.gewaehlteMarke` | `Marke` | REQ-002 | **Ja** |
| `BuchungStore.gewaehlterStandort` | `Standort` | REQ-003 | **Ja** — Guard prüft, redirect zu `/buchung/standort` wenn leer |

---

## 4. Main Flow

![Serviceauswahl](./mockup-services.png)

**Step 1:** Seite wird geladen
- **System:** Zeigt "Welche Services möchten Sie buchen?" + 3 Service-Cards
- **System:** Jede Card zeigt Icon, Name, Beschreibung
- **System:** "Weiter"-Button ist deaktiviert (0 Services)

**Step 2a:** Service OHNE Optionen wählen (HU/AU, Inspektion)
- **User:** Klickt auf Service-Card
- **System:** Service wird direkt zum BuchungStore hinzugefügt
- **System:** Card zeigt Häkchen, Warenkorb-Badge aktualisiert sich

**Step 2b:** Service MIT Optionen wählen (Räderwechsel)
- **User:** Klickt auf Räderwechsel-Card
- **System:** Kachel **expandiert** und zeigt Checkboxen:
  - [ ] Räderwechsel ohne Einlagerung
  - [ ] Räderwechsel mit Einlagerung
- **User:** Wählt eine Option
- **System:** Service + Option wird zum BuchungStore hinzugefügt

![Service-Optionen](./mockup-optionen.png)

**Step 3:** Weiter
- **User:** Klickt "Weiter" (nur aktiv bei 1+ Services)
- **System:** Navigiert zu `/buchung/termin` (REQ-005)

---

## 5. Alternative Flows

### 5.1 Service abwählen (auf dieser Seite)

**Trigger:** Benutzer klickt erneut auf gewählten Service

**Flow:**
1. Service wird aus BuchungStore entfernt
2. Card zeigt kein Häkchen mehr
3. Badge aktualisiert sich

### 5.2 Service über Warenkorb-Dropdown entfernen

**Trigger:** Benutzer klickt [X] bei Service im Header-Warenkorb

**Flow:**
1. Service wird aus BuchungStore entfernt
2. Card auf dieser Seite aktualisiert sich (kein Häkchen)
3. Badge aktualisiert sich
4. **Letzter Service entfernt:** Benutzer wird zu `/buchung/services` redirected (falls auf anderer Seite)

### 5.3 Zurück zur Standortwahl

**Trigger:** Benutzer klickt Zurück-Pfeil

**Flow:**
1. Gewählte Services bleiben im Store
2. Navigation zu `/buchung/standort`

---

## 6. Exception Flows

### 6.1 Keine Services gewählt

**Trigger:** Benutzer klickt "Weiter" ohne Service

**Flow:**
1. "Weiter"-Button ist deaktiviert (kein Klick möglich)
2. Hinweis: "Bitte wählen Sie mindestens einen Service"

### 6.2 Kein Standort gewählt

**Trigger:** Direktaufruf ohne Standort

**Flow:**
1. Guard prüft `BuchungStore.gewaehlterStandort`
2. Redirect zu `/buchung/standort`

---

## 7. Postconditions

### 7.1 Success — Übergabe an REQ-005
| Feld | Typ | Wert | Beschreibung |
|------|-----|------|--------------|
| `BuchungStore.gewaehlteMarke` | `Marke` | z.B. `'audi'` | Von REQ-002 |
| `BuchungStore.gewaehlterStandort` | `Standort` | z.B. `{ id: 'muc' }` | Von REQ-003 |
| `BuchungStore.gewaehlteServices` | `GewaehlterService[]` | Min 1 Eintrag | **Neu gewählt** |

### 7.2 Failure
- Keine Navigation möglich ohne Service (Button deaktiviert)

---

## 8. Business Rules

- **BR-1:** Mindestens 1 Service muss ausgewählt werden
- **BR-2:** Räderwechsel erfordert Option-Auswahl (mit/ohne Einlagerung)
- **BR-3:** Optionen werden in expandierter Kachel angezeigt, KEIN Modal
- **BR-4:** Services können jederzeit über Warenkorb-Dropdown im Header entfernt werden
- **BR-5:** Letzter Service entfernt → Redirect zu `/buchung/services`

---

## 9. Non-Functional Requirements

### Performance
- Kachel-Expansion < 100ms (Animation)
- Badge-Update sofort

### Usability
- Mobile-First: Cards stacken vertikal
- Touch-friendly: Min 2.75em Buttons
- WCAG 2.1 AA: Expandierte Kachel per Keyboard bedienbar

---

## 10. Data Model

```typescript
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

type ServiceTyp = 'hu-au' | 'inspektion' | 'raederwechsel';
type RaederwechselOption = 'ohne-einlagerung' | 'mit-einlagerung';
```

**Verfügbare Services:**

| Service | Icon | Preis | Hat Optionen |
|---------|------|-------|--------------|
| HU/AU | Tacho | 120 € | Nein |
| Inspektion | Werkzeug | 299 € | Nein |
| Räderwechsel | Felge | 39 € | Ja |

**Optionen (Räderwechsel):**

| Option | Aufpreis |
|--------|----------|
| Ohne Einlagerung | 0 € |
| Mit Einlagerung | 50 € |

---

## 11. UI/UX

### Mockups
| Ansicht | Screenshot |
|---------|------------|
| Service-Cards | ![Services](./mockup-services.png) |
| Expandierte Optionen | ![Optionen](./mockup-optionen.png) |
| Warenkorb-Dropdown | ![Warenkorb](./mockup-warenkorb.png) |

### Layout
- Cards in Grid: Desktop 3 nebeneinander, Mobile 1 Spalte
- Kachel expandiert nach unten (Optionen erscheinen)
- "Weiter"-Button unten rechts

---

## 12. API Specification

```http
GET /api/services
```

**Response (200):**
```json
[
  { "id": "hu-au", "typ": "hu-au", "name": "HU/AU", "hatOptionen": false, "preis": 120.00 },
  { "id": "inspektion", "typ": "inspektion", "name": "Inspektion", "hatOptionen": false, "preis": 299.00 },
  { "id": "raederwechsel", "typ": "raederwechsel", "name": "Räderwechsel", "hatOptionen": true, "preis": 39.00 }
]
```

```http
GET /api/services/raederwechsel/optionen
```

**Response (200):**
```json
[
  { "id": "ohne-einlagerung", "name": "Räderwechsel ohne Einlagerung", "aufpreis": 0 },
  { "id": "mit-einlagerung", "name": "Räderwechsel mit Einlagerung", "aufpreis": 50.00 }
]
```

---

## 13. Test Cases

### TC-1: Service ohne Optionen wählen
- **Given:** Service-Cards werden angezeigt
- **When:** Klick auf "HU/AU"
- **Then:** Häkchen auf Card, Badge "1", Service im Store

### TC-2: Räderwechsel expandiert
- **Given:** Service-Cards werden angezeigt
- **When:** Klick auf "Räderwechsel"
- **Then:** Kachel expandiert, 2 Optionen sichtbar (KEIN Modal)

### TC-3: Weiter-Button deaktiviert
- **Given:** 0 Services gewählt
- **Then:** "Weiter"-Button ist deaktiviert

### TC-4: Service über Warenkorb entfernen
- **Given:** 2 Services gewählt, auf anderer Seite
- **When:** Warenkorb-Icon → [X] bei einem Service
- **Then:** Service entfernt, Badge -1

### TC-5: Letzter Service entfernt → Redirect
- **Given:** 1 Service gewählt, auf Kundendaten-Seite
- **When:** Letzten Service im Warenkorb-Dropdown entfernen
- **Then:** Redirect zu `/buchung/services`

---

## 14. Implementation

### Components
- [ ] `ServiceauswahlContainerComponent` — Container, inject(BuchungStore)
- [ ] `ServiceCardComponent` — Presentational, expandierbar mit Optionen
- [ ] `ServiceCardsComponent` — Presentational, Grid aus ServiceCards

### Route
```typescript
{
  path: 'services',
  component: ServiceauswahlContainerComponent,
  resolve: { data: servicesResolver },
  canActivate: [standortGewaehltGuard]
}
```

### Folder
```
src/app/features/buchung/components/serviceauswahl/
├── serviceauswahl-container.component.ts
├── serviceauswahl-container.component.html
├── serviceauswahl-container.component.scss
├── service-card.component.ts
├── service-card.component.html
├── service-card.component.scss
├── service-cards.component.ts
├── service-cards.component.html
└── service-cards.component.scss
```

---

## 15. Dependencies

**Requires:**
- REQ-001: Header (Warenkorb-Icon + Dropdown)
- REQ-003-Standortwahl (liefert `gewaehlterStandort`)

**Blocks:**
- REQ-005-Terminauswahl (benötigt `gewaehlteServices`)

---

## 16. Naming Glossary

### Container Methods
| Methode | Beschreibung |
|---------|--------------|
| `beimServiceWaehlen(service)` | Service-Kachel angeklickt |
| `beimOptionWaehlen(service, option)` | Option in Kachel gewählt |
| `beimServiceEntfernen(serviceId)` | Service abgewählt |

### Signal Store Methods
| Methode | Beschreibung |
|---------|--------------|
| `fuegeServiceHinzu(service, option?)` | Service zum Store hinzufügen |
| `entferneService(serviceId)` | Service aus Store entfernen |
| `ladeServices()` | Services laden |

### Computed Signals
| Signal | Beschreibung |
|--------|--------------|
| `anzahlServices` | Anzahl gewählter Services (Badge) |
| `hatServices` | Boolean: min 1 Service gewählt |
| `gesamtpreis` | Summe aller Service-Preise |

---

## 17. i18n Keys

```typescript
// DE
buchung: {
  services: {
    titel: 'Welche Services möchten Sie buchen?',
    huAu: { label: 'HU/AU', beschreibung: 'Jetzt Ihren Termin für eine gesetzliche HU/AU vereinbaren!' },
    inspektion: { label: 'Inspektion', beschreibung: 'Lassen Sie Ihre fällige Inspektion hier durchführen!' },
    raederwechsel: { label: 'Räderwechsel', beschreibung: 'Kommen Sie zu uns für Ihren Räderwechsel!' }
  },
  optionen: {
    titel: 'Service-Optionen',
    ohneEinlagerung: 'Räderwechsel ohne Einlagerung',
    mitEinlagerung: 'Räderwechsel mit Einlagerung',
    bestaetigen: 'Bestätigen'
  }
}

// EN
buchung: {
  services: {
    titel: 'Which services would you like to book?',
    huAu: { label: 'MOT/Emissions Test', beschreibung: 'Schedule your mandatory MOT/emissions test now!' },
    inspektion: { label: 'Inspection', beschreibung: 'Have your due inspection performed here!' },
    raederwechsel: { label: 'Tire Change', beschreibung: 'Come to us for your tire change!' }
  },
  optionen: {
    titel: 'Service Options',
    ohneEinlagerung: 'Tire change without storage',
    mitEinlagerung: 'Tire change with storage',
    bestaetigen: 'Confirm'
  }
}
```

---

## 18. Approval

| Role | Name | Date |
|------|------|------|
| Product Owner | | |
| Tech Lead | | |
