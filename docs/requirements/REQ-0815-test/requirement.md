# REQ-0815: Homescreen Fahrzeugmarken-Auswahl

**Status:** Draft
**Priority:** High
**Type:** Functional
**Created:** 2026-02-12
**Author:** Claude Code

---

## 1. Overview

### 1.1 Purpose
Der Homescreen ermöglicht dem Benutzer die Auswahl einer Fahrzeugmarke. Dies ist der Einstiegspunkt in die Anwendung und bestimmt, welche markenspezifischen Inhalte angezeigt werden.

### 1.2 Scope
**Inkludiert:**
- Überschrift mit Frage
- 5 Fahrzeugmarken-Buttons (Audi, BMW, Mercedes-Benz, MINI, Volkswagen)
- Schließen-Funktion (X-Button)
- Footer mit Firmenlogo und "Powered by"-Hinweis
- Datenschutz-Link (vertikal am linken Rand)

**Exkludiert:**
- Navigation zu markenspezifischen Seiten (separate Requirements)
- Login/Authentifizierung

### 1.3 Related Requirements
- REQ-001: Header (Accessibility-Controls)

---

## 2. User Story

**As a** Besucher der Webseite
**I want** eine Fahrzeugmarke auswählen können
**So that** ich zur passenden markenspezifischen Seite weitergeleitet werde

**Acceptance Criteria:**
- [ ] AC-1: Benutzer sieht alle 5 Fahrzeugmarken als auswählbare Buttons
- [ ] AC-2: Buttons sind im Grid-Layout angeordnet (3 Spalten Desktop, 1 Spalte Mobile)
- [ ] AC-3: Bei Klick auf eine Marke erfolgt Navigation zur Marken-Seite
- [ ] AC-4: Schließen-Button (X) ist oben rechts positioniert
- [ ] AC-5: Datenschutz-Link ist vertikal am linken Rand sichtbar
- [ ] AC-6: Footer zeigt Firmenlogo und "Powered by mobilapp"
- [ ] AC-7: Seite ist vollständig per Tastatur bedienbar

---

## 3. Preconditions

### 3.1 System
- Angular-Anwendung läuft
- Routing ist konfiguriert

### 3.2 User
- Keine Authentifizierung erforderlich
- Benutzer kann Mouse oder Tastatur verwenden

### 3.3 Data
- Liste der verfügbaren Fahrzeugmarken ist statisch definiert

---

## 4. Main Flow

**Step 1:** Seite wird geladen
- **User:** Öffnet die Anwendung / navigiert zur Startseite
- **System:** Rendert den Homescreen mit allen UI-Elementen
- **Expected:** Überschrift, Marken-Buttons, Footer sind sichtbar

**Step 2:** Benutzer wählt Fahrzeugmarke
- **User:** Klickt auf einen Marken-Button (z.B. "Audi")
- **System:** Navigiert zur entsprechenden Marken-Seite
- **Expected:** Route wechselt zu `/marke/audi`

**Step 3:** Alternative: Benutzer schließt Dialog
- **User:** Klickt auf X-Button
- **System:** Navigiert zur vorherigen Seite oder schließt Modal
- **Expected:** Homescreen wird geschlossen

---

## 5. Alternative Flows

### 5.1 Alt Flow A: Keyboard-Navigation

**Trigger:** Benutzer navigiert mit Tab-Taste

**Flow:**
1. Tab führt durch alle Marken-Buttons
2. Enter aktiviert den fokussierten Button
3. Escape schließt den Dialog (X-Button Funktion)
4. Navigation erfolgt zur gewählten Marke

### 5.2 Alt Flow B: Datenschutz-Link

**Trigger:** Benutzer klickt auf "Datenschutz"

**Flow:**
1. System öffnet Datenschutzseite
2. Benutzer kann zurückkehren

---

## 6. Exception Flows

### 6.1 Exception E1: Navigation fehlgeschlagen

**Trigger:** Route zur Marken-Seite existiert nicht

**Flow:**
1. System zeigt Fehlermeldung
2. Benutzer bleibt auf Homescreen
3. Log-Eintrag wird erstellt

---

## 7. Postconditions

### 7.1 Success
- Benutzer wurde zur gewählten Marken-Seite navigiert
- Auswahl kann ggf. im State gespeichert werden

### 7.2 Failure
- Benutzer bleibt auf Homescreen
- Fehlermeldung wird angezeigt

---

## 8. Business Rules

- **BR-1:** Genau 5 Fahrzeugmarken werden angezeigt: Audi, BMW, Mercedes-Benz, MINI, Volkswagen
- **BR-2:** Reihenfolge ist fest definiert (alphabetisch mit Ausnahmen)
- **BR-3:** Alle Marken-Buttons haben gleiches Layout und Größe

---

## 9. Non-Functional Requirements

### Performance
- Response time < 100ms bei Klick
- Page load < 1s

### Security
- Keine sensiblen Daten auf dieser Seite
- HTTPS only

### Usability
- Mobile responsive (1 Spalte auf Mobile, 3 Spalten auf Desktop)
- WCAG 2.1 AA Konformität
- Touch-Targets mindestens 2.75em (44px)
- Fokus-Styles sichtbar

---

## 10. Data Model

```typescript
// Fahrzeugmarke Interface
interface Fahrzeugmarke {
  id: string;
  name: string;
  route: string;
}

// Verfügbare Marken (statisch)
type MarkenId = 'audi' | 'bmw' | 'mercedes-benz' | 'mini' | 'volkswagen';

// Marken-Konfiguration
interface MarkenKonfiguration {
  marken: Fahrzeugmarke[];
}
```

---

## 11. UI/UX

### Mockup
![Homescreen Mockup](./mockup.png)

### UI-Elemente

| Element | Type | Material Component | Beschreibung |
|---------|------|-------------------|--------------|
| Überschrift | h1 | - | "Welche Fahrzeugmarke fahren Sie?" |
| Untertitel | p | - | "Bitte wählen Sie die gewünschte Marke aus." |
| Marken-Button | button | mat-raised-button | 5x Marken-Auswahl, großflächig |
| Schließen-Button | button | mat-icon-button | X-Icon oben rechts |
| Datenschutz-Link | a | - | Vertikal rotiert, links |
| Logo | img | - | Firmenlogo links unten |
| Powered-By | span | - | "POWERED BY mobilapp" rechts unten |

### Layout

**Desktop (>64em / 1024px):**
```
┌─────────────────────────────────────────────────────────────┐
│ [Datenschutz]                                          [X]  │
│                                                             │
│              Welche Fahrzeugmarke fahren Sie?               │
│           Bitte wählen Sie die gewünschte Marke aus.        │
│                                                             │
│     ┌──────────┐   ┌──────────┐   ┌──────────────────┐     │
│     │   Audi   │   │   BMW    │   │  Mercedes-Benz   │     │
│     └──────────┘   └──────────┘   └──────────────────┘     │
│                                                             │
│     ┌──────────┐   ┌──────────┐                            │
│     │   MINI   │   │Volkswagen│                            │
│     └──────────┘   └──────────┘                            │
│                                                             │
│  [Logo]                              POWERED BY mobilapp    │
└─────────────────────────────────────────────────────────────┘
```

**Mobile (<48em / 768px):**
```
┌─────────────────────┐
│                 [X] │
│                     │
│  Welche Fahrzeug-   │
│  marke fahren Sie?  │
│                     │
│  ┌───────────────┐  │
│  │     Audi      │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │     BMW       │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │ Mercedes-Benz │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │     MINI      │  │
│  └───────────────┘  │
│  ┌───────────────┐  │
│  │  Volkswagen   │  │
│  └───────────────┘  │
│                     │
│  [Logo] POWERED BY  │
└─────────────────────┘
```

### Styling (aus _variables.scss)

| Element | CSS Variable | Wert |
|---------|-------------|------|
| Page Background | `--color-background-page` | #f8f9fa |
| Button Background | `--color-background-surface` | #ffffff |
| Button Border | `--color-border` | #e0e0e0 |
| Überschrift | `--color-text-primary` | #1a1a1a |
| Untertitel | `--color-text-secondary` | #595959 |
| Focus Ring | `--color-focus-ring` | #005fcc |
| Button Hover | `--color-background-hover` | #f5f5f5 |

---

## 12. API Specification

Keine API erforderlich - statische Daten.

---

## 13. Test Cases

### TC-1: Happy Path - Marke auswählen
- **Given:** Homescreen ist geladen
- **When:** Benutzer klickt auf "Audi"
- **Then:** Navigation zu `/marke/audi` erfolgt

### TC-2: Keyboard Navigation
- **Given:** Homescreen ist geladen
- **When:** Benutzer navigiert mit Tab und drückt Enter auf "BMW"
- **Then:** Navigation zu `/marke/bmw` erfolgt

### TC-3: Schließen-Button
- **Given:** Homescreen ist geladen
- **When:** Benutzer klickt auf X
- **Then:** Dialog wird geschlossen

### TC-4: Responsive Layout Mobile
- **Given:** Viewport < 768px
- **When:** Homescreen wird geladen
- **Then:** Buttons sind in einer Spalte angeordnet

### TC-5: Accessibility - Focus Visible
- **Given:** Benutzer nutzt Tastatur
- **When:** Tab auf Marken-Button
- **Then:** Focus-Ring ist sichtbar

---

## 14. Implementation

### Components
- [ ] `HomescreenContainerComponent` - Container mit Store-Injection
- [ ] `MarkenauswahlComponent` - Presentational mit Marken-Grid
- [ ] `MarkenButtonComponent` - Einzelner Marken-Button
- [ ] `FooterComponent` - Logo und Powered-By (shared)

### Services
- [ ] Keine Services erforderlich (statische Daten)

### Store
- [ ] `MarkenStore` - Optional für gewählte Marke

### Routes
- [ ] `/` → `HomescreenContainerComponent`
- [ ] `/marke/:markenId` → Navigation Target

---

## 15. Dependencies

**Requires:**
- REQ-001: Header (für Accessibility-Controls)

**Blocks:**
- Zukünftige Marken-Detail-Pages

---

## 16. Naming Glossary

### Container Methods
- `beimMarkeAuswaehlen(marke: Fahrzeugmarke)` - Marken-Auswahl Handler
- `beimSchliessen()` - Schließen-Button Handler

### Presentational Inputs/Outputs
- `marken = input<Fahrzeugmarke[]>()` - Liste der Marken
- `markeGewaehlt = output<Fahrzeugmarke>()` - Event bei Auswahl

### Signal Store
- `ladeMarken()` - Lädt Marken (falls dynamisch)
- `waehleMarke(id: string)` - Setzt gewählte Marke

### Computed Signals
- `verfuegbareMarken` - Gefilterte Markenliste
- `hatMarken` - Boolean ob Marken vorhanden

### i18n Keys
| Key | Deutsch | English |
|-----|---------|---------|
| `homescreen.title` | Welche Fahrzeugmarke fahren Sie? | Which vehicle brand do you drive? |
| `homescreen.subtitle` | Bitte wählen Sie die gewünschte Marke aus. | Please select your preferred brand. |
| `homescreen.datenschutz` | Datenschutz | Privacy Policy |
| `homescreen.poweredBy` | POWERED BY | POWERED BY |
| `homescreen.schliessen` | Schließen | Close |
| `marke.audi` | Audi | Audi |
| `marke.bmw` | BMW | BMW |
| `marke.mercedes` | Mercedes-Benz | Mercedes-Benz |
| `marke.mini` | MINI | MINI |
| `marke.volkswagen` | Volkswagen | Volkswagen |

---

## 17. Approval

| Role | Name | Date |
|------|------|------|
| Product Owner | | |
| Tech Lead | | |

---

## 18. Implementation Notes

**WICHTIG: Code muss BILINGUAL sein!**

- Kommentare DE + EN
- Error Messages Englisch
- i18n Keys für beide Sprachen (siehe Section 16)
- JSDoc bilingual

**Styling:**
- KEINE Farben aus Screenshot übernehmen!
- NUR CSS Variables aus `_variables.scss` verwenden
- Mobile-First Ansatz
- WCAG 2.1 AA Konformität
