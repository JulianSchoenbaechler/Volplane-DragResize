module.exports = {
  root: true,

  env: {
    node: true,
    browser: true,
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-param-reassign': [2, { props: false }],
  },

  parserOptions: {
    parser: 'babel-eslint',
  },

  extends: [
    'plugin:vue/strongly-recommended',
    'plugin:vue/recommended',
    '@vue/airbnb'
  ]
};
