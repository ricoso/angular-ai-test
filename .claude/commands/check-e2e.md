# Check E2E Command (Playwright MCP)

Testet ein Feature im Browser via Playwright MCP Server.

## Usage

```
$ARGUMENTS = <feature-name>
```

Example: `booking`

---

## Voraussetzungen

1. **Dev Server** muss laufen auf `http://localhost:4200`
   ```bash
   npm start
   ```
2. **Playwright MCP** muss konfiguriert sein in `.claude/mcp-config.json`
3. **Chromium** muss installiert sein:
   ```bash
   npx playwright install chromium
   ```

---

## Ablauf

### Schritt 1: Feature-Route ermitteln

1. Suche die Route-Definition in `src/app/features/$ARGUMENTS/**/*.routes.ts`
2. Ermittle die Feature-URL: `http://localhost:4200/#/<route>`
3. Falls keine Route gefunden: Prüfe `src/app/app.routes.ts` für die Feature-Route

---

### Schritt 2: Requirement lesen

1. Ermittle REQ-ID aus Feature-Name:
   - Feature `booking` → suche in `docs/requirements/REQ-*-*`
   - Lese `requirement.md`
2. Extrahiere Test-Szenarien aus:
   - **Section 4:** Main Flow (Hauptablauf)
   - **Section 13:** Test Cases (falls vorhanden)
   - **Section 11:** UI/UX (Responsive-Anforderungen)

---

### Schritt 3: Initiale Navigation + Screenshot

```
1. browser_navigate → Feature-URL (http://localhost:4200/#/<route>)
2. browser_screenshot → Initialzustand dokumentieren
   → Speichern als: e2e-step-01-initial.png
3. browser_snapshot → Accessibility-Tree prüfen
```

---

### Schritt 4: Test-Szenarien durchspielen

Für JEDES Szenario aus dem Requirement:

```
1. browser_navigate → Feature-URL (falls nötig)
2. browser_screenshot → Zustand VOR Interaktion
3. browser_click / browser_type → Interaktion ausführen
4. browser_screenshot → Zustand NACH Interaktion
   → Speichern als: e2e-step-XX-<description>.png
5. browser_snapshot → Accessibility-Tree verifizieren
```

**Namenskonvention Screenshots:**
- `e2e-step-01-initial.png`
- `e2e-step-02-<action>.png`
- `e2e-step-03-<result>.png`

---

### Schritt 5: Sprachumschaltung testen

Für JEDE konfigurierte UI-Sprache (DE, EN):

```
1. browser_evaluate → localStorage.setItem('app-language', '<lang>')
2. browser_navigate → Feature-URL (Reload)
3. browser_screenshot → UI in dieser Sprache
   → Speichern als: e2e-lang-<lang>.png
4. Verifiziere: Alle sichtbaren Texte in korrekter Sprache
```

**localStorage Key:** `app-language` (siehe `.claude/skills/i18n-typings.md`)

---

### Schritt 6: Responsive Tests

Teste drei Viewports:

| Viewport | Breite | Höhe | Screenshot |
|----------|--------|------|------------|
| Desktop | 1280 | 720 | `e2e-responsive-desktop.png` |
| Tablet | 768 | 1024 | `e2e-responsive-tablet.png` |
| Mobile | 375 | 667 | `e2e-responsive-mobile.png` |

Für jeden Viewport:
```
1. browser_resize → Viewport setzen
2. browser_navigate → Feature-URL
3. browser_screenshot → Layout dokumentieren
4. browser_snapshot → Accessibility bei diesem Viewport prüfen
```

---

### Schritt 7: Screenshots speichern

Alle Screenshots werden gespeichert in:
```
docs/requirements/<REQ-ID>/screenshots/
├── e2e-step-01-initial.png
├── e2e-step-02-<action>.png
├── e2e-step-XX-<description>.png
├── e2e-lang-de.png
├── e2e-lang-en.png
├── e2e-responsive-desktop.png
├── e2e-responsive-tablet.png
└── e2e-responsive-mobile.png
```

Falls der `screenshots/` Ordner nicht existiert, erstelle ihn:
```bash
mkdir -p docs/requirements/<REQ-ID>/screenshots
```

---

### Schritt 8: Ergebnis-Report

Gib den Report in folgendem Format aus:

```
E2E_RESULT:
check-e2e: <score>/100 [✅|⚠️|❌]

Test-Szenarien:
| # | Szenario | Status | Screenshot |
|---|----------|--------|------------|
| 1 | <Main Flow Step> | ✅❌ | e2e-step-01-xxx.png |
| 2 | <Nächster Step> | ✅❌ | e2e-step-02-xxx.png |

Sprachumschaltung:
| Sprache | Status | Screenshot |
|---------|--------|------------|
| DE | ✅❌ | e2e-lang-de.png |
| EN | ✅❌ | e2e-lang-en.png |

Responsive:
| Viewport | Status | Screenshot |
|----------|--------|------------|
| Desktop (1280x720) | ✅❌ | e2e-responsive-desktop.png |
| Tablet (768x1024) | ✅❌ | e2e-responsive-tablet.png |
| Mobile (375x667) | ✅❌ | e2e-responsive-mobile.png |

Accessibility Snapshot: ✅❌

Issues:
- <issue1>
- <issue2>

CATEGORY_SCORE: <score>/100
```

---

## Scoring

| Kriterium | Gewichtung |
|-----------|------------|
| Main Flow funktioniert | 40% |
| Sprachumschaltung korrekt | 15% |
| Responsive korrekt | 25% |
| Accessibility Snapshot OK | 20% |

| Score | Status |
|-------|--------|
| 90-100 | ✅ Bestanden |
| 70-89 | ⚠️ Warnungen |
| <70 | ❌ Fehler |

---

## Fehlerbehandlung

- **Dev Server nicht erreichbar:** Fehler melden, Score = 0
- **Playwright MCP nicht verfügbar:** Fehler melden, Score = 0
- **Screenshot fehlgeschlagen:** Issue dokumentieren, Szenario als ❌
- **Element nicht gefunden:** Issue dokumentieren mit Selector
- **Timeout:** Issue dokumentieren, Szenario als ⚠️
