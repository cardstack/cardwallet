module.exports = {
  extends: 'satya164',
  plugins: ['jest'],
  settings: {
    'react': { version: '18' },
    'import/resolver': {
      'node': {
        extensions: [
          '.js',
          '.ios.js',
          '.android.js',
          '.native.js',
          '.ts',
          '.tsx',
        ],
      },
      'babel-module': {
        alias: {},
      },
    },
  },
  globals: {
    __DEV__: true,
  },
  rules: {
    'no-console': 0,
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
    'jest/no-truthy-falsy': 0,
    'react/jsx-sort-props': [
      'error',
      {
        ignoreCase: false,
      },
    ],
    'react-native/no-inline-styles': 0,
    'import/named': 0,
    'import/no-named-as-default': 0,
    '@typescript-eslint/no-use-before-define': 0,
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: false,
        },
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: '../../../../**',
            group: 'parent',
            position: 'before',
          },
          {
            pattern: '../../../**',
            group: 'parent',
            position: 'before',
          },
          {
            pattern: '../../**',
            group: 'parent',
            position: 'before',
          },
        ],
      },
    ],
    'react/display-name': 2,
    'react/no-array-index-key': 0,
    'jest/no-test-prefixes': 0,
    'jest/no-disabled-tests': 0,
    'babel/no-unused-expressions': 'off',
  },
  env: { browser: true, node: true }, // browser needs to be true so it finds btoa and fetch polyfills
};
