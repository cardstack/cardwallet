const path = require('path-browserify');

module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  settings: {
    react: { version: 'detect' },
    'import/ignore': [
      'node_modules/react-native/index\\.js$',
      'node_modules/react-native-keychain',
    ],
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.tsx', '.png'],
        paths: ['.'],
      },
      typescript: {
        project: path.resolve(__dirname, '.tsconfig.json'),
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
  globals: {
    __DEV__: true,
  },
  rules: {
    'prettier/prettier': 0,
    'react/jsx-curly-brace-presence': ['error', 'never'],
    '@typescript-eslint/no-unused-vars': 'error',
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
  env: { browser: true, node: true, jest: true }, // browser needs to be true so it finds btoa and fetch polyfills
};
