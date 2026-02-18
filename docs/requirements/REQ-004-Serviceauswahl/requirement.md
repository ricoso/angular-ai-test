# REQ-004: Serviceauswahl

**Status:** In Progress
**Priority:** High
**Type:** Functional
**Created:** 2026-02-16
**Author:** Claude Code
**Wizard-Schritt:** 3 von 8

---

## 1. Overview

### 1.1 Purpose
Der Benutzer wählt einen oder mehrere Services (HU/AU, Inspektion, Räderwechsel) aus. Manche Services bieten Untervarianten an (z.B. Räderwechsel mit/ohne Einlagerung) der Service kann nach anwahl einer Optione und mit klick auf bestätigungsschaltflächen ausgewählt werden. 

### 1.2 Scope
**Included:**
- Anzeige der 3 Service-Karten (HU/AU, Inspektion, Räderwechsel) mit Icon (siehe mockups /docs/requirments/REQ-004...) 
- Mehrfachauswahl (Multi-Select) der Services
- für Service-Untervarianten (Räderwechsel) hier werden die varianten im radio button mode ausgewählt
- Zusammenfassungsleiste (Bottom-Bar) mit gewählten Services
- Speichern der gewählten Services und Variante im BookingStore
- Navigation zu REQ-005 (nächster Wizard-Schritt)
- zurück und weiter schaltflächen auf der Service auswahlseite


**Excluded:**
- Standortwahl (→ REQ-003)
- Terminbuchung (→ REQ-005+)

### 1.3 Related Requirements
- REQ-001: Header (Warenkorb zeigt nach Auswahl: Marke + Standort + Services)
- REQ-003-Standortwahl (vorheriger Schritt, liefert `selectedLocation`)
- REQ-005 (nächster Schritt)

---

## 2. User Story

**Als** Kunde
**möchte ich** einen oder mehrere Services für mein Fahrzeug auswählen
**damit** ich genau die gewünschten Leistungen buchen kann.

**Acceptance Criteria:**
- [ ] AC-1: Benutzer sieht 3 Service-Karten: HU/AU, Inspektion, Räderwechsel
- [ ] AC-2: Jede Karte zeigt Titel, Icon und Beschreibungstext
- [ ] AC-3: Klick auf eine Karte selektiert/deselektiert den Service (Toggle)
- [ ] AC-4: Selektierte Karten zeigen ein Häkchen-Icon oben rechts und umrandet
- [ ] AC-6: Räderwechsel-Karte zeigt Radio-Buttons (mit/ohne Einlagerung) und Bestätigen/Abwählen-Button direkt auf der Karte
- [ ] AC-7: Header warenkorb Anzahl-Badge erscheint sobald mindestens 1 Service gewählt ist, es wird auch die marken-auswahl und standort-auswahl angezeigt innerhalb des warenkorbs
- [ ] AC-8: Header warenkorb zeigt Warenkorb-Icon mit Anzahl-Badge 
- [ ] AC-9: Header warenkorb zeigt gewählte Services mit variante als Chips mit Icon
- [ ] AC-10: unter service card auswahl wird eine row angezeigt mit zurück und weiter button, auf jeder vorherigen und nachfolgenden seite
- [ ] AC-11: Klick auf "weiter" speichert im BookingStore und navigiert zum nächsten Schritt, zurück löscht aus bookingstore und navigiert zur vorherigen seite
- [ ] AC-12: Überschrift zeigt "Welche Services möchten Sie buchen?"

---

## 3. Preconditions

### 3.1 System
- BookingStore verfügbar
- Header-Component (REQ-001) aktiv

### 3.2 User
- Benutzer hat `/home/services` aufgerufen

### 3.3 Data
- Services sind statisch konfiguriert (Click-Dummy)
- Store-Methode liefert ein console.debug und statische Werte zurück

### 3.4 Übergabe (Input von REQ-003-Standortwahl)
| Feld | Typ | Quelle | Pflicht |
|------|-----|--------|---------|
| `BookingStore.selectedBrand` | `Brand` | REQ-002 | **Ja** — Guard prüft |
| `BookingStore.selectedLocation` | `LocationDisplay` | REQ-003 | **Ja** — Guard prüft, redirect zu `/home/location` wenn leer |

---

## 4. Main Flow

**Step 1:** Seite wird geladen
- **System:** Liest `selectedBrand` und `selectedLocation` aus BookingStore
- **System:** Lädt verfügbare Services (statisch)
- **System:** Zeigt Überschrift + 3 Service-Karten im Grid

**Step 2:** Benutzer wählt einen Service (z.B. HU/AU)
- **User:** Klickt auf Service-Karte
- **System:** Togglet den Auswahlstatus der Karte
- **System:** Zeigt Häkchen-Icon und "ausgewählt"-Text auf der Karte
- **System:** Zeigt im Header Warenkorb einen oder mehrer ausgewählte services

**Step 3:** Benutzer wählt weiteren Service (z.B. Inspektion)
- **User:** Klickt auf weitere Service-Karte
- **System:** Fügt Service zur Auswahl hinzu
- **System:** Header Warenkorb aktualisiert Anzahl und Chips

**Step 4:** Benutzer wählt Räderwechsel
- **User:** Wählt eine Variante per Radio-Button auf der Räderwechsel-Karte (mit/ohne Einlagerung)
- **User:** Klickt "Bestätigen"-Button auf der Karte
- **System:** Räderwechsel als selektiert markiert, Button wechselt zu "Abwählen"

**Step 5:** Benutzer klickt "weiter"
- **User:** Klickt "weiter"-Button unterhalb der auswahl felder rechts selbe höhe(row) wie zurück
- **System:** Speichert `selectedServices` im BookingStore
- **System:** Navigiert zu `/home/...` (REQ-005, nächster Schritt)

---

## 5. Alternative Flows

### 5.1 Service deselektieren

**Trigger:** Benutzer klickt auf bereits ausgewählte Karte

**Flow:**
1. System entfernt Service aus der Auswahl
2. Häkchen verschwindet, Originaltext erscheint wieder
3. Header Warenkorb aktualisiert Anzahl und Chips
4. Falls kein Service mehr gewählt: Bottom-Bar verschwindet

### 5.2 Zurück zur Standortwahl und Marken auswahl

**Trigger:** Benutzer klickt Zurück-Button

**Flow:**
1. System navigiert zu `/home/location`
2. Gewählter Standort bleibt im Store

### 5.3 Räderwechsel abwählen

**Trigger:** Benutzer klickt "Abwählen"-Button auf der Räderwechsel-Karte (Service ist selektiert)

**Flow:**
1. Räderwechsel wird deselektiert
2. Service wird aus BookingStore entfernt
3. Button wechselt zurück zu "Bestätigen"

### 5.4 Räderwechsel — Variantenwechsel

**Trigger:** Benutzer ändert Radio-Auswahl auf der Räderwechsel-Karte (Service bereits selektiert)

**Flow:**
1. Button wechselt von "Abwählen" zu "Bestätigen"
2. User klickt "Bestätigen"-Button
3. Neue Variante wird im BookingStore gespeichert

---

## 6. Exception Flows

### 6.1 Kein Standort gewählt

**Trigger:** Direktaufruf von `/home/services` ohne Standort

**Flow:**
1. Guard prüft `BookingStore.selectedLocation`
2. Redirect zu `/home/location`

### 6.2 Keine Marke gewählt

**Trigger:** Direktaufruf ohne Marke

**Flow:**
1. Guard prüft `BookingStore.selectedBrand`
2. Redirect zu `/home/brand`

---

## 7. Postconditions

### 7.1 Success — Übergabe an REQ-005
| Feld | Typ | Wert | Beschreibung |
|------|-----|------|--------------|
| `BookingStore.selectedBrand` | `Brand` | z.B. `'audi'` | Von REQ-002 (unverändert) |
| `BookingStore.selectedLocation` | `LocationDisplay` | z.B. `{ id: 'muc', name: 'München' }` | Von REQ-003 (unverändert) |
| `BookingStore.selectedServices` | `SelectedService[]` | z.B. `[{ serviceId: 'huau', ... }]` | **Neu gewählt** |

### 7.2 Failure
- Keine Änderungen am Store

---

## 8. Business Rules

- **BR-1:** Multi-Select — Benutzer kann mehrere Services gleichzeitig wählen
- **BR-2:** Mindestens 1 Service muss gewählt sein um fortzufahren
- **BR-3:** Räderwechsel hat Untervarianten (mit/ohne Einlagerung), die per Radio-Button direkt auf der Karte gewählt werden
- **BR-4:** Servicewechsel (bei Rücknavigation) setzt nachfolgende Wizard-Schritte zurück
- **BR-5:** Services sind statisch konfiguriert (Click-Dummy, kein API-Call)

---

## 9. Non-Functional Requirements

### Performance
- Seitenaufbau < 300ms (statische Daten)

### Security
- HTTPS only
- Input validation
- CSRF protection

### Usability
- Mobile-First: Karten stacken vertikal
- Touch-friendly: Min 2.75em (44px)
- WCAG 2.1 AA
- Keyboard-Navigation für Kartenauswahl und Radio-Buttons

---

## 10. Data Model

```typescript
/**
 * Service type union
 * DE: Service-Typen / EN: Service types
 */
type ServiceType = 'huau' | 'inspection' | 'tire-change';

/**
 * Sub-variant for services with options (e.g. tire change)
 * DE: Untervariante / EN: Sub-variant
 */
interface ServiceVariant {
  id: string;
  labelKey: string;
}

/**
 * Service display model for UI rendering
 * DE: Service-Anzeige / EN: Service display
 */
interface ServiceDisplay {
  id: ServiceType;
  titleKey: string;
  descriptionKey: string;
  selectedDescriptionKey: string;
  icon: string;
  variants: ServiceVariant[];
}

/**
 * Selected service with chosen variants
 * DE: Gewählter Service / EN: Selected service
 */
interface SelectedService {
  serviceId: ServiceType;
  selectedVariantIds: string[];
}
```

**Statische Service-Daten:**

| Service | ID | Icon | Untervarianten |
|---------|----|------|----------------|
| HU/AU | `huau` | HU/AU-Prüfplakette (SVG/Material Icon) | Keine |
| Inspektion | `inspection` | Schraubenschlüssel-Kreuz (SVG/Material Icon) | Keine |
| Räderwechsel | `tire-change` | Felge/Rad (SVG/Material Icon) | "ohne Einlagerung", "mit Einlagerung" |

---

## 11. UI/UX

### Layout — Service-Karten

| Element | Typ | Beschreibung |
|---------|-----|--------------|
| Überschrift | `h1` | "Welche Services möchten Sie buchen?" |
| Service-Karte | Card (Material) | 3 Karten: HU/AU, Inspektion, Räderwechsel |
| Karten-Titel | `h2` | Service-Name (z.B. "HU/AU") |
| Karten-Icon | Icon/SVG | Service-spezifisches Icon (zentriert, mit `.icon-framed` Rahmen) |
| Karten-Text | `p` | Beschreibungstext (z.B. "Jetzt Ihren Termin für eine gesetzliche HU/AU vereinbaren!") |
| Häkchen | Icon | Oben rechts, nur bei selektiertem Service sichtbar |

### Layout — Bottom-Bar (Zusammenfassung)

| Element | Typ | Beschreibung |
|---------|-----|--------------|
| Warenkorb-Icon | Icon + Badge | Icon mit Anzahl-Badge (z.B. "2") |
| Service-Chips | Chip-Liste | Gewählte Services mit kleinem Icon und Häkchen |
| Zurück und Weiter-Button | Button (Primary) |"zurück" - links unten /  "weiter" — rechts unten |

### Layout — Räderwechsel-Karte (erweitert)

| Element | Typ | Beschreibung |
|---------|-----|--------------|
| Karten-Titel | `h2` | "Räderwechsel" |
| Karten-Icon | Icon/SVG | Rad-Icon (zentriert, mit `.icon-framed` Rahmen) |
| Karten-Text | `p` | "Kommen Sie zu uns für Ihren Räderwechsel – inkl. optionaler Einlagerung!" |
| Radio 1 | Radio (Material) | "Räderwechsel ohne Einlagerung" |
| Radio 2 | Radio (Material) | "Räderwechsel mit Einlagerung" |
| Bestätigen/Abwählen-Button | Button (Primary) | "Bestätigen" (wenn nicht selektiert) / "Abwählen" (wenn selektiert) |

### Material Components
- `mat-card` — Service-Karten
- `mat-icon` — Icons (Häkchen, Warenkorb, Schließen)
- `mat-radio-group` / `mat-radio-button` — Räderwechsel-Untervarianten
- `mat-chip-listbox` / `mat-chip` — Service-Chips in Bottom-Bar
- `mat-badge` — Anzahl-Badge am Warenkorb-Icon

### Responsive Verhalten
- **Mobile (< 48em):** Karten stacken vertikal (1 Spalte), Bottom-Bar full-width
- **Tablet (>= 48em):** 2 Spalten Grid
- **Desktop (>= 64em):** 3 Karten nebeneinander, Bottom-Bar mit Chips inline

### Design-Hinweis
Screenshots zeigen dunkles Theme → Implementierung mit **hellem Theme** aus `_variables.scss`!
- Hintergrund: `var(--color-background-page)` (hell)
- Karten: `var(--color-background-surface)` (weiß)
- Text: `var(--color-text-primary)` / `var(--color-text-secondary)`
- Buttons: `var(--color-primary)`
- Häkchen/Selected: `var(--color-primary)`

---

## 12. API Specification

```http
GET /api/services
```

**Response (200):**
```json
[
  {
    "id": "huau",
    "titleKey": "booking.services.huau.title",
    "descriptionKey": "booking.services.huau.description",
    "icon": "huau",
    "variants": []
  },
  {
    "id": "inspection",
    "titleKey": "booking.services.inspection.title",
    "descriptionKey": "booking.services.inspection.description",
    "icon": "inspection",
    "variants": []
  },
  {
    "id": "tire-change",
    "titleKey": "booking.services.tireChange.title",
    "descriptionKey": "booking.services.tireChange.description",
    "icon": "tire-change",
    "variants": [
      { "id": "without-storage", "labelKey": "booking.services.tireChange.withoutStorage" },
      { "id": "with-storage", "labelKey": "booking.services.tireChange.withStorage" }
    ]
  }
]
```

> Click-Dummy: Statische Daten, kein echter API-Call.

---

## 13. Test Cases

### TC-1: Seite laden (AC-1, AC-2, AC-12)
- **Given:** Marke + Standort gewählt
- **When:** Seite `/home/services` wird geladen
- **Then:** 3 Service-Karten werden angezeigt, Überschrift "Welche Services möchten Sie buchen?" sichtbar

### TC-2: HU/AU selektieren (AC-3, AC-4)
- **Given:** Service-Karten angezeigt
- **When:** Klick auf "HU/AU"-Karte
- **Then:** Karte zeigt Häkchen oben rechts + Umrandung, Header-Warenkorb erscheint

### TC-3: Multi-Select (BR-1)
- **Given:** HU/AU bereits selektiert
- **When:** Klick auf "Inspektion"-Karte
- **Then:** Beide Karten haben Häkchen, Header-Warenkorb zeigt "2 Services"

### TC-4: Service deselektieren (AC-3, 5.1)
- **Given:** HU/AU selektiert
- **When:** Erneuter Klick auf "HU/AU"-Karte
- **Then:** Häkchen verschwindet, Karte im Originalzustand

### TC-5: Räderwechsel — Radio sichtbar (AC-6)
- **Given:** Seite geladen
- **When:** Räderwechsel-Karte wird angezeigt
- **Then:** Radio-Buttons "ohne Einlagerung" und "mit Einlagerung" + "Bestätigen"-Button sind direkt auf der Karte sichtbar

### TC-6: Räderwechsel — Bestätigen (AC-6)
- **Given:** Radio "ohne Einlagerung" gewählt
- **When:** Klick auf "Bestätigen"-Button auf der Karte
- **Then:** Räderwechsel als selektiert markiert, Variante "without-storage" im BookingStore gespeichert, Button wechselt zu "Abwählen"

### TC-7: Räderwechsel — Abwählen (AC-6, 5.3)
- **Given:** Räderwechsel selektiert (Button zeigt "Abwählen")
- **When:** Klick auf "Abwählen"-Button
- **Then:** Räderwechsel deselektiert, Service aus BookingStore entfernt, Button wechselt zu "Bestätigen"

### TC-7a: Räderwechsel — Variantenwechsel (AC-6, 5.4)
- **Given:** Räderwechsel selektiert mit "ohne Einlagerung"
- **When:** Radio-Auswahl auf "mit Einlagerung" ändern
- **Then:** Button wechselt zu "Bestätigen", Klick auf "Bestätigen" speichert neue Variante "with-storage" im BookingStore

### TC-8: Header-Warenkorb — Badge zählt (AC-7, AC-8)
- **Given:** Keine Services gewählt
- **When:** Services nacheinander selektieren/deselektieren (1→2→1→0)
- **Then:** Badge zeigt immer aktuelle Anzahl, verschwindet bei 0

### TC-8a: Header-Warenkorb — Inhalt (AC-8, AC-9)
- **Given:** 2 Services gewählt
- **When:** Warenkorb-Header wird angezeigt
- **Then:** Text "Sie haben X Services ausgewählt" + Chips mit Icons + Marke + Standort sichtbar

### TC-9: Weiter-Navigation (AC-10, AC-11)
- **Given:** Mindestens 1 Service gewählt
- **When:** Klick auf "weiter"-Button
- **Then:** Services im BookingStore gespeichert, Navigation zum nächsten Schritt

### TC-10: Zurück-Navigation (AC-10, AC-11, 5.2)
- **Given:** Services gewählt
- **When:** Klick auf "zurück"-Button
- **Then:** Store-Reset, Navigation zur vorherigen Seite

### TC-11: Weiter disabled (BR-2)
- **Given:** Keine Services gewählt
- **When:** "weiter"-Button wird angezeigt
- **Then:** Button ist nicht klickbar (disabled)

### TC-12: Guard — kein Standort (6.1)
- **Given:** Kein Standort im Store
- **When:** Direktaufruf `/home/services`
- **Then:** Redirect zu `/home/location`

### TC-13: Guard — keine Marke (6.2)
- **Given:** Keine Marke im Store
- **When:** Direktaufruf `/home/services`
- **Then:** Redirect zu `/home/brand`
/
---

## 14. Implementation

### Components
- [ ] `ServiceSelectionContainerComponent` — Container, `inject(BookingStore)`, OnPush
- [ ] `ServiceCardComponent` — Presentational, `input(service)`, `input(isSelected)`, `output(serviceClicked)`, `output(tireChangeConfirmed)`, `output(tireChangeDeselected)` — enthält Radio-Buttons + Bestätigen/Abwählen für Räderwechsel
- [ ] `ServiceSummaryBarComponent` — Presentational, `input(selectedServices)`, `output(continueClicked)`, `output(barClosed)`

### Services
- [ ] `ServiceApiService` — API Service (Click-Dummy: statische Daten)

### Store Extension
- [ ] BookingStore erweitern um: `services`, `selectedServices`, `setServices()`, `toggleService()`, `loadServices()`

### Route
```typescript
{
  path: 'services',
  loadComponent: () => import('./components/service-selection/service-selection-container.component')
    .then(m => m.ServiceSelectionContainerComponent),
  canActivate: [locationSelectedGuard],
  resolve: { _: servicesResolver }
}
```

### Guard
- [ ] `locationSelectedGuard` — Prüft ob `selectedLocation` im BookingStore gesetzt ist

### Resolver
- [ ] `servicesResolver` — Lädt Services über BookingStore.loadServices()

### Folder
```
src/app/features/booking/components/service-selection/
├── service-selection-container.component.ts
├── service-selection-container.component.html
├── service-selection-container.component.scss
├── service-card.component.ts
├── service-card.component.html
├── service-card.component.scss
├── service-summary-bar.component.ts
├── service-summary-bar.component.html
└── service-summary-bar.component.scss
```

---

## 15. Dependencies

**Requires:**
- REQ-001: Header (Warenkorb-Icon)
- REQ-002-Markenauswahl (liefert `selectedBrand`)
- REQ-003-Standortwahl (liefert `selectedLocation`)

**Blocks:**
- REQ-005 (nächster Wizard-Schritt, benötigt `selectedServices`)

---

## 16. Naming Glossary

### Container Methods
| Methode | Beschreibung |
|---------|--------------|
| `onServiceClick(service)` | Service-Karte geklickt → Toggle (HU/AU, Inspektion) |
| `onContinue()` | Weiter-Button → Store + Navigation |
| `onBack()` | Zurück-Button → Store-Reset + Navigation |
| `onTireChangeConfirm(variantId)` | Bestätigen-Button auf Räderwechsel-Karte → Service selektiert |
| `onTireChangeDeselect()` | Abwählen-Button auf Räderwechsel-Karte → Service deselektiert |

### API Service
| Methode | Beschreibung |
|---------|--------------|
| `getServices()` | GET alle verfügbaren Services (statisch) |

### Signal Store Methods
| Methode | Beschreibung |
|---------|--------------|
| `loadServices()` | Services laden (rxMethod) |
| `toggleService(serviceId, variantIds?)` | Service an/abwählen |
| `setSelectedServices(services)` | Gewählte Services setzen |

### Computed Signals
| Signal | Beschreibung |
|--------|--------------|
| `availableServices` | Alle verfügbaren Services |
| `selectedServices` | Aktuell gewählte Services |
| `selectedServiceCount` | Anzahl gewählter Services |
| `hasServicesSelected` | Boolean — mindestens 1 gewählt |
| `isServiceSelected(id)` | Prüft ob Service selektiert |

---

## 17. i18n Keys

```typescript
// DE
booking: {
  services: {
    title: 'Welche Services möchten Sie buchen?',
    subtitle: 'Wählen Sie die gewünschten Services aus.',
    summaryText: 'Sie haben {{count}} Services ausgewählt',
    summaryTextSingular: 'Sie haben 1 Service ausgewählt',
    continueButton: 'weiter',
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
  }
}

// EN
booking: {
  services: {
    title: 'Which services would you like to book?',
    subtitle: 'Select the desired services.',
    summaryText: 'You have selected {{count}} services',
    summaryTextSingular: 'You have selected 1 service',
    continueButton: 'continue',
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
  }
}
```

---

## 18. Approval

| Role | Name | Date |
|------|------|------|
| Product Owner | | |
| Tech Lead | | |

---

## 19. Implementation Notes

**WICHTIG: Code muss BILINGUAL sein!**

Siehe `.claude/skills/bilingual-code.md` für Details:
- Kommentare DE + EN
- Error Messages Englisch
- i18n Keys für beide Sprachen
- JSDoc bilingual

**Design-System:**
- KEINE Farben aus Screenshots!
- IMMER `_variables.scss` verwenden
- Helles Theme (nicht dunkel wie in Screenshots)
- Karten: `var(--color-background-surface)` (weiß)
- Icons: IMMER mit `.icon-framed` Rahmen
