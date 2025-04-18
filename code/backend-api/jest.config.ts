const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/test'], // Directories where Jest will look for test files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  collectCoverage: true, // Enable coverage reports
  collectCoverageFrom: [
    'src/**/*.{ts,js}', // Include all source files in coverage
    // '!src/main.ts', // Exclude specific files (like the entry point)
  ],
  coverageDirectory: 'coverage', // Directory where reports will be saved
  coverageReporters: ['lcov', 'text'], // Formats for the report
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};
