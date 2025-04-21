/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['ts', 'js', 'json'],
    transform: {
      '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
    },
    testMatch: ['**/__tests__/**/*.test.ts'],
  };
  