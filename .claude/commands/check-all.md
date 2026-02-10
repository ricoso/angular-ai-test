# Check All Command (Parallel Agent-System)

Orchestriert 4 spezialisierte Agents zur parallelen Ausführung aller 11 Checks.

## Usage

```
$ARGUMENTS = <feature-name>
```

Example: `user-management`

---

## WICHTIG: Agent-Orchestrierung

Du bist der **Orchestrator**. Führe die folgenden Schritte EXAKT aus:

### Schritt 1: Starte 4 Agents PARALLEL

Verwende das `Task`-Tool mit `subagent_type: "general-purpose"` und starte **ALLE 4 Agents in EINEM Tool-Aufruf** (parallel):

#### Agent 1: Architecture Checks
```
Prompt: "Analysiere das Feature '$ARGUMENTS' und führe folgende Architektur-Checks durch:

1. **check-architecture**: Container/Presentational Pattern
   - Prüfe: 1 Route = 1 Container + Presentational Children
   - Container: inject(Store), OnPush, Event Handler (onXxx())
   - Presentational: input(), output() only, KEIN Store

2. **check-stores**: NgRx Signal Store Pattern
   - Prüfe: withState, withComputed, withMethods, withHooks
   - State: items[], loading, error
   - KEIN onInit für Feature-Daten (Resolver!)

3. **check-routing**: Routing Patterns
   - Prüfe: Lazy Loading, Route Resolver, Functional Guards
   - ResolveFn<void>, input() für Route Params

Suche nach Dateien in src/app/features/$ARGUMENTS/**/*.ts

Gib für jeden Check zurück:
- Score (0-100)
- Liste der gefundenen Issues mit Datei:Zeile
- Kategorie-Gesamtscore

Format:
ARCHITECTURE_RESULT:
check-architecture: <score>/100 [✅|⚠️|❌]
  - <issue1>
check-stores: <score>/100 [✅|⚠️|❌]
  - <issue1>
check-routing: <score>/100 [✅|⚠️|❌]
  - <issue1>
CATEGORY_SCORE: <avg>/100"
```

#### Agent 2: Quality Checks
```
Prompt: "Analysiere das Feature '$ARGUMENTS' und führe folgende Quality-Checks durch:

1. **check-eslint**: ESLint Rules
   - Import Order (Angular → Third Party → Local)
   - Naming Conventions (camelCase, PascalCase)
   - Unused imports

2. **check-typescript**: Type Safety
   - KEIN any Type (nutze unknown)
   - Explicit Return Types
   - Interfaces in models/

3. **check-performance**: Performance
   - OnPush bei ALLEN Components
   - @for mit track item.id
   - computed() statt Methoden im Template
   - KEINE Methoden-Aufrufe im Template

4. **check-styling**: SCSS & Accessibility
   - em/rem statt px
   - BEM Naming
   - WCAG 2.1 AA Compliance
   - Focus-Styles, Kontrast

Suche nach Dateien in src/app/features/$ARGUMENTS/**/*

Gib für jeden Check zurück:
- Score (0-100)
- Liste der gefundenen Issues mit Datei:Zeile
- Kategorie-Gesamtscore

Format:
QUALITY_RESULT:
check-eslint: <score>/100 [✅|⚠️|❌]
  - <issue1>
check-typescript: <score>/100 [✅|⚠️|❌]
  - <issue1>
check-performance: <score>/100 [✅|⚠️|❌]
  - <issue1>
check-styling: <score>/100 [✅|⚠️|❌]
  - <issue1>
CATEGORY_SCORE: <avg>/100"
```

#### Agent 3: Security Check
```
Prompt: "Analysiere das Feature '$ARGUMENTS' und führe einen vollständigen Security-Check durch:

**check-security**: Security Audit

1. XSS Prevention
   - KEIN [innerHTML] ohne DomSanitizer
   - KEIN bypassSecurityTrustHtml() mit User-Input
   - KEINE eval() oder Function()

2. Authentication & Authorization
   - JWT in HttpOnly Cookies (NICHT localStorage!)
   - Route Guards für geschützte Routes
   - Role-Based Access Control

3. Sensitive Data
   - KEINE Passwörter/Tokens in localStorage
   - KEINE sensiblen Daten in URL-Parametern
   - KEINE console.log() mit sensiblen Daten
   - KEINE Credentials im Source Code

4. HTTP Security
   - HTTPS only
   - CSRF Token Handling

5. Input Validation
   - Client-Side Validators vorhanden
   - Sanitization für HTML-Content

Suche nach Dateien in src/app/features/$ARGUMENTS/**/*

Gib zurück:
- Score (0-100)
- Liste der gefundenen Security Issues mit Severity (CRITICAL/HIGH/MEDIUM/LOW)
- Datei:Zeile für jedes Issue

Format:
SECURITY_RESULT:
check-security: <score>/100 [✅|⚠️|❌]
  - [CRITICAL] <issue1> (datei:zeile)
  - [HIGH] <issue2> (datei:zeile)
  - [MEDIUM] <issue3> (datei:zeile)
CATEGORY_SCORE: <score>/100"
```

#### Agent 4: Feature Checks (i18n, Forms, Code Language)
```
Prompt: "Analysiere das Feature '$ARGUMENTS' und führe folgende Feature-Checks durch:

1. **check-i18n**: Internationalization
   - ALLE Texte mit {{ 'key' | translate }}
   - KEINE hardcoded Strings in Templates
   - Key-Naming: {feature}.{type}.{name}

2. **check-forms**: Reactive Forms
   - Reactive Forms (FormGroup, FormControl)
   - Typed Forms mit Generics
   - Validators im Component
   - KEIN ngModel

3. **check-code-language**: Code Language
   - Prüfe ob Requirement in DE oder EN
   - Deutsche REQ: beimAbsenden(), ladeBenutzer()
   - Englische REQ: onSubmit(), loadUsers()

Suche nach Dateien in src/app/features/$ARGUMENTS/**/*

Gib für jeden Check zurück:
- Score (0-100)
- Liste der gefundenen Issues mit Datei:Zeile
- Kategorie-Gesamtscore

Format:
FEATURE_RESULT:
check-i18n: <score>/100 [✅|⚠️|❌]
  - <issue1>
check-forms: <score>/100 [✅|⚠️|❌]
  - <issue1>
check-code-language: <score>/100 [✅|⚠️|❌]
  - <issue1>
CATEGORY_SCORE: <avg>/100"
```

---

### Schritt 2: Sammle Ergebnisse

Warte auf alle 4 Agents und sammle deren Ergebnisse.

---

### Schritt 3: Berechne Gesamtscore

Gewichtung:
| Kategorie | Gewichtung |
|-----------|------------|
| Architecture | 25% |
| Security | 25% |
| Quality | 25% |
| Feature (i18n, Forms, Language) | 25% |

---

### Schritt 4: Erstelle konsolidierten Report

Gib den Report in folgendem Format aus:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 FULL CHECK: $ARGUMENTS (PARALLEL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📐 ARCHITECTURE (3 checks)
   [status] check-architecture: XX/100
   [status] check-stores: XX/100
   [status] check-routing: XX/100

🔒 SECURITY
   [status] check-security: XX/100

📝 QUALITY (4 checks)
   [status] check-eslint: XX/100
   [status] check-typescript: XX/100
   [status] check-performance: XX/100
   [status] check-styling: XX/100

🌍 FEATURE CHECKS (3 checks)
   [status] check-i18n: XX/100
   [status] check-forms: XX/100
   [status] check-code-language: XX/100

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 GESAMT: XX/100

[Falls Issues vorhanden:]
⚠️ X Warnings:
   - datei:zeile - Issue description

❌ X Errors:
   - datei:zeile - Issue description

[Status basierend auf Score:]
✅ Ready for PR          (Score >= 90, keine ❌)
⚠️ Review empfohlen      (Score 70-89)
❌ Nicht bereit          (Score < 70 oder kritische Fehler)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Status-Bedeutung

| Status | Score | Symbol |
|--------|-------|--------|
| Bestanden | 90-100 | ✅ |
| Warnungen | 70-89 | ⚠️ |
| Fehler | <70 | ❌ |

---

## Fehlerbehandlung

Falls ein Agent fehlschlägt:
1. Dokumentiere den Fehler im Report
2. Zeige "N/A" für den fehlgeschlagenen Check
3. Berechne Gesamtscore ohne fehlgeschlagene Kategorie
4. Empfehle manuelle Prüfung

---

## Einzelne Checks

Für granulare Kontrolle können einzelne Checks separat ausgeführt werden:

```
/check-architecture <feature>
/check-security <feature>
/check-eslint <feature>
... etc.
```

## Gruppierte Checks

```
/check-arch <feature>     # Architecture + Stores + Routing
/check-quality <feature>  # ESLint + TypeScript + Performance + Styling
```
