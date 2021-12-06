const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  collectCoverageFrom: [
    '<rootDir>/cardstack/src/*/**/*.js',
    '<rootDir>/cardstack/src/*/**/*.ts',
    '<rootDir>/cardstack/src/*/**/*.tsx',
    '!<rootDir>/cardstack/src/*/**/*.story.tsx',
    '!<rootDir>/cardstack/src/theme/*',
    '!<rootDir>/cardstack/src/types/*',

    // ran into a weeeeird issue testing this so ignoring for now, will try to fix later
    '!<rootDir>/cardstack/src/components/Icon/Icon.tsx',
    '!<rootDir>/cardstack/src/components/Input/Input.tsx',
    '!<rootDir>/cardstack/src/components/Icon/custom-icons/*',
  ],
  coverageDirectory: '.coverage',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/cardstack/src/test-utils/jest-setup.js'],
  testMatch: [
    '<rootDir>/cardstack/**/*.test.ts',
    '<rootDir>/cardstack/**/*.test.js',
    '<rootDir>/cardstack/src/components/__tests__/BalanceCoinRow.test.tsx',
    '<rootDir>/cardstack/src/components/__tests__/Button.test.tsx',
    '<rootDir>/cardstack/src/components/__tests__/Container.test.tsx',
    '<rootDir>/cardstack/src/components/__tests__/OptionItem.test.tsx',
    '<rootDir>/cardstack/src/components/__tests__/SystemNotification.test.tsx',
    '<rootDir>/cardstack/src/components/Input/__tests__/InputAmount.test.tsx',
    // Avoid testing other components for now
    '!<rootDir>/cardstack/**/*.test.jsx',
    '!<rootDir>/cardstack/**/*.test.tsx',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|react-native|@react-native|@cardstack|@sentry/.*)',
  ],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths),
    '^.+.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
  },
};
