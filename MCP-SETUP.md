# MCP Server Setup

## Initial Setup (Nach dem Klonen)

```bash
# 1. Dependencies installieren
npm install

# 2. MCP Server installieren
npm run mcp:setup

# 3. MCP Status prüfen
npm run mcp:check
```

## Verfügbare MCP Server

### 1. Angular CLI (Offiziell) ⭐
**Type:** External (npx)
**Source:** `@angular/cli` (devDependency)
**Status:** Wird automatisch via npx geladen

**Tools:**
- `get_best_practices` - Angular Best Practices
- `search_documentation` - angular.dev Dokumentation durchsuchen
- Workspace-Analyse

**Docs:** https://angular.dev/ai/mcp

---

### 2. NgRx Signal Store
**Type:** Local
**Path:** `mcp/ngrx-signalstore/`
**Status:** ✓ Nach `npm run mcp:setup`

**Tools:**
- `get_pattern(pattern)` - basic-store, feature-store, entity-store
- `search_patterns(query)` - Pattern Suche
- `get_best_practice(topic)` - state-design, performance, testing
- `list_all_patterns()` - Alle Patterns anzeigen

**Beispiel:**
```
"Zeig mir das feature-store Pattern"
"Wie implementiere ich einen entity-store?"
```

---

### 3. Angular Material
**Type:** Local
**Path:** `mcp/angular-material/`
**Status:** ✓ Nach `npm run mcp:setup`

**Tools:**
- `get_component(component)` - button, dialog, table, form-field
- `list_components()` - Alle Components

**Beispiel:**
```
"Wie verwende ich Material Dialog?"
"Zeig mir Material Table Beispiele"
```

---

## Workflow

### Vor der Arbeit:

```bash
# Terminal 1: Dev Server
npm start

# Terminal 2: Tests (optional)
npm test

# Claude Code startet MCP Server automatisch
```

### MCP Server Nutzung in Claude:

```
# Angular Best Practices abfragen
"Zeig mir Angular Best Practices für Components"

# Signal Store Pattern
"Zeig mir das feature-store Pattern"

# Material Components
"Wie verwende ich Material Dialog?"

# Angular Docs durchsuchen
"Suche in der Angular Dokumentation nach Signals"
```

---

## Troubleshooting

### MCP Server nicht verfügbar

```bash
# 1. MCP neu installieren
npm run mcp:setup

# 2. Status prüfen
npm run mcp:check

# 3. @angular/cli Version prüfen
npm list @angular/cli
```

### Angular CLI MCP funktioniert nicht

```bash
# @angular/cli manuell testen
npx @angular/cli mcp
```

### Lokale MCP Server (ngrx/material) funktionieren nicht

```bash
# Dependencies neu installieren
cd mcp/ngrx-signalstore && npm install && cd ../..
cd mcp/angular-material && npm install && cd ../..
```

---

## MCP Konfiguration

Die MCP Server sind in `.claude/mcp-config.json` konfiguriert:

```json
{
  "mcpServers": {
    "ngrx-signalstore": {
      "command": "node",
      "args": ["./mcp/ngrx-signalstore/index.js"],
      "cwd": "${workspaceFolder}"
    },
    "angular-material": {
      "command": "node",
      "args": ["./mcp/angular-material/index.js"],
      "cwd": "${workspaceFolder}"
    },
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

---

## Best Practices

### ✅ DO
- `npm run mcp:setup` nach dem ersten Clone ausführen
- MCP Server Befehle in natürlicher Sprache nutzen
- Bei Problemen `npm run mcp:check` ausführen

### ❌ DON'T
- MCP Server Dateien manuell editieren
- `node_modules` in `mcp/` committen
- MCP Config ohne Test ändern

---

## Updates

### Angular CLI MCP aktualisieren
```bash
npm update @angular/cli
```

### Lokale MCP Server aktualisieren
```bash
cd mcp/ngrx-signalstore && npm update
cd ../angular-material && npm update
```

---

## Resources

- **Angular MCP Docs:** https://angular.dev/ai/mcp
- **MCP Protocol:** https://github.com/modelcontextprotocol/modelcontextprotocol
- **Claude Code Docs:** https://github.com/anthropics/claude-code
