module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/lib/fetcher'],
  // modulePathIgnorePatterns: ['dist'],
  testPathIgnorePatterns: [
    '<rootDir>[/\\\\](node_modules|.next|dist)[/\\\\]',
    '<rootDir>/test',
    '<rootDir>/components',
  ],
}
