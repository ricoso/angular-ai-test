#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// NgRx Signal Store Knowledge Base
const PATTERNS = {
  'basic-store': {
    title: 'Basic Signal Store',
    code: `import { signalStore, withState } from '@ngrx/signals';

export const CounterStore = signalStore(
  { providedIn: 'root' },
  withState({ count: 0 })
);`,
    description: 'Einfachster Signal Store mit State'
  },
  
  'with-computed': {
    title: 'Store with Computed',
    code: `import { signalStore, withState, withComputed } from '@ngrx/signals';
import { computed } from '@angular/core';

type Product = { id: string; name: string; price: number };

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState({
    products: [] as Product[],
    filter: ''
  }),
  withComputed(({ products, filter }) => ({
    filteredProducts: computed(() =>
      products().filter(p => p.name.includes(filter()))
    ),
    totalPrice: computed(() =>
      products().reduce((sum, p) => sum + p.price, 0)
    )
  }))
);`,
    description: 'Store mit computed values'
  },

  'with-methods': {
    title: 'Store with Methods',
    code: `import { signalStore, withState, withMethods } from '@ngrx/signals';
import { inject } from '@angular/core';

type User = { id: string; name: string };

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState({
    users: [] as User[],
    loading: false,
    error: null as string | null
  }),
  withMethods((store, userService = inject(UserService)) => ({
    async loadUsers() {
      patchState(store, { loading: true });
      try {
        const users = await userService.getAll();
        patchState(store, { users, error: null });
      } catch (err) {
        patchState(store, { error: err.message });
      } finally {
        patchState(store, { loading: false });
      }
    },
    addUser(user: User) {
      patchState(store, { users: [...store.users(), user] });
    },
    removeUser(id: string) {
      patchState(store, { 
        users: store.users().filter(u => u.id !== id) 
      });
    }
  }))
);`,
    description: 'Store mit Methoden für State Updates'
  },

  'with-hooks': {
    title: 'Store with Lifecycle Hooks',
    code: `import { signalStore, withState, withHooks } from '@ngrx/signals';
import { inject } from '@angular/core';

export const DataStore = signalStore(
  { providedIn: 'root' },
  withState({ data: [], initialized: false }),
  withHooks({
    onInit(store, dataService = inject(DataService)) {
      console.log('Store initialized');
      dataService.load().then(data => {
        patchState(store, { data, initialized: true });
      });
    },
    onDestroy() {
      console.log('Store destroyed');
    }
  })
);`,
    description: 'Store mit Lifecycle Hooks'
  },

  'feature-store': {
    title: 'Complete Feature Store',
    code: `import { 
  signalStore, 
  withState, 
  withComputed, 
  withMethods,
  withHooks,
  patchState 
} from '@ngrx/signals';
import { computed, inject } from '@angular/core';

// Types
type Todo = { 
  id: string; 
  title: string; 
  completed: boolean; 
  priority: 'low' | 'medium' | 'high';
};

type Filter = 'all' | 'active' | 'completed';

// Initial State
const initialState = {
  todos: [] as Todo[],
  filter: 'all' as Filter,
  loading: false,
  error: null as string | null,
};

// Store
export const TodoStore = signalStore(
  { providedIn: 'root' },
  
  // State
  withState(initialState),
  
  // Computed Selectors
  withComputed(({ todos, filter }) => ({
    filteredTodos: computed(() => {
      const allTodos = todos();
      switch (filter()) {
        case 'active': return allTodos.filter(t => !t.completed);
        case 'completed': return allTodos.filter(t => t.completed);
        default: return allTodos;
      }
    }),
    completedCount: computed(() => 
      todos().filter(t => t.completed).length
    ),
    activeCount: computed(() => 
      todos().filter(t => !t.completed).length
    ),
    highPriorityTodos: computed(() =>
      todos().filter(t => t.priority === 'high' && !t.completed)
    )
  })),
  
  // Methods
  withMethods((store, todoService = inject(TodoService)) => ({
    async loadTodos() {
      patchState(store, { loading: true });
      try {
        const todos = await todoService.getAll();
        patchState(store, { todos, error: null });
      } catch (err) {
        patchState(store, { error: err.message });
      } finally {
        patchState(store, { loading: false });
      }
    },
    
    async addTodo(title: string, priority: Todo['priority'] = 'medium') {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        title,
        completed: false,
        priority
      };
      
      try {
        await todoService.create(newTodo);
        patchState(store, { 
          todos: [...store.todos(), newTodo] 
        });
      } catch (err) {
        patchState(store, { error: err.message });
      }
    },
    
    async toggleTodo(id: string) {
      const todo = store.todos().find(t => t.id === id);
      if (!todo) return;
      
      const updated = { ...todo, completed: !todo.completed };
      try {
        await todoService.update(id, updated);
        patchState(store, {
          todos: store.todos().map(t => t.id === id ? updated : t)
        });
      } catch (err) {
        patchState(store, { error: err.message });
      }
    },
    
    async deleteTodo(id: string) {
      try {
        await todoService.delete(id);
        patchState(store, {
          todos: store.todos().filter(t => t.id !== id)
        });
      } catch (err) {
        patchState(store, { error: err.message });
      }
    },
    
    setFilter(filter: Filter) {
      patchState(store, { filter });
    },
    
    clearCompleted() {
      const activeTodos = store.todos().filter(t => !t.completed);
      patchState(store, { todos: activeTodos });
    }
  })),
  
  // Lifecycle Hooks
  withHooks({
    onInit(store) {
      console.log('TodoStore initialized');
      store.loadTodos();
    }
  })
);`,
    description: 'Vollständiger Feature Store mit allen Features'
  },

  'entity-store': {
    title: 'Entity Store Pattern',
    code: `import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';
import { computed } from '@angular/core';

type Entity = { id: string; [key: string]: any };

type EntityState<T extends Entity> = {
  entities: Record<string, T>;
  ids: string[];
  selectedId: string | null;
  loading: boolean;
};

export function createEntityStore<T extends Entity>(name: string) {
  return signalStore(
    { providedIn: 'root' },
    withState<EntityState<T>>({
      entities: {},
      ids: [],
      selectedId: null,
      loading: false
    }),
    withComputed(({ entities, ids, selectedId }) => ({
      all: computed(() => ids().map(id => entities()[id])),
      selected: computed(() => {
        const id = selectedId();
        return id ? entities()[id] : null;
      }),
      count: computed(() => ids().length)
    })),
    withMethods((store) => ({
      setAll(entities: T[]) {
        const entityMap = entities.reduce((acc, e) => {
          acc[e.id] = e;
          return acc;
        }, {} as Record<string, T>);
        
        patchState(store, {
          entities: entityMap,
          ids: entities.map(e => e.id)
        });
      },
      addOne(entity: T) {
        if (store.entities()[entity.id]) return;
        
        patchState(store, {
          entities: { ...store.entities(), [entity.id]: entity },
          ids: [...store.ids(), entity.id]
        });
      },
      updateOne(id: string, changes: Partial<T>) {
        const entity = store.entities()[id];
        if (!entity) return;
        
        patchState(store, {
          entities: {
            ...store.entities(),
            [id]: { ...entity, ...changes }
          }
        });
      },
      removeOne(id: string) {
        const { [id]: removed, ...rest } = store.entities();
        patchState(store, {
          entities: rest,
          ids: store.ids().filter(i => i !== id)
        });
      },
      selectEntity(id: string | null) {
        patchState(store, { selectedId: id });
      }
    }))
  );
}

// Usage:
// export const UserStore = createEntityStore<User>('User');`,
    description: 'Wiederverwendbares Entity Store Pattern'
  }
};

const BEST_PRACTICES = {
  'state-design': `# State Design Best Practices

1. **Keep State Flat**
   - Vermeide tief verschachtelte Objekte
   - Nutze normalisierte Daten (Entity Pattern)
   
2. **Separate Loading/Error State**
   - Immer \`loading: boolean\` und \`error: string | null\`
   
3. **Immutability**
   - Nutze \`patchState\` für Updates
   - Spread Operator für Arrays/Objects
   
4. **Type Safety**
   - Definiere klare Types für State
   - Nutze TypeScript strict mode`,

  'performance': `# Performance Best Practices

1. **Computed Values statt Methoden**
   - Computed signals cachen automatisch
   - Nur bei Dependency-Änderung neu berechnet
   
2. **Granulare Stores**
   - Feature-based stores statt ein globaler Store
   - Nur relevante Daten laden
   
3. **Selective Updates**
   - Nur geänderte Properties patchen
   - Vermeide komplette State-Replacements
   
4. **OnPush Change Detection**
   - Components mit Signal Store = OnPush safe`,

  'testing': `# Testing Signal Stores

## Unit Test Example

\`\`\`typescript
import { TestBed } from '@angular/core/testing';
import { UserStore } from './user.store';

describe('UserStore', () => {
  let store: InstanceType<typeof UserStore>;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserStore]
    });
    store = TestBed.inject(UserStore);
  });
  
  it('should initialize with empty users', () => {
    expect(store.users()).toEqual([]);
    expect(store.loading()).toBe(false);
  });
  
  it('should add user', () => {
    const user = { id: '1', name: 'Test' };
    store.addUser(user);
    
    expect(store.users()).toContain(user);
    expect(store.userCount()).toBe(1);
  });
  
  it('should handle async loading', async () => {
    await store.loadUsers();
    
    expect(store.loading()).toBe(false);
    expect(store.users().length).toBeGreaterThan(0);
  });
});
\`\`\``,

  'migration': `# Migration von RxJS Store zu Signal Store

## Von klassischem Service:

**Vorher (RxJS):**
\`\`\`typescript
@Injectable({ providedIn: 'root' })
export class UserService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();
  
  addUser(user: User) {
    this.usersSubject.next([...this.usersSubject.value, user]);
  }
}
\`\`\`

**Nachher (Signal Store):**
\`\`\`typescript
export const UserStore = signalStore(
  { providedIn: 'root' },
  withState({ users: [] as User[] }),
  withMethods((store) => ({
    addUser(user: User) {
      patchState(store, { users: [...store.users(), user] });
    }
  }))
);
\`\`\``
};

// MCP Server Setup
const server = new Server(
  {
    name: 'ngrx-signalstore-docs',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_pattern',
        description: 'Get a specific NgRx Signal Store pattern with code example',
        inputSchema: {
          type: 'object',
          properties: {
            pattern: {
              type: 'string',
              enum: Object.keys(PATTERNS),
              description: 'Pattern name: basic-store, with-computed, with-methods, with-hooks, feature-store, entity-store'
            }
          },
          required: ['pattern']
        }
      },
      {
        name: 'search_patterns',
        description: 'Search for patterns by keyword or use case',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query (e.g., "async", "computed", "entity")'
            }
          },
          required: ['query']
        }
      },
      {
        name: 'get_best_practice',
        description: 'Get best practices for a specific topic',
        inputSchema: {
          type: 'object',
          properties: {
            topic: {
              type: 'string',
              enum: Object.keys(BEST_PRACTICES),
              description: 'Topic: state-design, performance, testing, migration'
            }
          },
          required: ['topic']
        }
      },
      {
        name: 'list_all_patterns',
        description: 'List all available patterns',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'get_pattern') {
    const pattern = PATTERNS[args.pattern];
    if (!pattern) {
      return {
        content: [{ 
          type: 'text', 
          text: `Pattern '${args.pattern}' not found` 
        }]
      };
    }

    return {
      content: [{
        type: 'text',
        text: `# ${pattern.title}

${pattern.description}

\`\`\`typescript
${pattern.code}
\`\`\`

## Usage in Component

\`\`\`typescript
import { Component, inject } from '@angular/core';
import { ${pattern.title.replace(/\s+/g, '')} } from './store';

@Component({
  selector: 'app-example',
  template: \`
    <div>
      <!-- Access store signals directly -->
      {{ store.someProperty() }}
    </div>
  \`
})
export class ExampleComponent {
  store = inject(${pattern.title.replace(/\s+/g, '')});
}
\`\`\`
`
      }]
    };
  }

  if (name === 'search_patterns') {
    const query = args.query.toLowerCase();
    const results = Object.entries(PATTERNS)
      .filter(([key, pattern]) => 
        key.includes(query) || 
        pattern.title.toLowerCase().includes(query) ||
        pattern.description.toLowerCase().includes(query) ||
        pattern.code.toLowerCase().includes(query)
      );

    if (results.length === 0) {
      return {
        content: [{ 
          type: 'text', 
          text: `No patterns found for query: "${args.query}"` 
        }]
      };
    }

    const resultText = results.map(([key, pattern]) => 
      `## ${pattern.title} (${key})\n${pattern.description}`
    ).join('\n\n');

    return {
      content: [{
        type: 'text',
        text: `# Search Results for "${args.query}"\n\n${resultText}\n\nUse get_pattern with the key to see full code examples.`
      }]
    };
  }

  if (name === 'get_best_practice') {
    const practice = BEST_PRACTICES[args.topic];
    if (!practice) {
      return {
        content: [{ 
          type: 'text', 
          text: `Best practice topic '${args.topic}' not found` 
        }]
      };
    }

    return {
      content: [{
        type: 'text',
        text: practice
      }]
    };
  }

  if (name === 'list_all_patterns') {
    const list = Object.entries(PATTERNS)
      .map(([key, pattern]) => `- **${key}**: ${pattern.title} - ${pattern.description}`)
      .join('\n');

    return {
      content: [{
        type: 'text',
        text: `# Available NgRx Signal Store Patterns\n\n${list}\n\nUse get_pattern(name) to see full examples.`
      }]
    };
  }

  return {
    content: [{ type: 'text', text: 'Unknown tool' }]
  };
});

// List resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'ngrx://patterns',
        name: 'All Signal Store Patterns',
        mimeType: 'text/markdown'
      },
      {
        uri: 'ngrx://best-practices',
        name: 'Best Practices Guide',
        mimeType: 'text/markdown'
      }
    ]
  };
});

// Read resources
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  if (uri === 'ngrx://patterns') {
    const allPatterns = Object.entries(PATTERNS)
      .map(([key, pattern]) => `## ${pattern.title}\n\n${pattern.description}\n\n\`\`\`typescript\n${pattern.code}\n\`\`\``)
      .join('\n\n---\n\n');

    return {
      contents: [{
        uri,
        mimeType: 'text/markdown',
        text: `# NgRx Signal Store Patterns\n\n${allPatterns}`
      }]
    };
  }

  if (uri === 'ngrx://best-practices') {
    const allPractices = Object.values(BEST_PRACTICES).join('\n\n---\n\n');
    return {
      contents: [{
        uri,
        mimeType: 'text/markdown',
        text: allPractices
      }]
    };
  }

  throw new Error('Resource not found');
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);

console.error('NgRx Signal Store MCP Server running');
