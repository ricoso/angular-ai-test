# NgRx Signal Store MCP Server

Ein Model Context Protocol (MCP) Server für NgRx Signal Store Dokumentation, Patterns und Best Practices.

## Installation

### Global installieren

```bash
npm install -g /path/to/ngrx-signalstore-mcp
```

### In Claude Code konfigurieren

Füge in `~/.config/claude-code/mcp_config.json` hinzu:

```json
{
  "mcpServers": {
    "ngrx-signalstore": {
      "command": "ngrx-signalstore-mcp"
    }
  }
}
```

Oder mit npx (ohne Installation):

```json
{
  "mcpServers": {
    "ngrx-signalstore": {
      "command": "npx",
      "args": ["-y", "/path/to/ngrx-signalstore-mcp"]
    }
  }
}
```

## Verfügbare Tools

### 1. `get_pattern`
Hole ein spezifisches Pattern mit Code-Beispiel

**Parameter:**
- `pattern`: Name des Patterns

**Verfügbare Patterns:**
- `basic-store` - Einfachster Signal Store
- `with-computed` - Store mit computed values
- `with-methods` - Store mit Methoden
- `with-hooks` - Store mit Lifecycle Hooks
- `feature-store` - Kompletter Feature Store
- `entity-store` - Wiederverwendbares Entity Pattern

**Beispiel:**
```
get_pattern({ pattern: "feature-store" })
```

### 2. `search_patterns`
Suche nach Patterns per Keyword

**Parameter:**
- `query`: Suchbegriff

**Beispiel:**
```
search_patterns({ query: "async" })
```

### 3. `get_best_practice`
Hole Best Practices zu einem Thema

**Parameter:**
- `topic`: Thema

**Verfügbare Topics:**
- `state-design` - State Design Best Practices
- `performance` - Performance Optimierungen
- `testing` - Testing Strategies
- `migration` - Migration von RxJS

**Beispiel:**
```
get_best_practice({ topic: "testing" })
```

### 4. `list_all_patterns`
Liste alle verfügbaren Patterns

**Beispiel:**
```
list_all_patterns()
```

## Verfügbare Resources

### `ngrx://patterns`
Alle Signal Store Patterns in einem Dokument

### `ngrx://best-practices`
Kompletter Best Practices Guide

## Verwendung in Claude Code

Wenn der MCP Server konfiguriert ist, kannst du in Claude Code fragen:

```
"Zeig mir ein NgRx Signal Store Pattern für eine Todo-Liste mit async Loading"

"Wie teste ich einen Signal Store?"

"Was sind Best Practices für State Design in Signal Stores?"

"Zeig mir das Entity Store Pattern"
```

Claude Code wird automatisch den MCP Server nutzen und dir die entsprechenden Patterns und Dokumentation geben.

## Entwicklung

### Lokales Testen

```bash
# Dependencies installieren
npm install

# Server starten (für MCP Client)
node index.js

# In einem anderen Terminal kannst du MCP-Requests senden
```

### Neue Patterns hinzufügen

Bearbeite `index.js` und füge neue Patterns zum `PATTERNS` Objekt hinzu:

```javascript
const PATTERNS = {
  'my-new-pattern': {
    title: 'My New Pattern',
    code: `// TypeScript Code hier`,
    description: 'Beschreibung'
  }
};
```

## Lizenz

MIT
