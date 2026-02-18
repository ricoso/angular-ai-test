// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import importPlugin from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default tseslint.config(
  // ===========================================
  // GLOBAL IGNORES
  // ===========================================
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.angular/**',
      'coverage/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'mcp/**',
      'scripts/**',
    ],
  },

  // ===========================================
  // TYPESCRIPT FILES
  // ===========================================
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ...angular.configs.tsRecommended,
    ],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
    },
    processor: angular.processInlineTemplates,
    rules: {
      // ===========================================
      // ANGULAR-ESLINT RULES (aus CLAUDE.md)
      // ===========================================

      // ✅ OnPush Change Detection (PFLICHT!)
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',

      // ✅ Component Selectors mit Prefix: app-xxx (kebab-case)
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],

      // ✅ Directive Selectors mit Prefix: app (camelCase)
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],

      // ✅ KEINE Lifecycle-Interfaces ohne Implementation
      '@angular-eslint/use-lifecycle-interface': 'error',

      // ✅ Kein Output mit on- Prefix (Event emitters)
      '@angular-eslint/no-output-on-prefix': 'error',

      // ✅ Keine leeren Lifecycle-Methoden
      '@angular-eslint/no-empty-lifecycle-method': 'error',

      // ✅ Component class suffix
      '@angular-eslint/component-class-suffix': 'error',

      // ✅ Directive class suffix
      '@angular-eslint/directive-class-suffix': 'error',

      // ✅ Keine Input/Output Rename
      '@angular-eslint/no-input-rename': 'warn',
      '@angular-eslint/no-output-rename': 'warn',

      // ✅ KEINE Inline Templates - IMMER separate .html Dateien!
      '@angular-eslint/component-max-inline-declarations': [
        'error',
        {
          template: 0,  // Keine inline templates erlaubt
          styles: 0,    // Keine inline styles erlaubt
          animations: 15, // Animations können inline sein
        },
      ],

      // ✅ Prefer standalone components
      '@angular-eslint/prefer-standalone': 'error',

      // ===========================================
      // TYPESCRIPT RULES (aus CLAUDE.md)
      // ===========================================

      // ✅ KEIN any - immer Interfaces/Types (nutze unknown wenn nötig)
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',

      // ✅ Explicit Return Types bei Methoden
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
          allowConciseArrowFunctionExpressionsStartingWithVoid: true,
        },
      ],

      // ✅ Explicit Member Accessibility (public/private/protected)
      '@typescript-eslint/explicit-member-accessibility': [
        'warn',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public',
            accessors: 'explicit',
            methods: 'explicit',
            properties: 'explicit',
            parameterProperties: 'explicit',
          },
        },
      ],

      // ✅ Naming Conventions (camelCase, PascalCase, UPPER_SNAKE_CASE)
      '@typescript-eslint/naming-convention': [
        'error',
        // Variables: camelCase oder UPPER_SNAKE_CASE für const
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
        // Exported const: PascalCase erlaubt (NgRx signalStore, Angular providers)
        {
          selector: 'variable',
          modifiers: ['const', 'exported'],
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
        // Funktionen: camelCase
        {
          selector: 'function',
          format: ['camelCase'],
        },
        // Parameter: camelCase
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        // Properties: camelCase
        {
          selector: 'property',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
        // Methods: camelCase
        {
          selector: 'method',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        // Classes: PascalCase
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        // Interfaces: PascalCase (ohne I-Prefix!)
        {
          selector: 'interface',
          format: ['PascalCase'],
          custom: {
            regex: '^I[A-Z]',
            match: false,
          },
        },
        // Type Aliases: PascalCase
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
        // Enums: PascalCase
        {
          selector: 'enum',
          format: ['PascalCase'],
        },
        // Enum Members: PascalCase oder UPPER_CASE
        {
          selector: 'enumMember',
          format: ['PascalCase', 'UPPER_CASE'],
        },
      ],

      // ✅ Consistent Type Imports
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],

      // ✅ Kein unused variables (underscore prefix für intentionally unused)
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // ✅ Keine floating promises (async ohne await)
      '@typescript-eslint/no-floating-promises': 'error',

      // ✅ Keine misused promises
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],

      // ✅ Prefer nullish coalescing
      '@typescript-eslint/prefer-nullish-coalescing': 'error',

      // ✅ Prefer optional chaining
      '@typescript-eslint/prefer-optional-chain': 'error',

      // ✅ Strict boolean expressions
      '@typescript-eslint/strict-boolean-expressions': [
        'warn',
        {
          allowString: true,
          allowNumber: true,
          allowNullableObject: true,
          allowNullableBoolean: true,
          allowNullableString: true,
          allowNullableNumber: false,
          allowAny: false,
        },
      ],

      // ✅ Kein non-null assertion (!)
      '@typescript-eslint/no-non-null-assertion': 'warn',

      // ✅ Type-only imports für Type-Imports
      '@typescript-eslint/consistent-type-exports': 'error',

      // ===========================================
      // SECURITY RULES (aus CLAUDE.md)
      // ===========================================

      // ❌ KEINE eval() oder Function() Aufrufe
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',

      // ❌ KEINE console.log() in Production (warn erlaubt)
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error', 'info', 'debug'],
        },
      ],

      // ❌ Keine debugger statements
      'no-debugger': 'error',

      // ===========================================
      // IMPORT RULES (aus CLAUDE.md)
      // ===========================================

      // ✅ Imports sortiert (Angular → Third Party → Local)
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Angular imports
            ['^@angular'],
            // NgRx imports
            ['^@ngrx'],
            // Other third-party imports
            ['^@?\\w'],
            // Internal imports (absolute paths starting with src/)
            ['^src/'],
            // Parent imports (../)
            ['^\\.\\.'],
            // Sibling imports (./)
            ['^\\.'],
            // Side effect imports
            ['^\\u0000'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // ✅ Kein duplicate imports
      'import/no-duplicates': 'error',

      // ===========================================
      // PERFORMANCE RULES (aus CLAUDE.md)
      // ===========================================

      // ✅ Prefer const
      'prefer-const': 'error',

      // ✅ No var
      'no-var': 'error',

      // ✅ Object shorthand
      'object-shorthand': 'error',

      // ✅ Arrow function body style
      'arrow-body-style': ['error', 'as-needed'],

      // ===========================================
      // CODE QUALITY RULES
      // ===========================================

      // ✅ Eqeqeq (=== statt ==)
      eqeqeq: ['error', 'always'],

      // ✅ Kein nested ternary
      'no-nested-ternary': 'error',

      // ✅ Max lines per function (Lesbarkeit)
      'max-lines-per-function': [
        'warn',
        {
          max: 50,
          skipBlankLines: true,
          skipComments: true,
        },
      ],

      // ✅ Complexity (max cyclomatic complexity)
      complexity: ['warn', 10],

      // ✅ Max depth (max nesting)
      'max-depth': ['warn', 4],

      // ===========================================
      // OVERRIDES für Angular-spezifische Patterns
      // ===========================================

      // Disable für Angular's Dependency Injection
      '@typescript-eslint/no-extraneous-class': 'off',

      // Disable für Signal/Computed Patterns
      '@typescript-eslint/unbound-method': 'off',

      // NgRx Store / RxJS: void als Typ-Argument erlaubt (rxMethod<void>)
      '@typescript-eslint/no-invalid-void-type': ['error', { allowInGenericTypeArguments: true }],

      // Template Literals: Zahlen erlaubt (Badge counts, etc.)
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],

      // Deprecated APIs: Nur Warning (Angular API-Änderungen schrittweise migrieren)
      '@typescript-eslint/no-deprecated': 'warn',

      // Catch-Variable: unknown statt any nur als Warning
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'warn',
    },
  },

  // ===========================================
  // ANGULAR TEMPLATE FILES
  // ===========================================
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      // ===========================================
      // PERFORMANCE RULES (aus CLAUDE.md)
      // ===========================================

      // ✅ @for mit track (NICHT $index für entities)
      '@angular-eslint/template/use-track-by-function': 'error',

      // ✅ Keine komplexen Expressions im Template
      // Signal-Reads (signal()) sind syntaktisch Funktionsaufrufe — nur Warning
      '@angular-eslint/template/no-call-expression': 'warn',

      // ===========================================
      // ACCESSIBILITY RULES (aus CLAUDE.md - WCAG 2.1 AA)
      // ===========================================

      // ✅ Alt text für Images
      '@angular-eslint/template/alt-text': 'error',

      // ✅ Labels für Form Controls
      '@angular-eslint/template/label-has-associated-control': 'error',

      // ✅ Clickable elements keyboard accessible
      '@angular-eslint/template/click-events-have-key-events': 'error',

      // ✅ Interactive elements must be focusable
      '@angular-eslint/template/interactive-supports-focus': 'error',

      // ✅ Valid ARIA attributes
      '@angular-eslint/template/valid-aria': 'error',

      // ✅ Role has required ARIA
      '@angular-eslint/template/role-has-required-aria': 'error',

      // ✅ No positive tabindex
      '@angular-eslint/template/no-positive-tabindex': 'error',

      // ✅ Mouse events have key events
      '@angular-eslint/template/mouse-events-have-key-events': 'error',

      // ✅ Table scope
      '@angular-eslint/template/table-scope': 'error',

      // ✅ Elements content
      '@angular-eslint/template/elements-content': 'error',

      // ===========================================
      // SECURITY RULES (aus CLAUDE.md)
      // ===========================================

      // ❌ KEIN [innerHTML] ohne DomSanitizer (warn, da manchmal nötig)
      '@angular-eslint/template/no-any': 'error',

      // ===========================================
      // CODE QUALITY RULES
      // ===========================================

      // ✅ Keine negated async pipe
      '@angular-eslint/template/no-negated-async': 'error',

      // ✅ i18n für Texte (warn, da ngx-translate verwendet wird)
      '@angular-eslint/template/i18n': 'off',

      // ✅ Conditional complexity
      '@angular-eslint/template/conditional-complexity': ['warn', { maxComplexity: 4 }],

      // ✅ Cyclomatic complexity
      '@angular-eslint/template/cyclomatic-complexity': ['warn', { maxComplexity: 10 }],

      // ✅ No duplicate attributes
      '@angular-eslint/template/no-duplicate-attributes': 'error',

      // ✅ Prefer self-closing tags
      '@angular-eslint/template/prefer-self-closing-tags': 'warn',
    },
  },

  // ===========================================
  // SPEC/TEST FILES (weniger strikt)
  // ===========================================
  {
    files: ['**/*.spec.ts', '**/*.test.ts', '**/setup-jest.ts'],
    rules: {
      // Tests dürfen any verwenden
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',

      // Tests haben oft längere Funktionen
      'max-lines-per-function': 'off',

      // Tests dürfen nicht-null assertion verwenden
      '@typescript-eslint/no-non-null-assertion': 'off',

      // Tests dürfen floating promises haben (für async tests)
      '@typescript-eslint/no-floating-promises': 'off',

      // Tests dürfen unbound methods verwenden
      '@typescript-eslint/unbound-method': 'off',
    },
  },

  // ===========================================
  // STORE FILES (Signal Store spezifisch)
  // ===========================================
  {
    files: ['**/*.store.ts'],
    rules: {
      // Stores haben oft komplexere computed Expressions
      complexity: ['warn', 15],

      // Stores dürfen unbound methods verwenden (für rxMethod)
      '@typescript-eslint/unbound-method': 'off',

      // rxMethod<void> ist Standard-NgRx-Pattern (false positive in function type args)
      '@typescript-eslint/no-invalid-void-type': 'off',

      // Store-Factories haben oft mehr Zeilen
      'max-lines-per-function': ['warn', { max: 80, skipBlankLines: true, skipComments: true }],
    },
  },

  // ===========================================
  // RESOLVER/GUARD FILES
  // ===========================================
  {
    files: ['**/*.resolver.ts', '**/*.guard.ts'],
    rules: {
      // Resolver/Guards haben oft keine Klassenmethoden
      '@typescript-eslint/explicit-member-accessibility': 'off',
    },
  },

  // ===========================================
  // MODEL/INTERFACE FILES
  // ===========================================
  {
    files: ['**/models/**/*.ts', '**/interfaces/**/*.ts'],
    rules: {
      // Models/Interfaces brauchen keine Return Types
      '@typescript-eslint/explicit-function-return-type': 'off',

      // Models haben oft viele Properties
      'max-lines-per-function': 'off',
    },
  },

  // ===========================================
  // PLAYWRIGHT E2E FILES (relaxte Regeln)
  // ===========================================
  {
    files: ['playwright/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      'max-lines-per-function': 'off',
    },
  }
);
