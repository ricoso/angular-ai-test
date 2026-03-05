# Qualitätsbericht: REQ-009-carinformation

**Generiert:** 2026-03-04
**Feature:** carinformation
**Gesamtscore:** PENDING — Tests not yet executed (Bash permission required)

---

## Übersicht

| Kategorie | Score | Status |
|-----------|-------|--------|
| Architecture | — | PENDING |
| Security | — | PENDING |
| Quality | — | PENDING |
| Feature Checks | — | PENDING |
| E2E Testing | — | PENDING |
| Documentation | — | PENDING |

---

## 🧪 E2E Testing

### check-e2e
**Status:** PENDING — Awaiting test execution

**Playwright Test-Dateien:**
| Datei | Tests | Status |
|-------|-------|--------|
| `playwright/REQ-009-carinformation.spec.ts` | 23 Tests | PENDING |

**REQ-009 Test-Szenarien (23 Tests erstellt):**

| Kategorie | Tests | Abgedeckte ACs / TCs |
|-----------|-------|----------------------|
| Exception Flows (Guard-Test) | 1 Test | TC-7: Direct access -> redirect |
| Main Flow | 5 Tests | AC-1, AC-2, AC-3 (Banner, Formulare, Checkbox) |
| Test Cases | 7 Tests | TC-2, TC-3, TC-4, TC-5, TC-6, AC-5, AC-12 |
| i18n | 4 Tests | DE/EN Labels, Button-Texte |
| Accessibility | 5 Tests | aria-label, fieldset legend |
| Responsive Layout | 3 Tests | AC-17 Desktop/Tablet/Mobile |
| Alternative Flows | 2 Tests | AF-5.1, AF-5.3 (Click-Dummy) |

**Viewports geplant:**
| Viewport | Tests |
|----------|-------|
| Desktop (1280x720) | chromium-desktop |
| Tablet (768x1024) | responsive test |
| Mobile (375x667) | responsive test |

---

### Test-Datei: `playwright/REQ-009-carinformation.spec.ts`

Erstellt am 2026-03-04. Beinhaltet Szenarien aus requirement.md Section 6 (Exception Flows), Section 4 (Main Flow), Section 5 (Alternative Flows) und Section 13 (Test Cases).

**Wichtige Szenarien:**
- **Guard-Test:** Direktzugriff `/#/home/carinformation` ohne Store-Daten -> Redirect (TC-7, Section 6.1)
- **Banner-Test:** Returning-Customer-Banner sichtbar mit "Jetzt Daten abrufen!" Button (AC-2)
- **Formular-Anzeige:** customer-form und vehicle-form sichtbar (AC-1 bis AC-12)
- **Privacy-Checkbox:** Submit ohne Consent zeigt Fehlermeldung (AC-13, TC-6)
- **Navigation:** Back-Button navigiert zurück zur Appointment-Seite (TC-9)
- **Responsive:** Mobile 375px + Tablet 768px Layout-Tests (AC-17)
- **i18n:** DE und EN Texte korrekt übersetzt
- **Accessibility:** aria-label auf Buttons, Fieldset-Legenden vorhanden

---

### Screenshot-Konfiguration

`playwright/take-screenshots.js` um Eintrag `REQ-009-carinformation` erweitert:
- Route: `/home/carinformation`
- Setup: Vollständiger Wizard-Flow (Brand -> Location -> Services -> Notes -> Appointment -> CarInfo)
- Viewports: Desktop (1280x720), Tablet (768x1024), Mobile (375x667)

**Screenshots-Verzeichnis:** `docs/requirements/REQ-009-carinformation/screenshots/`

---

## Akzeptanzkriterien-Abdeckung durch E2E-Tests

| AC | Beschreibung | Test | Status |
|----|-------------|------|--------|
| AC-1 | Überschrift angezeigt | TC-1 (getPageTitle) | PENDING |
| AC-2 | Banner "Schon einmal bei uns gewesen?" mit Button | TC-2 (returning-banner) | PENDING |
| AC-3 | Pflichtfeld-Hinweis vorhanden | AC-3 (required-hint) | PENDING |
| AC-5 | Anrede-Dropdown zeigt Herr/Frau | AC-5 (salutation options) | PENDING |
| AC-12 | FIN maxlength="17", Info-Link | TC-3, TC-4 (vin checks) | PENDING |
| AC-13 | DSGVO-Checkbox Pflichtfeld — Submit ohne Häkchen blockiert | TC-5, TC-6 | PENDING |
| AC-17 | Mobile Layout einspaltig | Responsive tests | PENDING |
| TC-7 | Guard-Redirect ohne Appointment | Guard-Test | PENDING |
| TC-9 | Zurück-Button navigiert zurück | Navigation test | PENDING |

---

## Hinweise zur Ausführung

Um die Tests auszuführen (Dev-Server muss auf http://localhost:4200 laufen):

```bash
# E2E-Tests ausführen
npx playwright test playwright/REQ-009-carinformation.spec.ts --project=chromium-desktop

# Screenshots erstellen
node playwright/take-screenshots.js REQ-009-carinformation
```

---

## Changelog

| Datum | Score | Änderungen |
|-------|-------|------------|
| 2026-03-04 | PENDING | Test-Datei erstellt, qualitaets.md angelegt |
