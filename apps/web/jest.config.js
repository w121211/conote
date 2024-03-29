module.exports = {
  // roots: ['<rootDir>'],
  // moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
  // testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|.next)[/\\\\]'],
  // transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$'],
  // transform: {
  //   '^.+\\.(ts|tsx)$': 'babel-jest',
  //   '\\.graphql$': 'graphql-let/jestTransformer',
  // },
  // testEnvironment: 'jsdom',
  // watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  // moduleNameMapper: {
  //   '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  //   '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
  // },
  // setupFilesAfterEnv: ['<rootDir>/jestsetup.d.ts'],
  // testEnvironment: 'jest-environment-jsdom',
  // resetMocks: false,
  // setupFiles: ['jest-localstorage-mock'],

  roots: ['<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx'],
  testPathIgnorePatterns: ['<rootDir>[/\\\\](node_modules|.next)[/\\\\]'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
    '\\.graphql$': ['graphql-let/jestTransformer', { subsequentTransformer: 'babel-jest' }],
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
  },
  testEnvironment: 'jsdom',
}
