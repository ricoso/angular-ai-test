# REQ-002: Homescreen

**Status:** Draft
**Priority:** High
**Type:** Functional
**Created:** 2026-02-10
**Author:** Claude Code

---

## 1. Overview

### 1.1 Purpose
Startseite der Anwendung zur Auswahl einer Fahrzeugmarke. Der Benutzer wählt eine Marke aus, um zur markenspezifischen Ansicht zu gelangen.

### 1.2 Scope
**Included:**
- Header mit Accessibility-Einstellungen (REQ-001)
- Überschrift und Beschreibungstext
- Grid mit Marken-Buttons (Audi, BMW, Mercedes-Benz, MINI, Volkswagen)
- Footer mit Datenschutz-Link und "Powered by"
- Responsive Layout (Mobile/Tablet/Desktop)

**Excluded:**
- Markenspezifische Ansichten (separate REQs)
- Login/Authentifizierung
- Navigation Menu

### 1.3 Related Requirements
- REQ-001-Header: Header Component (Dependency)

---

## 2. User Story

**As a** Benutzer
**I want** eine Fahrzeugmarke auswählen
**So that** ich zur markenspezifischen Ansicht gelange

**Acceptance Criteria:**
- [ ] AC-1: Header wird oben angezeigt (REQ-001)
- [ ] AC-2: Überschrift "Welche Fahrzeugmarke fahren Sie?" ist zentriert
- [ ] AC-3: Beschreibungstext unter der Überschrift
- [ ] AC-4: 5 Marken-Buttons werden im Grid angezeigt (Audi, BMW, Mercedes-Benz, MINI, Volkswagen)
- [ ] AC-5: Klick auf Marken-Button navigiert zur Marken-Route
- [ ] AC-6: Footer mit Datenschutz-Link und "Powered by"
- [ ] AC-7: Layout ist responsive (1 Spalte Mobile, 2-3 Spalten Desktop)
- [ ] AC-8: WCAG 2.1 AA konform
- [ ] AC-9: Bilingual (DE + EN)

---

## 3. Preconditions

### 3.1 System
- Angular Application läuft
- REQ-001-Header ist implementiert
- Routing ist konfiguriert

### 3.2 User
- Keine Authentifizierung erforderlich
- Öffentlich zugänglich

### 3.3 Data
- Liste der verfügbaren Marken (statisch oder aus API)
- Marken-Logos als Assets

---

## 4. Main Flow

**Step 1:** Benutzer öffnet die Anwendung (/)
- **System:** Lädt Homescreen
- **System:** Zeigt Header, Content und Footer an
- **Expected:** Vollständige Seite ist sichtbar

**Step 2:** Benutzer sieht Marken-Auswahl
- **System:** Zeigt Überschrift "Welche Fahrzeugmarke fahren Sie?"
- **System:** Zeigt Grid mit 5 Marken-Buttons
- **Expected:** Alle Marken sind klickbar

**Step 3:** Benutzer wählt eine Marke
- **User:** Klickt auf einen Marken-Button (z.B. "Audi")
- **System:** Navigiert zu `/marke/audi`
- **Expected:** Markenspezifische Seite wird geladen

---

## 5. Alternative Flows

### 5.1 Alt Flow A: Keyboard Navigation

**Trigger:** Benutzer navigiert mit Tab-Taste

**Flow:**
1. Skip-Link → Header A11y-Button → Marken-Buttons (Reihenfolge) → Footer-Links
2. Enter/Space auf Marken-Button aktiviert Navigation
3. Focus-Styles sind deutlich sichtbar

### 5.2 Alt Flow B: Datenschutz-Link

**Trigger:** Benutzer klickt auf "Datenschutz"

**Flow:**
1. System öffnet Datenschutz-Seite (oder Modal)
2. Benutzer kann zurück navigieren

---

## 6. Exception Flows

### 6.1 Exception E1: Marken können nicht geladen werden (API)

**Trigger:** API-Fehler beim Laden der Marken (falls dynamisch)

**Flow:**
1. System zeigt Fehlermeldung
2. System bietet Retry-Button
3. Fallback auf statische Liste möglich

---

## 7. Postconditions

### 7.1 Success
- Benutzer ist auf markenspezifischer Seite
- Analytics-Event wurde getrackt (optional)

### 7.2 Failure
- Benutzer bleibt auf Homescreen
- Fehlermeldung wird angezeigt

---

## 8. Business Rules

- **BR-1:** Verfügbare Marken: Audi, BMW, Mercedes-Benz, MINI, Volkswagen
- **BR-2:** Marken-Routing: `/marke/{marken-slug}` (z.B. `/marke/audi`, `/marke/mercedes-benz`)
- **BR-3:** Reihenfolge der Marken ist alphabetisch oder nach Priorität sortiert
- **BR-4:** Datenschutz-Link öffnet `/datenschutz`

---

## 9. Non-Functional Requirements

### Performance
- Page Load < 2s
- Time to Interactive < 3s
- Marken-Buttons sofort klickbar

### Security
- HTTPS only
- Keine sensiblen Daten auf dieser Seite

### Usability
- Mobile responsive (Touch-friendly, min 44px)
- WCAG 2.1 AA (Kontrast, Keyboard, Screen Reader)
- Browser support: Latest 2 versions

---

## 10. Data Model

```typescript
// Marke Model
interface Marke {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}

// Statische Marken-Liste
const MARKEN: Marke[] = [
  { id: '1', name: 'Audi', slug: 'audi' },
  { id: '2', name: 'BMW', slug: 'bmw' },
  { id: '3', name: 'Mercedes-Benz', slug: 'mercedes-benz' },
  { id: '4', name: 'MINI', slug: 'mini' },
  { id: '5', name: 'Volkswagen', slug: 'volkswagen' }
];

// Store State
interface HomescreenState {
  marken: Marke[];
  loading: boolean;
  error: string | null;
}
```

---

## 11. UI/UX

### Mockup (aus Screenshot analysiert)

```
┌─────────────────────────────────────────────────────────────┐
│ [=========== REQ-001-Header (app-header) ===============]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│           Welche Fahrzeugmarke fahren Sie?                 │
│        Bitte wählen Sie die gewünschte Marke aus.          │
│                                                             │
│     ┌──────────┐  ┌──────────┐  ┌────────────────┐         │
│     │   Audi   │  │   BMW    │  │ Mercedes-Benz  │         │
│     └──────────┘  └──────────┘  └────────────────┘         │
│                                                             │
│     ┌──────────┐  ┌──────────────┐                         │
│     │   MINI   │  │  Volkswagen  │                         │
│     └──────────┘  └──────────────┘                         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Datenschutz                           Powered by MobilApp   │
└─────────────────────────────────────────────────────────────┘
```

### UI Elements

| Element | Typ | Material Component | Styling |
|---------|-----|-------------------|---------|
| Header | Component | `<app-header>` | Aus REQ-001 |
| Container | Layout | `<main>` | `background: var(--background-color)` |
| Überschrift | Text | `<h1>` | Zentriert, `--text-color` |
| Beschreibung | Text | `<p>` | Zentriert, `--text-secondary` |
| Marken-Grid | Layout | CSS Grid | 1-3 Spalten responsive |
| Marken-Button | Button | `mat-raised-button` | `--surface-color`, hover: `--primary-color` |
| Footer | Layout | `<footer>` | Border-top, flex justify-between |
| Datenschutz | Link | `<a>` | `--text-secondary`, hover: `--primary-color` |
| Powered by | Text + Logo | `<span> + <img>` | `--text-muted` |

### Farben (aus _variables.scss - NICHT aus Screenshot!)

| Element | Variable | Wert |
|---------|----------|------|
| Page Background | `--background-color` | #f8f9fa (hell!) |
| Button Background | `--surface-color` | #ffffff |
| Button Hover | `--primary-color` | #667eea |
| Text Headline | `--text-color` | #1a1a1a |
| Text Description | `--text-secondary` | #595959 |
| Footer Text | `--text-muted` | #767676 |

### Responsive Breakpoints

| Viewport | Grid-Spalten | Button-Breite |
|----------|--------------|---------------|
| Mobile (<48em) | 1 | 100% |
| Tablet (≥48em) | 2 | auto |
| Desktop (≥64em) | 3 | auto (min 12em) |

---

## 12. API Specification

### Option A: Statische Daten (Initial)
Keine API erforderlich. Marken sind im Frontend definiert.

### Option B: Dynamische Marken (Future)

```http
GET /api/marken
```

**Success (200):**
```json
{
  "marken": [
    { "id": "1", "name": "Audi", "slug": "audi", "logoUrl": "/assets/logos/audi.svg" },
    { "id": "2", "name": "BMW", "slug": "bmw", "logoUrl": "/assets/logos/bmw.svg" }
  ]
}
```

---

## 13. Test Cases

### TC-1: Page Load
- **Given:** User navigiert zu /
- **When:** Page ist geladen
- **Then:** Header, Überschrift, 5 Marken-Buttons, Footer sind sichtbar

### TC-2: Marken-Button Klick
- **Given:** Page ist geladen
- **When:** User klickt auf "Audi"
- **Then:** Navigation zu `/marke/audi`

### TC-3: Keyboard Navigation
- **Given:** Focus auf Skip-Link
- **When:** User drückt Tab mehrmals
- **Then:** Focus wandert durch: Skip-Link → Header → Marken-Buttons → Footer

### TC-4: Responsive Mobile
- **Given:** Viewport 375px breit
- **When:** Page wird angezeigt
- **Then:** Marken-Buttons in 1 Spalte, volle Breite

### TC-5: Responsive Desktop
- **Given:** Viewport 1200px breit
- **When:** Page wird angezeigt
- **Then:** Marken-Buttons in 3 Spalten

### TC-6: Accessibility - Screen Reader
- **Given:** Screen Reader aktiv
- **When:** User navigiert durch Seite
- **Then:** Überschrift, Buttons und Links werden korrekt angesagt

### TC-7: i18n - Sprachwechsel
- **Given:** Sprache ist Englisch
- **When:** Page wird angezeigt
- **Then:** Texte sind auf Englisch

---

## 14. Implementation

### Components
- [ ] `HomescreenContainerComponent` (Container)
- [ ] `MarkenauswahlComponent` (Presentational)

### Services
- [ ] `MarkenApiService` (API Service - optional für dynamische Daten)

### Stores
- [ ] `HomescreenStore` (Signal Store)

### File Structure
```
src/app/features/homescreen/
├── homescreen-container.component.ts
├── homescreen-container.component.html
├── homescreen-container.component.scss
├── components/
│   └── markenauswahl/
│       ├── markenauswahl.component.ts
│       ├── markenauswahl.component.html
│       └── markenauswahl.component.scss
├── services/
│   └── marken-api.service.ts (optional)
├── stores/
│   └── homescreen.store.ts
└── models/
    └── marke.model.ts
```

### Routes
```typescript
// app.routes.ts
{
  path: '',
  loadComponent: () => import('./features/homescreen/homescreen-container.component')
    .then(m => m.HomescreenContainerComponent)
}
```

### Effort
- Development: 3-4 hours
- Testing: 2 hours

---

## 15. Dependencies

**Requires:**
- REQ-001-Header: Header mit Accessibility-Einstellungen

**Blocks:**
- REQ-XXX-MarkeAudi: Audi-spezifische Seite
- REQ-XXX-MarkeBMW: BMW-spezifische Seite
- (weitere Marken-Seiten)

---

## 16. Naming Glossary

### Container Methods (Deutsch)
- `beimMarkeAuswaehlen(marke: Marke)` - Marken-Auswahl Event Handler
- `navigiereZuMarke(slug: string)` - Navigation zur Marken-Route

### Presentational Inputs/Outputs
- `marken: input<Marke[]>()` - Liste der verfügbaren Marken
- `markeAusgewaehlt: output<Marke>()` - Event wenn Marke geklickt

### Signal Store
- `state: marken[], loading, error`
- `computed: hatMarken, markenAnzahl`
- `methods: ladeMarken()`

### i18n Keys
```typescript
// DE
'homescreen.titel': 'Welche Fahrzeugmarke fahren Sie?',
'homescreen.beschreibung': 'Bitte wählen Sie die gewünschte Marke aus.',
'homescreen.marke.audi': 'Audi',
'homescreen.marke.bmw': 'BMW',
'homescreen.marke.mercedes': 'Mercedes-Benz',
'homescreen.marke.mini': 'MINI',
'homescreen.marke.volkswagen': 'Volkswagen',
'footer.datenschutz': 'Datenschutz',
'footer.poweredBy': 'Powered by',

// EN
'homescreen.titel': 'Which car brand do you drive?',
'homescreen.beschreibung': 'Please select your desired brand.',
'homescreen.marke.audi': 'Audi',
'homescreen.marke.bmw': 'BMW',
'homescreen.marke.mercedes': 'Mercedes-Benz',
'homescreen.marke.mini': 'MINI',
'homescreen.marke.volkswagen': 'Volkswagen',
'footer.datenschutz': 'Privacy Policy',
'footer.poweredBy': 'Powered by',
```

---

## 17. Approval

| Role | Name | Date |
|------|------|------|
| Product Owner | | |
| Tech Lead | | |

---

## 18. Implementation Notes

**WICHTIG:**

1. **Styling aus _variables.scss** - NICHT die dunklen Farben aus dem Screenshot verwenden!
2. **Header aus REQ-001** - Kein eigener Header, `<app-header>` nutzen
3. **Mobile-First** - CSS Grid mit 1 Spalte als Default
4. **Touch-friendly** - Buttons mindestens 2.75em (44px) hoch
5. **Skip-Link** - Am Anfang der Seite für Keyboard-User
6. **Code bilingual** - Deutsche Methodennamen (Requirement ist deutsch)
