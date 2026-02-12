import js from '@eslint/js';
import globals from 'globals';
import vue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-plugin-prettier';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,cjs,mjs,ts,vue}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      ...vue.configs['flat/essential'],
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: { parser: tseslint.parser },
    },
    plugins: { prettier },
    rules: {
      'prettier/prettier': 'error',
      'vue/no-multiple-template-root': 'off',
      'vue/multi-word-component-names': 'off',
      'no-useless-assignment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
]);
