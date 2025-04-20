// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // Adjust for your Next.js path aliases
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coveragePathIgnorePatterns: [
    '<rootDir>/common/hooks/useForm/', // Ignore useForm as it is outside the scope of this project
    '<rootDir>/common/context/', // Ignore context as it is mocked
    '<rootDir>/common/constants/', // Ignore constants as they are not tested
    '<rootDir>/modules/.*/services.ts', // Ignore all module services files as they are mocked
  ],
};

module.exports = createJestConfig(customJestConfig);
