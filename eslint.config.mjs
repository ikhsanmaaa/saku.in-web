// @ts-check
import eslint from '@eslint/js';
import angular from 'angular-eslint';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', '.angular/**', 'node_modules/**', 'architecture/**', 'graphify-out/**'],
  },
  {
    files: ['src/**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  {
    files: ['src/**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {},
  },
  // ADR 005: shared/ dilarang mengimpor core/ atau features/
  {
    files: ['src/app/shared/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/core/**', '../core/**', '../../core/**', '**/features/**', '../features/**', '../../features/**'],
              message: 'Boundary violation (ADR 005): shared/ tidak boleh mengimpor dari core/ atau features/.',
            },
          ],
        },
      ],
    },
  },
  // ADR 005: core/ dilarang mengimpor features/
  {
    files: ['src/app/core/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/features/**', '../features/**', '../../features/**'],
              message: 'Boundary violation (ADR 005): core/ tidak boleh mengimpor dari features/.',
            },
          ],
        },
      ],
    },
  },
  // ADR 005: komponen UI (*.page.ts & *.component.ts) dilarang menginjeksi HttpClient langsung
  {
    files: ['src/app/**/*.page.ts', 'src/app/**/*.component.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@angular/common/http',
              importNames: ['HttpClient'],
              message: 'Boundary violation (ADR 005): komponen UI tidak boleh memanggil HttpClient langsung; gunakan *.api.ts / *.store.ts.',
            },
          ],
        },
      ],
    },
  }
);
