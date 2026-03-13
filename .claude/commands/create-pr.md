# Create Pull Request Command

Erstellt einen Pull Request für den aktuellen Branch.

## Usage

```
/create-pr
```

Keine Argumente nötig — Branch und Kontext werden automatisch ermittelt.

---

## Workflow

### Step 1: Branch ermitteln

```bash
BRANCH=$(git branch --show-current)
```

- Prüfe ob Branch NICHT `main` ist → Abbruch mit Hinweis falls doch
- Prüfe ob uncommitted Changes existieren → Warnung ausgeben

### Step 2: Kontext aus Branch-Name ableiten

Branch-Format: `req/<REQ-ID-Name>` (z.B. `req/REQ-010-Buchungsübersicht`)

1. **REQ-ID extrahieren** aus Branch-Name (z.B. `REQ-010`)
2. **Requirement lesen:** `docs/requirements/<REQ-ID-Name>/requirement.md`
   - Feature-Name aus Section 1 (Overview) extrahieren
3. **Quality Report lesen (falls vorhanden):** `docs/requirements/<REQ-ID-Name>/qualitaets.md`
   - Score extrahieren
   - Test Coverage extrahieren

### Step 3: Push

```bash
git push -u origin HEAD
```

### Step 4: PR erstellen

```bash
gh pr create \
  --title "feat: $REQ_ID — <Feature-Name>" \
  --body "## Summary
- Implements $REQ_ID (<Feature-Name>)
- Quality Score: XX/100 (aus qualitaets.md, oder 'nicht geprüft')
- Test Coverage: XX% (aus qualitaets.md, oder 'nicht geprüft')

## Checklist
- [x] Requirement: \`docs/requirements/$REQ_ID_NAME/requirement.md\`
- [x] Implementation on branch \`$BRANCH\`
"
```

### Step 5: Kanban Board → "In Review"

Nach erfolgreicher PR-Erstellung den Requirement-Status im Kanban Board aktualisieren:

```bash
curl -s -X PUT http://localhost:3200/api/requirements/$REQ_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "In Review"}'
```

- **Erfolgreich:** Hinweis ausgeben: `✅ $REQ_ID im Kanban Board → "In Review"`
- **Board nicht erreichbar:** Warnung: `⚠️ Kanban Board nicht erreichbar — Status manuell auf "In Review" setzen`
- **Kein Fehler-Abbruch** — PR wurde bereits erstellt, Board-Update ist optional

### Step 6: Ergebnis ausgeben

```
PR ERSTELLT:
- Branch: $BRANCH
- PR: <URL>
- Board: $REQ_ID → "In Review"
```

---

## Fehlerbehandlung

| Fall | Aktion |
|------|--------|
| Branch ist `main` | Abbruch: "Wechsle zuerst auf einen Feature-Branch" |
| Uncommitted Changes | Warnung: "Es gibt uncommitted Änderungen — diese sind NICHT im PR enthalten" |
| PR existiert bereits | `gh pr view --web` öffnen und URL ausgeben |
| Push fehlschlägt | Fehler anzeigen |
