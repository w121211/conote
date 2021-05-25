// const path = require('path')
module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>'],
  // testEnvironment: 'node',
  // testEnvironment: path.join(__dirname, 'prisma', 'prisma-test-environment.js'),
  testEnvironment: '<rootDir>/prisma/prisma-test-environment.js',
  testTimeout: 10000,
  // setupFilesAfterEnv: ['<rootDir>/setup-tests.ts'],
  testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|.next)[/\\\\]', '<rootDir>/test'],
<<<<<<< HEAD
=======
  silent: false,
>>>>>>> backend-dev
}
