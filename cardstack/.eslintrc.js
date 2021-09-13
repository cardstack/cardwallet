module.exports = {
  root: true,
  extends: ['plugin:echobind/react-native'],
  settings: {
    react: { version: '16' },
    'import/resolver': {
      node: {
        extensions: [
          '.js',
          '.ios.js',
          '.android.js',
          '.native.js',
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
  },
};
