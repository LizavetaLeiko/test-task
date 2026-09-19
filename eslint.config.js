import js from '@eslint/js'
import boundaries from 'eslint-plugin-boundaries'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

const layers = ['app', 'pages', 'widgets', 'features', 'entities', 'shared']

const allowedBelow = (layer) => layers.slice(layers.indexOf(layer) + 1)

export default defineConfig([
  globalIgnores([
    'dist',
    'coverage',
    'playwright-report',
    'test-results',
    'public/mockServiceWorker.js',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    plugins: {
      boundaries,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.app.json' },
      },
      'boundaries/include': ['src/**/*'],
      'boundaries/elements': layers.map((layer) => ({
        type: layer,
        pattern: `src/${layer}/*`,
      })),
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'boundaries/no-unknown': 'off',
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: layers.map((layer) => ({
            from: [{ element: { type: layer } }],
            allow: [
              { to: { element: { type: [layer, ...allowedBelow(layer)] } } },
            ],
          })),
        },
      ],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'src/shared/config/test-setup.ts'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
])
