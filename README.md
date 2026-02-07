# Angular 21 Project

Angular 21 Enterprise Template mit Signal Store, Jest Testing und Material UI.

---

## Quick Start

```bash
npm install
npm run mcp:setup    # MCP Server installieren
npm start            # http://localhost:4200
```

---

## Scripts

```bash
# Development
npm start              # Dev Server
npm run build          # Production Build

# Tests
npm test               # Jest Watch
npm run test:ci        # CI Mode
npm run test:coverage  # Coverage Report

# Code Quality
npm run lint           # ESLint
npm run lint:fix       # ESLint Auto-fix
npm run type-check     # TypeScript Check
npm run format         # Prettier

# MCP
npm run mcp:setup      # Setup MCP Servers
npm run mcp:check      # Check MCP Status
```

---

## Project Structure

```
src/app/
├── core/              # Guards, Interceptors
├── shared/            # Reusable Components, Pipes, Directives
├── features/          # Feature Modules
│   └── [feature]/
│       ├── components/
│       ├── services/
│       ├── store/
│       └── models/
└── app.routes.ts
```

---

## Tech Stack

| Kategorie | Technologie |
|-----------|-------------|
| Framework | Angular 21 |
| State | NgRx Signal Store |
| UI | Angular Material 21 |
| Testing | Jest 30 |
| i18n | ngx-translate |

---

## Documentation

- **CLAUDE.md** - Architektur-Regeln & Workflow
- **.claude/skills/** - Detaillierte Guidelines
- **docs/requirements/** - Specs & Requirements

---

## License

MIT
