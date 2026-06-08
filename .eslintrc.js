module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      files: ['**/__tests__/**', '*.test.js', '*.test.tsx', 'jest-setup.js'],
      env: {jest: true},
    },
  ],
};
