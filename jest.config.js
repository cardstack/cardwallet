const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  collectCoverageFrom: [
    '<rootDir>/cardstack/src/*/**/*.js',
    '<rootDir>/cardstack/src/*/**/*.ts',
    // Avoid testing components for now
    '!<rootDir>/cardstack/src/*/**/*.tsx',
    '!<rootDir>/cardstack/src/*/**/*.story.tsx',
    '!<rootDir>/cardstack/src/theme/*',

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
    '<rootDir>/cardstack/**/*.test.jsx',
    '<rootDir>/cardstack/**/*.test.tsx',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|react-native|react-redux|@react-native|@cardstack|@sentry/.*)',
  ],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths),
    '^.+.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub',
  },
};
