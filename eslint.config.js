/* eslint-disable import-x/no-named-as-default-member */
import eslintPluginImportX from 'eslint-plugin-import-x'
import prettierConfig from 'eslint-config-prettier'
import react from '@eslint-react/eslint-plugin'
import regexPlugin from 'eslint-plugin-regexp'
import security from 'eslint-plugin-security'
import { FlatCompat } from '@eslint/eslintrc'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import js from '@eslint/js'

import tailwind from 'eslint-plugin-tailwindcss'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname
})

const config = tseslint.config(
  {
    ignores: ['.next', 'node_modules','components/ui']
  },
  // Base
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintPluginImportX.flatConfigs.recommended,
  eslintPluginImportX.flatConfigs.typescript,
  regexPlugin.configs['flat/recommended'],
  security.configs.recommended,

  // Next.js / React
  ...compat.extends('plugin:@next/next/recommended'),
  ...compat.extends('plugin:react-hooks/recommended'),
  ...compat.extends('plugin:next-on-pages/recommended'),
  ...compat.plugins('react-compiler'),
  react.configs['recommended-type-checked'],

  // Tailwind
  ...tailwind.configs['flat/recommended'],

  {
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    settings: {
      tailwindcss: {
        callees: ['classnames', 'clsx', 'ctl', 'cn', 'cva']
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],

      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' }
      ],

      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } }
      ],

      '@typescript-eslint/no-unnecessary-condition': [
        'error',
        {
          allowConstantLoopConditions: true
        }
      ],

      '@typescript-eslint/consistent-type-exports': [
        'error',
        { fixMixedExportsWithInlineTypeSpecifier: true }
      ],
      '@typescript-eslint/consistent-type-definitions': "off",
      'import-x/no-unresolved': ['error', { ignore: ['geist'] }],
      'react-compiler/react-compiler': 'error',
      'tailwindcss/no-custom-classname': 'off'
    }
  },

  {
    files: ['**/*.cjs', '**/*.cts'],
    languageOptions: {
      sourceType: 'commonjs'
    }
  },

  prettierConfig
)

export default config
