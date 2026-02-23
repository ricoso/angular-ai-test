# SKILL: TypeScript Config

## Wann nutzen
Types/Interfaces, tsconfig

## tsconfig.json (Strict Mode)
```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022", "dom"],
    "baseUrl": "./",
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"],
      "@environments/*": ["src/environments/*"]
    }
  }
}
```

## Interface vs Type
**Interface:** Objects, extensible
```typescript
interface User {
  id: string;
  name: string;
}
```

**Type:** Unions, utilities
```typescript
type Status = 'active' | 'inactive';
type UserRole = 'admin' | 'user';
```

## Utility Types
```typescript
Partial<User>       // All optional
Required<User>      // All required
Pick<User, 'id'>    // Select props
Omit<User, 'id'>    // Exclude props
Record<string, User> // Key-value map
```

## Type Guards
```typescript
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && 
         obj !== null && 
         'id' in obj;
}
```

## Naming
- Interfaces: `PascalCase`
- Types: `PascalCase`
- Use Union Types over Enums
