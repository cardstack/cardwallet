module.exports = {
  root: true,
  extends: ['plugin:echobind/react-native', 'prettier/@typescript-eslint'],
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      node: {
        extensions: [
          '.js',
          '.ios.js',
          '.android.js',
          '.native.js',
          '.d.ts',
          '.ts',
          '.tsx',
          '.png',
        ],
      },
      'babel-module': {
        alias: {},
      },
    },
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: ['variable', 'function', 'parameter'],
        format: ['camelCase'],
      },
    ],
  },
  rules: {
    'jest/expect-expect': 0,
    'import/namespace': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    'react/jsx-curly-brace-presence': ['error', 'never'],
    'react/jsx-fragments': 0,
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-var-requires': 0,
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        pathGroups: [
          {
            pattern: '@cardstack/**',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '@/**',
            group: 'external',
            position: 'after',
          },
        ],
        'newlines-between': 'always',
      },
    ],
  },
};
