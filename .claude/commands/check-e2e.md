# Check E2E Command (Lokaler Playwright)

Testet ein Feature via lokaler Playwright Test-Suite und erstellt/erweitert persistente Test-Dateien.

> ⛔ **NIEMALS ÜBERSPRINGEN!** Dieser Check nutzt die **lokale Playwright CLI** (`npx playwright test`).
> Er ist NICHT abhängig vom Playwright MCP-Server. Auch wenn kein MCP konfiguriert ist,
> MUSS dieser Check vollständig ausgeführt werden (ALLE Schritte 1–8 sind PFLICHT).
> Screenshots werden via Playwright Test-Suite (`page.screenshot()`) erstellt — KEIN MCP noetig!

## Usage

```
$ARGUMENTS = <feature-name>
```

Example: `booking`

---

## Voraussetzungen

1. **@playwright/test** als devDependency installiert (package.json)
2. **Chromium** installiert:
   ```bash
   npx playwright install chromium
   ```
3. **Dev Server** wird automatisch via `playwright.config.ts` gestartet

---

## Ablauf

### Schritt 1: Requirement + Testszenarien lesen

1. Ermittle REQ-ID aus Feature-Name
2. Lese `docs/requirements/<REQ-ID>/requirement.md`
3. Extrahiere Testszenarien aus:
   - **Section 4:** Main Flow
   - **Section 5:** Alternative Flows
   - **Section 6:** Exception Flows
   - **Section 13:** Test Cases

---

### Schritt 2: Bestehende Tests pruefen

1. Pruefe ob bereits Playwright-Tests existieren:
   ```
   playwright/REQ-XXX-*.spec.ts
   playwright/workflow-*.spec.ts
   ```
2. Falls ja: Tests ERWEITERN (nicht ueberschreiben!)
3. Falls nein: Neue Test-Datei erstellen

---

### Schritt 3: Test-Datei erstellen/erweitern

**Datei-Konvention:**
```
playwright/
├── helpers/
│   ├── app.helpers.ts          # Shared: Navigation, Language, Screenshots
│   └── booking.helpers.ts      # Feature-spezifische Helpers
├── REQ-001-header.spec.ts      # REQ-001 Tests
├── REQ-002-brand-selection.spec.ts  # REQ-002 Tests
├── REQ-003-location-selection.spec.ts # REQ-003 Tests
└── workflow-booking-complete.spec.ts  # Gesamtworkflow
```

**Jede REQ-Testdatei MUSS enthalten:**

```typescript
test.describe('REQ-XXX: Feature Name', () => {

  // 1. Main Flow (Section 4)
  test.describe('Main Flow', () => {
    // Tests fuer jeden Step des Main Flow
  });

  // 2. Test Cases (Section 13)
  test.describe('Test Cases', () => {
    // TC-1, TC-2, TC-3, etc.
  });

  // 3. Alternative Flows (Section 5)
  test.describe('Alternative Flows', () => {
    // 5.1, 5.2, etc.
  });

  // 4. Exception Flows (Section 6)
  test.describe('Exception Flows', () => {
    // 6.1, 6.2, etc.
  });

  // 5. i18n (Sprachumschaltung)
  test.describe('i18n', () => {
    // DE + EN Tests
  });

  // 6. Accessibility
  test.describe('Accessibility', () => {
    // WCAG 2.1 AA Tests
  });

  // 7. Responsive
  test.describe('Responsive Layout', () => {
    // Desktop, Tablet, Mobile
  });

});
```

**Workflow-Testdatei erweitern bei jedem neuen REQ:**
```typescript
test.describe('Complete Booking Workflow', () => {
  // Happy Path (Start -> Brand -> Location -> Services -> ...)
  // Alternative Flows (Back navigation, brand switch)
  // Exception Flows & Guards
  // i18n through complete flow
  // Header persistence across pages (REQ-001)
});
```

---

### Schritt 4: Helpers erweitern

Wenn neue Features neue Aktionen erfordern:
1. Pruefe `playwright/helpers/booking.helpers.ts`
2. Fuege neue Helper-Funktionen hinzu (z.B. `selectService()`, `goToServiceSelection()`)
3. Exportiere sie fuer Nutzung in Tests und Workflow

**Wichtig bei Language-Tests:**
- App-Default ist Browser-Language (meist EN im Test)
- `setLanguage(page, 'de')` IMMER VOR `selectBrand()` aufrufen wenn DE erwartet wird
- `setLanguage()` macht Reload -> Store-State geht verloren -> danach Brand neu waehlen

---

### Schritt 5: Tests ausfuehren

```bash
# Alle Tests (3 Viewports: Desktop, Tablet, Mobile)
npm run e2e

# Nur Desktop
npx playwright test --project=chromium-desktop

# Einzelne Datei
npx playwright test --project=chromium-desktop playwright/REQ-003-location-selection.spec.ts

# Mit UI
npm run e2e:ui

# Report anzeigen
npm run e2e:report
```

Falls Tests fehlschlagen: Issues dokumentieren und fixen.

---

### Schritt 6: Screenshots fuer Dokumentation (PFLICHT — via Playwright Test-Suite!)

> ⛔ **PFLICHT!** Screenshots werden via `page.screenshot()` in der Playwright Test-Suite erstellt.
> **KEIN MCP-Server noetig!** Der `saveScreenshot()` Helper in `playwright/helpers/app.helpers.ts` wird genutzt.
> **KEINE alten Mockups** oder manuell erstellte Bilder in der Dokumentation verwenden!
> Alle Screenshots muessen den tatsaechlichen, aktuellen Stand der Anwendung zeigen.

**Alle 3 Viewports sind PFLICHT:**

```
docs/requirements/<REQ-ID>/screenshots/
├── e2e-responsive-desktop.png    # PFLICHT (1280x720)
├── e2e-responsive-tablet.png     # PFLICHT (768x1024)
└── e2e-responsive-mobile.png     # PFLICHT (375x667)
```

**Vorgehen — Screenshot-Test erstellen/erweitern:**

1. In der REQ-Testdatei (z.B. `playwright/REQ-003-location-selection.spec.ts`) eine eigene Test-Describe-Section fuer Screenshots hinzufuegen:

```typescript
import { saveScreenshot } from './helpers/app.helpers';

test.describe('Screenshots', () => {
  const REQ_ID = 'REQ-003-Standortwahl';

  test('responsive screenshots', async ({ page }) => {
    // Setup: Navigate to feature page (ggf. Vorbedingungen erfuellen)
    await selectBrand(page, 'Audi');
    await waitForAngular(page);

    // Desktop (1280x720) — Default Viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await saveScreenshot(page, REQ_ID, 'e2e-responsive-desktop');

    // Tablet (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    await saveScreenshot(page, REQ_ID, 'e2e-responsive-tablet');

    // Mobile (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    await saveScreenshot(page, REQ_ID, 'e2e-responsive-mobile');
  });

  test('step screenshots', async ({ page }) => {
    // Step 1: Ausgangszustand (z.B. Standortauswahl geladen)
    await selectBrand(page, 'Audi');
    await waitForAngular(page);
    await saveScreenshot(page, REQ_ID, 'e2e-step-01-overview');

    // Step 2: Aktion ausgefuehrt (z.B. Standort gewaehlt)
    await selectLocation(page, 'München');
    await waitForAngular(page);
    await saveScreenshot(page, REQ_ID, 'e2e-step-02-selected');
  });
});
```

2. **Screenshots werden beim Testlauf automatisch gespeichert** unter:
   `docs/requirements/<REQ-ID>/screenshots/`

3. **Screenshot-Helper** (bereits in `playwright/helpers/app.helpers.ts`):
```typescript
export async function saveScreenshot(page, reqId, name): Promise<void> {
  await page.screenshot({
    path: `docs/requirements/${reqId}/screenshots/${name}.png`,
    fullPage: true,
  });
}
```

4. Nach dem Testlauf: Screenshots in Feature-Dokumentation referenzieren:
   - `feature-documentation-de.md` und `feature-documentation-en.md`

> ⛔ **KEINE Mockups!** Nur echte Playwright-Screenshots sind in der Doku erlaubt.
> Falls alte Mockup-Dateien im Screenshots-Ordner liegen, diese NICHT referenzieren.

---

### Schritt 7: Ergebnisse in qualitaets.md eintragen (PFLICHT!)

> ⛔ **IMMER ausfuehren!** Playwright-Ergebnisse MUESSEN in `qualitaets.md` dokumentiert werden.

1. **Ermittle REQ-ID** aus Feature-Name (z.B. `location-selection` → `REQ-003-Standortwahl`)
2. **Lese/Erstelle:** `docs/requirements/<REQ-ID>/qualitaets.md`
   - Falls Datei existiert: NUR die E2E-Sektion aktualisieren
   - Falls Datei nicht existiert: Aus `QUALITAETS-TEMPLATE.md` erstellen (andere Sektionen leer lassen)
3. **Fuege ein/aktualisiere die Sektion `## 🧪 E2E Testing (Playwright — Lokale Test-Suite)`:**

   Pflichtinhalte:
   - **Playwright Test-Dateien:** Tabelle mit allen Spec-Dateien, Anzahl Tests, Status (passed/failed)
   - **REQ-XXX Test-Szenarien:** Aufschluesselung nach Kategorie (Main Flow, Test Cases, Alternative Flows, Exception Flows, i18n, Accessibility, Responsive)
   - **Workflow-Tests:** Falls `workflow-*.spec.ts` existiert — Aufschluesselung nach Kategorie
   - **Viewports:** Desktop, Tablet, Mobile mit Anzahl Tests und Status
   - **Issues:** Alle fehlgeschlagenen Tests oder bekannte Probleme

4. **Aktualisiere den Changelog** am Ende der `qualitaets.md`
5. **Aktualisiere die Uebersicht-Tabelle** (Kategorie E2E Testing Score + Status)

**Beispiel-Eintrag fuer qualitaets.md:**
```markdown
## 🧪 E2E Testing (Playwright — Lokale Test-Suite)

### check-e2e
**Score:** 98/100 ✅

**Playwright Test-Dateien:**
| Datei | Tests | Status |
|-------|-------|--------|
| `playwright/REQ-003-location-selection.spec.ts` | 24 Tests | ✅ 24/24 passed |
| `playwright/workflow-booking-complete.spec.ts` | 14 Tests | ✅ 14/14 passed |

**REQ-003 Test-Szenarien (24 Tests):**
| Kategorie | Tests | Status |
|-----------|-------|--------|
| Main Flow (Section 4) | TC-1, TC-1b, TC-1c, TC-2, TC-2b | ✅ 5/5 |
| Test Cases (Section 13) | TC-3, TC-4, TC-4b, TC-4c, TC-4d | ✅ 5/5 |
| ...

**Viewports:**
| Viewport | Tests | Status |
|----------|-------|--------|
| Desktop (1280x720) | 73 passed | ✅ |
```

---

### Schritt 8: Ergebnis-Report (Konsole)

```
E2E_RESULT:
check-e2e: <score>/100 [✅|⚠️|❌]

Playwright Test Files:
| Datei | Tests | Status |
|-------|-------|--------|
| REQ-XXX-*.spec.ts | X tests | ✅❌ |
| workflow-*.spec.ts | X tests | ✅❌ |

Viewports:
| Viewport | Tests | Status |
|----------|-------|--------|
| Desktop (1280x720) | X passed | ✅❌ |
| Tablet (768x1024) | X passed | ✅❌ |
| Mobile (375x667) | X passed | ✅❌ |

qualitaets.md: ✅ aktualisiert (docs/requirements/<REQ-ID>/qualitaets.md)

Issues:
- <issue1>
- <issue2>

CATEGORY_SCORE: <score>/100
```

---

## Scoring

| Kriterium | Gewichtung |
|-----------|------------|
| Test-Dateien erstellt/erweitert | 30% |
| Alle Tests bestanden (Desktop) | 30% |
| Alle Tests bestanden (Tablet + Mobile) | 20% |
| Test Coverage (Main Flow + Alt Flows + Exceptions) | 20% |

| Score | Status |
|-------|--------|
| 90-100 | ✅ Bestanden |
| 70-89 | ⚠️ Warnungen |
| <70 | ❌ Fehler |

---

## Fehlerbehandlung

- **Dev Server nicht erreichbar:** playwright.config.ts startet ihn automatisch
- **Test fehlschlagen:** Fehler im Report dokumentieren, fixen, erneut ausfuehren
- **Timeout:** Timeouts in playwright.config.ts anpassen
- **localStorage SecurityError:** Sicherstellen dass Seite geladen ist bevor setLanguage()
