# Implement Requirement Command

Implementiert ein Requirement basierend auf der Spezifikation.

## Usage

```
/implement-requirement $ARGUMENTS
```

**$ARGUMENTS** = `<REQ-ID-Name>` (z.B. `REQ-001-Header`)

---

## ⛔ VERBINDLICHE REGELN

> **JEDER Step ist PFLICHT. Kein Step darf übersprungen werden.**
> **Bei Verstoß: Implementierung ist UNGÜLTIG.**

### Gate-System

Jeder Step hat ein **GATE** — eine Bedingung die erfüllt sein MUSS bevor der nächste Step starten darf:

| Step | Gate |
|------|------|
| Step 0 | PR-Status synchronisiert |
| Step 1 | Branch existiert |
| Step 1.5 | Requirement-Status auf "In Progress" gesetzt |
| Step 2 | Requirement gelesen, Feature-Name + Sprache extrahiert |
| **Step 3** | **Vision + ALLE 5 Skills gelesen, Code-Sprache bestätigt** |
| Step 4 | Code implementiert |
| Step 5 | Styling angewendet |
| Step 6 | Tests geschrieben + >80% |
| **Step 7** | **lint ✅ + type-check ✅ + tests ✅** |
| **Step 8** | **`/check-all` Score >= 90 + qualitaets.md generiert** |
| Step 9 | Commit erstellt |
| Step 10 | Requirement-Status auf "In Review" gesetzt |

---

## Workflow

### Step 0: PR-Status synchronisieren

**Automatisch bei jedem Skill-Lauf:**

1. **Gemergte PRs abrufen:**
   ```bash
   gh pr list --state merged --search "feat/REQ-" --json headRefName --limit 100
   ```

2. **Offene PRs abrufen:**
   ```bash
   gh pr list --state open --search "feat/REQ-" --json headRefName
   ```

3. **Status synchronisieren:**

   | PR-Status | → Requirement Status |
   |-----------|---------------------|
   | merged | ✔️ Implemented |
   | open | 🔍 In Review |

4. **Dateien aktualisieren:**
   - `docs/requirements/<REQ>/requirement.md` → Status-Zeile
   - `docs/requirements/REQUIREMENTS.md` → Tabelle + Statistics

5. **Falls Änderungen:**
   ```bash
   git add docs/requirements/
   git commit -m "chore: sync requirement status with GitHub PRs"
   git push
   ```

**GATE 0:** ✅ PR-Status synchronisiert

---

### Step 1: Branch erstellen

```bash
git checkout -b feat/$ARGUMENTS
```

**GATE 1:** ✅ Branch `feat/$ARGUMENTS` existiert

---

### Step 1.5: Status auf "In Progress" setzen

1. **`docs/requirements/REQUIREMENTS.md`** — Tabelle aktualisieren:
   - Zeile des aktuellen Requirements finden
   - Status ändern auf `🚧 In Progress`

2. **`docs/requirements/REQUIREMENTS.md`** — Statistics aktualisieren:
   - Zähler entsprechend anpassen (alten Status -1, `🚧 In Progress` +1)

3. **`docs/requirements/$ARGUMENTS/requirement.md`** — Status-Zeile aktualisieren:
   - `**Status:** In Progress`

4. **Commit:**
   ```bash
   git add docs/requirements/REQUIREMENTS.md docs/requirements/$ARGUMENTS/requirement.md
   git commit -m "chore($ARGUMENTS): set requirement status to In Progress"
   ```

**GATE 1.5:** ✅ Requirement-Status auf "In Progress" gesetzt

---

### Step 2: Requirement lesen

1. Lese `docs/requirements/$ARGUMENTS/requirement.md`
2. Extrahiere:
   - Section 10: Data Model (Interfaces)
   - Section 11: UI/UX (Components)
   - Section 14: Implementation (File Structure)
   - Section 16: Naming Glossary (Methodennamen)
3. **Extrahiere den Feature-Namen** (z.B. `booking`, `user-management`)

**GATE 2:** ✅ Requirement gelesen, Feature-Name bestimmt

---

### Step 3: Skills + Vision lesen (ALLE PFLICHT!)

> ⛔ **NICHT "bei Bedarf" — ALLE Skills + Vision MÜSSEN gelesen werden!**
> **Kein Code darf generiert werden bevor ALLE 6 Dokumente gelesen wurden!**

**Lese ALLE 6 Dokumente in dieser Reihenfolge:**

| # | Dokument | Datei | Warum |
|---|----------|-------|-------|
| 1 | **Vision** | `docs/VISION.md` | **Kernwerte, Qualitätsziele, Definition of Done — LEITPLANKE für alle Entscheidungen!** |
| 2 | **Code Language** | `.claude/skills/code-language.md` | **Bestimmt Sprache ALLER Variablen, Methoden, Klassen, CSS-Klassen** |
| 3 | **Architecture** | `.claude/skills/angular-architecture.md` | Container/Presentational, Store Pattern, Deployment-Typ |
| 4 | **i18n** | `.claude/skills/i18n-typings.md` | UI-Sprachen (DE/EN/etc.), Translation Pattern |
| 5 | **Routing** | `.claude/skills/routing-patterns.md` | Resolver, Guards, Lazy Loading, HashLocation |
| 6 | **Forms** | `.claude/skills/forms.md` | Reactive Forms (auch wenn Feature keine Forms hat → bestätigen!) |

**Nach dem Lesen — Bestätige explizit:**

```
📋 SKILL-CHECK BESTÄTIGT:
- Vision: Kernwerte + Qualitätsziele gelesen (aus VISION.md)
- Code-Sprache: [Englisch/Deutsch] (aus code-language.md)
- UI-Sprachen: [DE, EN] (aus i18n-typings.md)
- Deployment: [Click-Dummy/Production] (aus angular-architecture.md)
- Routing: [HashLocation/Standard] (aus routing-patterns.md)
- Forms: [Ja/Nein — relevant für dieses Feature]
```

> ⛔ **STOP wenn Code-Sprache nicht bestätigt wurde!**
> **Code-Sprache aus `code-language.md` ist BINDEND für ALLE generierten Dateien:**
> - Variablennamen, Methodennamen, Klassennamen
> - CSS-Klassen, i18n Key-Pfade
> - Dateinamen, Ordnernamen
> - Comments (optional, aber empfohlen in Code-Sprache)
>
> ⛔ **Vision-Qualitätsziele sind BINDEND:**
> - Accessibility: WCAG AA, Lighthouse > 95
> - Performance: Lighthouse > 90
> - Security: OWASP-konform
> - Test Coverage: > 80%

**GATE 3:** ✅ Vision gelesen + ALLE 5 Skills gelesen, Code-Sprache + UI-Sprachen + Deployment bestätigt

---

### Step 4: Implementieren

**Verwende die Code-Sprache aus Step 3 für ALLE Dateien!**

Reihenfolge:
1. **Models** (`models/*.model.ts`)
2. **Store** (`stores/*.store.ts`)
3. **Services** (`services/*-api.service.ts`)
4. **Container Component** (`*-container.component.ts` + `.html` + `.scss`)
5. **Presentational Components** (`components/*.component.ts` + `.html` + `.scss`)
6. **i18n** (Translations in ALLEN konfigurierten UI-Sprachen)
7. **Routes** (Feature-Routes + app.routes.ts)
8. **Resolver** (`resolvers/*.resolver.ts`)

**Regeln aus Skills beachten:**
- Container: `inject(Store)`, `OnPush`, Event Handler (`onXxx()`)
- Presentational: `input()`, `output()` only, KEIN Store
- Store: `withState`, `withComputed`, `withMethods`, `providedIn: 'root'`
- KEIN `onInit` im Store für Feature-Daten → Resolver!
- KEIN `ngOnInit` in Component für Data Loading → Resolver!
- Separate `.html` + `.scss` Dateien (KEINE inline templates/styles!)
- `@for` mit `track item.id` (NICHT `$index`)

**GATE 4:** ✅ Alle Dateien implementiert

---

### Step 5: Styling

- IMMER `src/styles/_variables.scss` verwenden
- KEINE hardcoded Farben!
- Mobile-First responsive
- em/rem statt px
- BEM Naming
- WCAG 2.1 AA

**GATE 5:** ✅ Styling angewendet

---

### Step 6: Tests schreiben

- Jest Unit Tests für Store, Services, Components
- Ziel: >80% Coverage
- Tests ausführen und bestätigen:

```bash
npm run test:coverage
```

**GATE 6:** ✅ Tests geschrieben + alle bestanden

---

### Step 7: Technische Prüfung (PFLICHT! BLOCKER! PARALLEL AGENTS!)

> ⛔ **ALLE 3 Prüfungen MÜSSEN ausgeführt werden!**
> ⚡ **ALLE 3 als parallele Agents starten** (3 Task-Tool-Aufrufe mit `subagent_type: "Bash"` in EINER Nachricht)!
> **Bei Fehler: Fixen und erneut ALLE 3 parallel als Agents ausführen bis GRÜN!**

**3 parallele Agents starten (EINE Nachricht, 3 Task-Tool-Aufrufe):**

| # | Agent Description | Command | Prüft |
|---|-------------------|---------|-------|
| 1 | `"Run lint:fix"` | `npm run lint:fix` | ESLint Regeln + Auto-Fix |
| 2 | `"Run type-check"` | `npm run type-check` | TypeScript Typen |
| 3 | `"Run test:coverage"` | `npm run test:coverage` | Jest Tests + Coverage >80% |

**Jeder Agent-Aufruf sieht so aus:**
```
Task tool:
  subagent_type: "Bash"
  description: "Run lint:fix" / "Run type-check" / "Run test:coverage"
  prompt: "Führe `npm run <command>` aus und berichte das Ergebnis: PASS oder FAIL mit Details."
```

> ⚡ **WICHTIG:** Die 3 Agents sind voneinander UNABHÄNGIG und MÜSSEN parallel gestartet werden!
> **NICHT sequenziell ausführen — das verschwendet Zeit!**

**Ergebnis dokumentieren (erst wenn ALLE 3 Agents fertig):**
```
🔧 TECHNISCHE PRÜFUNG (3 parallele Agents):
- lint:fix     → [✅ PASS / ❌ FAIL + Fehler]
- type-check   → [✅ PASS / ❌ FAIL + Fehler]
- test:coverage → [✅ PASS (XX%) / ❌ FAIL + fehlgeschlagene Tests]
```

> ⛔ **STOP bei FAIL!** Erst fixen, dann erneut ALLE 3 parallel als Agents prüfen.
> **Step 8 darf NICHT starten wenn Step 7 nicht GRÜN ist!**

**GATE 7:** ✅ lint ✅ + type-check ✅ + tests ✅

---

### Step 8: Quality Checks (PFLICHT! BLOCKER!)

> ⛔ **NICHT ÜBERSPRINGEN! /check-all ist PFLICHT vor jedem Commit!**
> **Diese Checks sind die letzte Quality Gate vor dem Commit.**

**Feature-Name aus Step 2 verwenden:**

```
/check-all <feature-name>
```

Dies führt 13 Checks aus (11 statisch + E2E + Documentation):
- `/check-architecture` — Container/Presentational Pattern
- `/check-stores` — NgRx Signal Store
- `/check-routing` — Routing Patterns
- `/check-security` — Security Audit
- `/check-eslint` — ESLint Rules
- `/check-typescript` — Type Safety
- `/check-performance` — Performance
- `/check-styling` — SCSS & Accessibility
- `/check-i18n` — Internationalization
- `/check-forms` — Reactive Forms (falls relevant)
- `/check-code-language` — Code Language
- `/check-e2e` — E2E Tests (Playwright MCP)
- `/check-documentation` — Feature Documentation (DE + EN)

**Quality Gate:**
- Ziel: Score >= 90/100
- Generiert: `docs/requirements/$ARGUMENTS/qualitaets.md`
- Generiert: `feature-documentation-de.md` + `feature-documentation-en.md`

**Bei Score < 90:**
1. Issues aus dem Report lesen
2. Fixen
3. **Step 7 erneut ausführen** (lint + type-check + tests)
4. **Step 8 erneut ausführen** (/check-all)
5. Wiederholen bis Score >= 90

> ⛔ **STOP bei Score < 90!** Commit ist NICHT erlaubt!
> ⛔ **qualitaets.md MUSS generiert worden sein!**

**GATE 8:** ✅ Score >= 90/100 + qualitaets.md generiert

---

### Step 9: Commit

**Erst nach bestandenem Quality Gate (Step 8)!**

```bash
git add .
git commit -m "feat($ARGUMENTS): implement <Feature-Name>"
```

**GATE 9:** ✅ Commit erstellt

---

### Step 10: Status in REQUIREMENTS.md auf "In Review" setzen

**Nach dem Commit — Requirement-Status aktualisieren:**

1. **`docs/requirements/REQUIREMENTS.md`** — Tabelle aktualisieren:
   - Zeile des aktuellen Requirements finden
   - Status ändern auf `🔍 In Review`

2. **`docs/requirements/REQUIREMENTS.md`** — Statistics aktualisieren:
   - Zähler entsprechend anpassen (alten Status -1, `🔍 In Review` +1)

3. **`docs/requirements/$ARGUMENTS/requirement.md`** — Status-Zeile aktualisieren:
   - `**Status:** In Review`

4. **Commit:**
   ```bash
   git add docs/requirements/REQUIREMENTS.md docs/requirements/$ARGUMENTS/requirement.md
   git commit -m "chore($ARGUMENTS): set requirement status to In Review"
   ```

**GATE 10:** ✅ Requirement-Status auf "In Review" gesetzt

---

## Checkliste (ALLE Punkte PFLICHT!)

- [ ] Step 0: PR-Status synchronisiert
- [ ] Step 1: Branch erstellt
- [ ] **Step 1.5: Requirement-Status in REQUIREMENTS.md auf "In Progress" gesetzt**
- [ ] Step 2: Requirement gelesen
- [ ] **Step 3: Vision gelesen (docs/VISION.md) — Kernwerte + Qualitätsziele bekannt**
- [ ] **Step 3: ALLE 5 Skills gelesen (code-language, architecture, i18n, routing, forms)**
- [ ] **Step 3: Code-Sprache bestätigt**
- [ ] Step 4: Models definiert
- [ ] Step 4: Store mit `withState`, `withComputed`, `withMethods`
- [ ] Step 4: Container Component mit `OnPush`
- [ ] Step 4: Presentational Components mit `input()`/`output()`
- [ ] Step 4: i18n in ALLEN UI-Sprachen
- [ ] Step 4: Resolver für Data Loading
- [ ] Step 5: Styling aus `_variables.scss`, Mobile-First, WCAG 2.1 AA
- [ ] Step 6: Tests >80%
- [ ] **Step 7: `npm run lint:fix` ✅**
- [ ] **Step 7: `npm run type-check` ✅**
- [ ] **Step 7: `npm run test:coverage` ✅**
- [ ] **Step 8: `/check-all` ausgeführt (Score >= 90/100)**
- [ ] **Step 8: `qualitaets.md` generiert**
- [ ] **Step 8: E2E Tests bestanden (check-e2e)**
- [ ] **Step 8: Feature-Dokumentation in DE + EN generiert (check-documentation)**
- [ ] Step 9: Commit erstellt
- [ ] **Step 10: Requirement-Status in REQUIREMENTS.md auf "In Review" gesetzt**
- [ ] **Step 10: Requirement-Status in requirement.md auf "In Review" gesetzt**

---

## Referenzen

- **Vision: `docs/VISION.md` (Kernwerte, Qualitätsziele, Definition of Done)**
- Requirement: `docs/requirements/$ARGUMENTS/requirement.md`
- Skills: `.claude/skills/*.md` (ALLE 5 lesen!)
- Styling: `src/styles/_variables.scss`
- Quality Template: `docs/requirements/QUALITAETS-TEMPLATE.md`
