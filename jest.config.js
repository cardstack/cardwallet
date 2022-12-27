const testingLibraryPreset = require('@testing-library/react-native/jest-preset');
const expoPreset = require('jest-expo/jest-preset');

const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');

module.exports = {
  ...expoPreset,
  ...testingLibraryPreset,
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
  setupFilesAfterEnv: [
    '<rootDir>/cardstack/src/test-utils/jest-setup.js',
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  testMatch: [
    '<rootDir>/cardstack/**/*.test.ts',
    '<rootDir>/cardstack/**/*.test.js',
    '<rootDir>/cardstack/**/*.test.jsx',
    '<rootDir>/cardstack/**/*.test.tsx',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@sentry|@cardstack|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
  },
};
