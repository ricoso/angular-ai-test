# Projekt Setup

**Trigger:** Neues Projekt / Setup noch nicht ausgeführt

## Schritt 1: User fragen

Stelle diese 3 Fragen (AskUserQuestion):

**Q1 — Deployment:** Click-Dummy oder Production?
**Q2 — Code-Sprache:** Deutsch oder Englisch? _(projektfixiert, REQ-Sprache irrelevant)_
**Q3 — UI-Sprachen:** Welche? (Mehrfachauswahl: `de`, `en`, `fr`, `es` — min. 2)

## Schritt 2: Vorgaben in Skills schreiben

Ersetze `<!-- SETUP:VORGABE -->` in jedem Skill mit dem passenden Block.

### 2a. `routing-patterns.md`

**Click-Dummy →**
```
- Deployment: Click-Dummy (GitHub Pages)
- HashLocation: AKTIV (`withHashLocation()`)
- URL: `https://<user>.github.io/<repo>/#/<route>`
- CI: `.github/workflows/deploy-gh-pages.yml`
```

**Production →**
```
- Deployment: Production (SSR)
- HashLocation: DEAKTIVIERT
- SSR: `@angular/ssr` aktiv
- Server: Node.js / Docker / Cloud Run
```

### 2b. `angular-architecture.md`

**Click-Dummy →**
```
- Typ: Click-Dummy (kein Backend, kein SSR)
- API Services: Mock-Daten / lokale JSON
- Auth: Keine (oder simuliert)
```

**Production →**
```
- Typ: Production (SSR)
- API Services: Backend-APIs (HTTPS only)
- Auth: JWT in HttpOnly Cookies
- SSR: `isPlatformBrowser()` bei DOM-Zugriff
```

### 2c. `security.md`

**Click-Dummy →**
```
- Typ: Click-Dummy (Static Hosting)
- Keine Server-Side Security
- localStorage OK für Demo-Daten
```

**Production →**
```
- Typ: Production (Server Deployment)
- HTTPS: PFLICHT
- CSRF: HttpClient XSRF aktiv
- JWT: HttpOnly Cookies (NICHT localStorage!)
- Headers: CSP, X-Frame-Options, HSTS
- Secrets: NUR `.env` (in `.gitignore`)
```

### 2d. `code-language.md`

**Deutsch →**
```
- Code-Sprache: Deutsch (FIXIERT)
- REQ-Sprache irrelevant → Code IMMER Deutsch
```

**Englisch →**
```
- Code-Sprache: Englisch (FIXIERT)
- REQ-Sprache irrelevant → Code IMMER Englisch
```

### 2e. `i18n-typings.md`

Dynamisch je nach Q3-Auswahl:
```
- UI-Sprachen: {ausgewählte Sprachen kommagetrennt}
- Default: erste ausgewählte Sprache
- ALLE Sprachen PFLICHT bei jedem Feature
```

## Schritt 3: CLAUDE.md Projekt-Info

Zeilen setzen:
```
- **Deployment**: {Click-Dummy (GitHub Pages, HashLocation) | Production (SSR, Node.js)}
- **Code-Sprache**: {Deutsch | Englisch}
- **UI-Sprachen**: {z.B. DE, EN, FR}
```

## Schritt 4: Code

**Click-Dummy → `app.config.ts`:**
```typescript
import { provideRouter, withHashLocation } from '@angular/router';
providers: [provideRouter(routes, withHashLocation())]
```

**Production → `app.config.ts`:**
```typescript
providers: [provideRouter(routes)]
```

**Production → SSR:** `ng add @angular/ssr`

## Schritt 5: CI/CD

**Click-Dummy:** `.github/workflows/deploy-gh-pages.yml`
**Production:** Docker / Cloud Run

## Checklist

- [ ] Q1–Q3 beantwortet
- [ ] 5 Skills → `<!-- SETUP:VORGABE -->` ersetzt
- [ ] CLAUDE.md → Projekt-Info gesetzt
- [ ] `app.config.ts` konfiguriert
- [ ] CI/CD eingerichtet
