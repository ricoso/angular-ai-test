# Create Requirement Command

Erstellt ein neues Requirement mit Screenshot-Analyse und Pull Request.

## Usage

```
/create-requirement $ARGUMENTS
```

**$ARGUMENTS** = `<REQ-ID-Name>` (z.B. `REQ-003-UserProfile`)

## Workflow

### Step 1: Git Setup

1. Aktuellen Branch prüfen
2. Neuen Branch erstellen: `req/<REQ-ID-Name>`
3. Branch auschecken

```bash
git checkout -b req/$ARGUMENTS
```

### Step 2: Ordner & Template erstellen

1. Ordner erstellen: `docs/requirements/<REQ-ID-Name>/`
2. `requirement.md` aus `REQ-TEMPLATE.md` kopieren (falls nicht vorhanden)

```bash
mkdir -p docs/requirements/$ARGUMENTS
cp docs/requirements/REQ-TEMPLATE.md docs/requirements/$ARGUMENTS/requirement.md
```

### Step 3: Screenshot analysieren (falls vorhanden)

Suche nach Bildern im Ordner (`*.png`, `*.jpg`, `*.jpeg`).

**UI-Analyse-Regeln:**
- Identifiziere alle UI-Elemente (Buttons, Inputs, Labels, Cards, etc.)
- Erkenne Hierarchie (Header, Content, Footer, Sidebar)
- Extrahiere Texte und Labels
- Identifiziere interaktive Elemente und deren Funktion
- **WICHTIG:** NUR Struktur extrahieren, KEINE Farben/Styling aus Screenshot!

### Step 4: Styling-Vorgaben anwenden

**IMMER aus `src/styles/_variables.scss`** (sprechende Namen!):
- `--color-background-page` - Page Hintergrund
- `--color-background-surface` - Cards, Modals
- `--color-primary` - Buttons, Links
- `--color-text-primary` - Haupttext
- `--color-text-secondary` - Sekundärtext

**IMMER hinzufügen:**
- Accessibility-Header mit Icon `accessibility_new`
- WCAG 2.1 AA Konformität
- Mobile-First Responsive Design

### Step 5: Template ausfüllen

Fülle folgende Sections aus:

| Section | Inhalt |
|---------|--------|
| 1. Overview | Purpose, Scope, Related Requirements |
| 2. User Story | As a... I want... So that... + Acceptance Criteria |
| 3. Preconditions | System, User, Data Voraussetzungen |
| 4. Main Flow | Schritt-für-Schritt Ablauf |
| 5. Alternative Flows | Alternative Szenarien |
| 6. Exception Flows | Fehlerbehandlung |
| 10. Data Model | TypeScript Interfaces/Types |
| 11. UI/UX | UI-Elemente Tabelle + Material Components |
| 14. Implementation | Angular Components, Services, Stores |
| 16. Naming Glossary | Deutsche/Englische Methodennamen |

### Step 6: REQUIREMENTS.md aktualisieren

Neues REQ zur Liste in `docs/requirements/REQUIREMENTS.md` hinzufügen:

```markdown
| REQ-XXX | Name | Draft | Priority | Dependencies |
```

### Step 7: Requirement prüfen

```
/check-requirement $ARGUMENTS
```

Prüft:
- [ ] Alle Pflicht-Sections ausgefüllt
- [ ] Keine Platzhalter `[...]` mehr
- [ ] Keine hardcoded Farben
- [ ] i18n Keys DE + EN
- [ ] Dependencies in REQUIREMENTS.md

### Step 8: Git Commit & Pull Request

```bash
# Alle Änderungen stagen
git add docs/requirements/

# Commit erstellen
git commit -m "req($ARGUMENTS): Add <Name> requirement"

# Push mit Upstream
git push -u origin req/$ARGUMENTS

# PR erstellen
gh pr create --title "req($ARGUMENTS): Add <Name> requirement" --body "## Summary
- New requirement: $ARGUMENTS
- Screenshot analyzed (if present)
- Template filled out

## Checklist
- [ ] /check-requirement passed
- [ ] Acceptance Criteria complete
- [ ] Dependencies documented"
```

## Beispiel

```
/create-requirement REQ-003-UserProfile
```

**Ergebnis:**
1. Branch: `req/REQ-003-UserProfile`
2. Ordner: `docs/requirements/REQ-003-UserProfile/`
3. Datei: `requirement.md` ausgefüllt
4. REQUIREMENTS.md aktualisiert
5. Commit erstellt
6. PR erstellt und Link ausgegeben

## Wichtige Regeln

1. **Keine Farben aus Screenshots** - IMMER `_variables.scss` verwenden
2. **Accessibility-Header PFLICHT** - Bei jeder Page hinzufügen
3. **Mobile-First** - Responsive Design von Anfang an
4. **WCAG 2.1 AA** - Accessibility-Standards einhalten
5. **Bilingual** - Code-Sprache = Requirement-Sprache, UI immer DE + EN

## Referenzen

- Template: `docs/requirements/REQ-TEMPLATE.md`
- Design System: `.claude/skills/ui-design-system.md`
- Farben: `src/styles/_variables.scss`
- Architektur: `.claude/skills/angular-architecture.md`
