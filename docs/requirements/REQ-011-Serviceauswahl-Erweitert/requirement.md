# REQ-011: Serviceauswahl Erweitert

**Status:** Draft
**Priority:** High
**Type:** Functional
**Created:** 2026-04-02
**Author:** Claude Code
**Wizard-Schritt:** 3 von 8 (ersetzt REQ-004)

---

## 1. Overview

### 1.1 Purpose
Erweiterung der bestehenden Serviceauswahl (REQ-004) von 3 auf 7 Service-Kategorien. Jeder Service kann individuelle Optionen besitzen, die per Checkbox (Multi-Select) ausgewählt werden. Das bisherige Radio-Button-Pattern (Räderwechsel-Varianten) wird durch ein einheitliches Checkbox-Pattern ersetzt. Material Icons werden durch custom SVG Icons ersetzt.

### 1.2 Scope
**Included:**
- Anzeige von 7 Service-Kacheln im responsiven Grid (3 Spalten Desktop, 2 Tablet, 1 Mobile)
- Checkbox-basierte Optionsauswahl pro Service (statt Radio-Buttons)
- Custom SVG Icons pro Service (statt Material Icons)
- Services ohne Optionen (Bremsflüssigkeit) mit direktem Toggle
- Bestätigen/Abwählen-Button pro Service-Karte bei Services mit Optionen
- Cart-Integration: Header-Warenkorb zeigt gewählte Services mit Optionen
- Booking Overview Integration: Service-Labels mit gewählten Optionen anzeigen
- Hinweis-Integration (REQ-005): servicespezifische Hints für alle 7 Services
- Zurück- und Weiter-Navigation unterhalb der Service-Karten

**Excluded:**
- Standortwahl (REQ-003)
- Terminbuchung (REQ-005+)
- Preisberechnung pro Service/Option

### 1.3 Related Requirements
- REQ-004: Serviceauswahl (Vorgänger, wird durch REQ-011 ersetzt)
- REQ-001: Header (Warenkorb zeigt Marke + Standort + Services)
- REQ-003: Standortwahl (vorheriger Schritt, liefert `selectedLocation`)
- REQ-005: Hinweisfenster (nächster Schritt, nutzt `selectedServices`)
- REQ-010: Buchungsübersicht (zeigt gewählte Services mit Optionen)

---

## 2. User Story

**Als** Kunde
**möchte ich** aus 7 verschiedenen Service-Kategorien wählen und pro Service individuelle Optionen per Checkbox auswählen können
**damit** ich genau die Leistungen buche, die ich benötige.

**Acceptance Criteria:**
- [ ] AC-1: Benutzer sieht 7 Service-Kacheln: Inspektion, TÜV, Wechsel Bremsflüssigkeit, Räderwechsel, Aktionen/Checks, Reparatur/Beanstandung, Karosserie/Frontscheibe wechseln
- [ ] AC-2: Jede Kachel zeigt Titel, custom SVG Icon und Beschreibungstext
- [ ] AC-3: Klick auf eine Kachel mit Optionen zeigt Checkboxen zur Auswahl an (Expand/Collapse)
- [ ] AC-4: Klick auf eine Kachel ohne Optionen (Bremsflüssigkeit) togglet den Service direkt
- [ ] AC-5: Benutzer kann pro Service beliebig viele Optionen per Checkbox auswählen
- [ ] AC-6: Nach Checkbox-Auswahl wird der Bestätigen-Button aktiv; Klick speichert Service + Optionen im Store
- [ ] AC-7: Selektierte Karten zeigen ein Häkchen-Icon oben rechts und Umrandung
- [ ] AC-8: Abwählen-Button deselektiert den gesamten Service inkl. aller Optionen
- [ ] AC-9: Header-Warenkorb zeigt Anzahl-Badge und gewählte Services als Chips mit Icon
- [ ] AC-10: Unter den Service-Karten wird eine Row mit Zurück- und Weiter-Button angezeigt
- [ ] AC-11: Klick auf "Weiter" speichert im BookingStore und navigiert zu `/home/notes`; Zurück navigiert zu `/home/location`
- [ ] AC-12: Überschrift zeigt "Welche Services möchten Sie buchen?"
- [ ] AC-13: Inspektion zeigt 7 Optionen (Dialogannahme, Inspektion, Ölwechsel-Service, Bremsen prüfen, Wischerblätter, Wartungsvertrag, Notfallöl)
- [ ] AC-14: TÜV zeigt 3 Optionen (TÜV, UVV-Prüfung, Klimaanlagenreinigung)
- [ ] AC-15: Räderwechsel zeigt 4 Optionen (eigene Räder mitbringen, eingelagerte Räder, Hol & Bringservice, Einlagerung)
- [ ] AC-16: Aktionen/Checks zeigt 4 Optionen (Garantie-Check, Sicherheits-Check, Flüssigkeitsstände, Batterie Check)
- [ ] AC-17: Reparatur zeigt 3 Optionen (Diagnose, Geräusche, Klimaanlage)
- [ ] AC-18: Karosserie zeigt 2 Optionen (Kostenvoranschlag, Windschutzscheibe)
- [ ] AC-19: Booking Overview (REQ-010) zeigt Service-Labels inklusive gewählter Optionen

---

## 3. Preconditions

### 3.1 System
- BookingStore verfügbar
- Header-Component (REQ-001) aktiv

### 3.2 User
- Benutzer hat `/home/services` aufgerufen

### 3.3 Data
- Services sind statisch konfiguriert (Click-Dummy)
- Store-Methode liefert `console.debug` und statische Werte zurück
- SVG Icons sind unter `src/assets/icons/services/` verfügbar

### 3.4 Übergabe (Input von REQ-003-Standortwahl)
| Feld | Typ | Quelle | Pflicht |
|------|-----|--------|---------|
| `BookingStore.selectedBrand` | `Brand` | REQ-002 | **Ja** — Guard prüft |
| `BookingStore.selectedLocation` | `LocationDisplay` | REQ-003 | **Ja** — Guard prüft, Redirect zu `/home/location` wenn leer |

---

## 4. Main Flow

**Step 1:** Seite wird geladen
- **System:** Liest `selectedBrand` und `selectedLocation` aus BookingStore
- **System:** Lädt verfügbare Services (statisch, 7 Stück)
- **System:** Zeigt Überschrift + 7 Service-Kacheln im responsiven Grid (3 Spalten Desktop, 2 Tablet, 1 Mobile)

**Step 2:** Benutzer klickt auf eine Service-Kachel mit Optionen (z.B. Inspektion)
- **User:** Klickt auf Service-Kachel
- **System:** Kachel expandiert und zeigt Checkbox-Optionen an
- **System:** Bestätigen-Button ist initial deaktiviert (keine Checkbox gewählt)

**Step 3:** Benutzer wählt Optionen per Checkbox
- **User:** Klickt auf eine oder mehrere Checkboxen
- **System:** Bestätigen-Button wird aktiv sobald mindestens 1 Checkbox gewählt ist

**Step 4:** Benutzer bestätigt Auswahl
- **User:** Klickt Bestätigen-Button auf der Kachel
- **System:** Service + gewählte Optionen werden im BookingStore gespeichert
- **System:** Kachel zeigt Häkchen-Icon oben rechts und Umrandung
- **System:** Button wechselt zu "Abwählen"
- **System:** Header-Warenkorb aktualisiert Anzahl und Chips

**Step 5:** Benutzer klickt auf Service ohne Optionen (Wechsel Bremsflüssigkeit)
- **User:** Klickt auf Kachel
- **System:** Togglet den Auswahlstatus direkt (kein Expand, keine Checkboxen)
- **System:** Zeigt Häkchen-Icon oben rechts und Umrandung bei Selektion
- **System:** Header-Warenkorb aktualisiert Anzahl und Chips

**Step 6:** Benutzer klickt "Weiter"
- **User:** Klickt "Weiter"-Button rechts unterhalb der Kacheln
- **System:** Speichert `selectedServices` im BookingStore
- **System:** Navigiert zu `/home/notes` (REQ-005)

---

## 5. Alternative Flows

### 5.1 Service deselektieren (mit Optionen)

**Trigger:** Benutzer klickt "Abwählen"-Button auf einer selektierten Service-Kachel

**Flow:**
1. Service wird aus `selectedServices` entfernt (inkl. aller Optionen)
2. Häkchen verschwindet, Kachel im Originalzustand
3. Checkboxen werden zurückgesetzt
4. Button wechselt von "Abwählen" zu "Bestätigen"
5. Header-Warenkorb aktualisiert Anzahl und Chips

### 5.2 Service deselektieren (ohne Optionen)

**Trigger:** Benutzer klickt erneut auf bereits selektierte Bremsflüssigkeit-Kachel

**Flow:**
1. Service wird aus `selectedServices` entfernt
2. Häkchen verschwindet, Kachel im Originalzustand
3. Header-Warenkorb aktualisiert Anzahl und Chips

### 5.3 Optionen ändern (Service bereits selektiert)

**Trigger:** Benutzer ändert Checkbox-Auswahl auf einer bereits selektierten Kachel

**Flow:**
1. Button wechselt von "Abwählen" zu "Bestätigen"
2. User klickt "Bestätigen"-Button
3. Neue Optionen werden im BookingStore gespeichert
4. Button wechselt zurück zu "Abwählen"

### 5.4 Zurück zur Standortwahl

**Trigger:** Benutzer klickt Zurück-Button

**Flow:**
1. System navigiert zu `/home/location`
2. Gewählter Standort bleibt im Store

### 5.5 Alle Checkboxen abwählen (Service noch nicht bestätigt)

**Trigger:** Benutzer deselektiert alle Checkboxen auf einer noch nicht bestätigten Kachel

**Flow:**
1. Bestätigen-Button wird deaktiviert
2. Kachel bleibt im unselektierten Zustand

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
| `BookingStore.selectedServices` | `SelectedService[]` | z.B. `[{ serviceId: 'inspection', selectedOptionIds: ['dialog-acceptance', 'oil-change'] }]` | **Neu gewählt** |

### 7.2 Failure
- Keine Änderungen am Store

---

## 8. Business Rules

- **BR-1:** Multi-Select — Benutzer kann mehrere Services gleichzeitig wählen
- **BR-2:** Mindestens 1 Service muss gewählt sein um fortzufahren ("Weiter" disabled bei 0 Services)
- **BR-3:** Services mit Optionen erfordern mindestens 1 gewählte Checkbox zur Bestätigung
- **BR-4:** Services ohne Optionen (Bremsflüssigkeit) werden direkt getoggelt ohne Bestätigung
- **BR-5:** Servicewechsel (bei Rücknavigation) setzt nachfolgende Wizard-Schritte zurück (REQ-007)
- **BR-6:** Services sind statisch konfiguriert (Click-Dummy, kein API-Call)
- **BR-7:** Optionen sind Multi-Select (Checkbox), nicht Single-Select (Radio)
- **BR-8:** SVG Icons werden per `<img>` oder Angular `mat-icon` mit `svgIcon` geladen

---

## 9. Non-Functional Requirements

### Performance
- Seitenaufbau < 300ms (statische Daten)
- SVG Icons < 5 KB pro Datei

### Security
- HTTPS only
- Input validation
- CSRF protection
- Kein `[innerHTML]` — Angular Template Escaping

### Usability
- Mobile-First: Kacheln stacken vertikal (1 Spalte)
- Touch-friendly: Min 2.75em (44px) Touch-Target
- WCAG 2.1 AA
- Keyboard-Navigation für Kacheln, Checkboxen und Buttons
- Focus-Styles (`:focus-visible`) auf allen interaktiven Elementen
- Kontrast 4.5:1 für Text

---

## 10. Data Model

```typescript
/**
 * Service type union — extended from REQ-004
 * Replaces old 3-type union with 7 types
 */
export type ServiceType = 'inspection' | 'tuv' | 'brake-fluid' | 'tire-change' | 'actions-checks' | 'repair' | 'bodywork';

/**
 * Service option for checkbox selection
 * Replaces ServiceVariant (radio-based) from REQ-004
 */
export interface ServiceOption {
  id: string;
  labelKey: TranslationKey;
}

/**
 * Service display model for UI rendering — modified
 * Changes: icon → svgIcon (path), variants → options
 */
export interface ServiceDisplay {
  id: ServiceType;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  svgIcon: string;
  options: ServiceOption[];
}

/**
 * Selected service with chosen options — modified
 * Changes: selectedVariantId → selectedOptionIds (multi-select)
 */
export interface SelectedService {
  serviceId: ServiceType;
  selectedOptionIds: string[];
}
```

**Statische Service-Daten (7 Services):**

| Service | ID | SVG Icon | Optionen |
|---------|----|----------|----------|
| Inspektion | `inspection` | `inspection.svg` | Dialogannahme, Inspektion, Ölwechsel-Service, Bremsen prüfen, Wischerblätter, Wartungsvertrag, Notfallöl |
| TÜV | `tuv` | `tuv.svg` | TÜV, UVV-Prüfung, Klimaanlagenreinigung |
| Wechsel Bremsflüssigkeit | `brake-fluid` | `brake-fluid.svg` | Keine |
| Räderwechsel | `tire-change` | `tire-change.svg` | Eigene Räder mitbringen, eingelagerte Räder, Hol & Bringservice, Einlagerung |
| Aktionen / Checks | `actions-checks` | `actions-checks.svg` | Garantie-Check, Sicherheits-Check, Flüssigkeitsstände, Batterie Check |
| Reparatur / Beanstandung | `repair` | `repair.svg` | Diagnose, Geräusche, Klimaanlage ohne Funktion |
| Karosserie / Frontscheibe | `bodywork` | `bodywork.svg` | Kostenvoranschlag, Windschutzscheibe erneuern |

**Service-Option-IDs:**

| Service | Option-ID | Label (DE) |
|---------|-----------|------------|
| `inspection` | `dialog-acceptance` | Dialogannahme |
| `inspection` | `inspection` | Inspektion |
| `inspection` | `oil-change` | Ölwechsel-Service |
| `inspection` | `brake-check` | Bremsen prüfen (kostenlos) und bei Bedarf erneuern |
| `inspection` | `wiper-blades` | Wischerblätter erneuern |
| `inspection` | `maintenance-contract` | Interesse an einem Wartungsvertrag |
| `inspection` | `emergency-oil` | 1 Liter Notfallöl |
| `tuv` | `tuv` | TÜV |
| `tuv` | `uvv-inspection` | UVV-Prüfung (für Dienstwagen & gewerblich genutzte Fahrzeuge) |
| `tuv` | `ac-cleaning` | Klimaanlagenreinigung (149,00 EUR inkl. MwSt.) |
| `tire-change` | `bring-own-tires` | Räderwechsel - ich bringe meine Räder mit |
| `tire-change` | `stored-tires` | Räderwechsel - meine Räder sind eingelagert |
| `tire-change` | `pickup-delivery` | Hol & Bringservice |
| `tire-change` | `store-tires` | Meine angelieferten Räder sollen bitte eingelagert werden |
| `actions-checks` | `warranty-check` | Kostenloser Check vor Ablauf der Herstellergarantie |
| `actions-checks` | `safety-check` | Sicherheits-Check / Saisonaler Check |
| `actions-checks` | `fluid-check` | Flüssigkeitsstände prüfen (kostenlos) und bei Bedarf auffüllen |
| `actions-checks` | `battery-check` | Batterie Check (Kostenlos im Verbund) |
| `repair` | `diagnostics` | Allgemeine Diagnosearbeiten |
| `repair` | `noises` | Geräusche |
| `repair` | `ac-malfunction` | Klimaanlage ohne Funktion |
| `bodywork` | `cost-estimate` | Kostenvoranschlag / Gutachten nach Unfall |
| `bodywork` | `windshield-replacement` | Windschutzscheibe erneuern |

---

## 11. UI/UX

### Layout — Service-Kacheln

| Element | Typ | Beschreibung |
|---------|-----|--------------|
| Überschrift | `h1` | "Welche Services möchten Sie buchen?" |
| Unterüberschrift | `p` | "Wählen Sie die gewünschten Services aus." |
| Service-Kachel | Card (Material) | 7 Kacheln im responsiven Grid |
| Kachel-Titel | `h2` | Service-Name (z.B. "Inspektion") |
| Kachel-Icon | SVG (`<img>` oder `mat-icon[svgIcon]`) | Custom SVG Icon pro Service (zentriert, mit `.icon-framed` Rahmen) |
| Kachel-Text | `p` | Beschreibungstext des Services |
| Häkchen | Icon | Oben rechts, nur bei selektiertem Service sichtbar |

### Layout — Service-Kachel mit Optionen (expandiert)

| Element | Typ | Beschreibung |
|---------|-----|--------------|
| Checkboxen | `mat-checkbox` | Eine Checkbox pro Option, Multi-Select |
| Bestätigen-Button | `mat-flat-button` | "Bestätigen" — aktiv wenn mindestens 1 Checkbox gewählt |
| Abwählen-Button | `mat-flat-button` | "Abwählen" — nur sichtbar wenn Service selektiert und keine Optionsänderung |

### Layout — Service-Kachel ohne Optionen (Bremsflüssigkeit)

| Element | Typ | Beschreibung |
|---------|-----|--------------|
| Kachel-Titel | `h2` | "Wechsel Bremsflüssigkeit" |
| Kachel-Icon | SVG | Custom SVG Icon |
| Kachel-Text | `p` | Beschreibungstext |
| Klick | Toggle | Direktes Toggle ohne Expand/Collapse |

### Layout — Navigation Row

| Element | Typ | Beschreibung |
|---------|-----|--------------|
| Zurück-Button | `mat-flat-button` | "Zurück" — links unten |
| Weiter-Button | `mat-flat-button` | "Weiter" — rechts unten, disabled bei 0 Services |

### Material Components
- `mat-card` — Service-Kacheln
- `mat-icon` — Häkchen-Icon (check_circle), ggf. SVG-Icon-Registration
- `mat-checkbox` — Optionen pro Service (ersetzt `mat-radio-button`)
- `mat-chip-listbox` / `mat-chip` — Service-Chips im Header-Warenkorb
- `mat-badge` — Anzahl-Badge am Warenkorb-Icon

### Responsive Verhalten
- **Mobile (< 48em):** Kacheln stacken vertikal (1 Spalte)
- **Tablet (>= 48em):** 2 Spalten Grid
- **Desktop (>= 64em):** 3 Spalten Grid (bei 7 Kacheln: 3+3+1)

### Design-Hinweis
Implementierung mit **hellem Theme** aus `_variables.scss`:
- Hintergrund: `var(--color-background-page)` (hell)
- Kacheln: `var(--color-background-surface)` (weiss)
- Text: `var(--color-text-primary)` / `var(--color-text-secondary)`
- Buttons: `var(--color-primary)`
- Häkchen/Selected: `var(--color-primary)`
- Overlays: `var(--color-background-surface)` (weiss)

---

## 12. API Specification

```http
GET /api/services
```

**Response (200):**
```json
[
  {
    "id": "inspection",
    "titleKey": "booking.services.inspection.title",
    "descriptionKey": "booking.services.inspection.description",
    "svgIcon": "assets/icons/services/inspection.svg",
    "options": [
      { "id": "dialog-acceptance", "labelKey": "booking.services.inspection.options.dialogAcceptance" },
      { "id": "inspection", "labelKey": "booking.services.inspection.options.inspection" },
      { "id": "oil-change", "labelKey": "booking.services.inspection.options.oilChange" },
      { "id": "brake-check", "labelKey": "booking.services.inspection.options.brakeCheck" },
      { "id": "wiper-blades", "labelKey": "booking.services.inspection.options.wiperBlades" },
      { "id": "maintenance-contract", "labelKey": "booking.services.inspection.options.maintenanceContract" },
      { "id": "emergency-oil", "labelKey": "booking.services.inspection.options.emergencyOil" }
    ]
  },
  {
    "id": "tuv",
    "titleKey": "booking.services.tuv.title",
    "descriptionKey": "booking.services.tuv.description",
    "svgIcon": "assets/icons/services/tuv.svg",
    "options": [
      { "id": "tuv", "labelKey": "booking.services.tuv.options.tuv" },
      { "id": "uvv-inspection", "labelKey": "booking.services.tuv.options.uvvInspection" },
      { "id": "ac-cleaning", "labelKey": "booking.services.tuv.options.acCleaning" }
    ]
  },
  {
    "id": "brake-fluid",
    "titleKey": "booking.services.brakeFluid.title",
    "descriptionKey": "booking.services.brakeFluid.description",
    "svgIcon": "assets/icons/services/brake-fluid.svg",
    "options": []
  },
  {
    "id": "tire-change",
    "titleKey": "booking.services.tireChange.title",
    "descriptionKey": "booking.services.tireChange.description",
    "svgIcon": "assets/icons/services/tire-change.svg",
    "options": [
      { "id": "bring-own-tires", "labelKey": "booking.services.tireChange.options.bringOwnTires" },
      { "id": "stored-tires", "labelKey": "booking.services.tireChange.options.storedTires" },
      { "id": "pickup-delivery", "labelKey": "booking.services.tireChange.options.pickupDelivery" },
      { "id": "store-tires", "labelKey": "booking.services.tireChange.options.storeTires" }
    ]
  },
  {
    "id": "actions-checks",
    "titleKey": "booking.services.actionsChecks.title",
    "descriptionKey": "booking.services.actionsChecks.description",
    "svgIcon": "assets/icons/services/actions-checks.svg",
    "options": [
      { "id": "warranty-check", "labelKey": "booking.services.actionsChecks.options.warrantyCheck" },
      { "id": "safety-check", "labelKey": "booking.services.actionsChecks.options.safetyCheck" },
      { "id": "fluid-check", "labelKey": "booking.services.actionsChecks.options.fluidCheck" },
      { "id": "battery-check", "labelKey": "booking.services.actionsChecks.options.batteryCheck" }
    ]
  },
  {
    "id": "repair",
    "titleKey": "booking.services.repair.title",
    "descriptionKey": "booking.services.repair.description",
    "svgIcon": "assets/icons/services/repair.svg",
    "options": [
      { "id": "diagnostics", "labelKey": "booking.services.repair.options.diagnostics" },
      { "id": "noises", "labelKey": "booking.services.repair.options.noises" },
      { "id": "ac-malfunction", "labelKey": "booking.services.repair.options.acMalfunction" }
    ]
  },
  {
    "id": "bodywork",
    "titleKey": "booking.services.bodywork.title",
    "descriptionKey": "booking.services.bodywork.description",
    "svgIcon": "assets/icons/services/bodywork.svg",
    "options": [
      { "id": "cost-estimate", "labelKey": "booking.services.bodywork.options.costEstimate" },
      { "id": "windshield-replacement", "labelKey": "booking.services.bodywork.options.windshieldReplacement" }
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
- **Then:** 7 Service-Kacheln werden angezeigt, Überschrift "Welche Services möchten Sie buchen?" sichtbar, jede Kachel zeigt SVG Icon + Titel + Beschreibung

### TC-2: Service mit Optionen selektieren — Inspektion (AC-3, AC-5, AC-6, AC-13)
- **Given:** Service-Kacheln angezeigt
- **When:** Klick auf "Inspektion"-Kachel
- **Then:** Kachel expandiert, 7 Checkboxen sichtbar, Bestätigen-Button initial deaktiviert

### TC-3: Checkbox-Auswahl und Bestätigen (AC-5, AC-6, AC-7)
- **Given:** Inspektion-Kachel expandiert
- **When:** Checkboxen "Dialogannahme" + "Ölwechsel-Service" anhaken, Klick auf "Bestätigen"
- **Then:** Kachel zeigt Häkchen oben rechts + Umrandung, Button wechselt zu "Abwählen", Store enthält `{ serviceId: 'inspection', selectedOptionIds: ['dialog-acceptance', 'oil-change'] }`

### TC-4: Service ohne Optionen — Bremsflüssigkeit (AC-4)
- **Given:** Service-Kacheln angezeigt
- **When:** Klick auf "Wechsel Bremsflüssigkeit"-Kachel
- **Then:** Kachel wird direkt selektiert (Häkchen + Umrandung), kein Expand, Store enthält `{ serviceId: 'brake-fluid', selectedOptionIds: [] }`

### TC-5: Service deselektieren mit Abwählen-Button (AC-8, 5.1)
- **Given:** Inspektion selektiert
- **When:** Klick auf "Abwählen"-Button
- **Then:** Inspektion deselektiert, Checkboxen zurückgesetzt, Button wechselt zu "Bestätigen"

### TC-6: Service ohne Optionen deselektieren (5.2)
- **Given:** Bremsflüssigkeit selektiert
- **When:** Erneuter Klick auf Bremsflüssigkeit-Kachel
- **Then:** Häkchen verschwindet, Kachel im Originalzustand

### TC-7: Multi-Select Services (BR-1)
- **Given:** Inspektion bereits selektiert
- **When:** TÜV-Kachel selektieren + Bremsflüssigkeit-Kachel klicken
- **Then:** 3 Services selektiert, Header-Warenkorb zeigt "3 Services"

### TC-8: Optionen ändern bei selektiertem Service (5.3)
- **Given:** Inspektion selektiert mit "Dialogannahme"
- **When:** Checkbox "Ölwechsel-Service" zusätzlich anhaken
- **Then:** Button wechselt zu "Bestätigen", Klick auf "Bestätigen" speichert neue Optionen

### TC-9: TÜV Optionen (AC-14)
- **Given:** TÜV-Kachel expandiert
- **When:** Checkboxen sichtbar
- **Then:** 3 Optionen: TÜV, UVV-Prüfung, Klimaanlagenreinigung

### TC-10: Räderwechsel Optionen (AC-15)
- **Given:** Räderwechsel-Kachel expandiert
- **When:** Checkboxen sichtbar
- **Then:** 4 Optionen: eigene Räder, eingelagerte Räder, Hol & Bringservice, Einlagerung

### TC-11: Aktionen/Checks Optionen (AC-16)
- **Given:** Aktionen/Checks-Kachel expandiert
- **When:** Checkboxen sichtbar
- **Then:** 4 Optionen: Garantie-Check, Sicherheits-Check, Flüssigkeitsstände, Batterie Check

### TC-12: Reparatur Optionen (AC-17)
- **Given:** Reparatur-Kachel expandiert
- **When:** Checkboxen sichtbar
- **Then:** 3 Optionen: Diagnose, Geräusche, Klimaanlage

### TC-13: Karosserie Optionen (AC-18)
- **Given:** Karosserie-Kachel expandiert
- **When:** Checkboxen sichtbar
- **Then:** 2 Optionen: Kostenvoranschlag, Windschutzscheibe

### TC-14: Header-Warenkorb — Badge zählt (AC-9)
- **Given:** Keine Services gewählt
- **When:** Services nacheinander selektieren/deselektieren
- **Then:** Badge zeigt immer aktuelle Anzahl, verschwindet bei 0

### TC-15: Weiter-Navigation (AC-10, AC-11)
- **Given:** Mindestens 1 Service gewählt
- **When:** Klick auf "Weiter"-Button
- **Then:** Services im BookingStore gespeichert, Navigation zu `/home/notes`

### TC-16: Weiter disabled (BR-2)
- **Given:** Keine Services gewählt
- **When:** "Weiter"-Button wird angezeigt
- **Then:** Button ist nicht klickbar (disabled)

### TC-17: Zurück-Navigation (AC-10, AC-11, 5.4)
- **Given:** Services gewählt
- **When:** Klick auf "Zurück"-Button
- **Then:** Navigation zu `/home/location`

### TC-18: Guard — kein Standort (6.1)
- **Given:** Kein Standort im Store
- **When:** Direktaufruf `/home/services`
- **Then:** Redirect zu `/home/location`

### TC-19: Guard — keine Marke (6.2)
- **Given:** Keine Marke im Store
- **When:** Direktaufruf `/home/services`
- **Then:** Redirect zu `/home/brand`

### TC-20: Booking Overview zeigt Optionen (AC-19)
- **Given:** Inspektion mit "Dialogannahme" + "Ölwechsel-Service" selektiert
- **When:** Booking Overview wird angezeigt
- **Then:** Service-Label zeigt "Inspektion" mit gewählten Optionen "Dialogannahme, Ölwechsel-Service"

### TC-21: Bestätigen disabled ohne Checkbox (BR-3)
- **Given:** Service-Kachel mit Optionen expandiert
- **When:** Keine Checkbox gewählt
- **Then:** Bestätigen-Button ist deaktiviert

---

## 14. Implementation

### Components (bestehende Dateien MODIFIZIEREN)
- [ ] `ServiceSelectionContainerComponent` — Container erweitern: generische Event Handler statt tire-change-spezifisch
- [ ] `ServiceCardComponent` — Presentational umbauen: Radio-Buttons durch Checkboxen ersetzen, Material Icon durch SVG Icon, Expand/Collapse Pattern
- [ ] `ServiceSummaryBarComponent` — Anpassung an neues `SelectedService`-Interface

### Models (bestehende Dateien MODIFIZIEREN)
- [ ] `service.model.ts` — `ServiceType` auf 7 IDs erweitern, `ServiceVariant` durch `ServiceOption` ersetzen, `ServiceDisplay.icon` durch `svgIcon`, `ServiceDisplay.variants` durch `options`, `SelectedService.selectedVariantId` durch `selectedOptionIds`, `AVAILABLE_SERVICES` auf 7 Services erweitern

### Store (bestehende Datei MODIFIZIEREN)
- [ ] `booking.store.ts` — `toggleService()` generisch mit Optionen, `confirmServiceOptions(serviceId, optionIds)` NEU, `deselectService(serviceId)` NEU, `confirmTireChange()`/`deselectTireChange()` ENTFERNEN, `BookingState.selectedServices` Typ anpassen

### Services (bestehende Datei MODIFIZIEREN)
- [ ] `booking-api.service.ts` — `getServices()` liefert 7 Services zurück

### Hints (bestehende Datei MODIFIZIEREN)
- [ ] `notes-hints.constants.ts` — Hints für alle 7 Services (statt 3), SVG Icon-Referenzen aktualisieren

### Booking Overview (bestehende Datei MODIFIZIEREN)
- [ ] `booking-overview-container.component.ts` — `resolvedServiceLabels` anpassen: Optionen statt Variante anzeigen
- [ ] `services-tile.component.ts` — Optionen-Anzeige erweitern

### i18n (bestehende Datei MODIFIZIEREN)
- [ ] `translations.ts` — 7 Services mit allen Optionen (DE + EN), `huau`-Keys entfernen

### Assets — SVG Icons (PFLICHT! NUR diese Icons verwenden!)

> **WICHTIG:** Die SVG-Icon-Dateien liegen als Vorlagen im Requirement-Ordner:
> `docs/requirements/REQ-011-Serviceauswahl-Erweitert/`
> Diese Dateien müssen 1:1 nach `src/assets/icons/services/` kopiert und umbenannt werden.
> Es dürfen KEINE anderen Icons (z.B. Material Icons) für die Services verwendet werden!

| Quell-Datei (Requirement-Ordner) | Ziel-Datei (Assets) | Service |
|----------------------------------|---------------------|---------|
| `werkzeug-icon-freigestellt.svg` | `src/assets/icons/services/inspection.svg` | Inspektion |
| `hu-icon-freigestellt.svg` | `src/assets/icons/services/tuv.svg` | TÜV |
| `warnung-icon-freigestellt.svg` | `src/assets/icons/services/brake-fluid.svg` | Wechsel Bremsflüssigkeit |
| `rad-icon-freigestellt.svg` | `src/assets/icons/services/tire-change.svg` | Räderwechsel |
| `kalender-service-icon-freigestellt.svg` | `src/assets/icons/services/actions-checks.svg` | Aktionen / Checks |
| `autowasche-icon-freigestellt.svg` | `src/assets/icons/services/repair.svg` | Reparatur / Beanstandung |
| `windschutzscheibe-icon-freigestellt.svg` | `src/assets/icons/services/bodywork.svg` | Karosserie / Frontscheibe |

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
> Route bleibt unverändert — gleiche Pfade, gleicher Guard, gleicher Resolver.

### Guard
- [ ] `locationSelectedGuard` — Prüft ob `selectedLocation` im BookingStore gesetzt ist (besteht bereits)

### Resolver
- [ ] `servicesResolver` — Lädt Services über `BookingStore.loadServices()` (besteht bereits)

### Folder
```
src/app/features/booking/components/service-selection/
├── service-selection-container.component.ts    (MODIFIZIERT)
├── service-selection-container.component.html  (MODIFIZIERT)
├── service-selection-container.component.scss  (MODIFIZIERT)
├── service-card.component.ts                   (MODIFIZIERT)
├── service-card.component.html                 (MODIFIZIERT)
├── service-card.component.scss                 (MODIFIZIERT)
├── service-summary-bar.component.ts            (MODIFIZIERT)
├── service-summary-bar.component.html          (MODIFIZIERT)
└── service-summary-bar.component.scss          (MODIFIZIERT)

src/app/features/booking/models/
└── service.model.ts                            (MODIFIZIERT)

src/app/features/booking/stores/
└── booking.store.ts                            (MODIFIZIERT)

src/app/features/booking/services/
└── booking-api.service.ts                      (MODIFIZIERT)

src/app/features/booking/components/notes/
└── notes-hints.constants.ts                    (MODIFIZIERT)

src/app/features/booking/components/booking-overview/
├── booking-overview-container.component.ts     (MODIFIZIERT)
└── components/services-tile/
    └── services-tile.component.ts              (MODIFIZIERT)

src/app/core/i18n/
└── translations.ts                             (MODIFIZIERT)

src/assets/icons/services/
├── inspection.svg                              (NEU)
├── tuv.svg                                     (NEU)
├── brake-fluid.svg                             (NEU)
├── tire-change.svg                             (NEU)
├── actions-checks.svg                          (NEU)
├── repair.svg                                  (NEU)
└── bodywork.svg                                (NEU)
```

### Effort
- Development: 8 Stunden
- Testing: 4 Stunden

---

## 15. Dependencies

**Requires:**
- REQ-001: Header (Warenkorb-Icon)
- REQ-002: Markenauswahl (liefert `selectedBrand`)
- REQ-003: Standortwahl (liefert `selectedLocation`)
- REQ-004: Serviceauswahl (Vorgänger-Implementierung als Basis)

**Blocks:**
- REQ-005: Hinweisfenster (benötigt `selectedServices` mit neuem Interface)
- REQ-010: Buchungsübersicht (benötigt `selectedServices` mit Optionen)

---

## 16. Naming Glossary

### Container Methods
| Methode | Beschreibung |
|---------|--------------|
| `onServiceClick(serviceId)` | Service-Kachel geklickt — Toggle für Services ohne Optionen |
| `onServiceConfirm(serviceId, optionIds)` | Bestätigen-Button — Service + Optionen speichern |
| `onServiceDeselect(serviceId)` | Abwählen-Button — Service komplett deselektieren |
| `onContinue()` | Weiter-Button — Store + Navigation zu `/home/notes` |
| `onBack()` | Zurück-Button — Navigation zu `/home/location` |

### API Service
| Methode | Beschreibung |
|---------|--------------|
| `getServices()` | GET alle verfügbaren Services (statisch, 7 Services) |

### Signal Store Methods
| Methode | Beschreibung |
|---------|--------------|
| `loadServices()` | Services laden (rxMethod, besteht bereits) |
| `toggleService(serviceId)` | Service ohne Optionen an/abwählen (modifiziert) |
| `confirmServiceOptions(serviceId, optionIds)` | Service mit gewählten Optionen bestätigen (NEU) |
| `deselectService(serviceId)` | Beliebigen Service deselektieren (NEU, ersetzt `deselectTireChange`) |
| `clearSelectedServices()` | Alle Services zurücksetzen (besteht bereits) |

### Computed Signals
| Signal | Beschreibung |
|--------|--------------|
| `selectedServiceIds` | Array der selektierten Service-IDs (Container-Level computed) |
| `selectedOptionsMap` | Map: serviceId -> selectedOptionIds (Container-Level computed) |
| `selectedServiceCount` | Anzahl gewählter Services (besteht bereits) |
| `hasServicesSelected` | Boolean — mindestens 1 gewählt (besteht bereits) |

---

## 17. i18n Keys

```typescript
// DE
booking: {
  services: {
    title: 'Welche Services möchten Sie buchen?',
    subtitle: 'Wählen Sie die gewünschten Services aus.',
    ariaGroupLabel: 'Verfügbare Services',
    continueButton: 'Weiter',
    backButton: 'Zurück',
    confirmButton: 'Bestätigen',
    deselectButton: 'Abwählen',
    inspection: {
      title: 'Inspektion',
      description: 'Services rund um Ihr Fahrzeug: von Inspektion über Ölwechsel bis Fahrzeugvermessung.',
      options: {
        dialogAcceptance: 'Dialogannahme',
        inspection: 'Inspektion',
        oilChange: 'Ölwechsel-Service',
        brakeCheck: 'Bremsen prüfen (kostenlos) und bei Bedarf erneuern',
        wiperBlades: 'Wischerblätter erneuern',
        maintenanceContract: 'Interesse an einem Wartungsvertrag',
        emergencyOil: '1 Liter Notfallöl'
      }
    },
    tuv: {
      title: 'TÜV',
      description: 'Hier klicken und Termin zur Haupt- & Abgasuntersuchung oder UVV-Prüfung buchen.',
      options: {
        tuv: 'TÜV',
        uvvInspection: 'UVV-Prüfung (für Dienstwagen & gewerblich genutzte Fahrzeuge)',
        acCleaning: 'Klimaanlagenreinigung (149,00 € inkl. MwSt.)'
      }
    },
    brakeFluid: {
      title: 'Wechsel Bremsflüssigkeit',
      description: 'Wechsel der Bremsflüssigkeit Ihres Fahrzeugs ist fällig? Einfach hier buchen.'
    },
    tireChange: {
      title: 'Räderwechsel',
      description: 'Alle Services rund um Ihre Räder und Reifen finden Sie hier.',
      options: {
        bringOwnTires: 'Räderwechsel - ich bringe meine Räder mit',
        storedTires: 'Räderwechsel - meine Räder sind eingelagert',
        pickupDelivery: 'Hol & Bringservice',
        storeTires: 'Meine angelieferten Räder sollen bitte eingelagert werden'
      }
    },
    actionsChecks: {
      title: 'Aktionen / Checks',
      description: 'Sie wollen Ihr Fahrzeug durchchecken lassen oder fit für die aktuelle Jahreszeit machen? Hier den passenden Service buchen.',
      options: {
        warrantyCheck: 'Kostenloser Check vor Ablauf der Herstellergarantie',
        safetyCheck: 'Sicherheits-Check / Saisonaler Check',
        fluidCheck: 'Flüssigkeitsstände prüfen (kostenlos) und bei Bedarf auffüllen',
        batteryCheck: 'Batterie Check (Kostenlos im Verbund)'
      }
    },
    repair: {
      title: 'Reparatur / Beanstandung',
      description: 'Sie haben anderweitige Anliegen bezüglich Ihres Fahrzeugs? Hier klicken und im folgenden Kommentarfeld konkretisieren.',
      options: {
        diagnostics: 'Allgemeine Diagnosearbeiten',
        noises: 'Geräusche',
        acMalfunction: 'Klimaanlage ohne Funktion'
      }
    },
    bodywork: {
      title: 'Karosserie / Frontscheibe wechseln',
      description: 'Sie benötigen eine neue Windschutzscheibe oder einen Kostenvoranschlag? Hier einfach und schnell buchen.',
      options: {
        costEstimate: 'Kostenvoranschlag / Gutachten nach Unfall',
        windshieldReplacement: 'Windschutzscheibe erneuern'
      }
    }
  },
  notes: {
    hints: {
      inspection: 'Bitte beachten Sie: Bringen Sie Ihr Serviceheft mit. Bei umfangreichen Arbeiten kann ein Ersatzfahrzeug bereitgestellt werden — bitte im Voraus anfragen.',
      tuv: 'Bitte beachten Sie: Für die HU/AU benötigen Sie alle Fahrzeugpapiere. Stellen Sie sicher, dass Ihr Fahrzeug fahrtüchtig und verkehrssicher ist.',
      brakeFluid: 'Bitte beachten Sie: Der Wechsel der Bremsflüssigkeit ist gemäß Herstellervorgaben alle 2 Jahre empfohlen.',
      tireChange: 'Bitte beachten Sie: Für die Einlagerung Ihrer Reifen bitten wir um Vorabinformation über Reifenanzahl und -größe. Die Einlagerung ist kostenpflichtig.',
      actionsChecks: 'Bitte beachten Sie: Für den Garantie-Check benötigen wir die Fahrzeugpapiere und ggf. das Serviceheft.',
      repair: 'Bitte beachten Sie: Beschreiben Sie Ihre Beanstandung so detailliert wie möglich im Kommentarfeld, damit wir uns optimal vorbereiten können.',
      bodywork: 'Bitte beachten Sie: Bei Unfallschäden benötigen wir ggf. die Schadennummer Ihrer Versicherung. Bringen Sie relevante Unterlagen mit.'
    }
  }
}

// EN
booking: {
  services: {
    title: 'Which services would you like to book?',
    subtitle: 'Select the desired services.',
    ariaGroupLabel: 'Available services',
    continueButton: 'Continue',
    backButton: 'Back',
    confirmButton: 'Confirm',
    deselectButton: 'Deselect',
    inspection: {
      title: 'Inspection',
      description: 'Services for your vehicle: from inspection to oil change to vehicle alignment.',
      options: {
        dialogAcceptance: 'Dialog acceptance',
        inspection: 'Inspection',
        oilChange: 'Oil change service',
        brakeCheck: 'Brake check (free) and renewal if needed',
        wiperBlades: 'Wiper blade replacement',
        maintenanceContract: 'Interest in a maintenance contract',
        emergencyOil: '1 liter emergency oil'
      }
    },
    tuv: {
      title: 'TÜV',
      description: 'Click here to book an appointment for vehicle inspection (HU/AU) or UVV inspection.',
      options: {
        tuv: 'TÜV',
        uvvInspection: 'UVV inspection (for company cars & commercially used vehicles)',
        acCleaning: 'Air conditioning cleaning (149.00 EUR incl. VAT)'
      }
    },
    brakeFluid: {
      title: 'Brake Fluid Change',
      description: 'Is your vehicle\'s brake fluid change due? Simply book it here.'
    },
    tireChange: {
      title: 'Tire Change',
      description: 'Find all services for your wheels and tires here.',
      options: {
        bringOwnTires: 'Tire change - I bring my own tires',
        storedTires: 'Tire change - my tires are in storage',
        pickupDelivery: 'Pick-up & delivery service',
        storeTires: 'Please store my delivered tires'
      }
    },
    actionsChecks: {
      title: 'Actions / Checks',
      description: 'Want your vehicle checked or prepared for the current season? Book the right service here.',
      options: {
        warrantyCheck: 'Free check before manufacturer warranty expires',
        safetyCheck: 'Safety check / seasonal check',
        fluidCheck: 'Fluid level check (free) and top-up if needed',
        batteryCheck: 'Battery check (free in network)'
      }
    },
    repair: {
      title: 'Repair / Complaint',
      description: 'Do you have other concerns regarding your vehicle? Click here and specify in the comment field.',
      options: {
        diagnostics: 'General diagnostics',
        noises: 'Noises',
        acMalfunction: 'Air conditioning malfunction'
      }
    },
    bodywork: {
      title: 'Bodywork / Windshield Replacement',
      description: 'Do you need a new windshield or a cost estimate? Book here quickly and easily.',
      options: {
        costEstimate: 'Cost estimate / assessment after accident',
        windshieldReplacement: 'Windshield replacement'
      }
    }
  },
  notes: {
    hints: {
      inspection: 'Please note: Bring your service booklet. For extensive work, a replacement vehicle can be arranged — please inquire in advance.',
      tuv: 'Please note: You need all vehicle documents for the HU/AU inspection. Make sure your vehicle is roadworthy and safe.',
      brakeFluid: 'Please note: Brake fluid change is recommended every 2 years according to manufacturer specifications.',
      tireChange: 'Please note: For tire storage, we ask for advance information about tire quantity and size. Storage is subject to charges.',
      actionsChecks: 'Please note: For the warranty check, we need the vehicle documents and possibly the service booklet.',
      repair: 'Please note: Describe your complaint as detailed as possible in the comment field so we can prepare optimally.',
      bodywork: 'Please note: For accident damage, we may need your insurance claim number. Bring relevant documents.'
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
- Kacheln: `var(--color-background-surface)` (weiss)
- Icons: IMMER mit `.icon-framed` Rahmen

**SVG Icons (PFLICHT!):**
- Die 7 SVG-Icon-Dateien liegen im Requirement-Ordner: `docs/requirements/REQ-011-Serviceauswahl-Erweitert/*.svg`
- Diese müssen 1:1 nach `src/assets/icons/services/` kopiert und gemäß Mapping-Tabelle in Section 14 umbenannt werden
- Es dürfen AUSSCHLIESSLICH diese bereitgestellten SVG-Icons verwendet werden
- KEINE Material Icons, KEINE selbst erstellten Icons, KEINE Platzhalter
- Die Icons sind schwarz und müssen per CSS in `var(--color-primary)` (#667eea) eingefärbt werden (z.B. via CSS `filter` oder Angular `mat-icon` mit `svgIcon` Registration)

**An-/Abwahl-Verhalten (GLEICH wie REQ-004!):**
- Services OHNE Optionen (Bremsflüssigkeit): Klick auf Kachel = direktes Toggle (an/ab) — wie bisher bei HU/AU und Inspektion
- Services MIT Optionen: Expand → Checkboxen wählen → "Bestätigen"-Button → selektiert — wie bisher bei Räderwechsel (nur Checkbox statt Radio)
- "Abwählen"-Button: Deselektiert Service komplett (inkl. aller Optionen) — wie bisher `deselectTireChange()`
- Das bestehende Pattern (Toggle / Bestätigen / Abwählen) wird beibehalten, nur generalisiert für alle 7 Services

**Migration von REQ-004:**
- `ServiceVariant` wird durch `ServiceOption` ersetzt
- `selectedVariantId: string | null` wird durch `selectedOptionIds: string[]` ersetzt
- `confirmTireChange(variantId)` wird durch `confirmServiceOptions(serviceId, optionIds)` ersetzt
- `deselectTireChange()` wird durch `deselectService(serviceId)` ersetzt
- `huau` Service-Typ wird durch `tuv` ersetzt
- Radio-Buttons werden durch Checkboxen ersetzt
- Material Icons werden durch custom SVG Icons ersetzt
- Alle bestehenden Tests müssen an das neue Interface angepasst werden

**Breaking Changes:**
- `SelectedService.selectedVariantId` entfällt zugunsten von `selectedOptionIds`
- `ServiceDisplay.icon` entfällt zugunsten von `svgIcon`
- `ServiceDisplay.variants` entfällt zugunsten von `options`
- Store-Methoden `confirmTireChange()` und `deselectTireChange()` werden entfernt
- `ServiceType` Union wird komplett neu definiert (7 statt 3 Typen, `huau` entfällt)
