import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

const COLOR_BAN_SELECTORS = [
  {
    selector:
      "Literal[value=/(^|[\\\\s\"'`:])bg-white(?![\\\\/])|(^|[\\\\s\"'`:])bg-(gray|slate|zinc|neutral|stone|red|emerald|green|amber|yellow|blue|orange)-[0-9]|(^|[\\\\s\"'`:])bg-\\[#|(^|[\\\\s\"'`:])text-\\[#|(^|[\\\\s\"'`:])border-\\[#/]",
    message:
      'Hardcoded color banned. Use design tokens (bg-surface, text-ink, border-border, bg-success/10, etc).',
  },
  {
    selector:
      "TemplateElement[value.raw=/(^|[\\\\s\"'`:])bg-white(?![\\\\/])|(^|[\\\\s\"'`:])bg-(gray|slate|zinc|neutral|stone|red|emerald|green|amber|yellow|blue|orange)-[0-9]|(^|[\\\\s\"'`:])bg-\\[#|(^|[\\\\s\"'`:])text-\\[#|(^|[\\\\s\"'`:])border-\\[#/]",
    message:
      'Hardcoded color banned. Use design tokens (bg-surface, text-ink, border-border, bg-success/10, etc).',
  },
];

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'coverage', 'playwright-report', '**/*.test.ts', '**/*.test.tsx', '**/__tests__/**'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react-router-dom', message: 'Use useUI().navigateTo() instead.' },
            { name: 'react-router', message: 'Use useUI().navigateTo() instead.' },
            { name: 'axios', message: 'Use fetch() instead.' },
            { name: 'jquery', message: 'Not allowed.' },
          ],
        },
      ],
      'no-restricted-syntax': ['error', ...COLOR_BAN_SELECTORS],
      'no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'no-empty-pattern': 'warn',
      'prefer-const': 'warn',
      'no-empty': 'warn',
      'no-undef': 'off',
      '@typescript-eslint/no-require-imports': 'warn',
      'no-case-declarations': 'warn',
      'no-useless-escape': 'warn',
    },
  },
  {
    files: ['e2e/**/*.{ts,tsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
      'no-empty-pattern': 'off',
    },
  },
  {
    files: ['src/shared/router/**/*.ts', 'src/shared/router/**/*.tsx'],
    rules: {
      'no-restricted-imports': ['off'],
    },
  },
  {
    files: [
      'src/styles/**/*',
      'src/shared/components/sharePlatforms.config.tsx',
      'src/shared/components/CountryFlag.tsx',
      'src/shared/components/Header.tsx',
      'src/features/listings/components/ListingImageSlider.tsx',
      'src/features/post-wizard/components/DynamicFieldRenderer.tsx',
    ],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
);
