# Check Requirement Command

Prüft ein Requirement auf Vollständigkeit und Qualität.

## Usage

```
/check-requirement $ARGUMENTS
```

**$ARGUMENTS** = `<REQ-ID-Name>` (z.B. `REQ-001-Header`)

## Prüfungen

### 1. Struktur prüfen

- [ ] Ordner existiert: `docs/requirements/$ARGUMENTS/`
- [ ] `requirement.md` vorhanden
- [ ] Screenshot vorhanden (falls UI-Requirement)

### 2. Pflicht-Sections prüfen

| Section | Pflicht | Prüfung |
|---------|---------|---------|
| 1. Overview | ✅ | Purpose + Scope ausgefüllt |
| 2. User Story | ✅ | As a / I want / So that + Acceptance Criteria |
| 3. Preconditions | ✅ | System, User, Data |
| 4. Main Flow | ✅ | Mindestens 2 Steps |
| 10. Data Model | ✅ | TypeScript Interfaces |
| 11. UI/UX | ✅ | UI Elements Tabelle |
| 14. Implementation | ✅ | Components, Services, Stores |
| 15. Dependencies | ✅ | Requires / Blocks |
| 16. Naming Glossary | ✅ | Methodennamen definiert |

### 3. Qualitäts-Checks

**User Story:**
- [ ] Acceptance Criteria sind testbar (messbar)
- [ ] Keine Platzhalter `[...]` mehr vorhanden

**Data Model:**
- [ ] Interfaces definiert (nicht `Entity`)
- [ ] Types für Unions verwendet
- [ ] DTOs für API

**UI/UX:**
- [ ] Material Components angegeben
- [ ] Farben verweisen auf `_variables.scss`
- [ ] Responsive Breakpoints definiert
- [ ] Accessibility (ARIA) dokumentiert

**Implementation:**
- [ ] Container Component definiert
- [ ] Presentational Components definiert
- [ ] Store Pattern (Feature Store)
- [ ] File Structure angegeben

**i18n:**
- [ ] Keys für DE + EN in Section 16

**Dependencies:**
- [ ] In REQUIREMENTS.md eingetragen
- [ ] Abhängigkeiten korrekt

### 4. Design System Check

- [ ] Keine hardcoded Farben (#xxx)
- [ ] Verweise auf `--color-*` Variablen
- [ ] Accessibility Header erwähnt (falls Page)
- [ ] Icon `accessibility_new` für A11y

## Output

```
✅ REQ-001-Header: Vollständig

Sections:
  ✅ Overview
  ✅ User Story (3 Acceptance Criteria)
  ✅ Main Flow (5 Steps)
  ✅ Data Model (2 Interfaces)
  ✅ UI/UX (8 Elements)
  ✅ Implementation (4 Components)
  ✅ Dependencies (REQ-002 blocked)
  ✅ Naming Glossary (DE)

Design System:
  ✅ Keine hardcoded Farben
  ✅ CSS Variables verwendet
  ✅ Accessibility Header

i18n:
  ✅ DE Keys definiert
  ✅ EN Keys definiert
```

Oder bei Fehlern:

```
❌ REQ-002-Homescreen: Unvollständig

Fehler:
  ❌ Section 10: Data Model - Platzhalter [Entity] noch vorhanden
  ❌ Section 11: Hardcoded Farbe #333333 gefunden
  ❌ Section 16: EN Keys fehlen

Warnungen:
  ⚠️ Screenshot vorhanden aber nicht in Mockup referenziert
  ⚠️ Keine Acceptance Criteria mit "WCAG"
```

## Referenzen

- Template: `docs/requirements/REQ-TEMPLATE.md`
- Design System: `src/styles/_variables.scss`
- Requirements Liste: `docs/requirements/REQUIREMENTS.md`
