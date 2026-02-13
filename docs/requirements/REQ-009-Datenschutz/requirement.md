# REQ-009: Datenschutz

**Status:** Draft
**Priority:** Medium
**Type:** Functional
**Created:** 2026-02-13
**Author:** Claude Code
**Wizard-Schritt:** — (Standalone-Seite, nicht Teil des Wizard)

---

## 1. Overview

### 1.1 Purpose
Statische Datenschutz-Seite mit Lorem-Ipsum-Inhalt. Wird aus dem Footer und dem Kundendaten-Formular (REQ-006) verlinkt.

### 1.2 Scope
**Included:**
- Statische Seite unter `/datenschutz`
- Lorem-Ipsum-Datenschutzerklärung
- Zurück-Navigation

**Excluded:**
- Echte Datenschutzerklärung (Click-Dummy: nur Platzhalter)
- Cookie-Consent

### 1.3 Related Requirements
- REQ-001: Header (wird auf allen Seiten angezeigt)
- REQ-006-Kundendaten (Link in Datenschutz-Checkbox)

---

## 2. User Story

**Als** Kunde
**möchte ich** die Datenschutzerklärung lesen können
**damit** ich informiert der Datenverarbeitung zustimmen kann.

**Acceptance Criteria:**
- [ ] AC-1: Seite ist unter `/datenschutz` erreichbar
- [ ] AC-2: Überschrift "Datenschutzerklärung" wird angezeigt
- [ ] AC-3: Lorem-Ipsum-Inhalt wird angezeigt
- [ ] AC-4: Zurück-Button/Link funktioniert
- [ ] AC-5: Erreichbar über Footer-Link
- [ ] AC-6: Erreichbar über Link in Kundendaten-Formular

---

## 3. Preconditions

### 3.1 System
- Angular App läuft
- Routing konfiguriert

### 3.2 User
- Keine Authentifizierung erforderlich

### 3.3 Data
- Keine (statischer Inhalt)

### 3.4 Übergabe (Input)
| Feld | Quelle | Pflicht |
|------|--------|---------|
| — | — | **Keine Vorbedingung** (Standalone-Seite) |

---

## 4. Main Flow

**Step 1:** Benutzer öffnet Datenschutz-Seite
- **User:** Klickt auf Footer-Link "Datenschutz" ODER Link im Kundendaten-Formular
- **System:** Navigiert zu `/datenschutz`

**Step 2:** Seite wird angezeigt
- **System:** Zeigt Überschrift "Datenschutzerklärung"
- **System:** Zeigt Lorem-Ipsum-Inhalt in strukturierten Absätzen

**Step 3:** Benutzer navigiert zurück
- **User:** Klickt "Zurück" oder Browser-Back
- **System:** Navigation zur vorherigen Seite

---

## 5. Alternative Flows

Keine — statische Seite.

---

## 6. Exception Flows

Keine — statischer Inhalt, kein Fehlerfall.

---

## 7. Postconditions

### 7.1 Success
- Keine Zustandsänderung (reine Info-Seite)

### 7.2 Failure
- Nicht möglich (statischer Inhalt)

---

## 8. Business Rules

- **BR-1:** Seite ist ohne Authentifizierung erreichbar
- **BR-2:** Keine Daten werden gespeichert oder geändert
- **BR-3:** Click-Dummy: Lorem-Ipsum statt echter Datenschutzerklärung

---

## 9. Non-Functional Requirements

### Performance
- Seitenaufbau < 200ms (statischer Inhalt)

### Usability
- Lesbarer Text (min 1em Schriftgröße, 1.5 Line-Height)
- WCAG 2.1 AA
- Mobile-responsive

---

## 10. Data Model

Kein Datenmodell — statischer Inhalt.

---

## 11. UI/UX

### Layout
- Überschrift "Datenschutzerklärung" zentriert
- Fließtext in Card oder Container (max-width für Lesbarkeit)
- Zurück-Button oben links
- Footer sichtbar

### Lorem-Ipsum-Inhalt

```
1. Allgemeine Hinweise
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
nostrud exercitation ullamco laboris.

2. Verantwortlicher
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.

3. Erhebung und Verarbeitung personenbezogener Daten
Sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut
perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
laudantium.

4. Cookies
Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
architecto beatae vitae dicta sunt explicabo.

5. Ihre Rechte
Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

6. Kontakt
Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
adipisci velit.
```

---

## 12. API Specification

Kein API-Call — statischer Inhalt.

---

## 13. Test Cases

### TC-1: Seite erreichbar
- **Given:** App läuft
- **When:** Navigation zu `/datenschutz`
- **Then:** Überschrift "Datenschutzerklärung" sichtbar

### TC-2: Footer-Link
- **Given:** Benutzer auf Startseite
- **When:** Klick auf "Datenschutz" im Footer
- **Then:** Navigation zu `/datenschutz`

### TC-3: Kundendaten-Link
- **Given:** Benutzer auf Kundendaten-Formular (REQ-006)
- **When:** Klick auf Datenschutz-Link in Checkbox
- **Then:** Navigation zu `/datenschutz`

### TC-4: Zurück-Navigation
- **Given:** Benutzer auf Datenschutz-Seite
- **When:** Klick "Zurück" oder Browser-Back
- **Then:** Navigation zur vorherigen Seite

---

## 14. Implementation

### Components
- [ ] `DatenschutzContainerComponent` — Container, statischer Inhalt
- [ ] `DatenschutzInhaltComponent` — Presentational, Lorem-Ipsum-Text

### Route
```typescript
{
  path: 'datenschutz',
  loadComponent: () => import('./features/datenschutz/datenschutz-container.component')
    .then(m => m.DatenschutzContainerComponent)
}
```

### Folder
```
src/app/features/datenschutz/
├── datenschutz-container.component.ts
├── datenschutz-container.component.html
├── datenschutz-container.component.scss
└── components/
    ├── datenschutz-inhalt.component.ts
    ├── datenschutz-inhalt.component.html
    └── datenschutz-inhalt.component.scss
```

---

## 15. Dependencies

**Requires:**
- REQ-001: Header (wird auf der Seite angezeigt)

**Blocks:**
- (keine)

---

## 16. Naming Glossary

### Container Methods
| Methode | Beschreibung |
|---------|--------------|
| `beimZurueck()` | Zurück-Navigation |

---

## 17. i18n Keys

```typescript
// DE
datenschutz: {
  titel: 'Datenschutzerklärung',
  untertitel: 'Informationen zum Datenschutz',
  zurueck: 'Zurück',
  inhalt: 'Lorem ipsum dolor sit amet...'
}

// EN
datenschutz: {
  titel: 'Privacy Policy',
  untertitel: 'Privacy Information',
  zurueck: 'Back',
  inhalt: 'Lorem ipsum dolor sit amet...'
}
```

---

## 18. Approval

| Role | Name | Date |
|------|------|------|
| Product Owner | | |
| Tech Lead | | |
