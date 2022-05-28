module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    '<rootDir>[/\\\\](node_modules|.next|dist|.cache|prisma)[/\\\\]',
    '<rootDir>[/\\\\](components|pages)[/\\\\]',
  ],
  modulePathIgnorePatterns: ['dist'],
  silent: false,
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  maxWorkers: 1,
}
