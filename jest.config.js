module.exports = {
  collectCoverageFrom: [
    '<rootDir>/src2/*/**/*.js',
    '<rootDir>/src2/*/**/*.ts',
    '<rootDir>/src2/*/**/*.tsx',
    '<rootDir>/src2/*/**/*.story.tsx',
  ],
  coverageDirectory: '.coverage',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  preset: '@testing-library/react-native',
  testMatch: [
    '<rootDir>/cardstack/test/**/*.test.ts',
    '<rootDir>/cardstack/test/**/*.test.tsx',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!react-native|react-router-native)/',
  ],
};
