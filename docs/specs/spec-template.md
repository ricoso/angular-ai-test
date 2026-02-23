# SPEC-XXX: [Feature Name]

**Status:** Draft | In Progress | Implemented  
**Created:** YYYY-MM-DD  
**i18n:** Yes | No

## Overview
Brief description

## User Stories
- As [role] I want [action] so that [benefit]

## Requirements
### Functional
- [ ] FR-1: System must...
- [ ] FR-2: User can...

### Non-Functional
- [ ] NFR-1: Performance < 200ms
- [ ] NFR-2: Mobile responsive

## Technical Design

### Components
```
features/[feature]/
├── components/
│   ├── [feature]-list.component.ts (Smart)
│   └── [feature]-card.component.ts (Presentational)
├── store/
│   └── [feature].store.ts
└── [feature].routes.ts
```

### i18n Keys (if i18n: Yes)
```typescript
'feature.list.title'
'feature.actions.save'
```

### Routes
```typescript
{ path: 'feature', component: FeatureListComponent }
```

## Acceptance Criteria
- [ ] AC-1: User can view list
- [ ] AC-2: User can create
- [ ] AC-3: Error handling works

## Implementation Notes
*Fill after implementation*
