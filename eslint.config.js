import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import * as importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export default defineConfig(
  {
    files: ['**/*.{js,ts,tsx}'],
    plugins: {
      import: importPlugin,
      '@stylistic': stylistic,
    },
    rules: {
      'import/first': 'warn',
      'import/newline-after-import': 'warn',
      // This rule is very time intensive.
      // 'import/no-cycle': 'error',
      'import/no-duplicates': ['warn', { 'prefer-inline': false }],
      'import/no-useless-path-segments': 'error',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          named: {
            import: true,
            types: 'types-last'
          },
          alphabetize: {
            order: 'asc',
            orderImportKind: 'asc'
          },
        }
      ],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'object-shorthand': ['warn', 'properties'],
      'prefer-const': ['warn', { destructuring: 'all' }],

      '@stylistic/arrow-parens': ['warn', 'as-needed'],
      '@stylistic/arrow-spacing': 'warn',
      '@stylistic/block-spacing': 'warn',
      '@stylistic/brace-style': ['warn', '1tbs', { allowSingleLine: true }],
      '@stylistic/function-call-spacing': ['warn', 'never'],
      '@stylistic/function-paren-newline': ['warn', 'multiline-arguments'],
      '@stylistic/indent': ['warn', 2],
      '@stylistic/keyword-spacing': 'warn',
      '@stylistic/member-delimiter-style': [
        'warn',
        {
          multiline: {
            delimiter: 'semi',
            requireLast: true
          },
          singleline: {
            delimiter: 'comma',
            requireLast: false
          }
        }
      ],
      '@stylistic/no-extra-parens': ['warn', 'all', {
        enforceForArrowConditionals: false,
        ignoreJSX: 'all',
        nestedBinaryExpressions: false,
      }],
      '@stylistic/nonblock-statement-body-position': ['error', 'beside'],
      '@stylistic/object-curly-newline': ['warn', {
        ImportDeclaration: { multiline: true },
      }],
      '@stylistic/object-curly-spacing': ['warn', 'always'],
      '@stylistic/quotes': ['warn', 'single', { avoidEscape: true }],
      '@stylistic/semi': ['warn', 'always'],
      '@stylistic/space-before-blocks': 'warn',
      '@stylistic/space-before-function-paren': ['warn', {
        anonymous: 'always',
        asyncArrow: 'always',
        named: 'never'
      }]
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/consistent-type-assertions': ['warn', { assertionStyle: 'as' }],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/only-throw-error': 'error', 
      '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/return-await': ['error', 'in-try-catch']
    }
  },
  {
    files: ['**/*.tsx'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react/jsx-key': 'off',
      'react/prefer-stateless-function': 'warn',
      'react/prop-types': 'off',

      '@stylistic/jsx-equals-spacing': ['warn', 'never'],
      '@stylistic/jsx-indent-props': ['warn', 2],
      '@stylistic/jsx-props-no-multi-spaces': 'warn',
      '@stylistic/jsx-self-closing-comp': 'warn',
    }
  }
);
