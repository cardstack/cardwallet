module.exports = {
  collectCoverageFrom: [
    '<rootDir>/cardstack/src/*/**/*.js',
    '<rootDir>/cardstack/src/*/**/*.ts',
    '<rootDir>/cardstack/src/*/**/*.tsx',
    '!<rootDir>/cardstack/src/*/**/*.story.tsx',
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
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  preset: 'react-native',
  testMatch: [
    '<rootDir>/cardstack/**/*.test.ts',
    '<rootDir>/cardstack/**/*.test.js',
    '<rootDir>/cardstack/**/*.test.jsx',
    '<rootDir>/cardstack/**/*.test.tsx',
  ],
};
