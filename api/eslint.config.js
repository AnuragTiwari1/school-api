const typescriptParser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  {
    files: ['**/*.ts', '**/*.js'],
    ignores: ['node_modules/', 'dist/', 'build/'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json', // Path to your tsconfig.json
      },
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'warn', // Catches missing types in function signatures
      '@typescript-eslint/no-inferrable-types': 'off', // Disable if you want stricter types
      'prefer-const': 'error',

      // Enforce newlines between methods in classes
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' }, // Blank line before 'return'
        { blankLine: 'always', prev: 'block-like', next: '*' }, // Blank line after code blocks
        { blankLine: 'always', prev: '*', next: 'if' }, // Blank line before 'if'
        { blankLine: 'always', prev: 'if', next: '*' }, // Blank line after 'if'
        { blankLine: 'always', prev: '*', next: 'function' }, // Blank line before functions
      ],

      // Prefer arrow functions over function keyword
      'prefer-arrow-callback': ['error', { allowNamedFunctions: false }],
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
    },
  },
  prettierConfig, // Extends Prettier settings for formatting
];
