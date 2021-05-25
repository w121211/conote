module.exports = {
  // env: {
  // browser: true,
  // es6: true,
  // },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/@typescript-eslint',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
  },
  rules: {
    'prettier/prettier': 'error',
    semi: 'off',
    'no-unused-vars': 'off',
    'no-console': 'off',
    'no-await-in-loop': 'warn',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
  // "globals": {
  //     "Atomics": "readonly",
  //     "SharedArrayBuffer": "readonly"
  // },
  // "parser": "@typescript-eslint/parser",
  // "parserOptions": {
  //     "ecmaVersion": 2018,
  //     "sourceType": "module"
  // },
}
