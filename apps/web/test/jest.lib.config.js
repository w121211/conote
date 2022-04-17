module.exports = {
  preset: 'ts-jest',
  // roots: ['<rootDir>'],
  roots: ['<rootDir>/lib'],
  setupFiles: ['<rootDir>/setup-tests.ts'],
  silent: false,
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '<rootDir>[/\\\\](node_modules|.next|dist|.cache|prisma)[/\\\\]',
    '<rootDir>[/\\\\](components|pages)[/\\\\]',
  ],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  maxWorkers: 1,
}
