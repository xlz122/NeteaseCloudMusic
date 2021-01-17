module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // "@typescript-eslint/no-inferrable-types": "off", // 关闭类型推断
    '@typescript-eslint/no-explicit-any': 'off', // 关闭any类型时的警告
    '@typescript-eslint/no-use-before-define': [
      2,
      { functions: false, classes: true, variables: true }
    ], // 禁止在变量定义之前使用它们 variables(变量)
    quotes: [2, 'single'] // 开启强制单引号
  }
};
