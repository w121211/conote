module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  plugins: ['@typescript-eslint', 'prettier', 'react', 'react-hooks'],
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    'no-await-in-loop': 'warn',
    'no-console': 'off',
    'import/prefer-default-export': 'off',
  },
}
