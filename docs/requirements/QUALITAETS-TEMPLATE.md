# Qualitätsbericht: REQ-XXX-Name

**Generiert:** YYYY-MM-DD HH:MM
**Feature:** feature-name
**Gesamtscore:** XX/100 [✅|⚠️|❌]

---

## Übersicht

| Kategorie | Score | Status |
|-----------|-------|--------|
| Architecture | XX/100 | ✅⚠️❌ |
| Security | XX/100 | ✅⚠️❌ |
| Quality | XX/100 | ✅⚠️❌ |
| Feature Checks | XX/100 | ✅⚠️❌ |
| E2E Testing | XX/100 | ✅⚠️❌ |
| Documentation | XX/100 | ✅⚠️❌ |

---

## 📐 Architecture (25%)

### check-architecture
**Score:** XX/100 [✅|⚠️|❌]

- Container/Presentational Pattern: ✅❌
- 1 Route = 1 Container: ✅❌
- Container: inject(Store), OnPush: ✅❌
- Presentational: input()/output() only: ✅❌

**Issues:**
- _Keine Issues gefunden_ / Liste der Issues

### check-stores
**Score:** XX/100 [✅|⚠️|❌]

- withState, withComputed, withMethods: ✅❌
- State: items[], loading, error: ✅❌
- KEIN onInit für Feature-Daten: ✅❌
- Public Interface definiert: ✅❌

**Issues:**
- _Keine Issues gefunden_ / Liste der Issues

### check-routing
**Score:** XX/100 [✅|⚠️|❌]

- Lazy Loading: ✅❌
- Route Resolver mit RxMethod: ✅❌
- ResolveFn<void>: ✅❌
- input() für Route Params: ✅❌

**Issues:**
- _Keine Issues gefunden_ / Liste der Issues

---

## 🔒 Security (25%)

### check-security
**Score:** XX/100 [✅|⚠️|❌]

**XSS Prevention:**
- Kein [innerHTML] ohne DomSanitizer: ✅❌
- Kein bypassSecurityTrustHtml() mit User-Input: ✅❌
- Keine eval() oder Function(): ✅❌

**Sensitive Data:**
- Keine Passwörter/Tokens in localStorage: ✅❌
- Keine sensiblen Daten in URL-Parametern: ✅❌
- Keine console.log() mit sensiblen Daten: ✅❌
- Secrets nur in `.env`: ✅❌
- `.env` in `.gitignore`: ✅❌

**HTTP Security:**
- HTTPS only: ✅❌
- CSRF Token Handling: ✅❌

**Issues:**
| Severity | Issue | Datei:Zeile |
|----------|-------|-------------|
| - | _Keine Issues_ | - |

---

## 📝 Quality (25%)

### check-eslint
**Score:** XX/100 [✅|⚠️|❌]

- Import Order korrekt: ✅❌
- Naming Conventions: ✅❌
- Keine unused imports: ✅❌

**Issues:**
- _Keine Issues gefunden_ / Liste der Issues

### check-typescript
**Score:** XX/100 [✅|⚠️|❌]

- Kein `any` Type: ✅❌
- Explicit Return Types: ✅❌
- Interfaces in models/: ✅❌

**Issues:**
- _Keine Issues gefunden_ / Liste der Issues

### check-performance
**Score:** XX/100 [✅|⚠️|❌]

- OnPush bei ALLEN Components: ✅❌
- @for mit track item.id: ✅❌
- computed() statt Methoden: ✅❌
- Keine Methoden im Template: ✅❌

**Issues:**
- _Keine Issues gefunden_ / Liste der Issues

### check-styling
**Score:** XX/100 [✅|⚠️|❌]

- em/rem statt px: ✅❌
- BEM Naming: ✅❌
- WCAG 2.1 AA: ✅❌
- Focus-Styles vorhanden: ✅❌
- Farbkontrast >= 4.5:1: ✅❌

**Issues:**
- _Keine Issues gefunden_ / Liste der Issues

---

## 🌍 Feature Checks (25%)

### check-i18n
**Score:** XX/100 [✅|⚠️|❌]

- Alle Texte mit translate pipe: ✅❌
- Keine hardcoded Strings: ✅❌
- DE Translations vorhanden: ✅❌
- EN Translations vorhanden: ✅❌
- Key-Naming korrekt: ✅❌

**Issues:**
- _Keine Issues gefunden_ / Liste der Issues

### check-forms
**Score:** XX/100 [✅|⚠️|❌] oder N/A

- Reactive Forms: ✅❌
- Typed Forms: ✅❌
- Validators im Component: ✅❌
- Kein ngModel: ✅❌

**Issues:**
- _Keine Issues gefunden_ / N/A (keine Forms)

### check-code-language
**Score:** XX/100 [✅|⚠️|❌]

- Requirement Sprache: DE/EN
- Code Sprache: DE/EN
- Match: ✅❌

**Issues:**
- _Keine Issues gefunden_ / Liste der Issues

---

## 🧪 Test Coverage

| Metrik | Wert | Ziel | Status |
|--------|------|------|--------|
| Statements | XX% | 80% | ✅⚠️❌ |
| Branches | XX% | 80% | ✅⚠️❌ |
| Functions | XX% | 80% | ✅⚠️❌ |
| Lines | XX% | 80% | ✅⚠️❌ |

---

## 🧪 E2E Testing (Playwright)

### check-e2e
**Score:** XX/100 [✅|⚠️|❌]

**Test-Szenarien:**
| # | Szenario | Status | Screenshot |
|---|----------|--------|------------|
| 1 | [Main Flow] | ✅❌ | [Screenshot](./screenshots/e2e-step-01-xxx.png) |

**Sprachumschaltung:**
| Sprache | Status | Screenshot |
|---------|--------|------------|
| DE | ✅❌ | [Screenshot](./screenshots/e2e-lang-de.png) |
| EN | ✅❌ | [Screenshot](./screenshots/e2e-lang-en.png) |

**Responsive Tests:**
| Viewport | Status | Screenshot |
|----------|--------|------------|
| Desktop (1280x720) | ✅❌ | [Link](./screenshots/e2e-responsive-desktop.png) |
| Tablet (768x1024)  | ✅❌ | [Link](./screenshots/e2e-responsive-tablet.png) |
| Mobile (375x667)   | ✅❌ | [Link](./screenshots/e2e-responsive-mobile.png) |

**Accessibility Snapshot:** ✅❌

**Issues:**
- _Keine Issues gefunden_ / Liste der Issues

---

## 📄 Feature Documentation

### check-documentation
**Score:** XX/100 [✅|⚠️|❌]

**Generierte Dokumente:**
| Sprache | Datei | Status |
|---------|-------|--------|
| DE | [feature-documentation-de.md](./feature-documentation-de.md) | ✅❌ |
| EN | [feature-documentation-en.md](./feature-documentation-en.md) | ✅❌ |

**Dokumentations-Qualität:**
- Alle UI-States dokumentiert: ✅❌
- Screenshots vorhanden: ✅❌
- Responsive Screenshots: ✅❌
- Barrierefreiheit dokumentiert: ✅❌

**Issues:**
- _Keine Issues gefunden_ / Liste der Issues

---

## Zusammenfassung

### Bestanden (✅)
- Check 1
- Check 2

### Warnungen (⚠️)
- _Keine Warnungen_ / Liste

### Fehler (❌)
- _Keine Fehler_ / Liste

---

## Empfehlung

**Status:** ✅ Ready for PR | ⚠️ Review empfohlen | ❌ Nicht bereit

**Begründung:**
- [Begründung für den Status]

**Nächste Schritte:**
- [ ] [Falls Issues: Aufgaben zur Behebung]
- [ ] PR erstellen (wenn ✅)

---

## Changelog

| Datum | Score | Änderungen |
|-------|-------|------------|
| YYYY-MM-DD | XX/100 | Initiale Prüfung |
