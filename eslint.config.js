import js from '@eslint/js';
import importX from 'eslint-plugin-import-x';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactNative from 'eslint-plugin-react-native';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react,
      'react-hooks': reactHooks,
      'react-native': reactNative,
      'import-x': importX,
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: {
      react: { version: 'detect' },
      // важен резолвер TS
      'import-x/resolver': {
        typescript: {
          // укажите ваш tsconfig при необходимости
          project: ['tsconfig.json'],
        },
      },
    },
    rules: {
      // замена правил с префиксом import -> import-x
      'import-x/namespace': 'error',
      'import-x/no-unresolved': 'error',
      // остальные ваши правила
      'react/react-in-jsx-scope': 'off',
      'react-native/no-inline-styles': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'import/order': 'off',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            // React/React Native/Expo — первыми
            ['^react$', '^react-native$', '^expo$'],
            // Пакеты (внешние зависимости)
            ['^@?\\w'],
            // Сайд-эффекты
            ['^\\u0000'],
            // Абсолютные алиасы вашего проекта (например, "@/...")
            ['^@/'],
            // Абсолютные пути внутри проекта (если есть другие алиасы/папки)
            ['^[^.]'],
            // Относительные импорты
            ['^\\.', '^\\.\\./', '^\\.\\./\\.\\./'],
            // Типы (опционально можно выделить отдельно)
            ['^.*\\u0000types$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    ignores: [
      'node_modules/',
      'android/',
      'ios/',
      'dist/',
      'build/',
      '.expo/',
      '.expo-shared/',
      './metro.config.js',
      './babel.config.js',
    ],
  },
];
