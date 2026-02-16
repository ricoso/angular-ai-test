# REQ-004: Serviceauswahl

**Status:** Draft
**Priority:** High
**Type:** Functional
**Created:** 2026-02-16
**Author:** Claude Code
**Wizard-Schritt:** 3 von 8

---

## 1. Overview

### 1.1 Purpose
Der Benutzer wählt einen oder mehrere Services (HU/AU, Inspektion, Räderwechsel) aus. Manche Services bieten Untervarianten an (z.B. Räderwechsel mit/ohne Einlagerung), die über ein Modal auswählbar sind. Eine Zusammenfassungsleiste am unteren Bildschirmrand zeigt die gewählten Services mit Anzahl und ermöglicht die Navigation zum nächsten Schritt.

### 1.2 Scope
**Included:**
- Anzeige der 3 Service-Karten (HU/AU, Inspektion, Räderwechsel)
- Mehrfachauswahl (Multi-Select) der Services
- Modal/Overlay für Service-Untervarianten (Räderwechsel)
- Zusammenfassungsleiste (Bottom-Bar) mit gewählten Services
- Speichern der gewählten Services im BookingStore
- Navigation zu REQ-005 (nächster Wizard-Schritt)

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
- [ ] AC-4: Selektierte Karten zeigen ein Häkchen-Icon oben rechts
- [ ] AC-5: Selektierte Karten zeigen "Sie haben diesen Service ausgewählt" als Text
- [ ] AC-6: Bei Räderwechsel öffnet sich ein Modal mit Untervarianten (mit/ohne Einlagerung)
- [ ] AC-7: Bottom-Bar erscheint sobald mindestens 1 Service gewählt ist
- [ ] AC-8: Bottom-Bar zeigt Warenkorb-Icon mit Anzahl-Badge und Text "Sie haben X Services ausgewählt"
- [ ] AC-9: Bottom-Bar zeigt gewählte Services als Chips mit Icon
- [ ] AC-10: Bottom-Bar hat "weiter"-Button (rechts unten) und X-Button zum Schließen
- [ ] AC-11: Klick auf "weiter" speichert im BookingStore und navigiert zum nächsten Schritt
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
- Store-Methode liefert ein console.log und statische Werte zurück

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
- **System:** Zeigt Bottom-Bar mit gewähltem Service

**Step 3:** Benutzer wählt weiteren Service (z.B. Inspektion)
- **User:** Klickt auf weitere Service-Karte
- **System:** Fügt Service zur Auswahl hinzu
- **System:** Bottom-Bar aktualisiert Anzahl und Chips

**Step 4:** Benutzer wählt Räderwechsel
- **User:** Klickt auf Räderwechsel-Karte
- **System:** Öffnet Modal mit Untervarianten
- **User:** Wählt eine oder mehrere Untervarianten (Checkboxen)
- **User:** Klickt "Bestätigen"
- **System:** Schließt Modal, Räderwechsel als selektiert markiert

**Step 5:** Benutzer klickt "weiter"
- **User:** Klickt "weiter"-Button in Bottom-Bar
- **System:** Speichert `selectedServices` im BookingStore
- **System:** Navigiert zu `/home/...` (REQ-005, nächster Schritt)

---

## 5. Alternative Flows

### 5.1 Service deselektieren

**Trigger:** Benutzer klickt auf bereits ausgewählte Karte

**Flow:**
1. System entfernt Service aus der Auswahl
2. Häkchen verschwindet, Originaltext erscheint wieder
3. Bottom-Bar aktualisiert Anzahl und Chips
4. Falls kein Service mehr gewählt: Bottom-Bar verschwindet

### 5.2 Zurück zur Standortwahl

**Trigger:** Benutzer klickt Zurück-Pfeil (< im Header)

**Flow:**
1. System navigiert zu `/home/location`
2. Gewählter Standort bleibt im Store

### 5.3 Räderwechsel-Modal abbrechen

**Trigger:** Benutzer schließt Modal ohne Bestätigung (Klick außerhalb oder X)

**Flow:**
1. Modal schließt sich
2. Räderwechsel wird NICHT selektiert
3. Zustand bleibt unverändert

### 5.4 Bottom-Bar schließen

**Trigger:** Benutzer klickt X-Button in der Bottom-Bar

**Flow:**
1. Bottom-Bar wird eingeklappt/geschlossen
2. Services bleiben weiterhin selektiert (nur UI-Collapse)

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
- **BR-3:** Räderwechsel hat Untervarianten (mit/ohne Einlagerung), die über ein Modal gewählt werden
- **BR-4:** Servicewechsel (bei Rücknavigation) setzt nachfolgende Wizard-Schritte zurück
- **BR-5:** Services sind statisch konfiguriert (Click-Dummy, kein API-Call)

---

## 9. Non-Functional Requirements

### Performance
- Seitenaufbau < 300ms (statische Daten)
- Modal-Öffnung < 100ms

### Security
- HTTPS only
- Input validation
- CSRF protection

### Usability
- Mobile-First: Karten stacken vertikal
- Touch-friendly: Min 2.75em (44px)
- WCAG 2.1 AA
- Keyboard-Navigation für Kartenauswahl und Modal

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
| Zusammenfassungstext | `span` | "Sie haben X Services ausgewählt" |
| X-Button | Icon-Button | Schließt Bottom-Bar (rechts) |
| Service-Chips | Chip-Liste | Gewählte Services mit kleinem Icon und Häkchen |
| Weiter-Button | Button (Primary) | "weiter" — rechts unten |

### Layout — Räderwechsel-Modal

| Element | Typ | Beschreibung |
|---------|-----|--------------|
| Modal-Titel | `h2` | "Räderwechsel" |
| Modal-Icon | Icon/SVG | Rad-Icon (zentriert, mit `.icon-framed` Rahmen) |
| Modal-Text | `p` | "Kommen Sie zu uns für Ihren Räderwechsel – inkl. optionaler Einlagerung!" |
| Checkbox 1 | Checkbox (Material) | "Räderwechsel ohne Einlagerung" |
| Checkbox 2 | Checkbox (Material) | "Räderwechsel mit Einlagerung" |
| Bestätigen-Button | Button (Primary) | "Bestätigen" |

### Material Components
- `mat-card` — Service-Karten
- `mat-icon` — Icons (Häkchen, Warenkorb, Schließen)
- `mat-checkbox` — Räderwechsel-Untervarianten
- `mat-dialog` — Räderwechsel-Modal (Overlay, `var(--color-background-surface)`)
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
- Modal: `var(--color-background-surface)` (weiß)
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

### TC-1: Happy Path — Seite laden
- **Given:** Marke + Standort gewählt
- **When:** Seite `/home/services` wird geladen
- **Then:** 3 Service-Karten werden angezeigt, Überschrift sichtbar

### TC-2: Service selektieren
- **Given:** Service-Karten angezeigt
- **When:** Klick auf "HU/AU"-Karte
- **Then:** Karte zeigt Häkchen, Bottom-Bar erscheint mit "1 Service"

### TC-3: Multi-Select
- **Given:** HU/AU bereits selektiert
- **When:** Klick auf "Inspektion"-Karte
- **Then:** Beide Karten haben Häkchen, Bottom-Bar zeigt "2 Services"

### TC-4: Service deselektieren
- **Given:** HU/AU selektiert
- **When:** Erneuter Klick auf "HU/AU"-Karte
- **Then:** Häkchen verschwindet, Bottom-Bar verschwindet (0 Services)

### TC-5: Räderwechsel-Modal
- **Given:** Service-Karten angezeigt
- **When:** Klick auf "Räderwechsel"
- **Then:** Modal öffnet sich mit 2 Checkboxen

### TC-6: Räderwechsel bestätigen
- **Given:** Modal offen, "ohne Einlagerung" angehakt
- **When:** Klick auf "Bestätigen"
- **Then:** Modal schließt, Räderwechsel als selektiert, Variant "without-storage" gespeichert

### TC-7: Weiter-Navigation
- **Given:** Mindestens 1 Service gewählt
- **When:** Klick auf "weiter"
- **Then:** Services im BookingStore gespeichert, Navigation zum nächsten Schritt

### TC-8: Guard — kein Standort
- **Given:** Kein Standort im Store
- **When:** Direktaufruf `/home/services`
- **Then:** Redirect zu `/home/location`

### TC-9: Guard — keine Marke
- **Given:** Keine Marke im Store
- **When:** Direktaufruf `/home/services`
- **Then:** Redirect zu `/home/brand`

### TC-10: Bottom-Bar Chips
- **Given:** 2 Services gewählt
- **When:** Bottom-Bar sichtbar
- **Then:** 2 Chips mit Service-Icon und Name angezeigt

---

## 14. Implementation

### Components
- [ ] `ServiceSelectionContainerComponent` — Container, `inject(BookingStore)`, OnPush
- [ ] `ServiceCardComponent` — Presentational, `input(service)`, `input(isSelected)`, `output(serviceClicked)`
- [ ] `ServiceSummaryBarComponent` — Presentational, `input(selectedServices)`, `output(continueClicked)`, `output(barClosed)`
- [ ] `TireChangeDialogComponent` — Dialog/Modal für Räderwechsel-Untervarianten

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
├── service-summary-bar.component.scss
├── tire-change-dialog.component.ts
├── tire-change-dialog.component.html
└── tire-change-dialog.component.scss
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
| `onServiceClick(service)` | Service-Karte geklickt → Toggle oder Modal |
| `onContinue()` | Weiter-Button → Store + Navigation |
| `onBarClose()` | Bottom-Bar X-Button → Bar einklappen |
| `onTireChangeConfirm(variants)` | Modal bestätigt → Räderwechsel selektiert |

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
    selectedText: 'Sie haben diesen Service ausgewählt',
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
      confirmButton: 'Bestätigen'
    }
  }
}

// EN
booking: {
  services: {
    title: 'Which services would you like to book?',
    subtitle: 'Select the desired services.',
    selectedText: 'You have selected this service',
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
      confirmButton: 'Confirm'
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
- Overlays/Modals: `var(--color-background-surface)` (weiß)
- Icons: IMMER mit `.icon-framed` Rahmen
