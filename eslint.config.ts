import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVitest from '@vitest/eslint-plugin'
import prettierConfig from '@vue/eslint-config-prettier'

export default [
  ...pluginVue.configs['flat/strongly-recommended'],
  ...defineConfigWithVueTs(
    {
      name: 'app/files-to-lint',
      files: ['**/*.{ts,mts,tsx,vue,js,jsx,cjs,mjs,cts}'],
    },

    {
      name: 'app/files-to-ignore',
      ignores: [
        '**/dist/**',
        '**/dist-ssr/**',
        '**/coverage/**',
        '**/dev-dist/**',
        'components.d.ts',
        'stats.html',
      ],
    },

    vueTsConfigs.recommended,

    {
      rules: {
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single', { avoidEscape: true }],
        semi: ['error', 'always'],
      },
    },

    {
      ...pluginVitest.configs.recommended,
      files: ['src/**/__tests__/*'],
    },

    {
      files: ['**/*.cjs'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
  ),
  prettierConfig,
]
