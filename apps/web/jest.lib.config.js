const { defaults: tsjPreset } = require('ts-jest/presets')

module.exports = {
  preset: 'ts-jest',
  // roots: ['<rootDir>/lib'],
  setupFiles: ['<rootDir>/test/setup-tests.ts'],
  silent: false,
  testEnvironment: 'node',
  testPathPattern: ['<rootDir>/test/lib'],
  transform: {
    ...tsjPreset.transform,
    '\\.graphql$': [
      'graphql-let/jestTransformer',
      { subsequentTransformer: 'ts-jest' },
    ],
  },
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
  maxWorkers: 1,
}
