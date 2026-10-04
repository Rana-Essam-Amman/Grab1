import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'coverage', 'playwright-report'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      // CRITICAL GUARDRAILS — must remain ERRORS
      'no-restricted-imports': ['error', {
        paths: [
          { name: 'react-router-dom', message: 'Use useUI().navigateTo() instead.' },
          { name: 'react-router', message: 'Use useUI().navigateTo() instead.' },
          { name: 'axios', message: 'Use fetch() instead.' },
          { name: 'jquery', message: 'Not allowed.' }
        ]
      }],
      'no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
      // LEGACY — downgraded to WARNINGS (to be fixed in Sprint R7.0i)
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',   // keep this as error — it's safety critical
      'no-empty-pattern': 'warn',
      'prefer-const': 'warn',
      // Disable rules that create noise without safety benefit
      'no-empty': 'warn',
      'no-undef': 'off',  // TypeScript handles this
      '@typescript-eslint/no-require-imports': 'warn',
      'no-case-declarations': 'warn',
      'no-useless-escape': 'warn'
    }
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
  }
);
