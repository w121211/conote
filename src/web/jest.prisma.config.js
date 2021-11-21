module.exports = {
  preset: 'ts-jest',
  // roots: ['<rootDir>'],
  roots: ['<rootDir>/test/lib'],
  setupFiles: ['<rootDir>/test/setup-tests.ts'],
  silent: false,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|.next|dist|.cache|prisma)[/\\\\]', '<rootDir>/components'],
}
