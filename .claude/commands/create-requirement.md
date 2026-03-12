# Create Requirement Command (Parallel Agent-System)

Erstellt ein neues Requirement mit Mockup-Generierung und Pull Request.
Orchestriert 2 parallele Agents für maximale Geschwindigkeit.

> **Board-Integration:** Das Kanban Board erstellt das Requirement in der DB
> und synchronisiert REQUIREMENTS.md automatisch. Dieser Workflow erstellt
> nur den Branch, das Mockup, die requirement.md und den PR.

## Usage

```
/create-requirement $ARGUMENTS
```

**$ARGUMENTS** = `<REQ-ID-Name>` (z.B. `REQ-005-Terminauswahl`)

---

## WICHTIG: Agent-Orchestrierung

Du bist der **Orchestrator**. Führe die folgenden Phasen EXAKT aus:

---

## Phase 1: Setup (Sequentiell — Orchestrator)

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
3. Falls ein Bild hochgeladen wurde: als `mockup-original.png` im REQ-Ordner ablegen

```bash
mkdir -p docs/requirements/$ARGUMENTS
cp docs/requirements/REQ-TEMPLATE.md docs/requirements/$ARGUMENTS/requirement.md
```

**GATE 1:** Ordner existiert, Template kopiert, Branch erstellt

---

## Phase 2: Starte 2 Agents PARALLEL

Verwende das `Agent`-Tool und starte **BEIDE Agents in EINEM Tool-Aufruf** (parallel):

---

### Agent 1: Mockup Agent

```
Prompt: "Erstelle ein HTML-Mockup für das Requirement '$ARGUMENTS'.

**PFLICHT-LEKTÜRE — Bestehenden Kontext verstehen (vor dem Generieren!):**

1. **Vision (ZUERST lesen!):**
   - Lese `docs/VISION.md` — Kernwerte (User First, Security First, Quality First), Qualitätsziele, Definition of Done
   - Accessibility-Ziel: WCAG AA, Lighthouse > 95 — BINDEND für Mockup!

3. **Design-System:**
   - Lese `src/styles/_variables.scss` — ALLE CSS-Variablen (Farben, Spacing, Fonts, Radii, Shadows)
   - Lese `src/styles/_utilities.scss` — `.icon-framed` Klassen und Varianten
   - Lese `src/styles/_breakpoints.scss` — Responsive Breakpoints

4. **Bestehende UI analysieren (PFLICHT!):**
   - Lese `src/app/shared/components/header/header-container.component.html` + `.scss` — Header-Layout
   - Lese `src/app/app.component.html` + `.scss` — App-Shell (Header/Content/Footer)
   - Lese bestehende E2E-Screenshots: `docs/requirements/REQ-*/screenshots/e2e-responsive-desktop.png`

5. **Bestehende Mockups konsultieren (falls vorhanden):**
   - Lese `docs/requirements/REQ-*/mockup.html` — Design-Konsistenz sicherstellen!
   - Übernimm Header, Footer, Navigation, Card-Styles EXAKT wie in bestehenden Mockups

6. **Bestehende Feature-Templates für Patterns:**
   - Lese 1-2 implementierte Component-Templates: `src/app/features/booking/components/*/`
   - Übernimm Card-Layout, Button-Styles, Grid-Patterns aus echtem Code

7. **Bestehende Requirements für Wizard-Kontext:**
   - Lese `docs/requirements/REQUIREMENTS.md` — Wizard-Schritte verstehen
   - Prüfe welcher Wizard-Schritt das neue REQ ist (für Zurück/Weiter-Navigation)

8. **Hochgeladenes Bild (falls vorhanden):**
   - `docs/requirements/$ARGUMENTS/mockup-original.png`
   - NUR Struktur/Layout extrahieren, KEINE Farben/Styling aus dem Bild!

**Generiere:** `docs/requirements/$ARGUMENTS/mockup.html`

**Mockup-Regeln:**
1. Standalone HTML — muss ohne Server im Browser öffenbar sein
2. Google Material Icons via CDN einbinden
3. CSS-Variablen aus `_variables.scss` übernehmen — im `<style>` als `:root`
4. Projekt-Design-System exakt nachbilden:
   - Header: Logo-Platzhalter (blauer Kreis 'GS') + Firmenname links, Cart-Icon + A11y-Icon rechts (`.icon-framed`)
   - Content: Zentriert (`max-width: 70em`), Überschrift + Subtitle + Feature-UI
   - Footer: Firmenname zentriert
   - Navigation: Zurück/Weiter-Buttons (wo relevant, passend zum Wizard-Schritt)
5. Responsive — Media Queries: Mobile (<48em), Tablet (>=48em), Desktop (>=64em)
6. **NUR CSS** — Hover/Selected/Focus via CSS. **KEIN `<script>` Tag!**
   - Nutze hidden radio/checkbox inputs + CSS `:checked` + sibling selectors für Interaktivität
7. Deutsche Texte — UI-Sprache DE
8. Accessibility — `role`, `aria-*`, Focus-Styles, Kontrast, WCAG 2.1 AA
9. Buttons IMMER filled (wie `mat-flat-button`)
10. Icons IMMER mit `.icon-framed` Rahmen
11. em/rem statt px, BEM Naming

**Screenshot erstellen (falls Playwright verfügbar):**
```bash
npx playwright screenshot --viewport-size='1280,720' docs/requirements/$ARGUMENTS/mockup.html docs/requirements/$ARGUMENTS/mockup.png
```

Gib zurück:
MOCKUP_RESULT:
- mockup.html: erstellt
- mockup.png: [ja/nein]
- Konsultierte Mockups: [REQ-002, REQ-003, ...]
- Responsive: [mobile, tablet, desktop]
- Accessibility: [ja/nein]
- JavaScript: kein <script>"
```

---

### Agent 2: Requirement Agent

```
Prompt: "Fülle das Requirement-Template für '$ARGUMENTS' aus.

**PFLICHT-LEKTÜRE — Bestehenden Kontext verstehen (vor dem Schreiben!):**

1. **Vision (ZUERST lesen!):**
   - Lese `docs/VISION.md` — Kernwerte (User First, Security First, Quality First), Qualitätsziele, Roadmap
   - Das Requirement MUSS zur Vision passen: Accessibility (WCAG AA), Security (OWASP), Performance, Testbarkeit
   - Definition of Done aus Vision als Referenz für Acceptance Criteria!

2. **Template + bestehende Requirements (Stil + Detailtiefe übernehmen!):**
   - Lese `docs/requirements/REQ-TEMPLATE.md` — Template-Struktur
   - Lese ALLE bestehenden Requirements als Referenz:
     `docs/requirements/REQ-*/requirement.md`
   - Übernimm Schreibstil, Detailtiefe, Tabellenformate, AC-Formulierungen EXAKT
   - Prüfe Wizard-Reihenfolge: Welcher Schritt kommt davor/danach?

3. **Bestehende Architektur verstehen:**
   - Lese `docs/requirements/REQUIREMENTS.md` — Gesamtübersicht + Dependencies
   - Lese `.claude/skills/angular-architecture.md` — Container/Presentational, Store Pattern
   - Lese `.claude/skills/routing-patterns.md` — Resolver, Guards, Lazy Loading

4. **Bestehende Implementierung konsultieren (Naming + Patterns!):**
   - Lese `src/app/features/booking/stores/booking.store.ts` — bestehende Store-Methoden + State
   - Lese `src/app/features/booking/models/*.model.ts` — bestehende Types/Interfaces
   - Lese `src/app/features/booking/services/*.service.ts` — bestehende API-Services
   - Lese 1-2 bestehende Container-Components für Patterns:
     `src/app/features/booking/components/*/`

5. **i18n-Kontext:**
   - Lese `src/app/core/i18n/translations.ts` — bestehende Keys, Namensschema, Struktur
   - Neues Feature MUSS zum bestehenden Key-Schema passen (z.B. `booking.feature.key`)

6. **Hochgeladenes Bild (falls vorhanden):**
   - `docs/requirements/$ARGUMENTS/mockup-original.png`
   - Analysiere für UI-Elemente, Flow, Texte

**Bearbeite:** `docs/requirements/$ARGUMENTS/requirement.md`

**Fülle folgende Sections aus:**

| Section | Inhalt |
|---------|--------|
| 1. Overview | Purpose, Scope, Related Requirements |
| 2. User Story | As a... I want... So that... + Acceptance Criteria |
| 3. Preconditions | System, User, Data (inkl. Übergabe von vorheriger Seite!) |
| 4. Main Flow | Schritt-für-Schritt, Mockup-Verweis: `![Feature](./mockup.png)` |
| 5. Alternative Flows | Alternative Szenarien |
| 6. Exception Flows | Fehlerbehandlung (Guards!) |
| 7. Postconditions | Übergabe an nächsten Schritt (Store-Felder!) |
| 8. Business Rules | Fachliche Regeln |
| 9. Non-Functional Requirements | Performance, Usability |
| 10. Data Model | TypeScript Interfaces/Types (BESTEHENDE Types erweitern, nicht duplizieren!) |
| 11. UI/UX | UI-Elemente Tabelle + Material Components |
| 12. API Specification | Endpoints (Click-Dummy: statisch) |
| 13. Test Cases | Testszenarien mit Given/When/Then |
| 14. Implementation | Angular Components, Services, Stores, Folder-Struktur |
| 15. Dependencies | Requires + Blocks (aus REQUIREMENTS.md ableiten!) |
| 16. Naming Glossary | Methodennamen (Code-Sprache: Englisch!) |
| 17. i18n Keys | DE + EN (zum bestehenden Schema passend!) |

**Regeln:**
- Code-Sprache: ENGLISCH (Variablen, Methoden, Klassen, CSS-Klassen)
- UI-Sprache: DE + EN (i18n Keys)
- Keine Platzhalter `[...]` übrig lassen
- Container/Presentational Pattern beachten (wie bestehende Components!)
- Store: bestehende State-Felder erweitern, NICHT neuen Store erstellen
- Store mit `withState`, `withComputed`, `withMethods`
- Data Model: bestehende Interfaces erweitern oder importieren
- Postconditions: EXAKT definieren was im Store gespeichert wird
- Preconditions: EXAKT definieren was vom vorherigen Schritt erwartet wird
- Status auf 'Draft' setzen

Gib zurück:
REQUIREMENT_RESULT:
- requirement.md: ausgefüllt
- Vision berücksichtigt: [ja/nein]
- Sections: X/17 komplett
- Konsultierte REQs: [REQ-002, REQ-003, ...]
- Bestehende Store-Felder berücksichtigt: [ja/nein]
- Platzhalter: 0 übrig
- i18n Keys: DE + EN
- Code-Sprache: Englisch"
```

---

## Phase 3: Finalisierung (Sequentiell — Orchestrator)

### Step 1: Ergebnisse sammeln

Warte auf beide Agents und prüfe:

```
AGENT-ERGEBNISSE:
- Agent 1 (Mockup):      [OK/FAIL] mockup.html + mockup.png
- Agent 2 (Requirement):  [OK/FAIL] requirement.md (X/17 Sections)
```

### Step 2: Requirement prüfen

```
/check-requirement $ARGUMENTS
```

Prüft:
- [ ] Alle Pflicht-Sections ausgefüllt
- [ ] Keine Platzhalter `[...]` mehr
- [ ] Keine hardcoded Farben
- [ ] i18n Keys DE + EN
- [ ] **Mockup vorhanden** (`mockup.html`)
- [ ] **Kein `<script>` Tag im Mockup**

### Step 3: Fertigmeldung (KEIN Commit/Push/PR!)

> **Änderungen werden NICHT committed oder gepusht!**
> Der Benutzer prüft lokal und entscheidet selbst über Commit + Push.
> Bei Bedarf: `/create-pr` für Pull Request.

**Ausgabe:**

```
REQUIREMENT ERSTELLT: $ARGUMENTS
- Branch: req/$ARGUMENTS
- mockup.html: erstellt
- requirement.md: X/17 Sections
- Alle Änderungen sind LOKAL (nicht committed)

Nächste Schritte (manuell):
  git add docs/requirements/$ARGUMENTS/
  git commit -m "docs($ARGUMENTS): create requirement with mockup"
  git push -u origin req/$ARGUMENTS
  /create-pr

Nächste Schritte (manuell):
  git add docs/requirements/$ARGUMENTS/
  git commit -m "docs($ARGUMENTS): create requirement with mockup"
  /create-pr
```

---

## Beispiel

```
/create-requirement REQ-005-Terminauswahl
```

**Ablauf:**
1. **Phase 1** (Orchestrator): Branch + Ordner (~5s)
2. **Phase 2** (2 Agents parallel): Mockup + Requirement (~60s)
3. **Phase 3** (Orchestrator): Check + Commit + PR (~15s)

**Ergebnis:**
1. Branch: `req/REQ-005-Terminauswahl`
2. `mockup.html` — Standalone HTML+CSS Mockup (kein JavaScript!)
3. `mockup.png` — Screenshot (falls Playwright verfügbar)
4. `requirement.md` — Alle 17 Sections ausgefüllt
5. PR erstellt und Link ausgegeben

---

## Wichtige Regeln

1. **2 Agents PARALLEL** — Immer in EINEM Tool-Aufruf starten!
2. **Mockup ist PFLICHT** — Jedes Requirement braucht ein `mockup.html`
3. **Kein JavaScript** — Mockup ist reines HTML+CSS, KEIN `<script>` Tag!
4. **Bestehende Features konsultieren** — Screenshots + Templates analysieren
5. **Hochgeladene Bilder = nur Anhaltspunkt** — Struktur ja, Styling NEIN
6. **Keine Farben aus Screenshots** — IMMER `_variables.scss` CSS-Variablen
7. **Buttons IMMER filled** — `mat-flat-button`, KEIN `mat-stroked-button`
8. **Icons IMMER mit Rahmen** — `.icon-framed` Klasse
9. **Accessibility PFLICHT** — WCAG 2.1 AA, Focus-Styles, Kontrast
10. **Mobile-First** — Responsive Design mit 3 Breakpoints
11. **Bilingual** — Code-Sprache Englisch, UI immer DE + EN

---

## Checkliste (PFLICHT — nach Phase 3 ausfüllen!)

```
CHECKLISTE: $ARGUMENTS

SETUP
- [ ] Branch `req/$ARGUMENTS` erstellt
- [ ] Ordner `docs/requirements/$ARGUMENTS/` erstellt
- [ ] Template kopiert

MOCKUP (Agent 1)
- [ ] `docs/VISION.md` gelesen (Accessibility + Qualitätsziele)
- [ ] `mockup.html` erstellt
- [ ] Kein `<script>` Tag
- [ ] CSS-Variablen aus `_variables.scss` verwendet
- [ ] Bestehende Mockups konsultiert (Design-Konsistenz)
- [ ] Header/Footer wie bestehende Features
- [ ] Responsive: Mobile + Tablet + Desktop
- [ ] Accessibility: aria-*, focus-visible, Kontrast
- [ ] Buttons filled (`mat-flat-button` Stil)
- [ ] Icons mit `.icon-framed` Rahmen
- [ ] em/rem statt px

REQUIREMENT (Agent 2)
- [ ] `docs/VISION.md` gelesen (Kernwerte + Definition of Done)
- [ ] Alle 17 Sections ausgefüllt
- [ ] Keine Platzhalter `[...]` übrig
- [ ] Bestehende Requirements konsultiert (Stil + Detailtiefe)
- [ ] Bestehender Store/Models/Services berücksichtigt
- [ ] Wizard-Reihenfolge korrekt (Preconditions + Postconditions)
- [ ] Data Model: bestehende Types erweitert (nicht dupliziert)
- [ ] Code-Sprache: Englisch (Variablen, Methoden, Klassen)
- [ ] i18n Keys: DE + EN (zum bestehenden Schema passend)
- [ ] Container/Presentational Pattern
- [ ] Test Cases: Given/When/Then

PRÜFUNG
- [ ] /check-requirement bestanden
- [ ] Fertigmeldung ausgegeben (Änderungen LOKAL, kein Commit/Push/PR)
```

---

## Fehlerbehandlung

Falls ein Agent fehlschlägt:
1. Dokumentiere den Fehler
2. Führe den fehlgeschlagenen Agent einzeln erneut aus
3. Fahre mit Phase 3 fort sobald beide Ergebnisse vorliegen

---

## Referenzen

- **Vision: `docs/VISION.md` (Kernwerte, Qualitätsziele, Definition of Done)**
- Template: `docs/requirements/REQ-TEMPLATE.md`
- Design System: `.claude/skills/ui-design-system.md`
- Farben: `src/styles/_variables.scss`
- Architektur: `.claude/skills/angular-architecture.md`
- **Bestehende Screenshots:** `docs/requirements/REQ-*/screenshots/e2e-responsive-desktop.png`
- **Bestehende Templates:** `src/app/features/booking/components/*/`
