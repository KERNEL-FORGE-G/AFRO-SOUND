module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  globals: {
    React: 'readonly',
    ReactDOM: 'readonly',
    Chart: 'readonly',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'no-undef': 'off',
  },
};
