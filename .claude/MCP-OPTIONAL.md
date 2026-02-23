# MCP Servers (OPTIONAL)

MCP Server sind **OPTIONAL** - die Skills (.md files) reichen für Code-Generierung!

---

## Status: OPTIONAL

Die 3 MCP Server sind **nice-to-have** aber **NICHT essentiell**:

### 1. ngrx-signalstore
**Was es macht:** Gibt Signal Store Patterns zurück  
**Alternative:** Skill `angular-architecture.md` hat alle Patterns  
**Nutzen:** Minimal (Skill ist schneller)

### 2. angular-material
**Was es macht:** Material Component Snippets  
**Alternative:** Skill + Angular Docs  
**Nutzen:** Gering (Beispiele meist nicht 1:1 nutzbar)

### 3. angular-cli
**Was es macht:** CLI Command Hints  
**Alternative:** Shell Scripts (`scripts/`) + COMMANDS.md  
**Nutzen:** Gering (Scripts sind schneller)

---

## Empfehlung

**Für die meisten Projekte:**
```bash
# MCP Server NICHT installieren
# npm run mcp:install  # SKIP THIS!

# Nur Skills nutzen
# Claude liest .claude/skills/*.md
```

**MCP Server nur wenn:**
- Du experimentieren willst
- Du MCP testen willst
- Team will MCP kennenlernen

---

## Installation (optional)

```bash
npm run mcp:install
```

**Config:** `.claude/mcp-config.json`

---

## Performance-Vergleich

**Mit MCP:**
- Claude ruft MCP tool auf → MCP gibt Pattern zurück → Claude generiert Code
- 2 Steps, mehr Token

**Ohne MCP (nur Skills):**
- Claude liest Skill direkt → Claude generiert Code
- 1 Step, weniger Token

**Fazit:** Skills sind effizienter!
