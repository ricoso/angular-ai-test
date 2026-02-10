# REQ-001: Header

**Status:** Draft
**Priority:** High
**Type:** Functional
**Created:** 2026-02-10
**Author:** Claude Code

---

## 1. Overview

### 1.1 Purpose
Wiederverwendbarer Application Header mit Firmenlogo und Accessibility-Einstellungen. Der Header wird auf allen Pages der Anwendung eingebunden und ermöglicht Benutzern die Anpassung von Schriftgröße, Kontrast und Animationen.

### 1.2 Scope
**Included:**
- Firmenlogo mit Name
- Accessibility-Dropdown mit Font-Size, High-Contrast, Reduced-Motion
- Responsive Design (Mobile/Desktop)
- Persistierung der Accessibility-Einstellungen (LocalStorage)

**Excluded:**
- Navigation Menu (separate REQ)
- User Menu / Login (separate REQ)
- Breadcrumbs (separate REQ)

### 1.3 Related Requirements
- REQ-002-Homescreen: Nutzt diesen Header

---

## 2. User Story

**As a** Benutzer
**I want** einen Header mit Logo und Accessibility-Einstellungen
**So that** ich die Darstellung der Anwendung nach meinen Bedürfnissen anpassen kann

**Acceptance Criteria:**
- [ ] AC-1: Logo und Firmenname werden links im Header angezeigt
- [ ] AC-2: Accessibility-Button öffnet Dropdown mit Einstellungen
- [ ] AC-3: Schriftgröße kann zwischen Klein/Normal/Groß/Sehr groß gewechselt werden
- [ ] AC-4: Hoher Kontrast kann aktiviert/deaktiviert werden
- [ ] AC-5: Reduzierte Bewegung kann aktiviert/deaktiviert werden
- [ ] AC-6: Einstellungen werden im LocalStorage persistiert
- [ ] AC-7: System-Präferenz für reduced-motion wird initial respektiert
- [ ] AC-8: Header ist responsive (Mobile + Desktop)
- [ ] AC-9: WCAG 2.1 AA konform

---

## 3. Preconditions

### 3.1 System
- Angular Application läuft
- Angular Material ist konfiguriert
- `_variables.scss` ist eingebunden

### 3.2 User
- Keine Authentifizierung erforderlich
- Öffentlich zugänglich

### 3.3 Data
- Firmenlogo als Asset verfügbar
- Keine Backend-Daten erforderlich

---

## 4. Main Flow

**Step 1:** Page wird geladen
- **System:** Lädt Accessibility-Einstellungen aus LocalStorage
- **System:** Wendet Einstellungen auf `<html>` Element an (data-Attribute)
- **System:** Zeigt Header mit Logo und A11y-Button an
- **Expected:** Header ist sichtbar mit korrekten Einstellungen

**Step 2:** Benutzer klickt auf Accessibility-Button
- **User:** Klickt auf Zahnrad-Icon (⚙️)
- **System:** Öffnet Dropdown-Menu
- **Expected:** Menu mit allen Optionen ist sichtbar

**Step 3:** Benutzer ändert Schriftgröße
- **User:** Wählt eine Schriftgröße (z.B. "Groß")
- **System:** Setzt `data-font-size="large"` auf `<html>`
- **System:** Speichert in LocalStorage
- **Expected:** Gesamte Anwendung verwendet größere Schrift

**Step 4:** Benutzer aktiviert Hohen Kontrast
- **User:** Aktiviert Toggle "Hoher Kontrast"
- **System:** Setzt `data-high-contrast="true"` auf `<html>`
- **System:** Speichert in LocalStorage
- **Expected:** Kontrastreiche Darstellung aktiv

**Step 5:** Benutzer schließt Menu
- **User:** Klickt außerhalb oder drückt ESC
- **System:** Schließt Dropdown
- **Expected:** Einstellungen bleiben erhalten

---

## 5. Alternative Flows

### 5.1 Alt Flow A: System-Präferenz für reduced-motion

**Trigger:** Benutzer hat `prefers-reduced-motion: reduce` im System aktiviert

**Flow:**
1. System erkennt Media Query bei App-Start
2. System setzt `reducedMotion: true` als Default
3. Benutzer kann manuell überschreiben
4. Manuelle Einstellung hat Vorrang

### 5.2 Alt Flow B: Keine LocalStorage-Daten

**Trigger:** Erster Besuch oder gelöschte Daten

**Flow:**
1. System findet keine gespeicherten Einstellungen
2. System verwendet Defaults: `fontSize: 'normal'`, `highContrast: false`
3. `reducedMotion` wird aus System-Präferenz übernommen

---

## 6. Exception Flows

### 6.1 Exception E1: LocalStorage nicht verfügbar

**Trigger:** Browser blockiert LocalStorage (Private Mode, Einstellungen)

**Flow:**
1. System erkennt LocalStorage-Fehler
2. System verwendet In-Memory State
3. Einstellungen gelten nur für aktuelle Session
4. Kein Fehler für Benutzer sichtbar

---

## 7. Postconditions

### 7.1 Success
- Header wird auf allen Pages angezeigt
- Accessibility-Einstellungen sind persistent
- CSS-Variablen werden korrekt angewendet

### 7.2 Failure
- Fallback auf Default-Einstellungen
- Header bleibt funktional

---

## 8. Business Rules

- **BR-1:** Accessibility-Einstellungen werden im LocalStorage unter Key `accessibility-settings` gespeichert
- **BR-2:** Font-Size unterstützt 4 Stufen: small (14px), normal (16px), large (18px), x-large (20px)
- **BR-3:** System-Präferenz `prefers-reduced-motion` wird nur initial berücksichtigt, nicht bei jedem Reload
- **BR-4:** Logo verlinkt immer auf die Startseite (/)

---

## 9. Non-Functional Requirements

### Performance
- Header Render < 50ms
- Accessibility Store initialisiert synchron

### Security
- LocalStorage enthält keine sensiblen Daten
- XSS-sichere Implementierung

### Usability
- Alle Controls mit Keyboard bedienbar
- Focus-Trap im offenen Menu
- ARIA Labels für Screen Reader
- Touch-friendly auf Mobile (min 44px)

---

## 10. Data Model

```typescript
// Accessibility State
interface AccessibilityState {
  fontSize: FontSize;
  highContrast: boolean;
  reducedMotion: boolean;
}

type FontSize = 'small' | 'normal' | 'large' | 'x-large';

// LocalStorage Schema
interface AccessibilityStorageData {
  fontSize: FontSize;
  highContrast: boolean;
  reducedMotion: boolean;
  version: number; // Für Migration
}

// Font-Size Mapping
const FONT_SIZE_LABELS: Record<FontSize, { de: string; en: string }> = {
  'small': { de: 'Klein', en: 'Small' },
  'normal': { de: 'Normal', en: 'Normal' },
  'large': { de: 'Groß', en: 'Large' },
  'x-large': { de: 'Sehr groß', en: 'Extra Large' }
};
```

---

## 11. UI/UX

### Mockup

**Icon:** `accessibility_new` (Material Icons Standard)

```
┌─────────────────────────────────────────────────────────────┐
│ [🏢]  Gottfried Schultz                    [accessibility] │
│       Automobilhandels SE                                   │
└─────────────────────────────────────────────────────────────┘

Dropdown geöffnet:
┌─────────────────────────────────────────────────────────────┐
│ [🏢]  Gottfried Schultz                    [accessibility] │
│       Automobilhandels SE                      ┌───────────┐│
│                                                │Schriftgröße││
│                                                │ ○ Klein    ││
│                                                │ ● Normal   ││
│                                                │ ○ Groß     ││
│                                                │ ○ Sehr groß││
│                                                │───────────││
│                                                │Hoher       ││
│                                                │Kontrast [○]││
│                                                │───────────││
│                                                │Reduzierte  ││
│                                                │Bewegung [○]││
│                                                └───────────┘│
└─────────────────────────────────────────────────────────────┘
```

### UI Elements

| Element | Typ | Material Component | ARIA |
|---------|-----|-------------------|------|
| Logo Container | Link | `<a routerLink="/">` | - |
| Logo Image | Bild | `<img>` | `alt="Firmenlogo"` |
| Company Name | Text | `<span>` | - |
| A11y Button | Icon Button | `mat-icon-button` | `aria-label="Barrierefreiheit Einstellungen"` |
| A11y Icon | Icon | `<mat-icon>accessibility_new</mat-icon>` | `aria-hidden="true"` |
| Dropdown | Menu | `mat-menu` | `role="menu"` |
| Font-Size Group | Radio | `mat-radio-group` | `aria-label="Schriftgröße"` |
| Font-Size Option | Radio | `mat-radio-button` | - |
| Contrast Toggle | Toggle | `mat-slide-toggle` | - |
| Motion Toggle | Toggle | `mat-slide-toggle` | - |

### Responsive Behavior

| Viewport | Logo | Company Name | A11y Button |
|----------|------|--------------|-------------|
| Mobile (<48em) | Sichtbar, kleiner | Versteckt | Sichtbar |
| Tablet (≥48em) | Sichtbar | Sichtbar, 1 Zeile | Sichtbar |
| Desktop (≥64em) | Sichtbar | Sichtbar, 2 Zeilen | Sichtbar |

---

## 12. API Specification

Keine Backend-API erforderlich. Rein Frontend-basiert.

### LocalStorage API

```typescript
// Lesen
const stored = localStorage.getItem('accessibility-settings');
const settings: AccessibilityStorageData = stored ? JSON.parse(stored) : null;

// Schreiben
localStorage.setItem('accessibility-settings', JSON.stringify(settings));
```

---

## 13. Test Cases

### TC-1: Default State
- **Given:** Keine gespeicherten Einstellungen
- **When:** App wird geladen
- **Then:** fontSize='normal', highContrast=false, reducedMotion=system-pref

### TC-2: Schriftgröße ändern
- **Given:** Header ist sichtbar
- **When:** User wählt "Groß" im Dropdown
- **Then:** `html[data-font-size="large"]` und LocalStorage aktualisiert

### TC-3: High Contrast aktivieren
- **Given:** highContrast ist false
- **When:** User aktiviert Toggle
- **Then:** `html[data-high-contrast="true"]` und visuell erkennbar

### TC-4: Einstellungen persistieren
- **Given:** User hat Einstellungen geändert
- **When:** Page wird neu geladen
- **Then:** Einstellungen werden aus LocalStorage wiederhergestellt

### TC-5: Keyboard Navigation
- **Given:** Focus auf A11y-Button
- **When:** Enter oder Space gedrückt
- **Then:** Dropdown öffnet sich, Focus auf erstes Element

### TC-6: Screen Reader
- **Given:** Screen Reader aktiv
- **When:** User navigiert zum A11y-Button
- **Then:** "Barrierefreiheit Einstellungen" wird angesagt

### TC-7: Mobile Responsive
- **Given:** Viewport < 48em
- **When:** Header wird angezeigt
- **Then:** Firmenname ist versteckt, Logo und Button sichtbar

---

## 14. Implementation

### Components
- [ ] `HeaderContainerComponent` (Shared, Container)
- [ ] `AccessibilityMenuComponent` (Shared, Presentational)

### Services
- [ ] `AccessibilityService` (Business Logic, LocalStorage)

### Stores
- [ ] `AccessibilityStore` (Signal Store, Global State)

### File Structure
```
src/app/shared/
├── components/
│   └── header/
│       ├── header-container.component.ts
│       ├── header-container.component.html
│       ├── header-container.component.scss
│       └── components/
│           └── accessibility-menu/
│               ├── accessibility-menu.component.ts
│               ├── accessibility-menu.component.html
│               └── accessibility-menu.component.scss
├── services/
│   └── accessibility.service.ts
└── stores/
    └── accessibility.store.ts
```

### Effort
- Development: 4-6 hours
- Testing: 2-3 hours

---

## 15. Dependencies

**Requires:**
- Angular Material (mat-menu, mat-icon, mat-radio, mat-slide-toggle)
- ngx-translate (i18n)

**Blocks:**
- REQ-002-Homescreen (nutzt diesen Header)
- Alle weiteren Pages (nutzen diesen Header)

---

## 16. Naming Glossary

### Container Methods (Deutsch)
- `beimMenuOeffnen()` - Menu öffnen Event
- `beimMenuSchliessen()` - Menu schließen Event

### Presentational Inputs/Outputs
- `schriftgroesse: input<FontSize>()` - Aktuelle Schriftgröße
- `hoherKontrast: input<boolean>()` - High Contrast Status
- `reduzierteBewegung: input<boolean>()` - Reduced Motion Status
- `schriftgroesseGeaendert: output<FontSize>()` - Font-Size Change Event
- `hoherKontrastGeaendert: output<boolean>()` - Contrast Change Event
- `reduzierteBewegungGeaendert: output<boolean>()` - Motion Change Event

### Service Methods
- `getSettings(): AccessibilityState` - Lade Einstellungen
- `saveSettings(state: AccessibilityState): void` - Speichere Einstellungen
- `applyToDocument(state: AccessibilityState): void` - Wende auf DOM an

### Signal Store
- `state: fontSize, highContrast, reducedMotion`
- `computed: -`
- `methods: setFontSize(), setHighContrast(), setReducedMotion(), loadFromStorage()`

---

## 17. Approval

| Role | Name | Date |
|------|------|------|
| Product Owner | | |
| Tech Lead | | |

---

## 18. Implementation Notes

**WICHTIG: Code muss BILINGUAL sein!**

### i18n Keys

```typescript
// DE
'header.accessibility.button': 'Barrierefreiheit',
'header.accessibility.fontSize': 'Schriftgröße',
'header.accessibility.fontSize.small': 'Klein',
'header.accessibility.fontSize.normal': 'Normal',
'header.accessibility.fontSize.large': 'Groß',
'header.accessibility.fontSize.xLarge': 'Sehr groß',
'header.accessibility.highContrast': 'Hoher Kontrast',
'header.accessibility.reducedMotion': 'Reduzierte Bewegung',

// EN
'header.accessibility.button': 'Accessibility',
'header.accessibility.fontSize': 'Font Size',
'header.accessibility.fontSize.small': 'Small',
'header.accessibility.fontSize.normal': 'Normal',
'header.accessibility.fontSize.large': 'Large',
'header.accessibility.fontSize.xLarge': 'Extra Large',
'header.accessibility.highContrast': 'High Contrast',
'header.accessibility.reducedMotion': 'Reduced Motion',
```

### Styling
- Farben aus `_variables.scss`
- KEINE Inline-Styles
- Mobile-First Responsive
