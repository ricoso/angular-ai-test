# Check Documentation Command

Generiert Feature-Dokumentation in allen konfigurierten Doc-Sprachen und prüft deren Qualität.

## Usage

```
$ARGUMENTS = <feature-name>
```

Example: `booking`

---

## Voraussetzungen

1. **Dev Server** muss laufen auf `http://localhost:4200`
2. **Playwright MCP** muss konfiguriert sein in `.claude/mcp-config.json`
3. **E2E Screenshots** sollten bereits existieren (aus `/check-e2e`)
   - Falls nicht vorhanden: Werden in diesem Schritt erstellt

---

## Konfiguration

- **Doc-Sprachen:** DE, EN (konfiguriert in CLAUDE.md unter `Doc-Sprachen`)
- **Template:** `docs/requirements/DOKU-TEMPLATE.md`
- **Output:** `docs/requirements/<REQ-ID>/feature-documentation-<lang>.md`

---

## Ablauf

### Schritt 1: Requirement + Template lesen

1. **Template lesen:** `docs/requirements/DOKU-TEMPLATE.md`
2. **Requirement lesen** (`docs/requirements/<REQ-ID>/requirement.md`):
   - Section 1: Overview → Feature-Beschreibung
   - Section 2: User Story → Benutzerkontext
   - Section 4: Main Flow → Benutzerführung (Schritte)
   - Section 11: UI/UX → Responsive, Accessibility
   - Section 14: Implementation → Technische Details

---

### Schritt 2: Vorhandene Screenshots prüfen

Prüfe ob E2E-Screenshots existieren in `docs/requirements/<REQ-ID>/screenshots/`:
- `e2e-step-*.png` — Main Flow Screenshots
- `e2e-responsive-*.png` — Responsive Screenshots

Falls **keine Screenshots vorhanden:**
1. Feature-Route ermitteln (wie in check-e2e)
2. Basis-Screenshots erstellen via Playwright MCP

---

### Schritt 3: Sprachspezifische Screenshots erstellen

Für JEDE konfigurierte Doc-Sprache (DE, EN):

```
1. browser_evaluate → localStorage.setItem('app-language', '<lang>')
2. browser_navigate → Feature-URL (http://localhost:4200/#/<route>)
3. browser_screenshot → Hauptansicht
   → Speichern als: doc-overview-<lang>.png
4. Für jeden Main Flow Step:
   a. Interaktion ausführen
   b. browser_screenshot → Step-Ansicht
      → Speichern als: doc-step-XX-<lang>.png
```

**Screenshots-Ordner:** `docs/requirements/<REQ-ID>/screenshots/`

**Namenskonvention:**
- `doc-overview-de.png` / `doc-overview-en.png`
- `doc-step-01-de.png` / `doc-step-01-en.png`
- `doc-step-02-de.png` / `doc-step-02-en.png`

---

### Schritt 4: Dokumentation generieren

Für JEDE Doc-Sprache eine eigene MD-Datei erstellen:

**Datei:** `docs/requirements/<REQ-ID>/feature-documentation-<lang>.md`

1. **Template** (`DOKU-TEMPLATE.md`) als Basis verwenden
2. **Alle Platzhalter** ausfüllen:
   - `<Feature-Name>` → Feature-Name in der jeweiligen Sprache
   - `<lang>` → Sprachcode (de/en)
   - Beschreibungen in der jeweiligen Sprache schreiben
   - Screenshot-Referenzen mit korrekten Dateinamen
3. **Benutzerführung:** Jeden Main Flow Step dokumentieren mit Screenshot
4. **Responsive Ansichten:** E2E-Screenshots referenzieren
5. **Barrierefreiheit:** Aus Accessibility Snapshot und Requirement
6. **Technische Details:** Route, Components, Store, Services

**Sprach-Konsistenz:**
- `feature-documentation-de.md` → ALLES auf Deutsch
- `feature-documentation-en.md` → ALLES auf Englisch
- KEINE Fremdsprache in Beschreibungen!

---

### Schritt 5: Qualitätsprüfung

Prüfe für jede generierte Dokumentation:

| Kriterium | Prüfung |
|-----------|---------|
| Main Flow vollständig | Alle Steps aus Section 4 dokumentiert |
| Screenshots vorhanden | Alle referenzierten PNGs existieren |
| Sprache konsistent | Keine Fremdsprache in Beschreibungen |
| Responsive Screenshots | Desktop + Tablet + Mobile vorhanden |
| Barrierefreiheit | Sektion ausgefüllt |
| Technische Details | Route, Component, Store korrekt |

---

### Schritt 6: Ergebnis-Report

```
DOCUMENTATION_RESULT:
check-documentation: <score>/100 [✅|⚠️|❌]

Generierte Dokumente:
| Sprache | Datei | Status |
|---------|-------|--------|
| DE | feature-documentation-de.md | ✅❌ |
| EN | feature-documentation-en.md | ✅❌ |

Dokumentations-Qualität:
- Alle Main Flow Steps dokumentiert: ✅❌
- Screenshots vorhanden + referenziert: ✅❌
- Sprache konsistent: ✅❌
- Responsive Screenshots vorhanden: ✅❌
- Barrierefreiheit dokumentiert: ✅❌
- Technische Details korrekt: ✅❌

Issues:
- <issue1>
- <issue2>

CATEGORY_SCORE: <score>/100
```

---

## Scoring

| Kriterium | Gewichtung |
|-----------|------------|
| Alle Doc-Sprachen generiert | 25% |
| Main Flow vollständig dokumentiert | 25% |
| Screenshots vorhanden + korrekt | 20% |
| Sprache konsistent (keine Fremdsprache) | 15% |
| Responsive + Accessibility dokumentiert | 15% |

| Score | Status |
|-------|--------|
| 90-100 | ✅ Bestanden |
| 70-89 | ⚠️ Warnungen |
| <70 | ❌ Fehler |

---

## Output-Struktur

```
docs/requirements/<REQ-ID>/
├── feature-documentation-de.md    # Doku Deutsch
├── feature-documentation-en.md    # Doku Englisch
└── screenshots/
    ├── e2e-step-01-*.png          # (aus check-e2e)
    ├── e2e-responsive-*.png       # (aus check-e2e)
    ├── doc-overview-de.png        # Doku-spezifisch
    ├── doc-overview-en.png
    ├── doc-step-01-de.png
    ├── doc-step-01-en.png
    └── ...
```

---

## Fehlerbehandlung

- **Dev Server nicht erreichbar:** Fehler melden, Screenshots überspringen, nur Text generieren
- **Playwright MCP nicht verfügbar:** Text-only Dokumentation, Screenshots als Platzhalter
- **Requirement nicht gefunden:** Fehler melden, Score = 0
- **Template nicht gefunden:** Standard-Struktur verwenden, Warnung ausgeben
