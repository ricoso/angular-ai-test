# Claude Code Commands

## Requirement Workflow

| Command | Description |
|---------|-------------|
| `/create-requirement REQ-XXX-Name` | Branch, Template, PR erstellen |
| `/implement-requirement REQ-XXX-Name` | Vollstaendige Implementierung (10 Steps) |
| `/check-requirement REQ-XXX-Name` | Requirement-Vollstaendigkeit pruefen |

## Quality Checks (Einzeln)

| Command | Description |
|---------|-------------|
| `/check-architecture` | Container/Presentational, Store Pattern |
| `/check-stores` | NgRx Signal Store Conventions |
| `/check-routing` | Lazy Loading, Guards, Resolvers |
| `/check-security` | OWASP, Sanitization, Guards |
| `/check-eslint` | ESLint Flat Config Rules |
| `/check-typescript` | Strict Types, no `any` |
| `/check-performance` | OnPush, Lazy Loading, Signals |
| `/check-styling` | SCSS Variables, BEM, WCAG 2.1 AA |
| `/check-i18n` | Type-safe Keys, DE + EN |
| `/check-forms` | Reactive Forms, Validators |
| `/check-code-language` | English Code Language |
| `/check-e2e` | Playwright E2E Tests |
| `/check-documentation` | Feature Docs, Screenshots |

## Quality Checks (Gruppiert)

| Command | Description |
|---------|-------------|
| `/check-arch` | Architecture + Stores + Routing |
| `/check-quality` | ESLint + TypeScript + Performance |
| `/check-all <feature>` | Alle 13 Checks + `qualitaets.md` |

## Utilities

| Command | Description |
|---------|-------------|
| `/pre-generation-check` | Skill-Validierung vor Code-Generierung |
| `/fix-performance` | Performance-Probleme automatisch fixen |
