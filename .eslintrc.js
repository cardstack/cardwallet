const path = require('path-browserify');

module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
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
    curly: [2, 'multi-line'],
    radix: ['error', 'as-needed'],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
    'react/jsx-curly-brace-presence': ['error', 'never'],
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-shadow': ['error'],
    // To be re-enabled
    'import/no-named-as-default': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'react-native/no-inline-styles': 0,
    'react/no-unstable-nested-components': 0,
    //
    'import/no-named-as-default-member': 0,
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
