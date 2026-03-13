# Sync Requirements Status across Branches

Synchronisiere den REQUIREMENTS.md Status von main in alle `req/*` und `feat/*` Branches.

## Ablauf

1. **Board-Server prüfen:** Versuche `POST http://localhost:3200/api/requirements/sync-status` aufzurufen
2. **Falls Board läuft:** Nutze die Board-API für den Sync (bevorzugt)
3. **Falls Board nicht läuft (Fallback):** Führe die Git-Operationen direkt aus:
   a. Aktuellen Branch merken + lokale Änderungen stashen
   b. `git checkout main && git pull origin main --rebase`
   c. REQUIREMENTS.md prüfen — falls sauber, committen + pushen
   d. Alle `req/*` und `feat/*` Branches per Cherry-Pick aktualisieren
   e. Zurück zum Original-Branch + Stash wiederherstellen

## Reporting

Zeige am Ende eine Tabelle mit:

| Branch | Status |
|--------|--------|
| req/REQ-001 | synced / conflict-skipped / already-applied / error |
| feat/REQ-002 | ... |

## Sicherheit

- Cherry-Pick Conflicts werden übersprungen (nicht forciert)
- Lokale Änderungen werden per Stash gesichert
- Bei Fehlern wird zum Original-Branch zurückgekehrt
