# Implement Requirement Command

Implementiert ein Requirement basierend auf der Spezifikation.

## Usage

```
/implement-requirement $ARGUMENTS
```

**$ARGUMENTS** = `<REQ-ID-Name>` (z.B. `REQ-001-Header`)

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

### Step 1: Branch erstellen

```bash
git checkout -b feat/$ARGUMENTS
```

### Step 2: Requirement lesen

1. Lese `docs/requirements/$ARGUMENTS/requirement.md`
2. Extrahiere:
   - Section 10: Data Model (Interfaces)
   - Section 11: UI/UX (Components)
   - Section 14: Implementation (File Structure)
   - Section 16: Naming Glossary (Methodennamen)

### Step 3: Skills lesen (bei Bedarf)

- `.claude/skills/angular-architecture.md` (IMMER!)
- `.claude/skills/i18n-typings.md` (bei Templates)
- `.claude/skills/forms.md` (bei Formularen)
- `.claude/skills/routing-patterns.md` (bei Routes)

### Step 4: Implementieren

Reihenfolge:
1. **Models** (`models/*.model.ts`)
2. **Store** (`stores/*.store.ts`)
3. **Services** (`services/*-api.service.ts`)
4. **Container Component** (`*-container.component.ts`)
5. **Presentational Components** (`components/*.component.ts`)
6. **i18n** (Translations DE + EN)
7. **Routes** (`app.routes.ts`)

### Step 5: Styling

- IMMER `src/styles/_variables.scss` verwenden
- KEINE hardcoded Farben!
- Mobile-First responsive

### Step 6: Tests schreiben

- Jest Unit Tests für Store, Services, Components
- Ziel: >80% Coverage

### Step 7: Prüfen

```bash
npm run lint:fix
npm run type-check
npm run test:coverage
```

### Step 8: Quality Report generieren

```bash
git add .
git commit -m "feat($ARGUMENTS): Implement <Name>"
```

## Checkliste

- [ ] PR-Status synchronisiert (Step 0)
- [ ] Models definiert
- [ ] Store mit `withState`, `withComputed`, `withMethods`
- [ ] Container Component mit `OnPush`
- [ ] Presentational Components mit `input()`/`output()`
- [ ] i18n DE + EN
- [ ] Styling aus `_variables.scss`
- [ ] Mobile-First responsive
- [ ] WCAG 2.1 AA
- [ ] Tests >80%
- [ ] Lint + Type-Check passed

## Referenzen

- Requirement: `docs/requirements/$ARGUMENTS/requirement.md`
- Architektur: `.claude/skills/angular-architecture.md`
- Styling: `src/styles/_variables.scss`
