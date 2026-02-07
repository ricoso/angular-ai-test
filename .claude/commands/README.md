# Claude Commands

Diese Commands können in Claude Code verwendet werden.

## Verfügbare Commands

### Feature Development
- `/create-feature <name>` - Erstellt Feature-Struktur
- `/create-component <feature> <name>` - Erstellt Component
- `/create-requirement <name> <number>` - Erstellt Requirement

### Implementation
- `/implement-spec <req-id>` - Implementiert Requirement nach Workflow

### Testing
- `/test` - Run tests
- `/test-ci` - CI mode
- `/coverage` - Coverage report

### Quality
- `/quality lint` - Lint code
- `/quality format` - Format code
- `/quality type-check` - TypeScript check
- `/quality all` - All checks

## Usage

```
/create-feature product
/create-component product product-card
/implement-spec REQ-001-UserLogin
/quality all
```
