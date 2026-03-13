# Request Rework Command

Setzt ein Requirement im Kanban Board von "In Review" zurück auf "In Progress" — wenn Nacharbeit nötig ist.

## Usage

```
/request-rework [REQ-XXX]
```

- **Auf Feature-Branch** (`req/REQ-XXX-*` oder `feat/REQ-XXX-*`): Kein Argument nötig — REQ-ID wird aus Branch-Name extrahiert.
- **Auf `main` oder anderem Branch**: REQ-ID als Argument angeben.

---

## Workflow

### Step 1: REQ-ID ermitteln

```bash
BRANCH=$(git branch --show-current)
```

1. Falls `$ARGUMENTS` gesetzt → REQ-ID aus Argument (z.B. `REQ-010`)
2. Sonst: REQ-ID aus Branch-Name extrahieren (`req/REQ-XXX-*` oder `feat/REQ-XXX-*`)
3. Falls keine REQ-ID ermittelbar → Abbruch: "Bitte REQ-ID als Argument angeben: `/request-rework REQ-XXX`"

### Step 2: Aktuellen Status prüfen

```bash
curl -s http://localhost:3200/api/requirements/$REQ_ID
```

- Status und Name aus Response extrahieren
- Ausgabe: `$REQ_ID ($NAME) — aktueller Status: $STATUS`

### Step 3: Status auf "In Progress" setzen

```bash
curl -s -X PUT http://localhost:3200/api/requirements/$REQ_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "In Progress"}'
```

- **Erfolgreich:** `✅ $REQ_ID → "In Progress" — bereit zur Nacharbeit`
- **Board nicht erreichbar:** `⚠️ Kanban Board nicht erreichbar — Status manuell auf "In Progress" setzen`

### Step 4: Ergebnis ausgeben

```
REWORK ANGEFORDERT:
- Requirement: $REQ_ID ($NAME)
- Status: In Review → In Progress
- Board: ✅ aktualisiert
```

---

## Fehlerbehandlung

| Fall | Aktion |
|------|--------|
| Keine REQ-ID ermittelbar | Abbruch: "Bitte REQ-ID als Argument angeben" |
| Board nicht erreichbar | Warnung ausgeben, kein Abbruch |
| Requirement nicht gefunden | Abbruch: "$REQ_ID nicht im Board gefunden" |
| Status bereits "In Progress" | Hinweis: "$REQ_ID ist bereits 'In Progress'" |
