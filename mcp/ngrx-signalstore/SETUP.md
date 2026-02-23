# Setup Anleitung: NgRx Signal Store MCP Server

## Schnellstart

### 1. MCP Server vorbereiten

```bash
cd /path/to/ngrx-signalstore-mcp
npm install
npm link  # Macht den Server global verfügbar
```

### 2. Claude Code Konfiguration

Öffne oder erstelle: `~/.config/claude-code/mcp_config.json`

```json
{
  "mcpServers": {
    "ngrx-signalstore": {
      "command": "ngrx-signalstore-mcp"
    }
  }
}
```

### 3. Claude Code neu starten

Damit die Änderungen wirksam werden.

### 4. Test

Frage in Claude Code:

```
"Liste alle verfügbaren NgRx Signal Store Patterns"
```

Claude sollte jetzt den MCP Server nutzen und dir die Patterns zeigen.

## Integration in dein Angular Projekt

### In `.claude/claude.md` dokumentieren:

```markdown
## Verfügbare MCP Server

### ngrx-signalstore (global installiert)
**Zweck**: NgRx Signal Store Patterns und Best Practices

**Tools:**
- `get_pattern(pattern)` - Pattern mit Code-Beispiel
- `search_patterns(query)` - Patterns suchen
- `get_best_practice(topic)` - Best Practices
- `list_all_patterns()` - Alle Patterns auflisten

**Patterns:**
- basic-store
- with-computed
- with-methods  
- with-hooks
- feature-store
- entity-store

**Best Practice Topics:**
- state-design
- performance
- testing
- migration

**Beispiel-Anfragen:**
- "Zeig mir das feature-store Pattern"
- "Wie teste ich einen Signal Store?"
- "Best Practices für Performance?"
```

## Troubleshooting

### MCP Server startet nicht

```bash
# Prüfe ob der Server funktioniert
ngrx-signalstore-mcp

# Sollte "NgRx Signal Store MCP Server running" ausgeben
```

### Command not found

```bash
# Nochmal linken
cd /path/to/ngrx-signalstore-mcp
npm link

# Oder prüfe PATH
echo $PATH
```

### Claude Code findet MCP nicht

1. Prüfe `mcp_config.json` Pfad
2. Claude Code komplett neu starten
3. Logs prüfen (falls verfügbar)

## Alternative: Lokaler Pfad statt npm link

Falls `npm link` nicht funktioniert:

```json
{
  "mcpServers": {
    "ngrx-signalstore": {
      "command": "node",
      "args": ["/absolute/path/to/ngrx-signalstore-mcp/index.js"]
    }
  }
}
```

## Nächste Schritte

1. ✅ MCP Server installiert
2. ✅ Claude Code konfiguriert
3. ⬜ In Projekt dokumentiert (`.claude/claude.md`)
4. ⬜ Mit Team geteilt
5. ⬜ Erste Patterns ausprobiert

Viel Erfolg! 🚀
